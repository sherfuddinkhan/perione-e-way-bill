import React from "react";

const Dashboard = () => {
const stats = [
{ title: "Total APIs", value: 26 },
{ title: "Generated EWB", value: 120 },
{ title: "Cancelled", value: 5 },
{ title: "Pending", value: 12 },
];

return (
<div style={{ padding: 20 }}>
<h1 style={{ color: "#1A73E8", marginBottom: 10 }}>
E-Way Bill Dashboard </h1>
<p style={{ color: "#555", marginBottom: 20 }}>
Manage all 26 E-Way Bill APIs from one place. </p>

```
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 20,
      marginBottom: 30,
    }}
  >
    {stats.map((stat, index) => (
      <div
        key={index}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#555" }}>{stat.title}</h3>
        <h2 style={{ color: "#1A73E8", fontSize: 32 }}>{stat.value}</h2>
      </div>
    ))}
  </div>

  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2 style={{ color: "#1A73E8", marginBottom: 15 }}>
      Available E-Way Bill APIs
    </h2>
    <p style={{ color: "#555" }}>
      Use the sidebar to access Authentication, E-Way Bill Core, Actions,
      Fetch APIs, Masters, and Multi Vehicle Movement APIs.
    </p>
  </div>
</div>
);
};

export default Dashboard;
