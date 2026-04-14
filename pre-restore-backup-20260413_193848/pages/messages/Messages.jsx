import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // TODO: Replace with actual API call
        setTimeout(() => {
          const mockConversations = [
            {
              id: 1,
              participant: {
                id: 2,
                name: 'John Developer',
                type: 'profile_owner',
                avatar: 'JD'
              },
              lastMessage: 'Looking forward to working with you!',
              lastMessageTime: '2023-12-15T10:30:00',
              unreadCount: 2
            },
            {
              id: 2,
              participant: {
                id: 3,
                name: 'Sarah Designer',
                type: 'profile_owner',
                avatar: 'SD'
              },
              lastMessage: 'I have sent the design files',
              lastMessageTime: '2023-12-14T15:45:00',
              unreadCount: 0
            },
            {
              id: 3,
              participant: {
                id: 4,
                name: 'ABC Company',
                type: 'client',
                avatar: 'AC'
              },
              lastMessage: 'When can you start the project?',
              lastMessageTime: '2023-12-13T09:15:00',
              unreadCount: 1
            }
          ];
          setConversations(mockConversations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          // TODO: Replace with actual API call
          setTimeout(() => {
            const mockMessages = [
              {
                id: 1,
                senderId: 2,
                content: 'Hello! I saw your project requirements and I\'m very interested.',
                timestamp: '2023-12-15T09:00:00',
                read: true
              },
              {
                id: 2,
                senderId: user.id,
                content: 'Great! Can you tell me about your experience with similar projects?',
                timestamp: '2023-12-15T09:05:00',
                read: true
              },
              {
                id: 3,
                senderId: 2,
                content: 'I have 5 years of experience in web development and have completed 50+ successful projects.',
                timestamp: '2023-12-15T09:10:00',
                read: true
              },
              {
                id: 4,
                senderId: 2,
                content: 'Looking forward to working with you!',
                timestamp: '2023-12-15T10:30:00',
                read: false
              }
            ];
            setMessages(mockMessages);
          }, 500);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [activeConversation, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      senderId: user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send message to backend
    console.log('Sending message:', message);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="h3 mb-4">Messages</h1>
        </Col>
      </Row>

      <Row>
        {/* Conversations List */}
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Conversations</h5>
                <Badge bg="primary">
                  {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {conversations.length > 0 ? (
                <ListGroup variant="flush">
                  {conversations.map((conversation) => (
                    <ListGroup.Item
                      key={conversation.id}
                      action
                      active={activeConversation?.id === conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className="border-0"
                    >
                      <div className="d-flex align-items-center">
                        <div className="conversation-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                          <span className="text-white fw-bold small">
                            {conversation.participant.avatar}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1">{conversation.participant.name}</h6>
                            <small className="text-muted">
                              {formatDate(conversation.lastMessageTime)}
                            </small>
                          </div>
                          <p className="text-muted mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge bg="primary" pill className="ms-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    <i className="bi bi-chat-dots fs-1"></i>
                  </div>
                  <p className="text-muted">No conversations yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Messages Area */}
        <Col md={8}>
          <Card className="border-0 shadow-sm h-100">
            {activeConversation ? (
              <>
                <Card.Header className="bg-white border-0">
                  <div className="d-flex align-items-center">
                    <div className="conversation-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                      <span className="text-white fw-bold small">
                        {activeConversation.participant.avatar}
                      </span>
                    </div>
                    <div>
                      <h6 className="mb-0">{activeConversation.participant.name}</h6>
                      <small className="text-muted">
                        {activeConversation.participant.type === 'profile_owner' ? 'Professional' : 'Client'}
                      </small>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="messages-container" style={{ height: '400px', overflowY: 'auto' }}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`d-flex mb-3 ${
                        message.senderId === user.id ? 'justify-content-end' : 'justify-content-start'
                      }`}
                    >
                      <div
                        className={`message-bubble ${
                          message.senderId === user.id 
                            ? 'bg-primary text-white' 
                            : 'bg-light text-dark'
                        } rounded p-3`}
                        style={{ maxWidth: '70%' }}
                      >
                        <div className="message-content">{message.content}</div>
                        <div
                          className={`message-time small ${
                            message.senderId === user.id ? 'text-white-50' : 'text-muted'
                          } mt-1 text-end`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </Card.Body>

                <Card.Footer className="bg-white border-0">
                  <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button variant="primary" type="submit" disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </InputGroup>
                  </Form>
                </Card.Footer>
              </>
            ) : (
              <Card.Body className="d-flex align-items-center justify-content-center text-center">
                <div>
                  <div className="text-muted mb-3">
                    <i className="bi bi-chat-left fs-1"></i>
                  </div>
                  <h5>Select a conversation</h5>
                  <p className="text-muted">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Messages;