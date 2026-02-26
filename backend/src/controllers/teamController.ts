import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const team = await prisma.team.create({
      data: {
        name,
        description,
        ownerId: req.user!.id,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: true,
      },
    });

    // Add creator as owner
    await prisma.teamMember.create({
      data: {
        userId: req.user!.id,
        teamId: team.id,
        role: 'OWNER',
      },
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: { userId: req.user!.id },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
    });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
