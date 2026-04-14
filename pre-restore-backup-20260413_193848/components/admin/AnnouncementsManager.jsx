import React, { useState } from 'react';
import { Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';

const AnnouncementsManager = forwardRef((props, ref) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'info' });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => adminAPI.getAnnouncements().then(res => res.data) });
  const createMutation = useMutation({ mutationFn: (data) => adminAPI.createAnnouncement(data), onSuccess: () => { queryClient.invalidateQueries(['announcements']); setShowModal(false); } });
  const deleteMutation = useMutation({ mutationFn: (id) => adminAPI.deleteAnnouncement(id), onSuccess: () => queryClient.invalidateQueries(['announcements']) });
  const handleSubmit = () => createMutation.mutate(formData);
  return (
    <Card><Card.Header>Announcements Manager <Button size="sm" className="float-end" onClick={() => setShowModal(true)}>+ Add</Button></Card.Header>
    <Card.Body>{announcements?.map(a => (<div key={a.id} className="mb-2 p-2 border rounded"><strong>{a.title}</strong><p>{a.content}</p><Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(a.id)}>Delete</Button></div>))}</Card.Body>
    <Modal show={showModal} onHide={() => setShowModal(false)}><Modal.Header closeButton><Modal.Title>Add Announcement</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Title</Form.Label><Form.Control value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></Form.Group><Form.Group><Form.Label>Content</Form.Label><Form.Control as="textarea" rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={handleSubmit}>Add</Button></Modal.Footer></Modal></Card>
  );
}
AnnouncementsManager.displayName = 'AnnouncementsManager';
