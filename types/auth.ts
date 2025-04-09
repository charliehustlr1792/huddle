import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
    name: z.string().min(1, "Team name is required."),
    password: z.string().min(1, "Password is required."),
    email: z.string().min(1, "Email is required"),
  });