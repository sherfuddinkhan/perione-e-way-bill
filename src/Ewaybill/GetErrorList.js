import React, { useState } from 'react';
import axios from 'axios';

const ErrorList=()=> {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('http://localhost:5000/api/ewaybill/error-list');
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
      <h3>4. Get Error List</h3>
      <button onClick={handleFetch} disabled={loading} style={buttonStyle}>
        {loading ? 'Loading Error List...' : 'Fetch Error List'}
      </button>
      <ResponseViewer response={response} />
    </div>
  );
}
export default ErrorList;