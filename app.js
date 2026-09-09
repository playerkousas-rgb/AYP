/* ===========================================================
   AYP 童軍接駁指南 — 主程式
   =========================================================== */
"use strict";

(function () {
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  // 開合狀態儲存 (localStorage)
  const KEY = "ayp-guide-open";
  function loadOpen() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveOpen(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  /* ── 共用：HTML 跳脫 ── */
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  /* ═══════════════ 3) 五科速查 ═══════════════ */
  function renderLevelChooser() {
    const wrap = $("#level-chooser"); if (!wrap) return;
    const levels = ["bronze", "silver", "gold"];
    wrap.innerHTML = levels.map(l => {
      const L = LEVELS[l];
      return `<button class="chip ${l === "bronze" ? "active" : ""}" data-level="${l}"
                style="--c:${L.color}"><span>${L.icon}</span>${L.name}</button>`;
    }).join("");
    renderRequirementTable("bronze");
    wrap.addEventListener("click", e => {
      const b = e.target.closest("[data-level]"); if (!b) return;
      $$(".chip", wrap).forEach(c => c.classList.remove("active"));
      b.classList.add("active");
      renderRequirementTable(b.dataset.level);
    });
  }

  function sectionInfo(key) {
    const s = FIVE_SECTIONS.find(x => x.key === key);
    return s || { name:key, icon:"", intro:"" };
  }

  function renderRequirementTable(level) {
    const box = $("#req-table"); if (!box) return;
    const L = LEVELS[level];
    const rows = LEVEL_REQUIREMENTS[level];
    box.innerHTML = `
      <div class="lv-head" style="--c:${L.color}">
        <span class="lv-icon">${L.icon}</span>
        <div><h3 style="color:${L.color}">${L.name} · 要求</h3>
          <p class="lv-meta">開始：${L.age} ｜ 獲章：${L.minAwardAge} ｜ 需於 25 歲生日前完成</p>
        </div>
      </div>
      <table class="req">
        <tbody>
          ${rows.map(r => {
            const s = sectionInfo(r.section);
            return `<tr>
              <td class="sec"><span class="sec-ico">${s.icon}</span><div><b>${s.name}</b><small>${s.intro}</small></div></td>
              <td class="val">${r.value}</td></tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="note-box"><b>ℹ️ 新制（2022-04-01 後）備註</b><p>${esc(NEW_SYSTEM_NOTE.explain)}</p></div>
      <div class="sub-items">${NEW_SYSTEM_NOTE.items.map(i =>
        `<div class="sub-item"><b>${esc(i.label)}</b>
           ${i.main ? `<span>${esc(i.main)}</span>` : ""}${i.sub ? `<span class="sub">${esc(i.sub)}</span>` : ""}${i.all ? `<span>${esc(i.all)}</span>` : ""}
         </div>`).join("")}</div>
      <div class="detail-cols">
        ${rows.filter(r => r.section !== "expedition").map(r => {
           const s = sectionInfo(r.section);
           return `<div class="dcol"><b>${s.icon} ${s.name}</b><p>${esc(s.note)}</p></div>`;
        }).join("")}
      </div>`;
  }

  /* ═══════════════ 4) 同步／直接對應 ═══════════════ */
  function renderSync() {
    const c = $("#sync-plan"); if (!c) return;
    c.innerHTML = `<p class="lead">${esc(SYNC_PLAN.intro)}</p>
      ${SYNC_PLAN.stages.map((s,i) => `
        <div class="sync-stage">
          <div class="sync-arrow">童軍支部進度性獎章${i===0?"":"（先完成 AYP 銅章）"}</div>
          <div class="sync-row">
            <div class="sync-box from"><small>童軍獎章</small><b>${esc(s.badge)}</b></div>
            <div class="sync-arrow-c">➜ 同步完成 ➜</div>
            <div class="sync-box to" style="--c:${LEVELS[i===0?"bronze":"silver"].color}"><small>AYP</small><b>${esc(s.toAyp)}</b></div>
          </div>
        </div>`).join("")}
      <div class="warn"><b>⚠️ 試行安排</b><p>${esc(SYNC_PLAN.caveat)}</p></div>`;

    // 成員路徑
    const mp = $("#member-paths"); if (mp) {
      const levelColor = (lv) => {
        const m = { "銅章":"bronze", "銀章":"silver", "金章（直接）":"gold", "視年齡":"silver" };
        return (LEVELS[m[lv]] || { color:"#8a9199" }).color;
      };
      mp.innerHTML = MEMBER_PATHS.map(p => `<div class="mp">
        <b>${esc(p.branch)}</b><span class="tag" style="--c:${levelColor(p.level)}">${esc(p.level)}</span>
        <p>${esc(p.note)}</p></div>`).join("");
    }
  }

  /* ═══════════════ 6) 接駁指南 ═══════════════ */
  function renderTransfers() {
    const list = $("#transfer-list"); if (!list) return;
    list.innerHTML = TRANSFER_SCENARIOS.map(t => `
      <details class="part transfer" data-key="tf-${t.id}">
        <summary><span class="t-ico">${t.icon}</span>
          <div class="sum-text"><b>${esc(t.title)}</b><small>${esc(t.q)}</small></div>
          <span class="chev">▾</span></summary>
        <div class="part-body">
          <ol class="steps">${t.steps.map(s => `<li>${s}</li>`).join("")}</ol>
          ${t.caveat ? `<div class="warn">${esc(t.caveat)}</div>` : ""}
        </div>
      </details>`).join("");
  }

  /* ═══════════════ 通用 PART 開合 ═══════════════ */
  function initStaticParts() {
    const open = loadOpen();
    $$("details.part[data-key]").forEach(d => {
      const k = d.dataset.key;
      // 初次開啟：預設只開 steps ① ②（用 defaultOpen）
      if (open[k] === undefined) {
        open[k] = (d.dataset.defaultOpen === "1");
      }
      d.open = open[k];
      d.addEventListener("toggle", () => { open[k] = d.open; saveOpen(open); });
    });
    // 開合所有
    const btn = $("#toggle-all"); if (btn) {
      btn.addEventListener("click", () => {
        const all = $$("details.part");
        const anyOpen = all.some(d => d.open);
        all.forEach(d => { d.open = !anyOpen; open[d.dataset.key] = !anyOpen; });
        saveOpen(open);
        btn.textContent = anyOpen ? "展開全部" : "收合全部";
      });
    }
  }

  /* ═══════════════ 表格 / 辭典 / FAQ ═══════════════ */
  function renderForms() {
    const c = $("#forms-list"); if (!c) return;
    c.innerHTML = FORMS.map(f => `<tr><td class="no">${esc(f.no)}</td><td><b>${esc(f.name)}</b><small>${esc(f.note)}</small></td></tr>`).join("");
  }
  function renderGlossary() {
    const c = $("#glossary-list"); if (!c) return;
    c.innerHTML = GLOSSARY.map(g => `<details class="part glossary" data-key="gl-${esc(g.term)}">
      <summary><b>${esc(g.term)}</b><span class="chev">▾</span></summary>
      <div class="part-body"><p>${esc(g.def)}</p></div></details>`).join("");
  }
  function renderFaq() {
    const c = $("#faq-list"); if (!c) return;
    c.innerHTML = FAQ.map((f,i) => `<details class="part faq" data-key="faq-${i}">
      <summary><span class="q-ico">Q</span><b>${esc(f.q)}</b><span class="chev">▾</span></summary>
      <div class="part-body"><p><b>A：</b>${f.a}</p></div></details>`).join("");
  }

  /* ═══════════════ 時間表 ═══════════════ */
  function renderTimeline() {
    const c = $("#timeline"); if (!c) return;
    c.innerHTML = TIMELINE.map(t => `<div class="tl"><span class="tl-age">${esc(t.age)}</span><p>${esc(t.text)}</p></div>`).join("");
  }

  /* ═══════════════ 免責 ═══════════════ */
  function renderDisclaimer() {
    const c = $("#disclaimer"); if (!c) return;
    c.innerHTML = `<h3>${esc(DISCLAIMER.title)}</h3><p>${DISCLAIMER.body}</p>`;
  }

  /* ═══════════════ 年份（頁尾基準日） ═══════════════ */
  function footer() {
    const f = $("#baseline-foot"); if (f) f.textContent = APP.baseline;
    const f2 = $("#baseline-foot2"); if (f2) f2.textContent = APP.baseline;
  }

  /* ═══════════════ 初始化 ═══════════════ */
  document.addEventListener("DOMContentLoaded", () => {
    renderLevelChooser();
    renderSync();
    renderTransfers();
    renderForms();
    renderGlossary();
    renderFaq();
    renderTimeline();
    renderDisclaimer();
    initStaticParts();
    footer();
  });

})();
