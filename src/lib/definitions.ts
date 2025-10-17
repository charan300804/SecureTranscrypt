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
  imageKey: z.string().min(6, { message: "Image key must be at least 6 characters." }),
  dataToEmbed: z.string().min(1, { message: "Data to embed cannot be empty." }),
  dataKey: z.string().min(6, { message: "Data key must be at least 6 characters." }),
});

export const ReceiverImageKeySchema = z.object({
  imageKey: z.string().min(1, { message: "Image key cannot be empty." }),
});

export const ReceiverDataKeySchema = z.object({
  dataKey: z.string().min(1, { message: "Data key cannot be empty." }),
});

export type UserRole = "sender" | "receiver";

export type SessionPayload = {
  userId: string;
  name: string;
  role: UserRole;
  expires: Date;
};
