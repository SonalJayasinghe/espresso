import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import WorkLog from "@/models/WorkLog";

export async function POST(req: Request){
    const {userId, date, startTime} = await req.json();

    if(!userId || !startTime){
        return NextResponse.json({message: "Please provide all required fields."}, {status: 400});
    }

    try{
        await connectMongo();
    }catch(error){
        console.error(error);
        return NextResponse.json({message: "MongoDB connection failed."}, {status: 500});
    }

    try{
        const startDateTime = new Date(startTime);
        const dateString = startDateTime.toISOString().split("T")[0];

        const newWorkLog = await WorkLog.create({
            userId,
            date: dateString,
            startTime: startDateTime,
        });
        return NextResponse.json({message: "Work log started successfully.", workLog: newWorkLog}, {status: 201});

    }catch(error){
        console.error(error);
        return NextResponse.json({message: "Failed to start work log."}, {status: 500});
    }

}
