const elements = {
  search: document.querySelector("#search"),
  category: document.querySelector("#category-filter"),
  source: document.querySelector("#source-filter"),
  review: document.querySelector("#review-filter"),
  license: document.querySelector("#license-filter"),
  results: document.querySelector("#results"),
  count: document.querySelector("#result-count"),
  clear: document.querySelector("#clear-filters"),
  entryStat: document.querySelector("#entry-stat"),
  categoryStat: document.querySelector("#category-stat"),
  officialStat: document.querySelector("#official-stat"),
  reviewStat: document.querySelector("#review-stat"),
};

let indexData;
let categoryNames = new Map();

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9.+#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createOption(value, label) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function populateFilters(data) {
  categoryNames = new Map(data.categories.map((category) => [category.id, category.name]));
  for (const category of data.categories) {
    elements.category.append(createOption(category.id, category.name));
  }
  const licenses = [...new Set(data.entries.map((entry) => entry.license))].sort();
  for (const license of licenses) elements.license.append(createOption(license, license));
}

function getUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "",
    source: params.get("source") ?? "",
    review: params.get("review") ?? "",
    license: params.get("license") ?? "",
  };
}

function getControlState() {
  return {
    query: elements.search.value.trim(),
    category: elements.category.value,
    source: elements.source.value,
    review: elements.review.value,
    license: elements.license.value,
  };
}

function setControls(state) {
  elements.search.value = state.query;
  elements.category.value = state.category;
  elements.source.value = state.source;
  elements.review.value = state.review;
  elements.license.value = state.license;
}

function updateUrl(state) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category) params.set("category", state.category);
  if (state.source) params.set("source", state.source);
  if (state.review) params.set("review", state.review);
  if (state.license) params.set("license", state.license);
  window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`);
}

function entryText(entry) {
  return normalize([
    entry.name,
    entry.repo,
    entry.description,
    categoryNames.get(entry.category),
    entry.hardware.join(" "),
    entry.source_status,
    entry.review_status,
    entry.license,
    entry.notes,
  ].join(" "));
}

function score(entry, terms) {
  if (!terms.length) return 0;
  const text = entryText(entry);
  const name = normalize(entry.name);
  const hardware = normalize(entry.hardware.join(" "));
  const repo = normalize(entry.repo);
  let result = 0;
  for (const term of terms) {
    if (!text.includes(term)) return -1;
    if (name.includes(term)) result += 6;
    if (hardware.includes(term)) result += 5;
    if (repo.includes(term)) result += 3;
    result += 1;
  }
  return result;
}

function findEntries(state) {
  const terms = normalize(state.query).split(" ").filter(Boolean);
  return indexData.entries
    .map((entry) => ({ entry, score: score(entry, terms) }))
    .filter(({ entry, score: entryScore }) => (
      entryScore >= 0
      && (!state.category || entry.category === state.category)
      && (!state.source || entry.source_status === state.source)
      && (!state.review || entry.review_status === state.review)
      && (!state.license || entry.license === state.license)
    ))
    .sort((left, right) => (
      right.score - left.score
      || categoryNames.get(left.entry.category).localeCompare(categoryNames.get(right.entry.category))
      || left.entry.name.localeCompare(right.entry.name)
    ))
    .map(({ entry }) => entry);
}

function textNode(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

function externalLink(label, href, className = "") {
  const link = document.createElement("a");
  link.className = className;
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  return link;
}

function createMetadata(entry) {
  const list = document.createElement("dl");
  const pairs = [
    ["License", entry.license],
    ["Review", entry.review_status.replaceAll("-", " ")],
    ["Checked", entry.last_checked],
  ];
  for (const [term, value] of pairs) {
    const row = document.createElement("div");
    row.append(textNode("dt", "", term), textNode("dd", "", value));
    list.append(row);
  }
  return list;
}

function createResult(entry, index) {
  const article = document.createElement("article");
  article.className = "result-row";
  article.style.setProperty("--order", String(index));
  article.append(textNode("div", "result-index", String(index + 1).padStart(2, "0")));

  const body = document.createElement("div");
  const kicker = document.createElement("div");
  kicker.className = "result-kicker";
  kicker.append(textNode("span", "", categoryNames.get(entry.category)));
  kicker.append(textNode("span", `source-badge ${entry.source_status}`, entry.source_status.replaceAll("-", " ")));

  const heading = document.createElement("h3");
  heading.append(externalLink(entry.name, entry.url));
  body.append(kicker, heading, textNode("p", "result-description", entry.description));

  const hardware = document.createElement("ul");
  hardware.className = "hardware-list";
  hardware.setAttribute("aria-label", "Hardware targets");
  for (const target of entry.hardware) hardware.append(textNode("li", "", target));
  body.append(hardware);
  article.append(body);

  const side = document.createElement("div");
  side.className = "result-side";
  side.append(createMetadata(entry));
  const repoLink = externalLink("Open repository", entry.url, "repo-link");
  repoLink.append(textNode("span", "", "↗"));
  side.append(repoLink);
  article.append(side);

  const caveat = document.createElement("div");
  caveat.className = "caveat";
  caveat.append(textNode("strong", "", "Verify first"), textNode("span", "", entry.notes));
  article.append(caveat);
  return article;
}

function renderEmpty() {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.append(
    textNode("h3", "", "No driver matches this search."),
    textNode("p", "", "Try a hardware family, vendor name, or fewer filters."),
  );
  elements.results.replaceChildren(empty);
}

function render() {
  const state = getControlState();
  const entries = findEntries(state);
  elements.count.textContent = String(entries.length);
  elements.results.setAttribute("aria-busy", "false");
  updateUrl(state);
  if (!entries.length) return renderEmpty();
  const fragment = document.createDocumentFragment();
  entries.forEach((entry, index) => fragment.append(createResult(entry, index)));
  elements.results.replaceChildren(fragment);
}

function reset() {
  setControls({ query: "", category: "", source: "", review: "", license: "" });
  render();
  elements.search.focus();
}

function bindEvents() {
  elements.search.addEventListener("input", render);
  for (const select of [elements.category, elements.source, elements.review, elements.license]) {
    select.addEventListener("change", render);
  }
  elements.clear.addEventListener("click", reset);
  document.addEventListener("keydown", (event) => {
    const typing = ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
    if (event.key === "/" && !typing) {
      event.preventDefault();
      elements.search.focus();
    }
    if (event.key === "Escape" && document.activeElement === elements.search) {
      elements.search.value = "";
      render();
    }
  });
}

function setStats(data) {
  elements.entryStat.textContent = String(data.entries.length);
  elements.categoryStat.textContent = String(data.categories.length);
  elements.officialStat.textContent = String(data.entries.filter((entry) => entry.source_status === "official").length);
  elements.reviewStat.textContent = data.reviewed_at;
}

async function start() {
  try {
    const response = await fetch("data/index.json");
    if (!response.ok) throw new Error(`Index request failed with HTTP ${response.status}`);
    indexData = await response.json();
    populateFilters(indexData);
    setStats(indexData);
    setControls(getUrlState());
    bindEvents();
    render();
  } catch (error) {
    console.error(error);
    const failure = document.createElement("div");
    failure.className = "load-error";
    failure.append(
      textNode("h3", "", "The driver index could not be loaded."),
      textNode("p", "", "Use the GitHub README while the directory data is unavailable."),
    );
    elements.results.replaceChildren(failure);
    elements.results.setAttribute("aria-busy", "false");
  }
}

start();
