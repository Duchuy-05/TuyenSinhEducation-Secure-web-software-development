// Keep startup validation isolated from local dotenv files and external services.
require('dotenv').config = () => ({});
const Module = require('node:module');
const originalLoad = Module._load;
Module._load = function(request, parent, ...rest) {
  if (request.includes('/controllers/')) return new Proxy({}, { get: () => new Proxy({}, { get: () => (req, res) => res.end() }) });
  if (request.endsWith('/models/DataSource')) return { AppDataSource: { initialize: async () => {} } };
  if (request.endsWith('/upload.middleware')) return new Proxy({}, { get: () => ({ single: () => (req, res, next) => next() }) });
  return originalLoad.call(this, request, parent, ...rest);
};
