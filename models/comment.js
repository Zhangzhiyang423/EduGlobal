const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   
    required: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Comment', commentSchema);
