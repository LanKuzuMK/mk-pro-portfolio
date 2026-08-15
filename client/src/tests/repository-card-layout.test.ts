import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

test("repository action controls preserve complete labels at narrow card widths", () => {
  expect(stylesheet).toContain(".repository-card-actions { align-items:stretch; flex-wrap:wrap; }");
  expect(stylesheet).toContain("min-inline-size:max-content; white-space:nowrap;");
  expect(stylesheet).toContain("@media (max-width:420px) { .repository-card-actions button,.repository-card-actions a { flex-basis:100%; } }");
});
