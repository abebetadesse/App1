import React, { forwardRef } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
const Contact = forwardRef((props, ref) { return <Container className="py-5"><h1>Contact Us</h1><Card><Card.Body><Form><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" /></Form.Group><Form.Group><Form.Label>Message</Form.Label><Form.Control as="textarea" rows={4} /></Form.Group><Button>Send</Button></Form></Card.Body></Card></Container>; }
Contact.displayName = 'Contact';
