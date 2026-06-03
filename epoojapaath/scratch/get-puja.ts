import { connectDB } from "../lib/db";
import Puja from "../models/Puja";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  await connectDB();
  const puja = await Puja.findById("6a19cde6dba905dd2263b25d").lean();
  console.log("Puja data:", JSON.stringify(puja, null, 2));
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
