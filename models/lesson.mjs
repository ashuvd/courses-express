import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  video: {
    fieldName: String,
    fileMimeType: String,
    fileSizeInMegabytes: String,
    dir: String
  },
  files: [{
    fieldName: String,
    fileMimeType: String,
    fileSizeInMegabytes: String,
    dir: String
  }],
  links: [String],
  courseId: {
    type: String,
    required: true,
    ref: 'Course'
  }
});

const Lesson = mongoose.model('Lesson', LessonSchema);
export default Lesson;
