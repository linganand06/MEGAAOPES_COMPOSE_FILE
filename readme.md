# Simple CRM Application

This is a full-stack CRM application featuring a React frontend, a Node.js/Express backend, and a MySQL database. The entire application is containerized using Docker for easy setup and deployment.

## Features

- **Containerized Environment**: Run the entire stack with a single Docker Compose command.
- **Automatic Database Setup**: The backend server automatically initializes the database schema and seeds it with mock data on the first run.
- **Live Reloading**: The frontend service is configured for hot-reloading during development.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local frontend development)

## Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/linganand06/MEGAAOPES_COMPOSE_FILE.git
    cd MEGAAOPES_COMPOSE_FILE
    ```

2.  **Configure Environment Variables**

    You need to create two environment files for the production configuration used by Docker.

    -   **Backend Configuration:**
        Create a file at `backend/.env.prod` with the following content. The `DB_HOST` must be `mysql` to connect to the Docker container.
        ```env
        DB_HOST=mysql
        DB_USER=crm_user
        DB_PASSWORD=crmpassword123
        DB_NAME=crm
        PORT=5000
        ```

    -   **Frontend Configuration:**
        Create a file at `frontend/.env.prod`. This file can contain frontend-specific variables, such as the API endpoint.
        ```env
        VITE_API_BASE_URL=http://localhost:5001/api
        ```

## Running the Application

### Using Docker (Recommended)

This is the simplest way to run the entire application stack.

1.  **Build and Run Containers**
    From the project root directory, run:
    ```bash
    docker-compose up --build
    ```
    To run in the background (detached mode), use:
    ```bash
    docker-compose up --build -d
    ```

2.  **Access the Application**
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Backend API**: [http://localhost:5001](http://localhost:5001)

On the first launch, the backend will automatically create the necessary database tables and seed them with data.

### Local Development (Frontend Only)

If you want to run the frontend on your local machine for development and connect it to the Dockerized backend, follow these steps:

1.  **Start Backend Services**
    Make sure the backend and database are running via Docker:
    ```bash
    docker-compose up -d backend mysql
    ```

2.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    ```

3.  **Run the Frontend Dev Server**
    ```bash
    npm run dev
    ```
    The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Stopping the Application

To stop all running containers, navigate to the project root and run:
```bash
docker-compose down
```

## Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.prod       # Backend environment variables
│   ├── sql/
│   │   ├── schema.sql  # Database schema
│   │   └── seed.sql    # Mock data
│   └── src/            # Backend source code
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.prod       # Frontend environment variables
│   └── src/            # Frontend source code
├── docker-compose.yml
└── README.md
