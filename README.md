# asl-caption

<a href="https://universe.roboflow.com/meredith-lo-pmqx7/asl-project">
    <img src="https://app.roboflow.com/images/download-dataset-badge.svg"></img>
</a>

Generate captions for videos containing ASL.

## Project Structure

We use SvelteKit, with the model running locally.

## Running the Project

Vite an environment variable to locate the server, which is served by default at `http://localhost:5000`.
An example file is provided at [.env.example](frontend/.env.example).

To develop the frontend, make a copy of this file in the same directory and name it `.env.development`.

> **Note:** When it's time to compile the frontend, the deployment URL of the backend should be placed in
> `.env.production`.

1. Install pnpm: `npm install -g pnpm`
2. `pnpm install`
3. `pnpm dev`
