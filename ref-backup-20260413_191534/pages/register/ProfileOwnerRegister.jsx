import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileOwnerRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '',
    category: '', experience: '', hourlyRate: '',
    skills: '', bio: '', certifications: []
  });
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [message, setMessage] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocs([...uploadedDocs, ...files.map(f => ({ name: f.name, size: f.size }))]);
  };

  const handleSubmit = async () => {
    // Save profile owner data to localStorage
    const profileData = { ...formData, documents: uploadedDocs, role: 'profile_owner', createdAt: new Date().toISOString() };
    localStorage.setItem('profile_owner_data', JSON.stringify(profileData));
    // Auto-login as profile owner
    await login(formData.email, 'password', 'profile_owner');
    setMessage({ type: 'success', text: 'Registration complete! Redirecting...' });
    setTimeout(() => navigate('/profile-owner/dashboard'), 2000);
  };

  const steps = ['Basic Info', 'Professional Details', 'Documents', 'Review'];

  return (
    <Container className="py-5" style={{ maxWidth: '700px' }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile Owner Registration</h2>
          <ProgressBar now={(step / steps.length) * 100} className="mb-4" />
          <h5>Step {step}: {steps[step-1]}</h5>
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          
          {step === 1 && (
            <Form>
              <Form.Group><Form.Label>Full Name</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} required /></Form.Group>
              <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group>
              <Form.Group><Form.Label>Phone</Form.Label><Form.Control name="phone" value={formData.phone} onChange={handleChange} /></Form.Group>
              <Form.Group><Form.Label>Location</Form.Label><Form.Control name="location" value={formData.location} onChange={handleChange} /></Form.Group>
              <Button className="mt-3" onClick={nextStep}>Next</Button>
            </Form>
          )}
          
          {step === 2 && (
            <Form>
              <Form.Group><Form.Label>Category</Form.Label><Form.Select name="category" value={formData.category} onChange={handleChange}><option>Web Development</option><option>AI/ML</option><option>Design</option><option>Marketing</option></Form.Select></Form.Group>
              <Form.Group><Form.Label>Experience (years)</Form.Label><Form.Control type="number" name="experience" value={formData.experience} onChange={handleChange} /></Form.Group>
              <Form.Group><Form.Label>Hourly Rate ($)</Form.Label><Form.Control type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} /></Form.Group>
              <Form.Group><Form.Label>Skills (comma separated)</Form.Label><Form.Control name="skills" value={formData.skills} onChange={handleChange} /></Form.Group>
              <Form.Group><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} /></Form.Group>
              <div className="mt-3"><Button variant="secondary" onClick={prevStep}>Back</Button><Button className="ms-2" onClick={nextStep}>Next</Button></div>
            </Form>
          )}
          
          {step === 3 && (
            <div>
              <Form.Group><Form.Label>Upload Resume/CV</Form.Label><Form.Control type="file" multiple onChange={handleFileUpload} /></Form.Group>
              <Form.Group><Form.Label>Upload Certifications</Form.Label><Form.Control type="file" multiple onChange={handleFileUpload} /></Form.Group>
              {uploadedDocs.length > 0 && <ul>{uploadedDocs.map((doc,i) => <li key={i}>{doc.name}</li>)}</ul>}
              <div className="mt-3"><Button variant="secondary" onClick={prevStep}>Back</Button><Button className="ms-2" onClick={nextStep}>Next</Button></div>
            </div>
          )}
          
          {step === 4 && (
            <div>
              <p><strong>Name:</strong> {formData.name}</p><p><strong>Email:</strong> {formData.email}</p><p><strong>Category:</strong> {formData.category}</p><p><strong>Experience:</strong> {formData.experience} years</p><p><strong>Rate:</strong> ${formData.hourlyRate}/hr</p>
              <div className="mt-3"><Button variant="secondary" onClick={prevStep}>Back</Button><Button className="ms-2 btn-success" onClick={handleSubmit}>Complete Registration</Button></div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
