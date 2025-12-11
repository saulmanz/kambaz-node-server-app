import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const quizzes = await dao.findQuizzesForCourse(req.params.courseId);
      res.json(quizzes);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const quiz = await dao.createQuiz({
        ...req.body,
        course: req.params.courseId,
      });
      res.json(quiz);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/quizzes/:quizId", async (req, res) => {
    try {
      const quiz = await dao.findQuizById(req.params.quizId);
      res.json(quiz);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/quizzes/:quizId", async (req, res) => {
    try {
      const updated = await dao.updateQuiz(req.params.quizId, req.body);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/quizzes/:quizId", async (req, res) => {
    try {
      const deleted = await dao.deleteQuiz(req.params.quizId);
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/quizzes/:quizId/publish", async (req, res) => {
    try {
      const updated = await dao.togglePublish(req.params.quizId);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/quizzes/:quizId/submit", async (req, res) => {
    try {
      const { studentId, score, answers } = req.body;
      if (!studentId || score === undefined) {
        return res.status(400).json({ error: "studentId and score are required" });
      }
      const updated = await dao.submitQuizScore(req.params.quizId, studentId, score, answers || {});
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
