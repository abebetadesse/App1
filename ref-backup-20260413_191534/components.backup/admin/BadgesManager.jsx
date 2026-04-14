import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';

export default function BadgesManager() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', icon: '', criteria: '' });
  const { data: badges } = useQuery({ queryKey: ['badges'], queryFn: () => adminAPI.getBadges().then(res => res.data) });
  const createMutation = useMutation({ mutationFn: (data) => adminAPI.createBadge(data), onSuccess: () => { queryClient.invalidateQueries(['badges']); setShowModal(false); } });
  const deleteMutation = useMutation({ mutationFn: (id) => adminAPI.deleteBadge(id), onSuccess: () => queryClient.invalidateQueries(['badges']) });
  return (
    <Card><Card.Header>Badges Manager <Button size="sm" className="float-end" onClick={() => setShowModal(true)}>+ Add</Button></Card.Header>
    <Card.Body><Table striped><thead><tr><th>Icon</th><th>Name</th><th>Criteria</th><th></th></tr></thead><tbody>{badges?.map(b => (<tr key={b.id}><td>{b.icon}</td><td>{b.name}</td><td>{b.criteria}</td><td><Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(b.id)}>Delete</Button></td></tr>))}</tbody></Table></Card.Body>
    <Modal show={showModal} onHide={() => setShowModal(false)}><Modal.Header closeButton><Modal.Title>Add Badge</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Name</Form.Label><Form.Control value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Form.Group><Form.Group><Form.Label>Icon (emoji)</Form.Label><Form.Control value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} /></Form.Group><Form.Group><Form.Label>Criteria</Form.Label><Form.Control value={formData.criteria} onChange={e => setFormData({...formData, criteria: e.target.value})} /></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={() => createMutation.mutate(formData)}>Add</Button></Modal.Footer></Modal></Card>
  );
}
