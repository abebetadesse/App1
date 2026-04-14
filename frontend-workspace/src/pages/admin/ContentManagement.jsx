import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Badge,
  Form,
  Modal,
  Alert,
  Tab,
  Nav
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [activeTab, setActiveTab] = useState('pages');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    type: 'page',
    status: 'published',
    metaTitle: '',
    metaDescription: '',
    tags: []
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getContent(activeTab);
      if (response.success) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      let response;

      if (editingContent) {
        response = await adminAPI.updateContent(editingContent.id, formData);
      } else {
        response = await adminAPI.createContent(formData);
      }

      if (response.success) {
        await fetchContent();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setFormData({
      title: contentItem.title,
      slug: contentItem.slug,
      content: contentItem.content,
      type: contentItem.type,
      status: contentItem.status,
      metaTitle: contentItem.metaTitle || '',
      metaDescription: contentItem.metaDescription || '',
      tags: contentItem.tags || []
    });
    setShowModal(true);
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      setActionLoading(true);
      const response = await adminAPI.updateContentStatus(contentId, newStatus);
      if (response.success) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error updating content status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        const response = await adminAPI.deleteContent(contentId);
        if (response.success) {
          await fetchContent();
        }
      } catch (error) {
        console.error('Error deleting content:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      type: activeTab === 'pages' ? 'page' : 'blog',
      status: 'published',
      metaTitle: '',
      metaDescription: '',
      tags: []
    });
    setEditingContent(null);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case 'page': return 'primary';
      case 'blog': return 'info';
      case 'faq': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Content Management</h2>
          <p className="text-muted">
            Manage website pages, blog posts, and other content
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
          >
            Add New Content
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="pages">Pages</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="blog">Blog Posts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="faq">FAQ</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className="p-0">
          {content.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
              <h5>No content found</h5>
              <p className="text-muted">
                {activeTab === 'pages' 
                  ? 'Create your first page to get started' 
                  : `No ${activeTab} posts available`
                }
              </p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Create {activeTab === 'pages' ? 'Page' : 'Post'}
              </Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.map((contentItem) => (
                  <tr key={contentItem.id}>
                    <td>
                      <div className="fw-semibold">{contentItem.title}</div>
                      {contentItem.metaTitle && (
                        <small className="text-muted">
                          Meta: {contentItem.metaTitle}
                        </small>
                      )}
                    </td>
                    <td>
                      <code>/{(activeTab === 'blog' ? 'blog/' : '')}{contentItem.slug}</code>
                    </td>
                    <td>
                      <Badge bg={getTypeVariant(contentItem.type)}>
                        {contentItem.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(contentItem.status)}>
                        {contentItem.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      {new Date(contentItem.updatedAt).toLocaleDateString()}
                    </td>
                    <td>
                      {contentItem.author?.name || 'System'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(contentItem)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            const newStatus = contentItem.status === 'published' ? 'draft' : 'published';
                            handleStatusChange(contentItem.id, newStatus);
                          }}
                          disabled={actionLoading}
                        >
                          {contentItem.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(contentItem.id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingContent ? 'Edit Content' : `Create New ${activeTab === 'pages' ? 'Page' : 'Post'}`}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        title: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value)
                      }));
                    }}
                    placeholder="Enter title..."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-slug"
                    required
                  />
                  <Form.Text className="text-muted">
                    URL-friendly version of the title
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your content here..."
                required
              />
              <Form.Text className="text-muted">
                Supports Markdown formatting
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="page">Page</option>
                    <option value="blog">Blog Post</option>
                    <option value="faq">FAQ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <h6>SEO Settings</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="Meta title for SEO..."
                  />
                  <Form.Text className="text-muted">
                    {formData.metaTitle.length}/60 characters
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                    }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Meta description for SEO..."
              />
              <Form.Text className="text-muted">
                {formData.metaDescription.length}/160 characters
              </Form.Text>
            </Form.Group>

            {/* Preview Section */}
            {formData.title && (
              <Alert variant="info">
                <strong>Preview:</strong><br />
                <strong>{formData.metaTitle || formData.title}</strong><br />
                <small className="text-success">
                  https://thamplatform.com/{activeTab === 'blog' ? 'blog/' : ''}{formData.slug}
                </small>
                {formData.metaDescription && (
                  <>
                    <br />
                    <small>{formData.metaDescription}</small>
                  </>
                )}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => { setShowModal(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : (editingContent ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ContentManagement;