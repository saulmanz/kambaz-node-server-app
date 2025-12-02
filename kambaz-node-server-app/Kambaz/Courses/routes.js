import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const coursesDao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  app.post("/api/users/current/courses", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.status(401).json({ message: "Must be signed in" });

    try {
      const newCourse = await coursesDao.createCourse(req.body);
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.json(newCourse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create course", error: err.message });
    }
  });

  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await coursesDao.findAllCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/users/:userId/courses", async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.status(401).json({ message: "Must be signed in" });
      userId = currentUser._id;
    }

    try {
      const courses = await coursesDao.findCoursesForUser(userId, enrollmentsDao);
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    try {
      const status = await coursesDao.updateCourse(req.params.courseId, req.body);
      res.json(status);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/courses/:courseId", async (req, res) => {
    try {
      await enrollmentsDao.unenrollAllUsersFromCourse(req.params.courseId);
      const status = await coursesDao.deleteCourse(req.params.courseId);
      res.json(status);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

    const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  app.get("/api/courses/:cid/users", findUsersForCourse);
}
