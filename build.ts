const ARROW_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="ext-icon" aria-hidden="true"><path d="M3.5 3.5h5v5m0-5L3.5 8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

type RowItem = {
  year?: string;
  title?: string;
  location?: string;
  meta?: string;
  url?: string;
};

type ImageItem = {
  type: "images";
  images?: Array<{ url?: string }>;
};

type FeatureItem = {
  type: "feature";
  title?: string;
  meta?: string;
  image?: string;
  url?: string;
};

type PortfolioData = {
  profile: {
    initials?: string;
    image?: string;
    name: string;
    description: string;
    website?: string;
    website_url?: string;
  };
  about?: string;
  work?: Array<RowItem | ImageItem>;
  writing?: Array<RowItem | FeatureItem>;
  speaking?: RowItem[];
  projects?: RowItem[];
  research?: RowItem[];
  education?: RowItem[];
  contact?: Array<{ label?: string; text?: string; url?: string }>;
};

const esc = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const stripTags = (value: unknown) => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const linkAttrs = (url?: string) => {
  if (!url) return "";
  const lower = url.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return ' target="_blank" rel="noopener noreferrer"';
  }
  return "";
};

const renderRow = (item: RowItem, showArrow = false) => {
  const title = esc(item.title);
  const meta = item.location || item.meta;
  const content = item.url
    ? `<a href="${esc(item.url)}" class="ext-link"${linkAttrs(item.url)}>${title}${showArrow ? " " + ARROW_SVG : ""}</a>`
    : `<span>${title}</span>`;

  return `
    <div class="row">
      <p class="year">${esc(item.year)}</p>
      <div>
        ${content}
        ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
      </div>
    </div>`;
};

const renderSection = (
  label: string,
  heading: string,
  items: RowItem[] | undefined,
  showArrow = true,
) => {
  if (!items?.length) return "";

  const rows = items.map((item) => renderRow(item, showArrow)).join("");
  return `<section class="block" aria-label="${esc(label)}"><h2>${esc(heading)}</h2>${rows}</section>`;
};

const render = (data: PortfolioData) => {
  const profile = data.profile;
  const title = `${profile.name} — Portfolio`;
  const description = `${profile.name} — ${profile.description}`;

  let body = `
      <header class="profile" aria-label="Profile">
        <div class="profile__media" aria-hidden="true"${profile.image ? ` style="background-image: url('${esc(profile.image)}')"` : ""}>
          ${!profile.image && profile.initials ? esc(profile.initials) : ""}
        </div>
        <div class="profile__text">
          <h1>${esc(profile.name)}</h1>
          <p>${esc(profile.description)}</p>
          ${profile.website ? `<a href="${esc(profile.website_url)}" class="pill"${linkAttrs(profile.website_url)}>${esc(profile.website)}</a>` : ""}
        </div>
      </header>`;

  if (data.about) {
    body += `
      <section class="block block--about" aria-label="About">
        <h2>About</h2>
        <p class="about">${esc(data.about)}</p>
      </section>`;
  }

  if (data.work?.length) {
    body += `<section class="block" aria-label="Work experiences"><h2>Work Experience</h2>`;
    for (const item of data.work) {
      if ((item as ImageItem).type === "images") {
        const imageItem = item as ImageItem;
        body += `<div class="card-row" aria-hidden="true">`;
        for (const image of imageItem.images ?? []) {
          body += `<div class="shot">${image.url ? `<img src="${esc(image.url)}" alt="" loading="lazy">` : ""}</div>`;
        }
        body += `</div>`;
        continue;
      }

      body += renderRow(item as RowItem, true);
    }
    body += `</section>`;
  }

  if (data.writing?.length) {
    body += `<section class="block" aria-label="Writing"><h2>Writing</h2>`;
    for (const item of data.writing) {
      if ((item as FeatureItem).type === "feature") {
        const feature = item as FeatureItem;
        const titleMarkup = esc(feature.title);
        body += feature.url
          ? `<a class="feature-card" href="${esc(feature.url)}"${linkAttrs(feature.url)}>
              <div class="feature-card__image" aria-hidden="true">${feature.image ? `<img src="${esc(feature.image)}" alt="" loading="lazy">` : ""}</div>
              <div class="feature-card__text">
                <p class="feature-card__title">${titleMarkup} ${ARROW_SVG}</p>
                ${feature.meta ? `<p class="meta">${esc(feature.meta)}</p>` : ""}
              </div>
            </a>`
          : `<div class="feature-card">
              <div class="feature-card__image" aria-hidden="true">${feature.image ? `<img src="${esc(feature.image)}" alt="" loading="lazy">` : ""}</div>
              <div class="feature-card__text">
                <p class="feature-card__title">${titleMarkup}</p>
                ${feature.meta ? `<p class="meta">${esc(feature.meta)}</p>` : ""}
              </div>
            </div>`;
        continue;
      }

      body += renderRow(item as RowItem, true);
    }
    body += `</section>`;
  }

  body += renderSection("Speaking experiences", "Speaking", data.speaking);
  body += renderSection("Side projects", "Side Projects", data.projects);
  body += renderSection("Research publications", "Research", data.research);
  body += renderSection("Education experiences", "Education", data.education, false);

  if (data.contact?.length) {
    body += `<section class="block block--contact" aria-label="Contact"><h2>Contact</h2>`;
    for (const item of data.contact) {
      const text = esc(item.text);
      const contact = item.url
        ? `<a href="${esc(item.url)}" class="ext-link"${linkAttrs(item.url)}>${text} ${ARROW_SVG}</a>`
        : `<span>${text}</span>`;

      body += `
        <div class="row">
          <p class="year">${esc(item.label)}</p>
          <div>${contact}</div>
        </div>`;
    }
    body += `</section>`;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="site" id="app">
${body}
  </main>
</body>
</html>`;
};

async function main() {
  const data = (await Bun.file("data.json").json()) as PortfolioData;
  const html = render(data);

  await Bun.$`mkdir -p dist`;
  await Bun.write("dist/index.html", html);
  await Bun.write("dist/styles.css", Bun.file("styles.css"));

  // Include JSON for reference/debugging in the deploy artifact.
  await Bun.write("dist/data.json", Bun.file("data.json"));

  const title = stripTags(data.profile?.name || "Portfolio");
  console.log(`Built dist/index.html for ${title}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
