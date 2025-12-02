import EnrollmentModel from "./model.js";

export default function EnrollmentsDao() {
  const enrollUserInCourse = (userId, courseId) => {
    return EnrollmentModel.create({ user: userId, course: courseId, _id: `${userId}-${courseId}` });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    return EnrollmentModel.deleteOne({ user: userId, course: courseId });
  };

  const unenrollAllUsersFromCourse = (courseId) => {
    return EnrollmentModel.deleteMany({ course: courseId });
  };

  const findCoursesForUser = async (userId) => {
    const enrollments = await EnrollmentModel.find({ user: userId }).populate("course");
    return enrollments.map(e => e.course);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await EnrollmentModel
      .find({ course: courseId })
      .populate("user");

    return enrollments.map(e => e.user);
  };

  return { enrollUserInCourse, unenrollUserFromCourse, unenrollAllUsersFromCourse, findCoursesForUser, findUsersForCourse };
}
