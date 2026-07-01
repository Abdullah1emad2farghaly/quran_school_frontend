// Generic mock adapter that mimics a real REST API surface (latency,
// pagination envelope, filtering, search) operating over in-memory arrays.
// Every service module (studentsService, teachersService, ...) is built on
// top of these primitives so swapping to a live backend later only means
// replacing the implementation inside api/services/*.js — the function
// signatures consumed by the UI stay identical.

const LATENCY_MS = 380;

function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateFailureRate() {
  // Deterministic: mock API never fails randomly, keeps demo stable.
  return false;
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Paginate + filter + search an in-memory array the way a real backend would.
 * @param {Array} collection
 * @param {Object} options
 * @param {number} options.page (1-indexed)
 * @param {number} options.pageSize
 * @param {string} options.search
 * @param {string[]} options.searchFields
 * @param {Object} options.filters key/value exact-match filters (ignores "all"/"")
 */
export function paginate(collection, options = {}) {
  const { page = 1, pageSize = 10, search = "", searchFields = [], filters = {} } = options;

  let result = [...collection];

  if (search && searchFields.length) {
    const q = search.trim().toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) => String(item[field] ?? "").toLowerCase().includes(q))
    );
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") return;
    result = result.filter((item) => String(item[key]) === String(value));
  });

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return {
    data,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Wraps a synchronous resolver in network-latency simulation, returning the
 * same envelope shape ({ data } or { data, pagination }) a real axios
 * response.data would have.
 */
export async function mockRequest(resolver, { latency = LATENCY_MS } = {}) {
  await delay(latency);
  if (simulateFailureRate()) {
    throw new ApiError("Network error, please try again.", 500);
  }
  return resolver();
}

let _localId = 90000;
export function generateId(prefix) {
  return `${prefix}-${_localId++}`;
}
