import Contact from "@/db/models/Contact";
import { data } from "autoprefixer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    await mongoose.connect(process.env.db)
    const body = await request.json();
    const exist = await Contact.findOne({ email: body.email });
    if (exist)
        return NextResponse.json({ success: true }, { status: 201 })
    else {
        await Contact.create({ email: body.email, message: body.message })
        return NextResponse.json({ success: true }, { status: 201 })
    }
}