const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 20 },
  genre: { type: String, required: true },
  description: { type: String, required: true, maxlength: 200 }
});

movieSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Movie', movieSchema);