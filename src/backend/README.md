# CodeChamp

This project is an Express API.

## Setup

### Step 1

Run `npm install` to install packages.

### Step 2: Setup Variables

#### Method 1: Using Export

Run

```
export MONGODB_URL="mongodb+srv://<mongodbUserName>:<mongodbPassword>@codechamp.pdu38rq.mongodb.net/CodeChamp?retryWrites=true&w=majority"
```

Replace `<mongodbUserName>` and `<mongodbPassword>` with your mongodb access user

#### Method 2: Using .env

Create .env file with the following content

```
MONGODB_URL="mongodb+srv://<mongodbUserName>:<mongodbPassword>@codechamp.pdu38rq.mongodb.net/CodeChamp?retryWrites=true&w=majority"
```

Replace `<mongodbUserName>` and `<mongodbPassword>` with your mongodb access user

## Running

Run `npm run start` to start the dev server. Nodemon will listen to source file changes and update the app accordingly during development.

Visit `localhost:3000/docs` to visit api documentation

## Linting

This project uses ESLint for linting. You can use `npm run lint:check` to check for linter errors and `npm run lint:fix` to automatically attempt to resolve them.

## Formatting

This project uses Prettier for formatting. You can use `npm run format:check` to check for formatting errors and `npm run format:fix` to automatically fix them.
