import React from "react";
/* eslint-disable no-unused-vars */
import { useNotification } from '../../contexts/NotificationContext';

const ProfileOwnerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses([
          {
            id: 1,
            name: 'Advanced Web Development',
            category: 'IT & Software Development',
            progress: 75,
            status: 'in_progress',
            grade: null,
            enrollmentDate: '2024-01-15'
          },
          {
            id: 2,
            name: 'Professional Communication Skills',
            category: 'Business & Consulting',
            progress: 100,
            status: 'completed',
            grade: 92,
            completionDate: '2024-02-20'
          },
          {
            id: 3,
            name: 'Project Management Fundamentals',
            category: 'Business & Consulting',
            progress: 0,
            status: 'enrolled',
            grade: null,
            enrollmentDate: '2024-03-01'
          }
        ]);
      } catch (error) {
        addNotification('error', 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [addNotification]);

  const handleSyncCourses = async () => {
    setSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addNotification('success', 'Courses synced successfully from Moodle!');
    } catch (error) {
      addNotification('error', 'Failed to sync courses');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      enrolled: { class: 'bg-secondary', text: 'Enrolled' },
      in_progress: { class: 'bg-warning', text: 'In Progress' },
      completed: { class: 'bg-success', text: 'Completed' }
    };
    const config = statusConfig[status] || statusConfig.enrolled;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h4 className="card-title mb-0">
                  <i className="bi bi-book me-2"></i>
                  My Courses
                </h4>
                <p className="text-muted mb-0">
                  Track your professional development and course progress
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleSyncCourses}
                  disabled={syncing}
                >
                  {syncing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Sync from Moodle
                    </>
                  )}
                </button>
                <a 
                  href="https://k4b.et" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="bi bi-mortarboard me-2"></i>
                  Browse Courses
                </a>
              </div>
            </div>
            <div className="card-body">
              {courses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-book display-1 text-muted"></i>
                  <h4 className="mt-3 text-muted">No Courses Yet</h4>
                  <p className="text-muted">
                    You haven't enrolled in any courses yet. Start your professional development journey!
                  </p>
                  <a 
                    href="https://k4b.et" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Explore Moodle Courses
                  </a>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th>Category</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Grade</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td>
                            <strong>{course.name}</strong>
                          </td>
                          <td>{course.category}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <small>{course.progress}%</small>
                            </div>
                          </td>
                          <td>{getStatusBadge(course.status)}</td>
                          <td>
                            {course.grade ? (
                              <span className="badge bg-info">{course.grade}%</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-eye"></i>
                              </button>
                              {course.status !== 'completed' && (
                                <button className="btn btn-outline-success">
                                  <i className="bi bi-play-circle"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwnerCourses;