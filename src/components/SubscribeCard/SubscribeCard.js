'use client';

import { useState, memo } from 'react';

const SubscribeCard = memo(() => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    // Start loading state
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success scenario
      setStatus({ type: 'success', message: 'Successfully subscribed!' });
      setEmail('');
    } catch (error) {
      // Error scenario
      setStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
    } finally {
      // End loading state
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4" role="region" aria-label="Newsletter subscription">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Stay Updated</h2>
        <p className="small text-muted mb-3">
          Get notified about new IPO launches and market updates
        </p>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email subscription"
              required
            />
          </div>

          {status.message && (
            <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'} py-2 small`}>
              {status.message}
            </div>
          )}

          <button 
            className="btn btn-primary w-100" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Subscribing...
              </>
            ) : 'Subscribe Now'}
          </button>
        </form>
      </div>
    </div>
  );
});

SubscribeCard.displayName = 'SubscribeCard';

export default SubscribeCard;