import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AuthenticationApi = () => {
const navigate = useNavigate();
const { login } = useAuth();

const [formData, setFormData] = useState({
  email: "sherfuddin.phd@gmail.com",
  username: "Btg",
  password: "Btg@123",
  ip_address: "103.88.236.42",
  client_id: "PEWAYS3ad9cc820da802c1265893161c36b3cd",
  client_secret: "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
  gstin: "36AARFB4347G037",
  env: "sandbox",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const authenticate = async () => {
setLoading(true);
setError("");
try {
  const res = await axios.get("http://localhost:5000/api/authenticate", {
    params: {
      email: formData.email,
      username: formData.username,
      password: formData.password,
    },
    headers: {
      ip_address: formData.ip_address,
      client_id: formData.client_id,
      client_secret: formData.client_secret,
      gstin: formData.gstin,
      env: formData.env,
    },
  });

  if (res.data.status_cd === "1") {
    login(formData.gstin);
    navigate("/dashboard", { replace: true });
  } else {
    setError("Authentication failed");
  }
} catch (err) {
  setError("Authentication failed. Please check server connection.");
} finally {
  setLoading(false);
}
};

return (
<div
style={{
display: "flex",
justifyContent: "center",
alignItems: "center",
minHeight: "100vh",
background: "#f1f5f9",
padding: "20px",
}}
>
<div
style={{
background: "white",
padding: "35px",
borderRadius: "16px",
boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
width: "450px",
}}
>
<h1
style={{
color: "#1A73E8",
fontSize: "32px",
fontWeight: "bold",
textAlign: "center",
marginBottom: "10px",
}}
>
Perione E-Way Bill </h1>

```
    <h2
      style={{
        color: "#1A73E8",
        fontSize: "24px",
        textAlign: "center",
        marginBottom: "30px",
      }}
    >
      Authentication
    </h2>

    {[
      { name: "email", label: "Email", type: "email" },
      { name: "username", label: "Username", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "ip_address", label: "IP Address", type: "text" },
      { name: "client_id", label: "Client ID", type: "text" },
      { name: "client_secret", label: "Client Secret", type: "text" },
      { name: "gstin", label: "GSTIN", type: "text" },
      { name: "env", label: "Environment", type: "text" },
    ].map((field) => (
      <div key={field.name} style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            fontWeight: "bold",
            color: "#374151",
            marginBottom: "6px",
          }}
        >
          {field.label}
        </label>
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>
    ))}

    <button
      onClick={authenticate}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        background: "#1A73E8",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      {loading ? "Authenticating..." : "Authenticate"}
    </button>

    {error && (
      <p
        style={{
          color: "red",
          marginTop: "20px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {error}
      </p>
    )}
  </div>
</div>
);
};

export default AuthenticationApi;
