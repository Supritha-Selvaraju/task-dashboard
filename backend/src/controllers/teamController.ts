import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Team name is required",
      });
    }

    const trimmedName = name.trim();

    // Check if team exists
    let team = await prisma.team.findFirst({
      where: { name: trimmedName },
    });

    if (team) {
      const existingMembership = await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: req.user!.id,
            teamId: team.id,
          },
        },
      });

      if (!existingMembership) {
        await prisma.teamMember.create({
          data: {
            userId: req.user!.id,
            teamId: team.id,
            role: "MEMBER",
          },
        });
      }

      return res.status(200).json({
        message: "Joined existing team",
        team,
      });
    }

    // Create new team
    team = await prisma.team.create({
      data: {
        name: trimmedName,
        description: description?.trim() || null,
        ownerId: req.user!.id,
      },
    });

    await prisma.teamMember.create({
      data: {
        userId: req.user!.id,
        teamId: team.id,
        role: "OWNER",
      },
    });

    res.status(201).json({
      message: "Team created",
      team,
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
export const getTeamMembers = async (req: AuthRequest, res: Response) => {
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

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};