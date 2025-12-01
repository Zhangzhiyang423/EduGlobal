const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  programme_code: {
    type: String,
    required: true
  },
  aspect: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment_title: {
    type: String,
    required: true
  },
  comment_text: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);