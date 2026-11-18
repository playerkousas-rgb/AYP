/* Store-gate simulation: direct, APP STORE, library, standalone PWA and SG18 link. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const gate = require("../store_gate_v1.0.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const options = {
  appKey: "ayp",
  mode: "entry-gate",
  portalIds: ["appstore"],
  silentPortalIds: ["library"],
  allowStandalone: true,
  autoRedirectSeconds: 0,
};
const origin = "https://ayp-eight.vercel.app";

function page(referrer = "") {
  const domOptions = { runScripts: "outside-only", pretendToBeVisual: true, url: `${origin}/` };
  if (referrer) domOptions.referrer = referrer;
  return new JSDOM(html, domOptions);
}

const direct = gate.evaluateStoreGate(options, {
  selfOrigin: origin,
  referrer: "",
  standalone: false,
  hasSessionPass: false,
});
assert.equal(direct.allowed, false, "direct URL is gated");
assert.equal(direct.reason, "missing-whitelist-entry");

const appStore = gate.evaluateStoreGate(options, {
  selfOrigin: origin,
  referrer: "https://scoutappstore.vercel.app/",
  standalone: false,
  hasSessionPass: false,
});
assert.equal(appStore.allowed, true, "APP STORE entry is allowed");
assert.equal(appStore.matchedPortalId, "appstore");

const library = gate.evaluateStoreGate(options, {
  selfOrigin: origin,
  referrer: "https://scout-circulars.vercel.app/notice",
  standalone: false,
  hasSessionPass: false,
});
assert.equal(library.allowed, true, "library entry is silently allowed");
assert.equal(library.matchedPortalId, "library");

const standalone = gate.evaluateStoreGate(options, {
  selfOrigin: origin,
  referrer: "",
  standalone: true,
  hasSessionPass: false,
});
assert.equal(standalone.allowed, true, "installed standalone PWA remains allowed");
assert.equal(standalone.reason, "standalone-pwa");

const portals = gate.normalizePortals(options);
assert.deepEqual(portals.map((portal) => [portal.id, portal.silent]), [
  ["appstore", false],
  ["library", true],
]);
assert.equal(portals.filter((portal) => !portal.silent).length, 1, "only APP STORE renders as a button");
assert.equal(gate.getAppStoreUrl("ayp"), "https://scoutappstore.vercel.app/?app=ayp");

const blockedDom = page();
const blockedDomDecision = gate.initStoreGate(options, blockedDom.window);
assert.equal(blockedDomDecision.reason, "missing-whitelist-entry");
assert.equal(blockedDom.window.document.documentElement.getAttribute("data-store-gated"), "missing-whitelist-entry");
const gateCard = blockedDom.window.document.querySelector("#scoutStoreGate");
assert.ok(gateCard, "direct URL shows a visible explanation card instead of a blank page");
const buttons = gateCard.querySelectorAll(".sg-actions a");
assert.equal(buttons.length, 1, "gate card has only one CTA");
assert.equal(buttons[0].textContent, "前往 APP STORE");
assert.equal(buttons[0].target, "_top");
assert.equal(buttons[0].href, "https://scoutappstore.vercel.app/");
assert.equal(blockedDom.window.getComputedStyle(blockedDom.window.document.querySelector("header")).display, "none",
  "the underlying app (including the SG18 button) is hidden while the gate card is shown");
blockedDom.window.close();

const allowedDom = page("https://scoutappstore.vercel.app/");
const allowedDomDecision = gate.initStoreGate(options, allowedDom.window);
assert.equal(allowedDomDecision.allowed, true, "APP STORE navigation has no gate card");
assert.equal(allowedDom.window.document.querySelector("#scoutStoreGate"), null);
allowedDom.window.close();

console.log("Store gate: direct / APP STORE / library / standalone / single-CTA / SG18 URL checks passed");
