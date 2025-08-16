import { z } from "zod";

export const signupSchema = z.object({
  // Personal
  firstName: z.string().min(1, "Required").max(30, "Max 30 characters"),
  lastName: z.string().min(1, "Required").max(30, "Max 30 characters"),
  email: z.string().email("Enter a valid email"),
  phoneCountryCode: z.string().min(1, "Select a country code"),
  phoneNumber: z
    .string()
    .min(4, "Too short")
    .max(15, "Too long")
    .regex(/^\d+$/, "Digits only"),

  // Billing
  company: z.string().optional(),
  street1: z.string().min(1, "Required"),
  street2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postcode: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),

  // Additional
  referral: z.string().optional(),
  supportPin: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "PIN must be 4 digits",
    }),

  // Security
  password: z
    .string()
    .min(8, "Min 8 characters")
    .refine(
      (v) =>
        /[a-z]/.test(v) &&
        /[A-Z]/.test(v) &&
        /\d/.test(v) &&
        /[^A-Za-z0-9]/.test(v),
      "Use upper, lower, number, and symbol"
    ),
  confirmPassword: z.string().min(1, "Required"),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type SignupFormValues = z.infer<typeof signupSchema>;
