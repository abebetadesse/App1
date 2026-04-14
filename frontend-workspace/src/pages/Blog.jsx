import React from "react";
/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Optimize Your Professional Profile for Better Matches',
      excerpt: 'Learn the key elements that make your profile stand out and attract more clients.',
      category: 'Tips & Tricks',
      author: 'Sarah Johnson',
      date: 'Dec 15, 2023',
      readTime: '5 min read',
      image: '/images/blog-1.jpg'
    },
    {
      id: 2,
      title: 'The Importance of Continuous Learning in Professional Development',
      excerpt: 'Discover how ongoing education through Moodle courses can boost your career.',
      category: 'Education',
      author: 'Dr. Michael Chen',
      date: 'Dec 12, 2023',
      readTime: '7 min read',
      image: '/images/blog-2.jpg'
    },
    {
      id: 3,
      title: 'Client Success Stories: How Tham Platform Changed Lives',
      excerpt: 'Read inspiring stories from clients and professionals who found success through our platform.',
      category: 'Success Stories',
      author: 'Team Tham',
      date: 'Dec 10, 2023',
      readTime: '6 min read',
      image: '/images/blog-3.jpg'
    },
    {
      id: 4,
      title: 'Understanding Our Ranking Algorithm: A Complete Guide',
      excerpt: 'Get insights into how our system ranks professionals and what you can do to improve your score.',
      category: 'Platform Guide',
      author: 'Tech Team',
      date: 'Dec 8, 2023',
      readTime: '8 min read',
      image: '/images/blog-4.jpg'
    },
    {
      id: 5,
      title: 'Moodle Integration: Maximizing Your Learning Experience',
      excerpt: 'Tips and tricks to make the most out of our integrated Moodle LMS platform.',
      category: 'Tutorial',
      author: 'Education Team',
      date: 'Dec 5, 2023',
      readTime: '4 min read',
      image: '/images/blog-5.jpg'
    },
    {
      id: 6,
      title: 'Building Trust: The Role of Verification in Professional Platforms',
      excerpt: 'How our verification process ensures quality and builds trust between clients and professionals.',
      category: 'Security',
      author: 'Security Team',
      date: 'Dec 3, 2023',
      readTime: '5 min read',
      image: '/images/blog-6.jpg'
    }
  ];

  const categories = [
    { name: 'All', count: 15 },
    { name: 'Tips & Tricks', count: 4 },
    { name: 'Success Stories', count: 3 },
    { name: 'Platform Guide', count: 3 },
    { name: 'Education', count: 2 },
    { name: 'Tutorial', count: 2 },
    { name: 'Security', count: 1 }
  ];

  const popularPosts = [
    {
      title: 'Getting Started with Tham Platform',
      views: '1.2k'
    },
    {
      title: 'Top 5 Courses to Boost Your Profile',
      views: '980'
    },
    {
      title: 'Client Matching Best Practices',
      views: '850'
    },
    {
      title: 'Understanding Professional Rankings',
      views: '720'
    }
  ];

  return (
    <div className="blog-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <Badge bg="primary" className="mb-3">Blog</Badge>
              <h1 className="display-4 fw-bold text-primary mb-3">Tham Platform Blog</h1>
              <p className="lead text-muted">
                Insights, tips, and stories from our community of professionals and clients
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Featured Post */}
            <Card className="featured-post border-0 shadow-sm mb-5">
              <Row className="g-0">
                <Col md={6}>
                  <div className="featured-image">
                    <div className="placeholder-image">📸</div>
                  </div>
                </Col>
                <Col md={6}>
                  <Card.Body className="p-4 d-flex flex-column h-100">
                    <Badge bg="primary" className="align-self-start mb-3">Featured</Badge>
                    <Card.Title className="h3">Revolutionizing Professional Services in Ethiopia</Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                      How Tham Platform is transforming the way professionals and clients connect, 
                      creating new opportunities for economic growth and career development.
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <small className="text-muted">By Team Tham</small>
                        <br />
                        <small className="text-muted">Dec 18, 2023 · 10 min read</small>
                      </div>
                      <Button variant="primary">Read More</Button>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>

            {/* Blog Posts Grid */}
            <Row>
              {blogPosts.map((post) => (
                <Col md={6} key={post.id} className="mb-4">
                  <Card className="blog-post-card h-100 border-0 shadow-sm">
                    <div className="blog-image">
                      <div className="placeholder-image">📷</div>
                      <Badge bg="light" text="dark" className="category-badge">
                        {post.category}
                      </Badge>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6">{post.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {post.excerpt}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">By {post.author}</small>
                          <br />
                          <small className="text-muted">{post.date} · {post.readTime}</small>
                        </div>
                        <Button variant="outline-primary" size="sm">Read</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Search */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="mb-3">Search Blog</h6>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search articles..." 
                  />
                  <Button variant="primary">Search</Button>
                </div>
              </Card.Body>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="mb-3">Categories</h6>
                <div className="list-group list-group-flush">
                  {categories.map((category, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      {category.name}
                      <Badge bg="primary" pill>{category.count}</Badge>
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Popular Posts */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="mb-3">Popular Posts</h6>
                <div className="list-group list-group-flush">
                  {popularPosts.map((post, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h7 className="mb-1">{post.title}</h7>
                      </div>
                      <small className="text-muted">{post.views} views</small>
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Newsletter */}
            <Card className="border-0 shadow-sm bg-primary text-white">
              <Card.Body>
                <h6 className="mb-3">Subscribe to Newsletter</h6>
                <p className="small mb-3">
                  Get the latest articles and updates delivered to your inbox.
                </p>
                <div className="input-group mb-2">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your email address" 
                  />
                </div>
                <Button variant="light" className="w-100">Subscribe</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Blog;