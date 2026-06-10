# SecureTranscrypt

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?logo=firebase&style=for-the-badge)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)




This is a Next.js starter project for SecureTranscrypt, a platform for secure data transmission between a Sender and a Receiver. This guide provides detailed instructions to set up and run the application on your local machine for development.

## Core Technologies

- **Framework**: Next.js (with App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **File Generation**: `pdf-lib` for PDFs, `docx` for Word documents

---

## Local Development Setup: Step-by-Step

Follow these steps carefully to ensure the application runs correctly on your local machine.

### Step 1: Install Dependencies

First, you need to install all the necessary packages defined in `package.json`. Open your terminal, navigate to the root directory of this project, and run the following command:

```bash
npm install
```
This command reads the `package.json` file and downloads all the required libraries (like React, Next.js, Firebase, etc.) into the `node_modules` folder.

---

### Step 2: Set Up Firebase Service Account

The application's backend uses the Firebase Admin SDK to perform secure actions like creating users and verifying sessions. This SDK requires a "service account," which is a special credential that grants your server administrative privileges.

1.  **Navigate to your Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select the project that is connected to this application.

2.  **Access Service Account Settings:**
    *   In the left-hand navigation pane, click the gear icon next to **Project Overview**.
    *   Select **Project settings**.
    *   In the Project settings page, click on the **Service accounts** tab.

3.  **Generate a New Private Key:**
    *   Click the **Generate new private key** button.
    *   A confirmation dialog will appear. Click **Generate key**.
    *   This will automatically download a JSON file to your computer. This file contains highly sensitive credentials. **Do not share it or commit it to version control.**

4.  **Place and Rename the Credential File:**
    *   Move the downloaded JSON file into the root directory of this project.
    *   For security and simplicity, it's recommended to rename the file to `service-account.json`. The project's `.gitignore` file is already configured to ignore this specific filename, preventing it from being accidentally committed.

---

### Step 3: Configure Local Environment Variables

Environment variables are used to store sensitive information like API keys or file paths without hardcoding them into the application.

1.  **Locate the `.env` file:**
    *   In the project's root directory, you will find a file named `.env`.

2.  **Edit the `.env` file:**
    *   Open the `.env` file. It contains a single line:
        ```
        GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
        ```
    *   This line tells the Firebase Admin SDK where to find your credential file. If you renamed your JSON file to something other than `service-account.json` in the previous step, make sure you update the filename here to match.

---

### Step 4: Run the Development Server

Now you are ready to start the application.

1.  **Run the `dev` script:**
    *   In your terminal, from the project's root directory, run the following command:
        ```bash
        npm run dev
        ```
    *   This command executes the `dev` script defined in your `package.json`, which starts the Next.js development server. You should see output in your terminal indicating that the server is compiling and running.

2.  **Access the Application:**
    *   Once the server has successfully started (you'll typically see a "ready" message), open your web browser.
    *   Navigate to the following URL:
        ```
        http://localhost:9002
        ```

The application is now running locally. You can interact with it, create accounts, and use the sender/receiver functionality. Any changes you make to the source code will be automatically recompiled, and the application will update in your browser.