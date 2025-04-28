import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    startTime:{
        type: Date,
        required: true,
    },
    stopTime:{
        type: Date,
    },
    duration:{
        type:Number,
    }
})

const WorkLog = mongoose.models.WorkLog || mongoose.model("WorkLog", WorkLogSchema);

export default WorkLog;