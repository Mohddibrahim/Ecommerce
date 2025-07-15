import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Complaints = () => {
  const [text, setText] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Complaint submitted");
    } catch (err) {
      alert("Error submitting complaint");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Submit Complaint</h2>
      <form onSubmit={handleSubmit}>
        <textarea className="form-control mb-3" value={text} onChange={(e) => setText(e.target.value)} required></textarea>
        <button className="btn btn-danger" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Complaints;