import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: '', bio: '', phone: '', location: '', skills: [], languages: [], portfolio: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        skills: user.skills || [],
        languages: user.languages || [],
        portfolio: user.portfolio || []
      });
    }
  }, [user]);

  const addSkill = () => setProfile({ ...profile, skills: [...profile.skills, { name: '', level: 'intermediate' }] });
  const addLanguage = () => setProfile({ ...profile, languages: [...profile.languages, { name: '', proficiency: 'conversational' }] });
  const addPortfolio = () => setProfile({ ...profile, portfolio: [...profile.portfolio, { title: '', type: 'image', url: '' }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user) return <div>Please log in</div>;

  return (
    <Container className="py-4">
      <h1>My Profile</h1>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group><Form.Label>Avatar</Form.Label><input type="file" onChange={uploadAvatar} className="form-control" /></Form.Group>
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Basic Info</Card.Header>
              <Card.Body>
                <Form.Group><Form.Label>Name</Form.Label><Form.Control value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></Form.Group>
                <Form.Group><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></Form.Group>
                <Form.Group><Form.Label>Phone</Form.Label><Form.Control value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></Form.Group>
                <Form.Group><Form.Label>Location</Form.Label><Form.Control value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} /></Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header>Skills <Button size="sm" onClick={addSkill}>+ Add</Button></Card.Header>
              <Card.Body>
                {profile.skills.map((s, i) => (
                  <Row key={i} className="mb-2">
                    <Col><Form.Control placeholder="Skill" value={s.name} onChange={e => { const newSkills = [...profile.skills]; newSkills[i].name = e.target.value; setProfile({...profile, skills: newSkills}); }} /></Col>
                    <Col><Form.Select value={s.level} onChange={e => { const newSkills = [...profile.skills]; newSkills[i].level = e.target.value; setProfile({...profile, skills: newSkills}); }}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></Form.Select></Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Header>Languages <Button size="sm" onClick={addLanguage}>+ Add</Button></Card.Header>
              <Card.Body>
                {profile.languages.map((l, i) => (
                  <Row key={i} className="mb-2">
                    <Col><Form.Control placeholder="Language" value={l.name} onChange={e => { const newLangs = [...profile.languages]; newLangs[i].name = e.target.value; setProfile({...profile, languages: newLangs}); }} /></Col>
                    <Col><Form.Select value={l.proficiency} onChange={e => { const newLangs = [...profile.languages]; newLangs[i].proficiency = e.target.value; setProfile({...profile, languages: newLangs}); }}><option value="basic">Basic</option><option value="conversational">Conversational</option><option value="fluent">Fluent</option><option value="native">Native</option></Form.Select></Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
            <Card className="mb-4">
              <Card.Header>Portfolio <Button size="sm" onClick={addPortfolio}>+ Add</Button></Card.Header>
              <Card.Body>
                {profile.portfolio.map((p, i) => (
                  <Row key={i} className="mb-2">
                    <Col><Form.Control placeholder="Title" value={p.title} onChange={e => { const newPort = [...profile.portfolio]; newPort[i].title = e.target.value; setProfile({...profile, portfolio: newPort}); }} /></Col>
                    <Col><Form.Select value={p.type} onChange={e => { const newPort = [...profile.portfolio]; newPort[i].type = e.target.value; setProfile({...profile, portfolio: newPort}); }}><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option><option value="link">Link</option></Form.Select></Col>
                    <Col><Form.Control placeholder="URL" value={p.url} onChange={e => { const newPort = [...profile.portfolio]; newPort[i].url = e.target.value; setProfile({...profile, portfolio: newPort}); }} /></Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button type="submit" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Save Profile'}</Button>
      </Form>
    </Container>
  );
}
