import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Table,
  Form,
  InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from '../../services/clientService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Projects</h2>
          <p className="text-muted">Manage your projects and track progress</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/projects/create" variant="primary">
            Create New Project
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Form.Select style={{ width: 'auto' }} className="d-inline-block">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
      </Row>

      {filteredProjects.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h5>No projects found</h5>
            <p className="text-muted">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
            </p>
            <Button as={Link} to="/projects/create" variant="primary">
              Create Project
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredProjects.map((project) => (
            <Col key={project.id} lg={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg={getStatusVariant(project.status)}>
                    {project.status.toUpperCase()}
                  </Badge>
                  <small className="text-muted">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </small>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {project.description.length > 150 
                      ? `${project.description.substring(0, 150)}...`
                      : project.description
                    }
                  </Card.Text>
                  
                  <div className="mb-3">
                    <strong>Budget:</strong> ${project.budget} •{' '}
                    <strong>Timeline:</strong> {project.timeline} days
                  </div>

                  {project.assignedProfileOwner && (
                    <div className="mb-3">
                      <strong>Assigned To:</strong>{' '}
                      {project.assignedProfileOwner.name}
                    </div>
                  )}

                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${project.progress || 0}%` }}
                      aria-valuenow={project.progress || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted">
                    Progress: {project.progress || 0}%
                  </small>
                </Card.Body>
                <Card.Footer>
                  <Button
                    as={Link}
                    to={`/projects/${project.id}`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    View Details
                  </Button>
                  {project.status === 'active' && (
                    <Button variant="outline-secondary" size="sm">
                      Update
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyProjects;