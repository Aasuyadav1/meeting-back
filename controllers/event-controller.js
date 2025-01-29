import { Event } from "../models/event-model.js";

// Get all events for a company
export const getEventByCompany = async (req, res) => {
    try {
        const companyId = req.user.role === 'COMPANY' ? 
            req.user.userId : req.user.companyId;

        const events = await Event.find({ companyId });
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Create new event
export const createEvent = async (req, res) => {
    try {
        const companyId = req.user.role === 'COMPANY' ? 
            req.user.userId : req.user.companyId;

        const conflict = await Event.findOne({
            companyId,
            $or: [
                {
                    start: { $lt: new Date(req.body.end) },
                    end: { $gt: new Date(req.body.start) }
                }
            ]
        });

        if (conflict) {
            return res.status(400).json({
                message: 'This time slot conflicts with an existing interview'
            });
        }

        const event = await Event.create({
            ...req.body,
            companyId,
        });

        return res.status(201).json(event);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findOne({
            _id: req.params.id,
            companyId: req.user.role === 'COMPANY' ? req.user.userId : req.user.companyId
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // verify conflict with other events for start and end

        const conflict = await Event.findOne({
            companyId: event.companyId,
            _id: { $ne: event._id },
            $or: [
                {
                    start: { $lt: new Date(req.body.end) },
                    end: { $gt: new Date(req.body.start) }
                }
            ]
        });

        if (conflict) {
            return res.status(400).json({
                message: 'This time slot conflicts with an existing interview'
            });
        }

        event.title = req.body.title;
        event.start = req.body.start;
        event.end = req.body.end;
        event.candidateDetails = {
            name: req.body.candidateDetails.name,
            email: req.body.candidateDetails.email,
        };
        event.interviewerId = req.body.interviewerId;
        
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const result = await Event.deleteOne({
            _id: req.params.id,
            companyId: req.user.role === 'COMPANY' ? req.user.userId : req.user.companyId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
