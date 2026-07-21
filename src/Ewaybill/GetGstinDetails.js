import React, { useState } from 'react';
import axios from 'axios';

const GetGstinDetails=()=> {
  const [gstin, setGstin] = useState('36AARFB4347G037');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('http://localhost:5000/api/ewaybill/gstin-details', {
        params: { gstin },
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
      <h3>3. Get GSTIN Details</h3>
      <form onSubmit={handleSearch} style={formStyle}>
        <div>
          <label>GSTIN:</label>
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            placeholder="e.g. 36AARFB4347G037"
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
export default GetGstinDetails;