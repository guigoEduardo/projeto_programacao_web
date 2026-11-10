const searchService = require('./searchService');
const { success } = require('../../middlewares/apiResponse');
const { SEARCH } = require('../../config/constants');
exports.search = async (req, res) => {
  const raw = typeof req.query.q === 'string' ? req.query.q : '';
  const query = raw.trim().slice(0, SEARCH.MAX_LENGTH);
  const searchResults = query.length >= SEARCH.MIN_LENGTH ? await searchService.globalSearch(query) : { destinations: [], users: [] };
  return success(res, { query, ...searchResults });
};
