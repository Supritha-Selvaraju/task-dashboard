import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Status, Priority } from '@prisma/client'; // Add this import

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId, status, priority } = req.query as {
      teamId?: string;
      status?: Status;
      priority?: Priority;
    };
    
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId: req.user!.id }, // Personal tasks
          teamId && { teamId, assigneeId: req.user!.id }, // Assigned team tasks
        ].filter(Boolean) as any[],
        ...(status && { status: status as Status }),
        ...(priority && { priority: priority as Priority }),
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, dueDate, teamId, assigneeId } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority as Priority,
        status: status as Status,
        dueDate: dueDate ? new Date(dueDate as string) : null,
        order: 0,
        userId: req.user!.id,
        teamId: teamId || null,
        assigneeId: assigneeId || null,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string }; // Fix: explicit string type
    const { title, description, priority, status, dueDate, assigneeId } = req.body;
    
    const task = await prisma.task.update({
      where: { id }, // Now TypeScript knows id is string
      data: {
        title,
        description,
        priority: priority as Priority,
        status: status as Status,
        dueDate: dueDate ? new Date(dueDate as string) : null,
        assigneeId: assigneeId || null,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string }; // Fix: explicit string type
    
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
