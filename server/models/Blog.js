const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  text: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
