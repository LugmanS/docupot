# Docupot 
Manage markdown files on the go. This application is developed using React.js, Express.js, Mongodb.

Check out the application at https://docupot.netlify.app


## Prerequsites

    1. MongoDB - Database
    2. Clerk - Auth provider
    3. Resend - Email provider


## Run Locally

### Starting client

Install dependencies

```bash
  cd client 
  npm install
```
Make sure VITE_APP_CLERK_PUBLISHABLE_KEY is added to the env

Start the server

```bash
  npm run dev
```

### Starting server

Install dependencies

```bash
  cd server 
  npm install
```
#### Make sure env variables are set
- MONGODB_URI
- CLERK_SECRET_KEY
- RESEND_API_KEY
- FROM_EMAIL
- CLIENT_HOST

Start the server

```bash
  npm run dev
```

## Auth workflow

![Auth flow](https://docupot.netlify.app/auth-flow.png)