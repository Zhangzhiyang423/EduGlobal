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
    ref: 'User',   // ✅ 建立与 User 的关联
    required: true
  }
}, { timestamps: true }); // ✅ 自动生成 createdAt 和 updatedAt

module.exports = mongoose.model('Comment', commentSchema);
