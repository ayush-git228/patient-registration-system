import React, { useEffect, useState } from "react";
import { getDb } from "../db/pglite";
import { patientFields } from "../db/PatientSchema";

export default function PatientList({ refresh }) {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  // Fetching patients from DB whenever 'refresh' changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = await getDb();
        const result = await db.query("SELECT * FROM patients ORDER BY id DESC");
        console.log("Loaded patients:", result.rows);
        if (mounted) setPatients(result.rows || []);
      } catch (err) {
        setError(err.message || String(err));
        setPatients([]);
      }
    })();
    return () => { mounted = false; };
  }, [refresh]);

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!patients.length)
    return <div style={{ margin: "16px 0", color: "#555" }}>No patients registered yet.</div>;

  return (
    <div className="patients-table-container">
      <h2>Registered Patients</h2>
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            {patientFields.map(f => <th key={f.name}>{f.label}</th>)}
            <th>Registered on</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              {patientFields.map(f => <td key={f.name}>{row[f.name]}</td>)}
              <td>{String(row.registered_at).slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
