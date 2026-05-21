import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const chadawasCollection = db.collection("chadawas");
    const chadawas = await chadawasCollection.find({}).toArray();

    const result = chadawas.map(c => ({
      name: c.name,
      offeringItems: c.offeringItems.map((item: any) => ({
        name: item.name,
        image: item.image
      }))
    }));

    // Self-destruct
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), "app", "api", "temp-check", "route.ts");
    const dirPath = path.dirname(filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      try {
        fs.rmdirSync(dirPath);
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      result
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}
