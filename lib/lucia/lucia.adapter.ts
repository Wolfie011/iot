import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "@/lib/database/index";

// Pobieramy tabele z przypisanej schemy
import { sessionTable, userTable } from "@/lib/database/schema"

// Tworzymy adapter Lucii
const luciaAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default luciaAdapter;
