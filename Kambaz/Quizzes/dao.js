import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import model from "./model.js";

export default function QuizzesDao() {

  const findQuizzesForCourse = (courseId) => {
    return model.find({ course: courseId }).exec();
  };

  const findQuizById = (quizId) => {
    if (!quizId) return null;

    const query = mongoose.Types.ObjectId.isValid(quizId)
      ? { $or: [{ _id: quizId }, { _id: new mongoose.Types.ObjectId(quizId) }] }
      : { _id: quizId };

    return model.findOne(query).exec();
  };

  const createQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      _id: uuidv4(),
    };
    return model.create(newQuiz);
  };

  const updateQuiz = (quizId, updatedQuiz) => {
    return model.findOneAndUpdate(
      { _id: quizId },
      { $set: updatedQuiz },
      { new: true }
    ).exec();
  };

  const deleteQuiz = (quizId) => {
    return model.findOneAndDelete({ _id: quizId }).exec();
  };

  const togglePublish = async (quizId) => {
    const quiz = await model.findOne({ _id: quizId }).exec();
    if (!quiz) return null;

    quiz.published = !quiz.published;
    return quiz.save();
  };

  const submitQuizScore = async (quizId, studentId, score, answers = {}) => {
    const quiz = await model.findOne({ _id: quizId }).exec();
    if (!quiz) return null;

    // Initialize studentScores if it doesn't exist
    if (!quiz.studentScores) {
      quiz.studentScores = [];
    }

    // Find existing score entry for this student
    const existingScoreIndex = quiz.studentScores.findIndex(
      (s) => String(s.studentId) === String(studentId) || s.studentId === studentId
    );

    const attempt = existingScoreIndex >= 0 
      ? (quiz.studentScores[existingScoreIndex].attempt || 0) + 1
      : 1;

    const scoreEntry = {
      studentId: studentId,
      lastScore: score,
      attempt: attempt,
      answers: answers // Store student's answers
    };

    if (existingScoreIndex >= 0) {
      // Update existing score
      quiz.studentScores[existingScoreIndex] = scoreEntry;
    } else {
      // Add new score entry
      quiz.studentScores.push(scoreEntry);
    }

    return quiz.save();
  };

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublish,
    submitQuizScore
  };
}
