import mongoose from 'mongoose';

const statsSchema = mongoose.Schema({
  totalPosts: Number,
  totalLikes: Number,
  avgLikes: Number,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Stats', statsSchema);