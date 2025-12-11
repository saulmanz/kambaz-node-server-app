// Kambaz/Assignments/routes.js
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
      res.json(assignments);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const assignment = await dao.createAssignment({
        ...req.body,
        course: req.params.courseId,
      });
      res.json(assignment);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const assignment = await dao.findAssignmentById(req.params.assignmentId);
      res.json(assignment);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const updated = await dao.updateAssignment(req.params.assignmentId, req.body);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const deleted = await dao.deleteAssignment(req.params.assignmentId);
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
