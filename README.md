Patient Registration App: A React + PGlite application for registering and managing patient records.

🚀 Features
1. Patient Registration Form:
   Register patients with fields for name, email, phone, date of birth (calendar input), gender, and address.

2. Field Validation:
   All fields are validated, including robust checks.

3. Real-time Sync:
   Patient data syncs across browser tabs using BroadcastChannel.

4. SQL Data Integrity:
   Database schema enforces correct date format and non-null constraints.

5. User Experience:
   All form fields include helpful placeholders and error messages.

📝 Setup Instructions
1. Clone the repository: git clone https://github.com/ayush-git228/patient-registration-system.git

   cd patient-app

3. Install dependencies: npm install

4. Start the development server: npm run dev  or  npm start

5. Vite will open the web apllication now:

6. 🧑‍💻 Usage
- Fill out the registration form to add a patient.

- All fields are required and validated in real time.

- Date of birth uses a calendar picker and is validated for correct format and logical value.

- Patient list updates instantly across all open tabs.

6. 🌐 Deployment
  This app is deployed at: https://patient-registration-system.vercel.app


🚧 Challenges Faced
1. Service Worker Integration
   Issue: Pglite didn't supported multi tab sync on it's own so used service workers but it increased complexity and was showing inconsistent results.

   Resolution: Switched to BroadcastChannel API for real-time cross-tab synchronization, avoiding service worker complexity.

2. PGlite (SQLite in Browser) Configuration
   Issue: Runtime errors occurred because Vite’s bundler tried to optimize @electric-sql/pglite, breaking its Web Worker initialization .

   Fix: Excluded PGlite from Vite’s dependency optimizations:

3. SQL Constraints and Type Checks
   Dynamic Typing Issues: SQLite’s flexible typing allowed invalid data (e.g., strings in numeric fields) .

   Mitigations: 
   - Added CHECK constraints to enforce data integrity (e.g., valid DOB ranges).

   - Implemented application-layer validation in React forms.

4. Data Lost on every Page Refresh
   Issue: PGlite was running in in-memory mode, so was not persistent on refresh.
   Fix: Switching to IndexedDB-backed storage (idb://) made the data persist across sessions, ensuring user information is retained even after reloading or closing the browser.
