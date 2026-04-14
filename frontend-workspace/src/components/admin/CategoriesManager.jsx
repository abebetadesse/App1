import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';

const CategoriesManager = forwardRef((props, ref) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => adminAPI.getCategories().then(res => res.data) });
  const createMutation = useMutation({ mutationFn: (data) => adminAPI.createCategory(data), onSuccess: () => { queryClient.invalidateQueries(['categories']); setShowModal(false); } });
  const deleteMutation = useMutation({ mutationFn: (id) => adminAPI.deleteCategory(id), onSuccess: () => queryClient.invalidateQueries(['categories']) });
  return (
    <Card><Card.Header>Categories Manager <Button size="sm" className="float-end" onClick={() => setShowModal(true)}>+ Add</Button></Card.Header>
    <Card.Body><Table striped><thead><tr><th>Name</th><th>Description</th><th></th></tr></thead><tbody>{categories?.map(c => (<tr key={c.id}><td>{c.name}</td><td>{c.description}</td><td><Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(c.id)}>Delete</Button></td></tr>))}</tbody></Table></Card.Body>
    <Modal show={showModal} onHide={() => setShowModal(false)}><Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group><Form.Label>Name</Form.Label><Form.Control value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Form.Group><Form.Group><Form.Label>Description</Form.Label><Form.Control value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></Form.Group></Form></Modal.Body><Modal.Footer><Button onClick={() => createMutation.mutate(formData)}>Add</Button></Modal.Footer></Modal></Card>
  );
}
CategoriesManager.displayName = 'CategoriesManager';
