import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isKicked: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Student', StudentSchema); 