const router = require('express').Router();
const { PrismaClient, ProjectStatus } = require('@prisma/client');

const prisma = new PrismaClient();

const publishedOpenProjectWhere = {
  status: ProjectStatus.OPEN,
  publishedAt: {
    not: null,
  },
};

const projectSelect = {
  id: true,
  posterId: true,
  title: true,
  description: true,
  projectType: true,
  genre: true,
  status: true,
  isFeatured: true,
  location: true,
  city: true,
  state: true,
  isRemote: true,
  shootStartDate: true,
  shootEndDate: true,
  auditionDate: true,
  auditionInstructions: true,
  posterUrl: true,
  website: true,
  tags: true,
  viewCount: true,
  applicationCount: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  poster: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          profession: true,
          bio: true,
          city: true,
          state: true,
          country: true,
          headshot: true,
        },
      },
    },
  },
  roles: {
    where: {
      isFilled: false,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      projectId: true,
      title: true,
      profession: true,
      description: true,
      compensation: true,
      compensationDetails: true,
      ageRange: true,
      gender: true,
      ethnicity: true,
      isFilled: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

router.get('/', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: publishedOpenProjectWhere,
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      select: projectSelect,
    });

    res.json({
      projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        ...publishedOpenProjectWhere,
      },
      select: projectSelect,
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    return res.json({
      project,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;