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
        const stopDateTime = new Date(stopTime);

        const onGoingWork = await WorkLog.findOne({
            userId,
            stopTime: { $exists: false }
        });

        if (!onGoingWork) {
            return NextResponse.json({ message: "No ongoing work log found." }, { status: 404 });
        }

        const startDateTime = onGoingWork.startTime;
        const startDate = startDateTime.toISOString().split("T")[0];
        const stopDate = stopDateTime.toISOString().split("T")[0];

        if (startDate == stopDate) {
            const duration = Math.floor((stopDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));

            onGoingWork.stopTime = stopDateTime;
            onGoingWork.duration = parseFloat(duration.toFixed(2));
            await onGoingWork.save();
            return NextResponse.json({ message: "Work log stopped successfully.", workLog: onGoingWork }, { status: 200 });
        }
        else{
            const midNight = new Date(startDate);
            midNight.setHours(23, 59, 59, 999);
            onGoingWork.stopTime = midNight;
            onGoingWork.duration = Math.floor((midNight.getTime() - startDateTime.getTime()) / (1000 * 60));
            await onGoingWork.save();

            const newWorkLog = await WorkLog.create({
                userId,
                date: stopDate,
                startTime: new Date(stopDate),
                stopTime: stopDateTime,
                duration: Math.floor((stopDateTime.getTime() - new Date(stopDate).getTime()) / (1000 * 60)),
            });
            return NextResponse.json({ message: "Work log stopped successfully.", workLog: newWorkLog }, { status: 200 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to stop work log." }, { status: 500 });
    }
}