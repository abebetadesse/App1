import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal, Badge as BootstrapBadge } from 'react-bootstrap';

const AdminControlPanel = forwardRef((props, ref) {
  // News & Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsItem, setNewsItem] = useState({ title: '', content: '', type: 'info' });
  
  // Badges
  const [badges, setBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeItem, setBadgeItem] = useState({ name: '', icon: '', criteria: '' });

  // Marketplace categories
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryItem, setCategoryItem] = useState({ name: '', description: '' });

  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('admin_announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    else setAnnouncements([{ id: 1, title: 'Welcome to Tham Platform', content: 'We are live!', type: 'success', date: new Date().toISOString() }]);
    
    const savedBadges = localStorage.getItem('admin_badges');
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    else setBadges([{ id: 1, name: 'Top Performer', icon: '🏆', criteria: 'Complete 5 courses' }]);
    
    const savedCategories = localStorage.getItem('marketplace_categories');
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    else setCategories([{ id: 1, name: 'Web Development', description: 'React, Node, Python' }]);
  }, []);

  // News handlers
  const addAnnouncement = () => {
    const newItem = { id: Date.now(), ...newsItem, date: new Date().toISOString() };
    const updated = [...announcements, newItem];
    setAnnouncements(updated);
    localStorage.setItem('admin_announcements', JSON.stringify(updated));
    setShowNewsModal(false);
    setNewsItem({ title: '', content: '', type: 'info' });
  };
  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('admin_announcements', JSON.stringify(updated));
  };

  // Badge handlers
  const addBadge = () => {
    const newBadge = { id: Date.now(), ...badgeItem };
    const updated = [...badges, newBadge];
    setBadges(updated);
    localStorage.setItem('admin_badges', JSON.stringify(updated));
    setShowBadgeModal(false);
    setBadgeItem({ name: '', icon: '', criteria: '' });
  };
  const deleteBadge = (id) => {
    const updated = badges.filter(b => b.id !== id);
    setBadges(updated);
    localStorage.setItem('admin_badges', JSON.stringify(updated));
  };

  // Category handlers
  const addCategory = () => {
    const newCat = { id: Date.now(), ...categoryItem };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('marketplace_categories', JSON.stringify(updated));
    setShowCategoryModal(false);
    setCategoryItem({ name: '', description: '' });
  };
  const deleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('marketplace_categories', JSON.stringify(updated));
  };

  return (
    <Container fluid className="py-4">
      <h1>Admin Control Panel</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>📢 News & Announcements <Button size="sm" className="float-end" onClick={() => setShowNewsModal(true)}>+ Add</Button></Card.Header>
            <Card.Body>
              {announcements.map(a => (
                <div key={a.id} className="mb-2 p-2 border rounded">
                  <div className="d-flex justify-content-between"><strong>{a.title}</strong><Button size="sm" variant="danger" onClick={() => deleteAnnouncement(a.id)}>×</Button></div>
                  <p className="mb-0">{a.content}</p>
                  <small className="text-muted">{new Date(a.date).toLocaleDateString()}</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>🏅 Badge Management <Button size="sm" className="float-end" onClick={() => setShowBadgeModal(true)}>+ Add</Button></Card.Header>
            <Card.Body>
              <Table striped><thead><tr><th>Icon</th><th>Name</th><th>Criteria</th><th></th></tr></thead><tbody>
                {badges.map(b => (<tr key={b.id}><td>{b.icon}</td><td>{b.name}</td><td>{b.criteria}</td><td><Button size="sm" variant="danger" onClick={() => deleteBadge(b.id)}>Delete</Button></td></tr>))}
              </tbody></Table>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>📦 Marketplace Categories <Button size="sm" className="float-end" onClick={() => setShowCategoryModal(true)}>+ Add</Button></Card.Header>
            <Card.Body>
              <Table striped><thead><tr><th>Name</th><th>Description</th><th></th></tr></thead><tbody>
                {categories.map(c => (<tr key={c.id}><td>{c.name}</td><td>{c.description}</td><td><Button size="sm" variant="danger" onClick={() => deleteCategory(c.id)}>Delete</Button></td></tr>))}
              </tbody></Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal show={showNewsModal} onHide={() => setShowNewsModal(false)}><Modal.Header closeButton><Modal.Title>Add Announcement</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Title</Form.Label><Form.Control value={newsItem.title} onChange={e => setNewsItem({...newsItem, title: e.target.value})} /></Form.Group><Form.Group><Form.Label>Content</Form.Label><Form.Control as="textarea" rows={3} value={newsItem.content} onChange={e => setNewsItem({...newsItem, content: e.target.value})} /></Form.Group><Form.Group><Form.Label>Type</Form.Label><Form.Select value={newsItem.type} onChange={e => setNewsItem({...newsItem, type: e.target.value})}><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option></Form.Select></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={addAnnouncement}>Add</Button></Modal.Footer></Modal>

      <Modal show={showBadgeModal} onHide={() => setShowBadgeModal(false)}><Modal.Header closeButton><Modal.Title>Add Badge</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Name</Form.Label><Form.Control value={badgeItem.name} onChange={e => setBadgeItem({...badgeItem, name: e.target.value})} /></Form.Group><Form.Group><Form.Label>Icon (emoji)</Form.Label><Form.Control value={badgeItem.icon} onChange={e => setBadgeItem({...badgeItem, icon: e.target.value})} /></Form.Group><Form.Group><Form.Label>Criteria</Form.Label><Form.Control value={badgeItem.criteria} onChange={e => setBadgeItem({...badgeItem, criteria: e.target.value})} /></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={addBadge}>Add</Button></Modal.Footer></Modal>

      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}><Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Name</Form.Label><Form.Control value={categoryItem.name} onChange={e => setCategoryItem({...categoryItem, name: e.target.value})} /></Form.Group><Form.Group><Form.Label>Description</Form.Label><Form.Control value={categoryItem.description} onChange={e => setCategoryItem({...categoryItem, description: e.target.value})} /></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={addCategory}>Add</Button></Modal.Footer></Modal>
    </Container>
  );
}
AdminControlPanel.displayName = 'AdminControlPanel';
