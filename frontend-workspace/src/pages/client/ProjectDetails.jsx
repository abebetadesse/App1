import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  ProgressBar,
  Tab,
  Nav,
  Alert
} from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from './clientAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getProjectDetails(projectId);
      if (response.success) {
        setProject(response.data);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await clientAPI.updateProjectStatus(projectId, newStatus);
      if (response.success) {
        setProject(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <Container>
        <Alert variant="danger">
          Project not found. <Link to="/projects">Return to projects</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>{project.title}</h2>
              <p className="text-muted mb-0">{project.description}</p>
            </div>
            <Badge bg={getStatusVariant(project.status)} className="fs-6">
              {project.status.toUpperCase()}
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Project Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <ProgressBar 
                now={project.progress || 0} 
                variant={project.progress === 100 ? 'success' : 'primary'}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="milestones">Milestones</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="documents">Documents</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="communications">Communications</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'overview'}>
                  <h5>Project Details</h5>
                  <Row className="mb-3">
                    <Col sm={6}>
                      <strong>Budget:</strong> ${project.budget}
                    </Col>
                    <Col sm={6}>
                      <strong>Timeline:</strong> {project.timeline} days
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={6}>
                      <strong>Start Date:</strong>{' '}
                      {new Date(project.startDate).toLocaleDateString()}
                    </Col>
                    <Col sm={6}>
                      <strong>Expected Completion:</strong>{' '}
                      {new Date(project.expectedCompletion).toLocaleDateString()}
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <strong>Requirements:</strong>
                    <p className="mt-2">{project.requirements}</p>
                  </div>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'milestones'}>
                  <h5>Project Milestones</h5>
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((milestone, index) => (
                      <Card key={index} className="mb-2">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{milestone.title}</h6>
                              <p className="mb-1 text-muted">{milestone.description}</p>
                              <small className="text-muted">
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </small>
                            </div>
                            <Badge bg={milestone.completed ? 'success' : 'secondary'}>
                              {milestone.completed ? 'Completed' : 'Pending'}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted">No milestones defined for this project.</p>
                  )}
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'documents'}>
                  <h5>Project Documents</h5>
                  {/* Documents list would go here */}
                  <p className="text-muted">No documents uploaded yet.</p>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'communications'}>
                  <h5>Project Communications</h5>
                  {/* Communications/messages would go here */}
                  <p className="text-muted">No messages yet.</p>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Assigned Profile Owner Card */}
          {project.assignedProfileOwner && (
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Assigned Professional</h6>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <img
                    src={project.assignedProfileOwner.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    width="80"
                    height="80"
                  />
                  <h6>{project.assignedProfileOwner.name}</h6>
                  <p className="text-muted mb-2">
                    {project.assignedProfileOwner.serviceCategory}
                  </p>
                  <Badge bg="primary" className="mb-3">
                    Rank: {project.assignedProfileOwner.professionalRank}/5
                  </Badge>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm">
                      Send Message
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Actions Card */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">Project Actions</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {project.status === 'active' && (
                  <>
                    <Button variant="outline-success" size="sm">
                      Request Update
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleStatusUpdate('completed')}
                    >
                      Mark as Completed
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleStatusUpdate('cancelled')}
                    >
                      Cancel Project
                    </Button>
                  </>
                )}
                <Button as={Link} to="/projects" variant="outline-secondary" size="sm">
                  Back to Projects
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetails;