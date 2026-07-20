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
    maroon: "linear-gradient(135deg,#7a1c2a,#a8515f)",
    orange: "linear-gradient(135deg,#d0691c,#e08a3a)",
    purple: "linear-gradient(135deg,#5b2a86,#8a5cae)",
    green:  "linear-gradient(135deg,#2e8b57,#4e9b96)",
    gold:   "linear-gradient(135deg,#d0691c,#e08a3a)",
    teal:   "linear-gradient(135deg,#7a1c2a,#a8515f)",
    blue:   "linear-gradient(135deg,#5c6bc0,#7986cb)",
    cyan:   "linear-gradient(135deg,#00838f,#4dd0e1)",
  };

  /* If a row leaves "color" blank, fall back based on category. */
  const DEFAULT_COLOR_BY_CATEGORY = {
    news:          "maroon",
    events:        "orange",
    opportunities: "green",
  };

  /* ---------- Built-in news (shown until the Google Sheet is set up) ----------
     Same fields as the sheet columns. Newest dates appear first. */
  const BUILTIN_ITEMS = [
    {
      date: "2026-07-11", category: "opportunities",
      tag_en: "Scholarship", tag_th: "ทุนการศึกษา", image: "iacs-2026.jpg",
      title_en: "IACS 2026: free 45-day arts & culture program in Indonesia — apply by 16 July",
      title_th: "ทุน IACS 2026 เรียนรู้ศิลปวัฒนธรรมอินโดนีเซียฟรี 45 วัน — ปิดรับ 16 ก.ค. นี้",
      description_en: "The Indonesian Government's Arts and Culture Scholarship offers Thai students a fully-funded 45-day program (3 Aug – 16 Sep 2026) with Jakarta State University. Requires passport, medical certificate, and English test result. Deadline: 16 July 2026, 23:59.",
      description_th: "รัฐบาลอินโดนีเซียเปิดรับสมัครทุนศิลปะ ภาษา และวัฒนธรรม 45 วัน (3 ส.ค. – 16 ก.ย. 2026) ร่วมกับมหาวิทยาลัยแห่งรัฐจาการ์ตา ไม่มีค่าใช้จ่าย ใช้หนังสือเดินทาง ใบรับรองแพทย์ และผลทดสอบภาษาอังกฤษ ปิดรับ 16 ก.ค. 2026 เวลา 23.59 น.",
      link: "https://kamonnook.github.io/set-cia-website/assets/images/news/iacs-2026-poster.jpg",
      color: "teal",
    },
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
      date: "2026-01-28", category: "news",
      tag_en: "Promotion", tag_th: "แต่งตั้ง", image: "promotion.jpg",
      title_en: "Two SET lecturers promoted to Associate Professor",
      title_th: "อาจารย์ SET สองท่านได้รับแต่งตั้งเป็นรองศาสตราจารย์",
      description_en: "The WU Council approved the promotion of Asst. Prof. Dr. Kessara Seneesrisakul (Petrochemical & Polymer) and Asst. Prof. Dr. Siraporn Sakphrom (Electrical) to Associate Professor.",
      description_th: "สภามหาวิทยาลัยอนุมัติแต่งตั้ง ผศ.ดร.เกศรา เสนีย์ศรีสกุล (ปิโตรเคมีและพอลิเมอร์) และ ผศ.ดร.ศิราพร ศักดิ์พรหม (ไฟฟ้า) เป็นรองศาสตราจารย์",
      link: "https://engineer.wu.ac.th/en/blog/2026/01/28/walailak-university-council-has-approved-the-promotion-of-asst-prof-dr-kessara-seneesrisakul-to-the-academic-rank-of-associate-professor/",
      color: "purple",
    },
    {
      date: "2026-02-24", category: "news",
      tag_en: "Promotion", tag_th: "แต่งตั้ง", image: "promotion.jpg",
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

  /* ---------- Decorative category watermark for the card cover ---------- */
  function coverIcon(item) {
    const t = ((item.tag_en || "") + " " + (item.category || "")).toLowerCase();
    const P = {
      cap:    '<path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.5"/><path d="M22 9v5"/>',
      trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3"/><path d="M16 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13v3"/><path d="M9 20h6"/><path d="M10 16h4l1 4H9z"/>',
      plane:  '<path d="M3 14l17-7-6 16-3.5-6.5L3 14z"/>',
      sun:    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
      doc:    '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 16h6"/>',
      badge:  '<circle cx="12" cy="9" r="5"/><path d="M8.5 13l-1 8 4.5-2.2L16.5 21l-1-8"/>',
      globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'
    };
    let k = "globe";
    if (/scholar/.test(t)) k = "cap";
    else if (/award/.test(t)) k = "trophy";
    else if (/mobility|exchange/.test(t)) k = "plane";
    else if (/summer|event|program/.test(t)) k = "sun";
    else if (/mou|partner|renew/.test(t)) k = "doc";
    else if (/promotion|appoint/.test(t)) k = "badge";
    else if ((item.category || "") === "opportunities") k = "cap";
    else if ((item.category || "") === "events") k = "sun";
    return '<div class="cover-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + P[k] + '</svg></div>';
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

    const assetPrefix = location.pathname.includes("/pages/") ? "../" : "";
    const coverInner = item.image
      ? `<img class="cover-img" src="${assetPrefix}assets/images/news/${escapeHtml(item.image)}" alt="" loading="lazy" /><span class="tag">${escapeHtml(tag || cat)}</span>`
      : `<span class="tag">${escapeHtml(tag || cat)}</span>${coverIcon(item)}`;
    return `
      <article class="news-card" data-news-item="${escapeHtml(cat)}">
        <div class="cover${item.image ? " has-img" : ""}" style="background:${resolveGradient(item)};">
          ${coverInner}
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
