import React, { useState } from "react";
import { getDb, buildInsertPatientSQL } from "../db/pglite";
import { patientFields } from "../db/PatientSchema";

export default function PatientForm({ onRegister }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(patientFields.map(f => [f.name, ""]))
  );
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const db = await getDb();
      const sql = buildInsertPatientSQL(form);
      await db.query(sql);
      setForm(Object.fromEntries(patientFields.map(f => [f.name, ""])));
      onRegister && onRegister();
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="patient-form-container">
      <h2>Register Patient</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        {patientFields.map(f => (
          <div key={f.name} style={{ marginBottom: 8 }}>
            <label>
              {f.label}
              {f.required && <span style={{ color: "red" }}>*</span>}
              {f.type === "select" ? (
                <select
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required={f.required}
                >
                  <option value="" disabled hidden>
                    {f.placeholder || "Select an option"}
                  </option>
                  {f.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required={f.required}
                  type={f.type}
                  placeholder={f.placeholder || ""}
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit">Add Patient</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
