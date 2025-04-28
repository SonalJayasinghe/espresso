import connectMongo from "@/lib/mongoose";
import WorkLog from "@/models/WorkLog";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");


    if (!userId) {
        return NextResponse.json({ message: "Please provide all required fields." }, { status: 400 });
    }

    try {
        await connectMongo();
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "MongoDB connection failed." }, { status: 500 });
    }

    try {
        const logs = await WorkLog.find({ userId });
        const dailyTotals: { [date: string]: number } = {};

        logs.forEach(log => {
            if (log.duration && log.date) {
                if (!dailyTotals[log.date]) {
                    dailyTotals[log.date] = 0;
                }
                dailyTotals[log.date] += log.duration;
            }
        })

        const result = Object.keys(dailyTotals).map(date => ({
            date,
            totalDuration: parseFloat(dailyTotals[date].toFixed(2))
        }));

        return NextResponse.json({data:result}, { status: 200 });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch work logs." }, { status: 500 });
    }
}