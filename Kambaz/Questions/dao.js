import { v4 as uuidv4 } from "uuid";
import QuizModel from "../Quizzes/model.js";

export default function QuestionsDao() {

  async function findQuestionsForQuiz(quizId) {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    return quiz.questions || [];
  }

  async function createQuestion(question) {
    const quiz = await QuizModel.findById(question.quiz);
    if (!quiz) throw new Error("Quiz not found");

    const newQuestion = {
      ...question,
      _id: uuidv4(),
      answers: question.answers || [],
      points: question.points ?? 1,
    };

    quiz.questions = [...(quiz.questions || []), newQuestion];
    await quiz.save();
    return newQuestion;
  }

  async function deleteQuestion(questionId) {
    const quizzes = await QuizModel.find({ "questions._id": questionId });
    if (!quizzes.length) return { deleted: false };

    const quiz = quizzes[0];
    const before = quiz.questions.length;
    quiz.questions = quiz.questions.filter((q) => q._id !== questionId);
    await quiz.save();
    const after = quiz.questions.length;
    return { deleted: before !== after };
  }

  async function updateQuestion(questionId, updates) {
    const quizzes = await QuizModel.find({ "questions._id": questionId });
    if (!quizzes.length) throw new Error("Question not found");

    const quiz = quizzes[0];
    const question = quiz.questions.find((q) => q._id === questionId);
    Object.assign(question, updates);
    await quiz.save();
    return question;
  }

  return {
    findQuestionsForQuiz,
    createQuestion,
    deleteQuestion,
    updateQuestion,
  };
}
