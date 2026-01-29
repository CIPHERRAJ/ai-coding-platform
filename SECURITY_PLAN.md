# Security Improvement Plan

This document outlines the steps to secure the application by moving hardcoded credentials to environment variables.

## Phase 1: Local Backend Security (Immediate Action)
- [ ] Create a `.env` file in the project root to store secrets.
- [ ] Move `GEMINI_API_KEY` from `coding_app/utils.py` and `check_models.py` to `.env`.
- [ ] Move `SECRET_KEY` from `ai_platform/settings.py` to `.env`.
- [ ] Install `python-dotenv` and add it to `requirements.txt`.
- [ ] Configure `ai_platform/settings.py` to load variables from `.env`.
- [ ] Remove hardcoded fallbacks for API keys in the code.
- [ ] Update `.gitignore` to exclude `.env`.

## Phase 2: Frontend Security
- [ ] Verify no API keys are hardcoded in the frontend (`src/` folder).
- [ ] If frontend variables are needed (e.g., API Base URL), use `.env.production` (for Firebase) or `.env.local` (for local dev).
- [ ] Ensure frontend `.env` files with secrets are git-ignored.

## Phase 3: Production Deployment (PythonAnywhere)
- [ ] Log in to PythonAnywhere Dashboard.
- [ ] Go to the **Web** tab -> **Virtualenv** section.
- [ ] Use the "Edit your WSGI configuration file" link OR set environment variables in the "Environment variables" section (if available) or create a `.env` file on the server.
- [ ] **Method A (.env on server):** Upload the `.env` file securely to the project root on PythonAnywhere.
- [ ] **Method B (WSGI config):** Add `os.environ['GEMINI_API_KEY'] = '...'` in the WSGI file.
- [ ] Reload the web app.

## Phase 4: Production Deployment (Firebase)
- [ ] Firebase Hosting serves static files. Ensure no secrets are bundled in the `dist/` folder.
- [ ] If using Firebase Functions, set environment config using `firebase functions:config:set`.
