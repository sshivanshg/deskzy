import { createHash, randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";

export type ApiKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

const KEY_PREFIX = "dz_";

export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Generate a new opaque key. Plaintext is returned once; only the hash is stored. */
export function generateApiKeySecret(): {
  plaintext: string;
  prefix: string;
  hash: string;
} {
  const secret = randomBytes(24).toString("base64url");
  const plaintext = `${KEY_PREFIX}${secret}`;
  return {
    plaintext,
    prefix: plaintext.slice(0, 11),
    hash: hashApiKey(plaintext),
  };
}

export async function listApiKeysForUser(userId: string): Promise<ApiKeyRow[]> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("api_keys")
    .select("id,name,key_prefix,created_at,last_used_at,revoked_at")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ApiKeyRow[]) ?? [];
}

export async function createApiKeyForUser(input: {
  userId: string;
  name?: string;
}): Promise<{ key: ApiKeyRow; plaintext: string }> {
  const admin = createServiceClient();
  const existing = await listApiKeysForUser(input.userId);
  if (existing.length >= 5) {
    throw new Error("Maximum of 5 API keys — revoke one to create another");
  }

  const { plaintext, prefix, hash } = generateApiKeySecret();
  const name = (input.name?.trim() || "Default").slice(0, 64);

  const { data, error } = await admin
    .from("api_keys")
    .insert({
      user_id: input.userId,
      name,
      key_prefix: prefix,
      key_hash: hash,
    })
    .select("id,name,key_prefix,created_at,last_used_at,revoked_at")
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to create key");
  return { key: data as ApiKeyRow, plaintext };
}

export async function revokeApiKeyForUser(input: {
  userId: string;
  keyId: string;
}): Promise<void> {
  const admin = createServiceClient();
  const { error } = await admin
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", input.keyId)
    .eq("user_id", input.userId)
    .is("revoked_at", null);
  if (error) throw new Error(error.message);
}

/**
 * Resolve a Bearer token to a paid user id, or null if invalid / free / revoked.
 * Touches last_used_at on success (best-effort).
 */
export async function resolveUserApiKey(
  token: string,
): Promise<{ userId: string; keyId: string } | null> {
  if (!token.startsWith(KEY_PREFIX)) return null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  const hash = hashApiKey(token);
  const admin = createServiceClient();
  const { data: key, error } = await admin
    .from("api_keys")
    .select("id,user_id,revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (error || !key || key.revoked_at) return null;

  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", key.user_id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!isPaidActive((sub as SubscriptionRow | null) ?? null)) return null;

  void admin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", key.id);

  return { userId: key.user_id as string, keyId: key.id as string };
}
