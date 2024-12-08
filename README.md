WNC Final Project
=================

This repository contains both the backend and frontend of the WNC Final Project. Follow the instructions below to set up and run each part of the project.

Pre-requisites
--------------

*   **Node.js** (version 14.x or higher) must be installed on your system.
*   **npm** (Node Package Manager) should be installed along with Node.js.
*   If you are using the backend, make sure to have a working **database** setup (e.g., MongoDB, MySQL) and configure the connection in the environment variables.
*   If using JWT for authentication, ensure that the **JWT\_SECRET** environment variable is set in the backend.

Project Structure
-----------------

*   **backend/**: Contains the backend source code.
*   **frontend/**: Contains the frontend source code.

Setup Instructions
------------------

### 1\. Backend

1.  Navigate to the `backend` directory:
    
        cd backend
    
2.  Install dependencies:
    
        npm install
    
3.  Run the development server:
    
        npm run dev
    

### 2\. Frontend

1.  Navigate to the `frontend` directory:
    
        cd frontend
    
2.  Install dependencies:
    
        npm install
    
3.  Run the development server:
    
        npm run dev
    

Usage
-----

Once both the backend and frontend are running, you can access the application through the URL provided by the frontend development server.

Additional Notes
----------------

*   Ensure you have Node.js and npm installed on your system.
*   Make sure to configure any required environment variables in both the backend and frontend directories before starting the servers.
