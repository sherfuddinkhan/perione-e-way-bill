import React, { useState } from 'react';
import axios from 'axios';

const CancelEWayBill= ()=>{
  const [ewbNo, setEwbNo] = useState('');
  const [cancelRsnCode, setCancelRsnCode] = useState('2');
  const [cancelRmrk, setCancelRmrk] = useState('Order Cancelled');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post('http://localhost:5000/api/ewaybill/cancel', {
        ewbNo: Number(ewbNo),
        cancelRsnCode: Number(cancelRsnCode),
        cancelRmrk,
      });
      setResponse({ success: true, data: res.data });
    } catch (err) {
      setResponse({
        success: false,
        data: err.response?.data || { message: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>1. Cancel E-Way Bill</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>E-Way Bill Number:</label>
          <input
            type="number"
            value={ewbNo}
            onChange={(e) => setEwbNo(e.target.value)}
            placeholder="e.g. 161012148611"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Reason Code:</label>
          <select
            value={cancelRsnCode}
            onChange={(e) => setCancelRsnCode(e.target.value)}
            style={inputStyle}
          >
            <option value="1">1 - Duplicate</option>
            <option value="2">2 - Order Cancelled</option>
            <option value="3">3 - Data Entry Error</option>
            <option value="4">4 - Others</option>
          </select>
        </div>
        <div>
          <label>Remarks:</label>
          <input
            type="text"
            value={cancelRmrk}
            onChange={(e) => setCancelRmrk(e.target.value)}
            placeholder="Remarks"
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Cancelling...' : 'Cancel E-Way Bill'}
        </button>
      </form>
      <ResponseViewer response={response} />
    </div>
  );
}
export default CancelEWayBill;