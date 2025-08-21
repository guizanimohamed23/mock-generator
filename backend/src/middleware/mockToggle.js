const Mock = require('../models/Mock');

function isMockEnabled(req) {
  const header = String(req.headers['x-use-mock'] || '').toLowerCase();
  const query = String(req.query.mock || '').toLowerCase();
  return header === 'true' || query === 'true';
}

async function tryRespondWithMock(req, res) {
  if (!isMockEnabled(req)) return false;
  const method = req.method.toUpperCase();
  const routeTemplate = req.baseUrl + (req.route ? req.route.path : '');
  const exactPath = req.originalUrl.split('?')[0];

  const mock = await Mock.findOne({
    method,
    enabled: true,
    $or: [{ route: routeTemplate }, { route: exactPath }],
  }).lean();

  if (mock) {
    res.status(mock.status || 200).json(mock.response);
    return true;
  }
  return false;
}

module.exports = { isMockEnabled, tryRespondWithMock };


