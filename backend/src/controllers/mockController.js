const Mock = require('../models/Mock');
const { asyncHandler } = require('../utils/asyncHandler');
const { generateJsonMock } = require('../services/gemini');

const listMocks = asyncHandler(async (req, res) => {
  const mocks = await Mock.find().sort({ updatedAt: -1 });
  res.json(mocks);
});

const createMock = asyncHandler(async (req, res) => {
  const mock = await Mock.create(req.body);
  res.status(201).json(mock);
});

const updateMock = asyncHandler(async (req, res) => {
  const mock = await Mock.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!mock) return res.status(404).json({ message: 'Mock not found' });
  res.json(mock);
});

const deleteMock = asyncHandler(async (req, res) => {
  const mock = await Mock.findByIdAndDelete(req.params.id);
  if (!mock) return res.status(404).json({ message: 'Mock not found' });
  res.json({ ok: true });
});

const generateWithGemini = asyncHandler(async (req, res) => {
  const { controller, method, route, label, prompt } = req.body;
  if (!controller || !method || !route) {
    return res.status(400).json({ message: 'controller, method and route are required' });
  }

  let defaultPrompt = '';
  if (!prompt) {
    if (controller.toLowerCase() === 'books') {
      defaultPrompt = 'Generate a realistic JSON array of 3 book objects with fields: title (string), author (string), isbn (string).';
    } else if (controller.toLowerCase() === 'users') {
      defaultPrompt = 'Generate a realistic JSON array of 3 user objects with fields: name (string), email (string), role (one of Frontend, Backend, QA).';
    } else {
      defaultPrompt = 'Generate a realistic JSON object or array appropriate for this API route.';
    }
  }

  const response = await generateJsonMock(prompt || defaultPrompt);
  const mock = await Mock.create({ controller, method: method.toUpperCase(), route, label: label || 'AI generated', response, status: 200, enabled: true });
  res.status(201).json(mock);
});

const getOneMock = asyncHandler(async (req, res) => {
  const { method, route } = req.query;
  if (!method || !route) return res.status(400).json({ message: 'method and route are required' });
  const mock = await Mock.findOne({ method: method.toUpperCase(), route }).sort({ updatedAt: -1 });
  if (!mock) return res.status(404).json({ message: 'Mock not found' });
  res.json(mock);
});

module.exports = { listMocks, createMock, updateMock, deleteMock, generateWithGemini, getOneMock };



