import coursesModel from "../models/coursesModel";

// Get all courses
class courseDataServiceProvider {

  async getAllCourses({ query = {}, sort=null, limit=null, select=null, lean = false }) {
    const courses = await coursesModel.find(query).select(select).sort(sort).limit(limit)
    return courses;
  }

  async getCourseById(courseId, selects = {}) {
    const course = await coursesModel.findById(courseId).select(selects);
    return course;
  }

  async createCourse(courseData) {
    const newCourse = await coursesModel.create(courseData);
    return newCourse;
  }

  async updateCourse(courseId, updatedCourseData) {
    const updatedCourse = await coursesModel.findByIdAndUpdate(courseId, updatedCourseData, { new: true });
    return updatedCourse;
  } 
  // new: true - return the updated data

  async deleteCourse(courseId) {
    const deletedCourse = await coursesModel.findByIdAndDelete(courseId);
    return deletedCourse;
  }
}

export default new courseDataServiceProvider();