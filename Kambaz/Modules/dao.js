import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao() {
  
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    if (!course) throw new Error("Course not found");
    return course.modules || []; // always return array
  }

  async function createModule(module) {
    const course = await model.findById(module.course);
    if (!course) throw new Error("Course not found");
    const newModule = { ...module, _id: uuidv4(), lessons: [] };
    course.modules = [...(course.modules || []), newModule];
    await course.save();
    return newModule;
  }

  async function deleteModule(moduleId) {
    const courses = await model.find({ "modules._id": moduleId });
    if (!courses.length) return { deleted: false };
    const course = courses[0];
    const before = course.modules.length;
    course.modules = course.modules.filter((m) => m._id !== moduleId);
    await course.save();
    const after = course.modules.length;
    return { deleted: before !== after };
  }

  async function updateModule(moduleId, moduleUpdates) {
    const courses = await model.find({ "modules._id": moduleId });
    if (!courses.length) throw new Error("Module not found");
    const course = courses[0];
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = course.modules.find((m) => m._id === moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return { findModulesForCourse, createModule, deleteModule, updateModule };
}
