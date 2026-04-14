import React, { forwardRef } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const SocialShare = forwardRef(SocialShare);
export default function SocialShare({ url, title }) {
  const share = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };
  return (
    <ButtonGroup>
      <Button variant="outline-primary" onClick={() => share('facebook')}>📘</Button>
      <Button variant="outline-info" onClick={() => share('twitter')}>🐦</Button>
      <Button variant="outline-secondary" onClick={() => share('linkedin')}>🔗</Button>
      <Button variant="outline-success" onClick={() => share('whatsapp')}>💬</Button>
    </ButtonGroup>
  );
}
SocialShare.displayName = 'SocialShare';
