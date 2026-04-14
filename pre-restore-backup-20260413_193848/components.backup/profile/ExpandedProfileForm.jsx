import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

export const ExpandedProfileForm = ({ onSubmit, initialData }) => {
  const [profile, setProfile] = useState(initialData || {
    profileType: 'individual',
    title: '',
    skills: [],
    languages: [],
    portfolio: [],
    agencyDetails: { managerName: '', teamSize: 1, members: [] }
  });
  const [message, setMessage] = useState('');

  const addSkill = () => setProfile({ ...profile, skills: [...profile.skills, { name: '', level: 'intermediate' }] });
  const addLanguage = () => setProfile({ ...profile, languages: [{ name: '', proficiency: 'conversational' }] });
  const addPortfolio = () => setProfile({ ...profile, portfolio: [{ title: '', type: 'image', url: '' }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify(profile)
      });
      if (res.ok) setMessage({ type: 'success', text: 'Profile updated!' });
      else setMessage({ type: 'danger', text: 'Failed to update' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>Professional Profile</h4>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group><Form.Label>Profile Type</Form.Label><Form.Select value={profile.profileType} onChange={e => setProfile({...profile, profileType: e.target.value})}><option value="individual">Individual</option><option value="agency">Agency</option></Form.Select></Form.Group>
          <Form.Group><Form.Label>Title (e.g., UI/UX Designer)</Form.Label><Form.Control value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} required /></Form.Group>
          
          <div className="mt-3"><strong>Skills</strong> <Button size="sm" onClick={addSkill}>+ Add</Button></div>
          {profile.skills.map((s, i) => (
            <Row key={i} className="mt-2"><Col><Form.Control placeholder="Skill name" value={s.name} onChange={e => { const updated = [...profile.skills]; updated[i].name = e.target.value; setProfile({...profile, skills: updated}); }} /></Col><Col><Form.Select value={s.level} onChange={e => { const updated = [...profile.skills]; updated[i].level = e.target.value; setProfile({...profile, skills: updated}); }}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></Form.Select></Col></Row>
          ))}
          
          <div className="mt-3"><strong>Languages</strong> <Button size="sm" onClick={addLanguage}>+ Add</Button></div>
          {profile.languages.map((l, i) => (
            <Row key={i} className="mt-2"><Col><Form.Control placeholder="Language" value={l.name} onChange={e => { const updated = [...profile.languages]; updated[i].name = e.target.value; setProfile({...profile, languages: updated}); }} /></Col><Col><Form.Select value={l.proficiency} onChange={e => { const updated = [...profile.languages]; updated[i].proficiency = e.target.value; setProfile({...profile, languages: updated}); }}><option value="basic">Basic</option><option value="conversational">Conversational</option><option value="fluent">Fluent</option><option value="native">Native</option></Form.Select></Col></Row>
          ))}
          
          <div className="mt-3"><strong>Portfolio</strong> <Button size="sm" onClick={addPortfolio}>+ Add</Button></div>
          {profile.portfolio.map((p, i) => (
            <Row key={i} className="mt-2"><Col><Form.Control placeholder="Title" value={p.title} onChange={e => { const updated = [...profile.portfolio]; updated[i].title = e.target.value; setProfile({...profile, portfolio: updated}); }} /></Col><Col><Form.Select value={p.type} onChange={e => { const updated = [...profile.portfolio]; updated[i].type = e.target.value; setProfile({...profile, portfolio: updated}); }}><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option><option value="link">Link</option></Form.Select></Col><Col><Form.Control placeholder="URL" value={p.url} onChange={e => { const updated = [...profile.portfolio]; updated[i].url = e.target.value; setProfile({...profile, portfolio: updated}); }} /></Col></Row>
          ))}
          
          {profile.profileType === 'agency' && (
            <>
              <Form.Group><Form.Label>Manager Name</Form.Label><Form.Control value={profile.agencyDetails.managerName} onChange={e => setProfile({...profile, agencyDetails: {...profile.agencyDetails, managerName: e.target.value}})} /></Form.Group>
              <Form.Group><Form.Label>Team Size</Form.Label><Form.Control type="number" value={profile.agencyDetails.teamSize} onChange={e => setProfile({...profile, agencyDetails: {...profile.agencyDetails, teamSize: e.target.value}})} /></Form.Group>
            </>
          )}
          
          <Button type="submit" className="mt-3">Save Profile</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
