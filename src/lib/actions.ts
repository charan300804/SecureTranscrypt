"use server";

import { z } from "zod";
import { LoginSchema, RegisterSchema, type UserRole } from "./definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateDecryptionKey } from "@/ai/flows/validate-decryption-key";

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
  console.log("New user registered:", newUser);
  
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

export async function processFile(prevState: any, formData: FormData): Promise<{success: boolean, message: string, fileUrl: string}> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const imageUrl = formData.get('imageUrl') as string | null;
  const imageFile = formData.get('image') as File | null;

  let fileUrl = "/mock-encrypted-image.png"; // default
  if(imageFile) {
    // In a real app, you would upload this file and get a URL
    fileUrl = URL.createObjectURL(imageFile);
  } else if (imageUrl) {
    fileUrl = imageUrl;
  }
  
  return { success: true, message: "File processed successfully!", fileUrl };
}

export async function unlockImage(prevState: any, formData: FormData) {
  const imageKey = formData.get('imageKey');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // MOCK: In a real app, you would check the key against the file.
  // We'll use a hardcoded "correct" key for demo purposes.
  if (imageKey === "image-key-123") {
    return { success: true, message: "Image unlocked!" };
  }
  
  return { success: false, message: "Invalid image decryption key." };
}

export async function decryptData(prevState: any, formData: FormData) {
  const dataKey = formData.get('dataKey') as string;

  if (!dataKey) {
    return { success: false, message: "Data key is required." };
  }

  try {
    const validationResult = await validateDecryptionKey({ key: dataKey });
    
    // MOCK: We use a hardcoded key for the "correct" data,
    // but use the AI validation result to gate access.
    if (validationResult.isValid && dataKey === "data-key-123") {
      return { 
        success: true, 
        message: "Data decrypted successfully!",
        data: "This is the secret embedded data. Mission accomplished."
      };
    } else {
      return { success: false, message: "Invalid data decryption key. Access Denied." };
    }
  } catch (error) {
    console.error("AI validation error:", error);
    return { success: false, message: "An error occurred during key validation. Please try again." };
  }
}
