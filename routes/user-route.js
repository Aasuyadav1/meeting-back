import { Router } from "express";
import { registerUser, login, getHrByCompanyId, getUserDetails } from "../controllers/user-controller.js";
import { authenticateUser } from "../middleware/validate-auth.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/user/:id', authenticateUser, getUserDetails);
router.get('/hr/company/', authenticateUser, getHrByCompanyId);

export default router;





