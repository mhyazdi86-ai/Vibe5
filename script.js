/* ==============================
 Top 5 Discoveries: Music Player
============================== */

// ---------- داده‌ی خواننده‌ها ----------
const artists = {
  YAS: {
    role: "Rapper / Singer",
    bio: "Iranian rapper and singer known for his melodic style and distinctive voice in Persian hip-hop.",
  },
  PISHRO: {
    role: "Rapper",
    bio: "A well-known name in Persian hip-hop, respected for his lyricism and delivery.",
  },
  "TECH N9NE": {
    role: "Rapper",
    bio: "American rapper from Kansas City and co-founder of Strange Music, known for his rapid-fire flow.",
  },
  Hichkas: {
    role: "Rapper",
    bio: "One of the pioneers of Persian hip-hop, known for socially aware and poetic lyrics.",
  },
  Bahram: {
    role: "Rapper",
    bio: "Iranian rapper known for personal, story-driven lyrics and a raw sound.",
  },
  Moein: {
    role: "Golden Voices",
    bio: "One of the most beloved voices of Persian pop music, famous for his emotional delivery.",
  },
  Dariush: {
    role: "Golden Voices",
    bio: "Iconic Iranian singer-songwriter, loved for his heartfelt and socially conscious songs.",
  },
};

// ---------- داده‌ی آهنگ‌ها (هر چیزی رو خواستی اینجا عوض کن) ----------
const tracks = [
  {
    id: 1,
    title: "Separ",
    artist: "YAS x PISHRO x TECH N9NE",
    artists: ["YAS", "PISHRO"],
    about:
      "A cross-border hip-hop collaboration bringing three voices together.",
    genre: "Rap/Hip-Hop",
    tag: "BREAKTHROUGH OF THE WEEK",
    plays: "1.2M",
    audio: "./Music/Yas/REZA PISHRO x TECH N9NE x YAS - SEPAR.mp3",
    cover: "./Images/tracks/separ-cover.jpeg",
  },
  {
    id: 2,
    title: "Ye Rooze Khoob Miad",
    artist: "Hichkas",
    artists: ["Hichkas"],
    about: "A hopeful, fan-favorite track from the Persian hip-hop scene.",
    genre: "Rap/Hip-Hop",
    tag: "FAN FAVORITE",
    plays: "980K",
    audio: "./Music/Hichkas/Hichkas - Ye Rooze Khoob Miad.mp3",
    cover: "./Images/tracks/Ye Rooze Khoob Miad -cover.svg",
  },
  {
    id: 3,
    title: "Eshtebah khoob",
    artist: "Bahram",
    artists: ["Bahram"],
    about: "A raw and personal track that is climbing the charts fast.",
    genre: "Rap/Hip-Hop",
    tag: "RISING FAST",
    plays: "870K",
    audio: "./Music/Bahram/Bahram Eshtebah 320 .mp3",
    cover: "./Images/tracks/Eshtebah khoob -cover.svg",
  },
  {
    id: 4,
    title: "Zendegi Ba Tou",
    artist: "Moein",
    artists: ["Moein"],
    about: "A timeless romantic ballad from the golden era of Persian pop.",
    genre: "Golden Voices",
    tag: "TIMELESS PICK",
    plays: "760K",
    audio: "./Music/Moein/Moein - Zendegi Ba To (320).mp3",
    cover: "./Images/tracks/Zendegi Ba Tou-cover.svg",
  },
  {
    id: 5,
    title: "Yavar Hamishe Momen",
    artist: "Dariush",
    artists: ["Dariush"],
    about: "A heartfelt classic that stays close to its listeners.",
    genre: "Golden Voices",
    tag: "EDITOR'S CHOICE",
    plays: "640K",
    audio: "./Music/Dariush/Dariush-Yavar-Hamisheh-Momen-320.mp3",
    cover: "./Images/tracks/Yavar Hamishe Momen-cover (1).svg",
  },
];

// ---------- المان‌ها ----------
const $ = (id) => document.getElementById(id);

const el = {
  card: $("nowPlaying"),
  rank: $("npRank"),
  tag: $("npTag"),
  plays: $("npPlays"),
  cover: $("npCover"),
  title: $("npTitle"),
  artist: $("npArtist"),
  download: $("npDownload"),
  playlistBtn: $("npPlaylist"),
  coverPlay: $("coverPlay"),
  bar: $("progress"),
  fill: $("progressFill"),
  cur: $("curTime"),
  total: $("totalTime"),
  prev: $("prevBtn"),
  play: $("playBtn"),
  next: $("nextBtn"),
  list: $("trackList"),
  artistCards: $("artistCards"),
  artistHeading: $("artistHeading"),
};

// ---------- وضعیت برنامه ----------
const audio = new Audio();
audio.preload = "metadata";

let current = 0; // اندیس آهنگ فعلی

// پلی‌لیست توی مرورگر ذخیره می‌شه و با رفرش پاک نمی‌شه
const PLAYLIST_KEY = "vibe5-playlist";

function loadPlaylist() {
  try {
    return JSON.parse(localStorage.getItem(PLAYLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function savePlaylist() {
  try {
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify([...playlist]));
  } catch {}
}

const playlist = new Set(loadPlaylist()); // آیدی آهنگ‌های پلی‌لیست

// ---------- ابزارهای کمکی ----------
const pad = (n) => String(n).padStart(2, "0");

function fmt(seconds, padMinutes = false) {
  if (!isFinite(seconds)) return padMinutes ? "00:00" : "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return (padMinutes ? pad(m) : m) + ":" + pad(s);
}

function setPlaying(isPlaying) {
  el.card.classList.toggle("is-playing", isPlaying);
}

// اسم فایلی که کاربر دانلود می‌کنه، مثلاً «Hichkas - Ye Rooze Khoob Miad.mp3»
function fileNameFor(t) {
  const ext = t.audio.split(".").pop();
  return t.artist + " - " + t.title + "." + ext;
}

// ---------- پیام کوچیک پایین صفحه ----------
let toastTimer;

function showToast(message) {
  let toast = document.querySelector(".Toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "Toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- دانلود آهنگ (از منوی سه‌نقطه) ----------
function downloadTrack(t) {
  const a = document.createElement("a");
  a.href = t.audio;
  a.download = fileNameFor(t);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('Downloading "' + t.title + '"');
}

// ---------- پلی‌لیست: اضافه / حذف ----------
function togglePlaylist(id) {
  const t = tracks.find((x) => x.id === id);

  if (playlist.has(id)) {
    playlist.delete(id);
    showToast("Removed from your playlist");
  } else {
    playlist.add(id);
    showToast('"' + t.title + '" added to your playlist');
  }

  savePlaylist();
  paintNow();
  renderList();
}

// ---------- منوی سه‌نقطه: بستن ----------
function closeMenus() {
  document.querySelectorAll(".Track.menu-open").forEach((li) => {
    li.classList.remove("menu-open");
    li.querySelector(".Track-more").setAttribute("aria-expanded", "false");
  });
}

// ---------- نمایش آهنگ فعلی در پلیر بزرگ ----------
function paintNow() {
  const t = tracks[current];
  const inList = playlist.has(t.id);

  el.rank.textContent = "RANK #" + pad(current + 1);
  el.tag.textContent = t.tag;
  el.plays.textContent = t.plays;
  el.title.textContent = t.title;
  el.artist.textContent = t.artist;
  el.cover.alt = t.title + " cover";

  // دکمه‌ی دانلود: لینک مستقیم به فایل همین آهنگ
  el.download.href = t.audio;
  el.download.download = fileNameFor(t);

  // دکمه‌ی پلی‌لیست
  el.playlistBtn.classList.toggle("in-playlist", inList);
  el.playlistBtn.querySelector("i").className =
    "fa-solid " + (inList ? "fa-check" : "fa-plus");
  el.playlistBtn.querySelector("span").textContent = inList
    ? "ADDED TO PLAYLIST"
    : "ADD TO PLAYLIST";
}

// ---------- ساخت لیست سمت راست (همه به جز آهنگ فعلی) ----------
function renderList() {
  el.list.innerHTML = "";

  tracks.forEach((t, i) => {
    if (i === current) return;

    const inList = playlist.has(t.id);
    const artistUrl = "./artist.html?artist=" + encodeURIComponent(t.artist);

    const li = document.createElement("li");
    li.className = "Track";
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", "Play " + t.title + " by " + t.artist);

    li.innerHTML = `
      <span class="Track-rank">#${pad(i + 1)}</span>
      <span class="Track-cover">
        <img src="${t.cover}" alt="" loading="lazy" />
        <i class="fa-solid fa-play"></i>
      </span>
      <span class="Track-info">
        <strong>${t.title}</strong>
        <small>${t.artist}</small>
      </span>
      <span class="Track-genre">${t.genre}</span>
      <span class="Track-dur" data-dur="${i}">${
      t.duration ? fmt(t.duration) : "--:--"
    }</span>
      <button class="Icon-btn Track-heart ${
        inList ? "in-playlist" : ""
      }" aria-label="Add to playlist">
        <i class="${inList ? "fa-solid" : "fa-regular"} fa-heart"></i>
      </button>
      <button class="Icon-btn Track-more" aria-label="More options"
              aria-haspopup="menu" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>

      <div class="Track-menu" role="menu">
        <button class="Menu-item" role="menuitem" data-action="download">
          <i class="fa-solid fa-download"></i>
          <span>Download song</span>
        </button>
        <button class="Menu-item" role="menuitem" data-action="playlist">
          <i class="fa-solid ${inList ? "fa-check" : "fa-circle-plus"}"></i>
          <span>${inList ? "Remove from playlist" : "Add to playlist"}</span>
        </button>
        <a class="Menu-item" role="menuitem" href="${artistUrl}">
          <i class="fa-solid fa-user"></i>
          <span>Go to artist page</span>
        </a>
      </div>
    `;

    // کلیک روی آهنگ: بیاد بالا و پخش بشه
    li.addEventListener("click", () => loadTrack(i, true));
    li.addEventListener("keydown", (e) => {
      if (e.target !== li) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadTrack(i, true);
      }
    });

    // کلیک روی قلب: اضافه / حذف از پلی‌لیست (آهنگ پخش نشه)
    li.querySelector(".Track-heart").addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlaylist(t.id);
    });

    // کلیک روی سه‌نقطه: باز و بسته کردن منو
    const moreBtn = li.querySelector(".Track-more");
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = li.classList.contains("menu-open");
      closeMenus();
      if (!wasOpen) {
        li.classList.add("menu-open");
        moreBtn.setAttribute("aria-expanded", "true");
      }
    });

    // کلیک روی گزینه‌های منو
    li.querySelector(".Track-menu").addEventListener("click", (e) => {
      e.stopPropagation(); // آهنگ پخش نشه
      const item = e.target.closest(".Menu-item");
      if (!item) return;

      const action = item.dataset.action;
      if (action === "download") downloadTrack(t);
      if (action === "playlist") togglePlaylist(t.id);
      // گزینه‌ی «Go to artist page» یه لینکه و خودش می‌ره

      closeMenus();
    });

    el.list.appendChild(li);
  });
}

// ---------- کارت‌های خواننده ----------
function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderArtists() {
  const t = tracks[current];
  const names = t.artists || [t.artist];
  const multi = names.length > 1;

  el.artistHeading.textContent = multi
    ? "ABOUT THE ARTISTS"
    : "ABOUT THE ARTIST";
  el.artistCards.innerHTML = "";

  names.forEach((name) => {
    const info = artists[name] || { role: "Artist", bio: "" };
    const url = "./artist.html?artist=" + encodeURIComponent(name);

    const card = document.createElement("article");
    card.className = "Artist-card";
    card.innerHTML = `
      <div class="Artist-top">
        <div class="Artist-avatar">${initials(name)}</div>
        <div class="Artist-name">
          <h4>${name}</h4>
          <span>${info.role}</span>
        </div>
      </div>
      <p class="Artist-bio">${info.bio}</p>
      <div class="Artist-track">
        <small>${multi ? "FEATURED ON" : "ON THIS TRACK"}</small>
        <strong>${t.title}</strong>
        ${!multi && t.about ? `<p>${t.about}</p>` : ""}
      </div>
      <a class="Artist-link" href="${url}">VIEW ARTIST PAGE →</a>
    `;
    el.artistCards.appendChild(card);
  });
}

// ---------- بارگذاری و پخش ----------
function loadTrack(index, autoplay = false) {
  current = index;
  const t = tracks[index];

  setPlaying(false);
  audio.src = t.audio;

  // کاور جدید با انیمیشن ورود
  el.cover.style.visibility = "";
  el.cover.src = t.cover;
  el.cover.classList.remove("swap-in");
  void el.cover.offsetWidth; // ری‌استارت انیمیشن
  el.cover.classList.add("swap-in");

  // ریست نوار پخش
  el.fill.style.width = "0%";
  el.cur.textContent = "00:00";
  el.total.textContent = t.duration ? fmt(t.duration, true) : "00:00";

  paintNow();
  renderList();
  renderArtists();

  if (autoplay) audio.play().catch(() => {});
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function nextTrack() {
  loadTrack((current + 1) % tracks.length, true);
}

function prevTrack() {
  // اگه بیشتر از ۳ ثانیه از آهنگ گذشته، همون آهنگ از اول
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadTrack((current - 1 + tracks.length) % tracks.length, true);
  }
}

// ---------- رویدادهای صدا ----------
audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("ended", nextTrack);

audio.addEventListener("loadedmetadata", () => {
  el.total.textContent = fmt(audio.duration, true);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  el.fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  el.cur.textContent = fmt(audio.currentTime, true);
});

// اگه مسیر فایل آهنگ اشتباه بود
audio.addEventListener("error", () => {
  setPlaying(false);
  el.tag.textContent = "AUDIO FILE NOT FOUND";
});

// اگه مسیر عکس کاور اشتباه بود، فقط پس‌زمینه‌ی گرادیانی دیده می‌شه
el.cover.addEventListener("error", () => {
  el.cover.style.visibility = "hidden";
});

// ---------- دکمه‌ها ----------
el.play.addEventListener("click", togglePlay);
el.coverPlay.addEventListener("click", togglePlay);
el.next.addEventListener("click", nextTrack);
el.prev.addEventListener("click", prevTrack);
el.playlistBtn.addEventListener("click", () =>
  togglePlaylist(tracks[current].id)
);

// کلیک بیرون از منو یا زدن Esc، منوی باز رو می‌بنده
document.addEventListener("click", closeMenus);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenus();
});

// ---------- نوار پخش: کلیک و کشیدن ----------
let dragging = false;

function seekFromEvent(e) {
  const rect = el.bar.getBoundingClientRect();
  const p = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  if (audio.duration) audio.currentTime = p * audio.duration;
}

el.bar.addEventListener("pointerdown", (e) => {
  dragging = true;
  el.bar.setPointerCapture(e.pointerId);
  seekFromEvent(e);
});
el.bar.addEventListener("pointermove", (e) => {
  if (dragging) seekFromEvent(e);
});
el.bar.addEventListener("pointerup", () => (dragging = false));
el.bar.addEventListener("pointercancel", () => (dragging = false));

// ---------- گرفتن مدت‌زمان واقعی هر آهنگ برای لیست ----------
tracks.forEach((t, i) => {
  const probe = new Audio();
  probe.preload = "metadata";
  probe.src = t.audio;
  probe.addEventListener("loadedmetadata", () => {
    t.duration = probe.duration;
    const span = document.querySelector('[data-dur="' + i + '"]');
    if (span) span.textContent = fmt(probe.duration);
    if (i === current) el.total.textContent = fmt(probe.duration, true);
  });
});

// ---------- شروع ----------
loadTrack(0, false); // آهنگ اول آماده است، ولی تا کاربر نزنه پخش نمی‌شه

//------------------- ریسپانسیو --------------------
// ==============================
// منوی همبرگری (موبایل / تبلت)
// ==============================
(function () {
  const header = document.getElementById("Header");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("headerMenu");
  if (!header || !toggle || !menu) return;

  const icon = toggle.querySelector("i");

  function setOpen(open) {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (icon) {
      icon.classList.toggle("fa-bars", !open);
      icon.classList.toggle("fa-xmark", open);
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("menu-open"));
  });

  // بستن منو با کلیک روی لینک‌ها
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // بستن منو با کلیک بیرون از هدر
  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) setOpen(false);
  });

  // بستن منو با کلید Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  // اگه صفحه بزرگ شد (دسکتاپ)، منو بسته بشه
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setOpen(false);
  });
})();
