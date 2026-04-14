import React, { useState } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'client' });
  const [message, setMessage] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (userData) => adminAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setShowModal(false);
      setMessage({ type: 'success', text: 'User created' });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => setMessage({ type: 'danger', text: error.response?.data?.error || 'Failed' })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setShowModal(false);
      setMessage({ type: 'success', text: 'User updated' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setMessage({ type: 'success', text: 'User deleted' });
      setTimeout(() => setMessage(''), 3000);
    }
  });

  const handleSubmit = () => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) deleteMutation.mutate(id);
  };

  const getRoleBadge = (role) => {
    const colors = { admin: 'danger', client: 'primary', profile_owner: 'success' };
    return <Badge bg={colors[role]}>{role}</Badge>;
  };

  if (isLoading) return <div className="text-center p-4"><Spinner /></div>;

  return (
    <div>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <div className="d-flex justify-content-between mb-3">
        <h4>User Management</h4>
        <Button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'client' }); setShowModal(true); }}>Add User</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{getRoleBadge(user.role)}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td><Button size="sm" variant="warning" onClick={() => handleEdit(user)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form><Form.Group><Form.Label>Name</Form.Label><Form.Control value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Form.Group>
          <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></Form.Group>
          <Form.Group><Form.Label>Role</Form.Label><Form.Select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option value="client">Client</option><option value="profile_owner">Profile Owner</option><option value="admin">Admin</option></Form.Select></Form.Group></Form>
        </Modal.Body>
        <Modal.Footer><Button onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSubmit}>Save</Button></Modal.Footer>
      </Modal>
    </div>
  );
}
