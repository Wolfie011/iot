import { Lucia, Register, TimeSpan } from "lucia";
import type { InferSelectModel } from "drizzle-orm";
import { userTable } from "@/lib/database/schema"; // <-- bezpośrednio z tego co ładuje Drizzle
import luciaAdapter from "@/lib/lucia/lucia.adapter";

// Typ użytkownika na bazie tabeli
type DbUser = InferSelectModel<typeof userTable>;

// Inicjalizacja Lucii
export const auth = new Lucia(luciaAdapter, {
  sessionExpiresIn: new TimeSpan(3, "d"), // 3 dni
  sessionCookie: {
    expires: true,
    attributes: {
      path: "/",
      secure: process.env.NODE_ENV === "production", // ✔️ Produkcyjne ciastka tylko HTTPS
      sameSite: "lax",
    },
  },
  getUserAttributes: (rawUser: unknown): Register["DatabaseUserAttributes"] => {
    const user = rawUser as DbUser;
    return {
      id: user.id,
      userName: user.userName, // ⚠️ Dopasowane do interface'u Lucia
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      active: user.active,
    };
  },
});

// Rozszerzenie typów Lucii
declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      id: string;
      userName: string;
      firstName: string;
      lastName: string;
      email: string;
      active: boolean;
      avatar?: string;
    };
  }
}
