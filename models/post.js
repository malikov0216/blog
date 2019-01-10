const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const schema = new Scheme(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Post', schema);
