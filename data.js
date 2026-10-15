/* ===========================================================
   AYP 童軍接駁指南 / AYP Scout Bridging Guide — 資料庫（雙語版 / Bilingual）
   資料基準日 / Baseline date：2026 年 9 月 / September 2026
   資料來源（全部為香港官方公開資料）：
   - 香港童軍總會 P95/2026《香港青年獎勵計劃更新安排》
   - P22/2026 + P96/2026《新修訂支部訓練綱要 2026》
   - 《各支部進度性獎章及徽章與 AYP 參照表》P103/2016（舊綱要參考）
   - 香港青年獎勵計劃 AYP 總辦事處網頁 / 獎勵計劃手冊
   ⚠️ 本 app 為非官方輔助工具；單科對應、轉處細節等以童軍執行處最新公布為準。
   ⚠️ This app is an unofficial aid tool. Section mapping / transfer details are
      subject to the latest announcements from the Scout Operating Authority.
   =========================================================== */

const LOCALES = {

/* ═══════════════════════════ 繁體中文（香港） ═══════════════════════════ */
"zh-HK": {

  htmlLang: "zh-HK",
  langLabel: "中文",
  switchToLabel: "EN",

  APP: {
    name: "AYP 童軍接駁指南",
    shortName: "AYP童軍",
    tagline: "情況主導：同步完成／銜接・轉處接駁・升團・正常流程",
    description: "非官方指南：童軍 ↔ AYP 同步完成／銜接認可、轉執行處／升支部接駁、各支部正常流程。所有活動須於正式開展日後進行，不可追溯。",
    baseline: "資料基準日：2026 年 10 月（P95/2026 ＋ hkayp.scouting.org.hk 新版同步）",
  },

  COPYRIGHT: {
    appLine: "© 2026 Scout System · AYP 童軍接駁指南",
    eduLine: "非官方輔助工具，僅作教育用途",
    dataLine: "AYP 及童軍相關文件、徽章、獎章名稱與內容，版權屬香港青年獎勵計劃及香港童軍總會所有",
    copyrightOnly: "© 2026 Scout System",
  },

  LEVELS: {
    bronze: { name: "銅章級", color: "#b87333", icon: "🥉", minAge: "14 歲", special: "年滿 13 歲童軍可特別申請" },
    silver: { name: "銀章級", color: "#8a9199", icon: "🥈", minAge: "15 歲", special: "可直接參加（主項52h/52w）或完成銅章後漸進（各科26h/26w）" },
    gold:   { name: "金章級", color: "#d4af37", icon: "🥇", minAge: "16 歲", special: "可直接參加（主項78h/78w）或完成銀章後漸進（各科52h/52w）" },
  },

  FIVE_SECTIONS: {
    service:    { name: "服務科",     icon: "🤝", ayp: "為他人服務", scout: "用童軍服務項目（急救／拯溺／營地服務／社區服務等）申報，按服務時數要求。" },
    skill:      { name: "技能科",     icon: "🎯", ayp: "持續學習個人興趣／技能", scout: "用童軍專科徽章／進度性獎章所學嘅技能申報，但需符合 AYP 持續期要求。" },
    physical:   { name: "康樂體育科", icon: "🏃", ayp: "恆常康體訓練以改善體適能與技術（按時數及持續週數計）", scout: "用童軍康樂／體育專科徽章或恆常訓練申報；須符合最低時數（13/26/52/78小時）及持續星期數。" },
    expedition: { name: "野外鍛鍊科", icon: "🥾", ayp: "策劃並完成有目的旅程", scout: "必須由童軍執行處認可嘅野外鍛鍊科導師／評核員主持，完成訓練＋試行＋評核旅程。" },
    residential:{ name: "團體生活科", icon: "🏕️", ayp: "與不相熟者連續外宿（金章）", scout: "用童軍大型交流／露營／大露營（5 日 4 夜或以上）。" },
  },

  LEVEL_SECTIONS: {
    bronze: ["service", "skill", "physical", "expedition"],
    silver: ["service", "skill", "physical", "expedition"],
    gold:   ["service", "skill", "physical", "expedition", "residential"],
  },

  NEW_SYSTEM_NOTE: "2022-04-01 後，直接參加各章級者須從服務／技能／康體科揀一科做主項（時數較高）、其餘為副項；由上一級漸進者則無須分主副。",

  BEGINNER_CHECKS: [
    {
      id: "sworn", icon: "🙋", title: "Check 1：我係咪「已宣誓」童軍？",
      why: "未宣誓＝仲未正式係童軍成員，唔可以用童軍執行處考 AYP。所以第一步係搞清楚自己宣誓未。",
      how: [
        "<b>問旅團領袖（最準）：</b>直接問：「我想考 AYP，請問我宣誓未？宣誓日期係幾時？」——旅團一定有紀錄，唔使怕醜。",
        "<b>睇自己經歷：</b>有冇參加過宣誓禮？有冇獲發會員證？童軍紀錄冊有冇宣誓紀錄？三樣都冇，好大機會未宣誓。",
        "<b>青年領袖：</b>問自己旅／團：「我份領袖／教練員委任仲有冇效？」委任過期＝唔算合資格。",
      ],
      ask: "「唔好意思，我想經童軍考 AYP，請問我宣誓未？宣誓日期係幾時？有冇紀錄可以睇？」",
      ifNot: "未宣誓唔使驚——問旅團領袖幾時有宣誓安排，完成宣誓後先交 AYP 申請。未宣誓前做嘅活動唔會計入 AYP。",
    },
    {
      id: "branch", icon: "🏕️", title: "Check 2：我個單位有冇「已批准嘅執行處支部」？",
      why: "一句話：「執行處支部」＝童軍總會批准咗、可以搞 AYP 嘅單位（旅／區／地域）。冇支部，就要經區／地域支部參加。",
      how: [
        "<b>問旅團領袖／區總監（最快）：</b>「我哋旅／區有冇 AYP 執行處支部？支部名稱同批准狀態係咩？」——佢答得出「有」就係有。",
        "<b>自己上網查：</b>去「香港童軍總會 AYP 童軍執行處」網頁（scout.org.hk/hkayp）睇最新支部名單同通告；唔識搵就打去青少年活動署問。",
        "<b>睇文件：</b>支部成立要用 FORM AYP/10 申請並獲總會批准。合資格支部嘅組長應該講得出支部名＋批准狀態，講唔出就要再查。",
      ],
      ask: "「請問我哋旅／區有冇已批准嘅 AYP 執行處支部？如果冇，我可唔可以經直屬區／地域執行處支部參加？」",
      ifNot: "如果自己旅冇支部：可以經「直屬區／地域執行處支部」參加——即係借區／地域個支部名義考。直接問區總監或地域辦事處點安排，唔使轉旅。",
    },
    {
      id: "chief", icon: "🧑‍🏫", title: "Check 3：個「執行處支部組長」合唔合資格？",
      why: "組長＝幫你收表、核紀錄、確認轉處嘅負責領袖。交表俾錯人會拖慢甚至無效，所以要 check。",
      how: [
        "<b>問佢本人：</b>「請問你係咪已註冊嘅 AYP 執行處支部組長？註冊（FORM AYP/14）仲有冇效？」——合資格組長一定答到你。",
        "<b>睇委任：</b>合資格組長持有總會有效委任／註冊紀錄。你可以請旅長／區總監幫你確認呢個人係咪「嗰個啱嘅人」。",
        "<b>唔肯定就問上去：</b>打去地域辦事處或青少年活動署，報上支部名＋組長名，問「呢位係咪現任合資格組長？」",
      ],
      ask: "「唔好意思，我想確認一下：你係咪我哋支部現任嘅 AYP 執行處支部組長？我想交 FORM AYP/01（或 AYP/09），係咪交俾你？」",
      ifNot: "如果佢唔係：請佢介紹返個啱嘅組長俾你，唔好照交。唔識搵人就問旅長／區總監，佢哋一定知。",
    },
  ],

  TRANSFER_IN: {
    steps: [
      "先做上面「零基礎 3 個 Check」：問旅團領袖你宣誓未、你旅／區／地域有冇已批准嘅執行處支部、邊個先係合資格嘅執行處支部組長。唔好自己估，問咗先。",
      "搵啱「執行處支部組長」，交「轉換執行處申請表」FORM AYP/09，連同你喺原執行處嘅獎勵計劃紀錄／紀錄簿一齊交。交之前影印／影相留底。",
      "等組長確認你嘅紀錄，佢會交去所屬地域辦事處或青少年活動署處理。你可以問佢：「大概幾耐有回覆？使唔使我補文件？」",
      "如果未上過「參加者迎新講座」（有網上片＋實體），要先上——未獲接納前做嘅活動，原則上唔會計入獎章。",
      "收到確認後，你之後嘅新活動就記喺童軍執行處名下，繼續完成仲欠嘅科。用本頁「① 仲欠咩」計數機剔返已批核科，就知仲爭咩。",
    ],
    caveat: "已喺原執行處批核嘅科，原則上隨紀錄簿帶住走、唔使重考；但每個執行處對「已批核科」同「評核員認可」可能有自己核實做法，實際以童軍執行處及你兩邊嘅支部組長為準。",
  },

  SYNC_CONVERT: {
    intro: "由 2026-08-15 起試行「同步完成方案」：用同一童軍訓練／活動／紀錄／評核歷程，同步完成童軍獎章同 AYP 章級，毋須重複。",
    stages: [
      { scoutBadge: "童軍高級獎章", scoutInfo: "童軍支部進度性獎章", toAyp: "AYP 銅章", toAypLv: "bronze", note: "考取童軍高級獎章可同步完成 AYP 銅章。" },
      { scoutBadge: "總領袖獎章", scoutInfo: "先完成 AYP 銅章", toAyp: "AYP 漸進銀章", toAypLv: "silver", note: "完成銅章後，可透過總領袖獎章同步完成 AYP 漸進銀章。" },
    ],
    caveat: "屬試行安排，並非「拎童軍章換 AYP 章」嘅自動一對一兌換 —— 每個對接項目仍須由執行處支部組長／認可評核員（Assessor）簽署核實先算數，而且擬用作同步完成嘅活動必須喺你正式開展該章級日期之後進行，唔可以追溯。詳細對接內容、參加／紀錄／評核指引，由香港童軍總會「香港青年獎勵計劃童軍執行處」網頁公布，辦理前請核實。",
  },

  SECTION_MAP: {
    header: "童軍各支部活動／徽章可以「銜接（認可）」至 AYP 各科 —— 即利用童軍訓練已攞到嘅知識技能去申報 AYP，毋須重複接受同一訓練及審核。但每科仍要符合 AYP 時數／持續期／評核要求，經正式申報、由執行處支部組長／認可評核員簽署核實，唔係自動生效。",
    rows: [
      { ayp: "服務科", scout: "童軍急救／拯溺專科徽章、營地服務、童軍區／地域社區服務計劃、服務獎章等", lv: "銅銀金" },
      { ayp: "技能科", scout: "童軍專科徽章（通訊、電腦、工藝、語言、攝影、露營、觀鳥等，視乎性質）、深資／樂行個人興趣項目", lv: "銅銀金" },
      { ayp: "康樂體育科", scout: "童軍康樂／體育專科徽章及訓練（游泳、野外定向、獨木舟、風帆、射箭、田徑等）＋持續參與", lv: "銅銀金" },
      { ayp: "野外鍛鍊科", scout: "童軍遠足／露營／探險旅程 —— 必須由童軍執行處認可嘅野外鍛鍊科導師主持訓練及評核", lv: "銅銀金（旅程長度按級別）" },
      { ayp: "團體生活科（金）", scout: "童軍大型交流／露營／大露營（總會／地域／區／旅主辦，5 日 4 夜或以上）", lv: "金" },
    ],
    caveat: "以上為「銜接（認可）」嘅參考方向，唔係自動一對一兌換。官方舊《各支部進度性獎章及徽章與 AYP 參照表》（P103/2016）屬舊《訓練綱要》版本，因新綱要 2026-08-15 起實施已更新；最新單科認可以童軍執行處公布及「同步完成方案」為準。切勿假設「考咗童軍章＝自動等於完成 AYP 某科」——每科都要經 AYP 正式申報，並由執行處支部組長／認可評核員簽署核實先算數。",
  },

  SECTION_PATHS: {
    scout: {
      name: "童軍", age: "約 11–16 歲", color: "#0a5c36",
      aypStart: "13–14 歲起：年滿 13 歲可特別申請銅章、14 歲一般可報銅章、15 歲可報銀章。",
      sync: "同步完成：考「童軍高級獎章」可同步完成 AYP 銅章。",
      toNext: "升深資童軍後：AYP 進度照跟住你（唔會因升團清零），繼續未完成科；可用深資童軍活動補返餘下科（見銜接）。",
    },
    venture: {
      name: "深資童軍", age: "約 15–20 歲", color: "#7a1f2b",
      aypStart: "按年齡可揀銅／銀／金起步（漸進或直接）；15 歲報銀、16 歲報金。",
      sync: "深資童軍嘅「活動／探險」等訓練可以銜接（認可）至 AYP 各科（參考單項銜接表）。",
      toNext: "升樂行童軍後：AYP 進度照跟住你；樂行童軍嘅「社區服務／個人興趣／認識世界」等可銜接 AYP 高級別科目。",
    },
    rover: {
      name: "樂行童軍", age: "約 18–25 歲（未滿 23 歲可參加）", color: "#0a3a5c",
      aypStart: "可揀銅／直接銀／直接金作為開始級別（視年齡）；最後參加限期 23 歲生日當天。",
      sync: "樂行童軍嘅服務、個人興趣、國際視野（大露營等）可以銜接（認可）至 AYP 各科，尤其服務／技能／團體生活。",
      toNext: "樂行後可成為領袖／導師；若屬青年領袖並持有效委任，可另行直入金章（見其他情況 E）。",
    },
  },

  JOIN_FLOW: {
    commonSteps: [
      "做「零基礎 3 個 Check」：問旅團領袖——①我宣誓未？②我哋旅／區／地域有冇已批准嘅執行處支部？③邊個係合資格組長？（旅冇支部可經直屬區／地域支部，唔使轉旅。）",
      "完成「參加者迎新講座」：實體迎新講座繼續舉行，網上迎新講座影片亦即將推出（詳情留意童軍執行處網站公布）。完成後才可辦理參加申請及領取紀錄簿。",
      "填「參加申請表格」FORM AYP/01，連所需文件＋紀錄簿費用 HK$45，交俾你 check 過嗰位執行處支部組長。記得影印留底。",
      "等接納、攞紀錄簿：所有 AYP 活動一定要登記喺紀錄簿先算數。未攞到紀錄簿前做嘅嘢，原則上唔計——所以唔好心急，攞到先開始計。",
    ],
    note: "行政程序正分階段電子化（網上申請首年與紙本並行）。交表時問組長用網上定紙本，唔使自己估。",
  },

  EXTRA_CASES: [
    {
      id: "b", icon: "✅", title: "B. 已經喺其他執行處考完低級章，先想轉入童軍做下一級",
      q: "我喺學校執行處已經攞咗成個銅章，想轉入童軍做銀章，點做？",
      body: "你已完成嘅章級同科目會隨紀錄簿帶住走，原則上唔使重考。完成銅章後轉入童軍可參加「漸進銀章」（服務、技能、康體三科不分主副，每科最少 26 小時及持續不少於 26 星期，比直接銀章主項 52 小時／52 星期更慳時間）。用 FORM AYP/09 辦理轉入，並向執行處支部組長提供已完成銅章嘅資料。",
      caveat: "實際能否承接、需要出示幾多證明，以童軍執行處核實為準。",
    },
    {
      id: "d", icon: "🌱", title: "D. 未夠 14 歲／幼童軍升童軍，想為 AYP 鋪路",
      q: "我仲細（童軍／甚至幼童軍升童軍），想遲啲考 AYP，而家可以點準備？",
      body: "AYP 一般銅章最低 14 歲（年滿 13 歲童軍可特別申請），未夠齡做嘅活動唔可以算做 AYP。不過你可以：專心做童軍進度性獎章（尤其「童軍高級獎章」），因為日後可同步完成 AYP 銅章；培養一個可持續嘅技能／運動習慣，方便將來做技能科／康體科。",
    },
    {
      id: "e", icon: "👔", title: "E. 青年領袖（成年）加入，直入金章",
      q: "我係青年領袖，可以考 AYP 嗎？",
      body: "年滿 18 歲而未滿 23 歲、持香港童軍總會有效領袖／教練員委任嘅青年領袖，可參加金章級訓練及考驗活動，並直接經青少年活動署辦理參加手續。同樣要先完成迎新講座，再交 FORM AYP/01 連文件及費用。",
      caveat: "最後參加限期為 23 歲生日當天，所有活動須於 25 歲生日前完成。",
    },
    {
      id: "f", icon: "🌏", title: "F. 海外／國際 AYP（愛丁堡公爵國際獎）轉入香港童軍",
      q: "我喺海外考緊愛丁堡公爵國際獎，想轉返香港童軍執行處繼續，得唔得？",
      body: "AYP 係國際青年獎勵計劃協會嘅成員，原則上國際間轉換執行處／國家時，已完成嘅章級科別可獲互認，但需要出示官方紀錄／證書。香港童軍執行處會按轉換執行處程序（FORM AYP/09）連同你嘅國際紀錄核實處理。",
      caveat: "海外紀錄能否全數承接、會唔會有科要重做，須以童軍執行處／總辦事處逐個核實為準。",
    },
    {
      id: "g", icon: "📂", title: "G. 轉處時紀錄唔齊／紀錄簿問題",
      q: "我想轉執行處，但紀錄唔齊／紀錄簿遺失，點算？",
      body: "AYP 以紀錄簿為準，所以轉處前最好先整理好已批核科嘅證明。若紀錄簿遺失或紀錄唔齊，應向原執行處支部組長反映，睇下有冇留底／可補發嘅證明；未獲確認嘅活動，原則上唔可以計入。轉處時應交 FORM AYP/09 連現有紀錄，由童軍執行處支部組長核實。",
      caveat: "能否補回紀錄視乎原執行處留底；建議盡早整理，唔好拖到轉處先搵。",
    },
    {
      id: "proc", icon: "🧾", title: "轉處時通用手續（適用 A / B / F）",
      q: "無論邊種轉處，要辦咩手續？",
      body: "轉入童軍：交 FORM AYP/09＋原紀錄，經想入嘅執行處支部組長確認後交地域辦事處／青少年活動署；未完成迎新講座要先上。若只係童軍內部轉支部：通知原屬及新屬執行處支部組長，更新所屬單位資料即可。轉出童軍：按你想去嘅執行處要求交相應轉換表格。",
      caveat: "由其他執行處（如學校）轉入童軍總會執行處用 FORM AYP/09；若喺香港童軍總會執行處「內部」轉換所屬執行處支部（如跨旅轉支部），則使用 FORM AYP/08 並通知原屬及新屬支部組長。",
    },
  ],

  EXTRA_CASES_2: [
    {
      id: "a", icon: "↩️", title: "A. 由童軍執行處轉返去學校／其他執行處",
      q: "我想由童軍執行處轉返去學校執行處，得唔得？",
      body: "可以。參加者可以轉往其他認可執行處繼續完成餘下項目，程序跟你想轉去嗰個執行處嘅轉換要求（一般都要交該執行處嘅轉換表格＋你嘅童軍執行處紀錄）。已批核科隨紀錄簿帶住走，原則上唔使重考。",
      caveat: "以你想轉去嘅執行處要求為準。",
    },
    {
      id: "c", icon: "➕", title: "C. 做緊童軍，想用學校／其他處嘅活動補 AYP 時數",
      q: "我係童軍執行處參加者，但想用學校課外活動／校外服務嚟補某一科時數，得唔得？",
      body: "原則上可以 —— AYP 各科活動唔一定要由童軍舉辦，只要符合該科要求、由合適導師／評核員確認，並登記喺你嘅 AYP 紀錄簿即可。重點係：呢啲活動要計入你 AYP 紀錄，就要喺你所屬執行處（童軍執行處）下經導師／評核員正式評核批核。",
      caveat: "校外活動要成為 AYP 有效記錄，須經你所屬執行處認可嘅導師／評核員確認；先問你嘅執行處支部組長點安排，避免白做。",
    },
  ],

  FAQ: [
    { q: "童軍成員係咪一定要透過童軍執行處考 AYP？", a: "唔一定。你可以喺任何一個認可執行處（學校、其他制服團隊等）考。如果你喺其他執行處想轉入童軍，見「轉入童軍」；想知點揀，問你嘅旅團領袖／執行處支部組長。" },
    { q: "我未足 14 歲係咪唔可以考銅章？", a: "一般銅章最低 14 歲；但年滿 13 歲嘅童軍成員可經特別安排申請（須與適齡朋友小組進行）。未夠齡做嘅活動唔可以計入 AYP。" },
    { q: "「同步完成」同「銜接（認可）」有咩分別？", a: "同步完成＝考取特定童軍獎章（童軍高級獎章／總領袖獎章）可同步攞到成個 AYP 章級，毋須分科申報（試行中，仍須組長核實）。銜接（認可）＝你用童軍活動／徽章嘅內容去申報 AYP 某一科，但要符合該科時數／持續期／評核要求、經認可評核員核實並正式申報。兩者都唔係「拎章換章」嘅自動兌換。" },
    { q: "我由其他執行處轉入童軍，做咗嘅嘢會唔會冇咗？", a: "原則上已批核嘅科會隨紀錄簿帶住走，唔使重考；用 FORM AYP/09 連同紀錄辦理。實際以童軍執行處及兩邊支部組長核實為準。" },
    { q: "我以前做開嘅童軍活動／服務時數，可唔可以追溯計入 AYP？", a: "原則上唔可以（No Backdating）。AYP 活動一律由你正式開展該章級（成功報名、獲發紀錄簿）當日或之後起計；開展日之前嘅舊活動、時數或徽章紀錄，唔可以追溯計入時數及次數要求。所以想做 AYP 就愈早正式報名開展愈穩陣，有疑問問執行處支部組長。" },
    { q: "金章係咪一定要先考銅章或銀章？", a: "唔一定。只要年滿 16 歲，可以直接參加金章（直接金章：主項最少 78 小時及 78 星期，兩個副項各最少 52 小時及 52 星期）；如已完成銀章則可參加漸進金章（三科不分主副，各最少 52 小時及 52 星期）。注意金章各科須於開始最少 2 個月前提交 AYP/02–06 審批。" },
    { q: "紀錄簿幾錢？", a: "由 2026-04-01 起申請費用為 HK$45。" },
    { q: "要幾時前完成？", a: "所有章級須於 25 歲生日前完成；最後參加限期為 23 歲生日當天。" },
    { q: "同一個活動可唔可以同時用嚟做童軍章同 AYP？", a: "可以 —— 呢個正正係「同步完成／銜接（認可）」嘅精神，用同一訓練／活動／評核歷程。但要按 AYP 正式申報，唔係自動；詳情問執行處支部組長。" },
  ],

  GLOSSARY: [
    { term: "執行處", def: "獲香港青年獎勵計劃認可、可推行 AYP 嘅機構（香港童軍總會係其中之一；另外有學校、其他制服團隊等）。" },
    { term: "執行處支部", def: "執行處轄下實際運作 AYP 嘅單位，例如某童軍旅／區／地域所設嘅支部。" },
    { term: "執行處支部組長", def: "負責協助推行 AYP、指導參加者、核對紀錄、辦理申請／轉處嘅領袖／總監。" },
    { term: "紀錄簿", def: "所有 AYP 章級活動必須登記其上嘅官方紀錄；未獲發紀錄簿前所做活動不計算。申請費 HK$45。" },
    { term: "迎新講座", def: "參加前須完成，認識計劃目的、各章級及科目、導師／評核員安排；現提供網上及實體形式。" },
    { term: "導師／評核員", def: "負責指導並簽署確認你某科表現／進度嘅人；野外鍛鍊科旅程須由認可導師／評核員主持。" },
    { term: "主項／副項", def: "新制直接參加者要揀主項（時數較高）及副項；漸進者無須分主副。" },
    { term: "同步完成方案", def: "考「童軍高級獎章」同步完成 AYP 銅章；完成銅章後透過「總領袖獎章」同步完成漸進銀章（2026-08-15 起試行）。" },
    { term: "銜接（認可）", def: "將童軍活動／徽章用作申報 AYP 某科嘅官方概念 —— 唔係「拎章換章」：每科仍須符合時數／持續期／評核要求，經正式申報並由執行處支部組長／認可評核員核實。" },
    { term: "開展日（Start Date）", def: "你正式獲接納參加該章級嘅日子。所有計入 AYP 嘅活動必須喺開展日當日或之後進行 —— 之前做嘅活動原則上唔可以追溯（No Backdating）。" },
    { term: "轉換執行處", def: "由一個執行處（例如學校）轉去另一個（例如童軍總會）嘅正式行政手續，用 FORM AYP/09 辦理。留意：呢個同童軍內部「升團／轉支部」唔同 —— 升團唔使轉處，轉處就一定要辦手續。" },
    { term: "直接參加／漸進", def: "直接參加＝跳過低級直接考銀／金；漸進＝先完成銅／銀再上一級。" },
  ],

  FORMS: [
    { no: "AYP/01", name: "參加申請表格（開展表格）", note: "完成迎新講座後申請及買紀錄簿用——新參加者必填嘅「開展」表格。", url: "https://www.scout.org.hk/uploads/tc/forms/7015/form01.pdf" },
    { no: "AYP/09", name: "轉換執行處申請表", note: "由其他執行處轉入童軍執行處用。", url: "https://www.scout.org.hk/uploads/tc/forms/7023/form09.pdf" },
    { no: "AYP/10", name: "成立執行處支部申請表", note: "童軍旅／區／地域成立執行處支部用。", url: "https://www.scout.org.hk/uploads/tc/forms/7024/form10.pdf" },
    { no: "AYP/14", name: "執行處支部組長註冊／更改申請表", note: "支部組長註冊用。", url: "https://www.scout.org.hk/uploads/tc/forms/7028/form14.pdf" },
    { no: "AYP/02-06", name: "各科訓練及評核申請表", note: "服務／野外／技能／康體／團體生活各科。", url: "https://hkayp.scouting.org.hk/#support" },
    { no: "完成通知書", name: "銀／金章完成通知書", note: "完成章級後申領領獎（FORM AYP/07 及相關表格）。", url: "https://hkayp.scouting.org.hk/#support" },
  ],

  BOTTOM_ACTIONS: [
    { id: "sync-plan", icon: "📋", label: "同步方案（試行）", target: "bt-sync" },
    { id: "conv-table", icon: "🔁", label: "單項銜接表", target: "bt-conv" },
    { id: "start-forms", icon: "📝", label: "AYP開展表格", target: "bt-forms" },
    { id: "oa-lookup", icon: "🏢", label: "查執行處／組長", target: "bt-oa" },
    { id: "faq", icon: "❓", label: "FAQ", target: "bt-faq" },
  ],

  TOP_TABS: [
    { id: "quick", icon: "⚡", label: "精靈", target: "quick" },
    { id: "f1", icon: "①", label: "轉入", target: "f1" },
    { id: "f2", icon: "②", label: "銜接", target: "f2" },
    { id: "f3", icon: "③", label: "升團", target: "f3" },
    { id: "f5", icon: "⑤", label: "其他", target: "f5" },
  ],

  SYNC_PLAN: {
    title: "同步完成方案（試行安排）",
    effective: "生效日期：2026-08-15 起試行",
    summary: "由 2026-08-15 起，童軍進度性獎章同 AYP 章級嘅對應方式已經改變：唔再係「一個童軍獎章＝自動換一個 AYP 章級」咁簡單嘅一對一直接兌換，而係改為「項目與項目」（即活動／訓練／評核內容）互相對接嘅同步完成方式。",
    points: [
      "【童軍高級獎章 → AYP 銅章】以服務科為主項（≥26小時及≥26週：標準＋高級獎章持續服務），技能科為副項（≥13小時及≥13週：高級獎章 B.2.a STEAM 專科徽章），康體科為副項（≥13小時及≥13週：體適能相關專科徽章或訓練），野外鍛鍊科對接探索 A.2.c＋標準 A.2.e＋高級 A.2.f.I/II。",
      "【總領袖獎章 → AYP 漸進銀章】須先完成 AYP 銅章及年滿 15 歲（三科不分主副，各 ≥26小時及≥26週）：服務科對接 D.1.c 持續服務；技能科對接 A.3「先鋒工程」全套；康體科對接體適能專科徽章或26小時/26週訓練；野外鍛鍊科對接「歷險選項 II」。",
      "【試行期野外鍛鍊特別規定】銅章開訓前須聯絡合資格 EA / JEA（或同時為童軍領袖之 CRS 遠足導師）審視前期訓練及考驗；漸進銀章須完成中階遠足訓練班及考驗（或事前聯絡 EA / CRS）。旅團必須記錄考驗人員姓名、身分、資格、單位、聯絡、項目、日期及結果。",
      "【開展日紅線（不可追溯）】所有擬用作同步完成嘅活動，必須喺正式開展該 AYP 章級（完成迎新講座、交 AYP/01 及 $45 獲發紀錄簿）日期之後進行，並由探索獎章起使用 2026 新版《童軍訓練綱要》。",
      "【單位參與意向登記】有意參與試行嘅童軍單位及領袖，可透過官方 Google Form 提交參與意向登記（注意：意向表唔會取代 AYP/01 報名及紀錄簿程序）。",
    ],
    notifyLeader: "⚠️ 開始同步方案前，必須主動通知你所屬嘅「執行處支部組長」，等佢確認你打算點樣同步申報，並協助核實邊啲項目已經符合對接要求——唔好自己假設或者自行斷定邊個童軍活動就自動等於邊個 AYP 科目。",
    verify: "本頁內容只作參考，唔代表官方最終定案。詳情、對接細節同時間表，一切以香港童軍總會最新公布及你所屬執行處支部組長嘅確認為準。",
    source: { label: "香港童軍總會通告 P95/2026《香港青年獎勵計劃更新安排》", url: "https://www.scout.org.hk/uploads/tc/circulars/25989/p095-26.pdf" },
  },

  CONVERSION_TABLE: {
    title: "單項銜接表（非官方整理）",
    unofficialTag: "非官方整理，須向執行處組長核實",
    intro: "以下係按 2016 年官方《各支部進度性獎章及徽章與香港青年獎勵計劃參照表》（P103/2016）為基礎，經我哋自行整理、並剔除咗 2026-08-15 通告已取消嘅專科徽章後嘅參考表，方便執行處支部組長參考點樣將童軍活動銜接（認可）至 AYP 各科。注意：官方用語係「同步完成／銜接／認可」，唔係「拎章換章」嘅自動兌換 —— 每科仍須由執行處支部組長及認可評核員（Assessor）簽署核實，並符合 AYP 時數／持續期要求。呢張表並非童軍總會官方發布嘅最新表格，只係我哋按官方舊表加工整理嘅民間參考版本。",
    excludedNote: "已剔除因 2026-08-15《童軍支部專科徽章更新》通告（P013/26）而取消嘅 8 個專科徽章：愛護動物章（興趣組）、獨木舟國際賽艇章（技能組）、風帆賽艇舵手章（技能組）、國際友誼章（技能組）、營地管理章（服務組）、獨木舟救生章（服務組）、護養章（服務組）、護養章（教導組）。呢啲徽章總會已停止簽發，就算原有持有人仍可佩戴，都不應再用嚟申報新嘅 AYP 項目。",
    groups: [
      {
        branch: "① 童軍支部 → AYP 銅章級參考",
        rows: [
          { ayp: "服務科", items: "急救、拯溺（服務組專科徽章）；或圖書管理＊、共融（現稱「多元共融」）、物資管理（第I項）、服務獎章（須計滿不少於 15 小時服務）" },
          { ayp: "技能科", items: "興趣組：搜集、單車、農務（第II或III項）；或（學習／練習不少於6個月）釣魚、藝術、營地烹飪、圖書管理＊、模型製作、音樂、自然、攝影、步操、地質；技能組：天象、艇長、露營、通訊、電腦、烹飪（中式）、手藝、電子、樹木護理、地圖繪製、機械、氣象、領航、觀察、先鋒工程、原野烹飪；服務組：語言、工藝、領港、秘書、公民；海上活動：艇工、水手、水手長；航空活動：初級／中級／高級航空活動" },
          { ayp: "康樂體育科", items: "興趣組：獨木舟、划艇、風帆、滑浪風帆（完成後持續參與6星期，合共不少於12小時）；或運動、龍舟、騎術、公園定向、游泳、射箭（參與12星期，合共不少於12小時）；技能組：獨木舟水球（完成後持續6星期）；或射擊、技擊、野外定向、徒手潛水、體育（參與12星期）" },
          { ayp: "野外鍛鍊科", items: "完成本會基本遠足訓練課程；或由遠足審核員主持嘅地圖閱讀章／探險章課程" },
        ],
        note: "＊圖書管理專科徽章可對應服務科或技能科其中之一，唔可以同時計兩科。",
      },
      {
        branch: "② 童軍支部 → AYP 銀章級（進級・部份）參考",
        rows: [
          { ayp: "服務科", items: "急救、拯溺；或（未曾用於獎勵計劃、須為期6個月及不少於30小時服務）圖書管理＊、物資管理（第I項）、共融（多元共融）、服務獎章" },
          { ayp: "技能科", items: "與銅章級大致相同組別，惟須為未曾用於獎勵計劃活動之專科徽章（見銅章級技能科清單）" },
          { ayp: "康樂體育科", items: "興趣組：獨木舟、划艇、風帆、滑浪風帆（持續6星期，合共不少於15小時）；或運動、龍舟、騎術、公園定向、游泳、射箭（15星期，合共不少於15小時）；技能組：獨木舟水球（持續6星期）；或射擊、技擊、野外定向、徒手潛水、體育（15星期）" },
          { ayp: "野外鍛鍊科", items: "須升深資童軍支部後先可評核：地圖閱讀（E-A001）＋遠足訓練（E-A002）＋50公里陸上徒步或3日2夜40公里旅程（訓練、試行、評核旅程各一次），須由 AYP 野外鍛鍊科銀章級或以上導師主持" },
        ],
      },
      {
        branch: "③ 深資童軍支部 → AYP 銀章級（進級或直接）參考",
        rows: [
          { ayp: "服務科", items: "深資童軍獎章「責任」段章：R-A102 急救；或 R-A104 拯溺（II）" },
          { ayp: "技能科", items: "深資童軍獎章「活動」段章其中一項（進級銀章須維持6個月／直接銀章須維持12個月），例如：天象、書法、陶藝、繪畫、雕塑、平面設計、絲網印刷、民政、電腦、攝影、數碼攝影、電影理論及拍攝技巧、話劇、語言、氣象、音樂、集郵、時裝裁剪、收音機製造、業餘無線電、園藝、林務、釣魚、跳傘、飛行、獨木舟建造，以及海上／航空活動系列（水手長／副舵手、初中高級空勤員等）" },
          { ayp: "野外鍛鍊科", items: "地圖閱讀（E-A001）＋遠足訓練（E-A002）＋50公里陸上徒步或3日2夜40公里旅程，須由 AYP 野外鍛鍊科銀章級或以上導師主持" },
          { ayp: "康樂體育科", items: "銀章級康樂體育科訓練班；或深資童軍獎章「活動」段章體育技能（15星期，合共不少於15小時），涵蓋球類、水上競技、田徑、單車、馬術、野外定向、箭術、體適能訓練等" },
        ],
      },
      {
        branch: "④ 深資童軍支部 → AYP 金章級（進級）參考",
        rows: [
          { ayp: "服務科", items: "榮譽童軍獎章「責任」金帶：R-B201 志願服務；或 R-B202 專門技能服務；或 R-B203 童軍及社區服務（為期不少於12個月）" },
          { ayp: "技能科", items: "深資／榮譽童軍獎章「童軍技能」全部單元（A-101 至 A-104）；或「個人興趣」其中一項達認許水準（為期不少於12個月），例如天象、書法、陶藝、繪畫、電腦、攝影、話劇、語言、氣象、音樂、園藝、林務、釣魚等" },
          { ayp: "野外鍛鍊科", items: "深資童軍「探險」段章訓練及試行部份＋進階遠足訓練班＋1次4日3夜60公里旅程，須由 AYP 野外鍛鍊科金章級導師主持" },
          { ayp: "康樂體育科", items: "金章級康樂體育科訓練班；或一項體育活動持續18星期，合共不少於18小時" },
          { ayp: "團體生活科", items: "深資童軍獎章「人際關係」交流活動第1項——為期不少於5日4夜嘅國際／內地交流活動（包括大露營、國際青年論壇等），自助旅遊／觀光形式不計" },
        ],
      },
      {
        branch: "⑤ 樂行童軍支部 → AYP 金章級（進級或直接）參考",
        rows: [
          { ayp: "服務科", items: "樂行童軍訓練綱要「社區服務」（I）或（II）項目" },
          { ayp: "技能科", items: "「個人興趣」項目其中一項，持續12個月（已完成銀章者）或18個月（未完成銀章者），每月不少於兩次相關活動，例如釣魚、駕駛、手工藝、美術、音樂、搜集、盆栽、舞蹈、烹飪等" },
          { ayp: "野外鍛鍊科", items: "深資童軍「探險」段章或樂行童軍「挑戰」（乙）野外挑戰＋進階遠足訓練班＋1次4日3夜60公里旅程，須由 AYP 野外鍛鍊科金章級導師主持" },
          { ayp: "康樂體育科", items: "金章級康樂體育科訓練班；或一項體育活動持續18星期，合共不少於18小時" },
          { ayp: "團體生活科", items: "樂行童軍「認識世界」第1部份；或參加一項不少於5日4夜嘅世界／地區／國家童軍大露營" },
        ],
      },
    ],
    footnote: "參加者必須最少完成兩個科別，先可以開始下一個章級嘅活動，並且必須已經成功申請成為 AYP 成員、持有紀錄簿；所有擬用作銜接嘅活動，必須喺正式開展該章級（獲發紀錄簿）日期之後進行，唔可以追溯。",
    officialSource: { label: "《各支部進度性獎章及徽章與 AYP 參照表》P103/2016（舊綱要，僅供整理參考）", url: "https://www.scout.org.hk/article_attach/26708/p103-16.pdf" },
    cancelSource: { label: "P013/26《童軍支部專科徽章更新》通告（2026-08-15 取消名單）", url: "https://www.scout.org.hk/uploads/tc/circulars/23262/p013-26.pdf" },
  },

  OA_LOOKUP: {
    title: "查執行處 / 執行處支部組長",
    intro: "想核實你所屬地域嘅執行處聯絡方法、或者確認邊個先係合資格嘅執行處支部組長，可以用以下官方資源：",
    links: [
      { label: "📋 執行處支部組長名單（User Unit List，PDF，載明各區／旅組長姓名）", url: "https://scout.org.hk/uploads/editor/department_page/uul_list.pdf" },
      { label: "📞 AYP 查詢／聯絡我們（香港青年獎勵計劃官方頁面）", url: "https://hkayp.scouting.org.hk/#about/contact" },
      { label: "🏕️ 香港童軍總會 AYP 童軍執行處主頁", url: "https://hkayp.scouting.org.hk/#home" },
    ],
    regionsTitle: "各地域辦事處電話（一般查詢）",
    regions: [
      { name: "港島地域", tel: "2574 4296" },
      { name: "九龍地域", tel: "2957 6488" },
      { name: "東九龍地域", tel: "2957 6466" },
      { name: "新界地域", tel: "2425 5999" },
      { name: "新界東地域", tel: "2667 9100" },
      { name: "青少年活動署", tel: "2957 6411 ／ 2957 6417" },
    ],
    caveat: "以上聯絡方法及名單以香港童軍總會網頁最新公布為準；如有更新，請向你所屬地域辦事處查詢。",
  },

  COMPLETE: {
    steps: [
      "完成該章級所有科並符合要求後，即可申領獎狀及獎章。",
      "銅章：由個別執行處舉辦頒獎，按執行處指示申領。",
      "銀章／金章：遞交「銀章／金章完成通知書」（FORM AYP/07）→ 交由地域辦事處覆核 → 送交總辦事處安排領獎。",
      "銀章由總辦事處統籌頒發；金章由香港特區行政長官頒發（於指定典禮）。",
    ],
    tip: "完成後可考慮做導師／評核員，返去支援童軍執行處幫返後輩。",
  },

  TIMELINE: [
    { age: "11–13 歲", text: "童軍支部；未足 14 歲——先專心童軍進度性獎章，日後可同步完成／銜接 AYP（記住：開展日前嘅活動唔可以追溯計入）。" },
    { age: "13 歲", text: "符合特別安排可申請銅章（與適齡朋友小組進行）。" },
    { age: "14 歲", text: "一般可報銅章；考「童軍高級獎章」可同步完成 AYP 銅章。" },
    { age: "15 歲", text: "可報銀章（漸進或直接）。" },
    { age: "15–16 歲", text: "深資童軍；可揀銅／銀／金起步。" },
    { age: "16 歲", text: "可報金章（完成銀章後行漸進路徑，或直接參加金章；金章各科須提前最少 2 個月交 AYP/02–06）。" },
    { age: "18–22 歲", text: "樂行童軍／青年領袖；可直入金章。" },
    { age: "23 歲", text: "最後參加限期為 23 歲生日當天。" },
    { age: "25 歲", text: "所有章級須於 25 歲生日前完成。" },
  ],

  WIZARD: {
    roles: [
      { id: "scout",   icon: "🧭", label: "童軍",         desc: "約 11–16 歲" },
      { id: "venture", icon: "⛰️", label: "深資童軍",     desc: "約 15–20 歲" },
      { id: "rover",   icon: "🌍", label: "樂行童軍",     desc: "約 18–25 歲" },
      { id: "leader",  icon: "👔", label: "青年領袖",     desc: "持有效委任" },
      { id: "young",   icon: "🧒", label: "幼童軍／未夠歲", desc: "未夠 13–14 歲" },
      { id: "unsure",  icon: "❓", label: "唔肯定／幫人睇", desc: "由頭學起" },
    ],
    statuses: [
      { id: "fresh",   icon: "🌱", label: "未開始 AYP",      desc: "完全未報過" },
      { id: "doing",   icon: "📝", label: "喺其他處做緊",    desc: "學校／其他制服團隊" },
      { id: "done",    icon: "✅", label: "已完成低級章",    desc: "想升呢一級" },
      { id: "overseas",icon: "🌏", label: "海外獎章轉入",    desc: "愛丁堡公爵國際獎" },
      { id: "messy",   icon: "📂", label: "紀錄唔齊／唔見簿", desc: "唔知點算" },
      { id: "sync",    icon: "🏅", label: "想用童軍章銜接",  desc: "同步完成／認可 AYP" },
    ],
    roleNote: {
      scout: "💡 你係童軍：考「童軍高級獎章」可同步完成 AYP 銅章——係最抵嘅路。",
      venture: "💡 你係深資：可按年齡揀銅／銀／金起步；深資活動可對應 AYP 各科。",
      rover: "💡 你係樂行：可揀銅／直接銀／直接金起步；記住 23 歲生日係最後參加限期。",
      leader: "💡 你係青年領袖：持有效委任可直接報金章，經青少年活動署辦手續。",
      young: "💡 你仲細：未夠齡做嘅嘢唔計 AYP，專心童軍進度性獎章鋪路就啱。",
      unsure: "💡 唔肯定唔緊要：跟住下面 3 步做，問領袖嗰陣照讀對白就得。",
    },
  },

  PLANS: {
    fresh: {
      icon: "🌱", pos: "你喺起點：未開始 AYP，一切由零嚟。",
      route: "正常開始，順便行「同步完成」最抵嗰條路",
      steps: [
        "做「零基礎 3 個 Check」：問旅團領袖你宣誓未、有冇支部、邊個係組長（約 10 分鐘問完）。",
        "先完成「參加者迎新講座」（實體講座繼續舉行，網上迎新影片即將推出），然後交 FORM AYP/01＋HK$45 申請紀錄簿。",
        "攞到紀錄簿先開始計！童軍就向「高級獎章」進發＝同步完成銅章。",
      ],
      who: "你旅團領袖＋執行處支部組長", forms: "AYP/01",
      time: "約 2–4 星期辦妥手續", link: "#f4", linkLabel: "睇正常流程詳情",
      warn: "未攞到紀錄簿前做嘅活動唔計——唔好心急，攞到先開始。",
    },
    doing: {
      icon: "📝", pos: "你做緊一半：喺學校／其他處有進度，想轉入童軍。",
      route: "轉入童軍，已批核嘅科帶住走、唔使重考",
      steps: [
        "做「零基礎 3 個 Check」，搵啱童軍嗰邊嘅執行處支部組長。",
        "交 FORM AYP/09＋原紀錄簿／已批核證明（記得影印留底），等組長確認。",
        "用下面「仲欠咩計數機」剔返已批核科，睇清楚仲爭邊科點補。",
      ],
      who: "童軍支部組長＋原執行處支部組長", forms: "AYP/09",
      time: "約 2–4 星期處理", link: "#f1", linkLabel: "去「仲欠咩」計數機",
      warn: "已批核科原則上唔使重考，但要兩邊組長核實——文件齊就最順。",
    },
    done: {
      icon: "✅", pos: "你已完成低級章：想喺童軍開下一級。",
      route: "帶住個章轉入，直接開銀／金章",
      steps: [
        "做「零基礎 3 個 Check」，搵啱童軍嗰邊嘅組長。",
        "交 FORM AYP/09＋已完成章級證明，講明你想開邊一級。",
        "按新級別要求繼續：銀／金章完成後要交完成通知書申領。",
      ],
      who: "童軍支部組長", forms: "AYP/09",
      time: "約 2–4 星期處理", link: "#f5", linkLabel: "睇情況 B 詳情",
      warn: "能否承接要童軍執行處核實——證明文件帶齊就最穩陣。",
    },
    overseas: {
      icon: "🌏", pos: "你喺海外考緊愛丁堡公爵國際獎，想返香港童軍繼續。",
      route: "國際互認＋轉處，紀錄帶返嚟香港",
      steps: [
        "執齊海外官方紀錄／證書（英文正本＋副本）。",
        "做「零基礎 3 個 Check」，搵啱童軍組長，交 FORM AYP/09＋海外紀錄等核實。",
        "等執行處／總辦事處逐個核實，睇下有冇科要補做。",
      ],
      who: "童軍支部組長＋青少年活動署", forms: "AYP/09",
      time: "核實需時，預多啲時間", link: "#f5", linkLabel: "睇情況 F 詳情",
      warn: "海外紀錄能否全數承接要逐個核實——愈齊文件愈快。",
    },
    messy: {
      icon: "📂", pos: "你嘅紀錄唔齊／唔見紀錄簿——先唔好急住轉。",
      route: "先補紀錄，後轉處",
      steps: [
        "即刻聯絡「原執行處」支部組長：問有冇留底、可唔可以補發證明。",
        "未獲確認嘅活動唔會計——唔好拖，愈早整理愈好。",
        "紀錄搞掂後，再按「轉入」手續交 FORM AYP/09 過嚟童軍。",
      ],
      who: "原執行處支部組長（先）→ 童軍組長（後）", forms: "AYP/09（紀錄齊後）",
      time: "視乎原執行處留底", link: "#f5", linkLabel: "睇情況 G 詳情",
      warn: "AYP 以紀錄簿為準——唔見簿就盡快問原執行處，唔好等到轉處先搵。",
    },
    sync: {
      icon: "🏅", pos: "你有童軍獎章／徽章，想知點樣銜接（認可）至 AYP。",
      route: "成個章同步完成＋單科銜接認可，唔使做兩次",
      steps: [
        "成個章：童軍高級獎章→同步完成銅章；完成銅章後經總領袖獎章→漸進銀章（試行中）。",
        "單科：童軍活動／徽章可銜接至服務／技能／康體／野外／團體生活科，但要正式申報。",
        "辦理前問執行處支部組長＋睇執行處網頁最新指引，唔好假設自動認可。",
      ],
      who: "執行處支部組長", forms: "按執行處指引申報",
      time: "跟你考童軍章嘅進度", link: "#f2", linkLabel: "睇銜接詳情",
      warn: "「考咗童軍章」唔等於自動有 AYP——每科都要經 AYP 正式申報、由支部組長／認可評核員核實；而且活動必須喺你正式開展該章級之後進行，唔可以追溯。",
    },
  },

  SECTION_TLDR: {
    f1: "已批核嘅科帶住走、唔使重考。下面計數機剔返已批核科，即知仲爭咩。",
    f2: "成個章靠「同步完成」；單科靠「銜接（認可）＋正式申報」。兩者都要經執行處／認可評核員核實，唔係自動，亦唔可以追溯開展日之前嘅活動。",
    f3: "同一執行處內升團唔會清零 AYP 進度，只須更新支部資料；但由其他執行處轉入就必須辦 FORM AYP/09 轉處手續。",
    f4: "3 個 Check → 迎新講座 → AYP/01＋$45 → 攞紀錄簿 → 先開始計。跟住做就得。",
    f5: "轉出、補時數、紀錄問題等特殊情況——撳開你嗰張卡睇，唔使全部睇晒。",
  },

  SOURCES: [
    { label: "青少年活動署通告 P95/2026《香港青年獎勵計劃更新安排》", url: "https://www.scout.org.hk/uploads/tc/circulars/25989/p095-26.pdf" },
    { label: "P22/2026《新修訂支部訓練綱要》", url: "https://www.scout.org.hk/uploads/tc/circulars/23585/p022-26.pdf" },
    { label: "P96/2026《新修訂支部訓練綱要正式實施及發布安排》", url: "https://www.scout.org.hk/uploads/tc/circulars/25990/p096-26.pdf" },
    { label: "香港童軍總會通告一覽（可按「青少年活動署」篩選最新 AYP 相關通告）", url: "https://www.scout.org.hk/tc/circulars-forms/circulars/index.html" },
    { label: "香港童軍總會 AYP 童軍執行處", url: "https://hkayp.scouting.org.hk/#home" },
    { label: "《各支部進度性獎章及徽章與 AYP 參照表》P103/2016（舊綱要參考）", url: "https://www.scout.org.hk/article_attach/26708/P103-16.pdf" },
    { label: "香港青年獎勵計劃總辦事處 ayp.org.hk", url: "https://www.ayp.org.hk" },
  ],

  DISCLAIMER: "本 app 為非官方輔助工具。香港青年獎勵計劃正式規條，以及「同步完成方案」等試行安排、單科銜接／認可、轉處細節，以 AYP 總辦事處及香港童軍總會（P95/2026 等通告、AYP 童軍執行處網頁）最新公開發表為準。所有操作細節隨時可能更新，辦理前請向你所屬執行處支部組長／童軍領袖核實。另請注意：AYP 活動一律以正式開展日期起計，開展日之前嘅活動原則上不可追溯（No Backdating）。",

  UI: {
    heroLead: "🌱 <b>正常流程：由零開始考 AYP，跟住做就得。</b>唔肯定自己咩情況？㩒上面 ⚡精靈 答 2 條問題搵路。",
    mini1: "① 跟行動卡做<br>逐步剔進度", mini2: "② 展開詳情睇<br>Check/步驟/時間表", mini3: "③ 交表問組長<br>用下面工具查",
    quickTitle: "5 分鐘精靈：你咩情況？下一步做咩？",
    beginnerTitle: "零基礎 3 個 Check", beginnerSub: "當你咩都唔知——點查、問邊個、睇咩，逐步教",
    beginnerIntro: "無論你行邊條路，都要先過呢 3 關：宣誓未？有冇支部？組長啱唔啱？每張卡都有「照讀對白」俾你問領袖。",
    f1Title: "由其他執行處轉入童軍 → 仲有咩要考", f1Tag: "(功能①)",
    f1Hint: "撳「① 揀章級」＋「② 剔已批核嘅科」👇",
    ti1Summary: "我轉入後仲欠咩？", ti2Summary: "轉入童軍執行處嘅行政手續",
    f2Title: "銜接情況（同步完成／認可）", f2Tag: "(功能②)",
    c2aSummary: "成個章銜接：童軍進度性獎章 同步完成 AYP",
    c2bSummary: "單科銜接／認可參考：童軍活動 / 徽章 → AYP 各科",
    f3Title: "邊個支部考到咩・升團後要點做", f3Tag: "(功能③)",
    f31Summary: "童軍 → 深資 → 樂行：每階段 AYP 點跟進",
    f3Warn: "AYP 跟「參加者」同「執行處」，唔係跟童軍支部 —— 只要一直喺香港童軍總會執行處，由童軍升深資、深資升樂行，紀錄簿同 AYP 進度照舊有效、唔會清零，升團後通知組長更新所屬執行處支部資料就得。⚠️ 但如果你係由「學校／其他執行處」轉入童軍總會執行處（例如中學畢業後喺旅團繼續做 AYP），就唔係更新資料咁簡單 —— 必須辦理「轉換執行處」行政手續（FORM AYP/09），紀錄先會正式帶過嚟。",
    f4Title: "各支部正常開始 AYP 嘅流程", f4Tag: "(功能④)",
    f41Summary: "由頭開始：通用步驟 ＋ 各支部可考咩",
    f5Title: "其他可能情況", f5Tag: "(功能⑤)",
    f5Sub: "反方向／補充情況",
    resTlSummary: "幾時起步時間表",
    resGlSummary: "術語小辭典",
    resFaqSummary: "常見問題 FAQ",
    faqViewTitle: "FAQ＋術語辭典",
    compTitle: "完成之後：領獎／證書", compSummary: "完成章級後點領獎？",
    sourcesTitle: "官方資料來源",
    footerLine1: "AYP 童軍接駁指南 ·",
    footerLine2: "© 2026 Scout System · 非官方輔助工具 · 僅作教育用途",
    fabTopAria: "返頂部",
    langToggleAria: "切換語言 / Switch language",

    pickLevel: "① 揀你而家想完成嘅章級",
    tickDone: "② 剔返你「已經喺原執行處批核」咗嘅科",
    tickHint: "* 預設全部未剔。已批核科係指喺原執行處已經由導師／評核員簽署、登記喺紀錄簿嘅科。",
    resultHeadSuffix: " — 轉入童軍執行處後你仲要完成",
    allDone: (lvName) => `🎉 你已批核晒 ${lvName} 全部科！轉入童軍後原則上只需完成行政銜接，即可申領該章級。（銀／金章需遞交完成通知書）`,
    howToFill: "🏕️ 喺童軍點補：",
    scoutBadgeLabel: "童軍獎章",
    aypLabel: "AYP",
    syncArrow: "➜ 同步完成 ➜",
    applicableLabel: "適用：",
    upgradeArrow: "⬆ 升團",
    canTakeLabel: "🎯 可考",
    syncMapLabel: "🔗 同步/對應",
    afterUpgradeLabel: "⬆ 升團後",
    whichSectionCanDo: "邊個支部可考咩？",
    wizDone: "✅ 搞掂！你嘅行動卡出咗——",
    wizStep: (n, q) => `第 ${n} 步 / 共 2 步：${q}`,
    wizQ1: "你係邊個？", wizQ2: "你 AYP 去到邊？",
    wizRoleHeading: "① 你係邊個？（撳一個）",
    wizStatusHeading: "② 你 AYP 去到邊？（撳一個）",
    wizEmpty: "👆 上面各撳一個，3 秒即出你嘅「行動卡」：而家咩位置、行邊條路、下一步做咩。",
    routeLabel: "🎯 建議路線：",
    progressLabel: (done, total) => `已完成 ${done}/${total} 步`,
    whoLabel: "🧑‍🏫 搵邊個", formsLabel: "📄 表格", timeLabel: "⏱️ 需時",
    resetBtn: "↺ 重揀",
    howToCheck: "🔍 點查？（3 個方法）",
    askLabel: "💬 照讀對白問：",
    ifNotPrefix: "🆘 如果結果係「冇／唔係」：",
    tldrTag: "⚡ 30 秒睇懂",
    aLabel: "A：",
    disclaimerTitle: "免責聲明",
    baselineFoot: "資料基準日：2026 年 10 月（P95/2026 ＋ hkayp.scouting.org.hk 新版同步）",

    quickNavAria: "底部工具列",
    topBarAria: "頂部指南列",
    unofficialBadge: "⚠️ 非官方整理，須向執行處組長核實",
    backdateWarn: "🚫 <b>不可追溯（No Backdating）警告：</b>AYP 所有活動時數／次數，一律由你<b>正式開展該章級嘅日期</b>（成功報名、獲發紀錄簿）當日或之後起計。開展日之前嘅舊童軍活動、服務時數或徽章紀錄，原則上<b>唔可以追溯</b>計入 AYP —— 切勿以為攞住以前嘅童軍紀錄就可以直接申報。",
    verifyBeforeAct: "辦理前請核實：",
    openOfficialLink: "查看官方原文 →",
    syncPlanEffective: "生效：",
    syncPlanNotify: "通知你嘅組長：",
    conversionOfficialBase: "資料底本：",
    conversionExcluded: "已剔除嘅取消徽章：",
    conversionCancelSource: "取消名單來源：",
    formsDownload: "下載表格",
    oaRegionsTitle: "地域辦事處電話",
    backHome: "返正常流程",
  },
},

/* ═══════════════════════════ English ═══════════════════════════ */
"en": {

  htmlLang: "en",
  langLabel: "EN",
  switchToLabel: "中文",

  APP: {
    name: "AYP Scout Bridging Guide",
    shortName: "AYP Scout",
    tagline: "Situation-led: Simultaneous completion / Bridging · Transfer bridging · Advancement · Standard process",
    description: "Unofficial guide: Scout ↔ AYP simultaneous completion / bridging recognition, transferring Operating Authority / advancing Sections, and the standard AYP process for each Section. All activities must take place after your official start date — no backdating.",
    baseline: "Data baseline: October 2026 (Circular P95/2026 + new hkayp.scouting.org.hk)",
  },

  COPYRIGHT: {
    appLine: "© 2026 Scout System · AYP Scout Bridging Guide",
    eduLine: "Unofficial aid tool, for educational purposes only",
    dataLine: "Names and content of AYP and Scout-related documents, badges and awards are copyright of The Hong Kong Award for Young People and The Scout Association of Hong Kong",
    copyrightOnly: "© 2026 Scout System",
  },

  LEVELS: {
    bronze: { name: "Bronze Award", color: "#b87333", icon: "🥉", minAge: "14", special: "Scouts aged 13+ may apply under special arrangement" },
    silver: { name: "Silver Award", color: "#8a9199", icon: "🥈", minAge: "15", special: "Direct entry (Main 52h/52w) or Progressive after Bronze (26h/26w each)" },
    gold:   { name: "Gold Award", color: "#d4af37", icon: "🥇", minAge: "16", special: "Direct entry (Main 78h/78w) or Progressive after Silver (52h/52w each)" },
  },

  FIVE_SECTIONS: {
    service:    { name: "Service Section",             icon: "🤝", ayp: "Give useful service to others", scout: "Report using Scout service activities (First Aid / Life Saving / campsite service / community service, etc.), subject to the required service hours." },
    skill:      { name: "Skills Section",               icon: "🎯", ayp: "Ongoing development of a personal interest / skill", scout: "Report using skills learnt from a Scout Proficiency Badge / Progressive Badge, but the AYP minimum duration must still be met." },
    physical:   { name: "Physical Recreation Section",   icon: "🏃", ayp: "Regular physical training to improve fitness & skill (by hours & weeks)", scout: "Report using Scout physical recreation / sports badges or regular training, meeting minimum hours (13/26/52/78h) and weeks." },
    expedition: { name: "Adventurous Journey Section",   icon: "🥾", ayp: "Plan and complete a journey with a purpose", scout: "Must be led by an Instructor/Assessor recognised by the Scout Operating Authority, completing training + practice journey + assessed journey." },
    residential:{ name: "Residential Project Section",   icon: "🏕️", ayp: "Live away from home with people you don't know well (Gold only)", scout: "Report using a large-scale Scout exchange / camp / Jamboree (5 days 4 nights or longer)." },
  },

  LEVEL_SECTIONS: {
    bronze: ["service", "skill", "physical", "expedition"],
    silver: ["service", "skill", "physical", "expedition"],
    gold:   ["service", "skill", "physical", "expedition", "residential"],
  },

  NEW_SYSTEM_NOTE: "From 1 April 2022, direct entrants to each Award level must choose one of Service / Skills / Physical Recreation as the Main Section (higher hours), with the others as Secondary Sections; participants progressing from a lower Award do not need to split Main/Secondary.",

  BEGINNER_CHECKS: [
    {
      id: "sworn", icon: "🙋", title: "Check 1: Have I already made my Scout Promise?",
      why: "Not yet promised = not yet a formal Scout member, so you can't do AYP through the Scout Operating Authority. Sort this out first.",
      how: [
        "<b>Ask your Group/Unit Leader (most accurate):</b> Simply ask: \"I'd like to do AYP — have I made my Promise yet, and when was it?\" Your unit will have the record, don't be shy to ask.",
        "<b>Check your own history:</b> Did you attend an Investiture ceremony? Were you issued a membership card? Is there a record in your Scout record book? If none of these apply, you likely haven't been invested yet.",
        "<b>Young Leaders:</b> Ask your Group/Unit: \"Is my leader/instructor appointment still valid?\" An expired appointment means you don't qualify.",
      ],
      ask: "\"Excuse me, I'd like to do AYP through Scouts — have I made my Promise yet? What date was it, and is there a record I can see?\"",
      ifNot: "No need to worry if you haven't been invested — ask your Group/Unit Leader when the next Investiture is, and submit your AYP application after that. Activities done before your Promise won't count towards AYP.",
    },
    {
      id: "branch", icon: "🏕️", title: "Check 2: Does my unit have an \"approved User Unit\"?",
      why: "In short: a \"User Unit\" is a Group/District/Region unit approved by the Scout Association to run AYP. If there's no User Unit, you'll need to join through a District/Regional one.",
      how: [
        "<b>Ask your Group Leader / District Commissioner (fastest):</b> \"Does our Group/District have an AYP User Unit? What's its name and approval status?\" — if they can answer, it exists.",
        "<b>Check online yourself:</b> Go to the Scout Association of Hong Kong's AYP page (scout.org.hk/hkayp) for the latest list of User Units and circulars; or call the Programme Branch if you can't find it.",
        "<b>Check the paperwork:</b> Setting up a User Unit requires FORM AYP/10 and Association approval. A qualified Unit Leader should be able to name the Unit and its approval status — if they can't, keep asking.",
      ],
      ask: "\"Does our Group/District have an approved AYP User Unit? If not, can I join through the District/Regional User Unit directly?\"",
      ifNot: "If your own Group has no User Unit: you can join via the \"District/Regional User Unit\" instead — i.e. taking part under that Unit's name. Ask your District Commissioner or Regional office directly how this works; you don't need to transfer Groups.",
    },
    {
      id: "chief", icon: "🧑‍🏫", title: "Check 3: Is the \"User Unit Leader\" qualified?",
      why: "The Unit Leader collects your forms, verifies your record and confirms transfers. Handing forms to the wrong person can delay or even invalidate your application, so check first.",
      how: [
        "<b>Ask them directly:</b> \"Are you a registered AYP User Unit Leader? Is your registration (FORM AYP/14) still valid?\" — a qualified leader will be able to confirm this.",
        "<b>Check their appointment:</b> A qualified Unit Leader holds a valid appointment/registration with the Association. You can ask your Group Scout Leader or District Commissioner to confirm this is \"the right person\".",
        "<b>If unsure, ask further up:</b> Call the Regional office or Programme Branch, give the Unit name and leader's name, and ask \"is this the current qualified Unit Leader?\"",
      ],
      ask: "\"Excuse me, could I confirm — are you the current AYP User Unit Leader for our Unit? I'd like to submit FORM AYP/01 (or AYP/09) — should I hand it to you?\"",
      ifNot: "If they aren't: ask them to point you to the right leader, don't submit to the wrong person. If you can't find them, ask your Group Scout Leader / District Commissioner — they will know.",
    },
  ],

  TRANSFER_IN: {
    steps: [
      "First do the \"3 Checks for Beginners\" above: ask your Group/Unit Leader whether you've made your Promise, whether your Group/District/Region has an approved User Unit, and who the qualified User Unit Leader is. Don't guess — ask first.",
      "Find the right \"User Unit Leader\" and submit the \"Application for Change of Operating Authority\" FORM AYP/09, together with your Award record / Record Book from your original Operating Authority. Photocopy or photograph everything before handing it in.",
      "Wait for the leader to verify your record — they'll forward it to the Regional office or Programme Branch. You can ask: \"roughly how long until I hear back, and do I need to supply more documents?\"",
      "If you haven't attended the \"Participant Orientation\" (available online and in-person), do this first — activities done before acceptance generally won't count towards the Award.",
      "Once confirmed, your new activities will be recorded under the Scout Operating Authority, and you continue with the remaining Sections. Use the \"① What's still missing\" calculator on this page to tick off already-approved Sections and see what's left.",
    ],
    caveat: "Sections already approved at your original Operating Authority generally carry over with your Record Book and don't need to be redone; however each Operating Authority may have its own way of verifying \"approved Sections\" and \"Assessor recognition\" — always confirm with both Unit Leaders.",
  },

  SYNC_CONVERT: {
    intro: "From 15 August 2026, a trial \"Simultaneous Completion Scheme\" applies: using the same Scout training / activity / record / assessment process, you can complete a Scout Award and an AYP Award level at the same time, without duplication.",
    stages: [
      { scoutBadge: "Scout Advanced Award", scoutInfo: "Scout Section Progressive Badge", toAyp: "AYP Bronze Award", toAypLv: "bronze", note: "Achieving the Scout Advanced Award simultaneously completes the AYP Bronze Award." },
      { scoutBadge: "Chief Scout's Award", scoutInfo: "Requires AYP Bronze Award completed first", toAyp: "AYP Progressive Silver Award", toAypLv: "silver", note: "After completing Bronze, the Chief Scout's Award can simultaneously complete the AYP Progressive Silver Award." },
    ],
    caveat: "This is a trial arrangement, not an automatic one-to-one 'badge-for-award' swap — each matched item still has to be signed off by your User Unit Leader / a recognised Assessor before it counts, and activities used for simultaneous completion must take place after your official start date for that Award level (no backdating). Detailed matching, participation, record-keeping and assessment guidance is published on the Scout Association of Hong Kong's \"AYP Scout Operating Authority\" webpage — please verify before proceeding.",
  },

  SECTION_MAP: {
    header: "Scout activities/badges can be \"bridged (recognised)\" towards AYP Sections — i.e. the knowledge and skills already gained through Scout training can be used to report AYP, without repeating the same training and assessment. However, each Section must still meet AYP's hours/duration/assessment requirements, be formally reported, and be signed off by your User Unit Leader / a recognised Assessor — it is not automatic.",
    rows: [
      { ayp: "Service Section", scout: "Scout First Aid / Life Saving Proficiency Badges, campsite service, Scout District/Region community service schemes, service awards, etc.", lv: "Bronze / Silver / Gold" },
      { ayp: "Skills Section", scout: "Scout Proficiency Badges (Communications, Computer, Handicraft, Language, Photography, Camping, Bird-watching, etc., depending on nature), Venture/Rover personal interest projects", lv: "Bronze / Silver / Gold" },
      { ayp: "Physical Recreation Section", scout: "Scout recreation/sports Proficiency Badges and training (swimming, orienteering, canoeing, sailing, archery, athletics, etc.) + ongoing participation", lv: "Bronze / Silver / Gold" },
      { ayp: "Adventurous Journey Section", scout: "Scout hiking/camping/expedition journeys — must be led and assessed by an Adventurous Journey Instructor recognised by the Scout Operating Authority", lv: "Bronze / Silver / Gold (journey length varies by level)" },
      { ayp: "Residential Project Section (Gold)", scout: "Large-scale Scout exchange / camp / Jamboree (organised by HQ / Region / District / Group, 5 days 4 nights or longer)", lv: "Gold" },
    ],
    caveat: "The above is a reference direction for \"bridging (recognition)\" only — not an automatic one-to-one conversion. The old official \"Reference Table of Sectional Progressive Badges and Their Relation to AYP\" (P103/2016) is based on the old Training Scheme, which has been updated as the new scheme takes effect from 15 August 2026; the latest Section recognition follows announcements from the Scout Operating Authority and the Simultaneous Completion Scheme. Never assume \"earning a Scout badge automatically equals completing an AYP Section\" — every Section still needs to go through AYP's formal reporting process and be signed off by your User Unit Leader / a recognised Assessor.",
  },

  SECTION_PATHS: {
    scout: {
      name: "Scout", age: "approx. 11–16", color: "#0a5c36",
      aypStart: "From age 13–14: aged 13+ may apply for Bronze under special arrangement, 14 generally eligible for Bronze, 15 eligible for Silver.",
      sync: "Simultaneous completion: earning the \"Scout Advanced Award\" simultaneously completes the AYP Bronze Award.",
      toNext: "After advancing to Venture Scout: your AYP progress carries over (advancing doesn't reset it), so continue unfinished Sections; Venture Scout activities can be used for the remaining Sections (see Bridging).",
    },
    venture: {
      name: "Venture Scout", age: "approx. 15–20", color: "#7a1f2b",
      aypStart: "You may start at Bronze/Silver/Gold depending on age (progressive or direct); Silver from 15, Gold from 16.",
      sync: "Venture Scout \"activities/expeditions\" training can be bridged (recognised) towards AYP Sections (see the item-by-item bridging table).",
      toNext: "After advancing to Rover Scout: your AYP progress carries over; Rover Scout \"community service / personal interest / world awareness\" activities can be bridged towards higher-level AYP Sections.",
    },
    rover: {
      name: "Rover Scout", age: "approx. 18–25 (must join before turning 23)", color: "#0a3a5c",
      aypStart: "May choose Bronze / direct Silver / direct Gold as the starting level (depending on age); the latest date for entry is your 23rd birthday.",
      sync: "Rover Scout service, personal interest, and international outlook activities (Jamborees, etc.) can be bridged (recognised) towards AYP Sections, especially Service / Skills / Residential Project.",
      toNext: "After Rover Scouts, you may become a leader/instructor; if you're a Young Leader with a valid appointment, you may enter Gold directly (see \"Other Situations\" case E).",
    },
  },

  JOIN_FLOW: {
    commonSteps: [
      "Do the \"3 Checks for Beginners\": ask your Group/Unit Leader — ① Have I made my Promise? ② Does our Group/District/Region have an approved User Unit? ③ Who is the qualified Unit Leader? (If your Group has no User Unit, you can join via the District/Regional one — no need to transfer Groups.)",
      "Complete the \"Participant Orientation\": in-person briefings continue to be held, and the online orientation video is launching soon (check the Scout OA website). You must complete orientation before applying for your Record Book.",
      "Complete the \"Application Form\" FORM AYP/01, along with required documents and the HK$45 Record Book fee, and hand it to your checked-and-verified User Unit Leader. Keep a photocopy.",
      "Wait for acceptance and collect your Record Book: all AYP activities must be logged in the Record Book to count. Activities done before you receive the Record Book generally don't count — so don't rush; start counting only once you have it.",
    ],
    note: "Administrative procedures are being digitised in phases (online applications run alongside paper forms in the first year). Ask your Unit Leader whether to use online or paper when submitting — don't assume.",
  },

  EXTRA_CASES: [
    {
      id: "b", icon: "✅", title: "B. Already completed a lower Award elsewhere, want to transfer into Scouts for the next level",
      q: "I've already completed a full Bronze Award at my school's Operating Authority, and want to transfer into Scouts to do Silver — how?",
      body: "Award levels and Sections you've already completed carry over with your Record Book and generally don't need to be redone. Having completed Bronze, you can take Progressive Silver after transferring in (Service, Skills & Physical Recreation each require ≥26 hours and ≥26 weeks with no Main/Secondary split, rather than 52h/52w for Direct Silver). Submit FORM AYP/09 and provide your completed Bronze details to your User Unit Leader.",
      caveat: "Whether this can actually be carried over, and how much proof is needed, is subject to verification by the Scout Operating Authority.",
    },
    {
      id: "d", icon: "🌱", title: "D. Under 14 / Cub Scout advancing to Scouts, preparing early for AYP",
      q: "I'm still young (a Scout, or even a Cub Scout about to move up), and want to prepare for AYP later — what can I do now?",
      body: "AYP Bronze generally requires a minimum age of 14 (Scouts aged 13+ may apply under special arrangement); activities done while underage can't count towards AYP. However, you can: focus on Scout Progressive Badges (especially the \"Scout Advanced Award\"), since it can later simultaneously complete the AYP Bronze Award; and build a sustainable skill/sport habit, which will help with the Skills Section / Physical Recreation Section later.",
    },
    {
      id: "e", icon: "👔", title: "E. Young Leader (adult) joining, entering Gold directly",
      q: "I'm a Young Leader — can I do AYP?",
      body: "Young Leaders aged 18 to under 23 with a valid leader/instructor appointment from the Scout Association of Hong Kong may take part in Gold-level training and assessment activities, and apply directly through the Programme Branch. You still need to complete the Orientation first, then submit FORM AYP/01 with documents and fees.",
      caveat: "The latest date for entry is your 23rd birthday, and all activities must be completed before your 25th birthday.",
    },
    {
      id: "f", icon: "🌏", title: "F. Overseas / international AYP (Duke of Edinburgh's International Award) transferring into Hong Kong Scouts",
      q: "I'm doing the Duke of Edinburgh's International Award overseas and want to continue through a Hong Kong Scout Operating Authority — is that possible?",
      body: "AYP is a member of the International Award Association, so in principle, completed Award levels/Sections can be mutually recognised when transferring Operating Authority/country internationally, but official records/certificates must be produced. The Hong Kong Scout Operating Authority will verify and process this following the Operating Authority transfer procedure (FORM AYP/09) together with your international records.",
      caveat: "Whether overseas records can be fully carried over, or whether some Sections need to be redone, must be verified case-by-case by the Scout Operating Authority / Award Office.",
    },
    {
      id: "g", icon: "📂", title: "G. Incomplete records / Record Book problems when transferring",
      q: "I want to transfer Operating Authority, but my records are incomplete or my Record Book is lost — what do I do?",
      body: "AYP relies on the Record Book, so it's best to organise proof of already-approved Sections before transferring. If the Record Book is lost or records are incomplete, raise this with your original Operating Authority's Unit Leader to see if there's a backup or replacement proof available; unconfirmed activities generally can't be counted. When transferring, submit FORM AYP/09 with your existing records for verification by the Scout Operating Authority's Unit Leader.",
      caveat: "Whether records can be recovered depends on what the original Operating Authority has on file; sort this out as early as possible rather than waiting until you transfer.",
    },
    {
      id: "proc", icon: "🧾", title: "General procedure when transferring (applies to A / B / F)",
      q: "Whatever the type of transfer, what paperwork is needed?",
      body: "Transferring into Scouts: submit FORM AYP/09 plus original records, confirmed by the receiving Operating Authority's Unit Leader before being sent to the Regional office / Programme Branch; complete the Orientation first if you haven't. If it's just an internal transfer between Scout Units: notify both the old and new Unit Leaders and update your unit information. Transferring out of Scouts: submit the relevant transfer form required by the Operating Authority you're moving to.",
      caveat: "FORM AYP/09 is used for transferring into the Scout Association from another Operating Authority (e.g. school); transferring between User Units WITHIN the Scout Association of HK uses FORM AYP/08 together with notifying both User Unit Leaders.",
    },
  ],

  EXTRA_CASES_2: [
    {
      id: "a", icon: "↩️", title: "A. Transferring from the Scout Operating Authority back to school/another Operating Authority",
      q: "I want to transfer from the Scout Operating Authority back to my school's Operating Authority — is that allowed?",
      body: "Yes. Participants may transfer to another recognised Operating Authority to continue completing the remaining items, following that Operating Authority's transfer requirements (generally submitting their transfer form plus your Scout Operating Authority records). Already-approved Sections carry over with the Record Book and generally don't need to be redone.",
      caveat: "Subject to the requirements of the Operating Authority you're transferring to.",
    },
    {
      id: "c", icon: "➕", title: "C. Currently a Scout, wanting to use school/other activities towards AYP hours",
      q: "I'm a participant under the Scout Operating Authority, but want to use school extracurricular activities / outside-school service to count towards a Section — is that allowed?",
      body: "In principle, yes — AYP Section activities don't have to be organised by Scouts; they just need to meet that Section's requirements, be confirmed by a suitable Instructor/Assessor, and be logged in your AYP Record Book. The key point: for these activities to count in your AYP record, they must be formally assessed and approved by an Instructor/Assessor under your Operating Authority (the Scout Operating Authority).",
      caveat: "For an outside-school activity to become a valid AYP record, it must be confirmed by an Instructor/Assessor recognised by your Operating Authority — check with your User Unit Leader first on how to arrange this, to avoid wasted effort.",
    },
  ],

  FAQ: [
    { q: "Do Scout members have to do AYP through the Scout Operating Authority?", a: "Not necessarily. You can do it through any recognised Operating Authority (schools, other uniformed groups, etc.). If you're at another Operating Authority and want to transfer into Scouts, see \"Transferring into Scouts\"; ask your Group/Unit Leader or User Unit Leader which option suits you." },
    { q: "Can I not apply for Bronze if I'm under 14?", a: "Bronze generally requires a minimum age of 14; however, Scout members aged 13+ may apply under a special arrangement (must be done together with an age-appropriate peer group). Activities done while underage can't count towards AYP." },
    { q: "What's the difference between \"Simultaneous Completion\" and \"Bridging (Recognition)\"?", a: "Simultaneous Completion = earning a specific Scout Award (Scout Advanced Award / Chief Scout's Award) simultaneously completes a whole AYP Award level, without reporting by Section (currently on trial; still subject to your Unit Leader's confirmation). Bridging (Recognition) = you use the content of a Scout activity/badge to report a specific AYP Section, but it must still meet that Section's hours/duration/assessment requirements, be verified by a recognised Assessor, and be formally reported. Neither is an automatic 'badge-for-award' swap." },
    { q: "If I transfer into Scouts from another Operating Authority, will what I've already done disappear?", a: "In principle, already-approved Sections carry over with the Record Book and don't need to be redone; use FORM AYP/09 together with your records to process the transfer. This is subject to verification by the Scout Operating Authority and both Unit Leaders." },
    { q: "Can my previous Scout activities / service hours be backdated into AYP?", a: "In principle, no (No Backdating). AYP activities count only from the date you officially start that Award level (successful enrolment and issue of the Record Book); old activities, hours or badge records from before your start date cannot be backdated into the time and frequency requirements. So if you want to do AYP, enrol and start formally as early as possible — check with your User Unit Leader if in doubt." },
    { q: "Do I have to complete Bronze or Silver before Gold?", a: "Not necessarily. Once aged 16+, you can enter Direct Gold (Main Section ≥78h & ≥78w; two Secondary Sections ≥52h & ≥52w each), or Progressive Gold after completing Silver (all 3 Sections ≥52h & ≥52w). Note that Gold Sections require submitting AYP/02–06 at least 2 months before starting." },
    { q: "How much does the Record Book cost?", a: "From 1 April 2026, the application fee is HK$45." },
    { q: "By when must I complete everything?", a: "All Award levels must be completed before your 25th birthday; the latest date for entry is your 23rd birthday." },
    { q: "Can the same activity be used for both a Scout Award and AYP at the same time?", a: "Yes — this is exactly the spirit of \"Simultaneous Completion / Bridging (Recognition)\", using the same training/activity/assessment process. But it must still be formally reported to AYP — it's not automatic; ask your User Unit Leader for details." },
  ],

  GLOSSARY: [
    { term: "Operating Authority (OA)", def: "An organisation recognised by The Hong Kong Award for Young People to run AYP (The Scout Association of Hong Kong is one of them; others include schools and other uniformed groups)." },
    { term: "User Unit (UU)", def: "The unit under an Operating Authority that actually runs AYP day-to-day, e.g. a User Unit set up by a Scout Group/District/Region." },
    { term: "User Unit Leader", def: "The leader/commissioner responsible for helping run AYP, guiding participants, verifying records, and handling applications/transfers." },
    { term: "Record Book", def: "The official record on which all AYP Award activities must be logged; activities done before the Record Book is issued don't count. Application fee: HK$45." },
    { term: "Orientation", def: "Must be completed before joining; covers the Scheme's purpose, Award levels and Sections, and Instructor/Assessor arrangements; now offered both online and in person." },
    { term: "Instructor/Assessor", def: "The person responsible for guiding and signing off your performance/progress in a Section; Adventurous Journey Section journeys must be led by a recognised Instructor/Assessor." },
    { term: "Main Section / Secondary Section", def: "Under the current system, direct entrants must choose a Main Section (higher hours) and Secondary Sections; those progressing from a lower Award don't need to split Main/Secondary." },
    { term: "Simultaneous Completion Scheme", def: "Earning the \"Scout Advanced Award\" simultaneously completes the AYP Bronze Award; after completing Bronze, the \"Chief Scout's Award\" simultaneously completes the Progressive Silver Award (trial from 15 August 2026)." },
    { term: "Bridging (Recognition)", def: "The official concept of using Scout activities/badges towards an AYP Section — not a 'badge-for-award' swap: each Section must still meet the hours/duration/assessment requirements, be formally reported, and be verified by your User Unit Leader / a recognised Assessor." },
    { term: "Start Date", def: "The date you are officially accepted into an Award level. All activities counting towards AYP must take place on or after the start date — earlier activities generally cannot be backdated (No Backdating)." },
    { term: "Change of Operating Authority", def: "The formal administrative procedure for moving from one Operating Authority (e.g. a school) to another (e.g. the Scout Association), processed with FORM AYP/09. Note: this is different from advancing Scout Sections within the same Operating Authority — advancing Sections doesn't require a transfer, but changing Operating Authority always does." },
    { term: "Direct entry / Progressive", def: "Direct entry = skipping lower levels to go straight to Silver/Gold; Progressive = completing Bronze/Silver first before moving up." },
  ],

  FORMS: [
    { no: "AYP/01", name: "Application Form (Starting Form)", note: "Used to apply and purchase the Record Book after completing Orientation — the essential \"starting\" form for new participants.", url: "https://www.scout.org.hk/uploads/tc/forms/7015/form01.pdf" },
    { no: "AYP/09", name: "Application for Change of Operating Authority", note: "Used to transfer from another Operating Authority into the Scout Operating Authority.", url: "https://www.scout.org.hk/uploads/tc/forms/7023/form09.pdf" },
    { no: "AYP/10", name: "Application for Setting Up a User Unit", note: "Used by a Scout Group/District/Region to set up a User Unit.", url: "https://www.scout.org.hk/uploads/tc/forms/7024/form10.pdf" },
    { no: "AYP/14", name: "User Unit Leader Registration/Change Form", note: "Used for Unit Leader registration.", url: "https://www.scout.org.hk/uploads/tc/forms/7028/form14.pdf" },
    { no: "AYP/02-06", name: "Section Training and Assessment Application Forms", note: "For Service / Adventurous Journey / Skills / Physical Recreation / Residential Project Sections.", url: "https://hkayp.scouting.org.hk/#support" },
    { no: "Notification of Attainment", name: "Notification of Attainment of Silver/Gold Award", note: "Used to apply for the presentation ceremony after completing an Award level (FORM AYP/07 and related forms).", url: "https://hkayp.scouting.org.hk/#support" },
  ],

  BOTTOM_ACTIONS: [
    { id: "sync-plan", icon: "📋", label: "Sync Plan", target: "bt-sync" },
    { id: "conv-table", icon: "🔁", label: "Recognition", target: "bt-conv" },
    { id: "start-forms", icon: "📝", label: "Start Forms", target: "bt-forms" },
    { id: "oa-lookup", icon: "🏢", label: "Find OA", target: "bt-oa" },
    { id: "faq", icon: "❓", label: "FAQ", target: "bt-faq" },
  ],

  TOP_TABS: [
    { id: "quick", icon: "⚡", label: "Wizard", target: "quick" },
    { id: "f1", icon: "①", label: "Transfer", target: "f1" },
    { id: "f2", icon: "②", label: "Bridging", target: "f2" },
    { id: "f3", icon: "③", label: "Advance", target: "f3" },
    { id: "f5", icon: "⑤", label: "More", target: "f5" },
  ],

  SYNC_PLAN: {
    title: "Simultaneous Completion Scheme (Trial)",
    effective: "Effective: trial from 15 August 2026",
    summary: "From 15 August 2026, the way Scout Progressive Badges map to AYP Award levels has changed. It is no longer a simple one-to-one automatic conversion (\"one Scout Award = one AYP Award level\"); instead, it now works by matching individual projects/activities (training, activity, and assessment content) between the two schemes.",
    points: [
      "[Scout Advanced Award → AYP Bronze] Service is the Main Section (≥26h & ≥26w: Standard + Advanced Award ongoing service); Skills is Secondary (≥13h & ≥13w: Advanced Award B.2.a STEAM proficiency badge); Physical Recreation is Secondary (≥13h & ≥13w: physical fitness badge or ≥13h/13w training); Adventurous Journey maps to Pathfinder A.2.c + Standard A.2.e + Advanced A.2.f.I/II.",
      "[Chief Scout's Award → AYP Progressive Silver] Requires AYP Bronze completed and age ≥15 (all 3 sections ≥26h & ≥26w, no Main/Secondary split): Service maps to D.1.c ongoing service; Skills maps to A.3 Pioneering (knots/lashings, design, gear prep, construction, instruction & leading); Physical Recreation maps to fitness badge or ≥26h/26w training; Adventurous Journey maps to Adventure Option II.",
      "[Trial Adventurous Journey Rules] For Bronze, contact a qualified EA / JEA (or a CRS instructor who is also a Scout Leader) before training/assessment starts; for Progressive Silver, complete the Intermediate Hiking Course & Assessment (or arrange an EA / CRS beforehand). Units must log the assessor's name, role, qualification, unit, contact, item, date and result.",
      "[Start Date Rule (No Backdating)] All activities used for simultaneous completion must take place after officially starting that AYP level (orientation + AYP/01 + HK$45 Record Book) and using the 2026 Revised Scout Training Scheme from Pathfinder Award onwards.",
      "[Unit Expression of Interest e-Form] Scout units and leaders joining the trial can submit the official Expression of Interest Google Form (note: this does not replace AYP/01 enrolment or Record Book procedures).",
    ],
    notifyLeader: "⚠️ Before starting under this sync plan, you must proactively inform your \"User Unit Leader\", so they can confirm how you intend to report the sync and help verify which items actually meet the matching requirements — don't assume or decide for yourself which Scout activity automatically equals which AYP Section.",
    verify: "This page is for reference only and does not represent the Association's final official position. Details, matching specifics, and timelines are all subject to the latest announcements from the Scout Association of Hong Kong and confirmation from your User Unit Leader.",
    source: { label: "Circular P95/2026 \"Updated Arrangements for The Hong Kong Award for Young People\"", url: "https://www.scout.org.hk/uploads/tc/circulars/25989/p095-26.pdf" },
  },

  CONVERSION_TABLE: {
    title: "Item-by-Item Bridging Table (Unofficial Compilation)",
    unofficialTag: "Unofficial compilation — must be verified with your User Unit Leader",
    intro: "The table below is compiled by us based on the 2016 official \"Conversion Table for Sectional Progressive Badges and Awards with AYP\" (P103/2016), with badges cancelled by the 15 August 2026 circular removed, to help User Unit Leaders see how Scout activities can be bridged (recognised) towards AYP Sections. Note the official terminology is \"simultaneous completion / bridging / recognition\" — not an automatic 'badge-for-award' swap: each Section must still be signed off by the User Unit Leader and a recognised Assessor, and meet AYP's hours/duration requirements. This is NOT an official table currently published by the Scout Association — it is our own reference version reworked from the old official table.",
    excludedNote: "The following 8 Proficiency Badges, cancelled under the \"Update of Sectional Proficiency Badges\" circular (P013/26, effective 15 August 2026), have been excluded: Animal Care Badge (Interest Group), Canoe/Kayak Racing Badge (Skill Group), Sailing Helmsman Badge (Skill Group), International Friendship Badge (Skill Group), Camp Management Badge (Service Group), Canoe Lifesaving Badge (Service Group), Animal Husbandry Badge (Service Group), Animal Husbandry Badge (Instructor Group). These badges are no longer issued by the Association; even if existing holders may still wear them, they should not be used to report new AYP items.",
    groups: [
      {
        branch: "① Scout Section → AYP Bronze Award reference",
        rows: [
          { ayp: "Service Section", items: "First Aid, Life Saving (Service Group badges); or Library Management*, Diversity & Inclusion Ambassador, Resource Management (Part I), Service Award (must include at least 15 hours of service)" },
          { ayp: "Skills Section", items: "Interest Group: Collecting, Cycling, Farming (Part II or III); or (study/practice for at least 6 months) Angling, Art, Camp Cookery, Library Management*, Model Making, Music, Nature, Photography, Drill, Geology; Skill Group: Astronomy, Boatswain, Camping, Communications, Computer, Cookery (Chinese), Handicraft, Electronics, Tree Care, Map Making, Mechanics, Meteorology, Navigation, Observer, Pioneering, Backwoods Cookery; Service Group: Language, Craft, Pilotage, Secretary, Citizenship; Sea Activities: Boatman, Sailor, Boatswain's Mate; Air Activities: Junior/Intermediate/Senior Air Activities" },
          { ayp: "Physical Recreation Section", items: "Interest Group: Canoeing, Rowing, Sailing, Windsurfing (6 weeks' ongoing participation after completion, totalling at least 12 hours); or Sports, Dragon Boat, Equestrian, Park Orienteering, Swimming, Archery (12 weeks, totalling at least 12 hours); Skill Group: Canoe Polo (6 weeks' ongoing participation); or Shooting, Combative Sports, Orienteering, Free Diving, Athletics (12 weeks)" },
          { ayp: "Adventurous Journey Section", items: "Completion of the Association's Basic Hiking Training Course; or a Map Reading/Expedition Badge course led by a recognised Hiking Assessor" },
        ],
        note: "*The Interest Group's Library Management badge may map to either the Service Section or the Skills Section, but not both at the same time.",
      },
      {
        branch: "② Scout Section → AYP Silver Award (progressive, partial) reference",
        rows: [
          { ayp: "Service Section", items: "First Aid, Life Saving; or (not previously used for the Award, for at least 6 months and 30 hours of service) Library Management*, Resource Management (Part I), Diversity & Inclusion Ambassador, Service Award" },
          { ayp: "Skills Section", items: "Broadly the same groups as Bronze, but must be a Proficiency Badge not previously used for the Award (see Bronze Skills list)" },
          { ayp: "Physical Recreation Section", items: "Interest Group: Canoeing, Rowing, Sailing, Windsurfing (6 weeks' ongoing participation, totalling at least 15 hours); or Sports, Dragon Boat, Equestrian, Park Orienteering, Swimming, Archery (15 weeks, totalling at least 15 hours); Skill Group: Canoe Polo (6 weeks' ongoing participation); or Shooting, Combative Sports, Orienteering, Free Diving, Athletics (15 weeks)" },
          { ayp: "Adventurous Journey Section", items: "Can only be assessed after advancing to the Venture Scout Section: Map Reading (E-A001) + Hiking Training (E-A002) + a 50km overland hike or a 3-day-2-night 40km journey (training, practice and assessed journey each once), must be led by an AYP Adventurous Journey Instructor of Silver level or above" },
        ],
      },
      {
        branch: "③ Venture Scout Section → AYP Silver Award (progressive or direct) reference",
        rows: [
          { ayp: "Service Section", items: "Venture Scout Award \"Commitment\" badge: R-A102 First Aid; or R-A104 Life Saving (II)" },
          { ayp: "Skills Section", items: "One item from the Venture Scout Award \"Activity\" badge (progressive Silver entrants must maintain for 6 months / direct Silver entrants for 12 months), e.g. Astronomy, Calligraphy, Pottery, Painting, Sculpture, Graphic Design, Silk Screen Printing, Civic Affairs, Computer, Photography, Digital Photography, Film Theory & Production, Drama, Language, Meteorology, Music, Philately, Fashion Tailoring, Radio Construction, Amateur Radio, Horticulture, Forestry, Angling, Parachuting, Flying, Canoe Building, plus Sea/Air Activities (Boatswain's Mate / Deputy Coxswain, Junior/Intermediate/Senior Air Crew, etc.)" },
          { ayp: "Adventurous Journey Section", items: "Map Reading (E-A001) + Hiking Training (E-A002) + a 50km overland hike or a 3-day-2-night 40km journey, must be led by an AYP Adventurous Journey Instructor of Silver level or above" },
          { ayp: "Physical Recreation Section", items: "Silver-level Physical Recreation training course; or Venture Scout Award \"Activity\" badge physical skill (15 weeks, totalling at least 15 hours), covering ball sports, water sports, athletics, cycling, equestrian, orienteering, archery, fitness training, etc." },
        ],
      },
      {
        branch: "④ Venture Scout Section → AYP Gold Award (progressive) reference",
        rows: [
          { ayp: "Service Section", items: "Queen's Scout Award \"Commitment\" Gold Bar: R-B201 Voluntary Service; or R-B202 Specialised Skill Service; or R-B203 Scout and Community Service (for at least 12 months)" },
          { ayp: "Skills Section", items: "All units A-101 to A-104 of the Venture/Queen's Scout Award \"Scoutcraft Skills\"; or one item from \"Personal Interest\" reaching a recognised standard (for at least 12 months), e.g. Astronomy, Calligraphy, Pottery, Painting, Computer, Photography, Drama, Language, Meteorology, Music, Horticulture, Forestry, Angling, etc." },
          { ayp: "Adventurous Journey Section", items: "Venture Scout \"Expedition\" badge training and practice component + Advanced Hiking Training Course + one 4-day-3-night 60km journey, must be led by an AYP Adventurous Journey Instructor of Gold level" },
          { ayp: "Physical Recreation Section", items: "Gold-level Physical Recreation training course; or one sport sustained for 18 weeks, totalling at least 18 hours" },
          { ayp: "Residential Project Section", items: "Venture Scout Award \"Interpersonal Relationships\" exchange activity item 1 — an international/Mainland exchange activity of at least 5 days 4 nights (including Jamborees, international youth forums, etc.); self-arranged tourism/sightseeing trips do not qualify" },
        ],
      },
      {
        branch: "⑤ Rover Scout Section → AYP Gold Award (progressive or direct) reference",
        rows: [
          { ayp: "Service Section", items: "Rover Scout Training Scheme \"Community Service\" (I) or (II) item" },
          { ayp: "Skills Section", items: "One \"Personal Interest\" item, sustained for 12 months (Silver Award holders) or 18 months (non-Silver Award holders), with related activity at least twice a month, e.g. angling, driving, handicraft, art, music, collecting, bonsai, dance, cooking, etc." },
          { ayp: "Adventurous Journey Section", items: "Venture Scout \"Expedition\" badge or Rover Scout \"Challenge\" (b) Outdoor Challenge + Advanced Hiking Training Course + one 4-day-3-night 60km journey, must be led by an AYP Adventurous Journey Instructor of Gold level" },
          { ayp: "Physical Recreation Section", items: "Gold-level Physical Recreation training course; or one sport sustained for 18 weeks, totalling at least 18 hours" },
          { ayp: "Residential Project Section", items: "Rover Scout \"Know the World\" Part 1; or participation in a World/Regional/National Scout Jamboree of at least 5 days 4 nights" },
        ],
      },
    ],
    footnote: "Participants must complete at least two Sections before starting the next Award level's activities, and one of those Sections must be from the completed lower Award; the participant must also already exceed the minimum age for the higher Award level. All activities used for bridging must take place after you officially start that Award level (Record Book issued) — no backdating.",
    officialSource: { label: "\"Conversion Table for Sectional Progressive Badges and Awards with AYP\" P103/2016 (old scheme, for compilation reference only)", url: "https://www.scout.org.hk/article_attach/26708/p103-16.pdf" },
    cancelSource: { label: "Circular P013/26 \"Update of Sectional Proficiency Badges\" (cancellation list effective 15 August 2026)", url: "https://www.scout.org.hk/uploads/tc/circulars/23262/p013-26.pdf" },
  },

  OA_LOOKUP: {
    title: "Find Your Operating Authority / User Unit Leader",
    intro: "To verify your Region's Operating Authority contact details, or to confirm who the qualified User Unit Leader is, use the following official resources:",
    links: [
      { label: "📋 User Unit List (PDF, names of Unit Leaders by District/Group)", url: "https://scout.org.hk/uploads/editor/department_page/uul_list.pdf" },
      { label: "📞 AYP Enquiries / Contact Us (official AYP page)", url: "https://hkayp.scouting.org.hk/#about/contact" },
      { label: "🏕️ Scout Association of Hong Kong — AYP Scout Operating Authority homepage", url: "https://hkayp.scouting.org.hk/#home" },
    ],
    regionsTitle: "Regional office phone numbers (general enquiries)",
    regions: [
      { name: "Hong Kong Island Region", tel: "2574 4296" },
      { name: "Kowloon Region", tel: "2957 6488" },
      { name: "East Kowloon Region", tel: "2957 6466" },
      { name: "New Territories Region", tel: "2425 5999" },
      { name: "New Territories East Region", tel: "2667 9100" },
      { name: "Programme Branch", tel: "2957 6411 / 2957 6417" },
    ],
    caveat: "The above contact details and lists are subject to the latest publication on the Scout Association of Hong Kong website; please check with your Regional office for updates.",
  },

  COMPLETE: {
    steps: [
      "Once you've completed all Sections for a level and met the requirements, you can apply for your certificate and badge.",
      "Bronze: presented by the individual Operating Authority — apply as instructed by your Operating Authority.",
      "Silver/Gold: submit the \"Notification of Attainment of Silver/Gold Award\" (FORM AYP/07) → reviewed by the Regional office → forwarded to the Award Office to arrange the presentation.",
      "Silver Awards are coordinated and presented by the Award Office; Gold Awards are presented by the Chief Executive of the HKSAR (at a designated ceremony).",
    ],
    tip: "After completing your Award, consider becoming an Instructor/Assessor to support the Scout Operating Authority and help younger members.",
  },

  TIMELINE: [
    { age: "11–13", text: "Scout Section; under 14 — focus first on Scout Progressive Badges, which can later be simultaneously completed / bridged towards AYP (remember: activities before your start date cannot be backdated)." },
    { age: "13", text: "May apply for Bronze under a special arrangement (done with an age-appropriate peer group)." },
    { age: "14", text: "Generally eligible for Bronze; earning the \"Scout Advanced Award\" simultaneously completes AYP Bronze." },
    { age: "15", text: "Eligible for Silver (progressive or direct)." },
    { age: "15–16", text: "Venture Scout Section; may start at Bronze/Silver/Gold." },
    { age: "16", text: "Eligible for Gold (Progressive after Silver, or Direct Gold; Gold Sections require submitting AYP/02–06 at least 2 months prior)." },
    { age: "18–22", text: "Rover Scout / Young Leader; may enter Gold directly." },
    { age: "23", text: "Latest date for entry is your 23rd birthday." },
    { age: "25", text: "All Award levels must be completed before your 25th birthday." },
  ],

  WIZARD: {
    roles: [
      { id: "scout",   icon: "🧭", label: "Scout",             desc: "approx. 11–16" },
      { id: "venture", icon: "⛰️", label: "Venture Scout",     desc: "approx. 15–20" },
      { id: "rover",   icon: "🌍", label: "Rover Scout",       desc: "approx. 18–25" },
      { id: "leader",  icon: "👔", label: "Young Leader",      desc: "Valid appointment" },
      { id: "young",   icon: "🧒", label: "Cub Scout / Underage", desc: "Under 13–14" },
      { id: "unsure",  icon: "❓", label: "Not sure / Helping someone", desc: "Starting from scratch" },
    ],
    statuses: [
      { id: "fresh",   icon: "🌱", label: "Haven't started AYP",  desc: "Never applied before" },
      { id: "doing",   icon: "📝", label: "In progress elsewhere", desc: "School / other uniformed group" },
      { id: "done",    icon: "✅", label: "Completed a lower Award", desc: "Want to move up a level" },
      { id: "overseas",icon: "🌏", label: "Transferring from overseas", desc: "Duke of Edinburgh's International Award" },
      { id: "messy",   icon: "📂", label: "Records incomplete/lost", desc: "Not sure what to do" },
      { id: "sync",    icon: "🏅", label: "Want to bridge Scout badges", desc: "Sync / recognition towards AYP" },
    ],
    roleNote: {
      scout: "💡 You're a Scout: earning the \"Scout Advanced Award\" simultaneously completes AYP Bronze — it's the best-value route.",
      venture: "💡 You're a Venture Scout: you may start at Bronze/Silver/Gold depending on age; Venture activities can map to AYP Sections.",
      rover: "💡 You're a Rover Scout: you may start at Bronze/direct Silver/direct Gold; remember your 23rd birthday is the latest date for entry.",
      leader: "💡 You're a Young Leader: with a valid appointment you can apply for Gold directly through the Programme Branch.",
      young: "💡 You're still young: activities done while underage don't count towards AYP — focus on Scout Progressive Badges to prepare the way.",
      unsure: "💡 No worries if you're not sure: follow the 3 steps below, and just read the script aloud when asking your leader.",
    },
  },

  PLANS: {
    fresh: {
      icon: "🌱", pos: "You're at the starting point: haven't started AYP yet, starting from zero.",
      route: "Start normally, and take the best-value \"Simultaneous Completion\" route along the way",
      steps: [
        "Do the \"3 Checks for Beginners\": ask your Group/Unit Leader whether you've made your Promise, whether there's a User Unit, and who the Unit Leader is (about 10 minutes to sort out).",
        "Complete the \"Participant Orientation\" first (in-person sessions continue; online orientation video launching soon), then submit FORM AYP/01 + HK$45 for your Record Book.",
        "Only start counting once you have the Record Book! As a Scout, aim for the \"Advanced Award\" = simultaneously completing Bronze.",
      ],
      who: "Your Group/Unit Leader + User Unit Leader", forms: "AYP/01",
      time: "About 2–4 weeks to complete", link: "#f4", linkLabel: "See the standard process in detail",
      warn: "Activities done before you receive the Record Book don't count — don't rush, start only once you have it.",
    },
    doing: {
      icon: "📝", pos: "You're halfway through: making progress at school/another Operating Authority, and want to transfer into Scouts.",
      route: "Transfer into Scouts — already-approved Sections carry over, no need to redo them",
      steps: [
        "Do the \"3 Checks for Beginners\", and find the right User Unit Leader on the Scout side.",
        "Submit FORM AYP/09 + your original Record Book / proof of approved Sections (photocopy for your records), and wait for the leader to confirm.",
        "Use the \"What's still missing\" calculator below to tick off already-approved Sections and see clearly what's left to complete.",
      ],
      who: "Scout Unit Leader + original Operating Authority's Unit Leader", forms: "AYP/09",
      time: "About 2–4 weeks to process", link: "#f1", linkLabel: "Go to the \"What's still missing\" calculator",
      warn: "Already-approved Sections generally don't need to be redone, but both Unit Leaders must verify them — having all documents ready makes it smoothest.",
    },
    done: {
      icon: "✅", pos: "You've completed a lower Award: you want to start the next level in Scouts.",
      route: "Transfer in with your Award, and start Silver/Gold directly",
      steps: [
        "Do the \"3 Checks for Beginners\", and find the right leader on the Scout side.",
        "Submit FORM AYP/09 + proof of your completed Award, and specify which level you want to start.",
        "Continue according to the new level's requirements: after completing Silver/Gold, submit a Notification of Attainment to apply.",
      ],
      who: "Scout Unit Leader", forms: "AYP/09",
      time: "About 2–4 weeks to process", link: "#f5", linkLabel: "See case B in detail",
      warn: "Whether this can be carried over needs to be verified by the Scout Operating Authority — having all your proof documents ready is safest.",
    },
    overseas: {
      icon: "🌏", pos: "You're doing the Duke of Edinburgh's International Award overseas, and want to continue through Hong Kong Scouts.",
      route: "International mutual recognition + transfer, bringing your records to Hong Kong",
      steps: [
        "Gather all your overseas official records/certificates (English originals + copies).",
        "Do the \"3 Checks for Beginners\", find the right Scout Unit Leader, and submit FORM AYP/09 + your overseas records for verification.",
        "Wait for the Operating Authority / Award Office to verify each item, and see if any Sections need to be redone.",
      ],
      who: "Scout Unit Leader + Programme Branch", forms: "AYP/09",
      time: "Verification takes time — allow extra time", link: "#f5", linkLabel: "See case F in detail",
      warn: "Whether overseas records can be fully carried over must be verified item by item — the more complete your documents, the faster this goes.",
    },
    messy: {
      icon: "📂", pos: "Your records are incomplete / your Record Book is lost — don't rush to transfer just yet.",
      route: "Fix your records first, then transfer",
      steps: [
        "Contact your \"original Operating Authority's\" Unit Leader immediately: ask if there's a backup on file, or if proof can be reissued.",
        "Unconfirmed activities won't count — don't delay, the sooner you sort this out the better.",
        "Once your records are sorted, follow the \"transfer in\" procedure and submit FORM AYP/09 to Scouts.",
      ],
      who: "Original Operating Authority's Unit Leader (first) → Scout Unit Leader (after)", forms: "AYP/09 (once records are complete)",
      time: "Depends on what the original Operating Authority has on file", link: "#f5", linkLabel: "See case G in detail",
      warn: "AYP relies on the Record Book — if it's lost, ask your original Operating Authority as soon as possible, don't wait until you transfer.",
    },
    sync: {
      icon: "🏅", pos: "You have Scout Awards/badges and want to know how they can be bridged (recognised) towards AYP.",
      route: "Whole-Award simultaneous completion + Section bridging/recognition, no need to do things twice",
      steps: [
        "Whole Award: Scout Advanced Award → simultaneously completes Bronze; after completing Bronze, Chief Scout's Award → Progressive Silver (currently on trial).",
        "By Section: Scout activities/badges can be bridged towards Service / Skills / Physical Recreation / Adventurous Journey / Residential Project Sections, but must be formally reported.",
        "Before proceeding, ask your User Unit Leader and check the Operating Authority's website for the latest guidance — don't assume automatic recognition.",
      ],
      who: "User Unit Leader", forms: "Report as guided by your Operating Authority",
      time: "Follows your progress on the Scout Award", link: "#f2", linkLabel: "See bridging details",
      warn: "\"Earning a Scout Award\" doesn't automatically mean you have AYP — every Section still needs to go through AYP's formal reporting process and be signed off by your Unit Leader / a recognised Assessor; and activities must take place after your official start date for that level — no backdating.",
    },
  },

  SECTION_TLDR: {
    f1: "Already-approved Sections carry over — no need to redo them. Use the calculator below to tick off approved Sections and see instantly what's left.",
    f2: "A whole Award relies on \"Simultaneous Completion\"; individual Sections rely on \"bridging (recognition) + formal reporting\". Both must be verified through the Operating Authority and recognised Assessors — neither is automatic, and activities before your start date can't be backdated.",
    f3: "Advancing Sections within the same Operating Authority doesn't reset your AYP progress — just update your User Unit information; but moving in from another Operating Authority requires the FORM AYP/09 transfer procedure.",
    f4: "3 Checks → Orientation → AYP/01 + $45 → Get your Record Book → Only then start counting. Just follow these steps.",
    f5: "Special situations like transferring out, topping up hours, or record problems — open the card that matches you, no need to read them all.",
  },

  SOURCES: [
    { label: "Programme Branch Circular P95/2026 \"Updated Arrangements for The Hong Kong Award for Young People\"", url: "https://www.scout.org.hk/uploads/tc/circulars/25989/p095-26.pdf" },
    { label: "P22/2026 \"Newly Revised Sectional Training Scheme\"", url: "https://www.scout.org.hk/uploads/tc/circulars/23585/p022-26.pdf" },
    { label: "P96/2026 \"Formal Implementation and Publication Arrangements of the Newly Revised Sectional Training Scheme\"", url: "https://www.scout.org.hk/uploads/tc/circulars/25990/p096-26.pdf" },
    { label: "Scout Association of Hong Kong — circulars listing (filter by Programme Branch for the latest AYP-related circulars)", url: "https://www.scout.org.hk/tc/circulars-forms/circulars/index.html" },
    { label: "Scout Association of Hong Kong — AYP Scout Operating Authority", url: "https://hkayp.scouting.org.hk/#home" },
    { label: "\"Reference Table of Sectional Progressive Badges and Their Relation to AYP\" P103/2016 (old scheme, for reference)", url: "https://www.scout.org.hk/article_attach/26708/P103-16.pdf" },
    { label: "The Hong Kong Award for Young People (Award Office) — ayp.org.hk", url: "https://www.ayp.org.hk" },
  ],

  DISCLAIMER: "This app is an unofficial aid tool. The official rules of The Hong Kong Award for Young People, as well as trial arrangements such as the \"Simultaneous Completion Scheme\", Section bridging/recognition, and transfer details, are subject to the latest public announcements from the Award Office and the Scout Association of Hong Kong (circulars such as P95/2026, and the AYP Scout Operating Authority webpage). Operational details may be updated at any time — please verify with your User Unit Leader / Scout leader before proceeding. Note also that AYP activities count only from your official start date — activities before that date generally cannot be backdated (No Backdating).",

  UI: {
    heroLead: "🌱 <b>Standard process: start AYP from zero by following the action card.</b> Not sure which situation fits you? Tap ⚡ Wizard above and answer 2 questions.",
    mini1: "① Follow the action card<br>Tick off step by step", mini2: "② Expand for details<br>Checks/steps/timeline", mini3: "③ Forms & leaders<br>Use tools below",
    quickTitle: "5-Minute Wizard: What's your situation? What's next?",
    beginnerTitle: "3 Checks for Beginners", beginnerSub: "When you don't know anything — how to check, who to ask, what to look at, step by step",
    beginnerIntro: "Whichever route you take, you need to pass these 3 checks first: made your Promise? Have a User Unit? Is the leader the right one? Every card includes a \"script to read aloud\" when asking your leader.",
    f1Title: "Transferring into Scouts from another Operating Authority → what's still needed", f1Tag: "(Feature ①)",
    f1Hint: "Click \"① Choose your Award level\" + \"② Tick off approved Sections\" 👇",
    ti1Summary: "What am I still missing after transferring in?", ti2Summary: "Administrative procedure for transferring into the Scout Operating Authority",
    f2Title: "Bridging situations (Simultaneous completion / Recognition)", f2Tag: "(Feature ②)",
    c2aSummary: "Bridging the whole Award: Scout Progressive Badge synchronised with AYP",
    c2bSummary: "Section bridging / recognition reference: Scout activities / badges → AYP Sections",
    f3Title: "Which Section leads to what, and what to do after advancing", f3Tag: "(Feature ③)",
    f31Summary: "Scout → Venture Scout → Rover Scout: how to follow up on AYP at each stage",
    f3Warn: "AYP follows the \"participant\" and the \"Operating Authority\", not the Scout Section — as long as you stay within the Scout Association of Hong Kong's Operating Authority, advancing from Scouts to Venture Scouts to Rover Scouts keeps your Record Book and AYP progress valid (no reset); after advancing, just ask your Unit Leader to update your User Unit information. ⚠️ However, if you're moving in from a school/other Operating Authority (e.g. continuing AYP with a Scout Group after secondary school), it is NOT just an information update — you must complete the Change of Operating Authority procedure (FORM AYP/09) for your records to formally carry over.",
    f4Title: "Standard process for starting AYP in each Section", f4Tag: "(Feature ④)",
    f41Summary: "Starting from scratch: general steps + what each Section can take",
    f5Title: "Other possible situations", f5Tag: "(Feature ⑤)",
    f5Sub: "Reverse direction / additional situations",
    resTlSummary: "Timeline: when to start",
    resGlSummary: "Glossary of terms",
    resFaqSummary: "Frequently Asked Questions",
    faqViewTitle: "FAQ & Glossary",
    compTitle: "After completion: receiving your Award/certificate", compSummary: "How do I receive my Award after completing a level?",
    sourcesTitle: "Official sources",
    footerLine1: "AYP Scout Bridging Guide ·",
    footerLine2: "© 2026 Scout System · Unofficial aid tool · For educational purposes only",
    fabTopAria: "Back to top",
    langToggleAria: "Switch language / 切換語言",

    pickLevel: "① Choose the Award level you want to complete",
    tickDone: "② Tick the Sections \"already approved at your original Operating Authority\"",
    tickHint: "* All unticked by default. \"Approved Sections\" means Sections already signed off by an Instructor/Assessor and logged in your Record Book at your original Operating Authority.",
    resultHeadSuffix: " — Still to complete after transferring into the Scout Operating Authority",
    allDone: (lvName) => `🎉 You've had all ${lvName} Sections approved! After transferring into Scouts, in principle you only need to complete the administrative handover to claim this Award level. (Silver/Gold require submitting a Notification of Attainment.)`,
    howToFill: "🏕️ How to complete it in Scouts:",
    scoutBadgeLabel: "Scout Award",
    aypLabel: "AYP",
    syncArrow: "➜ Simultaneously completes ➜",
    applicableLabel: "Applies to: ",
    upgradeArrow: "⬆ Advance",
    canTakeLabel: "🎯 Can take",
    syncMapLabel: "🔗 Sync/Map",
    afterUpgradeLabel: "⬆ After advancing",
    whichSectionCanDo: "Which Section can take what?",
    wizDone: "✅ Done! Here's your action card —",
    wizStep: (n, q) => `Step ${n} of 2: ${q}`,
    wizQ1: "Who are you?", wizQ2: "Where are you with AYP?",
    wizRoleHeading: "① Who are you? (Pick one)",
    wizStatusHeading: "② Where are you with AYP? (Pick one)",
    wizEmpty: "👆 Pick one from each above, and in 3 seconds get your \"action card\": your current position, recommended route, and next steps.",
    routeLabel: "🎯 Recommended route: ",
    progressLabel: (done, total) => `Completed ${done}/${total} steps`,
    whoLabel: "🧑‍🏫 Who to ask", formsLabel: "📄 Forms", timeLabel: "⏱️ Time needed",
    resetBtn: "↺ Start over",
    howToCheck: "🔍 How to check? (3 methods)",
    askLabel: "💬 Script to ask: ",
    ifNotPrefix: "🆘 If the answer is \"no\": ",
    tldrTag: "⚡ 30-sec summary",
    aLabel: "A: ",
    disclaimerTitle: "Disclaimer",
    baselineFoot: "Data baseline: October 2026 (Circular P95/2026 + new hkayp.scouting.org.hk)",

    quickNavAria: "Bottom tool bar",
    topBarAria: "Top guide bar",
    unofficialBadge: "⚠️ Unofficial compilation — must be verified with your User Unit Leader",
    backdateWarn: "🚫 <b>No Backdating warning:</b> AYP activity hours and frequency count only from your <b>official start date of that Award level</b> (successful enrolment and issue of the Record Book). Scout activities, service hours or badge records from before your start date generally <b>cannot be backdated</b> into AYP — never assume old Scout records can be reported automatically.",
    verifyBeforeAct: "Verify before acting: ",
    openOfficialLink: "View official source →",
    syncPlanEffective: "Effective: ",
    syncPlanNotify: "Notify your Unit Leader: ",
    conversionOfficialBase: "Base data: ",
    conversionExcluded: "Cancelled badges excluded: ",
    conversionCancelSource: "Cancellation list source: ",
    formsDownload: "Download form",
    oaRegionsTitle: "Regional office phone numbers",
    backHome: "Normal Flow",
  },
},

};


/* ===========================================================
   2026 實戰強化互動工具包資料庫（針對 hkayp.scouting.org.hk 靜態網頁痛點強化）
   =========================================================== */
LOCALES["zh-HK"].POWER = {
  calcTitle: "🧮 AYP 時數・週數・死線計算器 ＋ 個人進度追蹤",
  calcSub: "（官網冇嘅實戰工具：自動計最早完成日、23/25歲死線、金章提前2個月交表日，進度自動儲存）",
  calcIntro: "揀你嘅章級路徑、主項同正式開展日（獲發紀錄簿日），即刻幫你算出每一科「最快幾號可以簽結」，仲可以記錄時數同週數防中伏！",
  paths: {
    bronze: {
      name: "🥉 銅章", minAge: 14, specialAge: 13, splitMain: true,
      mainH: 26, mainW: 26, subH: 13, subW: 13,
      expText: "1日基本訓練 ＋ 1日實習旅程 ＋ 2日1夜評核旅程（≥12小時計劃活動）",
      resText: null,
      note: "通常年滿 14 歲；年滿 13 歲童軍可按特別安排申請（須完成迎新講座、與適齡朋友以小組形式進行、獲執行處酌情批准）。"
    },
    progSilver: {
      name: "🥈 漸進銀章（已完成銅章）", minAge: 15, specialAge: null, splitMain: false,
      mainH: 26, mainW: 26, subH: 26, subW: 26,
      expText: "1日進階訓練 ＋ 1次2日1夜實習 ＋ 3日2夜評核旅程（≥21小時計劃活動）",
      resText: null,
      note: "須已完成銅章並年滿 15 歲；服務、技能、康體三科不分主副，每科均須 ≥26 小時及持續 ≥26 星期。"
    },
    directSilver: {
      name: "🥈 直接銀章（未有銅章）", minAge: 15, specialAge: null, splitMain: true,
      mainH: 52, mainW: 52, subH: 26, subW: 26,
      expText: "1日基本訓練 ＋ 2次2日1夜實習 ＋ 3日2夜評核旅程（≥21小時計劃活動）",
      resText: null,
      note: "未完成銅章而直接參加銀章；三科中揀一科做主項（≥52小時及≥52星期），其餘兩科為副項（≥26小時及≥26星期）。"
    },
    progGold: {
      name: "🥇 漸進金章（已完成銀章）", minAge: 16, specialAge: null, splitMain: false, isGold: true,
      mainH: 52, mainW: 52, subH: 52, subW: 52,
      expText: "2日進階訓練 ＋ 1次2日1夜實習 ＋ 4日3夜評核旅程（≥32小時計劃活動）",
      resText: "離開日常環境，與平日不相熟青年人連續外宿 5 日 4 夜，完成有意義活動（須事先獲批）",
      note: "須已完成銀章並年滿 16 歲；服務、技能、康體三科不分主副，每科均須 ≥52 小時及持續 ≥52 星期。⚠️ 各科開始前最少 2 個月須經 UUL 簽署交 AYP/02–06 予地域辦事處！"
    },
    directGold: {
      name: "🥇 直接金章（未有銀章）", minAge: 16, specialAge: null, splitMain: true, isGold: true,
      mainH: 78, mainW: 78, subH: 52, subW: 52,
      expText: "1日基本訓練 ＋ 2次2日1夜及1次3日2夜實習 ＋ 4日3夜評核旅程（≥32小時計劃活動）",
      resText: "離開日常環境，與平日不相熟青年人連續外宿 5 日 4 夜，完成有意義活動（須事先獲批）",
      note: "未完成銀章而直接參加金章（青年領袖 18–23 歲亦適用）；主項 ≥78 小時及 ≥78 星期，兩副項各 ≥52 小時及 ≥52 星期。⚠️ 各科開始前最少 2 個月須交 AYP/02–06 予地域辦事處！"
    }
  },
  labels: {
    pickPath: "① 揀章級及路徑",
    pickMain: "② 揀主項科目（時數及週數較高嗰科）",
    noSplitHint: "✅ 漸進路徑三科要求相同，無須區分主項／副項。",
    startDate: "③ 正式開展日期（獲發紀錄簿日）",
    birthDate: "④ 出生日期（選填：自動驗算 13–16歲資格 ＋ 23歲申請／25歲完成死線）",
    goldTargetDate: "⑤ 金章預計科目開始日（自動倒推提前 2 個月交 AYP/02–06 死線）",
    mainTag: "主項",
    subTag: "副項",
    equalTag: "漸進統一要求",
    reqFormat: (h, w) => `最低要求：≥ ${h} 小時 ＋ 持續 ≥ ${w} 星期`,
    earliestDate: "📅 最快可完成日期：",
    daysLeft: (d) => d > 0 ? `（距離今日仲有 ${d} 日）` : `（已滿所需週數！）`,
    setStartFirst: "請先喺上面輸入「正式開展日期」以計算最快完成日",
    hoursLogged: "已累積時數 (小時)",
    weeksLogged: "已持續週數 (星期)",
    trapWarn: (remW) => `⚠️ 防中伏警告：你嘅時數已達標，但持續期仲欠 ${remW} 星期！AYP 規定必須「同時」滿足最低時數及最低持續週數，千祈唔好提早停做或搵評核員補簽！`,
    secDone: "✅ 時數及持續週數均已達標！記得請導師／評核員填寫具體評語並簽署。",
    expDoneLabel: "已完成訓練、實習及評核旅程並獲簽署",
    resDoneLabel: "已完成 5 日 4 夜團體生活並獲簽署",
    ageCheckTitle: "🎂 年齡資格與死線診斷",
    ageNow: (y, m) => `目前年齡：約 ${y} 歲 ${m} 個月`,
    deadline23: "📌 最後報名申請限期（23歲生日當天）：",
    deadline25: "🏁 所有活動最後完成限期（25歲生日前）：",
    goldDeadlineTitle: "🚨 金章提前 2 個月交表死線倒數（AYP/02–06）",
    goldRegionalDate: "🏢 最遲交抵地域辦事處（開展前 60 日）：",
    goldUulDate: "🧑‍🏫 建議交支部組長 (UUL) 商討及簽署（開展前 75 日）：",
    copySummaryBtn: "📋 複製我嘅 AYP 進度報告（傳畀組長／UUL）",
    resetCalcBtn: "↺ 重設進度數據",
    copiedToast: "✅ 已複製到剪貼簿！可以直接貼去 WhatsApp / Signal 傳畀組長。"
  },

  syncChecker: {
    title: "🔗 2026「童軍同步完成方案」互動對接核對器",
    sub: "（按 2026-09-16 新版官網對接細項製作：逐項剔選，即知仲差邊項 AYP 手續未齊）",
    eformBtn: "📝 填寫官方「同步計劃參與意向登記表」(Google Form)",
    eformUrl: "https://docs.google.com/forms/d/e/1FAIpQLScvAVc-otJsKUv7xdMroTNaQqAWp_Igyk-3Fud45Wx2Z8xiPw/viewform?usp=sharing&ouid=107671158074138069832",
    eformNote: "⚠️ 注意：此 Google Form 僅供單位／領袖登記參與試行意向，絕對唔會取代參加者迎新講座、AYP/01 參加申請、$45 紀錄簿申請及各自審批程序！",
    routes: {
      bronze: {
        label: "🥉 童軍高級獎章 → AYP 銅章",
        badgePair: "童軍高級獎章 ➔ AYP 銅章（服務為主項，技能、康體為副項）",
        items: [
          { id: "b_pre1", cat: "前置程序", title: "已完成參加者迎新講座，並交 AYP/01 及 HK$45 獲發紀錄簿", detail: "紅線：所有同步完成活動必須喺獲發紀錄簿（正式開展日）之後進行，不可追溯。" },
          { id: "b_pre2", cat: "前置程序", title: "由「探索獎章」開始使用 2026 年新版《童軍訓練綱要》，並通知 UUL 參與同步方案", detail: "單位／領袖可同時透過官方 e-Form 提交參與試行意向。" },
          { id: "b_srv", cat: "🤝 服務科（主項）", title: "完成童軍「標準獎章」＋「高級獎章」持續服務項目，並累積 ≥26 小時及持續 ≥26 星期", detail: "注意：如童軍考驗已完成但未夠 26 星期／26 小時，須繼續參與服務直至達標。" },
          { id: "b_skl", cat: "🛠️ 技能科（副項）", title: "完成高級獎章 B.2.a 所選一項 STEAM（科學/科技/工程/藝術/數學）合資格專科徽章，並累積 ≥13 小時及持續 ≥13 星期", detail: "團集會、專題訓練、個人練習、作品製作及考驗均可計入持續學習歷程；留意剔除 P013/26 已取消之 8 個徽章。" },
          { id: "b_phy", cat: "🏃 康樂體育科（副項）", title: "完成體適能相關專科徽章，或進行 ≥13 小時並持續 ≥13 星期嘅體適能訓練", detail: "學校校隊、體育會或旅團定期運動訓練，只要符合時數、持續期及有紀錄均可納入。" },
          { id: "b_exp1", cat: "🧭 野外鍛鍊科（事前關鍵）", title: "【開訓前】已聯絡具資格嘅 EA / JEA（或同時為童軍領袖之 CRS 遠足導師）審視前期訓練", detail: "未能自行聯絡時可由區會協助；切勿未搵 EA/JEA 就自己行完算數！" },
          { id: "b_exp2", cat: "🧭 野外鍛鍊科（考驗項目）", title: "完成探索獎章 A.2.c ＋ 標準獎章 A.2.e ＋ 高級獎章 A.2.f.I 或 A.2.f.II，並保存 EA/JEA/CRS 考驗人員完整紀錄", detail: "旅團須記錄考驗人員姓名、身分、資格、所屬單位、聯絡方法、考驗項目、日期及結果。" },
          { id: "b_fin", cat: "🏁 雙線審批", title: "分別完成童軍高級獎章簽發，以及經 UUL 核對紀錄簿辦理 AYP 銅章完成確認", detail: "兩套獎章制度獨立，必須分別完成審批程序先會獲發兩邊獎章。" }
        ]
      },
      silver: {
        label: "🥈 總領袖獎章 → AYP 漸進銀章",
        badgePair: "總領袖獎章 ➔ AYP 漸進銀章（須已完成 AYP 銅章；三科不分主副）",
        items: [
          { id: "s_pre1", cat: "前置程序", title: "已完成 AYP 銅章、年滿 15 歲，並喺紀錄簿正式開展「漸進銀章」", detail: "必須喺正式開展漸進銀章後進行相關活動，不可追溯。" },
          { id: "s_srv", cat: "🤝 服務科（≥26h & ≥26w）", title: "完成總領袖獎章 D.1.c 持續服務項目，並累積 ≥26 小時及持續 ≥26 星期", detail: "漸進銀章三科不分主副，服務科須滿 26 小時及持續不少於 26 星期。" },
          { id: "s_skl", cat: "🛠️ 技能科（≥26h & ≥26w）", title: "完成總領袖獎章 A.3「先鋒工程」（含繩結編結、設計、器材準備、建造、教授技巧及帶領小隊），並累積 ≥26 小時及持續 ≥26 星期", detail: "包括課堂準備、工程設計、器材籌備、實地建造及帶領教授小隊嘅完整歷程。" },
          { id: "s_phy", cat: "🏃 康樂體育科（≥26h & ≥26w）", title: "完成體適能相關專科徽章，或進行 ≥26 小時並持續 ≥26 星期嘅體適能訓練", detail: "須展示比銅章更高水平或新的個人目標，並有持續 26 星期紀錄。" },
          { id: "s_exp1", cat: "🧭 野外鍛鍊科（歷險選項 II）", title: "完成總領袖獎章「歷險選項 II」（進階基本訓練、1日訓練旅程、2日1夜實習旅程及 3日2夜評核旅程）", detail: "成員應完成中階遠足訓練班及中階遠足考驗；如未能參加，旅團須在開始前聯絡合適 EA 或按規定尋求區會／CRS 協助。" },
          { id: "s_exp2", cat: "🧭 野外鍛鍊科（人員紀錄）", title: "已完整保存野外鍛鍊考驗人員（EA / CRS）姓名、資格、單位、聯絡、日期及結果紀錄", detail: "可使用下方「野外鍛鍊考驗人員紀錄產生器」一鍵整理留底。" },
          { id: "s_fin", cat: "🏁 雙線審批", title: "分別完成總領袖獎章審批，以及經 UUL 提交 AYP/07（或 AYP/12）辦理漸進銀章完成確認", detail: "提交地域辦事處覆核並轉交總辦事處安排領獎。" }
        ]
      }
    },
    eaLoggerTitle: "🏕️ 領袖專用：試行期野外鍛鍊「考驗人員紀錄卡」產生器",
    eaLoggerDesc: "新官網規定：「旅團須記錄考驗人員姓名、身分、資格、所屬單位、聯絡方法、考驗項目、日期及結果。」填妥下方欄位即可自動保存並一鍵複製標準格式留底！",
    eaFields: {
      memberName: "參加成員姓名",
      awardRoute: "同步路線（銅章／漸進銀章）",
      assessorName: "考驗人員姓名",
      assessorRole: "身分及資格（例：EA / JEA / CRS＋童軍領袖）",
      assessorUnit: "所屬單位／區會",
      assessorContact: "聯絡電話／電郵",
      examItems: "考驗項目（例：探索A.2.c＋標準A.2.e＋高級A.2.f.I / 歷險選項II）",
      examDates: "進行／考驗日期",
      examResult: "考驗結果及備註"
    },
    eaCopyBtn: "📋 複製「野外鍛鍊考驗人員官方格式紀錄」"
  },

  cancelledBadges: [
    { name: "愛護動物章", group: "興趣組", en: "Animal Care Badge" },
    { name: "獨木舟國際賽艇章", group: "技能組", en: "Canoe/Kayak Racing Badge" },
    { name: "風帆賽艇舵手章", group: "技能組", en: "Sailing Helmsman Badge" },
    { name: "國際友誼章", group: "技能組", en: "International Friendship Badge" },
    { name: "營地管理章", group: "服務組", en: "Camp Management Badge" },
    { name: "獨木舟救生章", group: "服務組", en: "Canoe Lifesaving Badge" },
    { name: "護養章（服務組）", group: "服務組", en: "Animal Husbandry Badge (Service)" },
    { name: "護養章（教導組）", group: "教導組", en: "Animal Husbandry Badge (Instructor)" }
  ],

  redlinesTitle: "🚨 一般童軍活動 vs AYP 認可活動：4 大改造紅線（新官網重點）",
  redlines: [
    { icon: "👥", title: "一般旅團集會 ≠ 自動計入 AYP", body: "單純出席團集會唔計！必須喺集會中持續進行一項已獲批嘅服務、技能或康體活動，並有清晰個人目標、時數、進度及評核，該部分時間先可以計（同一段時間亦不可重複計入兩科）。" },
    { icon: "⛺", title: "一般童軍露營／遠足 ≠ 野外鍛鍊科", body: "一般露營不能自動代替野外鍛鍊科！必須包含指定課堂與戶外訓練、由隊員共同策劃具明確目的嘅實習旅程及評核旅程，並由合資格導師及評核員（或試行方案下之 EA/JEA/CRS）按規定進行。" },
    { icon: "🏕️", title: "自己旅團露營 ≠ 金章團體生活科", body: "金章團體生活科要求「離開日常生活環境，與平日不熟悉嘅青年人連續共同生活 5 日 4 夜」並完成有意義活動（例如大露營、國際/內地交流營、跨區聯合訓練營）。純粹同自己旅團熟人露營或自助觀光旅遊唔計！" },
    { icon: "📚", title: "日常功課／體育堂／單次服務 ≠ 完成科目", body: "學校一般體育堂、應付考試溫習、一次性賣旗或單日服務，唔足以完成科目；必須係課堂以外有個人起點目標、持續夠指定星期數（13/26/52/78週）同最低時數嘅恆常投入。" }
  ],

  fullForms: [
    { code: "AYP/01", cat: "參加及轉換", name: "香港青年獎勵計劃參加申請表格", note: "完成迎新講座後申請參加 AYP 及買紀錄簿（HK$45）。網上 e-Form 即將推出，首年網上與紙本並行。", url: "https://www.scout.org.hk/uploads/tc/forms/7015/form01.pdf" },
    { code: "AYP/02", cat: "訓練及評核", name: "訓練及評核申請表（服務科）", note: "按章級申請服務科訓練或評核（🥇金章須於活動開始最少 2 個月前經 UUL 簽署交地域辦事處）。", url: "https://www.scout.org.hk/uploads/tc/forms/7016/form02.pdf" },
    { code: "AYP/03", cat: "訓練及評核", name: "訓練及評核申請表（野外鍛鍊科）", note: "申請野外鍛鍊科訓練或評核（🥇金章須提前最少 2 個月連同計劃書提交）。", url: "https://www.scout.org.hk/uploads/tc/forms/7017/form03.pdf" },
    { code: "AYP/04", cat: "訓練及評核", name: "訓練及評核申請表（技能科）", note: "申請技能科訓練或評核（🥇金章須提前最少 2 個月連同計劃書提交）。", url: "https://www.scout.org.hk/uploads/tc/forms/7018/form04.pdf" },
    { code: "AYP/05", cat: "訓練及評核", name: "訓練及評核申請表（康樂體育科）", note: "申請康樂體育科訓練或評核（🥇金章須提前最少 2 個月連同計劃書提交）。", url: "https://www.scout.org.hk/uploads/tc/forms/7019/form05.pdf" },
    { code: "AYP/06", cat: "訓練及評核", name: "訓練及評核申請表（團體生活科）", note: "供🥇金章級參加者申請 5 日 4 夜團體生活科（須於活動開始最少 2 個月前提交批核）。", url: "https://www.scout.org.hk/uploads/tc/forms/7020/form06.pdf" },
    { code: "AYP/07", cat: "章級完成", name: "銀章／金章完成通知書", note: "完成銀章或金章所有科目後，經 UUL 核對並提交地域辦事處辦理完成確認及領獎。", url: "https://www.scout.org.hk/uploads/tc/forms/7021/form07.pdf" },
    { code: "AYP/08", cat: "參加及轉換", name: "轉換執行處支部申請表（童軍總會內轉支部／升團跨旅）", note: "喺香港童軍總會執行處「內部」轉換所屬執行處支部（例如轉旅團支部或由旅支部轉區支部）。", url: "https://www.scout.org.hk/uploads/tc/forms/7022/form08.pdf" },
    { code: "AYP/09", cat: "參加及轉換", name: "轉換執行處申請表（由學校／其他執行處轉入童軍）", note: "由其他 AYP 執行處（如中學、其他制服團隊）轉往香港童軍總會執行處必交表格。", url: "https://www.scout.org.hk/uploads/tc/forms/7023/form09.pdf" },
    { code: "AYP/10", cat: "支部及行政", name: "成立執行處支部申請表", note: "童軍旅、童軍區或地域申請成立 AYP 執行處支部（須提名最少一名合資格 UUL；e-Form 即將推出）。", url: "https://www.scout.org.hk/uploads/tc/forms/7024/form10.pdf" },
    { code: "AYP/11", cat: "支部及行政", name: "半年統計表", note: "執行處支部每半年向地域辦事處提交參加者及章級統計資料。", url: "https://www.scout.org.hk/hkayp/download/form11.pdf" },
    { code: "AYP/12", cat: "章級完成", name: "獎章完成通知書", note: "按適用程序辦理獎章完成確認。", url: "https://www.scout.org.hk/uploads/tc/forms/7026/form12.pdf" },
    { code: "AYP/13", cat: "訓練及評核", name: "野外鍛鍊科訓練班記錄", note: "舉辦野外鍛鍊科訓練班時保存參加者訓練紀錄。", url: "https://www.scout.org.hk/hkayp/download/form13.pdf" },
    { code: "AYP/14", cat: "支部及行政", name: "執行處支部組長 (UUL) 註冊或更改申請表", note: "首次註冊、新增或更改執行處支部組長（須已完成組長迎新座談會；e-Form 即將推出）。", url: "https://www.scout.org.hk/uploads/tc/forms/7028/form14.pdf" },
    { code: "e-Form", cat: "參加及轉換", name: "2026 童軍同步完成試行計劃 — 參與意向登記表", note: "供有意參與「童軍進度性獎章↔AYP同步完成」試行之童軍單位及領袖填寫（Google Form）。", url: "https://docs.google.com/forms/d/e/1FAIpQLScvAVc-otJsKUv7xdMroTNaQqAWp_Igyk-3Fud45Wx2Z8xiPw/viewform?usp=sharing&ouid=107671158074138069832" },
    { code: "指南", cat: "訓練及評核", name: "《野外鍛鍊科導師指南》及《AYP野外鍛鍊科手冊》", note: "策劃或主持野外鍛鍊科活動必讀官方手冊。", url: "https://ayp.org.hk/wp-content/uploads/2024/05/Award-Handbook-Adventurous-Journey-Section_Chi_20240516-1.pdf" }
  ],

  commentBuilder: {
    title: "✍️ 導師／評核員「具體評語產生器」（防退件神器）",
    sub: "新官網特別警告：「評語不建議只寫『完成』、『合格』或『表現良好』，應具體說明完成了甚麼、如何持續參與、取得甚麼進步、如何面對困難及是否達到目標。」揀選以下項目即可一鍵生成合規評語！",
    secOptions: [
      { id: "service", name: "🤝 服務科", defaultAct: "童軍旅團／社區持續服務及活動支援", progress: "由初期需要領袖從旁指導，進步至能主動承擔小隊職責、細心照顧服務對象及協助帶領活動", challenge: "面對活動突發情況及時間分配壓力時，仍能保持耐性與責任感並妥善解難" },
      { id: "skill", name: "🛠️ 技能科", defaultAct: "先鋒工程／專科徽章技能持續研習", progress: "由掌握基本知識與工具操作，逐步提升至能獨立完成作品設計、解難及向隊員示範技巧", challenge: "在遇到技術瓶頸與實作失敗時積極請教導師並反覆練習，成功突破難關" },
      { id: "physical", name: "🏃 康樂體育科", defaultAct: "恆常體適能及專項運動訓練", progress: "體能耐力、動作技術及運動安全意識均有顯著改善，成功超越個人起步水平所訂立嘅目標", challenge: "即使面對學業繁忙或天氣變化，仍能堅持每週規律訓練，展現良好毅力" },
      { id: "expedition", name: "🧭 野外鍛鍊科", defaultAct: "小組野外鍛鍊實習及評核旅程", progress: "能與小隊成員共同策劃路線、導航、戶外煮食、搭建帳幕及執行風險管理，並完成清晰旅程匯報", challenge: "在旅途體力消耗及路況挑戰下發揮團隊合作精神，注意安全與無痕山林原則" },
      { id: "residential", name: "🏕️ 團體生活科（金章）", defaultAct: "五日四夜跨單位交流／大露營團體生活", progress: "主動融入陌生群體，積極分擔群體生活職責並投入共同活動，展現成熟溝通與協作能力", challenge: "迅速適應離開日常環境嘅外宿生活，主動關心及協助其他青年參加者" }
    ],
    generateZh: (secObj, lvName, actName, hours, weeks) =>
      `參加者於${lvName}期間，在「${actName || secObj.defaultAct}」持續投入不少於 ${hours} 小時（歷時 ${weeks} 星期），出席穩定且態度認真投入。在過程中，參加者${secObj.progress}；${secObj.challenge}，最終圓滿達成活動開始前所訂立之個人目標，表現符合 AYP 本科要求，予以確認完成。`,
    generateEn: (secId, lvName, actName, hours, weeks) => {
      const map = {
        service: `During the ${lvName} period, the participant consistently devoted at least ${hours} hours over ${weeks} weeks to "${actName || "ongoing Scout/community service"}", demonstrating reliable attendance and a caring attitude. Starting from basic assistance, the participant progressed to taking initiative in planning and supporting beneficiaries, overcame scheduling and operational challenges responsibly, and fully achieved their personal goals.`,
        skill: `During the ${lvName} period, the participant consistently practised "${actName || "their chosen skill activity"}" for at least ${hours} hours across ${weeks} weeks. They progressed from foundational techniques to independent execution and problem-solving, persevered through technical difficulties with regular practice, and successfully met the personal learning goals set at the outset.`,
        physical: `During the ${lvName} period, the participant engaged in regular training in "${actName || "physical recreation"}" for at least ${hours} hours over ${weeks} weeks. Showing strong perseverance and safety awareness despite weather and schedule challenges, they achieved clear improvements in fitness and technique compared with their starting baseline, fulfilling their personal target.`,
        expedition: `During the ${lvName} Assessed Adventurous Journey ("${actName || "group expedition"}"), the participant actively contributed to team route planning, navigation, campcraft, outdoor cooking and risk management. Despite physical fatigue and terrain challenges, they demonstrated sound teamwork, safety awareness and Leave No Trace practices, successfully achieving the journey purpose and debriefing requirements.`,
        residential: `During the 5-day-4-night Gold Residential Project ("${actName || "residential camp/exchange"}"), the participant lived and worked constructively with unfamiliar peers away from their usual environment. They adapted quickly, shared daily responsibilities proactively, collaborated well across backgrounds, and successfully accomplished the project objectives.`
      };
      return map[secId] || map.service;
    }
  },

  uulChecklists: {
    title: "🏕️ 領袖／支部組長 (UUL) 三階段防退件核對清單",
    sub: "（按新官網 `#leaders` 審批要求整理，手機逐項打勾，確保交去地域／青少年活動署唔會被打回頭）",
    groups: [
      {
        id: "uul_start",
        title: "階段 ①：參加者開展活動前（UUL 必檢 6 項）",
        items: [
          "確認參加者已宣誓（或青年領袖持有效委任），並已完成「參加者迎新講座」。",
          "核對參加年齡及章級路徑（13歲報銅章須為小組形式並申請特別安排；直接銀/金須揀定主項）。",
          "已提交 AYP/01 及 HK$45 紀錄簿申請費，並已正式獲發紀錄簿（確立開展日，提醒不可追溯舊活動）。",
          "與參加者商討並同意各科活動計劃（目標具體可行、符合該科宗旨、無同一活動重複計兩科）。",
          "活動開始前已確認合資格導師及評核員人選（切勿完成後先搵人補簽；同步方案銅章野外鍛鍊須開訓前聯絡 EA/JEA/CRS）。",
          "🥇 如屬金章：已提醒參加者於活動開始「最少 2 個月前」填妥 AYP/02–06 連同計劃書經 UUL 簽署交地域辦事處！"
        ]
      },
      {
        id: "uul_mid",
        title: "階段 ②：活動進行期間及轉處／升團處理（UUL 必檢 5 項）",
        items: [
          "定期檢視紀錄簿：確認參加者按實際日期持續填寫時數、進度、反思，無「預先簽署」或「事後一次過補填」。",
          "確認同時滿足「最低時數」及「最低持續星期數」（如提早儲夠時數，仍須持續參與至夠週數為止）。",
          "如參加者中途更改活動、目標、導師或評核員，已事先向支部提出並獲批准。",
          "如由學校／其他執行處轉入童軍：已提交 FORM AYP/09 及原紀錄簿副本；如屬童軍總會內轉支部／升團跨旅：已辦理 FORM AYP/08 更新支部資料。",
          "如參加 2026 同步完成試行方案：童軍主考若非 AYP 認可評核員，已安排合適評核員檢視及確認 AYP 部分，並保存野外鍛鍊 EA/JEA/CRS 考驗人員完整資料。"
        ]
      },
      {
        id: "uul_end",
        title: "階段 ③：完成章級交表審批前（交 AYP/07・AYP/12 前必檢 6 項）",
        items: [
          "核對所有科目開始日期均在正式開展日（獲發紀錄簿日）當日或之後。",
          "核對各科累積時數及持續星期數（開始至完成日期跨度）完全符合該路徑要求，且無重複計算。",
          "核對導師及評核員已填寫「具體評語」（說明完成內容、持續參與、進步及達成目標，非僅寫「合格／完成」），並齊備簽署、資格及日期。",
          "野外鍛鍊科文件齊備（訓練紀錄、實習及評核旅程計劃、旅程報告／匯報、評核員簽署）。",
          "填妥最新完成通知書（銀／金章用 AYP/07；適用獎章完成用 AYP/12），確認姓名及身份資料與紀錄簿一致。",
          "支部保存完整申請副本、附件及提交日期紀錄，再遞交地域辦事處審核。"
        ]
      }
    ]
  }
};

LOCALES["en"].POWER = {
  calcTitle: "🧮 AYP Hours · Weeks · Deadline Calculator & Progress Tracker",
  calcSub: "(Interactive tool missing from the official site: auto-calculates earliest completion dates, age 23/25 deadlines & Gold 2-month pre-submission dates)",
  calcIntro: "Select your Award path, Main Section and official Start Date (Record Book issue date) to instantly calculate the earliest completion date for each Section and track your hours & weeks!",
  paths: {
    bronze: {
      name: "🥉 Bronze Award", minAge: 14, specialAge: 13, splitMain: true,
      mainH: 26, mainW: 26, subH: 13, subW: 13,
      expText: "1-day basic training + 1-day practice journey + 2D1N assessed journey (≥12h planned activity)",
      resText: null,
      note: "Normally age 14+; Scouts aged 13+ may apply under special arrangement (orientation + group participation with eligible peers + OA discretionary approval)."
    },
    progSilver: {
      name: "🥈 Progressive Silver (Bronze completed)", minAge: 15, specialAge: null, splitMain: false,
      mainH: 26, mainW: 26, subH: 26, subW: 26,
      expText: "1-day advanced training + one 2D1N practice + 3D2N assessed journey (≥21h planned activity)",
      resText: null,
      note: "Requires Bronze completed and age ≥15; no Main/Secondary split — Service, Skills & Physical Recreation each require ≥26 hours and ≥26 weeks."
    },
    directSilver: {
      name: "🥈 Direct Silver (no Bronze)", minAge: 15, specialAge: null, splitMain: true,
      mainH: 52, mainW: 52, subH: 26, subW: 26,
      expText: "1-day basic training + two 2D1N practices + 3D2N assessed journey (≥21h planned activity)",
      resText: null,
      note: "Direct entry without Bronze; choose one Main Section (≥52h & ≥52w) and two Secondary Sections (≥26h & ≥26w each)."
    },
    progGold: {
      name: "🥇 Progressive Gold (Silver completed)", minAge: 16, specialAge: null, splitMain: false, isGold: true,
      mainH: 52, mainW: 52, subH: 52, subW: 52,
      expText: "2-day advanced training + one 2D1N practice + 4D3N assessed journey (≥32h planned activity)",
      resText: "5 days 4 nights consecutive residential life away from home with unfamiliar peers on a purposeful activity (pre-approval required)",
      note: "Requires Silver completed and age ≥16; all three sections require ≥52h & ≥52w. ⚠️ Submit AYP/02–06 + plan via UUL to Regional Office at least 2 months before starting!"
    },
    directGold: {
      name: "🥇 Direct Gold (no Silver)", minAge: 16, specialAge: null, splitMain: true, isGold: true,
      mainH: 78, mainW: 78, subH: 52, subW: 52,
      expText: "1-day basic training + two 2D1N & one 3D2N practices + 4D3N assessed journey (≥32h planned activity)",
      resText: "5 days 4 nights consecutive residential life away from home with unfamiliar peers on a purposeful activity (pre-approval required)",
      note: "Direct Gold without Silver (also for Young Leaders aged 18–23); Main Section ≥78h & ≥78w, two Secondary Sections ≥52h & ≥52w each. ⚠️ Submit AYP/02–06 at least 2 months before starting!"
    }
  },
  labels: {
    pickPath: "① Select Award Level & Path",
    pickMain: "② Select Main Section (higher hours & weeks)",
    noSplitHint: "✅ Progressive path has equal requirements across all 3 Sections (no Main/Secondary split).",
    startDate: "③ Official Start Date (Record Book issue date)",
    birthDate: "④ Date of Birth (optional: checks age 13–16 eligibility + age 23/25 deadlines)",
    goldTargetDate: "⑤ Planned Gold Section Start Date (calculates 2-month prior AYP/02–06 submission deadline)",
    mainTag: "Main Section",
    subTag: "Secondary",
    equalTag: "Progressive Requirement",
    reqFormat: (h, w) => `Minimum: ≥ ${h} hrs + at least ${w} weeks`,
    earliestDate: "📅 Earliest completion date: ",
    daysLeft: (d) => d > 0 ? `(${d} days from today)` : `(Duration requirement reached!)`,
    setStartFirst: "Enter your Official Start Date above to calculate earliest completion dates",
    hoursLogged: "Hours logged",
    weeksLogged: "Weeks completed",
    trapWarn: (remW) => `⚠️ Anti-Trap Alert: Your hours are met, but you still need ${remW} more week(s)! AYP requires meeting BOTH minimum hours AND minimum weeks — do not stop early!`,
    secDone: "✅ Both hours and duration met! Remember to get specific Assessor comments and signature.",
    expDoneLabel: "Completed training, practice & assessed journeys and signed off",
    resDoneLabel: "Completed 5D4N Residential Project and signed off",
    ageCheckTitle: "🎂 Age Eligibility & Deadlines",
    ageNow: (y, m) => `Current age: approx. ${y} yrs ${m} mos`,
    deadline23: "📌 Last day to apply/enrol (23rd birthday): ",
    deadline25: "🏁 Final deadline to complete all activities (before 25th birthday): ",
    goldDeadlineTitle: "🚨 Gold Award 2-Month Pre-Submission Deadline (AYP/02–06)",
    goldRegionalDate: "🏢 Latest submission to Regional Office (60 days prior): ",
    goldUulDate: "🧑‍🏫 Recommended submission to UUL for review & signing (75 days prior): ",
    copySummaryBtn: "📋 Copy My AYP Progress Report (for UUL / Leader)",
    resetCalcBtn: "↺ Reset Progress Data",
    copiedToast: "✅ Copied to clipboard! Ready to paste into WhatsApp / Signal."
  },

  syncChecker: {
    title: "🔗 2026 'Simultaneous Completion Scheme' Interactive Checklist",
    sub: "(Built from the Sep 2026 official item-by-item mapping: tick off your Scout items to see what AYP steps remain)",
    eformBtn: "📝 Fill Official 'Trial Scheme Expression of Interest e-Form' (Google Form)",
    eformUrl: "https://docs.google.com/forms/d/e/1FAIpQLScvAVc-otJsKUv7xdMroTNaQqAWp_Igyk-3Fud45Wx2Z8xiPw/viewform?usp=sharing&ouid=107671158074138069832",
    eformNote: "⚠️ Note: This Google Form only registers a unit/leader's interest in the trial — it does NOT replace Participant Orientation, AYP/01 enrolment, the HK$45 Record Book fee, or formal approval procedures!",
    routes: {
      bronze: {
        label: "🥉 Scout Advanced Award → AYP Bronze",
        badgePair: "Scout Advanced Award ➔ AYP Bronze (Service = Main; Skills & Physical = Secondary)",
        items: [
          { id: "b_pre1", cat: "Prerequisites", title: "Completed Participant Orientation, submitted AYP/01 + HK$45 fee, and received Record Book", detail: "Red line: All synced activities must take place on/after your official start date (no backdating)." },
          { id: "b_pre2", cat: "Prerequisites", title: "Using the 2026 Revised Scout Training Scheme from Pathfinder Award onwards & informed UUL", detail: "Units/leaders may also submit the official Expression of Interest Google Form." },
          { id: "b_srv", cat: "🤝 Service (Main)", title: "Completed Scout Standard Award + Advanced Award ongoing service items, totalling ≥26 hours & ≥26 weeks", detail: "If the Scout badge test finishes before 26 weeks, continue the service until both 26h and 26w are met." },
          { id: "b_skl", cat: "🛠️ Skills (Secondary)", title: "Completed one eligible STEAM (Science/Tech/Engineering/Arts/Maths) badge under Advanced Award B.2.a for ≥13 hours & ≥13 weeks", detail: "Troop meetings, special training, personal practice, project making and testing all count towards the ongoing learning process." },
          { id: "b_phy", cat: "🏃 Physical (Secondary)", title: "Completed a physical fitness proficiency badge, or ≥13 hours & ≥13 weeks of fitness training", detail: "School team, sports club or troop regular training can count if hours, duration and records are met." },
          { id: "b_exp1", cat: "🧭 Journey (Pre-Trip)", title: "[Before Training/Test] Contacted a qualified EA / JEA (or CRS Hiking Instructor who is also a Scout Leader) to review pre-training", detail: "District can assist if the Group cannot find one; never complete the journey first before engaging an EA/JEA!" },
          { id: "b_exp2", cat: "🧭 Journey (Assessment)", title: "Completed Pathfinder A.2.c + Standard A.2.e + Advanced A.2.f.I or A.2.f.II & logged full EA/JEA/CRS assessor details", detail: "Troop must log the assessor's name, role, qualification, unit, contact, item, date and result." },
          { id: "b_fin", cat: "🏁 Dual Approval", title: "Completed both Scout Advanced Award sign-off AND AYP Bronze completion verification via UUL", detail: "The two awards remain independent systems and require separate final approvals." }
        ]
      },
      silver: {
        label: "🥈 Chief Scout's Award → AYP Progressive Silver",
        badgePair: "Chief Scout's Award ➔ AYP Progressive Silver (Requires AYP Bronze completed; equal sections)",
        items: [
          { id: "s_pre1", cat: "Prerequisites", title: "Completed AYP Bronze, aged ≥15, and officially started Progressive Silver in Record Book", detail: "All synced activities must take place after officially starting Progressive Silver." },
          { id: "s_srv", cat: "🤝 Service (≥26h & ≥26w)", title: "Completed Chief Scout's Award D.1.c ongoing service item for ≥26 hours & ≥26 weeks", detail: "Progressive Silver has no Main/Secondary split — Service requires ≥26h and ≥26w." },
          { id: "s_skl", cat: "🛠️ Skills (≥26h & ≥26w)", title: "Completed Chief Scout's Award A.3 'Pioneering' (knots/lashings, design, gear prep, construction, teaching & leading) for ≥26 hours & ≥26 weeks", detail: "Includes preparation, design, construction and leading/instructing patrol members." },
          { id: "s_phy", cat: "🏃 Physical (≥26h & ≥26w)", title: "Completed a physical fitness badge, or ≥26 hours & ≥26 weeks of physical fitness training", detail: "Must demonstrate progression beyond Bronze level with 26 weeks of records." },
          { id: "s_exp1", cat: "🧭 Journey (Option II)", title: "Completed Chief Scout's Award 'Adventure Option II' (advanced basic training, 1-day training, 2D1N practice & 3D2N assessed journey)", detail: "Complete Intermediate Hiking Course & Assessment, or arrange an eligible EA / CRS beforehand." },
          { id: "s_exp2", cat: "🧭 Journey (Assessor Log)", title: "Logged full assessor (EA / CRS) name, qualification, unit, contact, dates and results", detail: "Use the Assessor Log Generator below to format and save your record." },
          { id: "s_fin", cat: "🏁 Dual Approval", title: "Completed both Chief Scout's Award approval AND AYP Progressive Silver Notification (AYP/07 or AYP/12) via UUL", detail: "Submit to Regional Office for verification and forwarding to the Award Office." }
        ]
      }
    },
    eaLoggerTitle: "🏕️ Leader Tool: Trial Adventurous Journey 'Assessor Record Card' Generator",
    eaLoggerDesc: "Official rule: 'Units must record the assessor's name, role, qualification, unit, contact method, assessment item, date and result.' Fill in below to save and copy!",
    eaFields: {
      memberName: "Participant Name",
      awardRoute: "Sync Route (Bronze / Progressive Silver)",
      assessorName: "Assessor Name",
      assessorRole: "Role & Qualification (e.g. EA / JEA / CRS + Scout Leader)",
      assessorUnit: "Unit / District",
      assessorContact: "Phone / Email",
      examItems: "Assessed Items (e.g. A.2.c + A.2.e + A.2.f.I / Adventure Option II)",
      examDates: "Training / Assessment Dates",
      examResult: "Result & Remarks"
    },
    eaCopyBtn: "📋 Copy Official-Format Adventurous Journey Assessor Record"
  },

  cancelledBadges: LOCALES["zh-HK"].POWER.cancelledBadges,

  redlinesTitle: "🚨 Regular Scout Activities vs AYP-Recognised Activities: 4 Key Red Lines",
  redlines: [
    { icon: "👥", title: "Regular Troop Meetings ≠ Automatic AYP Hours", body: "Mere attendance at troop meetings does not count! Only time spent on an approved ongoing Service, Skills or Physical activity with clear personal goals, hours, progress and assessment counts (and the same time cannot be double-counted across two sections)." },
    { icon: "⛺", title: "General Scout Camping / Hiking ≠ Adventurous Journey", body: "General camps do not automatically replace the Adventurous Journey Section! It requires specified training, team-planned practice and assessed journeys with a clear purpose, supervised and assessed by qualified Instructors/Assessors (or EA/JEA/CRS under the trial scheme)." },
    { icon: "🏕️", title: "Camping with Your Own Troop ≠ Gold Residential Project", body: "Gold Residential Project requires living away from home for 5 days 4 nights consecutively with young people you do NOT normally know, completing a purposeful activity (e.g. Jamboree, international/mainland exchange, joint regional camp). Sightseeing tours or camps only with familiar troopmates do not qualify!" },
    { icon: "📚", title: "School PE / Homework / One-off Service ≠ Section Completion", body: "Regular school PE lessons, exam revision or one-off flag selling are insufficient; AYP requires sustained commitment outside routine classes meeting both minimum weeks (13/26/52/78w) and hours." }
  ],

  fullForms: [
    { code: "AYP/01", cat: "參加及轉換", name: "AYP Enrolment Application Form", note: "Apply for AYP & Record Book (HK$45) after Orientation. Online e-Form launching soon (1-year parallel period with paper form).", url: "https://www.scout.org.hk/uploads/tc/forms/7015/form01.pdf" },
    { code: "AYP/02", cat: "訓練及評核", name: "Training & Assessment Application (Service)", note: "For Service Section (🥇Gold: submit via UUL to Regional Office ≥2 months before start).", url: "https://www.scout.org.hk/uploads/tc/forms/7016/form02.pdf" },
    { code: "AYP/03", cat: "訓練及評核", name: "Training & Assessment Application (Adventurous Journey)", note: "For Adventurous Journey (🥇Gold: submit with plan ≥2 months before start).", url: "https://www.scout.org.hk/uploads/tc/forms/7017/form03.pdf" },
    { code: "AYP/04", cat: "訓練及評核", name: "Training & Assessment Application (Skills)", note: "For Skills Section (🥇Gold: submit with plan ≥2 months before start).", url: "https://www.scout.org.hk/uploads/tc/forms/7018/form04.pdf" },
    { code: "AYP/05", cat: "訓練及評核", name: "Training & Assessment Application (Physical Recreation)", note: "For Physical Recreation (🥇Gold: submit with plan ≥2 months before start).", url: "https://www.scout.org.hk/uploads/tc/forms/7019/form05.pdf" },
    { code: "AYP/06", cat: "訓練及評核", name: "Training & Assessment Application (Residential Project)", note: "For 🥇Gold 5D4N Residential Project (submit ≥2 months before start).", url: "https://www.scout.org.hk/uploads/tc/forms/7020/form06.pdf" },
    { code: "AYP/07", cat: "章級完成", name: "Silver / Gold Award Notification of Attainment", note: "Submit via UUL to Regional Office upon completing all Silver or Gold Sections.", url: "https://www.scout.org.hk/uploads/tc/forms/7021/form07.pdf" },
    { code: "AYP/08", cat: "參加及轉換", name: "Application for Change of User Unit (Within HK Scout OA)", note: "Transferring between User Units within the Scout Association of HK (e.g. changing Scout Group/District User Unit).", url: "https://www.scout.org.hk/uploads/tc/forms/7022/form08.pdf" },
    { code: "AYP/09", cat: "參加及轉換", name: "Application for Change of Operating Authority (Transfer into Scouts)", note: "Transferring from another Operating Authority (e.g. school) into the Scout Association of HK.", url: "https://www.scout.org.hk/uploads/tc/forms/7023/form09.pdf" },
    { code: "AYP/10", cat: "支部及行政", name: "Application to Establish a User Unit", note: "For Scout Groups, Districts or Regions establishing an AYP User Unit (nominate ≥1 qualified UUL).", url: "https://www.scout.org.hk/uploads/tc/forms/7024/form10.pdf" },
    { code: "AYP/11", cat: "支部及行政", name: "Half-Yearly Statistical Return", note: "Submitted every 6 months by User Units to report participant & award statistics.", url: "https://www.scout.org.hk/hkayp/download/form11.pdf" },
    { code: "AYP/12", cat: "章級完成", name: "Award Completion Notification", note: "For applicable Award completion confirmation procedures.", url: "https://www.scout.org.hk/uploads/tc/forms/7026/form12.pdf" },
    { code: "AYP/13", cat: "訓練及評核", name: "Adventurous Journey Training Course Record", note: "For recording participant training when running an Adventurous Journey course.", url: "https://www.scout.org.hk/hkayp/download/form13.pdf" },
    { code: "AYP/14", cat: "支部及行政", name: "User Unit Leader (UUL) Registration / Amendment Form", note: "First registration, addition or change of User Unit Leader (requires UUL Briefing completion).", url: "https://www.scout.org.hk/uploads/tc/forms/7028/form14.pdf" },
    { code: "e-Form", cat: "參加及轉換", name: "2026 Simultaneous Completion Trial — Expression of Interest e-Form", note: "Official Google Form for Scout units and leaders interested in joining the 2026 trial scheme.", url: "https://docs.google.com/forms/d/e/1FAIpQLScvAVc-otJsKUv7xdMroTNaQqAWp_Igyk-3Fud45Wx2Z8xiPw/viewform?usp=sharing&ouid=107671158074138069832" },
    { code: "Guide", cat: "訓練及評核", name: "Adventurous Journey Instructor Guide & AYP Handbook", note: "Official handbook for planning and assessing Adventurous Journeys.", url: "https://ayp.org.hk/wp-content/uploads/2024/05/Award-Handbook-Adventurous-Journey-Section_Chi_20240516-1.pdf" }
  ],

  commentBuilder: {
    title: "✍️ Instructor / Assessor Specific Comment Builder (Anti-Rejection Tool)",
    sub: "Official guideline: 'Avoid writing only Completed, Passed or Good. Comments must specify what was accomplished, ongoing participation, progress made, how challenges were overcome, and whether personal goals were met.'",
    secOptions: LOCALES["zh-HK"].POWER.commentBuilder.secOptions,
    generateZh: LOCALES["zh-HK"].POWER.commentBuilder.generateZh,
    generateEn: LOCALES["zh-HK"].POWER.commentBuilder.generateEn
  },

  uulChecklists: {
    title: "🏕️ Leader / UUL 3-Stage Pre-Approval & Submission Checklists",
    sub: "(Compiled from the new official `#leaders` guidelines — tick off on your phone so submissions aren't rejected by the Regional Office)",
    groups: [
      {
        id: "uul_start",
        title: "Stage ①: Before Participant Starts Activities (6 Checks)",
        items: [
          "Confirm the participant is an invested Scout (or Young Leader with valid appointment) and has completed Participant Orientation.",
          "Verify age eligibility and Award path (age 13 Bronze requires group participation & special approval; Direct Silver/Gold requires choosing a Main Section).",
          "Submitted AYP/01 + HK$45 fee and officially received the Record Book (establishes official start date — remind them no backdating).",
          "Discussed and approved each Section's activity plan (specific personal goals, meets section aims, no double-counting across sections).",
          "Confirmed qualified Instructor & Assessor BEFORE starting (never sign off retroactively; Trial Bronze Journey requires contacting EA/JEA/CRS before training).",
          "🥇 For Gold Award: reminded participant to submit AYP/02–06 + activity plan signed by UUL to Regional Office AT LEAST 2 MONTHS before starting!"
        ]
      },
      {
        id: "uul_mid",
        title: "Stage ②: During Activities & Transfers / Advancement (5 Checks)",
        items: [
          "Review Record Book regularly: ensure dates, hours, progress and reflections are logged continuously (no pre-signing or bulk back-filling).",
          "Ensure BOTH minimum hours AND minimum duration in weeks are met (if hours finish early, they must continue until required weeks are reached).",
          "Any change of activity, goal, Instructor or Assessor was reported to and approved by the User Unit beforehand.",
          "Transfer from school/other OA: submitted FORM AYP/09 + original record copies; transfer between User Units within HK Scout OA: submitted FORM AYP/08.",
          "For 2026 Sync Trial: if Scout examiner is not an AYP-recognised Assessor, arranged an eligible Assessor to verify AYP parts, and kept full EA/JEA/CRS logs."
        ]
      },
      {
        id: "uul_end",
        title: "Stage ③: Before Submitting Completion Notification AYP/07 or AYP/12 (6 Checks)",
        items: [
          "All Section start dates are on or after the official Record Book start date.",
          "Total hours and week spans for every Section fully meet the chosen path's requirements with no overlapping hours.",
          "Instructors/Assessors wrote SPECIFIC comments (what was done, ongoing commitment, progress, challenges overcome & goals met — not just 'Passed') with signatures, qualifications & dates.",
          "Adventurous Journey documents are complete (training record, practice & assessed journey plans, report/debriefing, assessor sign-off).",
          "Completed the latest Notification form (AYP/07 for Silver/Gold; AYP/12 where applicable) matching Record Book details.",
          "User Unit retained full copies of forms, attachments and submission date logs before forwarding to the Regional Office."
        ]
      }
    ]
  }
};
