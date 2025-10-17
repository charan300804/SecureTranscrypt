# **App Name**: SecureTranscrypt

## Core Features:

- Sender Authentication: Securely register and log in Senders with role-based access control.
- Receiver Authentication: Securely register and log in Receivers with role-based access control.
- File Upload and Encryption: Allow Senders to upload an image file, encrypt it using a key, and embed encrypted data.
- File Download: Enable Senders to download the secured file in multiple formats (PDF, Word, image).
- File Upload and Decryption: Enable Receivers to upload an encrypted file, enter decryption keys, and view the embedded image and data.
- Key Validation: Tool to prevent unauthorized access by validating decryption keys entered by the Receiver.
- Error Handling and Messaging: Display appropriate error messages for invalid login or decryption failures to guide the user to provide proper values. Error boundary is setup at all the important interaction points.

## Style Guidelines:

- Primary color: Dark slate blue (#483D8B) for security and trust.
- Background color: Very light grayish-blue (#F0F8FF) to provide a clean, neutral backdrop.
- Accent color: Soft lavender (#E6E6FA) for interactive elements.
- Body and headline font: 'Inter', a sans-serif font, is recommended for both headlines and body text, for its clean, modern appearance and excellent legibility.
- Use clear, simple icons to represent actions like upload, download, and encrypt. Consistency in style across all icons.
- Responsive and intuitive layout with a clear separation between Sender and Receiver functionalities.
- Subtle animations for file upload and decryption processes to provide visual feedback to the user.