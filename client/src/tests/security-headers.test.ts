import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const headers = readFileSync(resolve(process.cwd(), "client/public/_headers"), "utf8");
const documentShell = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

test("Cloudflare Pages responses use restrictive static-site security headers", () => {
  expect(headers).toContain("Content-Security-Policy:");
  expect(headers).toContain("default-src 'self'");
  expect(headers).toContain("form-action 'self' https://formspree.io");
  expect(headers).toContain("frame-ancestors 'none'");
  expect(headers).toContain("X-Frame-Options: DENY");
  expect(headers).toContain("X-Content-Type-Options: nosniff");
  expect(headers).toContain("Strict-Transport-Security:");
});

test("the document shell does not include analytics build placeholders", () => {
  expect(documentShell).not.toContain("VITE_ANALYTICS_ENDPOINT");
});
