import { Container, Row, Col, Card, Button, Badge, Spinner, Pagination } from "react-bootstrap";
import React from "react";
/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SearchResults = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filters = location.state?.filters || {};
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        setTimeout(() => {
          const mockResults = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Professional ${i + 1}`,
            serviceCategory: filters.serviceCategory || 'Web Development',
            experienceYears: Math.floor(Math.random() * 10) + 1,
            hourlyRate: Math.floor(Math.random() * 100) + 20,
            professionalRank: Math.floor(Math.random() * 5) + 1,
            rankingScore: Math.floor(Math.random() * 40) + 60,
            skills: ['React', 'Node.js', 'JavaScript'].slice(0, Math.floor(Math.random() * 3) + 1),
            availability: ['immediate', '1_week', '2_weeks', '1_month'][Math.floor(Math.random() * 4)],
            location: 'Addis Ababa, Ethiopia',
            matchScore: Math.floor(Math.random() * 30) + 70,
            isAvailable: Math.random() > 0.2,
            profileCompletion: Math.floor(Math.random() * 40) + 60
          }));

          // Filter results based on filters (simulated)
          let filteredResults = mockResults;
          
          if (filters.minExperience) {
            filteredResults = filteredResults.filter(r => r.experienceYears >= parseInt(filters.minExperience));
          }
          
          if (filters.maxHourlyRate) {
            filteredResults = filteredResults.filter(r => r.hourlyRate <= parseInt(filters.maxHourlyRate));
          }
          
          if (filters.availability) {
            filteredResults = filteredResults.filter(r => r.availability === filters.availability);
          }
          
          if (filters.minProfessionalRank) {
            filteredResults = filteredResults.filter(r => r.professionalRank >= parseInt(filters.minProfessionalRank));
          }
          
          if (filters.skills && filters.skills.length > 0) {
            filteredResults = filteredResults.filter(r => 
              filters.skills.some(skill => r.skills.includes(skill))
            );
          }

          setResults(filteredResults);
          setTotalPages(Math.ceil(filteredResults.length / resultsPerPage));
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [filters]);

  const handleConnect = async (profileId) => {
    try {
      // TODO: Replace with actual API call
      console.log('Connecting with profile:', profileId);
      
      // For demo purposes, show success message
      alert('Connection request sent! The professional will be notified.');
    } catch (error) {
      console.error('Error creating connection:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const getCurrentResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return results.slice(startIndex, endIndex);
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'immediate': return 'Immediately Available';
      case '1_week': return 'Available within 1 week';
      case '2_weeks': return 'Available within 2 weeks';
      case '1_month': return 'Available within 1 month';
      default: return availability;
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Searching for professionals...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Search Results</h1>
              <p className="text-muted mb-0">
                Found {results.length} professionals matching your criteria
              </p>
            </div>
            <Button variant="outline-primary" onClick={() => navigate('/search')}>
              Modify Search
            </Button>
          </div>
        </Col>
      </Row>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 bg-light">
              <Card.Body className="py-3">
                <div className="d-flex align-items-center">
                  <strong className="me-3">Active Filters:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {filters.serviceCategory && (
                      <Badge bg="primary">Category: {filters.serviceCategory}</Badge>
                    )}
                    {filters.minExperience && (
                      <Badge bg="info">Min Experience: {filters.minExperience} years</Badge>
                    )}
                    {filters.maxHourlyRate && (
                      <Badge bg="warning">Max Rate: ${filters.maxHourlyRate}/hr</Badge>
                    )}
                    {filters.availability && (
                      <Badge bg="success">Availability: {getAvailabilityText(filters.availability)}</Badge>
                    )}
                    {filters.minProfessionalRank && (
                      <Badge bg="secondary">Min Rank: {filters.minProfessionalRank} stars</Badge>
                    )}
                    {filters.skills && filters.skills.length > 0 && (
                      <Badge bg="dark">Skills: {filters.skills.length} selected</Badge>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <>
          <Row>
            {getCurrentResults().map((profile) => (
              <Col key={profile.id} lg={6} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <Row className="align-items-start">
                      <Col xs="auto">
                        <div className="profile-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center">
                          <span className="text-white fw-bold">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="mb-1">{profile.name}</h5>
                            <p className="text-muted mb-1">{profile.serviceCategory}</p>
                          </div>
                          <Badge bg={profile.isAvailable ? "success" : "secondary"}>
                            {profile.isAvailable ? "Available" : "Busy"}
                          </Badge>
                        </div>
                        
                        <div className="mb-2">
                          <Badge bg="primary" className="me-1">
                            Rank {profile.professionalRank} ⭐
                          </Badge>
                          <Badge bg="info" className="me-1">
                            {profile.experienceYears} years
                          </Badge>
                          <Badge bg="success">
                            ${profile.hourlyRate}/hr
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">
                            <strong>Skills:</strong> {profile.skills.join(', ')}
                          </small>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">
                            <strong>Availability:</strong> {getAvailabilityText(profile.availability)}
                          </small>
                          <br />
                          <small className="text-muted">
                            <strong>Location:</strong> {profile.location}
                          </small>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">
                              Match Score: <strong>{profile.matchScore}%</strong>
                            </small>
                            <div className="progress" style={{ width: '100px', height: '6px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ width: `${profile.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleConnect(profile.id)}
                            disabled={!profile.isAvailable}
                          >
                            Connect
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              </Col>
            </Row>
          )}
        </>
      ) : (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-search fs-1"></i>
                </div>
                <h4>No professionals found</h4>
                <p className="text-muted mb-4">
                  Try adjusting your search criteria or browse different categories.
                </p>
                <Button variant="primary" onClick={() => navigate('/search')}>
                  Modify Search
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default SearchResults;