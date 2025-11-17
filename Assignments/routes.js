// Kambaz/Assignments/routes.js
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.get("/api/courses/:courseId/assignments", (req, res) => {
    res.send(dao.findAssignmentsForCourse(req.params.courseId));
  });

  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const newAssignment = dao.createAssignment({
      ...req.body,
      course: req.params.courseId,
    });
    res.send(newAssignment);
  });

  app.get("/api/assignments/:assignmentId", (req, res) => {
    res.send(dao.findAssignmentById(req.params.assignmentId));
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const updated = dao.updateAssignment(req.params.assignmentId, req.body);
    res.send(updated);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    res.send(dao.deleteAssignment(req.params.assignmentId));
  });
}
