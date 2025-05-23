import React, { useState, useEffect } from "react";
import { getDb, escapeSqlString } from "../db/pglite";

function isSelect(sql) {
  return /^\s*select\b/i.test(sql);
}
function isMutating(sql) {
  return /^\s*(insert|update|delete)\b/i.test(sql);
}

export default function SQLConsole({ onDbChange }) {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch recent command history on mount and after execution
  const fetchHistory = async () => {
    const db = await getDb();
    const res = await db.query(
      "SELECT command FROM sql_history ORDER BY id DESC LIMIT 10"
    );
    setHistory(res.rows.map(row => row.command));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

   // Handle query execution and notify if DB is mutate
  const handleExec = async e => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const db = await getDb();
      await db.query(
        `INSERT INTO sql_history (command) VALUES ('${escapeSqlString(sql)}')`
      );
      let res = await db.query(sql);
      setResult(res);

      if (onDbChange && isMutating(sql)) {
        onDbChange();
      }
      await fetchHistory();
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="sql-console-container" style={{ marginTop: 32 }}>
      <h2>SQL Console</h2>
      <form onSubmit={handleExec}>
        <textarea
          rows={3}
          cols={60}
          value={sql}
          onChange={e => setSql(e.target.value)}
          placeholder="Enter SQL command"
        />
        <br />
        <button type="submit">Execute</button>
      </form>
      {(result || error) && (
        <div style={{ marginTop: 20 }}>
          {error && <div className="error" style={{ color: "red" }}>{error}</div>}
          <strong>Result:</strong>
          {result && isSelect(sql) && (
            <pre className="json-result">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          {result && !isSelect(sql) && (
            <div className="success">
              Statement executed.
              <pre className="json-result">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      {history.length > 0 && (
        <div className="sql-history">
          <strong>Recent Commands:</strong>
          <div className="sql-history-commands">
            {history.map((cmd, i) => (
              <div
                key={i}
                className="history-command"
                onClick={() => setSql(cmd)}
                title="Click to reuse"
                style={{ cursor: "pointer" }}
              >
                {cmd}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
