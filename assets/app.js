/* data.js 의 RESUME 객체를 읽어 페이지를 그립니다. 내용 수정은 data.js 에서 하세요. */

(function () {
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  };

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* **텍스트** 를 형광펜 하이라이트로 변환합니다. */
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="hl">$1</strong>');

  /* 문자열 또는 문자열 배열을 받아, 배열이면 항목 사이에 줄바꿈을 넣습니다. */
  const lines = (v) => (Array.isArray(v) ? v.map(fmt).join("<br />") : fmt(v));

  /* 조직(org)별로 배지 색상 클래스를 자동 배정합니다 (등장 순서대로 org-0, 1, 2 …). */
  const orgClassOf = (() => {
    const seen = new Map();
    return (org) => {
      if (!seen.has(org)) seen.set(org, seen.size % 3);
      return `org-${seen.get(org)}`;
    };
  })();

  /* ---------- 라이트/다크 테마 ---------- */
  const THEME_KEY = "career-site-theme";

  const ICON_SUN =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

  const ICON_MOON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  function isDark() {
    const t = document.documentElement.dataset.theme;
    if (t) return t === "dark";
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.innerHTML = isDark() ? ICON_SUN : ICON_MOON;
      btn.setAttribute("aria-label", isDark() ? "라이트 모드로 전환" : "다크 모드로 전환");
    }
  }

  function initTheme() {
    applyTheme(localStorage.getItem(THEME_KEY) || null);
    document.querySelector(".theme-toggle").addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ---------- header / nav ---------- */
  function renderNav() {
    const nav = document.getElementById("nav");
    const links = [
      ["#about", "About"],
      ["#experience", "Experience"],
      ["#skills", "Skills"],
      ["#projects", "Projects"],
      ["#education", "Education"],
    ];
    nav.innerHTML = `
      <div class="nav-inner">
        <div class="nav-links">
          ${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
          ${
            RESUME.download
              ? `<a class="nav-cta" href="${esc(RESUME.download.href)}" download="${esc(RESUME.download.filename || "")}">${esc(RESUME.download.label)}</a>`
              : ""
          }
          <button type="button" class="theme-toggle" aria-label="테마 전환">☾</button>
        </div>
      </div>`;
  }

  /* ---------- hero ---------- */
  function renderHero() {
    const hero = document.getElementById("about");
    hero.innerHTML = `
      <p class="hero-kicker">${esc(RESUME.role)}</p>
      <h1>${esc(RESUME.headline).replace(/\n/g, "<br />")}</h1>
      <div class="hero-intro">
        ${RESUME.intro.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      <ul class="hero-contacts">
        ${RESUME.contacts
          .map(
            (c) =>
              `<li><span>${esc(c.label)}</span><a href="${esc(c.href)}">${esc(c.value)}</a></li>`
          )
          .join("")}
      </ul>`;
  }

  /* ---------- experience ---------- */
  function renderExperience() {
    const section = document.getElementById("experience");
    section.innerHTML = `
      <h2 class="section-title">Experience</h2>
      <ol class="exp-list">
        ${RESUME.experience
          .map(
            (e) => `
          <li class="exp-item">
            <div class="exp-head">
              <div>
                <strong>${esc(e.company)}</strong>
                <span class="exp-position">${esc(e.position)}</span>
              </div>
              <time>${esc(e.period)}</time>
            </div>
            <p>${lines(e.summary)}</p>
          </li>`
          )
          .join("")}
      </ol>`;
  }

  /* ---------- skills ---------- */
  function renderSkills() {
    const section = document.getElementById("skills");
    section.innerHTML = `
      <h2 class="section-title">Skills</h2>
      <div class="skill-groups">
        ${RESUME.skills
          .map(
            (g) => `
          <div class="skill-group">
            <strong>${esc(g.group)}</strong>
            <ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          </div>`
          )
          .join("")}
      </div>`;
  }

  /* ---------- projects ---------- */
  function renderProjects() {
    const section = document.getElementById("projects");
    section.innerHTML = `
      <h2 class="section-title">Projects</h2>
      <p class="section-lead">${esc(RESUME.projectsIntro)}</p>
      <div class="project-list">
        ${RESUME.projects.map(projectCard).join("")}
      </div>`;
  }

  function projectCard(p) {
    return `
      <article class="project${p.compact ? " project-compact" : ""}">
        <header class="project-head">
          <p class="project-meta">
            <span class="org-chip ${orgClassOf(p.org)}">${esc(p.org)}</span>
            <span>${esc(p.period)}</span>
          </p>
          <div class="project-title-row">
            <h3>${esc(p.title)}</h3>
            <ul class="project-roles">
              ${p.roles.map((r) => `<li>${esc(r)}</li>`).join("")}
            </ul>
            ${
              p.link
                ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener">GitHub ↗</a>`
                : ""
            }
          </div>
        </header>
        <p class="project-summary">${lines(p.summary)}</p>
        ${(p.sections || [])
          .map(
            (s) => `
          <div class="project-detail">
            <h4>${esc(s.label)}</h4>
            <ul>${s.items.map((i) => `<li>${fmt(i)}</li>`).join("")}</ul>
          </div>`
          )
          .join("")}
      </article>`;
  }

  /* ---------- education ---------- */
  function renderEducation() {
    const section = document.getElementById("education");
    section.innerHTML = `
      <h2 class="section-title">Education</h2>
      <ul class="edu-list">
        ${RESUME.education
          .map(
            (e) => `
          <li class="edu-item">
            <div class="edu-head">
              <strong>${esc(e.name)}</strong>
              <time>${esc(e.period)}</time>
            </div>
            <p>${esc(e.note)}</p>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  /* ---------- PDF 생성용 인쇄 순서 ----------
   * 화면에서는 Projects → Education 순서지만, PDF 생성 시에는
   * 1페이지에 Education까지 들어가도록 Education을 Projects 앞으로 옮깁니다.
   */
  function initPrint() {
    window.addEventListener("beforeprint", () => {
      const edu = document.getElementById("education");
      const projects = document.getElementById("projects");
      projects.parentNode.insertBefore(edu, projects);
    });

    window.addEventListener("afterprint", () => {
      const edu = document.getElementById("education");
      const footer = document.getElementById("footer");
      footer.parentNode.insertBefore(edu, footer);
    });
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    const footer = document.getElementById("footer");
    footer.innerHTML = `
      <p>© ${new Date().getFullYear()} ${esc(RESUME.name)}</p>
      <a href="#about">맨 위로 ↑</a>`;
  }

  document.title = "Career Portfolio";
  renderNav();
  initTheme();
  initPrint();
  renderHero();
  renderExperience();
  renderSkills();
  renderProjects();
  renderEducation();
  renderFooter();
})();
