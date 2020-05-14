import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  lessonId: {
    type: String,
    required: true,
    ref: 'Lesson'
  },
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
