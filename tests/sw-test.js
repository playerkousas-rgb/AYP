/* Unit tests for the offline worker: isolated caches and response types. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const handlers = {};
const origin = "https://guide.example";
const scope = `${origin}/guide/`;
let online = true;
let networkStatus = 200;
const store = new Map();
let claimed = false;
let skipped = false;
const deleted = [];

function absolute(input) {
  return new URL(typeof input === "string" ? input : input.url, scope).href;
}
function cacheFor(name) {
  if (!store.has(name)) store.set(name, new Map());
  const entries = store.get(name);
  return {
    async addAll(assets) {
      for (const asset of assets) entries.set(absolute(asset), new Response(`cached:${asset}`));
    },
    async match(input, options = {}) {
      const requestUrl = new URL(absolute(input));
      if (options.ignoreSearch) requestUrl.search = "";
      const response = entries.get(requestUrl.href);
      return response ? response.clone() : undefined;
    }
  };
}
const caches = {
  async open(name) { return cacheFor(name); },
  async keys() { return [...store.keys()]; },
  async delete(name) { deleted.push(name); return store.delete(name); }
};
const self = {
  registration: { scope },
  clients: { async claim() { claimed = true; } },
  async skipWaiting() { skipped = true; },
  addEventListener(name, listener) { handlers[name] = listener; }
};
const networkFetch = async () => {
  if (!online) throw new Error("network offline");
  return new Response("network", { status: networkStatus });
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8"), {
  self, caches, location: { origin }, URL, Response, fetch: networkFetch
});

async function lifecycle(type) {
  let pending;
  handlers[type]({ waitUntil(promise) { pending = promise; } });
  await pending;
}
async function request(url, options = {}) {
  let promise;
  handlers.fetch({
    request: { method: options.method || "GET", mode: options.mode || "cors", url },
    respondWith(value) { promise = value; }
  });
  return promise ? await promise : undefined;
}

(async () => {
  store.set("other-application-cache", new Map());
  store.set("ayp-guide-v11", new Map());
  await lifecycle("install");
  assert.ok(skipped, "new worker activates");
  assert.ok(store.get("ayp-guide-v12").has(`${scope}index.html`), "app shell is precached");
  await lifecycle("activate");
  assert.ok(claimed);
  assert.deepEqual(deleted, ["ayp-guide-v11"], "only old AYP caches are deleted");
  assert.ok(store.has("other-application-cache"), "other apps' caches are preserved");

  let response = await request(scope, { mode: "navigate" });
  assert.equal(await response.text(), "network", "online navigation uses fresh HTML");
  response = await request(`${scope}app.js?version=1`);
  assert.equal(await response.text(), "cached:./app.js", "core assets use the app cache");
  response = await request(`${scope}app.js?v=12`);
  assert.equal(await response.text(), "cached:./app.js", "current version uses the shell cache");
  response = await request(`${scope}app.js?v=13`);
  assert.equal(await response.text(), "network", "newer version bypasses an older worker cache");
  response = await request(`${scope}unexpected.json`);
  assert.equal(await response.text(), "network", "other requests are not cached");
  networkStatus = 404;
  response = await request(`${scope}missing.json`);
  assert.equal(response.status, 404, "network errors are not replaced by app HTML");
  networkStatus = 200;
  assert.equal(await request("https://different.example/file.js"), undefined, "cross-origin requests bypass the worker");
  assert.equal(await request(`${scope}app.js`, { method: "POST" }), undefined, "non-GET requests bypass the worker");

  online = false;
  response = await request(`${scope}?from=bookmark`, { mode: "navigate" });
  assert.equal(await response.text(), "cached:./index.html", "offline navigation gets the shell");
  response = await request(`${scope}app.js?v=13`);
  assert.equal(response.status, 503, "a newer script never falls back to a mismatched old version");
  response = await request(`${scope}unknown.js`);
  assert.equal(response.status, 503, "offline assets receive a non-HTML failure");
  assert.match(response.headers.get("content-type"), /^text\/plain/);
  store.get("ayp-guide-v12").delete(`${scope}index.html`);
  response = await request(scope, { mode: "navigate" });
  assert.equal(response.status, 503, "missing offline shell gets a clear failure");
  console.log("Service worker：16 checks passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
