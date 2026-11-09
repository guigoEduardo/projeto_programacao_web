const { PAGINATION } = require('../config/constants');

function parsePagination(query = {}) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : PAGINATION.DEFAULT_PAGE;
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, PAGINATION.MAX_LIMIT)
    : PAGINATION.DEFAULT_LIMIT;

  return { page, limit };
}

module.exports = { parsePagination };
