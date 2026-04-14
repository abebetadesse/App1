import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { 
  Save, 
  DollarSign, 
  Calendar,
  Briefcase,
  ArrowLeft
} from 'react-feather';

const ProjectPosting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: '',
    budgetType: 'fixed', // fixed or hourly
    timeline: '',
    urgency: 'normal', // low, normal, high, urgent
    experienceLevel: 'intermediate', // beginner, intermediate, expert
    attachments: []
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await projectService.createProject(projectData);
      setSuccess('Project posted successfully!');
      setTimeout(() => {
        navigate('/client/projects');
      }, 2000);
    } catch (err) {
      setError('Failed to post project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !projectData.skills.includes(newSkill.trim())) {
      setProjectData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProjectData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => navigate('/client/dashboard')}
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="h3 mb-1">Post a New Project</h1>
              <p className="text-muted">Find the right professionals for your project</p>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {success && (
        <Alert variant="success">{success}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Project Details</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Website Development for E-commerce Store"
                    value={projectData.title}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Project Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Describe your project in detail. Include goals, requirements, and any specific technologies or frameworks needed."
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    required
                  />
                  <Form.Text className="text-muted">
                    Be specific about your requirements to attract the right professionals.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={projectData.category}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="writing-translation">Writing & Translation</option>
                    <option value="business">Business & Consulting</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Required Skills</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Add required skills (e.g., React, Node.js, UI/UX)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button variant="outline-primary" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Press Enter or click Add to include skills
                  </Form.Text>
                  
                  {projectData.skills.length > 0 && (
                    <div className="mt-2">
                      {projectData.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-2">
                          {skill}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-1"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Budget & Timeline</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Budget Type</Form.Label>
                      <Form.Select
                        value={projectData.budgetType}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          budgetType: e.target.value
                        }))}
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="hourly">Hourly Rate</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {projectData.budgetType === 'fixed' ? 'Project Budget' : 'Hourly Rate'} *
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <DollarSign size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          placeholder={projectData.budgetType === 'fixed' ? 'e.g., 5000' : 'e.g., 50'}
                          value={projectData.budget}
                          onChange={(e) => setProjectData(prev => ({
                            ...prev,
                            budget: e.target.value
                          }))}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Timeline</Form.Label>
                      <Form.Select
                        value={projectData.timeline}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          timeline: e.target.value
                        }))}
                      >
                        <option value="">Select timeline</option>
                        <option value="1_week">1 Week</option>
                        <option value="2_weeks">2 Weeks</option>
                        <option value="1_month">1 Month</option>
                        <option value="2_months">2 Months</option>
                        <option value="3_months">3+ Months</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Urgency</Form.Label>
                      <Form.Select
                        value={projectData.urgency}
                        onChange={(e) => setProjectData(prev => ({
                          ...prev,
                          urgency: e.target.value
                        }))}
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Experience Level</Form.Label>
                  <Form.Select
                    value={projectData.experienceLevel}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      experienceLevel: e.target.value
                    }))}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '100px' }}>
              <Card.Header>
                <h5 className="mb-0">Project Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>Category:</strong>
                  <div className="text-muted">
                    {projectData.category ? 
                      projectData.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ') 
                      : 'Not selected'
                    }
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Budget:</strong>
                  <div className="text-muted">
                    {projectData.budget ? 
                      `$${projectData.budget} (${projectData.budgetType})` 
                      : 'Not set'
                    }
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Timeline:</strong>
                  <div className="text-muted">
                    {projectData.timeline ? 
                      projectData.timeline.replace('_', ' ') 
                      : 'Not set'
                    }
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Experience Level:</strong>
                  <div className="text-muted text-capitalize">
                    {projectData.experienceLevel}
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Required Skills:</strong>
                  <div className="text-muted">
                    {projectData.skills.length > 0 ? 
                      projectData.skills.join(', ') 
                      : 'No skills added'
                    }
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={loading}
                >
                  <Save size={16} className="me-2" />
                  {loading ? 'Posting Project...' : 'Post Project'}
                </Button>
                <Form.Text className="text-muted text-center d-block mt-2">
                  Your project will be visible to qualified professionals
                </Form.Text>
              </Card.Footer>
            </Card>

            {/* Tips Card */}
            <Card className="mt-4">
              <Card.Header>
                <h6 className="mb-0">
                  <Briefcase size={16} className="me-2" />
                  Tips for Success
                </h6>
              </Card.Header>
              <Card.Body>
                <ul className="small text-muted mb-0">
                  <li>Be specific about your project requirements</li>
                  <li>Include your budget range</li>
                  <li>Set realistic timelines</li>
                  <li>Mention required skills and experience</li>
                  <li>Provide clear contact information</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProjectPosting;
