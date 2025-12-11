import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
  _id: { type: String, required: true },

  // For MCQ / TF
  text: String,
  correct: Boolean,

  // For FIB
  blankText: String,
  correctAnswers: [String],
});

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: String,         // Question title
  question: String,     // Question text (body)
  type: { type: String, enum: ["MCQ", "TF", "FIB"], required: true },
  points: { type: Number, default: 1 },
  answers: [answerSchema], // MCQ/TF options or FIB blanks
});
export default schema;
