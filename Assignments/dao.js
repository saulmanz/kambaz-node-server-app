// Kambaz/Assignments/dao.js
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter(a => a.course === courseId);
  }

  function findAssignmentById(assignmentId) {
    return db.assignments.find(a => a._id === assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function updateAssignment(assignmentId, updatedAssignment) {
    db.assignments = db.assignments.map(a =>
      a._id === assignmentId ? { ...a, ...updatedAssignment } : a
    );
    return db.assignments.find(a => a._id === assignmentId);
  }

  function deleteAssignment(assignmentId) {
    const before = db.assignments.length;
    db.assignments = db.assignments.filter(a => a._id !== assignmentId);
    return { deleted: before !== db.assignments.length };
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
}
