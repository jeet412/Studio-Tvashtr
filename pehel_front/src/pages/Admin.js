import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [contacts, setContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleContacts = async () => {
    if (!showContacts) {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/contact/all');
        setContacts(res.data);
      } catch (err) {
        setError('Failed to load contacts.');
      } finally {
        setLoading(false);
      }
    }
    setShowContacts(!showContacts);
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={toggleContacts}
        aria-expanded={showContacts}
        aria-controls="contactSubmissions"
      >
        {showContacts ? 'Hide' : 'Show'} Contact Form Submissions
      </button>

      {showContacts && (
        <div id="contactSubmissions" className="table-responsive">
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && contacts.length === 0 && <p>No submissions found.</p>}
          {!loading && !error && contacts.length > 0 && (
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(({ _id, name, email, message, createdAt }, index) => (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{message}</td>
                    <td>{new Date(createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
