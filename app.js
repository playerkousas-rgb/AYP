/* ===========================================================
   AYP 童軍接駁指南 / AYP Scout Bridging Guide — 主程式（雙語 · 情況主導版）
   =========================================================== */
"use strict";
(function () {
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const OPEN_KEY = "ayp-guide-open-v2";
  const LANG_KEY = "ayp-guide-lang-v1";
  const VISIT_KEY = "ayp-guide-visited-v1";
  const FIRST_VISIT_KEY = "ayp-guide-first-visit-v1";

  // Storage can be blocked (private mode, quota, embedded browsers). Keep an
  // in-memory fallback and tell the user when persistence is unavailable.
  const memoryStore = Object.create(null);
  let storageAvailable = true;
  function updateStorageWarning() {
    const el = document.getElementById("storage-warning");
    if (!el) return;
    el.hidden = storageAvailable;
    el.textContent = LANG === "en"
      ? "Browser storage is unavailable. Changes last only while this page is open."
      : "瀏覽器儲存功能不可用；更改只會保留至此頁關閉。";
  }
  function storeRead(key) {
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) return memoryStore[key];
    try { return localStorage.getItem(key); }
    catch (e) { storageAvailable = false; return null; }
  }
  function storeWrite(key, value) {
    memoryStore[key] = value;
    try { localStorage.setItem(key, value); }
    catch (e) { storageAvailable = false; updateStorageWarning(); }
  }
  function storeRemove(key) {
    memoryStore[key] = null;
    try { localStorage.removeItem(key); return true; }
    catch (e) { storageAvailable = false; updateStorageWarning(); return false; }
  }
  function loadOpen() { return loadJson(OPEN_KEY, {}); }
  function saveOpen(o) { saveJson(OPEN_KEY, o); }
  function scrollBehavior() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }
  function smoothTo(el, block) { if (!el) return; try { if (typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: scrollBehavior(), block: block || "start" }); } catch (e) {} }
  function smoothTop() { try { if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: scrollBehavior() }); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  const ICON_PATHS = {
    quick: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7z"/>',
    f1: '<path d="M4 12h15m-5-5 5 5-5 5"/><path d="M5 5v14"/>',
    f2: '<path d="M10 13.5 14 9.5M8.5 16.5l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M15.5 7.5l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0"/>',
    f3: '<path d="M4 19h5v-5h5V9h5V4M15 4h4v4"/>',
    f5: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    "bt-sync": '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="m8 9 1.5 1.5L12 8m2 2h2m-8 5h8"/>',
    "bt-conv": '<path d="M4 8h13m-3-3 3 3-3 3M20 16H7m3-3-3 3 3 3"/>',
    "bt-forms": '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
    "bt-oa": '<path d="M4 21h16M6 21V7l6-3 6 3v14M10 10h1m2 0h1m-4 4h1m2 0h1M11 21v-4h2v4"/>',
    "bt-faq": '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.8 2c-1 .6-1.5 1.1-1.5 2.2M12 16.5h.01"/>',
    scout: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7z"/>',
    venture: '<path d="M3 19 9 7l3 6 2-4 7 10z"/>',
    rover: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    leader: '<circle cx="12" cy="8" r="3"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>',
    young: '<path d="M12 20v-8M12 14C6 14 5 10 5 7c4 0 7 2 7 7Zm0 1c0-5 3-7 7-7 0 4-2 7-7 7Z"/>',
    unsure: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.8 2c-1 .6-1.5 1.1-1.5 2.2M12 16.5h.01"/>',
    fresh: '<path d="M12 20v-8M12 14C6 14 5 10 5 7c4 0 7 2 7 7Zm0 1c0-5 3-7 7-7 0 4-2 7-7 7Z"/>',
    doing: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
    done: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    overseas: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    messy: '<path d="M3 7h7l2 2h9v10H3z"/>',
    sync: '<circle cx="12" cy="9" r="6"/><path d="m8 14-1 7 5-2 5 2-1-7"/>'
  };
  function iconFor(key) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[key] || ICON_PATHS.f5}</svg>`;
  }

  /* ═══════════ 語言 / Language ═══════════ */
  function detectDefaultLang() {
    const saved = storeRead(LANG_KEY);
    return saved && LOCALES[saved] ? saved : "zh-HK";
  }
  let LANG = detectDefaultLang();
  function L() { return LOCALES[LANG]; }
  function UI() { return LOCALES[LANG].UI; }
  function setLang(lang) {
    if (!LOCALES[lang] || lang === LANG) return;
    LANG = lang;
    storeWrite(LANG_KEY, lang);
    document.documentElement.lang = L().htmlLang;
    renderAll();
    focusControl("#fab-lang");
  }

  // 建立一個 <details class="part"> 開合卡
  function part(key, summaryHtml, bodyHtml, defaultOpen) {
    const state = loadOpen();
    if (state[key] === undefined) state[key] = !!defaultOpen;
    return `<details class="part" data-key="${esc(key)}" ${state[key] ? "open" : ""}>
      <summary>${summaryHtml}<span class="chev">▾</span></summary>
      <div class="part-body">${bodyHtml}</div></details>`;
  }

  // 還原靜態 <details class="part"> 嘅已儲存開合狀態（f4-1／res-tl／ti-1 等）
  function applyStaticOpenState() {
    const state = loadOpen();
    $$("details.part").forEach(d => {
      const k = d.dataset.key;
      if (k && state[k] !== undefined) d.open = !!state[k];
    });
  }

  // Capture also handles cards rendered later; always merge the latest state.
  let togglesBound = false;
  function bindPartToggles() {
    if (togglesBound) return;
    togglesBound = true;
    document.addEventListener("toggle", event => {
      const d = event.target;
      if (!d.isConnected || !d.matches("details.part[data-key]")) return;
      const state = loadOpen();
      state[d.dataset.key] = d.open;
      saveOpen(state);
    }, true);
  }
  function focusControl(selector) {
    const el = $(selector);
    if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
  }

  /* ═══════════ 靜態文字 ═══════════ */
  function renderStaticText() {
    const t = UI(); const app = L().APP;
    document.documentElement.lang = L().htmlLang;
    document.title = app.name;
    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const setHtml = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };

    setText("app-title", app.name);
    setText("app-tag", app.tagline);
    setText("home-nav", LANG === "en" ? "Overview" : "總覽");
    setText("skip-link", LANG === "en" ? "Skip to content" : "跳至主要內容");
    setText("header-note", LANG === "en" ? "Unofficial companion guide" : "非官方輔助指南");
    setText("overview-title", LANG === "en" ? "From getting started to moving forward." : "由起步到銜接，陪你一步一步走。");
    setText("overview-plan-title", LANG === "en" ? "Your starting checklist" : "起步行動清單");
    setText("overview-plan-description", LANG === "en" ? "Start with the basics and work at your own pace." : "從基本步驟開始，按自己的節奏跟進。");
    setText("quick-note", LANG === "en" ? "For reference · Check official guidance" : "參考指引 · 以官方資料為準");
    setText("global-reference", LANG === "en" ? "Unofficial guide. Check the latest rules and arrangements: " : "非官方指南；請核實最新規條及安排：");
    setText("global-source", LANG === "en" ? "Official AYP resources" : "AYP 官方資料");
    setText("quick-description", LANG === "en"
      ? "Choose your Scout role and AYP situation for a practical next-step checklist."
      : "揀選你嘅童軍身份同 AYP 情況，整理適合你嘅下一步。 ");
    setText("privacy-title", LANG === "en" ? "Your data on this device" : "你在此裝置的資料");
    setText("privacy-note", LANG === "en"
      ? "Your checklists, dates and assessor details are stored in this browser, not synced to AYP. Clearing browser data removes them. Avoid personal information on shared devices. If enabled by the host, Vercel Web Analytics may collect visit statistics."
      : "待辦、日期及考驗人員資料儲存在此瀏覽器，並不會同步至 AYP。清除瀏覽資料後便會消失；公用裝置請避免輸入個人資料。部署環境如有啟用 Vercel Web Analytics，可能收集瀏覽統計。");
    setText("privacy-clear", LANG === "en" ? "Clear saved guide data" : "清除此裝置的指南資料");
    updateStorageWarning();
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", app.description);

    setHtml("hero-lead", t.heroLead);
    setHtml("mini1", t.mini1); setHtml("mini2", t.mini2); setHtml("mini3", t.mini3);

    setText("quick-title", t.quickTitle);
    setText("beginner-title", t.beginnerTitle);
    setText("beginner-sub", t.beginnerSub);
    setHtml("beginner-tldr", `<span class="tldr-tag">${esc(t.tldrTag)}</span> ${esc(t.beginnerIntro)}`);

    setText("f1-title", t.f1Title); setText("f1-tag", t.f1Tag);
    setText("f1-hint", t.f1Hint);
    setText("ti1-summary", t.ti1Summary); setText("ti2-summary", t.ti2Summary);

    setText("f2-title", t.f2Title); setText("f2-tag", t.f2Tag);
    setText("c2a-summary", t.c2aSummary); setText("c2b-summary", t.c2bSummary);

    // 🚫 不可追溯（No Backdating）警告 — 轉入／銜接頁頂部常駐
    const bd1 = document.getElementById("f1-backdate"); if (bd1) bd1.innerHTML = t.backdateWarn;
    const bd2 = document.getElementById("f2-backdate"); if (bd2) bd2.innerHTML = t.backdateWarn;

    setText("f3-title", t.f3Title); setText("f3-tag", t.f3Tag);
    setText("f31-summary", t.f31Summary);
    setText("f3-warn", "⚠️ " + t.f3Warn);

    setText("f4-title", t.f4Title); setText("f4-tag", t.f4Tag);
    setText("f41-summary", t.f41Summary);

    setText("f5-title", t.f5Title); setText("f5-tag", t.f5Tag);
    setText("f5-sub", t.f5Sub);

    setText("res-tl-summary", t.resTlSummary);
    setText("res-gl-summary", t.resGlSummary);
    setText("res-faq-summary", t.resFaqSummary);
    setText("bt-faq-summary", t.faqViewTitle);

    setText("comp-title", t.compTitle);
    setText("comp-summary", t.compSummary);

    setText("sources-title", t.sourcesTitle);

    setText("bt-sync-summary", L().SYNC_PLAN.title);
    setText("bt-conv-summary", L().CONVERSION_TABLE.title);
    setText("bt-forms-summary", LANG === "en" ? "Forms & comment drafts" : "表格及評語草稿");
    setText("bt-oa-summary", L().OA_LOOKUP.title);
    $$(".tv-back-label").forEach(el => { el.textContent = t.backHome; });

    const bottombar = $("#bottombar"); if (bottombar) bottombar.setAttribute("aria-label", t.quickNavAria);
    const topbar = $("#topbar"); if (topbar) topbar.setAttribute("aria-label", t.topBarAria);

    const fabT = $("#fab-top"); if (fabT) fabT.setAttribute("aria-label", t.fabTopAria);
    const langBtn = $("#fab-lang");
    if (langBtn) { langBtn.setAttribute("aria-label", t.langToggleAria); langBtn.textContent = L().switchToLabel; }

    const b = $("#baseline-foot"); if (b) b.textContent = app.baseline;
    const cbApp = $("#copyright-app-line"); if (cbApp) cbApp.textContent = app.name;
    const cbBaseline = $("#copyright-baseline"); if (cbBaseline) cbBaseline.textContent = app.baseline;
  }

  /* ════════════════════════════════════════════
     功能 1：由其他執行處轉入童軍（互動決策）
     ════════════════════════════════════════════ */
  let inLevel = "bronze", inDone = { service: false, skill: false, physical: false, expedition: false, residential: false };
  function renderTransferIn() {
    const step = $("#ti-inner"); if (!step) return;
    const LV = L().LEVELS, SEC = L().LEVEL_SECTIONS, FS = L().FIVE_SECTIONS, t = UI();
    const lv = LV[inLevel];
    const must = SEC[inLevel];
    const missing = must.filter(k => !inDone[k]);
    const secName = k => FS[k].name;
    step.innerHTML = `
      <div class="ti">
        <div class="warn backdate">${t.backdateWarn}</div>
        <div class="ti-tools">
          <div class="ti-lev">
            <b>${esc(t.pickLevel)}</b>
            <div class="chips">${Object.keys(LV).map(k =>
              `<button class="chip ${k === inLevel ? "active" : ""}" data-lv="${k}" aria-pressed="${k === inLevel}" style="--c:${LV[k].color}">${LV[k].icon} ${esc(LV[k].name)}</button>`).join("")}</div>
          </div>
          <div class="ti-done">
            <b>${esc(t.tickDone)}</b>
            <div class="chips">${must.map(k =>
              `<button class="chip tick ${inDone[k] ? "active" : ""}" data-sec="${k}" aria-pressed="${!!inDone[k]}" style="--c:#0a5c36">${FS[k].icon} ${esc(secName(k))}${inDone[k] ? " ✓" : ""}</button>`).join("")}</div>
            <p class="hint">${esc(t.tickHint)}</p>
          </div>
        </div>
        <div class="ti-result">
          <div class="ri-head" style="--c:${lv.color}">${lv.icon} ${esc(lv.name)}${esc(t.resultHeadSuffix)}</div>
          ${missing.length === 0
            ? `<div class="ok-box">${t.allDone(lv.name)}</div>`
            : missing.map(k => {
                const s = FS[k];
                return `<div class="gap">
                  <div class="gap-sec"><span class="sec-ico">${s.icon}</span><b>${esc(s.name)}</b></div>
                  <p class="gap-scout">${esc(t.howToFill)} ${esc(s.scout)}</p>
                </div>`;
              }).join("")}
          <div class="warn">⚠️ ${esc(L().TRANSFER_IN.caveat)}</div>
        </div>
      </div>`;

    $$("[data-lv]", step).forEach(b => b.addEventListener("click", () => {
      inLevel = b.dataset.lv; renderTransferIn(); focusControl(`[data-lv="${inLevel}"]`);
    }));
    $$("[data-sec]", step).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.sec; inDone[k] = !inDone[k]; renderTransferIn(); focusControl(`[data-sec="${k}"]`);
    }));
  }

  function renderTransferInSteps() {
    const c = $("#ti-steps"); if (!c) return;
    const TI = L().TRANSFER_IN;
    c.innerHTML = `<ol class="steps">${TI.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="warn">${esc(TI.caveat)}</div>`;
  }

  /* ════════════════════════════════════════════
     功能 2：銜接（同步完成／認可）
     ════════════════════════════════════════════ */
  function renderConvertSync() {
    const c = $("#convert-sync"); if (!c) return;
    const SC = L().SYNC_CONVERT, LV = L().LEVELS, t = UI();
    c.innerHTML = `<p class="lead">${esc(SC.intro)}</p>
      ${SC.stages.map((s) => {
        const lvC = LV[s.toAypLv].color;
        return `<div class="sync-stage">
          <div class="sync-row">
            <div class="sync-box from"><small>${esc(t.scoutBadgeLabel)}</small><b>${esc(s.scoutBadge)}</b><span class="src">${esc(s.scoutInfo)}</span></div>
            <div class="sync-arrow-c">${esc(t.syncArrow)}</div>
            <div class="sync-box to" style="--c:${lvC}"><small>${esc(t.aypLabel)}</small><b>${esc(s.toAyp)}</b><span class="src">${esc(s.note)}</span></div>
          </div>
        </div>`;
      }).join("")}
      <div class="warn">⚠️ ${esc(SC.caveat)}</div>
      <div class="plan-actions"><button class="btn primary" data-go-view="bt-sync">🔗 ${LANG === "en" ? "Open 2026 Sync Interactive Checklist & EA Logger →" : "打開 2026「同步完成方案」互動對接核對器 →"}</button></div>`;
    $$("[data-go-view]", c).forEach(b => b.addEventListener("click", () => showView(b.dataset.goView)));
  }
  function renderConvertMap() {
    const c = $("#convert-map"); if (!c) return;
    const SM = L().SECTION_MAP, t = UI();
    c.innerHTML = `<p>${esc(SM.header)}</p>
      <table class="map"><tbody>
        ${SM.rows.map(r => `<tr>
          <td class="ayp"><b>${esc(r.ayp)}</b><small>${esc(t.applicableLabel)}${esc(r.lv)}</small></td>
          <td class="sc">${esc(r.scout)}</td></tr>`).join("")}
      </tbody></table>
      <div class="warn">⚠️ ${esc(SM.caveat)}</div>
      <div class="plan-actions"><button class="btn primary" data-go-view="bt-conv">🔍 ${LANG === "en" ? "Open Interactive Badge ↔ 5 Sections Search Matcher →" : "打開「跨支部徽章 ↔ 五科即時搜尋配對器」→"}</button></div>`;
    $$("[data-go-view]", c).forEach(b => b.addEventListener("click", () => showView(b.dataset.goView)));
  }

  /* ════════════════════════════════════════════
     功能 3：升團接駁（按支部）
     ════════════════════════════════════════════ */
  function renderSectionPaths() {
    const c = $("#paths"); if (!c) return;
    const SP = L().SECTION_PATHS, t = UI();
    const order = ["scout", "venture", "rover"];
    c.innerHTML = `<div class="path-flow">` + order.map((k) => {
      const p = SP[k];
      const flow = k === "rover" ? "" : `<div class="flow-arrow">${esc(t.upgradeArrow)}</div>`;
      return `<div class="path-node" style="--c:${p.color}">
        <div class="pn-head" style="border-color:${p.color}">
          <b style="color:${p.color}">${esc(p.name)}</b><small>${esc(p.age)}</small></div>
        <div class="pn-body">
          <div class="row"><span class="lbl">${esc(t.canTakeLabel)}</span><p>${esc(p.aypStart)}</p></div>
          <div class="row"><span class="lbl">${esc(t.syncMapLabel)}</span><p>${esc(p.sync)}</p></div>
          <div class="row next"><span class="lbl">${esc(t.afterUpgradeLabel)}</span><p>${esc(p.toNext)}</p></div>
        </div></div>${flow}`;
    }).join("") + `</div>`;
  }

  /* ════════════════════════════════════════════
     功能 4：正常開始 AYP 流程
     ════════════════════════════════════════════ */
  function renderJoinFlow() {
    const c = $("#join-flow"); if (!c) return;
    const JF = L().JOIN_FLOW, SP = L().SECTION_PATHS, t = UI();
    c.innerHTML = `<ol class="steps">${JF.commonSteps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="tip">💡 ${esc(JF.note)}</div>
      <p><b>${esc(t.whichSectionCanDo)}</b></p>
      ${Object.keys(SP).map(k => {
        const p = SP[k];
        return `<div class="joinrow"><b style="color:${p.color}">${esc(p.name)}</b><p>${esc(p.aypStart)}</p></div>`;
      }).join("")}`;
  }

  /* ════════════════════════════════════════════
     功能 5：其他情況
     ════════════════════════════════════════════ */
  function renderExtras(listSel, cases) {
    const c = $(listSel); if (!c) return;
    c.innerHTML = cases.map(x => part("x-" + x.id,
      `<span class="ico">${x.icon}</span><span class="sum-text"><b>${esc(x.title)}</b><small>${esc(x.q)}</small></span>`,
      `<p>${esc(x.body)}</p>${x.caveat ? `<div class="warn">${esc(x.caveat)}</div>` : ""}`)
    ).join("");
  }

  /* ════════════════════════════════════════════
     ⚡ 5 分鐘精靈：身份 × 情況 → 行動卡
     ════════════════════════════════════════════ */
  let wzRole = null, wzStatus = null;
  const TODO_KEY = "ayp-guide-todo-v1";
  function loadTodo() { return loadJson(TODO_KEY, {}); }
  function saveTodo(o) { saveJson(TODO_KEY, o); }

  function renderWizard() {
    const c = $("#wizard"); if (!c) return;
    const W = L().WIZARD, t = UI();
    const stepDone = (wzRole ? 1 : 0) + (wzStatus ? 1 : 0);
    c.innerHTML = `
      <div class="wz-progress"><div class="wz-bar" style="width:${stepDone / 2 * 100}%"></div></div>
      <p class="wz-step-label">${stepDone === 2 ? esc(t.wizDone) : esc(t.wizStep(wzRole ? 2 : 1, !wzRole ? t.wizQ1 : t.wizQ2))}</p>
      <div class="wz-group">
        <b>${esc(t.wizRoleHeading)}</b>
        <div class="wz-grid">${W.roles.map(r =>
          `<button class="wz-opt ${wzRole === r.id ? "active" : ""}" data-wz-role="${r.id}" aria-pressed="${wzRole === r.id}">
            <span class="wz-ico">${iconFor(r.id)}</span><span class="wz-t">${esc(r.label)}</span><small>${esc(r.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div class="wz-group">
        <b>${esc(t.wizStatusHeading)}</b>
        <div class="wz-grid">${W.statuses.map(s =>
          `<button class="wz-opt ${wzStatus === s.id ? "active" : ""}" data-wz-status="${s.id}" aria-pressed="${wzStatus === s.id}">
            <span class="wz-ico">${iconFor(s.id)}</span><span class="wz-t">${esc(s.label)}</span><small>${esc(s.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div id="wz-result">${wzRole && wzStatus ? wizardResultHtml() : `<div class="wz-empty">${esc(t.wizEmpty)}</div>`}</div>`;

    $$("[data-wz-role]", c).forEach(b => b.addEventListener("click", () => {
      wzRole = b.dataset.wzRole; renderWizard();
      focusControl(`[data-wz-role="${wzRole}"]`);
      if (wzStatus) smoothTo($("#wz-result"), "nearest");
    }));
    $$("[data-wz-status]", c).forEach(b => b.addEventListener("click", () => {
      wzStatus = b.dataset.wzStatus; renderWizard();
      focusControl(`[data-wz-status="${wzStatus}"]`);
      if (wzRole) smoothTo($("#wz-result"), "nearest");
    }));
    bindTodo(c);
    const reset = $("#wz-reset", c);
    if (reset) reset.addEventListener("click", () => { wzRole = null; wzStatus = null; renderWizard(); focusControl("#wizard [data-wz-role]"); });
  }

  function wizardResultHtml() {
    const P = L().PLANS, W = L().WIZARD, t = UI();
    const p = P[wzStatus]; if (!p) return "";
    const todo = loadTodo();
    const key = "wz-" + wzStatus;
    const checked = todo[key] || [];
    const doneCount = p.steps.filter((_, i) => checked[i]).length;
    return `<div class="plan-card">
      <div class="plan-head"><span class="plan-ico">${iconFor("quick")}</span>
        <div><b>${esc(p.pos)}</b><div class="plan-route">${esc(t.routeLabel)}${esc(p.route)}</div></div></div>
      ${wzRole && W.roleNote[wzRole] ? `<div class="tip">${esc(W.roleNote[wzRole])}</div>` : ""}
      <div class="plan-progress">${esc(t.progressLabel(doneCount, p.steps.length))}</div>
      <ol class="todo">${p.steps.map((s, i) => `
        <li class="${checked[i] ? "done" : ""}"><label>
          <input type="checkbox" data-todo="${key}:${i}" ${checked[i] ? "checked" : ""}>
          <span class="todo-n">${i + 1}</span><span>${esc(s)}</span>
        </label></li>`).join("")}</ol>
      <div class="plan-meta">
        <div><small>${esc(t.whoLabel)}</small><b>${esc(p.who)}</b></div>
        <div><small>${esc(t.formsLabel)}</small><b>${esc(p.forms)}</b></div>
        <div><small>${esc(t.timeLabel)}</small><b>${esc(p.time)}</b></div>
      </div>
      <div class="warn">⚠️ ${esc(p.warn)}</div>
      <div class="plan-actions">
        <a class="btn primary" href="${esc(p.link)}">${esc(p.linkLabel)} →</a>
        <button class="btn ghost" id="wz-reset">${esc(t.resetBtn)}</button>
      </div>
    </div>`;
  }

  function bindTodo(root) {
    $$("[data-todo]", root).forEach(box => box.addEventListener("change", () => {
      const [key, idx] = box.dataset.todo.split(":");
      const todo = loadTodo();
      if (!Array.isArray(todo[key])) todo[key] = [];
      todo[key][+idx] = box.checked;
      saveTodo(todo);
      renderWizard();
      focusControl(`#wizard [data-todo="${key}:${idx}"]`);
    }));
    $$("#wz-result a[href^='#']", root).forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      if (id === "f4") { e.preventDefault(); showView("normal"); openDetail("f4-1"); return; }
      if (VIEWS.indexOf(id) !== -1) { e.preventDefault(); showView(id); return; }
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); smoothTo(el); }
    }));
  }

  /* ════════════════════════════════════════════
     🌱 零基礎 3 個 Check
     ════════════════════════════════════════════ */
  function renderBeginner() {
    const c = $("#beginner-list"); if (!c) return;
    const BC = L().BEGINNER_CHECKS, t = UI();
    c.innerHTML = BC.map((b, i) => part("beg-" + b.id,
      `<span class="ico">${b.icon}</span><span class="sum-text"><b>${esc(b.title)}</b><small>${esc(b.why)}</small></span>`,
      `<h4>${esc(t.howToCheck)}</h4>
       <ol class="steps">${b.how.map(h => `<li>${h}</li>`).join("")}</ol>
       <div class="say"><b>${esc(t.askLabel)}</b><br>${esc(b.ask)}</div>
       <div class="tip">${esc(t.ifNotPrefix)}${esc(b.ifNot)}</div>`,
      false)).join("");
  }

  /* ════════════════════════════════════════════
     置頂指南列（常駐）：5欄與底部對齊，放大
     ════════════════════════════════════════════ */
  function renderTopBar() {
    const c = $("#topbar"); if (!c) return;
    const TT = L().TOP_TABS;
    c.innerHTML = TT.map(q =>
      `<button class="tb-btn" data-tt="${esc(q.target)}"><span class="tb-ico">${iconFor(q.target)}</span><span class="tb-lbl">${esc(q.label)}</span></button>`
    ).join("");
    $$("[data-tt]", c).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.tt;
      showView((document.body.dataset.view || "normal") === key ? "normal" : key);
    }));
    syncViewUI();
  }

  /* ════════════════════════════════════════════
     置底 5格工具（常駐）：滿寬放大，與頂部對齊
     ════════════════════════════════════════════ */
  function renderBottomBar() {
    const c = $("#bottombar"); if (!c) return;
    const BA = L().BOTTOM_ACTIONS;
    c.innerHTML = BA.map(b =>
      `<button class="bb-btn" data-tv="${esc(b.target)}"><span class="bb-ico">${iconFor(b.target)}</span><span class="bb-lbl">${esc(b.label)}</span></button>`
    ).join("");
    $$("[data-tv]", c).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.tv;
      showView((document.body.dataset.view || "normal") === key ? "normal" : key);
    }));
    syncViewUI();
  }

  /* ════════════════════════════════════════════
     APP 式整版 view 切換：home ＋ 4 工具
     ════════════════════════════════════════════ */
  const VIEWS = ["normal", "quick", "f1", "f2", "f3", "f5", "bt-sync", "bt-conv", "bt-forms", "bt-oa", "bt-faq"];
  function showView(key, shouldFocus = true) {
    document.body.dataset.view = (VIEWS.indexOf(key) !== -1) ? key : "normal";
    syncViewUI();
    const announcement = $("#view-announcer");
    if (announcement) {
      const tab = $(`#topbar [data-tt="${document.body.dataset.view}"], #bottombar [data-tv="${document.body.dataset.view}"]`);
      announcement.textContent = tab ? tab.textContent.trim() : (LANG === "en" ? "Overview" : "總覽");
    }
    if (key === "quick") renderWizard();
    if (key === "normal") renderNormalCard();
    try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    try { window.scrollTo(0, 0); } catch (e) {}
    if (shouldFocus) {
      const id = document.body.dataset.view;
      const region = id === "normal" ? $("#view-normal") : $(id.startsWith("bt-") ? `#view-${id}` : `#${id}`);
      const heading = region && region.querySelector("h2");
      if (heading) { heading.setAttribute("tabindex", "-1"); try { heading.focus({ preventScroll: true }); } catch (e) { heading.focus(); } }
    }
  }
  function syncViewUI() {
    const cur = document.body.dataset.view || "normal";
    $$("#bottombar [data-tv], #topbar [data-tt]").forEach(a => {
      const active = (a.dataset.tv || a.dataset.tt) === cur;
      a.classList.toggle("active", active);
      a.setAttribute("aria-current", active ? "page" : "false");
    });
    const home = $("#home-nav");
    if (home) home.setAttribute("aria-current", cur === "normal" ? "page" : "false");
  }
  function bindViews() {
    $$("[data-tv-home]").forEach(b => b.addEventListener("click", () => showView("normal")));
    const home = $("#home-nav");
    if (home) home.addEventListener("click", () => showView("normal"));
    const clear = $("#privacy-clear");
    if (clear) clear.addEventListener("click", clearGuideData);
  }
  function clearGuideData() {
    const msg = LANG === "en"
      ? "Clear saved checklists, calculator progress and assessor details on this device? Language preference is kept."
      : "清除此裝置已儲存的待辦、計算器進度及考驗人員資料？語言設定會保留。";
    if (!window.confirm(msg)) return;
    const results = [OPEN_KEY, TODO_KEY, CALC_KEY, SYNC_CHK_KEY, EA_LOG_KEY, UUL_CHK_KEY].map(storeRemove);
    wzRole = null; wzStatus = null;
    inLevel = "bronze";
    inDone = { service: false, skill: false, physical: false, expedition: false, residential: false };
    syncRouteKey = "bronze";
    convSearchQuery = ""; convBranchIdx = "all"; convSecFilter = "all";
    formSearchQuery = ""; formCatFilter = "all";
    cmtSecId = "service"; cmtLvKey = "bronze"; cmtActName = ""; cmtHours = ""; cmtWeeks = "";
    renderAll();
    const result = $("#privacy-result");
    if (result) result.textContent = results.every(Boolean)
      ? (LANG === "en" ? "Saved guide data cleared." : "已清除已儲存的指南資料。")
      : (LANG === "en" ? "This session was cleared, but browser storage could not be cleared. Please remove site data in browser settings." : "已清除本次使用資料，但無法清除瀏覽器儲存。請到瀏覽器設定刪除此網站資料。");
    focusControl("#privacy-clear");
  }
  function openDetail(key) {
    const d = document.querySelector(`.part[data-key="${key}"]`);
    if (!d) return;
    if (typeof d.open === "boolean") d.open = true;
    smoothTo(d);
    const summary = d.querySelector("summary");
    if (summary) { try { summary.focus({ preventScroll: true }); } catch (e) { summary.focus(); } }
  }

  /* ════════════════════════════════════════════
     正常流程行動卡（預設 view 核心，與精靈 fresh 共用進度）
     ════════════════════════════════════════════ */
  function renderNormalCard() {
    const c = $("#normal-card"); if (!c) return;
    const p = L().PLANS.fresh, t = UI();
    const todo = loadTodo(); const key = "wz-fresh";
    const checked = todo[key] || [];
    const doneCount = p.steps.filter((_, i) => checked[i]).length;
    c.innerHTML = `<div class="plan-card">
      <div class="plan-head"><span class="plan-ico">${iconFor("quick")}</span>
        <div><b>${esc(p.pos)}</b><div class="plan-route">${esc(t.routeLabel)}${esc(p.route)}</div></div></div>
      <div class="plan-progress">${esc(t.progressLabel(doneCount, p.steps.length))}</div>
      <ol class="todo">${p.steps.map((s, i) => `
        <li class="${checked[i] ? "done" : ""}"><label>
          <input type="checkbox" data-todo="${key}:${i}" ${checked[i] ? "checked" : ""}>
          <span class="todo-n">${i + 1}</span><span>${esc(s)}</span>
        </label></li>`).join("")}</ol>
      <div class="plan-meta">
        <div><small>${esc(t.whoLabel)}</small><b>${esc(p.who)}</b></div>
        <div><small>${esc(t.formsLabel)}</small><b>${esc(p.forms)}</b></div>
        <div><small>${esc(t.timeLabel)}</small><b>${esc(p.time)}</b></div>
      </div>
      <div class="warn">⚠️ ${esc(p.warn)}</div>
      <div class="plan-actions">
        <button class="btn primary" data-normal-detail>${esc(p.linkLabel)} ↓</button>
      </div>
    </div>`;
    $$("[data-todo]", c).forEach(box => box.addEventListener("change", () => {
      const parts = box.dataset.todo.split(":");
      const td = loadTodo(); if (!Array.isArray(td[parts[0]])) td[parts[0]] = []; td[parts[0]][+parts[1]] = box.checked;
      saveTodo(td); renderNormalCard();
      focusControl(`#normal-card [data-todo="${parts[0]}:${parts[1]}"]`);
    }));
    const det = $("[data-normal-detail]", c);
    if (det) det.addEventListener("click", () => openDetail("f4-1"));
  }

  /* ════════════════════════════════════════════
     🚀 2026 實戰強化互動工具包（計數機／同步核對／徽章搜尋／評語庫／UUL清單）
     ════════════════════════════════════════════ */
  const CALC_KEY = "ayp-calc-v1";
  const SYNC_CHK_KEY = "ayp-sync-chk-v1";
  const EA_LOG_KEY = "ayp-ea-log-v1";
  const UUL_CHK_KEY = "ayp-uul-chk-v1";

  function loadJson(k, def) {
    try {
      const value = JSON.parse(storeRead(k));
      return value && typeof value === "object" && !Array.isArray(value) ? value : def;
    } catch (e) { return def; }
  }
  function saveJson(k, v) { storeWrite(k, JSON.stringify(v)); }

  // Work with calendar dates in UTC, not local-midnight-to-UTC conversion.
  function parseDate(dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || "")) return null;
    const date = new Date(dateStr + "T00:00:00Z");
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateStr ? date : null;
  }
  function dateString(date) {
    const year = date.getUTCFullYear();
    return year >= 1000 && year <= 9999 ? date.toISOString().slice(0, 10) : null;
  }
  function todayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  function addDays(dateStr, days) {
    const date = parseDate(dateStr);
    if (!date) return null;
    date.setUTCDate(date.getUTCDate() + days);
    return dateString(date);
  }
  function addMonths(dateStr, months) {
    const date = parseDate(dateStr);
    if (!date) return null;
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, last));
    return dateString(date);
  }
  function diffDaysFromToday(dateStr) {
    const target = parseDate(dateStr), today = parseDate(todayString());
    return target && today ? Math.round((target - today) / 86400000) : null;
  }
  async function copyTextWithToast(text, toastEl, msg) {
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (e) { /* Try the browser's legacy copy action below. */ }
    if (!copied) {
      const previous = document.activeElement;
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      try { copied = !!document.execCommand && document.execCommand("copy"); } catch (e) {}
      ta.remove();
      if (previous && previous.isConnected && typeof previous.focus === "function") previous.focus();
    }
    if (toastEl) {
      toastEl.textContent = copied ? msg : (LANG === "en"
        ? "Could not copy. Please select and copy the text manually."
        : "無法複製，請選取文字後手動複製。");
      toastEl.className = copied ? "toast-msg" : "toast-msg copy-error";
      setTimeout(() => { if (toastEl.isConnected) { toastEl.textContent = ""; toastEl.className = ""; } }, 5000);
    }
  }

  /* Practical shortcuts on the overview. */
  function renderPowerBanner() {
    const c = $("#power-banner"); if (!c) return;
    const isEn = LANG === "en";
    c.innerHTML = `
      <section class="power-banner" aria-labelledby="tools-heading">
        <div class="power-banner-head">
          <div><h2 id="tools-heading">${isEn ? "Helpful tools" : "實用工具"}</h2>
          <p>${isEn ? "Simple ways to organise your next steps." : "幫你整理資料，逐步跟進。"}</p></div>
          <span class="power-badge">${isEn ? "For members & leaders" : "成員及領袖適用"}</span>
        </div>
        <div class="power-grid">
          <button class="pw-btn" data-pw-jump="calc"><span class="pw-icon">${iconFor("bt-forms")}</span><span><b>${isEn ? "Progress calculator" : "進度計算器"}</b><small>${isEn ? "Track hours and estimate dates" : "記錄時數及估算日期"}</small></span><span class="pw-arrow" aria-hidden="true">→</span></button>
          <button class="pw-btn" data-pw-view="bt-sync"><span class="pw-icon">${iconFor("bt-sync")}</span><span><b>${isEn ? "Sync checklist" : "同步方案核對"}</b><small>${isEn ? "Review the trial steps" : "了解試行安排及核對項目"}</small></span><span class="pw-arrow" aria-hidden="true">→</span></button>
          <button class="pw-btn" data-pw-view="bt-conv"><span class="pw-icon">${iconFor("bt-conv")}</span><span><b>${isEn ? "Badge reference" : "徽章銜接參考"}</b><small>${isEn ? "Search the unofficial reference" : "搜尋非官方整理資料"}</small></span><span class="pw-arrow" aria-hidden="true">→</span></button>
          <button class="pw-btn" data-pw-view="bt-forms"><span class="pw-icon">${iconFor("bt-forms")}</span><span><b>${isEn ? "Forms and comment draft" : "表格及評語草稿"}</b><small>${isEn ? "Find forms and organise notes" : "查找表格及整理評語"}</small></span><span class="pw-arrow" aria-hidden="true">→</span></button>
        </div>
      </section>`;
    $$("[data-pw-jump='calc']", c).forEach(b => b.addEventListener("click", () => smoothTo($("#calc-sec"))));
    $$("[data-pw-view]", c).forEach(b => b.addEventListener("click", () => showView(b.dataset.pwView)));
  }

  function defaultCalcState() {
    return {
      path: "bronze",
      mainSec: "service",
      startDate: "",
      birthDate: "",
      goldTargetDate: "",
      sec: {
        service: { h: 0, w: 0 },
        skill: { h: 0, w: 0 },
        physical: { h: 0, w: 0 },
        expedition: { done: false },
        residential: { done: false }
      }
    };
  }

  function renderCalculator() {
    const c = $("#calc-box"); if (!c) return;
    const PW = L().POWER; if (!PW) return;
    const lb = PW.labels, paths = PW.paths, FS = L().FIVE_SECTIONS;
    const secTitle = $("#calc-sec-title");
    if (secTitle) secTitle.textContent = PW.calcTitle.replace(/^🧮\s*/, "");

    const defaults = defaultCalcState();
    let st = { ...defaults, ...loadJson(CALC_KEY, {}) };
    if (!Object.prototype.hasOwnProperty.call(paths, st.path)) st.path = "bronze";
    if (!["service", "skill", "physical"].includes(st.mainSec)) st.mainSec = "service";
    if (!st.sec || typeof st.sec !== "object" || Array.isArray(st.sec)) st.sec = defaults.sec;
    if (!st.perPath || typeof st.perPath !== "object" || Array.isArray(st.perPath)) st.perPath = {};
    Object.keys(defaults.sec).forEach(key => {
      if (!st.sec[key] || typeof st.sec[key] !== "object" || Array.isArray(st.sec[key])) st.sec[key] = defaults.sec[key];
    });
    const p = paths[st.path];

    // Age is only a reference: special/progressive eligibility needs verification.
    let ageHtml = "";
    const bd = parseDate(st.birthDate);
    if (st.birthDate && (!bd || st.birthDate > todayString())) {
      ageHtml = `<div class="warn" role="alert">${LANG === "en" ? "Enter a valid date of birth that is not in the future." : "請輸入有效而且不是未來的出生日期。"}</div>`;
    } else if (bd) {
      const now = new Date();
      let months = (now.getFullYear() - bd.getUTCFullYear()) * 12 + (now.getMonth() - bd.getUTCMonth());
      if (now.getDate() < bd.getUTCDate()) months--;
      const yrs = Math.floor(months / 12), mos = months % 12;
      const leapBirthday = bd.getUTCMonth() === 1 && bd.getUTCDate() === 29;
      const dl23 = leapBirthday ? null : addMonths(st.birthDate, 23 * 12);
      const dl25 = leapBirthday ? null : addMonths(st.birthDate, 25 * 12);
      const progressive = st.path === "progSilver" || st.path === "progGold";
      let eligMsg;
      if (yrs >= 25) {
        eligMsg = LANG === "en"
          ? "Activities generally need to be completed before age 25. Confirm exceptional circumstances with your Operating Authority."
          : "活動一般須於 25 歲生日前完成；特殊情況請向所屬執行處核實。";
      } else if (p.specialAge && yrs === p.specialAge) {
        eligMsg = LANG === "en"
          ? "Age 13 may qualify for a special Bronze arrangement, subject to Operating Authority approval and group conditions."
          : "13 歲可能適用銅章特別安排；仍須符合小組條件及獲執行處批准。";
      } else if (yrs < p.minAge && progressive) {
        eligMsg = LANG === "en"
          ? `Below the general starting age of ${p.minAge}; an exception may be available after the previous Award is completed. Ask your Operating Authority.`
          : `未達一般起步年齡 ${p.minAge} 歲；已完成前一章級者可能有例外，請向執行處核實。`;
      } else if (yrs < p.minAge) {
        eligMsg = LANG === "en"
          ? `Below the general starting age of ${p.minAge}. Confirm any applicable exceptions with your Operating Authority.`
          : `未達一般起步年齡 ${p.minAge} 歲；請向執行處確認有否適用例外。`;
      } else {
        eligMsg = LANG === "en"
          ? `Meets the general minimum age of ${p.minAge}; confirm all other entry and progression conditions.`
          : `已達一般最低年齡 ${p.minAge} 歲；其他參加及銜接條件仍須核實。`;
      }
      if (yrs >= 23 && yrs < 25) eligMsg += LANG === "en"
        ? " Confirm first-entry and progression rules with your Operating Authority."
        : " 首次參加及升級安排請向所屬執行處核實。";
      ageHtml = `<div class="diag-box age">
        <h4>${esc(lb.ageCheckTitle)}</h4>
        <ul>
          <li><b>${esc(lb.ageNow(yrs, mos))}</b> — ${esc(eligMsg)}</li>
          ${leapBirthday ? `<li>${LANG === "en" ? "For a 29 February birthday, confirm the applicable dates with your Operating Authority." : "2 月 29 日出生的適用日期，請向執行處核實。"}</li>` : `
          <li>${esc(lb.deadline23)}<b>${esc(dl23)}</b> ${esc(lb.daysLeft(diffDaysFromToday(dl23)))}</li>
          <li>${esc(lb.deadline25)}<b>${esc(dl25)}</b> ${esc(lb.daysLeft(diffDaysFromToday(dl25)))}</li>`}
        </ul>
      </div>`;
    }

    // The Gold Section start date is distinct from the Record Book start date.
    let goldHtml = "";
    if (p.isGold) {
      const regDl = addMonths(st.goldTargetDate, -2);
      const uulDl = regDl ? addDays(regDl, -15) : null;
      goldHtml = `<div class="diag-box gold-dl">
        <h4>${esc(lb.goldDeadlineTitle)}</h4>
        <p>${LANG === "en"
          ? "Gold activity plans and forms are normally submitted in advance. This estimate subtracts two calendar months; confirm the actual deadline with your User Unit Leader and allow time for review."
          : "金章活動計劃及表格一般須提前提交。此處按兩個曆月估算；實際截止日期及審批時間請向執行處支部組長核實，並預留時間。"}</p>
        ${regDl ? `<ul>
          <li>${esc(lb.goldUulDate)}<b>${esc(uulDl)}</b></li>
          <li>${esc(lb.goldRegionalDate)}<b>${esc(regDl)}</b></li>
        </ul>` : `<p>${LANG === "en" ? "Enter the planned Gold Section start date to see a reference date." : "請輸入金章預計科目開始日，以顯示參考日期。"}</p>`}
      </div>`;
    }

    const threeSecs = ["service", "skill", "physical"];
    const secCardsHtml = threeSecs.map(k => {
      const isMain = p.splitMain && st.mainSec === k;
      const reqH = isMain ? p.mainH : p.subH;
      const reqW = isMain ? p.mainW : p.subW;
      const curH = Math.max(0, Math.min(500, Number(st.sec[k].h) || 0));
      const curW = Math.max(0, Math.min(200, Math.floor(Number(st.sec[k].w) || 0)));
      st.sec[k].h = curH; st.sec[k].w = curW;
      const pctH = Math.min(100, Math.round((curH / reqH) * 100));
      const pctW = Math.min(100, Math.round((curW / reqW) * 100));
      const earliest = st.startDate ? addDays(st.startDate, reqW * 7) : null;
      const dLeft = earliest ? diffDaysFromToday(earliest) : null;
      const isTrap = curH >= reqH && curW < reqW;
      const isDone = curH >= reqH && curW >= reqW;
      const roleTag = p.splitMain ? (isMain ? lb.mainTag : lb.subTag) : lb.equalTag;

      return `<div class="sec-track-card ${isMain ? "is-main" : ""} ${isDone ? "is-done" : ""}">
        <div class="sec-track-top">
          <div class="sec-track-title"><span>${FS[k].icon}</span><span>${esc(FS[k].name)}</span></div>
          <span class="role-pill ${isMain ? "" : "sub"}">${esc(roleTag)}（≥${reqH}h / ≥${reqW}w）</span>
        </div>
        <div class="sec-req-meta">${esc(lb.reqFormat(reqH, reqW))}</div>
        <div class="sec-date-badge">
          ${earliest ? `${esc(lb.earliestDate)}<b>${esc(earliest)}</b> ${esc(lb.daysLeft(dLeft))}` : esc(lb.setStartFirst)}
        </div>
        <div class="track-inputs">
          <div>
            <label for="calc-h-${k}">${esc(lb.hoursLogged)}（${LANG === "en" ? "target" : "目標"} ${reqH}h）</label>
            <input id="calc-h-${k}" type="number" min="0" max="500" step="0.5" data-calc-h="${k}" value="${curH}">
          </div>
          <div>
            <label for="calc-w-${k}">${esc(lb.weeksLogged)}（${LANG === "en" ? "target" : "目標"} ${reqW}w）</label>
            <input id="calc-w-${k}" type="number" min="0" max="200" step="1" data-calc-w="${k}" value="${curW}">
          </div>
        </div>
        <div class="bar-pair">
          <div class="mini-bar-wrap">
            <small><span>⏳ ${curH} / ${reqH}h</span><b>${pctH}%</b></small>
            <div class="mini-bar"><div style="width:${pctH}%"></div></div>
          </div>
          <div class="mini-bar-wrap">
            <small><span>🗓️ ${curW} / ${reqW}w</span><b>${pctW}%</b></small>
            <div class="mini-bar ${isTrap ? "warn-bar" : ""}"><div style="width:${pctW}%"></div></div>
          </div>
        </div>
        ${isTrap ? `<div class="warn" style="margin-top:.45rem">${esc(lb.trapWarn(reqW - curW))}</div>` : ""}
        ${isDone ? `<div class="ok-box" style="margin-top:.45rem">${esc(lb.secDone)}</div>` : ""}
      </div>`;
    }).join("");

    const expDone = !!(st.sec.expedition && st.sec.expedition.done);
    const resDone = !!(st.sec.residential && st.sec.residential.done);

    c.innerHTML = `
      <div class="calc-shell">
        <p class="lead" style="margin:.1rem 0 .6rem">${esc(PW.calcIntro)}</p>
        <p class="privacy-inline">${LANG === "en" ? "Dates and progress are stored in this browser. Avoid personal data on shared devices; use the privacy control above to clear them." : "日期及進度儲存在此瀏覽器。公用裝置請避免輸入個人資料；可用上方資料管理功能清除。"}</p>
        <div>
          <b style="color:#0a5c36;font-size:.9rem">${esc(lb.pickPath)}</b>
          <div class="chips">${Object.keys(paths).map(k =>
            `<button class="chip ${st.path === k ? "active" : ""}" data-calc-path="${k}" aria-pressed="${st.path === k}">${esc(paths[k].name)}</button>`
          ).join("")}</div>
        </div>
        <div class="tip" style="margin:.4rem 0">${esc(p.note)}</div>

        ${p.splitMain ? `
          <div style="margin:.6rem 0">
            <b style="color:#0a5c36;font-size:.9rem">${esc(lb.pickMain)}</b>
            <div class="chips">${threeSecs.map(k =>
              `<button class="chip ${st.mainSec === k ? "active" : ""}" data-calc-main="${k}" aria-pressed="${st.mainSec === k}">${FS[k].icon} ${esc(FS[k].name)}（${p.mainH}h / ${p.mainW}w）</button>`
            ).join("")}</div>
          </div>` : `<div class="ok-box">${esc(lb.noSplitHint)}</div>`}

        <div class="calc-grid">
          <div class="field-box">
            <label for="calc-start-date">${esc(lb.startDate)}</label>
            <input type="date" id="calc-start-date" value="${esc(st.startDate)}">
          </div>
          <div class="field-box">
            <label for="calc-birth-date">${esc(lb.birthDate)}</label>
            <input type="date" id="calc-birth-date" max="${todayString()}" value="${esc(st.birthDate)}">
          </div>
          ${p.isGold ? `
          <div class="field-box">
            <label for="calc-gold-date">${esc(lb.goldTargetDate)}</label>
            <input type="date" id="calc-gold-date" value="${esc(st.goldTargetDate)}">
          </div>` : ""}
        </div>

        ${ageHtml}
        ${goldHtml}

        <div class="sec-track-list">
          ${secCardsHtml}

          <div class="sec-track-card ${expDone ? "is-done" : ""}">
            <div class="sec-track-top">
              <div class="sec-track-title"><span>${FS.expedition.icon}</span><span>${esc(FS.expedition.name)}</span></div>
              <span class="role-pill sub">${LANG === "en" ? "Required Journey" : "指定訓練及旅程"}</span>
            </div>
            <div class="sec-req-meta">${esc(p.expText)}</div>
            <label style="display:flex;align-items:center;gap:.5rem;margin-top:.4rem;cursor:pointer;font-weight:700;color:#0a5c36">
              <input type="checkbox" id="calc-exp-done" style="width:20px;height:20px;accent-color:#0a5c36" ${expDone ? "checked" : ""}>
              <span>${esc(lb.expDoneLabel)}</span>
            </label>
          </div>

          ${p.resText ? `
          <div class="sec-track-card ${resDone ? "is-done" : ""}">
            <div class="sec-track-top">
              <div class="sec-track-title"><span>${FS.residential.icon}</span><span>${esc(FS.residential.name)}</span></div>
              <span class="role-pill">${LANG === "en" ? "Gold Only (5D4N)" : "金章專屬（5日4夜）"}</span>
            </div>
            <div class="sec-req-meta">${esc(p.resText)}</div>
            <label style="display:flex;align-items:center;gap:.5rem;margin-top:.4rem;cursor:pointer;font-weight:700;color:#0a5c36">
              <input type="checkbox" id="calc-res-done" style="width:20px;height:20px;accent-color:#0a5c36" ${resDone ? "checked" : ""}>
              <span>${esc(lb.resDoneLabel)}</span>
            </label>
          </div>` : ""}
        </div>

        <div class="plan-actions">
          <button class="btn primary" id="calc-copy-btn">${esc(lb.copySummaryBtn)}</button>
          <button class="btn ghost" id="calc-reset-btn">${esc(lb.resetCalcBtn)}</button>
        </div>
        <div id="calc-toast" role="status" aria-live="polite"></div>
      </div>`;

    $$("[data-calc-path]", c).forEach(b => b.addEventListener("click", () => {
      const nextPath = b.dataset.calcPath;
      if (nextPath !== st.path) {
        st.perPath[st.path] = { mainSec: st.mainSec, startDate: st.startDate, goldTargetDate: st.goldTargetDate, sec: st.sec };
        const saved = st.perPath[nextPath];
        const next = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : defaults;
        st = { ...st, path: nextPath, mainSec: next.mainSec || "service", startDate: next.startDate || "", goldTargetDate: next.goldTargetDate || "", sec: next.sec || defaultCalcState().sec };
        saveJson(CALC_KEY, st);
      }
      renderCalculator(); focusControl(`[data-calc-path="${nextPath}"]`);
    }));
    $$("[data-calc-main]", c).forEach(b => b.addEventListener("click", () => {
      st.mainSec = b.dataset.calcMain; saveJson(CALC_KEY, st); renderCalculator();
      focusControl(`[data-calc-main="${st.mainSec}"]`);
    }));
    const sd = $("#calc-start-date", c);
    if (sd) sd.addEventListener("change", () => { st.startDate = sd.value; saveJson(CALC_KEY, st); renderCalculator(); focusControl("#calc-start-date"); });
    const birthInput = $("#calc-birth-date", c);
    if (birthInput) birthInput.addEventListener("change", () => { st.birthDate = birthInput.value; saveJson(CALC_KEY, st); renderCalculator(); focusControl("#calc-birth-date"); });
    const gd = $("#calc-gold-date", c);
    if (gd) gd.addEventListener("change", () => { st.goldTargetDate = gd.value; saveJson(CALC_KEY, st); renderCalculator(); focusControl("#calc-gold-date"); });

    $$("[data-calc-h]", c).forEach(inp => inp.addEventListener("change", () => {
      const k = inp.dataset.calcH;
      st.sec[k] = st.sec[k] || { h: 0, w: 0 };
      st.sec[k].h = Math.max(0, Math.min(500, Number(inp.value) || 0));
      saveJson(CALC_KEY, st); renderCalculator(); focusControl(`#calc-h-${k}`);
    }));
    $$("[data-calc-w]", c).forEach(inp => inp.addEventListener("change", () => {
      const k = inp.dataset.calcW;
      st.sec[k] = st.sec[k] || { h: 0, w: 0 };
      st.sec[k].w = Math.max(0, Math.min(200, Math.floor(Number(inp.value) || 0)));
      saveJson(CALC_KEY, st); renderCalculator(); focusControl(`#calc-w-${k}`);
    }));
    const expBox = $("#calc-exp-done", c);
    if (expBox) expBox.addEventListener("change", () => {
      st.sec.expedition = { done: expBox.checked }; saveJson(CALC_KEY, st); renderCalculator(); focusControl("#calc-exp-done");
    });
    const resBox = $("#calc-res-done", c);
    if (resBox) resBox.addEventListener("change", () => {
      st.sec.residential = { done: resBox.checked }; saveJson(CALC_KEY, st); renderCalculator(); focusControl("#calc-res-done");
    });

    const resetBtn = $("#calc-reset-btn", c);
    if (resetBtn) resetBtn.addEventListener("click", () => {
      const message = LANG === "en" ? "Clear calculator dates and progress for all Award paths?" : "清除所有章級的計算器日期及進度？";
      if (!window.confirm(message)) return;
      saveJson(CALC_KEY, defaultCalcState()); renderCalculator(); focusControl("#calc-reset-btn");
    });
    const copyBtn = $("#calc-copy-btn", c);
    if (copyBtn) copyBtn.addEventListener("click", () => {
      const lines = [
        `【AYP 進度報告 / AYP Progress Report】`,
        `章級路徑 Path: ${p.name}`,
        `輸入活動開始日 Entered activity start date: ${st.startDate || "未填 / Not set"}`,
      ];
      threeSecs.forEach(k => {
        const isMain = p.splitMain && st.mainSec === k;
        const reqH = isMain ? p.mainH : p.subH;
        const reqW = isMain ? p.mainW : p.subW;
        const curH = (st.sec[k] && st.sec[k].h) || 0;
        const curW = (st.sec[k] && st.sec[k].w) || 0;
        const earliest = st.startDate ? addDays(st.startDate, reqW * 7) : "-";
        lines.push(`- ${FS[k].name}: ${curH}/${reqH}h, ${curW}/${reqW}w (參考日期 Reference: ${earliest})`);
      });
      lines.push(`- ${FS.expedition.name}: ${expDone ? "✅ 已完成 Completed" : "⏳ 進行中 In progress"}`);
      if (p.resText) lines.push(`- ${FS.residential.name}: ${resDone ? "✅ 已完成 Completed" : "⏳ 進行中 In progress"}`);
      lines.push(LANG === "en" ? "Reference only; confirm requirements with your Operating Authority." : "以上只作參考，請向所屬執行處核實要求。");
      copyTextWithToast(lines.join("\n"), $("#calc-toast", c), lb.copiedToast);
    });
  }

  /* ════════════════════════════════════════════
     🧰 底部快速工具：同步方案／單項銜接表／開展表格／查執行處
     ════════════════════════════════════════════ */
  let syncRouteKey = "bronze";
  let convSearchQuery = "";
  let convBranchIdx = "all";
  let convSecFilter = "all";
  let formSearchQuery = "";
  let formCatFilter = "all";
  let cmtSecId = "service";
  let cmtLvKey = "bronze";
  let cmtActName = "";
  let cmtHours = "";
  let cmtWeeks = "";

  function renderBottomTools() {
    const PW = L().POWER, t = UI();

    /* ── 工具 1：📋 2026 同步完成方案 ＋ 互動逐項核對器 ＋ EA 考驗人員紀錄產生器 ── */
    const sync = $("#bt-sync-body");
    if (sync && PW) {
      const SP = L().SYNC_PLAN, SC = PW.syncChecker;
      const chkState = loadJson(SYNC_CHK_KEY, {});
      const eaState = loadJson(EA_LOG_KEY, {});
      const loggerOpen = loadOpen()["ea-logger"] !== false;
      const curRoute = SC.routes[syncRouteKey] || SC.routes.bronze;
      const doneItems = curRoute.items.filter(it => !!chkState[it.id]);
      const missingItems = curRoute.items.filter(it => !chkState[it.id]);

      sync.innerHTML = `
        <div class="warn backdate">${t.backdateWarn}</div>
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .3rem;color:#0a5c36">${esc(SC.title)}</h3>
          <p class="hint" style="margin:0 0 .6rem">${esc(SC.sub)}</p>
          <div class="reference-notice" role="note"><b>${LANG === "en" ? "Check the latest trial guidance" : "請核對最新試行指引"}</b>
            <p>${LANG === "en" ? "This unofficial checklist is for discussion only. Individual mappings, examiner qualifications and completion requirements have not been verified with the Operating Authority. A checked item is not an approval." : "此非官方清單只供討論；各項對接、考驗人員資格及完成要求尚未逐項獲執行處確認。剔選不代表獲批。"}</p>
            <a href="https://hkayp.scouting.org.hk/" target="_blank" rel="noopener">${LANG === "en" ? "Scout Operating Authority guidance" : "童軍執行處指引"} ↗</a>
          </div>

          <div class="chips">
            ${Object.keys(SC.routes).map(rk =>
              `<button class="chip ${syncRouteKey === rk ? "active" : ""}" data-sync-route="${rk}" aria-pressed="${syncRouteKey === rk}">${esc(SC.routes[rk].label)}</button>`
            ).join("")}
          </div>

          <div class="sync-summary-banner">
            <div>
              <b>${esc(curRoute.badgePair)}</b>
              <div style="font-size:.82rem;color:#444;margin-top:.15rem">
                ${LANG === "en"
                  ? `Checked ${doneItems.length} / ${curRoute.items.length} reference items`
                  : `已剔選 ${doneItems.length} / ${curRoute.items.length} 項參考項目`}
              </div>
            </div>
            <button class="btn primary" id="sync-copy-btn" style="min-height:40px;padding:.45rem .85rem;font-size:.85rem">
              📋 ${LANG === "en" ? "Copy Sync Status" : "複製核對進度"}
            </button>
          </div>
          <div id="sync-toast" role="status" aria-live="polite"></div>

          <ol class="todo">
            ${curRoute.items.map((it, idx) => `
              <li class="${chkState[it.id] ? "done" : ""}">
                <label>
                  <input type="checkbox" data-sync-chk="${esc(it.id)}" ${chkState[it.id] ? "checked" : ""}>
                  <span class="todo-n">${idx + 1}</span>
                  <span>
                    <span class="chk-cat-tag">${esc(it.cat)}</span>
                    <b>${esc(it.title)}</b>
                    <small style="display:block;color:#555;margin-top:.2rem">${esc(it.detail)}</small>
                  </span>
                </label>
              </li>`).join("")}
          </ol>

          ${missingItems.length === 0
            ? `<div class="ok-box">${LANG === "en" ? "You have checked every reference item. This does not confirm eligibility or completion; review your records with your Unit Leader." : "你已剔選所有參考項目。這不代表符合資格或已完成；請與組長核對紀錄。"}</div>`
            : `<div class="warn">🔎 <b>${LANG === "en" ? `Not checked (${missingItems.length} items):` : `未剔選 (${missingItems.length} 項)：`}</b>
                <ul style="margin:.3rem 0;padding-left:1.2rem">${missingItems.map(m => `<li><b>${esc(m.cat)}</b>：${esc(m.title)}</li>`).join("")}</ul>
              </div>`}

          <div class="tip" style="margin-top:.7rem">
            <a class="btn primary" href="${esc(SC.eformUrl)}" target="_blank" rel="noopener" style="display:inline-block;margin-bottom:.4rem">${esc(SC.eformBtn)} ↗</a>
            <div style="font-size:.82rem">${esc(SC.eformNote)}</div>
          </div>
        </div>

        <details class="part" data-key="ea-logger" ${loggerOpen ? "open" : ""}>
          <summary><span class="ico">🏕️</span> <span class="sum-text"><b>${esc(SC.eaLoggerTitle)}</b><small>${esc(SC.eaLoggerDesc)}</small></span><span class="chev">▾</span></summary>
          <div class="part-body">
            <p class="privacy-inline">${LANG === "en"
              ? "Details are saved in this browser, not to an official record. Avoid personal information on shared devices and clear it after use."
              : "資料只儲存在此瀏覽器，並非官方紀錄。公用裝置請避免輸入個人資料，使用後可清除。"}</p>
            <div class="calc-grid">
              ${Object.keys(SC.eaFields).map(fk => `
                <div class="field-box">
                  <label for="ea-${fk}">${esc(SC.eaFields[fk])}</label>
                  <input type="text" id="ea-${fk}" data-ea-field="${fk}" value="${esc(eaState[fk] || "")}">
                </div>`).join("")}
            </div>
            <div class="plan-actions">
              <button class="btn primary" id="ea-copy-btn">${esc(SC.eaCopyBtn)}</button>
              <button class="btn ghost" id="ea-clear-btn">${LANG === "en" ? "Clear assessor details" : "清除考驗人員資料"}</button>
            </div>
            <div id="ea-toast" role="status" aria-live="polite"></div>
          </div>
        </details>

        <div class="unofficial-badge">⚠️ ${esc(SP.effective)}</div>
        <p>${esc(SP.summary)}</p>
        <div class="reference-notice" role="note">${LANG === "en" ? "The following detailed mappings are unofficial references and need confirmation with the Operating Authority." : "以下對接細節屬非官方參考，須向執行處逐項核實。"}</div>
        <ol class="steps">${SP.points.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
        <div class="warn">${esc(SP.notifyLeader)}</div>
        <div class="warn">${esc(SP.verify)}</div>
        <p><a href="${esc(SP.source.url)}" target="_blank" rel="noopener">${esc(SP.source.label)} — ${esc(t.openOfficialLink)}</a></p>`;

      $$("[data-sync-route]", sync).forEach(b => b.addEventListener("click", () => {
        syncRouteKey = b.dataset.syncRoute; renderBottomTools(); focusControl(`[data-sync-route="${syncRouteKey}"]`);
      }));
      $$("[data-sync-chk]", sync).forEach(box => box.addEventListener("change", () => {
        const s = loadJson(SYNC_CHK_KEY, {});
        s[box.dataset.syncChk] = box.checked;
        saveJson(SYNC_CHK_KEY, s); renderBottomTools(); focusControl(`[data-sync-chk="${box.dataset.syncChk}"]`);
      }));
      const syncCopy = $("#sync-copy-btn", sync);
      if (syncCopy) syncCopy.addEventListener("click", () => {
        const txt = [
          LANG === "en" ? "【2026 Scout–AYP simultaneous completion checklist】" : "【2026 童軍↔AYP 同步完成核對清單】",
          `${LANG === "en" ? "Route" : "路線"}：${curRoute.badgePair}`,
          `${LANG === "en" ? "Checked" : "已剔選"}：${doneItems.length} / ${curRoute.items.length}`,
          ...curRoute.items.map(it => `${chkState[it.id] ? "✅" : "⬜"} [${it.cat}] ${it.title}`)
        ].join("\n");
        copyTextWithToast(txt, $("#sync-toast", sync), PW.labels.copiedToast);
      });
      $$("[data-ea-field]", sync).forEach(inp => inp.addEventListener("input", () => {
        const s = loadJson(EA_LOG_KEY, eaState);
        s[inp.dataset.eaField] = inp.value;
        saveJson(EA_LOG_KEY, s);
      }));
      const eaClear = $("#ea-clear-btn", sync);
      if (eaClear) eaClear.addEventListener("click", () => {
        const message = LANG === "en" ? "Clear assessor details saved on this device?" : "清除此裝置儲存的考驗人員資料？";
        if (!window.confirm(message)) return;
        const removed = storeRemove(EA_LOG_KEY); renderBottomTools(); focusControl("#ea-clear-btn");
        const toast = $("#ea-toast", sync);
        if (toast) toast.textContent = removed
          ? (LANG === "en" ? "Assessor details cleared." : "已清除考驗人員資料。")
          : (LANG === "en" ? "Session details cleared; remove site data in browser settings to clear saved data." : "已清除本次使用資料；請到瀏覽器設定刪除此網站的已儲存資料。");
      });
      const eaCopy = $("#ea-copy-btn", sync);
      if (eaCopy) eaCopy.addEventListener("click", () => {
        const s = loadJson(EA_LOG_KEY, eaState);
        const lines = [
          LANG === "en" ? "【2026 trial scheme — journey assessor record draft】" : "【2026 童軍同步完成試行方案 — 野外鍛鍊科考驗人員紀錄草稿】",
          ...Object.keys(SC.eaFields).map(fk => `${SC.eaFields[fk]}：${s[fk] || "-"}`)
        ];
        copyTextWithToast(lines.join("\n"), $("#ea-toast", sync), PW.labels.copiedToast);
      });
    }

    /* ── 工具 2：🔁 跨支部徽章 ↔ AYP 五科即時搜尋與防伏配對器 ── */
    const conv = $("#bt-conv-body");
    if (conv && PW) {
      const CT = L().CONVERSION_TABLE;
      const q = convSearchQuery.trim().toLowerCase();
      const matchedCancelled = PW.cancelledBadges.filter(b =>
        q && (b.name.toLowerCase().includes(q) || b.en.toLowerCase().includes(q))
      );

      const badgeGroupsEn = { "興趣組": "Interest group", "技能組": "Pursuit group", "服務組": "Service group", "教導組": "Instructor group" };
      const secKeys = ["all", "服務科", "技能科", "康樂體育科", "野外鍛鍊科", "團體生活科"];
      const secLabelsEn = { "服務科": "Service", "技能科": "Skills", "康樂體育科": "Physical", "野外鍛鍊科": "Journey", "團體生活科": "Residential" };
      const filteredGroups = CT.groups.map((g, idx) => {
        if (convBranchIdx !== "all" && String(idx) !== String(convBranchIdx)) return null;
        const rows = g.rows.filter(r => {
          if (convSecFilter !== "all" && !r.ayp.includes(convSecFilter) && !(convSecFilter === "服務科" && r.ayp.includes("Service")) && !(convSecFilter === "技能科" && r.ayp.includes("Skills")) && !(convSecFilter === "康樂體育科" && r.ayp.includes("Physical")) && !(convSecFilter === "野外鍛鍊科" && r.ayp.includes("Journey")) && !(convSecFilter === "團體生活科" && r.ayp.includes("Residential"))) {
            return false;
          }
          if (!q) return true;
          return g.branch.toLowerCase().includes(q) || r.ayp.toLowerCase().includes(q) || r.items.toLowerCase().includes(q);
        });
        if (rows.length === 0) return null;
        return { ...g, rows };
      }).filter(Boolean);

      conv.innerHTML = `
        <div class="warn backdate">${t.backdateWarn}</div>
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .35rem;color:#0a5c36">${LANG === "en" ? "Badge and AYP Section reference" : "徽章及 AYP 科目參考"}</h3>
          <div class="reference-notice" role="note"><b>${LANG === "en" ? "Historical reference, not current requirements" : "歷史參考資料，並非現行要求"}</b>
            <p>${LANG === "en" ? "This unofficial table is based on a 2016 reference. Badge names, hours and journey distances below may be outdated; do not treat them as current eligibility or requirements. Confirm every mapping with your Operating Authority." : "此非官方整理以 2016 年參照表為基礎；下列徽章名稱、時數及旅程距離可能已過時，不能當作現行資格或要求。每項對應請向所屬執行處核實。"}</p>
            <a href="${esc(CT.officialSource.url)}" target="_blank" rel="noopener">${LANG === "en" ? "2016 source" : "2016 年原始資料"} ↗</a> · <a href="https://ayp.org.hk/wp-content/uploads/2024/06/2.-%E4%BA%94%E7%A7%91%E6%B4%BB%E5%8B%95%E4%BB%8B%E7%B4%B9.pdf" target="_blank" rel="noopener">${LANG === "en" ? "AYP Section overview (2024)" : "AYP 五科活動介紹（2024）"} ↗</a>
          </div>
          <div class="filter-row">
            <label class="sr-only" for="conv-search-inp">${LANG === "en" ? "Search badge reference" : "搜尋徽章參考"}</label>
            <input type="search" class="search-input" id="conv-search-inp" placeholder="${LANG === "en" ? "Search badge/activity (e.g. First Aid, Canoe, Pioneering, R-A102...)" : "輸入徽章或活動名稱搜尋（例：急救、獨木舟、先鋒工程、攝影、R-A102、大露營...）"}" value="${esc(convSearchQuery)}">
            ${convSearchQuery ? `<button class="btn ghost" id="conv-clear-btn" aria-label="${LANG === "en" ? "Clear badge search" : "清除徽章搜尋"}" style="min-height:42px;padding:.4rem .8rem">✕</button>` : ""}
          </div>
          <div class="chips">
            <button class="chip ${convBranchIdx === "all" ? "active" : ""}" data-conv-br="all" aria-pressed="${convBranchIdx === "all"}">${LANG === "en" ? "All Scout sections" : "全部支部"}</button>
            ${CT.groups.map((g, idx) => `<button class="chip ${String(convBranchIdx) === String(idx) ? "active" : ""}" data-conv-br="${idx}" aria-pressed="${String(convBranchIdx) === String(idx)}">${esc(g.branch.split("參考")[0].split("reference")[0])}</button>`).join("")}
          </div>
          <div class="chips">
            ${secKeys.map(sk => `<button class="chip ${convSecFilter === sk ? "active" : ""}" data-conv-sec="${sk}" aria-pressed="${convSecFilter === sk}">${sk === "all" ? (LANG === "en" ? "All 5 AYP Sections" : "全部五科") : esc(LANG === "en" ? secLabelsEn[sk] : sk)}</button>`).join("")}
          </div>

          ${matchedCancelled.length > 0 ? `
            <div class="badge-cancel-alert">
              <b>🚫 ${LANG === "en" ? "Badge status notice (Circular P013/26, 2026-08-15):" : "徽章狀態提示：以下徽章已於 2026-08-15 通告 (P013/26) 取消。"}</b>
              <ul style="margin:.3rem 0;padding-left:1.2rem">
                ${matchedCancelled.map(b => `<li><b>${esc(LANG === "en" ? b.en : b.name)}（${esc(LANG === "en" ? badgeGroupsEn[b.group] : b.group)}）</b> — ${LANG === "en" ? "This badge in the listed group has been cancelled. Verify earlier records with your Operating Authority." : "此組別的徽章已取消；過往紀錄能否認可，請向所屬執行處核實。"}</li>`).join("")}
              </ul>
              <p>${LANG === "en" ? "This notice applies only to the listed group; a similarly named badge in another group may still be current." : "此提示只適用於所列組別；其他組別的同名徽章可能仍然有效，請核對組別。"}</p>
            </div>` : ""}

          ${filteredGroups.length === 0
            ? `<div class="wz-empty">${LANG === "en" ? "No matching badges found. Try another keyword or clear filters." : "搵唔到符合條件嘅徽章／項目，請試下其他關鍵字或重設篩選。"}</div>`
            : filteredGroups.map(g => `
              <div class="conv-group">
                <h4>${esc(g.branch)}</h4>
                <table class="conv"><tbody>
                  ${g.rows.map(r => `<tr><td class="ayp-col">${esc(r.ayp)}</td><td>${esc(r.items)}</td></tr>`).join("")}
                </tbody></table>
                ${g.note ? `<p class="hint">${esc(g.note)}</p>` : ""}
              </div>`).join("")}
        </div>

        <h3 style="color:#0a5c36;margin:1.2rem 0 .4rem">${esc(PW.redlinesTitle)}</h3>
        ${PW.redlines.map((rl, i) => part("rl-" + i,
          `<span class="ico">${rl.icon}</span><span class="sum-text"><b>${esc(rl.title)}</b></span>`,
          `<p>${esc(rl.body)}</p>`, true)).join("")}

        <div class="unofficial-badge">${esc(CT.unofficialTag)}</div>
        <p>${esc(CT.intro)}</p>
        <div class="warn">${esc(CT.excludedNote)}</div>
        <p class="hint">${esc(CT.footnote)}</p>
        <p>${esc(t.conversionOfficialBase)}<a href="${esc(CT.officialSource.url)}" target="_blank" rel="noopener">${esc(CT.officialSource.label)}</a></p>
        <p>${esc(t.conversionCancelSource)}<a href="${esc(CT.cancelSource.url)}" target="_blank" rel="noopener">${esc(CT.cancelSource.label)}</a></p>`;

      const sInp = $("#conv-search-inp", conv);
      if (sInp) sInp.addEventListener("input", () => {
        convSearchQuery = sInp.value;
        const pos = sInp.selectionStart;
        renderBottomTools();
        const nextInp = $("#conv-search-inp", conv);
        if (nextInp) { nextInp.focus(); try { nextInp.setSelectionRange(pos, pos); } catch (e) {} }
      });
      const clr = $("#conv-clear-btn", conv);
      if (clr) clr.addEventListener("click", () => { convSearchQuery = ""; renderBottomTools(); focusControl("#conv-search-inp"); });
      $$("[data-conv-br]", conv).forEach(b => b.addEventListener("click", () => {
        convBranchIdx = b.dataset.convBr; renderBottomTools(); focusControl(`[data-conv-br="${convBranchIdx}"]`);
      }));
      $$("[data-conv-sec]", conv).forEach(b => b.addEventListener("click", () => {
        convSecFilter = b.dataset.convSec; renderBottomTools(); focusControl(`[data-conv-sec="${convSecFilter}"]`);
      }));
    }

    /* ── 工具 3：📝 2026 全套官方表格 (AYP/01–14) 搜尋器 ＋ ✍️ 評核員具體評語產生器 ── */
    const forms2 = $("#bt-forms-body");
    if (forms2 && PW) {
      const CB = PW.commentBuilder;
      const cats = ["all", "參加及轉換", "訓練及評核", "章級完成", "支部及行政"];
      const catLabelsEn = { "參加及轉換": "Joining & transfers", "訓練及評核": "Training & assessment", "章級完成": "Award completion", "支部及行政": "Unit administration" };
      const catLabel = cat => LANG === "en" ? (catLabelsEn[cat] || cat) : cat;
      const fq = formSearchQuery.trim().toLowerCase();
      const matchedForms = PW.fullForms.filter(f => {
        if (formCatFilter !== "all" && f.cat !== formCatFilter) return false;
        if (!fq) return true;
        return f.code.toLowerCase().includes(fq) || f.name.toLowerCase().includes(fq) || f.note.toLowerCase().includes(fq);
      });

      const secObj = CB.secOptions.find(s => s.id === cmtSecId) || CB.secOptions[0];
      const secObjZh = LOCALES["zh-HK"].POWER.commentBuilder.secOptions.find(s => s.id === cmtSecId) || LOCALES["zh-HK"].POWER.commentBuilder.secOptions[0];
      const lvNameZh = { bronze: "銅章級", silver: "銀章級", gold: "金章級" }[cmtLvKey] || "銅章級";
      const lvNameEn = { bronze: "Bronze Award", silver: "Silver Award", gold: "Gold Award" }[cmtLvKey] || "Bronze Award";
      const genZh = CB.generateZh(secObjZh, lvNameZh, cmtActName, cmtHours, cmtWeeks);
      const genEn = CB.generateEn(secObj.id, lvNameEn, cmtActName, cmtHours, cmtWeeks);

      forms2.innerHTML = `
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .35rem;color:#0a5c36">${LANG === "en" ? "AYP Forms Finder" : "AYP 常用表格搜尋"}</h3>
          <div class="filter-row">
            <label class="sr-only" for="form-search-inp">${LANG === "en" ? "Search forms" : "搜尋表格"}</label>
            <input type="search" class="search-input" id="form-search-inp" placeholder="${LANG === "en" ? "Search form code or purpose (e.g. AYP/07, AYP/08, Gold, transfer...)" : "輸入表格編號或用途（例：AYP/07、AYP/08、金章、轉處、統計...）"}" value="${esc(formSearchQuery)}">
          </div>
          <div class="chips">
            ${cats.map(cKey => `<button class="chip ${formCatFilter === cKey ? "active" : ""}" data-form-cat="${cKey}" aria-pressed="${formCatFilter === cKey}">${cKey === "all" ? (LANG === "en" ? "All categories" : "全部類別") : esc(catLabel(cKey))}</button>`).join("")}
          </div>
          <p class="hint" role="status">${LANG === "en" ? `${matchedForms.length} results. Verify current forms before submitting.` : `找到 ${matchedForms.length} 項；提交前請核實表格版本。`}</p>
          ${matchedForms.length ? `<table class="forms"><tbody>
            ${matchedForms.map(f => `
              <tr>
                <td class="no"><b>${esc(f.code)}</b><small>${esc(catLabel(f.cat))}</small></td>
                <td>
                  <b>${esc(f.name)}</b>
                  <small>${esc(f.note)}</small>
                  <a href="${esc(f.url)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:.2rem">${esc(t.formsDownload)} ↗</a>
                </td>
              </tr>`).join("")}
            </tbody></table>` : `<div class="wz-empty">${LANG === "en" ? "No matching forms. Try another search or category." : "找不到符合條件的表格，請嘗試其他關鍵字或類別。"}</div>`}
        </div>

        <div class="tool-card">
          <h3 style="margin:.1rem 0 .3rem;color:#0a5c36">${esc(CB.title)}</h3>
          <p class="hint" style="margin:0 0 .6rem">${esc(CB.sub)}</p>
          <div class="calc-grid">
            <div class="field-box">
              <label for="cmt-sec-sel">${LANG === "en" ? "① Section" : "① 揀科目"}</label>
              <select id="cmt-sec-sel">
                ${CB.secOptions.map(s => `<option value="${s.id}" ${s.id === cmtSecId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
              </select>
            </div>
            <div class="field-box">
              <label for="cmt-lv-sel">${LANG === "en" ? "② Award Level" : "② 揀章級"}</label>
              <select id="cmt-lv-sel">
                <option value="bronze" ${cmtLvKey === "bronze" ? "selected" : ""}>${LANG === "en" ? "Bronze" : "銅章"}</option>
                <option value="silver" ${cmtLvKey === "silver" ? "selected" : ""}>${LANG === "en" ? "Silver" : "銀章"}</option>
                <option value="gold" ${cmtLvKey === "gold" ? "selected" : ""}>${LANG === "en" ? "Gold" : "金章"}</option>
              </select>
            </div>
            <div class="field-box">
              <label for="cmt-act-inp">${LANG === "en" ? "③ Activity name (optional)" : "③ 實際活動名稱（選填）"}</label>
              <input type="text" id="cmt-act-inp" placeholder="${esc(secObj.defaultAct)}" value="${esc(cmtActName)}">
            </div>
            <div class="field-box">
              <label for="cmt-h-inp">${LANG === "en" ? "④ Verified hours and weeks (optional)" : "④ 已核實時數及星期數（選填）"}</label>
              <div style="display:flex;gap:.4rem">
                <input type="number" id="cmt-h-inp" min="0" max="500" step="0.5" value="${esc(cmtHours)}" aria-label="${LANG === "en" ? "Verified hours" : "已核實時數"}">
                <input type="number" id="cmt-w-inp" min="0" max="200" step="1" value="${esc(cmtWeeks)}" aria-label="${LANG === "en" ? "Verified weeks" : "已核實星期數"}">
              </div>
            </div>
          </div>

          <b style="color:#0a5c36;font-size:.88rem;display:block;margin-top:.4rem">${LANG === "en" ? "Chinese draft — complete from actual records:" : "中文草稿：請按實際紀錄補充"}</b>
          <div class="cmt-output" id="cmt-zh-out">${esc(genZh)}</div>
          <b style="color:#0a5c36;font-size:.88rem;display:block;margin-top:.4rem">${LANG === "en" ? "English draft — complete from actual records:" : "英文草稿：請按實際紀錄補充"}</b>
          <div class="cmt-output" id="cmt-en-out">${esc(genEn)}</div>

          <div class="plan-actions">
            <button class="btn primary" id="cmt-copy-zh">📋 ${LANG === "en" ? "Copy Chinese Comment" : "複製中文評語"}</button>
            <button class="btn ghost" id="cmt-copy-en">📋 ${LANG === "en" ? "Copy English Comment" : "複製英文評語"}</button>
          </div>
          <div id="cmt-toast" role="status" aria-live="polite"></div>
        </div>`;

      const fInp = $("#form-search-inp", forms2);
      if (fInp) fInp.addEventListener("input", () => {
        formSearchQuery = fInp.value;
        const pos = fInp.selectionStart;
        renderBottomTools();
        const nextInp = $("#form-search-inp", forms2);
        if (nextInp) { nextInp.focus(); try { nextInp.setSelectionRange(pos, pos); } catch (e) {} }
      });
      $$("[data-form-cat]", forms2).forEach(b => b.addEventListener("click", () => {
        formCatFilter = b.dataset.formCat; renderBottomTools(); focusControl(`[data-form-cat="${formCatFilter}"]`);
      }));

      const secSel = $("#cmt-sec-sel", forms2);
      if (secSel) secSel.addEventListener("change", () => { cmtSecId = secSel.value; renderBottomTools(); focusControl("#cmt-sec-sel"); });
      const lvSel = $("#cmt-lv-sel", forms2);
      if (lvSel) lvSel.addEventListener("change", () => {
        cmtLvKey = lvSel.value;
        renderBottomTools(); focusControl("#cmt-lv-sel");
      });
      const actInp = $("#cmt-act-inp", forms2);
      if (actInp) actInp.addEventListener("input", () => {
        cmtActName = actInp.value;
        const zOut = $("#cmt-zh-out", forms2), eOut = $("#cmt-en-out", forms2);
        if (zOut) zOut.textContent = CB.generateZh(secObjZh, lvNameZh, cmtActName, cmtHours, cmtWeeks);
        if (eOut) eOut.textContent = CB.generateEn(secObj.id, lvNameEn, cmtActName, cmtHours, cmtWeeks);
      });
      const hInp = $("#cmt-h-inp", forms2), wInp = $("#cmt-w-inp", forms2);
      const onHW = () => {
        cmtHours = hInp.validity.valid ? hInp.value : "";
        cmtWeeks = wInp.validity.valid ? wInp.value : "";
        const zOut = $("#cmt-zh-out", forms2), eOut = $("#cmt-en-out", forms2);
        if (zOut) zOut.textContent = CB.generateZh(secObjZh, lvNameZh, cmtActName, cmtHours, cmtWeeks);
        if (eOut) eOut.textContent = CB.generateEn(secObj.id, lvNameEn, cmtActName, cmtHours, cmtWeeks);
      };
      if (hInp) hInp.addEventListener("input", onHW);
      if (wInp) wInp.addEventListener("input", onHW);

      const cpZh = $("#cmt-copy-zh", forms2), cpEn = $("#cmt-copy-en", forms2);
      if (cpZh) cpZh.addEventListener("click", () => copyTextWithToast($("#cmt-zh-out", forms2).textContent, $("#cmt-toast", forms2), PW.labels.copiedToast));
      if (cpEn) cpEn.addEventListener("click", () => copyTextWithToast($("#cmt-en-out", forms2).textContent, $("#cmt-toast", forms2), PW.labels.copiedToast));
    }

    /* ── 工具 4：🏢 查執行處／組長 ＋ 🏕️ 領袖／UUL 三階段防退件核對清單 ── */
    const oa = $("#bt-oa-body");
    if (oa && PW) {
      const OA = L().OA_LOOKUP, UC = PW.uulChecklists;
      const uulState = loadJson(UUL_CHK_KEY, {});
      oa.innerHTML = `
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .3rem;color:#0a5c36">${esc(UC.title)}</h3>
          <p class="hint" style="margin:0 0 .6rem">${esc(UC.sub)}</p>
          ${UC.groups.map(grp => {
            const doneC = grp.items.filter((_, idx) => !!uulState[grp.id + ":" + idx]).length;
            return `<div style="margin:.8rem 0">
              <b style="color:#0a5c36;display:block;margin-bottom:.3rem">${esc(grp.title)}（${doneC}/${grp.items.length}）</b>
              <ol class="todo">
                ${grp.items.map((itemText, idx) => {
                  const k = grp.id + ":" + idx;
                  return `<li class="${uulState[k] ? "done" : ""}">
                    <label>
                      <input type="checkbox" data-uul-chk="${esc(k)}" ${uulState[k] ? "checked" : ""}>
                      <span class="todo-n">${idx + 1}</span>
                      <span>${esc(itemText)}</span>
                    </label>
                  </li>`;
                }).join("")}
              </ol>
            </div>`;
          }).join("")}
        </div>

        <p>${esc(OA.intro)}</p>
        <ul class="oa-links">${OA.links.map(l =>
          `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>
        <p><b>${esc(OA.regionsTitle)}</b></p>
        <table class="oa-regions"><tbody>${OA.regions.map(r =>
          `<tr><td>${esc(r.name)}</td><td>${esc(r.tel)}</td></tr>`).join("")}</tbody></table>
        <div class="warn">${esc(OA.caveat)}</div>`;

      $$("[data-uul-chk]", oa).forEach(box => box.addEventListener("change", () => {
        const s = loadJson(UUL_CHK_KEY, {});
        s[box.dataset.uulChk] = box.checked;
        saveJson(UUL_CHK_KEY, s); renderBottomTools(); focusControl(`[data-uul-chk="${box.dataset.uulChk}"]`);
      }));
    }
  }

  /* ═══════════ 30 秒睇懂 ＋ 版權 ＋ 浮動掣 ═══════════ */
  function renderTldr() {
    const SECT = L().SECTION_TLDR, t = UI();
    $$("[data-tldr]").forEach(el => {
      const tx = SECT[el.dataset.tldr];
      if (tx) el.innerHTML = `<span class="tldr-tag">${esc(t.tldrTag)}</span> ${esc(tx)}`;
    });
  }
  function renderCopyright() {
    const C = L().COPYRIGHT;
    const l1 = $("#copyright-line"); if (l1) l1.textContent = C.copyrightOnly || C.appLine;
    const l2 = $("#copyright-data"); if (l2) l2.textContent = C.dataLine;
    const l3 = $("#copyright-edu"); if (l3) l3.textContent = C.eduLine;
  }
  function bindFloatBtns() {
    const top = $("#fab-top");
    if (top) {
      const onScroll = () => top.classList.toggle("show", window.scrollY > 600);
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
      top.addEventListener("click", smoothTop);
    }
    const lang = $("#fab-lang");
    if (lang) lang.addEventListener("click", () => {
      const next = LANG === "zh-HK" ? "en" : "zh-HK";
      setLang(next);
    });
  }

  /* ═══════════ 常規區塊 ═══════════ */
  function renderCommon() {
    const t = UI();
    const FAQ = L().FAQ, GLOSSARY = L().GLOSSARY, FORMS = L().FORMS, COMPLETE = L().COMPLETE,
      TIMELINE = L().TIMELINE, DISCLAIMER = L().DISCLAIMER, SOURCES = L().SOURCES;

    // FAQ
    const faq = $("#faq-list");
    if (faq) faq.innerHTML = FAQ.map((f, i) => part("faq-" + i,
      `<span class="q-ico">Q</span><span class="sum-text"><b>${esc(f.q)}</b></span>`,
      `<p><b>${esc(t.aLabel)}</b>${esc(f.a)}</p>`)).join("");

    // 辭典
    const gl = $("#glossary-list");
    if (gl) gl.innerHTML = GLOSSARY.map((g, i) => part("gl-" + i,
      `<b>${esc(g.term)}</b>`, `<p>${esc(g.def)}</p>`)).join("");

    // 表格
    const forms = $("#forms-list");
    if (forms) forms.innerHTML = `<table class="forms"><tbody>` + FORMS.map(f =>
      `<tr><td class="no">${esc(f.no)}</td><td><b>${esc(f.name)}</b><small>${esc(f.note)}</small></td></tr>`).join("") + `</tbody></table>`;

    // 完成之後
    const comp = $("#complete-steps");
    if (comp) comp.innerHTML = `<ol class="steps">${COMPLETE.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="tip">💡 ${esc(COMPLETE.tip)}</div>`;

    // 時間表
    const tl = $("#timeline");
    if (tl) tl.innerHTML = TIMELINE.map(tt => `<div class="tl"><span class="tl-age">${esc(tt.age)}</span><p>${esc(tt.text)}</p></div>`).join("");

    // 免責
    const disc = $("#disclaimer");
    if (disc) disc.innerHTML = `<h3>${esc(t.disclaimerTitle)}</h3><p>${esc(DISCLAIMER)}</p>`;

    // 來源
    const src = $("#sources");
    if (src) src.innerHTML = `<ul class="source-list">${SOURCES.map(s =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>`;
  }

  /* ═══════════ 全部重繪（切換語言時用） ═══════════ */
  function renderAll() {
    renderStaticText();
    renderTopBar();
    renderBottomBar();
    renderPowerBanner();
    renderWizard();
    renderNormalCard();
    renderCalculator();
    renderBeginner();
    renderTldr();
    renderCopyright();
    renderTransferIn();
    renderTransferInSteps();
    renderConvertSync();
    renderConvertMap();
    renderSectionPaths();
    renderJoinFlow();
    renderExtras("#extra-list", L().EXTRA_CASES);
    renderExtras("#extra-list-2", L().EXTRA_CASES_2);
    renderBottomTools();
    renderCommon();
    applyStaticOpenState();
    bindPartToggles();
    syncViewUI();
  }

  /* ═══════════ 初始＋首次自動進精靈 ═══════════ */
  function isFirstVisit() { return !storeRead(VISIT_KEY) && !storeRead(FIRST_VISIT_KEY); }
  function markVisited() { storeWrite(VISIT_KEY, "1"); storeWrite(FIRST_VISIT_KEY, "1"); }
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    bindFloatBtns();
    bindViews();
    // 第一次進APP自動進入精靈了解需要
    if (isFirstVisit()) {
      showView("quick", false);
      markVisited();
    }
  });
})();
