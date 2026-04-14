import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Badge,
  Form,
  Modal,
  Alert
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RankingCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    weight: 0.3,
    formula: '',
    parameters: {},
    isActive: true
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRankingCriteria();
      if (response.success) {
        setCriteria(response.data);
      }
    } catch (error) {
      console.error('Error fetching ranking criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      let response;

      if (editingCriterion) {
        response = await adminAPI.updateRankingCriteria(editingCriterion.id, formData);
      } else {
        response = await adminAPI.createRankingCriteria(formData);
      }

      if (response.success) {
        await fetchCriteria();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving ranking criteria:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (criterion) => {
    setEditingCriterion(criterion);
    setFormData({
      name: criterion.name,
      category: criterion.category,
      weight: criterion.weight,
      formula: criterion.formula || '',
      parameters: criterion.parameters || {},
      isActive: criterion.isActive
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (criterionId, currentStatus) => {
    try {
      setActionLoading(true);
      const response = await adminAPI.updateRankingCriteria(criterionId, {
        isActive: !currentStatus
      });
      if (response.success) {
        await fetchCriteria();
      }
    } catch (error) {
      console.error('Error updating criterion status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (criterionId) => {
    if (window.confirm('Are you sure you want to delete this ranking criterion?')) {
      try {
        setActionLoading(true);
        const response = await adminAPI.deleteRankingCriteria(criterionId);
        if (response.success) {
          await fetchCriteria();
        }
      } catch (error) {
        console.error('Error deleting ranking criterion:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      weight: 0.3,
      formula: '',
      parameters: {},
      isActive: true
    });
    setEditingCriterion(null);
  };

  const getStatusVariant = (isActive) => {
    return isActive ? 'success' : 'secondary';
  };

  const getWeightColor = (weight) => {
    if (weight >= 0.3) return 'danger';
    if (weight >= 0.2) return 'warning';
    if (weight >= 0.1) return 'info';
    return 'secondary';
  };

  const totalWeight = criteria
    .filter(c => c.isActive)
    .reduce((sum, c) => sum + parseFloat(c.weight), 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Ranking Criteria Management</h2>
          <p className="text-muted">
            Configure how profile owners are ranked and scored
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
          >
            Add New Criterion
          </Button>
        </Col>
      </Row>

      {/* Weight Summary */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h6>Weight Distribution</h6>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Total Active Weight:</span>
                <strong className={(totalWeight !== 1) ? 'text-danger' : 'text-success'}>
                  {totalWeight.toFixed(2)} / 1.00
                </strong>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className={`progress-bar ${totalWeight === 1 ? 'bg-success' : 'bg-danger'}`}
                  style={{ width: `${totalWeight * 100}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {totalWeight === 1 
                  ? 'Perfect weight distribution' 
                  : 'Weights should sum to 1.00 for proper scoring'
                }
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Criteria Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Ranking Criteria</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {criteria.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-sliders-h fa-3x text-muted mb-3"></i>
              <h5>No ranking criteria defined</h5>
              <p className="text-muted">
                Create your first ranking criterion to start scoring profile owners
              </p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Criterion
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Weight</th>
                  <th>Formula</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion) => (
                  <tr key={criterion.id}>
                    <td>
                      <div className="fw-semibold">{criterion.name}</div>
                      <small className="text-muted">
                        Created: {new Date(criterion.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{criterion.category}</td>
                    <td>
                      <Badge bg={getWeightColor(criterion.weight)}>
                        {criterion.weight}
                      </Badge>
                    </td>
                    <td>
                      <code className="text-sm">
                        {criterion.formula || 'Default calculation'}
                      </code>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(criterion.isActive)}>
                        {criterion.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(criterion)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={criterion.isActive ? "outline-warning" : "outline-success"}
                          size="sm"
                          onClick={() => handleToggleStatus(criterion.id, criterion.isActive)}
                          disabled={actionLoading}
                        >
                          {criterion.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(criterion.id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCriterion ? 'Edit Ranking Criterion' : 'Add New Ranking Criterion'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Course Completion Rate"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Education, Experience, Performance"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight *</Form.Label>
                  <Form.Range
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                  />
                  <div className="d-flex justify-content-between">
                    <small>0</small>
                    <strong>{formData.weight}</strong>
                    <small>1</small>
                  </div>
                  <Form.Text className="text-muted">
                    Higher weight means this criterion has more impact on the overall score
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    label="Active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Calculation Formula</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.formula}
                onChange={(e) => setFormData(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="Optional: Custom JavaScript formula for calculation. Use 'profile' variable to access profile data."
              />
              <Form.Text className="text-muted">
                Leave empty for default calculation based on criterion name
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parameters (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={JSON.stringify(formData.parameters, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData(prev => ({ 
                      ...prev, 
                      parameters: JSON.parse(e.target.value) 
                    }));
                  } catch (error) {
                    // Invalid JSON, keep previous value
                  }
                }}
                placeholder='{"maxExperience": 20, "maxCertifications": 10}'
              />
              <Form.Text className="text-muted">
                Additional parameters for the calculation in JSON format
              </Form.Text>
            </Form.Group>

            {totalWeight + (editingCriterion ? 0 : formData.weight) > 1 && (
              <Alert variant="warning">
                <strong>Warning:</strong> Total weight will exceed 1.00. 
                This may lead to incorrect scoring.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => { setShowModal(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : (editingCriterion ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default RankingCriteria;