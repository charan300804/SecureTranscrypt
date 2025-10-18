# SecureTranscrypt

This is a Next.js starter project for SecureTranscrypt, a platform for secure data transmission between a Sender and a Receiver.

## Running Locally

Follow these steps to run the application on your local machine.

### 1. Install Dependencies

First, open your terminal, navigate to the project's root directory, and install the necessary npm packages:

```bash
npm install
```

### 2. Set Up Firebase Service Account

This application uses the Firebase Admin SDK for server-side authentication, which requires a service account credential.

1.  **Navigate to your Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2.  **Go to Service Accounts:** In your project settings, find the "Service Accounts" tab.
3.  **Generate a New Private Key:** Click the "Generate new private key" button. This will download a JSON file containing your service account credentials.
4.  **Move the Credential File:** Move the downloaded JSON file into the root directory of this project. For security, it's recommended to rename it to something simple, like `service-account.json`. This file is listed in `.gitignore` and will not be committed to your repository.

### 3. Configure Environment Variables

The application uses a `.env` file to load your Firebase credentials.

1.  **Create the File:** In the root directory of the project, create a new file named `.env`.
2.  **Add the Credential Path:** Add the following line to the `.env` file, replacing `service-account.json` with the actual name of your credential file if you renamed it differently.

    ```
    GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
    ```

### 4. Run the Development Server

Now you can start the Next.js development server. The application will be available at `http://localhost:9002`.

```bash
npm run dev
```

The application is now running locally. You can access it by opening your web browser and navigating to `http://localhost:9002`.