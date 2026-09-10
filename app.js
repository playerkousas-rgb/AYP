/* ===========================================================
   AYP 童軍接駁指南 / AYP Scout Bridging Guide — 主程式（雙語 · 情況主導版）
   =========================================================== */
"use strict";
(function () {
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const OPEN_KEY = "ayp-guide-open-v2";
  const LANG_KEY = "ayp-guide-lang-v1";

  function loadOpen() { try { return JSON.parse(localStorage.getItem(OPEN_KEY)) || {}; } catch (e) { return {}; } }
  function saveOpen(o) { try { localStorage.setItem(OPEN_KEY, JSON.stringify(o)); } catch (e) {} }
  function smoothTo(el, block) { if (!el) return; try { if (typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: block || "start" }); } catch (e) {} }
  function smoothTop() { try { if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

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

  // 開合狀態事件綁定
  function bindPartToggles() {
    $$("details.part").forEach(d => {
      const k = d.dataset.key; const state = loadOpen();
      if (state[k] === undefined) state[k] = d.hasAttribute("open");
      d.addEventListener("toggle", () => { state[k] = d.open; saveOpen(state); });
    });
  }

  /* ═══════════ 頂層 TOC 導航 / 靜態文字 ═══════════ */
  function bindToc() {
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); smoothTo(el); }
    }));
  }

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

    // nav
    const navMap = { "nav-quick": t.nav.quick, "nav-beginner": t.nav.beginner, "nav-f1": t.nav.f1, "nav-f2": t.nav.f2,
      "nav-f3": t.nav.f3, "nav-f4": t.nav.f4, "nav-f5": t.nav.f5, "nav-res": t.nav.res, "nav-comp": t.nav.comp };
    Object.keys(navMap).forEach(id => setText(id, navMap[id]));

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

    setText("f3-title", t.f3Title); setText("f3-tag", t.f3Tag);
    setText("f31-summary", t.f31Summary);
    setText("f3-warn", "⚠️ " + t.f3Warn);

    setText("f4-title", t.f4Title); setText("f4-tag", t.f4Tag);
    setText("f41-summary", t.f41Summary);

    setText("f5-title", t.f5Title); setText("f5-tag", t.f5Tag);
    setText("f5-sub", t.f5Sub);

    setText("res-title", t.resTitle);
    setText("res-tl-summary", t.resTlSummary);
    setText("res-fm-summary", t.resFmSummary);
    setText("res-fm-note", t.resFmNote);
    setText("res-gl-summary", t.resGlSummary);
    setText("res-faq-summary", t.resFaqSummary);

    setText("comp-title", t.compTitle);
    setText("comp-summary", t.compSummary);

    setText("sources-title", t.sourcesTitle);

    setText("bottom-tools-title", t.bottomToolsTitle);
    setText("bottom-tools-sub", t.bottomToolsSub);
    setText("bt-sync-summary", L().SYNC_PLAN.title);
    setText("bt-conv-summary", L().CONVERSION_TABLE.title);
    const startFormsAction = L().BOTTOM_ACTIONS.find(b => b.id === "start-forms");
    if (startFormsAction) setText("bt-forms-summary", startFormsAction.label);
    setText("bt-oa-summary", L().OA_LOOKUP.title);

    const bottombar = $("#bottombar"); if (bottombar) bottombar.setAttribute("aria-label", t.quickNavAria);

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
     功能 2：兌換
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
      <div class="warn">⚠️ ${esc(SC.caveat)}</div>`;
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
      <div class="warn">⚠️ ${esc(SM.caveat)}</div>`;
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
      const el = document.getElementById(a.getAttribute("href").slice(1));
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
      i === 0)).join("");
  }

  /* ════════════════════════════════════════════
     置底工具列（常駐）：5 分鐘精靈／轉入試算／兌換／升團／快速工具
     ════════════════════════════════════════════ */
  function renderBottomBar() {
    const c = $("#bottombar"); if (!c) return;
    const QN = L().QUICKNAV;
    c.innerHTML = QN.map(q =>
      `<a class="bb-btn" href="#${esc(q.id)}" data-bb="${esc(q.id)}"><span class="bb-ico">${q.icon}</span><span>${esc(q.label)}</span></a>`
    ).join("");
    $$("[data-bb]", c).forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); smoothTo(el); }
    }));
  }

  /* ════════════════════════════════════════════
     🧰 底部快速工具：同步方案／單項兌換表／開展表格／查執行處
     ════════════════════════════════════════════ */
  function renderBottomTools() {
    // 註：舊版頁身 #bottom-grid 跳轉掣已抽走（縮短頁面），導航改由
    // 置頂分類列＋置底工具列常駐負責。此處只渲染 4 張工具內容卡。

    // 同步方案
    const sync = $("#bt-sync-body");
    if (sync) {
      const SP = L().SYNC_PLAN, t = UI();
      sync.innerHTML = `
        <div class="unofficial-badge">⚠️ ${esc(SP.effective)}</div>
        <p>${esc(SP.summary)}</p>
        <ol class="steps">${SP.points.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
        <div class="warn">${esc(SP.notifyLeader)}</div>
        <div class="warn">${esc(SP.verify)}</div>
        <p><a href="${esc(SP.source.url)}" target="_blank" rel="noopener">${esc(SP.source.label)} — ${esc(t.openOfficialLink)}</a></p>`;
    }

    // 單項兌換表
    const conv = $("#bt-conv-body");
    if (conv) {
      const CT = L().CONVERSION_TABLE, t = UI();
      conv.innerHTML = `
        <div class="unofficial-badge">${esc(CT.unofficialTag)}</div>
        <p>${esc(CT.intro)}</p>
        <div class="warn">${esc(CT.excludedNote)}</div>
        ${CT.groups.map(g => `
          <div class="conv-group">
            <h4>${esc(g.branch)}</h4>
            <table class="conv"><tbody>
              ${g.rows.map(r => `<tr><td class="ayp-col">${esc(r.ayp)}</td><td>${esc(r.items)}</td></tr>`).join("")}
            </tbody></table>
            ${g.note ? `<p class="hint">${esc(g.note)}</p>` : ""}
          </div>`).join("")}
        <p class="hint">${esc(CT.footnote)}</p>
        <p>${esc(t.conversionOfficialBase)}<a href="${esc(CT.officialSource.url)}" target="_blank" rel="noopener">${esc(CT.officialSource.label)}</a></p>
        <p>${esc(t.conversionCancelSource)}<a href="${esc(CT.cancelSource.url)}" target="_blank" rel="noopener">${esc(CT.cancelSource.label)}</a></p>`;
    }

    // 開展表格（AYP/01 等）
    const forms2 = $("#bt-forms-body");
    if (forms2) {
      const FORMS = L().FORMS, t = UI();
      forms2.innerHTML = `<table class="forms"><tbody>` + FORMS.map(f =>
        `<tr><td class="no">${esc(f.no)}</td><td><b>${esc(f.name)}</b><small>${esc(f.note)}</small>${f.url ? `<br><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(t.formsDownload)} →</a>` : ""}</td></tr>`
      ).join("") + `</tbody></table>`;
    }

    // 查執行處／組長
    const oa = $("#bt-oa-body");
    if (oa) {
      const OA = L().OA_LOOKUP;
      oa.innerHTML = `
        <p>${esc(OA.intro)}</p>
        <ul class="oa-links">${OA.links.map(l =>
          `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>
        <p><b>${esc(OA.regionsTitle)}</b></p>
        <table class="oa-regions"><tbody>${OA.regions.map(r =>
          `<tr><td>${esc(r.name)}</td><td>${esc(r.tel)}</td></tr>`).join("")}</tbody></table>
        <div class="warn">${esc(OA.caveat)}</div>`;
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

  /* ═══════════ 置頂分類列＋置底列：目前位置高亮（scrollspy） ═══════════ */
  const SPY_ORDER = ["quick", "beginner", "f1", "f2", "f3", "f4", "f5", "res", "comp", "bottom-tools"];
  function updateSpy() {
    const y = (window.scrollY || 0) + 140;
    let cur = SPY_ORDER[0];
    SPY_ORDER.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) cur = id;
    });
    $$("nav.toc a").forEach(a => {
      const id = a.getAttribute("href").slice(1);
      a.classList.toggle("active", id === cur || (cur === "bottom-tools" && id === "comp"));
    });
    $$("#bottombar [data-bb]").forEach(a => {
      a.classList.toggle("active", a.dataset.bb === cur);
    });
  }
  let spyTick = false;
  function bindSpy() {
    window.addEventListener("scroll", () => {
      if (spyTick) return; spyTick = true;
      const raf = window.requestAnimationFrame || (fn => setTimeout(fn, 60));
      raf(() => { spyTick = false; updateSpy(); });
    }, { passive: true });
    updateSpy();
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
    renderBottomBar();
    renderWizard();
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
    bindPartToggles();
    updateSpy();
  }

  /* ═══════════ 初始 ═══════════ */
  document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    bindFloatBtns();
    bindToc();
    bindSpy();
  });
})();
