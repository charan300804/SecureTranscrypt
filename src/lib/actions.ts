"use server";

import { z } from "zod";
import { LoginSchema, RegisterSchema, SenderFileSchema, type UserRole } from "./definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import mammoth from "mammoth";


// Mock user store
const users = [
  { id: '1', name: 'Sender User', email: 'sender@example.com', password: 'password123', role: 'sender' },
  { id: '2', name: 'Receiver User', email: 'receiver@example.com', password: 'password123', role: 'receiver' },
];

const SESSION_COOKIE_NAME = "secure-transcrypt-session";

export async function signIn(role: UserRole, prevState: { message: string }, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { message: "Invalid form data." };
  }

  const { email, password } = validatedFields.data;

  // MOCK: Find user
  const user = users.find(u => u.email === email && u.role === role);

  if (!user || user.password !== password) {
    return { message: "Invalid email, password, or role." };
  }
  
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = { userId: user.id, name: user.name, role: user.role, expires: expires.toISOString() };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(`/${user.role}`);
}

export async function signUp(role: UserRole, prevState: { message: string }, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
     const errorMessages = validatedFields.error.errors.map(e => e.message).join(' ');
    return { message: `Invalid form data: ${errorMessages}` };
  }

  const { name, email, password } = validatedFields.data;
  
  // MOCK: Check if user exists
  if (users.some(u => u.email === email && u.role === role)) {
    return { message: "A user with this email and role already exists." };
  }
  
  // MOCK: Create user
  const newUser = { id: String(users.length + 1), name, email, password, role };
  users.push(newUser);
  
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = { userId: newUser.id, name: newUser.name, role: newUser.role, expires: expires.toISOString() };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(`/${newUser.role}`);
}


export async function signOut() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/");
}

// MOCK SENDER/RECEIVER ACTIONS

export async function processFile(prevState: any, formData: FormData): Promise<{success: boolean; message: string; fileUrl: string; fileName: string;}> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const validatedFields = SenderFileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return { success: false, message: "Invalid form data. Please fill all fields.", fileUrl: "", fileName: "" };
  }
  
  const { dataToEmbed, imageKey, dataKey, format, image } = validatedFields.data;

  // MOCK: "Encrypt" data by creating a structured text block.
  const content = `
---BEGIN SECURE PAYLOAD---

[IMAGE ENCRYPTION BLOCK]
ALGORITHM: AES-256
IMAGE_FILE: ${image.name}
IMAGE_KEY_HASH: ${(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(imageKey))).toString()}
ENCRYPTED_IMAGE_DATA: [Simulated Encrypted Image Bytes...]

[DATA ENCRYPTION BLOCK]
ALGORITHM: AES-256
DATA_KEY_HASH: ${(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataKey))).toString()}
EMBEDDED_DATA: ${dataToEmbed}

---END SECURE PAYLOAD---
`;
  const fileName = `secure-package.${format}`;
  let fileBuffer: Buffer;
  let mimeType: string;

  try {
    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText(content, {
        x: 50,
        y: height - 50,
        font,
        size: 10,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: 14,
      });
      const pdfBytes = await pdfDoc.save();
      fileBuffer = Buffer.from(pdfBytes);
      mimeType = 'application/pdf';

    } else { // docx
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: content, font: "monospace" })],
            }),
          ],
        }],
      });
      const docxBuffer = await Packer.toBuffer(doc);
      fileBuffer = Buffer.from(docxBuffer);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    
    const fileUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    return { success: true, message: "Secure document generated successfully!", fileUrl, fileName };

  } catch (error) {
    console.error("Error processing file:", error);
    return { success: false, message: "There was an error generating your document.", fileUrl: "", fileName: "" };
  }
}


const ReceiverFileSchema = z.object({
  dataKey: z.string().min(1, { message: "Data key cannot be empty." }),
  file: z.instanceof(File),
});

export async function decryptData(prevState: any, formData: FormData): Promise<{success: boolean; message: string; data: string;}> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const validatedFields = ReceiverFileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: "Invalid submission. Please upload a file and provide a key.", data: "" };
  }

  const { dataKey, file } = validatedFields.data;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  
  try {
    let textContent = '';
    if (file.type === 'application/pdf') {
        // This is a simplified extraction. pdf-lib doesn't have a high-level text extraction API.
        // We'll just check if the key exists in the raw buffer content for this mock.
        textContent = fileBuffer.toString();
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        textContent = result.value;
    } else {
        return { success: false, message: "Unsupported file type.", data: "" };
    }
    
    // MOCK: "Decrypt" by checking for key and extracting data
    const keyLine = `ENCRYPTION_KEY_DO_NOT_SHARE: ${dataKey}`;
    if (!textContent.includes(keyLine)) {
      // In a real app, we would check the hash of the key
      const dataRegex = /EMBEDDED_DATA: ([\s\S]*?)\n\n---END SECURE PAYLOAD---/;
      const match = textContent.match(dataRegex);

      if (match && match[1]) {
        return { success: true, message: "Data decrypted successfully!", data: match[1].trim() };
      } else {
        return { success: false, message: "Invalid key or corrupted file. Could not find data.", data: "" };
      }
    }

    const dataRegex = /---BEGIN SECURE DATA---\n\n([\s\S]*?)\n\n---END SECURE DATA---/;
    const match = textContent.match(dataRegex);

    if (match && match[1]) {
      return { success: true, message: "Data decrypted successfully!", data: match[1] };
    } else {
      return { success: false, message: "Could not find secure data in the document.", data: "" };
    }
    
  } catch (error) {
    console.error("Decryption error:", error);
    return { success: false, message: "An error occurred while reading the file.", data: "" };
  }
}
