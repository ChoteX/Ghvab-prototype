# Project Overview

The **Ghvab-prototype** repository contains four separate projects that need to be unified into a single prototype, according to the provided design diagram (see `screenshot.png` in the repository). Before starting any coding work, inspect the repository structure and understand the purpose of each folder:

| Folder | Purpose |
|--------|---------|
| **prepo** | A Vite + React (TypeScript) front-end with TailwindCSS and shadcn/ui components. It currently provides a landing page with login, a search bar for institutions, and a carousel of textbook previews. The `src` folder contains pages, components, hooks, and an integration with Supabase for authentication and persistent storage. |
| **latexs** | A collection of LaTeX source files for a single book. It has three subfolders: `excersices` (spelled that way in the repo), `tests` and `theory`. Each `.tex` file contains Georgian mathematics content, structured with `\section` and `\subsection` commands. These files should be rendered directly in the UI using KaTeX rather than converted to JSON. |
| **katex** | A local copy of the KaTeX distribution (CSS, JS and fonts). This folder should be used to load the KaTeX library into the front-end so that LaTeX from the `latexs` folder can be rendered on the page. |
| **georgian-math-test-generator** | Another Vite + React project which acts as a wrapper around the Gemini API. It includes a `services/geminiService.ts` that defines an async function `generateTestSamples(existingTestLatex: string): Promise<string>` which sends a prompt to the Gemini 2.5 Pro model and returns a new LaTeX script of similar difficulty. This project also contains simple components for text input and output, but those UIs will not be reused—only the service function is needed. |

Your goal is to combine these pieces into a single web application that allows users to browse coursebooks, view theory and exercises directly from LaTeX files, and generate new quizzes/tests via Gemini. **Do not modify existing files directly in this step**; instead, provide detailed instructions for ChatGPT Codex to implement the integration. The instructions should describe the desired architecture and behaviour but refrain from writing actual code.

---

## Unifying the projects

1. **Consolidate into one Vite project** – Use the `prepo` project as the base of the new application because it already has a polished landing page and Supabase integration. Copy the `georgian-math-test-generator/services/geminiService.ts` file into `prepo/src/services/geminiService.ts`. Copy the `katex` folder into the `prepo/public` directory or install KaTeX via npm; the local files ensure the app works offline.
   - Treat `prepo` as the new repository root: move any shared configuration (e.g. `.gitignore`, root `README`) up one level so that `npm install`, `npm run dev`, and future CI all execute from `prepo`.
   - Add a `src/services` directory if it does not already exist and place `geminiService.ts` there. Ensure imports throughout the app use the `@/services/geminiService` alias.
   - Audit `package.json` to confirm dependencies used across the merged projects are present (React Router, Supabase, KaTeX if you install from npm, Zustand or other state manager you choose, shadcn/ui peer dependencies). Remove scripts that no longer apply to the unified project.
   - Remove redundant project folders (`georgian-math-test-generator`, `latexs`, `katex`) once their contents are copied, to avoid confusion for future contributors. Update `.gitignore` accordingly.

2. **Move LaTeX assets** – Move the `latexs` folder into `prepo/public/latexs` so that the LaTeX files can be fetched at runtime. Each subfolder corresponds to one type of content:
   - `public/latexs/theory` – theoretical chapters of the book.
   - `public/latexs/excersices` – exercise sets.
   - `public/latexs/tests` – existing tests.
   
   Provide a mapping between a book identifier (e.g., `bookId` or `slug`) and the filenames in these directories. This mapping can be hard-coded in a JSON file (e.g., `book-index.json`) stored in `public` and loaded on startup.
   - Each book entry in the index should define the theory/exercise/test file names, a friendly display name, grade, subject, cover image path, and an ordered list of topics with references to the LaTeX assets. This JSON becomes the single source of truth for menus, filters, and quiz topic selection.
   - Keep the LaTeX filenames stable and prefer lowercase-with-dashes so URLs remain predictable. Document the naming convention inside the JSON file for future contributors.

3. **Set up environment variables** – In the root of the unified project, create a `.env` file containing:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` – values copied from Supabase. The `prepo/src/integrations/supabase/client.ts` already reads these variables.
   - `VITE_GEMINI_API_KEY` – the API key for Gemini. Update `geminiService.ts` so that it reads `import.meta.env.VITE_GEMINI_API_KEY` instead of the hard-coded `INSERT_GEMINI_API_KEY`.
   - Add a checked-in `.env.example` mirroring the required variables so newcomers understand the configuration surface area. Reference it from the `README`.
   - If you install KaTeX via npm instead of copying assets, capture the exact version in `package.json` and ensure Vite is configured to copy fonts at build time (e.g. via `vite.config.ts` `build.rollupOptions`).

4. **Authentication and user data** – Extend the Supabase schema to store user progress and quiz history. Use tables such as:
   - `book_progress` with columns `user_id`, `book_id`, `sections_completed` (array of strings or integers referencing section headings), and `updated_at`.
   - `quiz_history` with columns `user_id`, `book_id`, `generated_at`, `topics` (array), `num_questions`, `difficulty`, and `score` (optional).
   
   Create a `user-accounts` service in `src/services/userAccounts.ts` that wraps Supabase calls for registering new users (`auth.signUp()`), logging in (`auth.signInWithPassword()`), retrieving progress, updating progress, recording quiz history, and fetching past quiz scores.
   - Model `institutions` and an `institution_books` join table so the landing page can restrict book visibility per school. Seed these tables through Supabase SQL or via the dashboard before testing.
   - Use Supabase Row Level Security: only allow authenticated users to access their own `book_progress` and `quiz_history` rows. Document the policies inside `supabase/policies.sql` (or similar) so they can be reapplied.
   - Expose helper methods in `userAccounts.ts` for logout, password reset flow, and retrieving the active user session to keep auth state consistent across routes.

---

## Main page modifications

5. **Login/Sign-up flows** – Replace the current "Sign In" and "Sign Up" buttons with pages that use Supabase authentication. For sign up, ask only for an email and password, then call `supabase.auth.signUp({ email, password })`. For login, ask for email and password and call `supabase.auth.signInWithPassword()`. After successful authentication, redirect to the main page.
   - Create dedicated pages under `src/pages/auth/SignIn.tsx` and `src/pages/auth/SignUp.tsx`. Route to them via React Router and update `Navbar.tsx` to show contextual actions (login button when signed out, account menu and logout when signed in).
   - Implement a `ProtectedRoute` wrapper that checks for an authenticated user before rendering any `/books` routes. While the auth state is resolving, show a loading spinner to avoid flashes of protected content.
   - Wire toast notifications (using the existing Toaster) for success/error states on auth requests. Handle Supabase error codes gracefully (invalid credentials, rate limits).

6. **Book cards with progress & quiz generator** – The existing carousel of textbooks should be replaced with a grid or carousel of book cards. Each card shows the book cover, title, and a progress bar. On hover (desktop) or tap (mobile), reveal an overlay containing:
   - **Progress bar details**: display "X of Y sections completed" pulled from Supabase via `book_progress`.
   - **Average quiz score**: fetch from `quiz_history` and compute the average.
   - **Quiz generator form**: allow the user to select topics (list of sections or paragraphs, loaded from `book-index.json`), choose the number of exercises (e.g., 5–20), and pick a difficulty level from 1 (low) to 5 (high). Use a dropdown or slider for each. Include a "Generate Quiz" button. When the form is submitted, call a handler that sends the selected LaTeX segments to `generateTestSamples` in `geminiService.ts`. Show a loading spinner while awaiting the response. Once generated, navigate to a new Test Page (see below) and render the returned LaTeX.
   - Refactor `src/components/BookCard.tsx` so it accepts structured props (`progress`, `averageScore`, `onGenerateQuiz`). The overlay should include call-to-action buttons that map to the new routes: "Continue Theory", "Continue Exercises", "View Tests".
   - Replace the `BookRow` scroller in `SchoolSearch.tsx` with a responsive grid driven by the Supabase book list. If you still want a carousel, wrap the grid in a scroll container but keep the same data source.
   - Ensure the quiz generator form persists the last selections per user (e.g., store in Supabase or local state) so they can quickly regenerate similar quizzes.

7. **Search and browse institutions** – Keep the existing `SchoolSearch` component but modify it so that it either searches for schools or directly filters the list of available books. Ensure that after login the user is taken to their institution's book list (if multiple institutions exist). This logic can be implemented via a Supabase table of institutions and their assigned books.
   - Remove the static arrays in `src/data/schools.ts` and `src/data/textbooks.ts`. Replace them with Supabase queries (potentially cached via React Query) and fall back to skeleton loaders while data is fetched.
   - Update the component to respect the logged-in user's default institution but still allow switching if their account is linked to multiple schools.
   - Provide an empty state card that suggests the user contact support if no textbooks are assigned, linking to a placeholder help page.

---

## Textbook pages

8. **Navigation layout** – Create three React pages: `BookTheoryPage`, `BookExercisesPage` and `BookTestPage`, all under `src/pages`. Each page accepts a `bookId` parameter from the URL. At the top of each page, include a header bar with navigation buttons: "Theory", "Exercises", "Test", and "Back to Main". Clicking these buttons uses React Router to switch between the three views while preserving `bookId`.
   - Co-locate shared layout pieces (header, breadcrumbs, book metadata) in a `BookLayout` component under `src/pages/books/components`. Pass the rendered child content as `props.children`.
   - Include a sticky sidebar (or top tabs on mobile) that lists the table of contents generated from the LaTeX metadata to make navigation consistent across the three routes.

9. **Loading and rendering LaTeX** – Implement a `LatexLoader` service in `src/services/latexLoader.ts` which fetches the appropriate `.tex` file from `/latexs/theory`, `/latexs/excersices`, or `/latexs/tests` based on `bookId` and page type. Use `fetch()` to get the raw text, then call KaTeX to convert it to HTML. The KaTeX distribution lives in the `public/katex` folder – include the CSS via `<link>` in `index.html` and load the JS module in a utility file:

   ```typescript
   import katex from 'katex';
   
   export function renderLatexToHtml(latex: string): string {
     return katex.renderToString(latex, { 
       throwOnError: false, 
       displayMode: true 
     });
   }
   ```

   In each textbook page, call `LatexLoader` to get the LaTeX string, convert it to HTML, and set it via `dangerouslySetInnerHTML`. Use CSS to style headings, paragraphs and math blocks consistently.

10. **Table of contents & scrolling** – Parse the LaTeX text to extract `\section{}` and `\subsection{}` headings using a simple regular expression. Build a table of contents sidebar listing these headings. Each entry should link to an anchor in the rendered content. Use the React `useEffect` hook along with `IntersectionObserver` to update the user's progress: whenever a heading becomes visible, mark that section as completed and save the updated `sections_completed` array to Supabase.
    - Persist the parsed headings to local state so the book pages can re-use them for navigation, progress tracking, and quiz topic selection without reparsing the LaTeX on every interaction.
    - Debounce progress updates so that scrolling quickly through a page does not spam Supabase. Batch updates using React Query mutations or a custom queue.

11. **Exercises page enhancements** – Below the rendered exercises, add a call-to-action card: "Generate new test from these exercises". Clicking this should pass the entire exercises LaTeX string into `generateTestSamples()` and append the returned LaTeX below the original exercises. Also insert a record into `quiz_history` with metadata about the generated quiz (use difficulty = inferred from the number of steps in the problems, or let the user select difficulty as part of the action). Display the newly generated test using KaTeX just like the existing exercises.
    - Give users the option to save generated tests as favourites. Store a `saved_quizzes` table keyed by `quiz_history_id` if you add this feature, and surface a toggle in the UI.
    - Provide buttons beside each generated quiz allowing them to export the LaTeX (`Blob` download) or copy the content to clipboard.

---

## Test generation and display

1. **Test Page** – Create a `BookTestPage` component that displays generated quizzes. It should show the topics selected, the number of questions and difficulty level. Underneath, render the LaTeX from the AI generator. Provide options to download the LaTeX file or to print the test. After the user completes or reviews the quiz, allow them to mark it as completed and optionally input a score. Save this data to `quiz_history`.
   - Structure the page into two columns on desktop: metadata + actions on the left, rendered LaTeX on the right. Collapse to a single column on mobile.
   - When the user records a score, immediately update the progress summary on the main page (e.g., by invalidating the relevant React Query cache key).

2. **Calling the Gemini API** – In `geminiService.ts`, ensure that the `API_KEY` is read from `import.meta.env.VITE_GEMINI_API_KEY`. Expose two functions:
   - `generateTestSamples(existingLatex: string): Promise<string>` – uses the current prompt to generate 10 new problems similar to the input. Already implemented; integrate into the UI.
   - `generateTestFromTopics(topics: string[], numQuestions: number, difficulty: number): Promise<string>` – build a new prompt that combines selected LaTeX snippets (by concatenating the LaTeX of the chosen sections). In the prompt tell Gemini to create the specified number of questions at the requested difficulty level. Catch errors and propagate them to the UI so that users see meaningful error messages.
   - Centralise Gemini request logging: create a lightweight telemetry helper that records request metadata (duration, success/failure) to Supabase or `console.info` in development. Use this to monitor rate limits.
   - Guard against duplicate submissions by storing an in-flight identifier per user; ignore new requests until the previous one finishes or the user cancels it.

3. **Loading indicators & error handling** – Whenever a test is being generated, show a spinner or loading bar. Disable the generate button to prevent duplicate requests. If the API returns an error or invalid LaTeX, display a user-friendly error message and log the error for debugging.
   - Provide a "Report an issue" link that opens a modal where users can flag malformed LaTeX. Store these reports in Supabase for follow-up.
   - When rendering the returned LaTeX, wrap it in a collapsible container so users can hide older generations while keeping the page organised.

---

## User data and state management

4. **Persisting state** – Use React Context or a state management library (e.g. Zustand) to hold the authenticated user, list of books, progress information and quiz history. Fetch these from Supabase on login and cache them in the client. Provide hooks such as `useBooks()`, `useProgress(bookId)`, `useQuizHistory(bookId)` to encapsulate the logic of retrieving and updating data.
   - Create a `src/store/appStore.ts` (or similar) that exposes selectors for auth status, active institution, and current book. Wrap the app in the store provider within `main.tsx`.
   - Bridge the store with React Query by invalidating cache keys when mutations succeed, so server state and client state stay in sync.
   - Persist lightweight preferences (preferred difficulty, last-opened section) to `localStorage` via the store to improve usability between sessions.

5. **Tracking progress** – On each section of a textbook, when the user scrolls past a heading or spends more than a predefined time on a page, update the `sections_completed` array. Save the progress to Supabase either in real-time or periodically (e.g. when the user navigates away). Use optimistic UI updates so the progress bar on the main page reflects the most recent reading state.
   - Store timestamps for when a section was first viewed and most recently reviewed. Display these in a tooltip on the progress bar for additional insight.
   - Provide a manual "Mark section as complete" button in case automatic detection misses a section.

6. **Quiz history dashboard** – Add a page or modal where users can review past quizzes. Each entry should show the date generated, selected topics, number of questions, difficulty, and score (if recorded). Provide buttons to re-open a past quiz, export its LaTeX or delete the entry. Aggregate statistics (average score, total quizzes taken) can also be shown on the main page overlay.
   - Link to this dashboard from the navbar ("My Quizzes") and from each book card overlay.
   - Allow filtering by book and difficulty. Surface pagination if the history grows large.

---

## Additional considerations

- **Routing** – Use React Router (already installed in `prepo`) to handle all navigation. Define routes for `/signin`, `/signup`, `/books`, `/books/:bookId/theory`, `/books/:bookId/exercises`, and `/books/:bookId/test`.

- **Accessibility** – Ensure that all interactive elements (buttons, form inputs) have accessible labels and that the site supports keyboard navigation. Provide ARIA attributes for the progress bars and overlays.

- **Internationalisation** – While the current content is in Georgian, structure your components so that labels and UI text can be easily localised in the future. Use a simple i18n solution or store strings in a constants file.

- **Code organisation** – Do not leave unused files from the original `georgian-math-test-generator` project. Only keep `geminiService.ts` (adapted), and delete other redundant components. Similarly, remove the old JSON builder logic in `prepo` once LaTeX rendering is implemented.
 
- **Testing & linting** – Add unit coverage where practical (e.g., parsing LaTeX headings, Gemini prompt builders) and keep `npm run lint`/`npm run test` passing. Capture manual QA steps (sign in/out, content rendering, quiz generation) in the README so the product team can verify quickly.
- **Documentation** – Update `README.md` to reflect the unified architecture, include setup instructions for Supabase migrations, and describe how to update the LaTeX library when new textbooks are added.

---

## Running the prototype

1. Install dependencies in the root of the unified project:
   ```bash
   npm install
   ```

2. Populate the `.env` file with Supabase and Gemini credentials. Run the development server with:
   ```bash
   npm run dev
   ```

3. Create an initial Supabase database with the `book_progress` and `quiz_history` tables. Seed supporting tables (`institutions`, `institution_books`, `books`) and grant access policies before running the app locally.

4. Open the site in your browser. Sign up with a test account, browse the available textbooks, read the theory sections, generate exercises and tests, and verify that progress and quiz history are tracked correctly.
   - Confirm the following smoke tests: login/logout flow, book selection filtered by institution, LaTeX renders correctly on all three book pages, Gemini responds to both generation pathways, progress syncs on scroll, quiz history list updates after each generation.
   - If Supabase or Gemini calls fail, ensure the UI surfaces actionable error states and does not leave the spinner stuck.

---
