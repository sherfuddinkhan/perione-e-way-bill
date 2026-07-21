import React, { useState } from 'react';
import axios from 'axios';
import './ExtendValidityEwayBill.css';

const ExtendValidityEwayBill = () => {
  const [formData, setFormData] = useState({
    ewbNo: '181012149102',
    vehicleNo: 'TS09AB1234',
    fromPlace: 'Hyderabad',
    fromState: '36',
    remainingDistance: '5',
    transDocNo: 'LR123456',
    transDocDate: '05/06/2026',
    transMode: '1',
    extnRsnCode: '1',
    extnRemarks: 'Nature Calamity',
    fromPincode: '500081',
    consignmentStatus: 'M'
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/extend-validity',
        formData
      );
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outer-container">
      <div className="card">
        <div className="header">
          <span className="badge">E-Way Bill</span>
          <h2 className="title">Extend Validity</h2>
          <p className="subtitle">
            Submit the form to extend the validity of an E-Way Bill
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="field-group">
              <label className="label">{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          ))}

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Submitting...' : 'Extend Validity'}
          </button>
        </form>

        {response && (
          <div className="response-card">
            <div className="response-header">
              <span className="status-badge">RESPONSE</span>
              <span className="response-desc">API Response</span>
            </div>

            <pre className="json-viewer">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtendValidityEwayBill;