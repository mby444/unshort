/**
 * Unshort One — Session History Manager
 * Stores and renders URL check history using localStorage.
 */

const STORAGE_KEY = "reveal_link_history";
const MAX_ENTRIES = 20;

/**
 * Load history from localStorage
 * @returns {Array<{ url: string, finalUrl: string, timestamp: number, hopCount: number }>}
 */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Save a new entry to history
 */
function saveEntry(url, finalUrl, hopCount) {
  const history = loadHistory();
  // Remove duplicate if exists
  const filtered = history.filter((e) => e.url !== url);
  // Prepend new entry
  filtered.unshift({ url, finalUrl, hopCount, timestamp: Date.now() });
  // Trim to max
  const trimmed = filtered.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  renderHistory();
}

/**
 * Clear all history
 */
function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

/**
 * Format a timestamp as relative time (e.g., "2 menit lalu")
 */
function formatRelativeTime(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

/**
 * Truncate a URL for display
 */
function truncateUrl(url, max = 45) {
  return url.length > max ? url.slice(0, max) + "…" : url;
}

/**
 * Render the history list into #history-list
 */
function renderHistory() {
  const container = document.getElementById("history-list");
  const wrapper = document.getElementById("history-section");
  if (!container || !wrapper) return;

  const history = loadHistory();

  if (history.length === 0) {
    wrapper.classList.add("hidden");
    return;
  }

  wrapper.classList.remove("hidden");

  container.innerHTML = history
    .map(
      (entry) => `
    <li class="history-item group" data-url="${entry.url}">
      <div class="history-item-inner">
        <div class="history-urls">
          <span class="history-input" title="${entry.url}">${truncateUrl(entry.url)}</span>
          <svg class="history-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
          <span class="history-final" title="${entry.finalUrl}">${truncateUrl(entry.finalUrl)}</span>
        </div>
        <div class="history-meta">
          <span class="history-hops">${entry.hopCount} hop</span>
          <span class="history-time">${formatRelativeTime(entry.timestamp)}</span>
        </div>
      </div>
    </li>
  `
    )
    .join("");

  // Click to recheck
  container.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", () => {
      const urlInput = document.getElementById("url-input");
      if (urlInput) {
        urlInput.value = item.dataset.url;
        urlInput.focus();
        urlInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

// Expose globally for use in inline scripts
window.RevealHistory = { saveEntry, clearHistory, renderHistory };

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", renderHistory);
