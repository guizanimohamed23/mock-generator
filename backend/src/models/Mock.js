const mongoose = require('mongoose');

const MockSchema = new mongoose.Schema(
  {
    controller: { type: String, required: true },
    method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
    route: { type: String, required: true },
    label: { type: String },
    response: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: Number, default: 200 },
    enabled: { type: Boolean, default: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mock', MockSchema);


