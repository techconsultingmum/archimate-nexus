import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const artifactNameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .trim();

export const artifactDescriptionSchema = z
  .string()
  .max(1000, "Description must be less than 1000 characters")
  .trim()
  .optional()
  .nullable();

export const tagSchema = z
  .string()
  .max(50, "Tag must be less than 50 characters")
  .trim();

export const tagsSchema = z
  .array(tagSchema)
  .max(20, "Maximum 20 tags allowed")
  .optional();

export const versionSchema = z
  .string()
  .max(20, "Version must be less than 20 characters")
  .regex(/^[\d.]*$/, "Version must be in format like 1.0 or 1.0.0")
  .optional()
  .default("1.0");

// Artifact form schema
export const artifactFormSchema = z.object({
  name: artifactNameSchema,
  description: artifactDescriptionSchema,
  artifact_type: z.string().min(1, "Type is required"),
  status: z.enum(["draft", "under_review", "approved", "deprecated", "retired"]),
  version: z.string().max(20).optional(),
  tags: z.string().optional(),
});

export type ArtifactFormData = z.infer<typeof artifactFormSchema>;

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Signup form schema
export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  fullName: nameSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: nameSchema.optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// Utility function to parse form data with zod
export function parseFormData<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0].toString()] = err.message;
    }
  });
  
  return { success: false, errors };
}
