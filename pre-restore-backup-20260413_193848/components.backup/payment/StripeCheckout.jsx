import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';

export const StripeCheckout = ({ amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ amount })
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error('No checkout URL');
    } catch (err) {
      alert('Payment error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return <Button onClick={handleCheckout} disabled={loading}>{loading ? 'Processing...' : `Pay $${amount}`}</Button>;
};
