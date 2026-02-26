import { Router } from 'express';
import { createTeam, getTeams } from '../controllers/teamController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.post('/', createTeam);
router.get('/', getTeams);

export default router;
