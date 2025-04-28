import connectMongo from "@/lib/mongoose";
import WorkLog from "@/models/WorkLog";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, stopTime } = await req.json();
    if (!userId || !stopTime) {
        return NextResponse.json({ message: "Please provide all required fields." }, { status: 400 });
    }

    try {
        await connectMongo();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "MongoDB connection failed." }, { status: 500 });
    }

    try {
        
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to stop work log." }, { status: 500 });
    }
}