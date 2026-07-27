/** Minimal Cloudflare Env types for Deskzy. Run `npm run cf-typegen -w @deskzy/web` for full runtime types. */

interface DeskzyKvNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface CloudflareEnv {
  LINKS: DeskzyKvNamespace;
  ASSETS: unknown;
  WORKER_SELF_REFERENCE: unknown;
  NEXTJS_ENV?: string;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends CloudflareEnv {}
}
