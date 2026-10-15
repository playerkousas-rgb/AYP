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

  function loadOpen() { try { return JSON.parse(localStorage.getItem(OPEN_KEY)) || {}; } catch (e) { return {}; } }
  function saveOpen(o) { try { localStorage.setItem(OPEN_KEY, JSON.stringify(o)); } catch (e) {} }
  function smoothTo(el, block) { if (!el) return; try { if (typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: block || "start" }); } catch (e) {} }
  function smoothTop() { try { if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  /* ═══════════ 語言 / Language ═══════════ */
  function detectDefaultLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LOCALES[saved]) return saved;
    } catch (e) {}
    return "zh-HK";
  }
  let LANG = detectDefaultLang();
  function L() { return LOCALES[LANG]; }
  function UI() { return LOCALES[LANG].UI; }
  function setLang(lang) {
    if (!LOCALES[lang] || lang === LANG) return;
    LANG = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = L().htmlLang;
    renderAll();
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

  // 開合狀態事件綁定
  function bindPartToggles() {
    $$("details.part").forEach(d => {
      const k = d.dataset.key; const state = loadOpen();
      if (state[k] === undefined) state[k] = d.hasAttribute("open");
      d.addEventListener("toggle", () => { state[k] = d.open; saveOpen(state); });
    });
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
    const startFormsAction = L().BOTTOM_ACTIONS.find(b => b.id === "start-forms");
    if (startFormsAction) setText("bt-forms-summary", startFormsAction.label);
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
              `<button class="chip ${k === inLevel ? "active" : ""}" data-lv="${k}" style="--c:${LV[k].color}">${LV[k].icon} ${esc(LV[k].name)}</button>`).join("")}</div>
          </div>
          <div class="ti-done">
            <b>${esc(t.tickDone)}</b>
            <div class="chips">${must.map(k =>
              `<button class="chip tick ${inDone[k] ? "active" : ""}" data-sec="${k}" style="--c:#0a5c36">${FS[k].icon} ${esc(secName(k))}${inDone[k] ? " ✓" : ""}</button>`).join("")}</div>
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
      inLevel = b.dataset.lv; renderTransferIn();
    }));
    $$("[data-sec]", step).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.sec; inDone[k] = !inDone[k]; renderTransferIn();
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
  function loadTodo() { try { return JSON.parse(localStorage.getItem(TODO_KEY)) || {}; } catch (e) { return {}; } }
  function saveTodo(o) { try { localStorage.setItem(TODO_KEY, JSON.stringify(o)); } catch (e) {} }

  function renderWizard() {
    const c = $("#wizard"); if (!c) return;
    const W = L().WIZARD, t = UI();
    const stepDone = (wzRole ? 1 : 0) + (wzStatus ? 1 : 0);
    c.innerHTML = `
      <div class="wz-progress"><div class="wz-bar" style="width:${stepDone / 2 * 100}%"></div></div>
      <p class="wz-step-label">${stepDone === 2 ? esc(t.wizDone) : esc(t.wizStep(stepDone + 1, !wzRole ? t.wizQ1 : t.wizQ2))}</p>
      <div class="wz-group">
        <b>${esc(t.wizRoleHeading)}</b>
        <div class="wz-grid">${W.roles.map(r =>
          `<button class="wz-opt ${wzRole === r.id ? "active" : ""}" data-wz-role="${r.id}">
            <span class="wz-ico">${r.icon}</span><span class="wz-t">${esc(r.label)}</span><small>${esc(r.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div class="wz-group">
        <b>${esc(t.wizStatusHeading)}</b>
        <div class="wz-grid">${W.statuses.map(s =>
          `<button class="wz-opt ${wzStatus === s.id ? "active" : ""}" data-wz-status="${s.id}">
            <span class="wz-ico">${s.icon}</span><span class="wz-t">${esc(s.label)}</span><small>${esc(s.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div id="wz-result">${wzStatus ? wizardResultHtml() : `<div class="wz-empty">${esc(t.wizEmpty)}</div>`}</div>`;

    $$("[data-wz-role]", c).forEach(b => b.addEventListener("click", () => {
      wzRole = b.dataset.wzRole; renderWizard();
      if (wzStatus) smoothTo($("#wz-result"), "nearest");
    }));
    $$("[data-wz-status]", c).forEach(b => b.addEventListener("click", () => {
      wzStatus = b.dataset.wzStatus; renderWizard();
      smoothTo($("#wz-result"), "nearest");
    }));
    bindTodo(c);
    const reset = $("#wz-reset", c);
    if (reset) reset.addEventListener("click", () => { wzRole = null; wzStatus = null; renderWizard(); });
  }

  function wizardResultHtml() {
    const P = L().PLANS, W = L().WIZARD, t = UI();
    const p = P[wzStatus]; if (!p) return "";
    const todo = loadTodo();
    const key = "wz-" + wzStatus;
    const checked = todo[key] || [];
    const doneCount = p.steps.filter((_, i) => checked[i]).length;
    return `<div class="plan-card">
      <div class="plan-head"><span class="plan-ico">${p.icon}</span>
        <div><b>📍 ${esc(p.pos)}</b><div class="plan-route">${esc(t.routeLabel)}${esc(p.route)}</div></div></div>
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
      todo[key] = todo[key] || [];
      todo[key][+idx] = box.checked;
      saveTodo(todo);
      renderWizard();
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
      `<button class="tb-btn" data-tt="${esc(q.target)}"><span class="tb-ico">${q.icon}</span><span class="tb-lbl">${esc(q.label)}</span></button>`
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
      `<button class="bb-btn" data-tv="${esc(b.target)}"><span class="bb-ico">${b.icon}</span><span class="bb-lbl">${esc(b.label)}</span></button>`
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
  function showView(key) {
    document.body.dataset.view = (VIEWS.indexOf(key) !== -1) ? key : "normal";
    syncViewUI();
    if (key === "quick") renderWizard();
    if (key === "normal") renderNormalCard();
    try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function syncViewUI() {
    const cur = document.body.dataset.view || "normal";
    $$("#bottombar [data-tv]").forEach(a => a.classList.toggle("active", a.dataset.tv === cur));
    $$("#topbar [data-tt]").forEach(a => a.classList.toggle("active", a.dataset.tt === cur));
  }
  function bindViews() {
    $$("[data-tv-home]").forEach(b => b.addEventListener("click", () => showView("normal")));
  }
  function openDetail(key) {
    const d = document.querySelector(`.part[data-key="${key}"]`);
    if (!d) return;
    if (typeof d.open === "boolean") d.open = true;
    smoothTo(d);
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
      <div class="plan-head"><span class="plan-ico">${p.icon}</span>
        <div><b>📍 ${esc(p.pos)}</b><div class="plan-route">${esc(t.routeLabel)}${esc(p.route)}</div></div></div>
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
      const td = loadTodo(); td[parts[0]] = td[parts[0]] || []; td[parts[0]][+parts[1]] = box.checked;
      saveTodo(td); renderNormalCard();
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

  function loadJson(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function saveJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function addDays(dateStr, days) {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function diffDaysFromToday(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr + "T00:00:00");
    if (isNaN(target.getTime())) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }
  function copyTextWithToast(text, toastEl, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (toastEl) {
      toastEl.innerHTML = `<span class="toast-msg">${esc(msg)}</span>`;
      setTimeout(() => { if (toastEl) toastEl.innerHTML = ""; }, 3500);
    }
  }

  /* ── 頂部 4 大實戰神器快跳橫幅 ── */
  function renderPowerBanner() {
    const c = $("#power-banner"); if (!c) return;
    const isEn = LANG === "en";
    c.innerHTML = `
      <div class="power-banner">
        <div class="power-banner-head">
          <b>🚀 ${isEn ? "2026 Interactive Toolkit (What the Official Site Doesn't Have)" : "2026 互動實戰工具箱（童軍新官網冇嘅 4 大神器）"}</b>
          <span class="power-badge">${isEn ? "Members + Leaders/UUL" : "成員 ＋ 領袖/UUL 雙線適用"}</span>
        </div>
        <div class="power-grid">
          <button class="pw-btn" data-pw-jump="calc">
            <b>🧮 ${isEn ? "Hours, Weeks & Deadlines" : "時數・週數・死線計算器"}</b>
            <small>${isEn ? "Auto-calc completion date, age 23/25 & Gold 2-mo deadline" : "自動計最快完成日、23/25歲死線、金章提前2個月交表"}</small>
          </button>
          <button class="pw-btn" data-pw-view="bt-sync">
            <b>🔗 ${isEn ? "2026 Sync Scheme Checker" : "2026 同步完成對接核對"}</b>
            <small>${isEn ? "Tick off Scout items → check missing AYP steps & EA log" : "高級章→銅／總領袖→銀逐項剔＋野外EA紀錄產生器"}</small>
          </button>
          <button class="pw-btn" data-pw-view="bt-conv">
            <b>🔍 ${isEn ? "Badge ↔ 5 Sections Matcher" : "跨支部徽章 ↔ 五科搜尋"}</b>
            <small>${isEn ? "Instant badge search + 8 cancelled badges alert" : "秒查童軍/深資/樂行徽章對接＋8個已取消徽章防伏"}</small>
          </button>
          <button class="pw-btn" data-pw-view="bt-forms">
            <b>✍️ ${isEn ? "Comment Builder & Forms" : "評語產生器 ＋ AYP/01-14"}</b>
            <small>${isEn ? "Bilingual Assessor comments + UUL 3-stage checklists" : "一鍵生成防退件具體評語＋全套2026新表格＋UUL清單"}</small>
          </button>
        </div>
      </div>`;
    $$("[data-pw-jump='calc']", c).forEach(b => b.addEventListener("click", () => {
      const el = $("#calc-sec"); if (el) smoothTo(el);
    }));
    $$("[data-pw-view]", c).forEach(b => b.addEventListener("click", () => {
      showView(b.dataset.pwView);
    }));
  }

  /* ── 神器 1：🧮 AYP 時數・週數・死線計算器 ＋ 個人進度追蹤 ── */
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

    let st = loadJson(CALC_KEY, defaultCalcState());
    if (!paths[st.path]) st.path = "bronze";
    if (!st.sec) st.sec = defaultCalcState().sec;
    const p = paths[st.path];

    // Age & 23/25 deadline calculation
    let ageHtml = "";
    if (st.birthDate) {
      const bd = new Date(st.birthDate + "T00:00:00");
      if (!isNaN(bd.getTime())) {
        const now = new Date();
        let months = (now.getFullYear() - bd.getFullYear()) * 12 + (now.getMonth() - bd.getMonth());
        if (now.getDate() < bd.getDate()) months--;
        const yrs = Math.floor(months / 12), mos = Math.max(0, months % 12);
        const dl23 = `${bd.getFullYear() + 23}-${String(bd.getMonth() + 1).padStart(2, "0")}-${String(bd.getDate()).padStart(2, "0")}`;
        const dl25 = `${bd.getFullYear() + 25}-${String(bd.getMonth() + 1).padStart(2, "0")}-${String(bd.getDate()).padStart(2, "0")}`;
        const d23 = diffDaysFromToday(dl23), d25 = diffDaysFromToday(dl25);
        let eligMsg = "";
        if (yrs < (p.specialAge || p.minAge)) {
          eligMsg = LANG === "en"
            ? `⚠️ Below minimum age (${p.minAge}) for ${p.name}. Activities before reaching eligible age & Record Book issue cannot be backdated.`
            : `⚠️ 目前未滿 ${p.name} 最低年齡（${p.minAge} 歲${p.specialAge ? `／特別安排 ${p.specialAge} 歲` : ""}），未夠齡及未獲發紀錄簿前嘅活動不可追溯。`;
        } else if (p.specialAge && yrs === p.specialAge) {
          eligMsg = LANG === "en"
            ? `💡 Age 13 Bronze Special Arrangement applies: complete Orientation, apply for OA discretionary approval, and participate in a group with eligible peers.`
            : `💡 符合「13 歲銅章特別安排」：須完成迎新講座、由執行處按個別情況酌情批准，並與適齡朋友以小組形式進行活動。`;
        } else {
          eligMsg = LANG === "en"
            ? `✅ Meets minimum age requirement (≥${p.minAge}) for ${p.name}.`
            : `✅ 符合 ${p.name} 最低年齡要求（≥${p.minAge} 歲）。`;
        }
        ageHtml = `<div class="diag-box age">
          <h4>${esc(lb.ageCheckTitle)}</h4>
          <ul>
            <li><b>${esc(lb.ageNow(yrs, mos))}</b> — ${esc(eligMsg)}</li>
            <li>${esc(lb.deadline23)}<b>${esc(dl23)}</b> ${d23 !== null ? esc(lb.daysLeft(d23)) : ""}</li>
            <li>${esc(lb.deadline25)}<b>${esc(dl25)}</b> ${d25 !== null ? esc(lb.daysLeft(d25)) : ""}</li>
          </ul>
        </div>`;
      }
    }

    // Gold 2-month pre-submission calculation
    let goldHtml = "";
    if (p.isGold) {
      const refDate = st.goldTargetDate || st.startDate;
      const regDl = refDate ? addDays(refDate, -60) : null;
      const uulDl = refDate ? addDays(refDate, -75) : null;
      goldHtml = `<div class="diag-box gold-dl">
        <h4>${esc(lb.goldDeadlineTitle)}</h4>
        <p style="margin:.2rem 0">${LANG === "en"
          ? "Gold participants must submit FORM AYP/02–06 + activity plan signed by UUL to the Regional Office AT LEAST 2 MONTHS before starting any Section:"
          : "新官網規定：金章參加者必須於各科活動開始「最少兩個月前」，將 UUL 簽署確認嘅 AYP/02–06 及活動計劃書交抵地域辦事處（轉交青少年活動署確認及安排約見）："}</p>
        ${refDate ? `<ul>
          <li>${esc(lb.goldUulDate)}<b>${esc(uulDl)}</b></li>
          <li>${esc(lb.goldRegionalDate)}<b>${esc(regDl)}</b></li>
        </ul>` : `<p style="margin:.2rem 0;font-weight:700">${LANG === "en" ? "👆 Enter a Planned Gold Section Start Date above to calculate exact submission deadlines." : "👆 請喺上方輸入「金章預計科目開始日」，即刻幫你倒推最遲交表日期！"}</p>`}
      </div>`;
    }

    const threeSecs = ["service", "skill", "physical"];
    const secCardsHtml = threeSecs.map(k => {
      const isMain = p.splitMain && st.mainSec === k;
      const reqH = isMain ? p.mainH : p.subH;
      const reqW = isMain ? p.mainW : p.subW;
      const curH = Math.max(0, Number((st.sec[k] && st.sec[k].h) || 0));
      const curW = Math.max(0, Number((st.sec[k] && st.sec[k].w) || 0));
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
            <label>${esc(lb.hoursLogged)}（目標 ${reqH}h）</label>
            <input type="number" min="0" max="500" step="0.5" data-calc-h="${k}" value="${curH}">
          </div>
          <div>
            <label>${esc(lb.weeksLogged)}（目標 ${reqW}w）</label>
            <input type="number" min="0" max="200" step="1" data-calc-w="${k}" value="${curW}">
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
        <div>
          <b style="color:#0a5c36;font-size:.9rem">${esc(lb.pickPath)}</b>
          <div class="chips">${Object.keys(paths).map(k =>
            `<button class="chip ${st.path === k ? "active" : ""}" data-calc-path="${k}">${esc(paths[k].name)}</button>`
          ).join("")}</div>
        </div>
        <div class="tip" style="margin:.4rem 0">${esc(p.note)}</div>

        ${p.splitMain ? `
          <div style="margin:.6rem 0">
            <b style="color:#0a5c36;font-size:.9rem">${esc(lb.pickMain)}</b>
            <div class="chips">${threeSecs.map(k =>
              `<button class="chip ${st.mainSec === k ? "active" : ""}" data-calc-main="${k}">${FS[k].icon} ${esc(FS[k].name)}（${p.mainH}h / ${p.mainW}w）</button>`
            ).join("")}</div>
          </div>` : `<div class="ok-box">${esc(lb.noSplitHint)}</div>`}

        <div class="calc-grid">
          <div class="field-box">
            <label for="calc-start-date">${esc(lb.startDate)}</label>
            <input type="date" id="calc-start-date" value="${esc(st.startDate)}">
          </div>
          <div class="field-box">
            <label for="calc-birth-date">${esc(lb.birthDate)}</label>
            <input type="date" id="calc-birth-date" value="${esc(st.birthDate)}">
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
        <div id="calc-toast"></div>
      </div>`;

    $$("[data-calc-path]", c).forEach(b => b.addEventListener("click", () => {
      st.path = b.dataset.calcPath; saveJson(CALC_KEY, st); renderCalculator();
    }));
    $$("[data-calc-main]", c).forEach(b => b.addEventListener("click", () => {
      st.mainSec = b.dataset.calcMain; saveJson(CALC_KEY, st); renderCalculator();
    }));
    const sd = $("#calc-start-date", c);
    if (sd) sd.addEventListener("change", () => { st.startDate = sd.value; saveJson(CALC_KEY, st); renderCalculator(); });
    const bd = $("#calc-birth-date", c);
    if (bd) bd.addEventListener("change", () => { st.birthDate = bd.value; saveJson(CALC_KEY, st); renderCalculator(); });
    const gd = $("#calc-gold-date", c);
    if (gd) gd.addEventListener("change", () => { st.goldTargetDate = gd.value; saveJson(CALC_KEY, st); renderCalculator(); });

    $$("[data-calc-h]", c).forEach(inp => inp.addEventListener("change", () => {
      const k = inp.dataset.calcH;
      st.sec[k] = st.sec[k] || { h: 0, w: 0 };
      st.sec[k].h = Math.max(0, Number(inp.value) || 0);
      saveJson(CALC_KEY, st); renderCalculator();
    }));
    $$("[data-calc-w]", c).forEach(inp => inp.addEventListener("change", () => {
      const k = inp.dataset.calcW;
      st.sec[k] = st.sec[k] || { h: 0, w: 0 };
      st.sec[k].w = Math.max(0, Number(inp.value) || 0);
      saveJson(CALC_KEY, st); renderCalculator();
    }));
    const expBox = $("#calc-exp-done", c);
    if (expBox) expBox.addEventListener("change", () => {
      st.sec.expedition = { done: expBox.checked }; saveJson(CALC_KEY, st); renderCalculator();
    });
    const resBox = $("#calc-res-done", c);
    if (resBox) resBox.addEventListener("change", () => {
      st.sec.residential = { done: resBox.checked }; saveJson(CALC_KEY, st); renderCalculator();
    });

    const resetBtn = $("#calc-reset-btn", c);
    if (resetBtn) resetBtn.addEventListener("click", () => {
      saveJson(CALC_KEY, defaultCalcState()); renderCalculator();
    });
    const copyBtn = $("#calc-copy-btn", c);
    if (copyBtn) copyBtn.addEventListener("click", () => {
      const lines = [
        `【AYP 進度報告 / AYP Progress Report】`,
        `章級路徑 Path: ${p.name}`,
        `正式開展日 Start Date: ${st.startDate || "未填 / Not set"}`,
      ];
      threeSecs.forEach(k => {
        const isMain = p.splitMain && st.mainSec === k;
        const reqH = isMain ? p.mainH : p.subH;
        const reqW = isMain ? p.mainW : p.subW;
        const curH = (st.sec[k] && st.sec[k].h) || 0;
        const curW = (st.sec[k] && st.sec[k].w) || 0;
        const earliest = st.startDate ? addDays(st.startDate, reqW * 7) : "-";
        lines.push(`- ${FS[k].name}: ${curH}/${reqH}h, ${curW}/${reqW}w (最快完成 Earliest: ${earliest})`);
      });
      lines.push(`- ${FS.expedition.name}: ${expDone ? "✅ 已完成 Completed" : "⏳ 進行中 In progress"}`);
      if (p.resText) lines.push(`- ${FS.residential.name}: ${resDone ? "✅ 已完成 Completed" : "⏳ 進行中 In progress"}`);
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
  let cmtHours = 26;
  let cmtWeeks = 26;

  function renderBottomTools() {
    const PW = L().POWER, t = UI();

    /* ── 工具 1：📋 2026 同步完成方案 ＋ 互動逐項核對器 ＋ EA 考驗人員紀錄產生器 ── */
    const sync = $("#bt-sync-body");
    if (sync && PW) {
      const SP = L().SYNC_PLAN, SC = PW.syncChecker;
      const chkState = loadJson(SYNC_CHK_KEY, {});
      const eaState = loadJson(EA_LOG_KEY, {
        memberName: "", awardRoute: "童軍高級獎章 → AYP 銅章", assessorName: "",
        assessorRole: "EA / JEA / CRS", assessorUnit: "", assessorContact: "",
        examItems: "探索A.2.c＋標準A.2.e＋高級A.2.f.I", examDates: "", examResult: "合格 Pass"
      });
      const curRoute = SC.routes[syncRouteKey] || SC.routes.bronze;
      const doneItems = curRoute.items.filter(it => !!chkState[it.id]);
      const missingItems = curRoute.items.filter(it => !chkState[it.id]);

      sync.innerHTML = `
        <div class="warn backdate">${t.backdateWarn}</div>
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .3rem;color:#0a5c36">${esc(SC.title)}</h3>
          <p class="hint" style="margin:0 0 .6rem">${esc(SC.sub)}</p>

          <div class="chips">
            ${Object.keys(SC.routes).map(rk =>
              `<button class="chip ${syncRouteKey === rk ? "active" : ""}" data-sync-route="${rk}">${esc(SC.routes[rk].label)}</button>`
            ).join("")}
          </div>

          <div class="sync-summary-banner">
            <div>
              <b>${esc(curRoute.badgePair)}</b>
              <div style="font-size:.82rem;color:#444;margin-top:.15rem">
                ${LANG === "en"
                  ? `Completed ${doneItems.length} / ${curRoute.items.length} requirements`
                  : `已剔選完成 ${doneItems.length} / ${curRoute.items.length} 項對接要求`}
              </div>
            </div>
            <button class="btn primary" id="sync-copy-btn" style="min-height:40px;padding:.45rem .85rem;font-size:.85rem">
              📋 ${LANG === "en" ? "Copy Sync Status" : "複製核對進度"}
            </button>
          </div>
          <div id="sync-toast"></div>

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
            ? `<div class="ok-box">🎉 ${LANG === "en" ? "All items for this sync route are checked! Submit to your UUL for dual sign-off." : "此同步路線全部要求已齊備！請連同紀錄簿交予執行處支部組長 (UUL) 辦理雙線審批。"}</div>`
            : `<div class="warn">🔎 <b>${LANG === "en" ? `Still missing (${missingItems.length} items):` : `目前尚欠 (${missingItems.length} 項)：`}</b>
                <ul style="margin:.3rem 0;padding-left:1.2rem">${missingItems.map(m => `<li><b>${esc(m.cat)}</b>：${esc(m.title)}</li>`).join("")}</ul>
              </div>`}

          <div class="tip" style="margin-top:.7rem">
            <a class="btn primary" href="${esc(SC.eformUrl)}" target="_blank" rel="noopener" style="display:inline-block;margin-bottom:.4rem">${esc(SC.eformBtn)} ↗</a>
            <div style="font-size:.82rem">${esc(SC.eformNote)}</div>
          </div>
        </div>

        <details class="part" data-key="ea-logger" open>
          <summary><span class="ico">🏕️</span> <span class="sum-text"><b>${esc(SC.eaLoggerTitle)}</b><small>${esc(SC.eaLoggerDesc)}</small></span><span class="chev">▾</span></summary>
          <div class="part-body">
            <div class="calc-grid">
              ${Object.keys(SC.eaFields).map(fk => `
                <div class="field-box">
                  <label>${esc(SC.eaFields[fk])}</label>
                  <input type="text" data-ea-field="${fk}" value="${esc(eaState[fk] || "")}">
                </div>`).join("")}
            </div>
            <div class="plan-actions">
              <button class="btn primary" id="ea-copy-btn">${esc(SC.eaCopyBtn)}</button>
            </div>
            <div id="ea-toast"></div>
          </div>
        </details>

        <div class="unofficial-badge">⚠️ ${esc(SP.effective)}</div>
        <p>${esc(SP.summary)}</p>
        <ol class="steps">${SP.points.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
        <div class="warn">${esc(SP.notifyLeader)}</div>
        <div class="warn">${esc(SP.verify)}</div>
        <p><a href="${esc(SP.source.url)}" target="_blank" rel="noopener">${esc(SP.source.label)} — ${esc(t.openOfficialLink)}</a></p>`;

      $$("[data-sync-route]", sync).forEach(b => b.addEventListener("click", () => {
        syncRouteKey = b.dataset.syncRoute; renderBottomTools();
      }));
      $$("[data-sync-chk]", sync).forEach(box => box.addEventListener("change", () => {
        const s = loadJson(SYNC_CHK_KEY, {});
        s[box.dataset.syncChk] = box.checked;
        saveJson(SYNC_CHK_KEY, s); renderBottomTools();
      }));
      const syncCopy = $("#sync-copy-btn", sync);
      if (syncCopy) syncCopy.addEventListener("click", () => {
        const txt = [
          `【2026 童軍↔AYP 同步完成核對清單】`,
          `路線：${curRoute.badgePair}`,
          `完成度：${doneItems.length} / ${curRoute.items.length}`,
          ...curRoute.items.map(it => `${chkState[it.id] ? "✅" : "⬜"} [${it.cat}] ${it.title}`)
        ].join("\n");
        copyTextWithToast(txt, $("#sync-toast", sync), PW.labels.copiedToast);
      });
      $$("[data-ea-field]", sync).forEach(inp => inp.addEventListener("input", () => {
        const s = loadJson(EA_LOG_KEY, eaState);
        s[inp.dataset.eaField] = inp.value;
        saveJson(EA_LOG_KEY, s);
      }));
      const eaCopy = $("#ea-copy-btn", sync);
      if (eaCopy) eaCopy.addEventListener("click", () => {
        const s = loadJson(EA_LOG_KEY, eaState);
        const lines = [
          `【2026 童軍同步完成試行方案 — 野外鍛鍊科考驗人員紀錄】`,
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
        q && (b.name.toLowerCase().includes(q) || b.en.toLowerCase().includes(q) || q.includes("護養") || q.includes("愛護動物") || q.includes("營地管理") || q.includes("國際友誼"))
      );

      const secKeys = ["all", "服務科", "技能科", "康樂體育科", "野外鍛鍊科", "團體生活科"];
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
          <h3 style="margin:.1rem 0 .35rem;color:#0a5c36">🔍 ${LANG === "en" ? "Interactive Badge ↔ AYP 5-Section Search & Matcher" : "跨支部徽章 ↔ AYP 五科即時搜尋配對器"}</h3>
          <div class="filter-row">
            <input type="search" class="search-input" id="conv-search-inp" placeholder="${LANG === "en" ? "Search badge/activity (e.g. First Aid, Canoe, Pioneering, R-A102...)" : "輸入徽章或活動名稱搜尋（例：急救、獨木舟、先鋒工程、攝影、R-A102、大露營...）"}" value="${esc(convSearchQuery)}">
            ${convSearchQuery ? `<button class="btn ghost" id="conv-clear-btn" style="min-height:42px;padding:.4rem .8rem">✕</button>` : ""}
          </div>
          <div class="chips">
            <button class="chip ${convBranchIdx === "all" ? "active" : ""}" data-conv-br="all">${LANG === "en" ? "All Sections" : "全部支部"}</button>
            ${CT.groups.map((g, idx) => `<button class="chip ${String(convBranchIdx) === String(idx) ? "active" : ""}" data-conv-br="${idx}">${esc(g.branch.split("參考")[0].split("reference")[0])}</button>`).join("")}
          </div>
          <div class="chips">
            ${secKeys.map(sk => `<button class="chip ${convSecFilter === sk ? "active" : ""}" data-conv-sec="${sk}">${sk === "all" ? (LANG === "en" ? "All 5 AYP Sections" : "全部五科") : esc(sk)}</button>`).join("")}
          </div>

          ${matchedCancelled.length > 0 ? `
            <div class="badge-cancel-alert">
              <b>🚫 ${LANG === "en" ? "CANCELLED BADGE ALERT (Circular P013/26, 2026-08-15):" : "防中伏警告：你搜尋嘅徽章已於 2026-08-15 通告 (P013/26) 正式取消！"}</b>
              <ul style="margin:.3rem 0;padding-left:1.2rem">
                ${matchedCancelled.map(b => `<li><b>${esc(b.name)}（${esc(b.group)} / ${esc(b.en)}）</b> — ${LANG === "en" ? "No longer issued; do NOT use for new AYP declarations." : "總會已停止簽發，切勿再用嚟申報新嘅 AYP 項目！"}</li>`).join("")}
              </ul>
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
      if (clr) clr.addEventListener("click", () => { convSearchQuery = ""; renderBottomTools(); });
      $$("[data-conv-br]", conv).forEach(b => b.addEventListener("click", () => {
        convBranchIdx = b.dataset.convBr; renderBottomTools();
      }));
      $$("[data-conv-sec]", conv).forEach(b => b.addEventListener("click", () => {
        convSecFilter = b.dataset.convSec; renderBottomTools();
      }));
    }

    /* ── 工具 3：📝 2026 全套官方表格 (AYP/01–14) 搜尋器 ＋ ✍️ 評核員具體評語產生器 ── */
    const forms2 = $("#bt-forms-body");
    if (forms2 && PW) {
      const CB = PW.commentBuilder;
      const cats = ["all", "參加及轉換", "訓練及評核", "章級完成", "支部及行政"];
      const fq = formSearchQuery.trim().toLowerCase();
      const matchedForms = PW.fullForms.filter(f => {
        if (formCatFilter !== "all" && f.cat !== formCatFilter) return false;
        if (!fq) return true;
        return f.code.toLowerCase().includes(fq) || f.name.toLowerCase().includes(fq) || f.note.toLowerCase().includes(fq);
      });

      const secObj = CB.secOptions.find(s => s.id === cmtSecId) || CB.secOptions[0];
      const lvNameZh = { bronze: "銅章級", silver: "銀章級", gold: "金章級" }[cmtLvKey] || "銅章級";
      const lvNameEn = { bronze: "Bronze Award", silver: "Silver Award", gold: "Gold Award" }[cmtLvKey] || "Bronze Award";
      const genZh = CB.generateZh(secObj, lvNameZh, cmtActName, cmtHours, cmtWeeks);
      const genEn = CB.generateEn(secObj.id, lvNameEn, cmtActName, cmtHours, cmtWeeks);

      forms2.innerHTML = `
        <div class="tool-card">
          <h3 style="margin:.1rem 0 .35rem;color:#0a5c36">📋 ${LANG === "en" ? "2026 Full Official Forms Finder (AYP/01–AYP/14 + e-Forms)" : "2026 全套官方表格搜尋器（AYP/01–AYP/14 ＋ 試行意向 e-Form）"}</h3>
          <div class="filter-row">
            <input type="search" class="search-input" id="form-search-inp" placeholder="${LANG === "en" ? "Search form code or purpose (e.g. AYP/07, AYP/08, Gold, transfer...)" : "輸入表格編號或用途（例：AYP/07、AYP/08、金章、轉處、統計...）"}" value="${esc(formSearchQuery)}">
          </div>
          <div class="chips">
            ${cats.map(cKey => `<button class="chip ${formCatFilter === cKey ? "active" : ""}" data-form-cat="${cKey}">${cKey === "all" ? (LANG === "en" ? "All Categories (16)" : "全部類別 (16)") : esc(cKey)}</button>`).join("")}
          </div>
          <table class="forms"><tbody>
            ${matchedForms.map(f => `
              <tr>
                <td class="no"><b>${esc(f.code)}</b><small>${esc(f.cat)}</small></td>
                <td>
                  <b>${esc(f.name)}</b>
                  <small>${esc(f.note)}</small>
                  <a href="${esc(f.url)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:.2rem">${esc(t.formsDownload)} ↗</a>
                </td>
              </tr>`).join("")}
          </tbody></table>
        </div>

        <div class="tool-card">
          <h3 style="margin:.1rem 0 .3rem;color:#0a5c36">${esc(CB.title)}</h3>
          <p class="hint" style="margin:0 0 .6rem">${esc(CB.sub)}</p>
          <div class="calc-grid">
            <div class="field-box">
              <label>${LANG === "en" ? "① Section" : "① 揀科目"}</label>
              <select id="cmt-sec-sel">
                ${CB.secOptions.map(s => `<option value="${s.id}" ${s.id === cmtSecId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
              </select>
            </div>
            <div class="field-box">
              <label>${LANG === "en" ? "② Award Level" : "② 揀章級"}</label>
              <select id="cmt-lv-sel">
                <option value="bronze" ${cmtLvKey === "bronze" ? "selected" : ""}>🥉 銅章 Bronze</option>
                <option value="silver" ${cmtLvKey === "silver" ? "selected" : ""}>🥈 銀章 Silver</option>
                <option value="gold" ${cmtLvKey === "gold" ? "selected" : ""}>🥇 金章 Gold</option>
              </select>
            </div>
            <div class="field-box">
              <label>${LANG === "en" ? "③ Activity Name (optional)" : "③ 具體活動名稱（可自訂）"}</label>
              <input type="text" id="cmt-act-inp" placeholder="${esc(secObj.defaultAct)}" value="${esc(cmtActName)}">
            </div>
            <div class="field-box">
              <label>${LANG === "en" ? "④ Hours & Weeks" : "④ 累積時數 ／ 持續星期數"}</label>
              <div style="display:flex;gap:.4rem">
                <input type="number" id="cmt-h-inp" min="1" max="300" value="${cmtHours}" title="Hours">
                <input type="number" id="cmt-w-inp" min="1" max="150" value="${cmtWeeks}" title="Weeks">
              </div>
            </div>
          </div>

          <b style="color:#0a5c36;font-size:.88rem;display:block;margin-top:.4rem">🇭🇰 中文具體評語範本（可直接抄寫落紀錄簿）：</b>
          <div class="cmt-output" id="cmt-zh-out">${esc(genZh)}</div>
          <b style="color:#0a5c36;font-size:.88rem;display:block;margin-top:.4rem">🇬🇧 English Specific Assessor Comment Template:</b>
          <div class="cmt-output" id="cmt-en-out">${esc(genEn)}</div>

          <div class="plan-actions">
            <button class="btn primary" id="cmt-copy-zh">📋 ${LANG === "en" ? "Copy Chinese Comment" : "複製中文評語"}</button>
            <button class="btn ghost" id="cmt-copy-en">📋 ${LANG === "en" ? "Copy English Comment" : "複製英文評語"}</button>
          </div>
          <div id="cmt-toast"></div>
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
        formCatFilter = b.dataset.formCat; renderBottomTools();
      }));

      const secSel = $("#cmt-sec-sel", forms2);
      if (secSel) secSel.addEventListener("change", () => { cmtSecId = secSel.value; renderBottomTools(); });
      const lvSel = $("#cmt-lv-sel", forms2);
      if (lvSel) lvSel.addEventListener("change", () => {
        cmtLvKey = lvSel.value;
        if (cmtLvKey === "bronze") { cmtHours = 26; cmtWeeks = 26; }
        if (cmtLvKey === "silver") { cmtHours = 26; cmtWeeks = 26; }
        if (cmtLvKey === "gold") { cmtHours = 52; cmtWeeks = 52; }
        renderBottomTools();
      });
      const actInp = $("#cmt-act-inp", forms2);
      if (actInp) actInp.addEventListener("input", () => {
        cmtActName = actInp.value;
        const zOut = $("#cmt-zh-out", forms2), eOut = $("#cmt-en-out", forms2);
        if (zOut) zOut.textContent = CB.generateZh(secObj, lvNameZh, cmtActName, cmtHours, cmtWeeks);
        if (eOut) eOut.textContent = CB.generateEn(secObj.id, lvNameEn, cmtActName, cmtHours, cmtWeeks);
      });
      const hInp = $("#cmt-h-inp", forms2), wInp = $("#cmt-w-inp", forms2);
      const onHW = () => {
        cmtHours = Number(hInp.value) || 26;
        cmtWeeks = Number(wInp.value) || 26;
        const zOut = $("#cmt-zh-out", forms2), eOut = $("#cmt-en-out", forms2);
        if (zOut) zOut.textContent = CB.generateZh(secObj, lvNameZh, cmtActName, cmtHours, cmtWeeks);
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
        saveJson(UUL_CHK_KEY, s); renderBottomTools();
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
  function isFirstVisit() {
    try {
      return !localStorage.getItem(VISIT_KEY) && !localStorage.getItem(FIRST_VISIT_KEY);
    } catch (e) { return false; }
  }
  function markVisited() {
    try {
      localStorage.setItem(VISIT_KEY, "1");
      localStorage.setItem(FIRST_VISIT_KEY, "1");
    } catch (e) {}
  }
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    bindFloatBtns();
    bindViews();
    // 第一次進APP自動進入精靈了解需要
    if (isFirstVisit()) {
      showView("quick");
      markVisited();
    }
  });
})();
