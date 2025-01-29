import { Router } from "express";
import { authenticateUser } from "../middleware/validate-auth.js";
import { getEventByCompany, createEvent, updateEvent, deleteEvent } from "../controllers/event-controller.js";

const router = Router();

router.get('/all/company/event', authenticateUser, getEventByCompany);
router.post('/create/event', authenticateUser, createEvent);
router.put('/update/event/:id', authenticateUser, updateEvent);
router.delete('/delete/event/:id', authenticateUser, deleteEvent);

export default router;





