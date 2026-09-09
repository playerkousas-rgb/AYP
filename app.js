/* ===========================================================
   AYP 童軍接駁指南 — 主程式（情況主導版）
   =========================================================== */
"use strict";
(function () {
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const OPEN_KEY = "ayp-guide-open-v2";

  function loadOpen() { try { return JSON.parse(localStorage.getItem(OPEN_KEY)) || {}; } catch (e) { return {}; } }
  function saveOpen(o) { try { localStorage.setItem(OPEN_KEY, JSON.stringify(o)); } catch (e) {} }
  function smoothTo(el, block) { if (!el) return; try { if (typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: block || "start" }); } catch (e) {} }
  function smoothTop() { try { if (typeof window.scrollTo === "function") window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

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

  /* ═══════════ 頂層 TOC 導航 ═══════════ */
  function bindToc() {
    // smooth scroll
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); smoothTo(el); }
    }));
  }

  /* ════════════════════════════════════════════
     功能 1：由其他執行處轉入童軍（互動決策）
     ════════════════════════════════════════════ */
  let inLevel = "bronze", inDone = { service: false, skill: false, physical: false, expedition: false, residential: false };
  function renderTransferIn() {
    const step = $("#ti-inner"); if (!step) return;
    const lv = LEVELS[inLevel];
    const must = LEVEL_SECTIONS[inLevel];
    const missing = must.filter(k => !inDone[k]);
    const secName = k => FIVE_SECTIONS[k].name;
    step.innerHTML = `
      <div class="ti">
        <div class="ti-tools">
          <div class="ti-lev">
            <b>① 揀你而家想完成嘅章級</b>
            <div class="chips">${Object.keys(LEVELS).map(k =>
              `<button class="chip ${k === inLevel ? "active" : ""}" data-lv="${k}" style="--c:${LEVELS[k].color}">${LEVELS[k].icon} ${LEVELS[k].name}</button>`).join("")}</div>
          </div>
          <div class="ti-done">
            <b>② 剔返你「已經喺原執行處批核」咗嘅科</b>
            <div class="chips">${must.map(k =>
              `<button class="chip tick ${inDone[k] ? "active" : ""}" data-sec="${k}" style="--c:#0a5c36">${FIVE_SECTIONS[k].icon} ${secName(k)}${inDone[k] ? " ✓" : ""}</button>`).join("")}</div>
            <p class="hint">* 預設全部未剔。已批核科係指喺原執行處已經由導師／評核員簽署、登記喺紀錄簿嘅科。</p>
          </div>
        </div>
        <div class="ti-result">
          <div class="ri-head" style="--c:${lv.color}">${lv.icon} ${lv.name} — 轉入童軍執行處後你仲要完成</div>
          ${missing.length === 0
            ? `<div class="ok-box">🎉 你已批核晒 ${lv.name} 全部科！轉入童軍後原則上只需完成行政銜接，即可申領該章級。（銀／金章需遞交完成通知書）</div>`
            : missing.map(k => {
                const s = FIVE_SECTIONS[k];
                return `<div class="gap">
                  <div class="gap-sec"><span class="sec-ico">${s.icon}</span><b>${s.name}</b></div>
                  <p class="gap-scout">🏕️ 喺童軍點補：${esc(s.scout)}</p>
                </div>`;
              }).join("")}
          <div class="warn">⚠️ ${esc(TRANSFER_IN.caveat)}</div>
        </div>
      </div>`;

    // 事件
    $$("[data-lv]", step).forEach(b => b.addEventListener("click", () => {
      inLevel = b.dataset.lv; renderTransferIn();
    }));
    $$("[data-sec]", step).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.sec; inDone[k] = !inDone[k]; renderTransferIn();
    }));
  }

  function renderTransferInSteps() {
    const c = $("#ti-steps"); if (!c) return;
    c.innerHTML = `<ol class="steps">${TRANSFER_IN.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="warn">${esc(TRANSFER_IN.caveat)}</div>`;
  }

  /* ════════════════════════════════════════════
     功能 2：兌換
     ════════════════════════════════════════════ */
  function renderConvertSync() {
    const c = $("#convert-sync"); if (!c) return;
    c.innerHTML = `<p class="lead">${esc(SYNC_CONVERT.intro)}</p>
      ${SYNC_CONVERT.stages.map((s, i) => {
        const lvC = LEVELS[s.toAypLv].color;
        return `<div class="sync-stage">
          <div class="sync-row">
            <div class="sync-box from"><small>童軍獎章</small><b>${esc(s.scoutBadge)}</b><span class="src">${esc(s.scoutInfo)}</span></div>
            <div class="sync-arrow-c">➜ 同步完成 ➜</div>
            <div class="sync-box to" style="--c:${lvC}"><small>AYP</small><b>${esc(s.toAyp)}</b><span class="src">${esc(s.note)}</span></div>
          </div>
        </div>`;
      }).join("")}
      <div class="warn">⚠️ ${esc(SYNC_CONVERT.caveat)}</div>`;
  }
  function renderConvertMap() {
    const c = $("#convert-map"); if (!c) return;
    c.innerHTML = `<p>${esc(SECTION_MAP.header)}</p>
      <table class="map"><tbody>
        ${SECTION_MAP.rows.map(r => `<tr>
          <td class="ayp"><b>${esc(r.ayp)}</b><small>適用：${esc(r.lv)}</small></td>
          <td class="sc">${esc(r.scout)}</td></tr>`).join("")}
      </tbody></table>
      <div class="warn">⚠️ ${esc(SECTION_MAP.caveat)}</div>`;
  }

  /* ════════════════════════════════════════════
     功能 3：升團接駁（按支部）
     ════════════════════════════════════════════ */
  function renderSectionPaths() {
    const c = $("#paths"); if (!c) return;
    const order = ["scout", "venture", "rover"];
    c.innerHTML = `<div class="path-flow">` + order.map((k, i) => {
      const p = SECTION_PATHS[k];
      const flow = k === "rover" ? "" : `<div class="flow-arrow">⬆ 升團</div>`;
      return `<div class="path-node" style="--c:${p.color}">
        <div class="pn-head" style="border-color:${p.color}">
          <b style="color:${p.color}">${esc(p.name)}</b><small>${esc(p.age)}</small></div>
        <div class="pn-body">
          <div class="row"><span class="lbl">🎯 可考</span><p>${esc(p.aypStart)}</p></div>
          <div class="row"><span class="lbl">🔗 同步/對應</span><p>${esc(p.sync)}</p></div>
          <div class="row next"><span class="lbl">⬆ 升團後</span><p>${esc(p.toNext)}</p></div>
        </div></div>${flow}`;
    }).join("") + `</div>`;
  }

  /* ════════════════════════════════════════════
     功能 4：正常開始 AYP 流程
     ════════════════════════════════════════════ */
  function renderJoinFlow() {
    const c = $("#join-flow"); if (!c) return;
    c.innerHTML = `<ol class="steps">${JOIN_FLOW.commonSteps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="tip">💡 ${esc(JOIN_FLOW.note)}</div>
      <p><b>邊個支部可考咩？</b></p>
      ${Object.keys(SECTION_PATHS).map(k => {
        const p = SECTION_PATHS[k];
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
    const stepDone = (wzRole ? 1 : 0) + (wzStatus ? 1 : 0);
    c.innerHTML = `
      <div class="wz-progress"><div class="wz-bar" style="width:${stepDone / 2 * 100}%"></div></div>
      <p class="wz-step-label">${stepDone === 2 ? "✅ 搞掂！你嘅行動卡出咗——" : `第 ${stepDone + 1} 步 / 共 2 步：${!wzRole ? "你係邊個？" : "你 AYP 去到邊？"}`}</p>
      <div class="wz-group">
        <b>① 你係邊個？（撳一個）</b>
        <div class="wz-grid">${WIZARD.roles.map(r =>
          `<button class="wz-opt ${wzRole === r.id ? "active" : ""}" data-wz-role="${r.id}">
            <span class="wz-ico">${r.icon}</span><span class="wz-t">${esc(r.label)}</span><small>${esc(r.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div class="wz-group">
        <b>② 你 AYP 去到邊？（撳一個）</b>
        <div class="wz-grid">${WIZARD.statuses.map(s =>
          `<button class="wz-opt ${wzStatus === s.id ? "active" : ""}" data-wz-status="${s.id}">
            <span class="wz-ico">${s.icon}</span><span class="wz-t">${esc(s.label)}</span><small>${esc(s.desc)}</small>
          </button>`).join("")}</div>
      </div>
      <div id="wz-result">${wzStatus ? wizardResultHtml() : `<div class="wz-empty">👆 上面各撳一個，3 秒即出你嘅「行動卡」：而家咩位置、行邊條路、下一步做咩。</div>`}</div>`;

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
    const p = PLANS[wzStatus]; if (!p) return "";
    const todo = loadTodo();
    const key = "wz-" + wzStatus;
    const checked = todo[key] || [];
    const doneCount = p.steps.filter((_, i) => checked[i]).length;
    return `<div class="plan-card">
      <div class="plan-head"><span class="plan-ico">${p.icon}</span>
        <div><b>📍 ${esc(p.pos)}</b><div class="plan-route">🎯 建議路線：${esc(p.route)}</div></div></div>
      ${wzRole && WIZARD.roleNote[wzRole] ? `<div class="tip">${esc(WIZARD.roleNote[wzRole])}</div>` : ""}
      <div class="plan-progress">已完成 ${doneCount}/${p.steps.length} 步</div>
      <ol class="todo">${p.steps.map((s, i) => `
        <li class="${checked[i] ? "done" : ""}"><label>
          <input type="checkbox" data-todo="${key}:${i}" ${checked[i] ? "checked" : ""}>
          <span class="todo-n">${i + 1}</span><span>${esc(s)}</span>
        </label></li>`).join("")}</ol>
      <div class="plan-meta">
        <div><small>🧑‍🏫 搵邊個</small><b>${esc(p.who)}</b></div>
        <div><small>📄 表格</small><b>${esc(p.forms)}</b></div>
        <div><small>⏱️ 需時</small><b>${esc(p.time)}</b></div>
      </div>
      <div class="warn">⚠️ ${esc(p.warn)}</div>
      <div class="plan-actions">
        <a class="btn primary" href="${esc(p.link)}">${esc(p.linkLabel)} →</a>
        <button class="btn ghost" id="wz-reset">↺ 重揀</button>
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
    // 令行動卡內嘅連結都 smooth scroll
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
    c.innerHTML = BEGINNER_CHECKS.map((b, i) => part("beg-" + b.id,
      `<span class="ico">${b.icon}</span><span class="sum-text"><b>${esc(b.title)}</b><small>${esc(b.why)}</small></span>`,
      `<h4>🔍 點查？（3 個方法）</h4>
       <ol class="steps">${b.how.map(h => `<li>${h}</li>`).join("")}</ol>
       <div class="say"><b>💬 照讀對白問：</b><br>「${esc(b.ask)}」</div>
       <div class="tip">🆘 如果結果係「冇／唔係」：${esc(b.ifNot)}</div>`,
      i === 0)).join("");
  }

  /* ═══════════ 30 秒睇懂 ＋ 版權 ＋ 浮動掣 ═══════════ */
  function renderTldr() {
    $$("[data-tldr]").forEach(el => {
      const t = SECTION_TLDR[el.dataset.tldr];
      if (t) el.innerHTML = `<span class="tldr-tag">⚡ 30 秒睇懂</span> ${esc(t)}`;
    });
  }
  function renderCopyright() {
    const l1 = $("#copyright-line"); if (l1) l1.textContent = COPYRIGHT.appLine;
    const l2 = $("#copyright-data"); if (l2) l2.textContent = COPYRIGHT.dataLine;
    const l3 = $("#copyright-edu"); if (l3) l3.textContent = COPYRIGHT.eduLine;
  }
  function bindFloatBtns() {
    const top = $("#fab-top");
    if (top) {
      const onScroll = () => top.classList.toggle("show", window.scrollY > 600);
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
      top.addEventListener("click", smoothTop);
    }
    const wiz = $("#fab-wizard");
    if (wiz) wiz.addEventListener("click", () => {
      const el = document.getElementById("quick");
      smoothTo(el);
    });
  }

  /* ═══════════ 常規區塊 ═══════════ */
  function renderCommon() {
    const secPart = (key, ico, title, body, def) => part(key, `<span class="ico">${ico}</span><b>${esc(title)}</b>`, body, def);

    // FAQ
    const faq = $("#faq-list");
    if (faq) faq.innerHTML = FAQ.map((f, i) => part("faq-" + i,
      `<span class="q-ico">Q</span><span class="sum-text"><b>${esc(f.q)}</b></span>`,
      `<p><b>A：</b>${f.a}</p>`)).join("");

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
    if (tl) tl.innerHTML = TIMELINE.map(t => `<div class="tl"><span class="tl-age">${esc(t.age)}</span><p>${esc(t.text)}</p></div>`).join("");

    // 免責
    const disc = $("#disclaimer");
    if (disc) disc.innerHTML = `<h3>免責聲明</h3><p>${esc(DISCLAIMER)}</p>`;

    // 來源
    const src = $("#sources");
    if (src) src.innerHTML = `<ul class="source-list">${SOURCES.map(s =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>`;
  }

  /* ═══════════ 初始 ═══════════ */
  document.addEventListener("DOMContentLoaded", () => {
    renderWizard();
    renderBeginner();
    renderTldr();
    renderCopyright();
    bindFloatBtns();
    renderTransferIn();
    renderTransferInSteps();
    renderConvertSync();
    renderConvertMap();
    renderSectionPaths();
    renderJoinFlow();
    renderExtras("#extra-list", EXTRA_CASES);
    renderExtras("#extra-list-2", EXTRA_CASES_2);
    renderCommon();
    bindPartToggles();
    bindToc();
    const b = $("#baseline-foot"); if (b) b.textContent = APP.baseline;
    const b2 = $("#baseline-foot2"); if (b2) b2.textContent = APP.baseline;
  });
})();
