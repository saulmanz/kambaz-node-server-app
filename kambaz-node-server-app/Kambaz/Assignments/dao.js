import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {

  const findAssignmentsForCourse = (courseId) => {
    return model.find({ course: courseId });
  };

  const findAssignmentById = (assignmentId) => {
    return model.findById(assignmentId);
  };

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const updateAssignment = (assignmentId, updatedAssignment) => {
    return model.findByIdAndUpdate(
      assignmentId,
      { $set: updatedAssignment },
      { new: true }
    );
  };

  const deleteAssignment = (assignmentId) => {
    return model.findByIdAndDelete(assignmentId);
  };

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
}
