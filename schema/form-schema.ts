import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(8, "Email must contain at least 8 characters")
    .max(60, "Email must contain only 60 characters")
    .email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(60, "Password must contain only 60 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(8, "Name must contain at least 8 characters")
    .max(60, "Name must contain only 60 characters")
    .regex(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name should contain only alphabets and single spaces between words"
    ),

  email: z
    .string()
    .min(8, "Email must contain at least 8 characters")
    .max(60, "Email must contain only 60 characters")
    .email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(60, "Password must contain only 60 characters"),
  confirmPassword: z
    .string()
    .min(8, "Password Confirmation Field must contain at least 8 characters")
    .max(60, "Password Confirmation Field must contain only 60 characters"),
});

export const resetPassSchema = z.object({
  email: z
    .string()
    .min(8, { message: "Email must contain at least 8 character(s)" })
    .max(40, { message: "Email must contain up to 40 character(s) only" })
    .email({ message: "Must be a valid email address" }),
});

export const NoteSchema = z.object({
  title: z.string().min(5, "Title must contain 5 character(s)"),
  description: z
    .string()
    .min(6, "Description must contain at least 6 character(s)"),
  content: z.string(),
});

export const createTodoFormSchema = z.object({
  title: z
    .string()
    .min(10, "Title should be at least 10 characters")
    .max(50, "Title shouldn't be greater than 50 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(50, "Description shouldn't be greater than 50 characters"),
  priority: z.optional(z.string()),
  reminder: z.optional(z.string()),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(5, {
      message: "Password must contain at least 5 character(s)",
    })
    .max(35, {
      message: "Password must contain only 5 character(s)",
    }),
  updatedPassword: z
    .string()
    .min(5, {
      message: "Password must contain at least 5 character(s)",
    })
    .max(35, {
      message: "Password must contain only 5 character(s)",
    }),
  confirmUpdatedPassword: z
    .string()
    .min(5, {
      message: "Password must contain at least 5 character(s)",
    })
    .max(35, {
      message: "Password must contain only 5 character(s)",
    }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().min(10).max(50).email(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(10).max(50),
  description: z.string().min(10).max(50),
  priority: z.optional(z.string()),
  dueDate: z.optional(z.string()),
});
