import React from "react";
/* eslint-disable no-unused-vars */
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  ProgressBar,
  Modal,
  Form,
  ListGroup
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { documentService } from '../../services/documentService';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Eye
} from 'react-feather';

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('resume');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError('Please select a PDF, JPEG, or PNG file');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('type', documentType);

      await documentService.uploadDocument(formData, (progress) => {
        setUploadProgress(progress);
      });

      setSuccess('Document uploaded successfully!');
      setShowUploadModal(false);
      setSelectedFile(null);
      setDocumentType('resume');
      fetchDocuments(); // Refresh list
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(documentId);
        setSuccess('Document deleted successfully!');
        fetchDocuments(); // Refresh list
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'resume':
        return <FileText className="text-primary" />;
      case 'certificate':
        return <CheckCircle className="text-success" />;
      case 'portfolio':
        return <Eye className="text-info" />;
      default:
        return <FileText className="text-secondary" />;
    }
  };

  const getTypeDisplayName = (type) => {
    const names = {
      resume: 'Resume/CV',
      certificate: 'Certificate',
      portfolio: 'Portfolio',
      identification: 'ID Document',
      other: 'Other Document'
    };
    return names[type] || type;
  };

  const getStatusBadge = (status) => {
    const variants = {
      verified: 'success',
      pending: 'warning',
      rejected: 'danger'
    };
    return (
      <span className={`badge bg-${variants[status] || 'secondary'}`}>
        {status}
      </span>
    );
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">My Documents</h1>
              <p className="text-muted">Manage your professional documents and certificates</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload size={16} className="me-2" />
              Upload Document
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <AlertCircle size={16} className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          <CheckCircle size={16} className="me-2" />
          {success}
        </Alert>
      )}

      {/* Document Requirements */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Document Requirements</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <CheckCircle size={20} className="text-success me-3" />
                <div>
                  <strong>Resume/CV</strong>
                  <div className="text-muted small">Required for all profile owners</div>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <CheckCircle size={20} className="text-success me-3" />
                <div>
                  <strong>Professional Certificates</strong>
                  <div className="text-muted small">Improves your ranking score</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <CheckCircle size={20} className="text-success me-3" />
                <div>
                  <strong>Portfolio</strong>
                  <div className="text-muted small">Showcase your work</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <AlertCircle size={20} className="text-warning me-3" />
                <div>
                  <strong>File Requirements</strong>
                  <div className="text-muted small">PDF, JPEG, PNG up to 10MB</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documents List */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Uploaded Documents</h5>
        </Card.Header>
        <Card.Body>
          {documents.length === 0 ? (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <h5>No documents uploaded</h5>
              <p className="text-muted">
                Upload your professional documents to improve your profile credibility
              </p>
              <Button 
                variant="primary"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {documents.map((doc) => (
                <ListGroup.Item key={doc.id} className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{doc.name}</h6>
                          <small className="text-muted">
                            {getTypeDisplayName(doc.type)} • 
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} • 
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ms-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        href={doc.url}
                        target="_blank"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        href={doc.url}
                        download
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  {doc.feedback && doc.status === 'rejected' && (
                    <Alert variant="danger" className="mt-2 mb-0 small">
                      <strong>Feedback:</strong> {doc.feedback}
                    </Alert>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="resume">Resume/CV</option>
                <option value="certificate">Professional Certificate</option>
                <option value="portfolio">Portfolio</option>
                <option value="identification">Identification</option>
                <option value="other">Other Document</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              <Form.Text className="text-muted">
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </Form.Text>
            </Form.Group>

            {selectedFile && (
              <Alert variant="info">
                <strong>Selected file:</strong> {selectedFile.name} 
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Alert>
            )}

            {uploading && (
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar now={uploadProgress} />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowUploadModal(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Documents;