import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Status, Priority } from '@prisma/client'; // Add this import

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority } = req.query as {
      status?: Status;
      priority?: Priority;
    };

    // Get all team IDs where user is member
    const memberships = await prisma.teamMember.findMany({
      where: { userId: req.user!.id },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId: req.user!.id }, // Personal tasks
          { teamId: { in: teamIds } }, // All team tasks user belongs to
        ],
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, dueDate, teamId, assigneeId } = req.body;
    
    console.log("Backend received dueDate:", dueDate);
    
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
    const { id } = req.params as { id: string };
    const { title, description, priority, status, dueDate, assigneeId } = req.body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority as Priority;
    if (status !== undefined) updateData.status = status as Status;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;

    // 🔥 IMPORTANT FIX
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
export const getTeamTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;

    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: req.user!.id,
          teamId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const tasks = await prisma.task.findMany({
      where: { teamId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
export const createTeamTask = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const { title, description, priority, dueDate, assigneeId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title required" });
    }

    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: req.user!.id,
          teamId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (assigneeId) {
      const assigneeMembership = await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: assigneeId,
            teamId,
          },
        },
      });

      if (!assigneeMembership) {
        return res.status(400).json({
          error: "Assignee must be team member",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "LOW",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user!.id,
        teamId,
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
    res.status(500).json({ error: "Server error" });
  }
};