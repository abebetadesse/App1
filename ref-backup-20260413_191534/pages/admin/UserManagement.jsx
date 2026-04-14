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
  InputGroup,
  Modal,
  Alert
} from 'react-bootstrap';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile?.firstName + ' ' + user.profile?.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.isActive === (statusFilter === 'active');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId, action, data = null) => {
    try {
      setActionLoading(true);
      let response;

      switch (action) {
        case 'toggle_status':
          response = await adminAPI.toggleUserStatus(userId);
          break;
        case 'update_role':
          response = await adminAPI.updateUserRole(userId, data);
          break;
        case 'delete':
          response = await adminAPI.deleteUser(userId);
          break;
        default:
          return;
      }

      if (response.success) {
        await fetchUsers(); // Refresh the list
        setShowUserModal(false);
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'profile_owner': return 'primary';
      case 'client': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (isActive) => {
    return isActive ? 'success' : 'danger';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>User Management</h2>
          <p className="text-muted">
            Manage platform users and their permissions
          </p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="profile_owner">Profile Owner</option>
            <option value="client">Client</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={2} className="text-end">
          <small className="text-muted">
            {filteredUsers.length} user(s)
          </small>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Users List</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No users found</h5>
              <p className="text-muted">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters' 
                  : 'No users registered yet'
                }
              </p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Last Login</th>
                  <th>Moodle Linked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={user.profile?.avatar || '/default-avatar.png'}
                          alt="User"
                          className="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div>
                          <div className="fw-semibold">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getRoleVariant(user.role)}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(user.isActive)}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td>
                      {user.profileOwner?.moodleLinked ? (
                        <Badge bg="success">Yes</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openUserDetails(user)}
                        >
                          View
                        </Button>
                        <Button
                          variant={user.isActive ? "outline-warning" : "outline-success"}
                          size="sm"
                          onClick={() => handleUserAction(user.id, 'toggle_status')}
                          disabled={actionLoading}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
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

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={4} className="text-center">
                <img
                  src={selectedUser.profile?.avatar || '/default-avatar.png'}
                  alt="User"
                  className="rounded-circle mb-3"
                  width="120"
                  height="120"
                />
                <h5>
                  {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                </h5>
                <Badge bg={getRoleVariant(selectedUser.role)} className="mb-2">
                  {selectedUser.role.replace('_', ' ').toUpperCase()}
                </Badge>
                <br />
                <Badge bg={getStatusVariant(selectedUser.isActive)}>
                  {selectedUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </Col>

              <Col md={8}>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedUser.profile?.phoneNumber || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td><strong>Registered:</strong></td>
                      <td>{new Date(selectedUser.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Last Login:</strong></td>
                      <td>
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                    </tr>
                    {selectedUser.profileOwner && (
                      <>
                        <tr>
                          <td><strong>Service Category:</strong></td>
                          <td>{selectedUser.profileOwner.serviceCategory}</td>
                        </tr>
                        <tr>
                          <td><strong>Professional Rank:</strong></td>
                          <td>{selectedUser.profileOwner.professionalRank}/5</td>
                        </tr>
                        <tr>
                          <td><strong>Moodle Linked:</strong></td>
                          <td>
                            {selectedUser.profileOwner.moodleLinked ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>

                {/* Role Management */}
                <Form.Group className="mb-3">
                  <Form.Label>Change Role</Form.Label>
                  <div className="d-flex gap-2">
                    {['client', 'profile_owner', 'admin'].map((role) => (
                      <Button
                        key={role}
                        variant={selectedUser.role === role ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => handleUserAction(selectedUser.id, 'update_role', role)}
                        disabled={actionLoading || selectedUser.role === role}
                      >
                        {role.replace('_', ' ').toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {/* Danger Zone */}
                <Alert variant="danger">
                  <Alert.Heading>Danger Zone</Alert.Heading>
                  <p>
                    Deleting a user is permanent and cannot be undone. 
                    This will remove all associated data.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                        handleUserAction(selectedUser.id, 'delete');
                      }
                    }}
                    disabled={actionLoading}
                  >
                    Delete User
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;