import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { looksLikeUrl, normalizeUrl } from "./normalize-url";
import {
  MAX_LIST_URLS_TECHNICAL,
  normalizeUrlBatch,
  parsePastedUrls,
  resolveCreateUrlTokens,
} from "./parse-pasted-urls";

describe("parsePastedUrls", () => {
  it("returns empty for blank input", () => {
    assert.deepEqual(parsePastedUrls(""), []);
    assert.deepEqual(parsePastedUrls("   \n\t  "), []);
  });

  it("splits on spaces and newlines", () => {
    const text =
      "https://a.example.com https://b.example.com\nhttps://c.example.com";
    assert.deepEqual(parsePastedUrls(text), [
      "https://a.example.com",
      "https://b.example.com",
      "https://c.example.com",
    ]);
  });

  it("accepts scheme-less hosts", () => {
    assert.deepEqual(parsePastedUrls("example.com google.com"), [
      "example.com",
      "google.com",
    ]);
  });

  it("skips non-url tokens", () => {
    assert.deepEqual(
      parsePastedUrls("hello https://ok.example.com world"),
      ["https://ok.example.com"],
    );
  });
});

describe("normalizeUrl", () => {
  it("normalizes single public https url", () => {
    assert.equal(normalizeUrl("example.com/path"), "https://example.com/path");
  });

  it("rejects private hosts", () => {
    assert.throws(() => normalizeUrl("http://127.0.0.1/x"), /not allowed/);
    assert.throws(() => normalizeUrl("http://192.168.1.1"), /not allowed/);
  });

  it("rejects empty", () => {
    assert.throws(() => normalizeUrl("  "), /url required/);
  });
});

describe("normalizeUrlBatch", () => {
  it("returns ok for a single valid url", () => {
    const batch = normalizeUrlBatch(["https://example.com"]);
    assert.equal(batch.ok, true);
    if (batch.ok) {
      assert.deepEqual(batch.urls, ["https://example.com/"]);
    }
  });

  it("returns ok for multiple valid urls", () => {
    const batch = normalizeUrlBatch([
      "https://a.example.com",
      "b.example.com/x",
    ]);
    assert.equal(batch.ok, true);
    if (batch.ok) {
      assert.equal(batch.urls.length, 2);
      assert.equal(batch.urls[0], "https://a.example.com/");
      assert.equal(batch.urls[1], "https://b.example.com/x");
    }
  });

  it("reports N of M when some are invalid", () => {
    const batch = normalizeUrlBatch([
      "https://ok.example.com",
      "not a url",
      "http://127.0.0.1",
    ]);
    assert.equal(batch.ok, false);
    if (!batch.ok) {
      assert.match(batch.error, /2 of 3 links invalid/);
      assert.equal(batch.invalidCount, 2);
      assert.equal(batch.total, 3);
    }
  });

  it("rejects empty batch", () => {
    const batch = normalizeUrlBatch([]);
    assert.equal(batch.ok, false);
    if (!batch.ok) assert.match(batch.error, /url required/);
  });

  it("rejects absurd technical count", () => {
    const raw = Array.from(
      { length: MAX_LIST_URLS_TECHNICAL + 1 },
      (_, i) => `https://x${i}.example.com`,
    );
    const batch = normalizeUrlBatch(raw);
    assert.equal(batch.ok, false);
    if (!batch.ok) assert.match(batch.error, /too many urls/);
  });
});

describe("looksLikeUrl", () => {
  it("detects common shapes", () => {
    assert.equal(looksLikeUrl("https://deskzy.xyz"), true);
    assert.equal(looksLikeUrl("deskzy.xyz/r/abc"), true);
    assert.equal(looksLikeUrl("nope"), false);
  });
});

describe("resolveCreateUrlTokens", () => {
  it("prefers urls array", () => {
    assert.deepEqual(
      resolveCreateUrlTokens({
        url: "https://ignored.example.com",
        urls: ["https://a.example.com", "https://b.example.com"],
      }),
      ["https://a.example.com", "https://b.example.com"],
    );
  });

  it("parses whitespace-separated url string as multi", () => {
    assert.deepEqual(
      resolveCreateUrlTokens({
        url: "https://a.example.com https://b.example.com",
      }),
      ["https://a.example.com", "https://b.example.com"],
    );
  });

  it("keeps a single url string", () => {
    assert.deepEqual(resolveCreateUrlTokens({ url: "https://only.example.com" }), [
      "https://only.example.com",
    ]);
  });

  it("returns empty when nothing provided", () => {
    assert.deepEqual(resolveCreateUrlTokens({}), []);
  });
});
