# asl-caption

<a href="https://universe.roboflow.com/meredith-lo-pmqx7/asl-project">
    <img src="https://app.roboflow.com/images/download-dataset-badge.svg"></img>
</a>

Generate captions for videos containing ASL.

## Project Structure

- `backend`: Flask server that contains the AI model
- `frontend`: User-facing SvelteKit frontend

## Running the Project

### Backend

1. `cd backend`
2. (use any virtual environment of your choice and install the dependencies with `pip install -e .`)
3. `flask run`

### Frontend

Vite an environment variable to locate the server, which is served by default at `http://localhost:5000`.
An example file is provided at [.env.example](frontend/.env.example).

To develop the frontend, make a copy of this file in the same directory and name it `.env.development`.

> **Note:** When it's time to compile the frontend, the deployment URL of the backend should be placed in
> `.env.production`.

1. Install pnpm: `npm install -g pnpm`
2. `cd frontend`
3. `pnpm install`
4. `pnpm dev`
