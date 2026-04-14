const axios = require('axios');
const { Course, UserCourse } = require('../models');
class MoodleIntegrationService {
  constructor() {
    this.baseURL = process.env.MOODLE_BASE_URL || 'https://k4b.et';
    this.token = process.env.MOODLE_API_TOKEN;
  }
  async syncUserCourses(userId) {
    const response = await axios.get(`${this.baseURL}/webservice/rest/server.php`, {
      params: { wstoken: this.token, wsfunction: 'core_enrol_get_users_courses', userid: userId, moodlewsrestformat: 'json' }
    });
    for (const c of response.data) {
      const [course] = await Course.findOrCreate({ where: { moodleCourseId: c.id }, defaults: { fullname: c.fullname, shortname: c.shortname } });
      await UserCourse.upsert({ userId, courseId: course.id, progress: c.progress || 0, lastSync: new Date() });
    }
  }
}
module.exports = new MoodleIntegrationService();
