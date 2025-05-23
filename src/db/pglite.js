import { PGlite } from "@electric-sql/pglite";
import { patientFields } from "./PatientSchema";

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  dbInstance = await PGlite.create("idb://patients-db");  // standard as per the doc
  return dbInstance;
}

// Initializing tables if they don't exist (DO NOT DROP TABLES!)
export async function initDb() {
  const db = await getDb();
  await db.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      dob DATE NOT NULL,
      gender TEXT NOT NULL,
      registered_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS sql_history (
      id SERIAL PRIMARY KEY,
      command TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

// Helper func. for form inserts
export function buildInsertPatientSQL(form) {
  const columns = patientFields.map(f => f.name);
  const values = columns.map(f => `'${String(form[f]).replace(/'/g, "''")}'`).join(", ");
  return `INSERT INTO patients (${columns.join(", ")}) VALUES (${values})`;
}

export function escapeSqlString(str) {
  return String(str).replace(/'/g, "''");
}

// used during multi tab when we have to reset DB instance to force reload from IndexedDB
export function resetDb() {
  dbInstance = null;                  
}
