import { v4 as uuidv4 } from "uuid";
import CourseModel from "./model.js";

export default function CoursesDao() {
  const findAllCourses = () => CourseModel.find({}, { name: 1, description: 1 });

  const findCoursesForUser = async (userId, enrollmentsModel) => {
    const enrollments = await enrollmentsModel.find({ user: userId }).populate("course");
    return enrollments.map(e => e.course);
  };

  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return CourseModel.create(newCourse);
  };

  const deleteCourse = (courseId) => CourseModel.deleteOne({ _id: courseId });

  const updateCourse = (courseId, updates) => CourseModel.updateOne({ _id: courseId }, { $set: updates });

  return { findAllCourses, findCoursesForUser, createCourse, deleteCourse, updateCourse };
}
