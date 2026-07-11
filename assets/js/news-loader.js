/* ===========================================================
   SET International Affairs — news-loader.js
   Fetches news items from a published Google Sheet (CSV) and
   renders them into any element with [data-news-container].
   Until the sheet is configured, the BUILTIN_ITEMS below are
   shown instead. Re-renders on language change.

   ▸ Setup:
     1) In your Google Sheet, click  File → Share → Publish to web
        Select the sheet you want, choose "Comma-separated values (.csv)",
        click Publish, copy the URL.
     2) Paste that URL into SHEET_CSV_URL below.
     3) Make sure the sheet has these columns in row 1 (case-insensitive):
        date, category, tag_en, tag_th, title_en, title_th,
        description_en, description_th, link, color

   See NEWS-SETUP-GUIDE.md for the full walkthrough in Thai.
   =========================================================== */

(function () {
  // ▼▼▼  PASTE YOUR PUBLISHED-CSV URL HERE  ▼▼▼
  const SHEET_CSV_URL = "PUT_YOUR_PUBLISHED_CSV_URL_HERE";
  // ▲▲▲  PASTE YOUR PUBLISHED-CSV URL HERE  ▲▲▲

  /* Colour presets — use these names in the "color" column of the sheet.
     You can also put a custom pair of hex colours like  #123456,#789abc  */
  const GRADIENTS = {
    teal:   "linear-gradient(135deg,#006a64,#4e9b96)",
    gold:   "linear-gradient(135deg,#d4a437,#b08a25)",
    green:  "linear-gradient(135deg,#2e8b57,#4e9b96)",
    blue:   "linear-gradient(135deg,#5c6bc0,#7986cb)",
    cyan:   "linear-gradient(135deg,#00838f,#4dd0e1)",
    purple: "linear-gradient(135deg,#5b2a86,#8a5cae)",
  };

  /* If a row leaves "color" blank, fall back based on category. */
  const DEFAULT_COLOR_BY_CATEGORY = {
    news:          "purple",
    events:        "gold",
    opportunities: "green",
  };

  /* ---------- Built-in news (shown until the Google Sheet is set up) ----------
     Same fields as the sheet columns. Newest dates appear first. */
  const BUILTIN_ITEMS = [
    {
      date: "2026-05-29", category: "news",
      tag_en: "Awards", tag_th: "รางวัล",
      title_en: "SET faculty win WUSTP research & industrial collaboration awards",
      title_th: "คณาจารย์ SET คว้ารางวัลวิจัยและความร่วมมืออุตสาหกรรมจาก WUSTP",
      description_en: "Dean Assoc. Prof. Dr. Monthian Setkit received the Research Collaboration Partner Award; Assoc. Prof. Dr. Suratsavadee Koonlaboon Korkua and Asst. Prof. Dr. Nirattisai Rakmak received Research Funding & Collaboration Leader Awards.",
      description_th: "คณบดี รศ.ดร.มนเทียร เสร็จกิจ รับรางวัล Research Collaboration Partner ส่วน รศ.ดร.สุรัสวดี กุลบุญ ก่อเกื้อ และ ผศ.ดร.นิรัติศัย รักมาก รับรางวัล Research Funding & Collaboration Leader",
      link: "https://engineer.wu.ac.th/en/blog/2026/05/29/school-of-engineering-and-technology-at-walailak-university-wins-prestigious-awards-for-research-funding-and-industrial-collaboration/",
      color: "gold",
    },
    {
      date: "2026-02-24", category: "news",
      tag_en: "Promotion", tag_th: "แต่งตั้ง",
      title_en: "Assoc. Prof. Dr. Nattawit Wattanasakulpong approved for the rank of Professor",
      title_th: "อนุมัติแต่งตั้ง รศ.ดร.ณัฐวิทย์ วัฒนสกุลพงศ์ ดำรงตำแหน่งศาสตราจารย์",
      description_en: "Congratulations to our Mechanical & Robotic Engineering faculty member on approval for the academic rank of Professor.",
      description_th: "ขอแสดงความยินดีกับอาจารย์ประจำสาขาวิศวกรรมเครื่องกลและหุ่นยนต์ ในโอกาสได้รับอนุมัติแต่งตั้งให้ดำรงตำแหน่งศาสตราจารย์",
      link: "https://engineer.wu.ac.th/en/blog/2026/02/24/school-of-engineering-and-technology-congratulates-associate-professor-dr-nattawit-wattanaskulphong-on-approval-for-the-academic-rank-of-professor/",
      color: "purple",
    },
    {
      date: "2026-05-13", category: "news",
      tag_en: "Student Mobility", tag_th: "นักศึกษาแลกเปลี่ยน",
      title_en: "WU and Universiti Teknologi PETRONAS conclude exchange program",
      title_th: "มวล. และ Universiti Teknologi PETRONAS ปิดโครงการแลกเปลี่ยนอย่างสำเร็จ",
      description_en: "The exchange with UTP (Malaysia) wrapped up with plans for deeper collaboration — including ideas sparked by our Chemical Engineering student volunteers.",
      description_th: "โครงการแลกเปลี่ยนกับ UTP (มาเลเซีย) ปิดฉากพร้อมแผนต่อยอดความร่วมมือ รวมถึงข้อเสนอที่เกิดจากนักศึกษาอาสาสมัครวิศวกรรมเคมีของเรา",
      link: "https://cia.wu.ac.th/walailak-university-and-universiti-teknologi-petronas-conclude-successful-international-exchange-program-paving-the-way-for-deeper-strategic-partnerships/",
      color: "purple",
    },
    {
      date: "2026-04-23", category: "events",
      tag_en: "Summer Program", tag_th: "ภาคฤดูร้อน",
      title_en: "SET co-hosts 10-day “Green Innovation” program for TUIT students",
      title_th: "SET ร่วมจัดโปรแกรม “Green Innovation” 10 วัน ต้อนรับนักศึกษา TUIT",
      description_en: "11 participants from Tashkent University of Information Technologies (Uzbekistan) joined a summer program on engineering and informatics, co-hosted by our school (14–23 April 2026).",
      description_th: "ผู้เข้าร่วม 11 คนจาก TUIT (อุซเบกิสถาน) เข้าร่วมโปรแกรมภาคฤดูร้อนด้านวิศวกรรมและสารสนเทศ ซึ่งสำนักวิชาของเราร่วมเป็นเจ้าภาพ (14–23 เม.ย. 2026)",
      link: "https://cia.wu.ac.th/walailak-university-welcomes-tuit-students-for-10-day-green-innovation-summer-program/",
      color: "green",
    },
    {
      date: "2026-03-25", category: "news",
      tag_en: "New MOU", tag_th: "MOU ใหม่",
      title_en: "WU signs MOU with Murdoch University at Investor Day 2026",
      title_th: "มวล. ลงนาม MOU กับ Murdoch University ในงาน Investor Day 2026",
      description_en: "A new research-collaboration MOU with Murdoch University (Australia) — a partnership our Petrochemical & Polymer Engineering group has been helping to build.",
      description_th: "MOU ด้านความร่วมมือวิจัยกับ Murdoch University (ออสเตรเลีย) — ความร่วมมือที่กลุ่มวิศวกรรมปิโตรเคมีและพอลิเมอร์ของเรามีส่วนร่วมผลักดัน",
      link: "https://cia.wu.ac.th/walailak-university-signs-mou-with-murdoch-university-at-walailak-investor-day-2026/",
      color: "gold",
    },
    {
      date: "2026-01-01", category: "news",
      tag_en: "MOU Renewed", tag_th: "ต่ออายุ MOU",
      title_en: "MOU with Universiti Tun Hussein Onn Malaysia renewed",
      title_th: "ต่ออายุ MOU กับ Universiti Tun Hussein Onn Malaysia แล้ว",
      description_en: "Our long-standing partnership with UTHM (Malaysia) continues — the MOU has been renewed in 2026, keeping exchange and research channels open.",
      description_th: "ความร่วมมืออันยาวนานกับ UTHM (มาเลเซีย) เดินหน้าต่อ — ต่ออายุ MOU ในปี 2026 เปิดช่องทางแลกเปลี่ยนและวิจัยอย่างต่อเนื่อง",
      link: "",
      color: "purple",
    },
  ];

  /* ---------- CSV parsing (handles quoted fields with commas) ---------- */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false, i = 0;
    while (i < text.length) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
        if (c === '"') { inQuotes = false; i++; continue; }
        field += c; i++;
      } else {
        if (c === '"') { inQuotes = true; i++; continue; }
        if (c === ',') { row.push(field); field = ""; i++; continue; }
        if (c === '\r') { i++; continue; }
        if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
        field += c; i++;
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map((h) => String(h).trim().toLowerCase());
    return rows.slice(1)
      .filter((r) => r.length > 1 && r.some((c) => c && String(c).trim() !== ""))
      .map((r) => {
        const o = {};
        headers.forEach((h, i) => { o[h] = (r[i] || "").trim(); });
        return o;
      });
  }

  function parseDateMs(s) {
    if (!s) return 0;
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.getTime();
    // Also try DD/MM/YYYY (Thai-style)
    const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const d2 = new Date(`${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`);
      if (!isNaN(d2.getTime())) return d2.getTime();
    }
    return 0;
  }

  function resolveGradient(item) {
    const raw = (item.color || "").trim().toLowerCase();
    if (GRADIENTS[raw]) return GRADIENTS[raw];
    // Custom "#aabbcc,#ddeeff" pair
    if (raw.includes(",") && raw.includes("#")) {
      return `linear-gradient(135deg,${raw})`;
    }
    const fallbackName = DEFAULT_COLOR_BY_CATEGORY[(item.category || "").toLowerCase()] || "teal";
    return GRADIENTS[fallbackName];
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- Render a single card ---------- */
  function renderItem(item, lang) {
    const pick = (en, th) =>
      lang === "th" ? (th || en || "") : (en || th || "");
    const title = pick(item.title_en, item.title_th);
    const desc  = pick(item.description_en, item.description_th);
    const tag   = pick(item.tag_en, item.tag_th);
    const link  = item.link && item.link.trim() !== "" ? item.link : "#";
    const readMore = lang === "th" ? "อ่านต่อ →" : "Read more →";
    const cat = (item.category || "news").toLowerCase();

    return `
      <article class="news-card" data-news-item="${escapeHtml(cat)}">
        <div class="cover" style="background:${resolveGradient(item)};">
          <span class="tag">${escapeHtml(tag || cat)}</span>
        </div>
        <div class="body">
          <div class="meta">${escapeHtml(item.date || "")}</div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(desc)}</p>
          <a href="${escapeHtml(link)}" class="read-more">${escapeHtml(readMore)}</a>
        </div>
      </article>
    `;
  }

  /* ---------- Fetch + cache ---------- */
  let cachePromise = null;
  function fetchItems() {
    if (cachePromise) return cachePromise;
    if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith("PUT_YOUR")) {
      // No Google Sheet configured yet — use the built-in items.
      const items = BUILTIN_ITEMS.slice();
      items.sort((a, b) => parseDateMs(b.date) - parseDateMs(a.date));
      cachePromise = Promise.resolve(items);
      return cachePromise;
    }
    cachePromise = fetch(SHEET_CSV_URL, { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then((text) => {
        const rows = parseCSV(text);
        const items = rowsToObjects(rows);
        items.sort((a, b) => parseDateMs(b.date) - parseDateMs(a.date));
        return items;
      });
    return cachePromise;
  }

  /* ---------- Render into containers ---------- */
  function getLang() {
    return localStorage.getItem("setcia-lang") || (navigator.language || "en").slice(0, 2);
  }

  function showMessage(container, msg) {
    container.innerHTML =
      `<div class="note" style="grid-column:1/-1;">${escapeHtml(msg)}</div>`;
  }

  function loadingMessage(lang) {
    return lang === "th" ? "กำลังโหลดข่าว…" : "Loading news…";
  }

  function errorMessage(lang) {
    return lang === "th"
      ? "ไม่สามารถโหลดข่าวจาก Google Sheets ได้ — ตรวจสอบว่าได้ตั้งค่า SHEET_CSV_URL ในไฟล์ assets/js/news-loader.js แล้ว และได้เผยแพร่ชีตเป็น CSV เรียบร้อย (ดู NEWS-SETUP-GUIDE.md)"
      : "Couldn't load news from Google Sheets. Set SHEET_CSV_URL in assets/js/news-loader.js and publish the sheet as CSV. See NEWS-SETUP-GUIDE.md.";
  }

  async function render() {
    const containers = document.querySelectorAll("[data-news-container]");
    if (!containers.length) return;
    const lang = (localStorage.getItem("setcia-lang") || "en").toLowerCase();

    // initial loading state
    containers.forEach((c) => {
      if (!c.dataset.loadedOnce) {
        c.innerHTML =
          `<p style="grid-column:1/-1;text-align:center;color:var(--color-text-muted);">${escapeHtml(loadingMessage(lang))}</p>`;
      }
    });

    try {
      const items = await fetchItems();
      containers.forEach((c) => {
        const limit = parseInt(c.dataset.newsLimit || "0", 10);
        const slice = limit > 0 ? items.slice(0, limit) : items;
        if (!slice.length) {
          showMessage(c, lang === "th" ? "ยังไม่มีข่าว — เพิ่มแถวใน Google Sheet ของคุณ" : "No news yet — add a row in your Google Sheet.");
        } else {
          c.innerHTML = slice.map((it) => renderItem(it, lang)).join("");
        }
        c.dataset.loadedOnce = "true";
      });
    } catch (err) {
      console.error("[news-loader]", err);
      containers.forEach((c) => showMessage(c, errorMessage(lang)));
    }
  }

  document.addEventListener("DOMContentLoaded", render);
  // Re-render when language changes (main.js dispatches this event)
  window.addEventListener("setcia:lang-changed", render);
})();
