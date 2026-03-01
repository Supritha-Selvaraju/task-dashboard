import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTeamTasks,
  createTeamTask,
} from "../controllers/taskController";
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get("/team/:teamId", getTeamTasks);
router.post("/team/:teamId", createTeamTask);

export default router;
