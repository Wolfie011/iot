import z from "zod";

export const roleSchema = z.object({
  roleName: z
    .string()
    .min(2, "Nazwa roli musi mieć co najmniej 2 znaki")
    .max(50, "Nazwa roli nie może przekraczać 50 znaków"),
    // .regex(/^[a-zA-Z0-9\s_-]+$/, "Nazwa roli może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia"),
  roleDescription: z
    .string()
    .max(128, "Opis roli nie może przekraczać 500 znaków"),
})
export type roleSchemaInput = z.infer<typeof roleSchema>;
