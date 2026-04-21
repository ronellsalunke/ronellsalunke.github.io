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

type SocialIconKey =
  | "resume"
  | "github"
  | "linkedin"
  | "email"
  | "telegram"
  | "blog"
  | "twitter"
  | "x"
  | "rss"
  | "website";

type ContactItem = {
  label?: string;
  text?: string;
  url?: string;
  icon?: SocialIconKey;
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
  contact?: ContactItem[];
};

const esc = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const stripTags = (value: unknown) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const linkAttrs = (url?: string) => {
  if (!url) return "";
  const lower = url.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return ' target="_blank" rel="noopener noreferrer"';
  }
  return "";
};

const SOCIAL_ICONS: Record<string, string> = {
  resume:
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#e3e3e3"><rect fill="none" height="24" width="24"/><path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M12,10c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2s-2-0.9-2-2 C10,10.9,10.9,10,12,10z M16,18H8v-0.57c0-0.81,0.48-1.53,1.22-1.85C10.07,15.21,11.01,15,12,15c0.99,0,1.93,0.21,2.78,0.58 C15.52,15.9,16,16.62,16,17.43V18z"/></svg>',
  github:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"/></svg>',
  linkedin:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM165 266.2L231.5 266.2L231.5 480L165 480L165 266.2zM236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160C219.5 160 236.7 177.2 236.7 198.5zM413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480L413.9 480z"/></svg>',
  telegram:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/></svg>',
  email:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e3e3e3"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  blog: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e3e3e3"><path d="M0 0h24v24H0z" fill="none"/><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>',
  website:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e3e3e3"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
};

const renderSocialPills = (contacts?: PortfolioData["contact"]) => {
  if (!contacts?.length) return "";
  const links = contacts
    .filter((item) => item?.label && item?.url)
    .map((item) => {
      const icon =
        item.icon && SOCIAL_ICONS[item.icon]
          ? SOCIAL_ICONS[item.icon]
          : SOCIAL_ICONS.website;
      return `<a href="${esc(item.url)}" class="social-link" aria-label="${esc(item.label)}" title="${esc(item.label)}"${linkAttrs(item.url)}>${icon}</a>`;
    })
    .join("");

  if (!links) return "";
  return `<div class="profile__links" aria-label="Social links">${links}</div>`;
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
  const title = `${profile.name} - Portfolio`;
  const description = `${profile.name} - ${profile.description}`;

  let body = `
      <header class="profile" aria-label="Profile">
        <div class="profile__media" aria-hidden="true"${profile.image ? ` style="background-image: url('${esc(profile.image)}')"` : ""}>
          ${!profile.image && profile.initials ? esc(profile.initials) : ""}
        </div>
        <div class="profile__text">
          <h1>${esc(profile.name)}</h1>
          <p>${esc(profile.description)}</p>
          ${renderSocialPills(data.contact) || (profile.website ? `<a href="${esc(profile.website_url)}" class="pill"${linkAttrs(profile.website_url)}>${esc(profile.website)}</a>` : "")}
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
  body += renderSection(
    "Education experiences",
    "Education",
    data.education,
    false,
  );

  // text based contact section
  // if (data.contact?.length) {
  //   body += `<section class="block block--contact" aria-label="Contact"><h2>Contact</h2>`;
  //   for (const item of data.contact) {
  //     const text = esc(item.text);
  //     const contact = item.url
  //       ? `<a href="${esc(item.url)}" class="ext-link"${linkAttrs(item.url)}>${text} ${ARROW_SVG}</a>`
  //       : `<span>${text}</span>`;

  //     body += `
  //       <div class="row">
  //         <p class="year">${esc(item.label)}</p>
  //         <div>${contact}</div>
  //       </div>`;
  //   }
  //   body += `</section>`;
  // }

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

  const title = stripTags(data.profile?.name || "Portfolio");
  console.log(`Built dist/index.html for ${title}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
