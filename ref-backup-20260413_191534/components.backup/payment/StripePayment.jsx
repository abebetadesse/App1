import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Alert } from 'react-bootstrap';

export default function StripePayment({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const res = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      body: JSON.stringify({ amount })
    });
    const { clientSecret } = await res.json();
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (stripeError) setError(stripeError.message);
    else onSuccess(paymentIntent);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      <Button type="submit" disabled={!stripe || loading} className="mt-3">Pay ${amount}</Button>
    </form>
  );
}
