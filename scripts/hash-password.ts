import { hashPassword } from "@/lib/auth/password";

// `pnpm tsx scripts/hash-password.ts <password>` → value for OWNER_PASSWORD_HASH.
const password = process.argv[2];
if (!password) {
  console.error("usage: pnpm tsx scripts/hash-password.ts <password>");
  process.exit(1);
}
console.log(hashPassword(password));
