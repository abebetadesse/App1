import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import AdvancedFilters from "../../components/search/AdvancedFilters";

// Mock profile owners database
const mockProfiles = [
  { id: 1, name: 'Alice Johnson', category: 'Web Development', experience: 5, hourlyRate: 75, skills: ['React', 'Node'], ranking: 92, location: 'Remote', bio: 'Expert React developer' },
  { id: 2, name: 'Bob Smith', category: 'AI/ML', experience: 8, hourlyRate: 120, skills: ['Python', 'TensorFlow'], ranking: 95, location: 'New York', bio: 'AI specialist' },
  { id: 3, name: 'Carol White', category: 'Design', experience: 4, hourlyRate: 60, skills: ['Figma', 'UI'], ranking: 88, location: 'London', bio: 'Creative designer' }
];

const IntelligentSearch = forwardRef((props, ref) {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ category: '', minExp: '', maxRate: '', keyword: '' });
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Matching algorithm: calculates score based on filters and ranking
  const calculateMatchScore = (profile, filters) => {
    let score = profile.ranking / 100;
    if (filters.category && profile.category !== filters.category) score *= 0.5;
    if (filters.minExp && profile.experience < parseInt(filters.minExp)) score *= 0.7;
    if (filters.maxRate && profile.hourlyRate > parseInt(filters.maxRate)) score *= 0.8;
    if (filters.keyword && !profile.skills.some(s => s.toLowerCase().includes(filters.keyword.toLowerCase()))) score *= 0.6;
    return Math.round(score * 100);
  };

  const handleSearch = () => {
    const scored = mockProfiles.map(p => ({ ...p, matchScore: calculateMatchScore(p, filters) }));
    const sorted = scored.sort((a,b) => b.matchScore - a.matchScore);
    setResults(sorted.slice(0, 10)); // Top 10 matches
    setRecommendations(sorted.slice(0, 3));
  };

  useEffect(() => { handleSearch(); }, []);

  return (
    <Container className="py-4">
      <h1>Intelligent Search</h1>
      <AdvancedFilters onFilter={(f) => console.log(f)} />
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}><Form.Select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}><option value="">All Categories</option><option>Web Development</option><option>AI/ML</option><option>Design</option></Form.Select></Col>
            <Col md={3}><Form.Control type="number" placeholder="Min Experience (years)" value={filters.minExp} onChange={e => setFilters({...filters, minExp: e.target.value})} /></Col>
            <Col md={3}><Form.Control type="number" placeholder="Max Hourly Rate ($)" value={filters.maxRate} onChange={e => setFilters({...filters, maxRate: e.target.value})} /></Col>
            <Col md={3}><Form.Control placeholder="Keyword (skill)" value={filters.keyword} onChange={e => setFilters({...filters, keyword: e.target.value})} /></Col>
          </Row>
          <Button className="mt-3" onClick={handleSearch}>Search</Button>
        </Card.Body>
      </Card>

      {recommendations.length > 0 && (
        <div className="mb-4">
          <h4>🎯 Top Recommendations for You</h4>
          <Row>{recommendations.map(p => (
            <Col md={4} key={p.id}><Card><Card.Body><Card.Title>{p.name}</Card.Title><Badge bg="success">Match {p.matchScore}%</Badge><p>{p.category} • ${p.hourlyRate}/hr • ⭐{p.ranking}</p><Button size="sm" variant="primary">Connect</Button></Card.Body></Card></Col>
          ))}</Row>
        </div>
      )}

      <h4>Search Results (Top 10)</h4>
      <Row>{results.map(p => (
        <Col md={6} key={p.id} className="mb-3"><Card><Card.Body><div className="d-flex justify-content-between"><div><h5>{p.name}</h5><p>{p.category} • {p.experience} yrs • ${p.hourlyRate}/hr</p><small>{p.bio}</small></div><div><Badge bg="info">Match: {p.matchScore}%</Badge><Button size="sm" className="mt-2" variant="success">Connect</Button></div></div></Card.Body></Card></Col>
      ))}</Row>
    </Container>
  );
}
IntelligentSearch.displayName = 'IntelligentSearch';
