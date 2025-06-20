// client/loadEnv.js
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const lines = Object.entries(process.env)
  .filter(([key]) => key.startsWith("VITE_"))
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");
fs.writeFileSync(".env", lines);
console.log("✅ Vite .env synced from shared .env");