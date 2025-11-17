import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  if (!db.enrollments) db.enrollments = [];

  const enrollUserInCourse = (userId, courseId) => {
    const existing = db.enrollments.find(e => e.user === userId && e.course === courseId);
    if (existing) return existing;

    const enrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments.push(enrollment);
    return enrollment;
  };

  const unenrollUser = (enrollmentId) => {
    const before = db.enrollments.length;
    db.enrollments = db.enrollments.filter(e => e._id !== enrollmentId);
    return before !== db.enrollments.length;
  };

  const findEnrollmentsByUser = (userId) => {
    return db.enrollments.filter(e => e.user === userId);
  };

  return {
    enrollUserInCourse,
    unenrollUser,
    findEnrollmentsByUser
  };
}
