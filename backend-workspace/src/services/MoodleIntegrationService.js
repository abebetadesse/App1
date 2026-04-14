// backend/src/services/MoodleIntegrationService.js
import axios from 'axios';

class MoodleIntegrationService {
  constructor() {
    this.moodleBaseUrl = process.env.MOODLE_BASE_URL || 'https://k4b.et';
    this.apiToken = process.env.MOODLE_API_TOKEN;
    this.client = axios.create({
      baseURL: `${this.moodleBaseUrl}/webservice/rest/server.php`,
      timeout: 30000,
    });
  }

  async linkUserAccount(userId, moodleCredentials) {
    try {
      // Verify Moodle credentials
      const isValid = await this.verifyMoodleCredentials(
        moodleCredentials.username,
        moodleCredentials.password
      );
      
      if (!isValid) {
        throw new Error('Invalid Moodle credentials');
      }
      
      // Get Moodle user ID
      const moodleUser = await this.getMoodleUser(moodleCredentials.username);
      
      return {
        success: true,
        moodleUserId: moodleUser.id,
        moodleUsername: moodleCredentials.username
      };
    } catch (error) {
      console.error('Error linking Moodle account:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyMoodleCredentials(username, password) {
    try {
      const response = await this.client.post('', null, {
        params: {
          wstoken: this.apiToken,
          wsfunction: 'core_auth_confirm_user',
          moodlewsrestformat: 'json',
          username: username,
          password: password
        }
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Moodle credential verification failed:', error);
      return false;
    }
  }

  async getMoodleUser(username) {
    try {
      const response = await this.client.post('', null, {
        params: {
          wstoken: this.apiToken,
          wsfunction: 'core_user_get_users',
          moodlewsrestformat: 'json',
          'criteria[0][key]': 'username',
          'criteria[0][value]': username
        }
      });
      
      if (!response.data.users || response.data.users.length === 0) {
        throw new Error('Moodle user not found');
      }
      
      return response.data.users[0];
    } catch (error) {
      console.error('Error fetching Moodle user:', error);
      throw new Error('Failed to fetch Moodle user information');
    }
  }

  async getUserEnrolledCourses(moodleUserId) {
    try {
      const response = await this.client.post('', null, {
        params: {
          wstoken: this.apiToken,
          wsfunction: 'core_enrol_get_users_courses',
          moodlewsrestformat: 'json',
          userid: moodleUserId
        }
      });
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user courses:', error);
      return [];
    }
  }

  async getCourseCatalog() {
    try {
      const response = await this.client.post('', null, {
        params: {
          wstoken: this.apiToken,
          wsfunction: 'core_course_get_courses',
          moodlewsrestformat: 'json'
        }
      });
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching course catalog:', error);
      return [];
    }
  }

  async syncUserCourses(profileOwnerId, moodleUserId) {
    try {
      const enrolledCourses = await this.getUserEnrolledCourses(moodleUserId);
      
      // Process and return course data
      const courseData = enrolledCourses.map(course => ({
        moodleCourseId: course.id,
        courseName: course.fullname,
        progress: course.progress || 0,
        completed: course.completed || false,
        grade: course.grade || null
      }));
      
      return {
        success: true,
        courses: courseData,
        totalCourses: courseData.length
      };
    } catch (error) {
      console.error('Error syncing user courses:', error);
      return {
        success: false,
        error: error.message,
        courses: []
      };
    }
  }
}

export default MoodleIntegrationService;