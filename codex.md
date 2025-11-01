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

2. **Move LaTeX assets** – Move the `latexs` folder into `prepo/public/latexs` so that the LaTeX files can be fetched at runtime. Each subfolder corresponds to one type of content:
   - `public/latexs/theory` – theoretical chapters of the book.
   - `public/latexs/excersices` – exercise sets.
   - `public/latexs/tests` – existing tests.
   
   Provide a mapping between a book identifier (e.g., `bookId` or `slug`) and the filenames in these directories. This mapping can be hard-coded in a JSON file (e.g., `book-index.json`) stored in `public` and loaded on startup.

3. **Set up environment variables** – In the root of the unified project, create a `.env` file containing:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` – values copied from Supabase. The `prepo/src/integrations/supabase/client.ts` already reads these variables.
   - `VITE_GEMINI_API_KEY` – the API key for Gemini. Update `geminiService.ts` so that it reads `import.meta.env.VITE_GEMINI_API_KEY` instead of the hard-coded `INSERT_GEMINI_API_KEY`.

4. **Authentication and user data** – Extend the Supabase schema to store user progress and quiz history. Use tables such as:
   - `book_progress` with columns `user_id`, `book_id`, `sections_completed` (array of strings or integers referencing section headings), and `updated_at`.
   - `quiz_history` with columns `user_id`, `book_id`, `generated_at`, `topics` (array), `num_questions`, `difficulty`, and `score` (optional).
   
   Create a `user-accounts` service in `src/services/userAccounts.ts` that wraps Supabase calls for registering new users (`auth.signUp()`), logging in (`auth.signInWithPassword()`), retrieving progress, updating progress, recording quiz history, and fetching past quiz scores.

---

## Main page modifications

5. **Login/Sign-up flows** – Replace the current "Sign In" and "Sign Up" buttons with pages that use Supabase authentication. For sign up, ask only for an email and password, then call `supabase.auth.signUp({ email, password })`. For login, ask for email and password and call `supabase.auth.signInWithPassword()`. After successful authentication, redirect to the main page.

6. **Book cards with progress & quiz generator** – The existing carousel of textbooks should be replaced with a grid or carousel of book cards. Each card shows the book cover, title, and a progress bar. On hover (desktop) or tap (mobile), reveal an overlay containing:
   - **Progress bar details**: display "X of Y sections completed" pulled from Supabase via `book_progress`.
   - **Average quiz score**: fetch from `quiz_history` and compute the average.
   - **Quiz generator form**: allow the user to select topics (list of sections or paragraphs, loaded from `book-index.json`), choose the number of exercises (e.g., 5–20), and pick a difficulty level from 1 (low) to 5 (high). Use a dropdown or slider for each. Include a "Generate Quiz" button. When the form is submitted, call a handler that sends the selected LaTeX segments to `generateTestSamples` in `geminiService.ts`. Show a loading spinner while awaiting the response. Once generated, navigate to a new Test Page (see below) and render the returned LaTeX.

7. **Search and browse institutions** – Keep the existing `SchoolSearch` component but modify it so that it either searches for schools or directly filters the list of available books. Ensure that after login the user is taken to their institution's book list (if multiple institutions exist). This logic can be implemented via a Supabase table of institutions and their assigned books.

---

## Textbook pages

8. **Navigation layout** – Create three React pages: `BookTheoryPage`, `BookExercisesPage` and `BookTestPage`, all under `src/pages`. Each page accepts a `bookId` parameter from the URL. At the top of each page, include a header bar with navigation buttons: "Theory", "Exercises", "Test", and "Back to Main". Clicking these buttons uses React Router to switch between the three views while preserving `bookId`.

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

11. **Exercises page enhancements** – Below the rendered exercises, add a call-to-action card: "Generate new test from these exercises". Clicking this should pass the entire exercises LaTeX string into `generateTestSamples()` and append the returned LaTeX below the original exercises. Also insert a record into `quiz_history` with metadata about the generated quiz (use difficulty = inferred from the number of steps in the problems, or let the user select difficulty as part of the action). Display the newly generated test using KaTeX just like the existing exercises.

---

## Test generation and display

1. **Test Page** – Create a `BookTestPage` component that displays generated quizzes. It should show the topics selected, the number of questions and difficulty level. Underneath, render the LaTeX from the AI generator. Provide options to download the LaTeX file or to print the test. After the user completes or reviews the quiz, allow them to mark it as completed and optionally input a score. Save this data to `quiz_history`.

2. **Calling the Gemini API** – In `geminiService.ts`, ensure that the `API_KEY` is read from `import.meta.env.VITE_GEMINI_API_KEY`. Expose two functions:
   - `generateTestSamples(existingLatex: string): Promise<string>` – uses the current prompt to generate 10 new problems similar to the input. Already implemented; integrate into the UI.
   - `generateTestFromTopics(topics: string[], numQuestions: number, difficulty: number): Promise<string>` – build a new prompt that combines selected LaTeX snippets (by concatenating the LaTeX of the chosen sections). In the prompt tell Gemini to create the specified number of questions at the requested difficulty level. Catch errors and propagate them to the UI so that users see meaningful error messages.

3. **Loading indicators & error handling** – Whenever a test is being generated, show a spinner or loading bar. Disable the generate button to prevent duplicate requests. If the API returns an error or invalid LaTeX, display a user-friendly error message and log the error for debugging.

---

## User data and state management

4. **Persisting state** – Use React Context or a state management library (e.g. Zustand) to hold the authenticated user, list of books, progress information and quiz history. Fetch these from Supabase on login and cache them in the client. Provide hooks such as `useBooks()`, `useProgress(bookId)`, `useQuizHistory(bookId)` to encapsulate the logic of retrieving and updating data.

5. **Tracking progress** – On each section of a textbook, when the user scrolls past a heading or spends more than a predefined time on a page, update the `sections_completed` array. Save the progress to Supabase either in real-time or periodically (e.g. when the user navigates away). Use optimistic UI updates so the progress bar on the main page reflects the most recent reading state.

6. **Quiz history dashboard** – Add a page or modal where users can review past quizzes. Each entry should show the date generated, selected topics, number of questions, difficulty, and score (if recorded). Provide buttons to re-open a past quiz, export its LaTeX or delete the entry. Aggregate statistics (average score, total quizzes taken) can also be shown on the main page overlay.

---

## Additional considerations

- **Routing** – Use React Router (already installed in `prepo`) to handle all navigation. Define routes for `/signin`, `/signup`, `/books`, `/books/:bookId/theory`, `/books/:bookId/exercises`, and `/books/:bookId/test`.

- **Accessibility** – Ensure that all interactive elements (buttons, form inputs) have accessible labels and that the site supports keyboard navigation. Provide ARIA attributes for the progress bars and overlays.

- **Internationalisation** – While the current content is in Georgian, structure your components so that labels and UI text can be easily localised in the future. Use a simple i18n solution or store strings in a constants file.

- **Code organisation** – Do not leave unused files from the original `georgian-math-test-generator` project. Only keep `geminiService.ts` (adapted), and delete other redundant components. Similarly, remove the old JSON builder logic in `prepo` once LaTeX rendering is implemented.

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

3. Create an initial Supabase database with the `book_progress` and `quiz_history` tables. Add at least one user and one book entry in `book-index.json` so that the interface has something to display.

4. Open the site in your browser. Sign up with a test account, browse the available textbooks, read the theory sections, generate exercises and tests, and verify that progress and quiz history are tracked correctly.

---

## Summary

Following these instructions, ChatGPT Codex should integrate the four sub-projects into a cohesive learning platform. Users will be able to register or log in, select a textbook, read theory and exercises directly from LaTeX files rendered via KaTeX, track their reading progress, generate new tests using the Gemini 2.5 Pro API, and review their quiz history. All user data will be stored securely in Supabase. 

**Remember: do not implement code in this markdown file, but describe the changes needed so that the final prototype matches the design diagram provided.**
