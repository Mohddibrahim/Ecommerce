// server/config/loadEnv.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from ../.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("✅ .env loaded (inside loadEnv.js)");
