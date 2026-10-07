# Rental Search Application

A full-stack rental property search platform that helps users browse available rentals, filter by location and property type, inspect detailed listings, and manage personal ratings. The project includes a React frontend and an Express-based API backed by MySQL.

## Overview

This application is designed for users who want to:

- Search for rental listings by city, state, and other filters
- Explore detailed property information
- View amenities and descriptive listing data
- Use a map-based or advanced filtering experience
- Create an account and authenticate securely
- Submit and review ratings for properties

The repository is split into two primary parts:

- `frontend/` – React + Vite single-page app
- `backend/` – Node.js + Express REST API with MySQL and JWT auth

## Features

- Property search and filtering
- Advanced search experience with multiple criteria
- Rental detail views
- User registration and login
- Protected routes for authenticated users
- Ratings and review functionality
- Swagger/OpenAPI documentation for backend endpoints
- Map integration for property location exploration
- Responsive UI built with Material UI

## Tech Stack

### Frontend

- React 19
- Vite
- Material UI
- React Router
- Leaflet / Pigeon Maps
- AG Grid
- Vitest + Testing Library

### Backend

- Node.js
- Express 5
- MySQL 2
- Knex.js
- JWT authentication
- Argon2 password hashing
- CORS and Morgan logging
- Swagger UI

## Repository Structure

```text
Rental-Search-Application/
├── backend/
│   ├── certs/
│   ├── docs/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   ├── dump.sql
│   ├── knexfile.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── report.pdf
├── .gitignore
├── vite.config.js
├── README.md
└── .github/
```

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm
- MySQL server

### 1) Clone the repository

```bash
git clone https://github.com/saalssall/Rental-Search-Application.git
cd Rental-Search-Application
```

### 2) Set up the backend

```bash
cd backend
npm install
```

The project includes a backend `.env` file with the JWT secret for local development. If needed, ensure your local database and credentials match the configuration in `backend/knexfile.js`.

Database connection details currently configured in the project:

- Host: `localhost`
- Port: `3306`
- Database: `rentals`
- User: `rentalsuser`

If your local MySQL instance uses different credentials, update `backend/knexfile.js` before starting the API.

Then import the sample database if needed:

```bash
mysql -u rentalsuser -p rentals < dump.sql
```

Start the backend server:

```bash
npm start
```

The API runs on HTTPS locally:

- `https://localhost:3000`
- Swagger docs: `https://localhost:3000/docs`

### 3) Set up the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

This starts the Vite dev server for the React app. The default local URL is usually:

- `http://localhost:5173`

## Backend API Highlights

The API exposes endpoints for:

- User registration and login
- Rental listings and search
- State and property-type filtering
- Property rating submissions
- Saved user rating views

Main route groups include:

- `/user`
- `/rentals`
- `/rentals/search`
- `/rentals/states`
- `/rentals/property-types`
- `/ratings`

These are also documented through Swagger at `/docs`.

## Frontend Highlights

The frontend includes pages for:

- Home
- Search
- Advanced search
- About
- Login
- Register
- My ratings
- Rental details

It uses a router-based layout and protected routes for account-specific functionality.

## Development Notes

- Frontend build command:

```bash
cd frontend
npm run build
```

- Frontend test command:

```bash
cd frontend
npm test
```

- Linting:

```bash
cd frontend
npm run lint
```

## License

This project does not currently declare a license in the repository root. If this application is intended for public reuse, consider adding an appropriate license file such as MIT or Apache 2.0.

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## Author

Repository maintained by `saalssall`.

## Screenshot / Demo

The repository includes a PDF report in `frontend/report.pdf`, which may contain additional project documentation or presentation material.

## Notes

This project appears to be a coursework or assignment-style application with a full-stack architecture, sample dataset, and implemented authentication and search functionality. It is suitable as a practical example of a rental marketplace built with modern JavaScript tooling.
