import React, { useEffect, useState } from "react";
import { initDb } from "./db/pglite";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import SQLConsole from "./components/SQLConsole";
import Loader from "./components/Loader"; 
import useBroadcastChannel from "./multi-tab-sync/BroadcastChannel";
import { resetDb } from "./db/pglite";

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  // Initialized database on first render
  useEffect(() => {
    initDb()
      .then(() => setReady(true))
      .catch(err => {
        setError(err);
        setReady(true);
      });
  }, []);

  // Seting up BroadcastChannel listener once
  const post = useBroadcastChannel("patients-db-sync", (event) => {
    if (event.data === "refresh") {
      resetDb(); // Reset DB instance to force reload from IndexedDB
      setRefresh(r => r + 1); // Trigger UI update
    }
  });

  // Callback to refresh data and broadcast to other tabs
  const handleDbChange = () => {
    setRefresh(r => r + 1); // Local refresh
    post("refresh");        // Broadcast to other tabs
  };

  if (!ready) return <Loader message="Loading database..." />; 

  if (error) {
    return (
      <div style={{ color: "red", padding: 16 }}>
        <h2>Database Initialization Error</h2>
        <pre>{error && (error.stack || JSON.stringify(error, null, 2) || String(error))}</pre>
        <p>Check browser console for more details.</p>
      </div>
    );
  }

  return (
    <div className = "patient-app" classstyle={{ maxWidth: 700, margin: "0 auto" }}>
      <h1>Patient Registration</h1>
      
      <PatientForm onRegister={handleDbChange} />
      <PatientList refresh={refresh} />
      <SQLConsole onDbChange={handleDbChange} />
    </div>
  );
}
