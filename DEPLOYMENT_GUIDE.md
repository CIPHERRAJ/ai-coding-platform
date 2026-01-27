# Deployment Guide: PythonAnywhere + Firebase

This guide will help you host your **Django Backend on PythonAnywhere** and your **React Frontend on Firebase**, both for free.

---

## Part 1: Backend (PythonAnywhere)

1.  **Sign Up:** Go to [PythonAnywhere.com](https://www.pythonanywhere.com/) and create a free "Beginner" account.
2.  **Upload Code:**
    *   Go to the **Files** tab on PythonAnywhere.
    *   Click "Upload a file" and upload these files/folders from `T:\THARUN PROJECT`:
        *   `manage.py`
        *   `requirements.txt`
        *   `db.sqlite3` (If you want to keep your current users/problems)
        *   Folder: `ai_platform` (Zip it locally, upload, then unzip in PythonAnywhere bash console)
        *   Folder: `coding_app` (Zip it locally, upload, then unzip in PythonAnywhere bash console)
    *   *Tip: To unzip on PythonAnywhere, open a Bash console and run: `unzip filename.zip`*

3.  **Install Dependencies:**
    *   Open a **Bash** console on PythonAnywhere.
    *   Run this command:
        ```bash
        pip3.10 install -r requirements.txt
        ```

4.  **Configure Web App:**
    *   Go to the **Web** tab.
    *   Click **Add a new web app**.
    *   Select **Manual Configuration** (not Django) -> **Python 3.10**.
    *   Once created, scroll down to **WSGI configuration file** and click the link.
    *   Delete the default content and paste this:
        ```python
        import os
        import sys
        
        # Assume your username is 'yourusername' and project is in default folder
        path = '/home/yourusername/ai_platform'
        if path not in sys.path:
            sys.path.append(path)
            
        os.environ['DJANGO_SETTINGS_MODULE'] = 'ai_platform.settings'
        
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        ```
    *   **Crucial:** Replace `yourusername` and `/ai_platform` with your actual path (run `pwd` in bash to check).

5.  **Final Settings:**
    *   In `ai_platform/settings.py` (you can edit this in the Files tab):
        *   Set `DEBUG = False`
        *   Set `ALLOWED_HOSTS = ['yourusername.pythonanywhere.com']`
    *   Go back to the **Web** tab and click the green **Reload** button.
    *   Your backend is now live at `https://yourusername.pythonanywhere.com`!

---

## Part 2: Frontend (Firebase)

1.  **Install Firebase Tools (if not installed):**
    Open your local terminal (PowerShell/CMD):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Configure URL:**
    *   In your `frontend` folder, create a file named `.env.production`.
    *   Add this line (replace with your actual PythonAnywhere URL):
        ```
        VITE_API_URL=https://yourusername.pythonanywhere.com
        ```

3.  **Build:**
    ```bash
    cd frontend
    npm run build
    ```

4.  **Deploy:**
    ```bash
    firebase login
    firebase init
    ```
    *   **Hosting:** Select (Spacebar).
    *   **Use an existing project:** Create one in Firebase Console if you haven't.
    *   **Public directory:** `dist` (Important! Type 'dist').
    *   **Configure as single-page app:** `Yes`.
    *   **Automatic builds/deploys:** `No`.

    Finally:
    ```bash
    firebase deploy
    ```

**Success!** Your app is now hosted globally for free.
