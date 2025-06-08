<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Coding Best Practices Checklist</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: #f9f9f9;
    color: #222;
  }
  h1, h2 {
    color: #005a9c;
  }
  section {
    background: white;
    margin-bottom: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
  }
  ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  li {
    margin-bottom: 6px;
  }
  button {
    background: #005a9c;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
  }
  button:hover {
    background: #004080;
  }
  pre {
    background: #eee;
    padding: 12px;
    border-radius: 5px;
    max-height: 320px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
</head>
<body>

<h1>✅ Coding Best Practices Checklist</h1>

<button id="copyBtn">Copy All Checklist</button>

<pre id="checklistText" style="display:none;">
🧠 Core Principles
- One Centralized Reusable Logic: Write functions/utilities in a single place and reuse them throughout the app.
- Avoid Hardcoding — Use Constants: Store values like URLs, strings, and keys in a constants file or .env file.

✨ Recommended Professional Practices
- Keep Code DRY (Don’t Repeat Yourself): Avoid duplicating logic. Reuse functions, components, and constants.
- Use Meaningful Names: Use clear, descriptive names for variables, functions, and files.
- Write Small, Focused Functions: Each function should do one thing well.
- Consistent Code Formatting: Use a linter (e.g., ESLint) and formatter (e.g., Prettier).
- Handle Errors Gracefully: Use proper error handling (try-catch, fallback logic, user-friendly messages).
- Comment Why, Not What: Explain why something is done, not just what it does.
- Organize Files and Folders Clearly: Use a logical structure (/components, /utils, /services, /constants).
- Use Environment Variables: Store sensitive or environment-specific values in .env.
- Version Control with Git: Use clear commit messages and commit regularly.
- Write Tests (When Applicable): Add unit/integration tests to improve reliability and support refactoring.
- Keep It Simple (KISS Principle): Avoid unnecessary complexity. Solve the problem in the simplest way possible.
- Avoid Global Variables: Minimize use of global state to prevent conflicts and hard-to-find bugs.
- Code Reviews and Pair Programming: Collaborate with others, get feedback, and improve together.

⚛️ React Performance Best Practices
- Avoid Anonymous Functions in JSX.
- Use memo and useCallback hooks to optimize renders.
- Lazy Load Components and implement Code Splitting.
- Optimize Re-renders by managing dependencies.
- Use React Profiler to identify bottlenecks.
- Use Debouncing and Throttling for expensive events.
- Optimize Images for performance and size.
- Use Virtualization (e.g., react-window) for large lists.
- Reduce Bundle Size with tree shaking and dynamic imports.
- Consider SSR for performance.
- Network Performance Optimization (e.g., caching, CDN).

🪝 React Hooks Best Practices
- Keep React State Immutable.
- Don't use useState for everything; consider server state (React Query), URL state (useLocation), or localStorage.
- Compute derived values without extra state or effects.
- Use unique keys (e.g., crypto-random UUID).
- Never forget dependencies in useEffect; useEffect should be last in your hooks list.

🖥️ Responsive Design Best Practices
- Use flexible layouts (Flexbox/Grid).
- Use relative units (%, rem, em) instead of fixed px.
- Test on multiple devices and screen sizes (mobile, tablet, desktop).
- Use CSS media queries to adapt UI.
- Optimize touch targets for mobile.
- Use viewport meta tag properly.
- Optimize images for different screen densities.
- Avoid horizontal scrolling.
- Use mobile-first design approach.

🔧 Backend (Node.js / Express) & RESTful API Best Practices
- Organize routes, controllers, services, models separately.
- Use environment variables for config and secrets.
- Modularize code with single responsibility functions.
- Centralized error handling middleware with proper HTTP status codes.
- Use async/await; avoid callback hell.
- Validate and sanitize input data (Joi, express-validator).
- Implement logging (Winston, Morgan).
- Follow RESTful endpoint conventions (GET, POST, PUT, DELETE).
- Implement pagination and filtering.
- Use rate limiting and throttling.
- Secure APIs with JWT/OAuth authentication and authorization.
- Use Helmet and CORS for security.
- API versioning for backward compatibility.
- Document APIs (OpenAPI/Swagger).
- Use Postman/Insomnia for manual API testing.
- Graceful error handling and logging.

🛡️ Backend Security
- Sanitize inputs to prevent injections.
- Hash passwords securely (bcrypt).
- Use HTTPS in production.
- Handle exceptions gracefully; do not leak sensitive info.
- Implement CSRF protection if applicable.
- Limit detailed error messages in production.

🗄️ Database (MongoDB Atlas) Best Practices
- Define schemas and validation with Mongoose.
- Index frequently queried fields.
- Use lean queries when methods are not needed.
- Project only needed fields to reduce data size.
- Monitor performance via Atlas dashboard.
- Use connection pooling and timeout settings.
- Handle DB errors and reconnect logic.
- Regular backups and disaster recovery plans.
- Use environment variables for credentials.
- Avoid embedding large arrays; prefer references.

🧹 Avoiding Technical Debt
- Write clean, readable, well-documented code.
- Refactor regularly.
- Keep dependencies up to date.
- Automate testing and deployment.
- Avoid premature optimization.
- Review and update documentation.
- Use code linters and formatters.
- Regularly review and prune unused code.
</pre>

<section>
  <h2>🧠 Core Principles</h2>
  <ul>
    <li>One Centralized Reusable Logic: Write functions/utilities in a single place and reuse them throughout the app.</li>
    <li>Avoid Hardcoding — Use Constants: Store values like URLs, strings, and keys in a constants file or .env file.</li>
  </ul>
</section>

<section>
  <h2>✨ Recommended Professional Practices</h2>
  <ul>
    <li>Keep Code DRY (Don’t Repeat Yourself): Avoid duplicating logic. Reuse functions, components, and constants.</li>
    <li>Use Meaningful Names: Use clear, descriptive names for variables, functions, and files.</li>
    <li>Write Small, Focused Functions: Each function should do one thing well.</li>
    <li>Consistent Code Formatting: Use a linter (e.g., ESLint) and formatter (e.g., Prettier).</li>
    <li>Handle Errors Gracefully: Use proper error handling (try-catch, fallback logic, user-friendly messages).</li>
    <li>Comment Why, Not What: Explain why something is done, not just what it does.</li>
    <li>Organize Files and Folders Clearly: Use a logical structure (/components, /utils, /services, /constants).</li>
    <li>Use Environment Variables: Store sensitive or environment-specific values in .env.</li>
    <li>Version Control with Git: Use clear commit messages and commit regularly.</li>
    <li>Write Tests (When Applicable): Add unit/integration tests to improve reliability and support refactoring.</li>
    <li>Keep It Simple (KISS Principle): Avoid unnecessary complexity. Solve the problem in the simplest way possible.</li>
    <li>Avoid Global Variables: Minimize use of global state to prevent conflicts and hard-to-find bugs.</li>
    <li>Code Reviews and Pair Programming: Collaborate with others, get feedback, and improve together.</li>
  </ul>
</section>

<section>
  <h2>⚛️ React Performance Best Practices</h2>
  <ul>
    <li>Avoid Anonymous Functions in JSX.</li>
    <li>Use memo and useCallback hooks to optimize renders.</li>
    <li>Lazy Load Components and implement Code Splitting.</li>
    <li>Optimize Re-renders by managing dependencies.</li>
    <li>Use React Profiler to identify bottlenecks.</li>
    <li>Use Debouncing and Throttling for expensive events.</li>
    <li>Optimize Images for performance and size.</li>
    <li>Use Virtualization (e.g., react-window) for large lists.</li>
    <li>Reduce Bundle Size with tree shaking and dynamic imports.</li>
    <li>Consider SSR for performance.</li>
    <li>Network Performance Optimization (e.g., caching, CDN).</li>
  </ul>
</section>

<section>
  <h2>🪝 React Hooks Best Practices</h2>
  <ul>
    <li>Keep React State Immutable.</li>
    <li>Don't use useState for everything; consider server state (React Query), URL state (useLocation), or localStorage.</li>
    <li>Compute derived values without extra state or effects.</li>
    <li>Use unique keys (e.g., crypto-random UUID).</li>
    <li>Never forget dependencies in useEffect; useEffect should be last in your hooks list.</li>
  </ul>
</section>

<section>
  <h2>🖥️ Responsive Design Best Practices</h2>
  <ul>
    <li>Use flexible layouts (Flexbox/Grid).</li>
    <li>Use relative units (%, rem, em) instead of fixed px.</li>
    <li>Test on multiple devices and screen sizes (mobile, tablet, desktop).</li>
    <li>Use CSS media queries to adapt UI.</li>
    <li>Optimize touch targets for mobile.</li>
    <li>Use viewport meta tag properly.</li>
    <li>Optimize images for different screen densities.</li>
    <li>Avoid horizontal scrolling.</li>
    <li>Use mobile-first design approach.</li>
  </ul>
</section>

<section>
  <h2>🔧 Backend (Node.js / Express) & RESTful API Best Practices</h2>
  <ul>
    <li>Organize routes, controllers, services, models separately.</li>
    <li>Use environment variables for config and secrets.</li>
    <li>Modularize code with single responsibility functions.</li>
    <li>Centralized error handling middleware with proper HTTP status codes.</li>
    <li>Use async/await; avoid callback hell.</li>
    <li>Validate and sanitize input data (Joi, express-validator).</li>
    <li>Implement logging (Winston, Morgan).</li>
    <li>Follow RESTful endpoint conventions (GET, POST, PUT, DELETE).</li>
    <li>Implement pagination and filtering.</li>
    <li>Use rate limiting and throttling.</li>
    <li>Secure APIs with JWT/OAuth authentication and authorization.</li>
    <li>Use Helmet and CORS for security.</li>
    <li>API versioning for backward compatibility.</li>
    <li>Document APIs (OpenAPI/Swagger).</li>
    <li>Use Postman/Insomnia for manual API testing.</li>
    <li>Graceful error handling and logging.</li>
  </ul>
</section>

<section>
  <h2>🛡️ Backend Security</h2>
  <ul>
    <li>Sanitize inputs to prevent injections.</li>
    <li>Hash passwords securely (bcrypt).</li>
    <li>Use HTTPS in production.</li>
    <li>Handle exceptions gracefully; do not leak sensitive info.</li>
    <li>Implement CSRF protection if applicable.</li>
    <li>Limit detailed error messages in production.</li>
  </ul>
</section>

<section>
  <h2>🗄️ Database (MongoDB Atlas) Best Practices</h2>
  <ul>
    <li>Define schemas and validation with Mongoose.</li>
    <li>Index frequently queried fields.</li>
    <li>Use lean queries when methods are not needed.</li>
    <li>Project only needed fields to reduce data size.</li>
    <li>Monitor performance via Atlas dashboard.</li>
    <li>Use connection pooling and timeout settings.</li>
    <li>Handle DB errors and reconnect logic.</li>
    <li>Regular backups and disaster recovery plans.</li>
    <li>Use environment variables for credentials.</li>
    <li>Avoid embedding large arrays; prefer references.</li>
  </ul>
</section>

<section>
  <h2>🧹 Avoiding Technical Debt</h2>
  <ul>
    <li>Write clean, readable, well-documented code.</li>
    <li>Refactor regularly.</li>
    <li>Keep dependencies up to date.</li>
    <li>Automate testing and deployment.</li>
    <li>Avoid premature optimization.</li>
    <li>Review and update documentation.</li>
    <li>Use code linters and formatters.</li>
    <li>Regularly review and prune unused code.</li>
  </ul>
</section>

</body>
</html>
