# Campus Student Management

A responsive student management dashboard for the DIWA2210 Web Application Development individual assignment. The app uses React and JavaScript to view, add, edit, delete, search, filter, and export student records.

## Hosted version

- **Live app:** https://monkgeclement-hue.github.io/diwa2210-campusflow/
- **GitHub repository:** https://github.com/monkgeclement-hue/diwa2210-campusflow
- GitHub Pages publishes the committed `docs/` folder from `main`. To update the live app, run `pnpm build:pages`, commit the resulting `docs/` changes, and push to `main`.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Open a terminal in this project folder.
3. Install dependencies with **pnpm install** or **npm install**.
4. Start the development server with **pnpm dev** or **npm run dev**.
5. Open the local URL printed by Vite.

Create the production build with **pnpm build** or **npm run build**.

## Features

- Student ID, full name, age, email, course of study, and enrollment status.
- Add and edit forms with required-field, email, course, status, and age validation.
- Delete confirmation with separate cancel and confirm actions.
- Search by name, ID, email, course, or status; filter by enrollment status.
- CSV export and responsive table/cards.
- Automatic browser localStorage persistence.

Starter records use fictional names and example.com email addresses.

## Project structure

- **src/App.jsx** owns page state, calculated totals, and CRUD event handlers.
- **src/components/StudentDirectory.jsx** renders the searchable directory and filters.
- **src/components/StudentFormModal.jsx** implements add/edit forms and field validation.
- **src/components/DeleteConfirmModal.jsx** confirms record deletion.
- **src/components/StatCard.jsx** and **src/components/CampusIllustration.jsx** are reusable display components.
- **src/data/initialStudents.js** defines example records and form options.
- **src/utils/studentUtils.js** contains storage, ID, validation, CRUD, CSV, and initials helpers.

## JavaScript concepts

- Each student is an object. ID, name, email, course, and status are strings; age is a number; isActive is a boolean.
- The student directory is an array of objects. Search text and filters are strings; modal visibility is represented by booleans in React state.
- **const** is used for values that are not reassigned. **let** is used for the changing ID counter in makeStudentId.
- **var** is intentionally not used because the ES modules do not need function-scoped declarations; block-scoped let and const make reassignment and scope clearer.
- Functional components use JSX, props, React state, event handlers, and immutable array methods such as map, filter, forEach, and some.

## Manual acceptance checklist

Use this while learning and demonstrating the project:

- [ ] Add a valid student and check the row and summary counts.
- [ ] Try a blank name, malformed email, and age outside 16-100; confirm errors appear and invalid data is not saved.
- [ ] Edit a record and confirm the updated details appear immediately.
- [ ] Open delete confirmation, cancel it, and confirm the record remains.
- [ ] Confirm a deletion and check that the row and totals update.
- [ ] Search by student name and ID; try each status filter.
- [ ] Remove or filter the last visible record and check the empty state.
- [ ] Refresh and check that records remain in this browser.
- [ ] Export the directory and open the downloaded CSV.

## Data and privacy

Records are saved in localStorage for the current browser profile. The app does not send student data to a server. Use fictional data for demonstrations and test the checklist before submission.
