import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app) {
  const dao = ModulesDao();

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await dao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const { courseId } = req.params;
      const moduleData = { ...req.body, course: courseId };
      const newModule = await dao.createModule(moduleData);
      res.json(newModule);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const updatedModule = await dao.updateModule(moduleId, req.body);
      res.json(updatedModule);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const result = await dao.deleteModule(moduleId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
