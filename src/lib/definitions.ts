import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export const SenderSchema = z.object({
  dataToEmbed: z.string().min(1, { message: "Data to embed cannot be empty." }),
  encryptionKey: z.string().min(6, { message: "Encryption key must be at least 6 characters." }),
  format: z.enum(['pdf', 'docx']),
});

export const ReceiverDataKeySchema = z.object({
  dataKey: z.string().min(1, { message: "Data key cannot be empty." }),
});

export type UserRole = "sender" | "receiver";

export type SessionPayload = {
  userId: string;
  name: string;
  role: UserRole;
  expires: string; // Should be an ISO 8601 date string
};
