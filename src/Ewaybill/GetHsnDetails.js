import React, { useState } from 'react';
import axios from 'axios';

const GetHsnDetails=()=> {
  const [hsncode, setHsncode] = useState('100610');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('http://localhost:5000/api/ewaybill/hsn-details', {
        params: { hsncode },
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
      <h3>2. Get HSN Details</h3>
      <form onSubmit={handleSearch} style={formStyle}>
        <div>
          <label>HSN Code:</label>
          <input
            type="text"
            value={hsncode}
            onChange={(e) => setHsncode(e.target.value)}
            placeholder="e.g. 100610"
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Fetching...' : 'Get Details'}
        </button>
      </form>
      <ResponseViewer response={response} />
    </div>
  );
}
export default GetHsnDetails;