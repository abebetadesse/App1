import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Tab, Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const ProfileEdit = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    
    // Professional Information
    serviceCategory: '',
    subcategories: [],
    experienceYears: '',
    hourlyRate: '',
    dailyRate: '',
    
    // Skills & Bio
    skills: [],
    bio: '',
    
    // Availability
    availability: 'immediate',
    isAvailable: true,
    
    // Location
    location: '',
    
    // Documents
    resume: null,
    certificates: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const serviceCategories = [
    'IT & Software Development',
    'Design & Creative',
    'Writing & Translation',
    'Digital Marketing',
    'Business Consulting',
    'Education & Tutoring',
    'Engineering & Architecture',
    'Legal Services',
    'Other'
  ];

  const availabilityOptions = [
    { value: 'immediate', label: 'Immediately Available' },
    { value: '1_week', label: 'Available within 1 week' },
    { value: '2_weeks', label: 'Available within 2 weeks' },
    { value: '1_month', label: 'Available within 1 month' }
  ];

  useEffect(() => {
    // Load existing profile data
    if (user?.profileOwner) {
      setFormData(prev => ({
        ...prev,
        firstName: user.profileOwner.firstName || '',
        lastName: user.profileOwner.lastName || '',
        email: user.email || '',
        phoneNumber: user.profileOwner.phoneNumber || '',
        serviceCategory: user.profileOwner.serviceCategory || '',
        experienceYears: user.profileOwner.experienceYears || '',
        hourlyRate: user.profileOwner.hourlyRate || '',
        skills: user.profileOwner.skills || [],
        bio: user.profileOwner.bio || '',
        availability: user.profileOwner.availability || 'immediate',
        isAvailable: user.profileOwner.isAvailable !== false,
        location: user.profileOwner.location || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // TODO: Replace with actual API call
      console.log('Updating profile:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    const fields = [
      formData.firstName, formData.lastName, formData.email, formData.phoneNumber,
      formData.serviceCategory, formData.experienceYears, formData.hourlyRate,
      formData.skills.length > 0, formData.bio, formData.location
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Edit Profile</h1>
              <p className="text-muted mb-0">Complete your profile to increase visibility</p>
            </div>
            <div className="text-end">
              <div className="mb-1">
                <small className="text-muted">Profile Completion</small>
              </div>
              <ProgressBar now={completionPercentage} style={{ width: '200px' }} />
              <small className="text-muted">{completionPercentage}%</small>
            </div>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Profile updated successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link eventKey="personal">Personal Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="professional">Professional Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="skills">Skills & Bio</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="availability">Availability</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="documents">Documents</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                {/* Personal Information Tab */}
                <Tab.Pane eventKey="personal">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                    />
                  </Form.Group>
                </Tab.Pane>

                {/* Professional Information Tab */}
                <Tab.Pane eventKey="professional">
                  <Form.Group className="mb-3">
                    <Form.Label>Service Category *</Form.Label>
                    <Form.Select
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Years of Experience *</Form.Label>
                        <Form.Control
                          type="number"
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                          required
                          min="0"
                          max="50"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hourly Rate ($) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Daily Rate ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Tab.Pane>

                {/* Skills & Bio Tab */}
                <Tab.Pane eventKey="skills">
                  <Form.Group className="mb-3">
                    <Form.Label>Skills *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="skills"
                      value={formData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      placeholder="Enter your skills separated by commas (e.g., React, Node.js, JavaScript)"
                      required
                    />
                    <Form.Text className="text-muted">
                      Separate multiple skills with commas
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Professional Bio *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about your professional background, experience, and what makes you unique..."
                      required
                    />
                    <Form.Text className="text-muted">
                      Minimum 100 characters recommended
                    </Form.Text>
                  </Form.Group>
                </Tab.Pane>

                {/* Availability Tab */}
                <Tab.Pane eventKey="availability">
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="isAvailable"
                      label="I am currently available for new projects"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>When can you start new projects?</Form.Label>
                    {availabilityOptions.map(option => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        name="availability"
                        label={option.label}
                        value={option.value}
                        checked={formData.availability === option.value}
                        onChange={handleInputChange}
                      />
                    ))}
                  </Form.Group>
                </Tab.Pane>

                {/* Documents Tab */}
                <Tab.Pane eventKey="documents">
                  <Form.Group className="mb-3">
                    <Form.Label>Resume/CV</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        resume: e.target.files[0]
                      }))}
                    />
                    <Form.Text className="text-muted">
                      Upload your resume (PDF, DOC, DOCX)
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Certificates & Diplomas</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        certificates: [...prev.certificates, ...Array.from(e.target.files)]
                      }))}
                    />
                    <Form.Text className="text-muted">
                      Upload your certificates and diplomas
                    </Form.Text>
                  </Form.Group>
                  
                  {formData.certificates.length > 0 && (
                    <div className="mb-3">
                      <h6>Uploaded Files:</h6>
                      <ul>
                        {formData.certificates.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <div className="d-flex justify-content-between">
                <Button 
                  variant="outline-secondary"
                  disabled={activeTab === 'personal'}
                  onClick={() => {
                    const tabs = ['personal', 'professional', 'skills', 'availability', 'documents'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
                
                <div>
                  {activeTab !== 'documents' ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        const tabs = ['personal', 'professional', 'skills', 'availability', 'documents'];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Tab.Container>
      </Form>
    </Container>
  );
};

export default ProfileEdit;