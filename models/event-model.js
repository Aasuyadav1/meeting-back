import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    candidateDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    interviewerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    companyId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

export const Event = mongoose.model("Event", eventSchema);