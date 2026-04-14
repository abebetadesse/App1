import React from "react";
/* eslint-disable no-unused-vars */
import { useNotification } from '../../contexts/NotificationContext';

const AdminRanking = () => {
  const [criteria, setCriteria] = useState([
    {
      id: 1,
      name: 'Course Completion Rate',
      category: 'Education',
      weight: 0.3,
      isActive: true
    },
    {
      id: 2,
      name: 'Course Grades',
      category: 'Education',
      weight: 0.2,
      isActive: true
    },
    {
      id: 3,
      name: 'Experience Level',
      category: 'Professional',
      weight: 0.2,
      isActive: true
    },
    {
      id: 4,
      name: 'Certification Count',
      category: 'Professional',
      weight: 0.15,
      isActive: true
    },
    {
      id: 5,
      name: 'Connection Success Rate',
      category: 'Performance',
      weight: 0.15,
      isActive: true
    }
  ]);
  const { addNotification } = useNotification();

  const handleWeightChange = (id, newWeight) => {
    setCriteria(prev => prev.map(item => 
      item.id === id ? { ...item, weight: newWeight } : item
    ));
  };

  const handleToggleActive = (id) => {
    setCriteria(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const totalWeight = criteria.reduce((sum, item) => sum + (item.isActive ? item.weight : 0), 0);

  const saveChanges = () => {
    addNotification('success', 'Ranking criteria updated successfully!');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Ranking Criteria Management
              </h4>
              <p className="text-muted mb-0">
                Configure how professionals are ranked on the platform
              </p>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Total weight distribution: <strong>{totalWeight.toFixed(2)}</strong> 
                {totalWeight !== 1 && (
                  <span className="text-danger ms-2">
                    (Should total 1.00 for proper ranking calculation)
                  </span>
                )}
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Criteria Name</th>
                      <th>Category</th>
                      <th>Weight</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map(item => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{item.category}</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="0"
                            max="1"
                            step="0.05"
                            value={item.weight}
                            onChange={(e) => handleWeightChange(item.id, parseFloat(e.target.value))}
                            disabled={!item.isActive}
                          />
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={item.isActive}
                              onChange={() => handleToggleActive(item.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-info">
                              <i className="bi bi-graph-up"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reset to Defaults
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={saveChanges}
                      disabled={totalWeight !== 1}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRanking;