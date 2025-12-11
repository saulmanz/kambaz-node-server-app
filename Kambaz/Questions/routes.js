import QuestionsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuestionsRoutes(app) {
  const quizDao = QuizzesDao();
  const dao = QuestionsDao();

  app.get("/api/courses/:courseId/:quizId/questions", async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = await dao.findQuestionsForQuiz(quizId)
      res.json(questions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/courses/:courseId/:quizId/questions", async (req, res) => {
    try {
      const { quizId } = req.params;
      const questionData = { ...req.body, quiz: quizId };
      const newQuestion = await dao.createQuestion(questionData);
      res.json(newQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/questions/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const updatedQuestion = await dao.updateQuestion(questionId, req.body);
      res.json(updatedQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/questions/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const result = await dao.deleteQuestion(questionId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
