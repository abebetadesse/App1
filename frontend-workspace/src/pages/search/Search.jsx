import { Day } from "react-feather";
import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Form, Button, Accordion, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    serviceCategory: '',
    minExperience: '',
    maxHourlyRate: '',
    availability: '',
    minProfessionalRank: '',
    skills: [],
    location: '',
    hasCertificates: false
  });
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories and skills
    const fetchSearchData = async () => {
      try {
        // TODO: Replace with actual API calls
        setTimeout(() => {
          setCategories([
            'IT & Software Development',
            'Design & Creative',
            'Writing & Translation',
            'Digital Marketing',
            'Business Consulting',
            'Education & Tutoring'
          ]);
          setSkills([
            'React', 'Node.js', 'JavaScript', 'Python', 'Java',
            'UI/UX Design', 'Graphic Design', 'Content Writing',
            'SEO', 'Social Media Marketing', 'Business Strategy'
          ]);
        }, 500);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };

    fetchSearchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Replace with actual search API call
      console.log('Search filters:', filters);
      
      // Navigate to search results with filters
      navigate('/search/results', { state: { filters } });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      serviceCategory: '',
      minExperience: '',
      maxHourlyRate: '',
      availability: '',
      minProfessionalRank: '',
      skills: [],
      location: '',
      hasCertificates: false
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== false && (!Array.isArray(value) || value.length > 0)
    ).length;
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-primary mb-3">
              Find Perfect Professionals
            </h1>
            <p className="lead text-muted">
              Use our advanced filters to find the right talent for your needs
            </p>
          </div>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Filters Sidebar */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Search Filters</h5>
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="outline-danger" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
                  {/* Basic Filters */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Basic Information</Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Category</Form.Label>
                        <Form.Select
                          value={filters.serviceCategory}
                          onChange={(e) => handleFilterChange('serviceCategory', e.target.value)}
                        >
                          <option value="">Any Category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="City, Country"
                          value={filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Minimum Experience</Form.Label>
                        <Form.Select
                          value={filters.minExperience}
                          onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                        >
                          <option value="">Any Experience</option>
                          <option value="1">1+ years</option>
                          <option value="3">3+ years</option>
                          <option value="5">5+ years</option>
                          <option value="10">10+ years</option>
                        </Form.Select>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Pricing & Availability */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Pricing & Availability</Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Maximum Hourly Rate ($)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="e.g., 100"
                          value={filters.maxHourlyRate}
                          onChange={(e) => handleFilterChange('maxHourlyRate', e.target.value)}
                          min="0"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Select
                          value={filters.availability}
                          onChange={(e) => handleFilterChange('availability', e.target.value)}
                        >
                          <option value="">Any Availability</option>
                          <option value="immediate">Immediately Available</option>
                          <option value="1_week">Within 1 Week</option>
                          <option value="2_weeks">Within 2 Weeks</option>
                          <option value="1_month">Within 1 Month</option>
                        </Form.Select>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Skills & Qualifications */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Skills & Qualifications</Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Skills</Form.Label>
                        <div className="skills-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {skills.map(skill => (
                            <Badge
                              key={skill}
                              bg={filters.skills.includes(skill) ? "primary" : "light"}
                              text={filters.skills.includes(skill) ? "white" : "dark"}
                              className="me-2 mb-2 p-2 cursor-pointer"
                              onClick={() => handleSkillToggle(skill)}
                              style={{ cursor: 'pointer' }}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Minimum Professional Rank</Form.Label>
                        <Form.Select
                          value={filters.minProfessionalRank}
                          onChange={(e) => handleFilterChange('minProfessionalRank', e.target.value)}
                        >
                          <option value="">Any Rank</option>
                          <option value="1">⭐ 1 Star & Up</option>
                          <option value="2">⭐⭐ 2 Stars & Up</option>
                          <option value="3">⭐⭐⭐ 3 Stars & Up</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars & Up</option>
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Has Verified Certificates"
                          checked={filters.hasCertificates}
                          onChange={(e) => handleFilterChange('hasCertificates', e.target.checked)}
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : `Search Professionals (${getActiveFiltersCount()} filters)`}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Search Content */}
          <Col lg={8}>
            {/* Quick Stats */}
            <Row className="mb-4">
              <Col md={4} className="text-center">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h3 className="text-primary">500+</h3>
                    <p className="text-muted mb-0">Active Professionals</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="text-center">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h3 className="text-success">95%</h3>
                    <p className="text-muted mb-0">Success Rate</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="text-center">
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h3 className="text-info">< Day></Day></h3>
                    <p className="text-muted mb-0">Avg. Response Time</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Search Tips */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">💡 Search Tips</h5>
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Be specific with skills:</strong> Use relevant skills for better matches
                  </li>
                  <li className="mb-2">
                    <strong>Consider experience level:</strong> Higher experience often means better quality
                  </li>
                  <li className="mb-2">
                    <strong>Check professional rank:</strong> Our ranking system considers course completion and client feedback
                  </li>
                  <li>
                    <strong>Review availability:</strong> Ensure the professional can start when you need them
                  </li>
                </ul>
              </Card.Body>
            </Card>

            {/* Popular Categories */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">🔥 Popular Categories</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {categories.slice(0, 6).map(category => (
                    <Col md={6} key={category} className="mb-2">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 text-start"
                        onClick={() => handleFilterChange('serviceCategory', category)}
                      >
                        {category}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Search;