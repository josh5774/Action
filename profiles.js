/**
 * FilmLink — Profile Routes
 *
 * GET    /profiles/:userId          → public profile view
 * GET    /profiles/me               → own profile (auth required)
 * POST   /profiles                  → create profile (auth required)
 * PATCH  /profiles/me               → update profile fields
 * POST   /profiles/me/headshot      → upload headshot image
 * DELETE /profiles/me/headshot      → remove headshot
 * POST   /profiles/me/reel          → upload reel video
 * POST   /profiles/me/resume        → upload resume PDF
 *
 * Credits
 * POST   /profiles/me/credits       → add credit
 * PATCH  /profiles/me/credits/:id   → edit credit
 * DELETE /profiles/me/credits/:id   → remove credit
 *
 * Portfolio
 * POST   /profiles/me/portfolio     → add portfolio item
 * DELETE /profiles/me/portfolio/:id → remove portfolio item
 *
 * Follow graph
 * POST   /profiles/:userId/follow   → follow a user
 * DELETE /profiles/:userId/follow   → unfollow
 * GET    /profiles/:userId/followers
 * GET    /profiles/:userId/following
 */

import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

import { authenticate } from '../middleware/authenticate.js';
import {
  headshotUpload,
  reelUpload,
  resumeUpload,
  portfolioUpload,
  uploadToS3,
  deleteFromS3,
} from '../lib/upload.js';

const router = Router();
const prisma = new PrismaClient();

// ─── Validation schemas ───────────────────────────────────────────────────────

const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio:         z.string().max(2000).optional(),
  profession:  z.enum([
    'ACTOR','DIRECTOR','WRITER','PRODUCER','CINEMATOGRAPHER',
    'EDITOR','COMPOSER','PRODUCTION_DESIGNER','COSTUME_DESIGNER',
    'SOUND_DESIGNER','OTHER',
  ]).optional(),
  location:    z.string().max(100).optional(),
  reelUrl:     z.string().url().optional().nullable(),
  website:     z.string().url().optional().nullable(),
  socialLinks: z.object({
    imdb:      z.string().url().optional().nullable(),
    instagram: z.string().url().optional().nullable(),
    twitter:   z.string().url().optional().nullable(),
    linkedin:  z.string().url().optional().nullable(),
    vimeo:     z.string().url().optional().nullable(),
  }).optional(),
  skills:   z.array(z.string().max(50)).max(30).optional(),
  isPublic: z.boolean().optional(),
});

const CreditSchema = z.object({
  title:     z.string().min(1).max(200),
  role:      z.string().min(1).max(100),
  year:      z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  type:      z.enum(['Feature', 'Short', 'TV', 'Web Series', 'Music Video', 'Commercial', 'Other']).optional(),
  director:  z.string().max(100).optional(),
  url:       z.string().url().optional().nullable(),
  featured:  z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const PortfolioItemSchema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  sortOrder:   z.number().int().optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PUBLIC_PROFILE_SELECT = {
  id: true,
  userId: true,
  displayName: true,
  headshot: true,
  bio: true,
  profession: true,
  location: true,
  reelUrl: true,
  website: true,
  socialLinks: true,
  skills: true,
  isPublic: true,
  credits: {
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { year: 'desc' }],
  },
  portfolioItems: {
    orderBy: { sortOrder: 'asc' },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      userType: true,
      _count: {
        select: { followers: true, following: true },
      },
    },
  },
};

// ─── Public profile ───────────────────────────────────────────────────────────

router.get('/:userId', async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.params.userId },
      select: PUBLIC_PROFILE_SELECT,
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    if (!profile.isPublic) {
      // If the request is authenticated and it's the owner, allow it
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'This profile is private.' });
      }
      // Verify token inline (don't block public users with hard 401)
      try {
        const { verifyAccessToken } = await import('../lib/jwt.js');
        const payload = verifyAccessToken(authHeader.slice(7));
        if (payload.userId !== profile.userId) {
          return res.status(403).json({ error: 'This profile is private.' });
        }
      } catch {
        return res.status(403).json({ error: 'This profile is private.' });
      }
    }

    return res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Own profile ──────────────────────────────────────────────────────────────

router.get('/me', authenticate, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
      include: {
        credits: { orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }] },
        portfolioItems: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not yet created.', code: 'NO_PROFILE' });
    }

    return res.json(profile);
  } catch (err) {
    console.error('Get own profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Create profile ───────────────────────────────────────────────────────────

router.post('/', authenticate, async (req, res) => {
  try {
    const existing = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });

    if (existing) {
      return res.status(409).json({ error: 'Profile already exists. Use PATCH /profiles/me to update.' });
    }

    const result = ProfileUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ error: 'Validation failed', issues: result.error.issues });
    }

    const profile = await prisma.profile.create({
      data: { userId: req.user.userId, ...result.data },
    });

    return res.status(201).json(profile);
  } catch (err) {
    console.error('Create profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Update profile ───────────────────────────────────────────────────────────

router.patch('/me', authenticate, async (req, res) => {
  const result = ProfileUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: 'Validation failed', issues: result.error.issues });
  }

  try {
    const profile = await prisma.profile.upsert({
      where:  { userId: req.user.userId },
      update: result.data,
      create: { userId: req.user.userId, ...result.data },
    });

    return res.json(profile);
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Headshot upload ──────────────────────────────────────────────────────────

router.post(
  '/me/headshot',
  authenticate,
  headshotUpload.single('headshot'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      // Delete old headshot from S3 first
      const existing = await prisma.profile.findUnique({
        where: { userId: req.user.userId },
        select: { headshot: true },
      });
      if (existing?.headshot) {
        deleteFromS3(existing.headshot).catch(console.error);
      }

      const url = await uploadToS3(req.file, 'headshots');

      const profile = await prisma.profile.upsert({
        where:  { userId: req.user.userId },
        update: { headshot: url },
        create: { userId: req.user.userId, headshot: url },
      });

      return res.json({ headshot: profile.headshot });
    } catch (err) {
      console.error('Headshot upload error:', err);
      return res.status(500).json({ error: 'Upload failed.' });
    }
  }
);

router.delete('/me/headshot', authenticate, async (req, res) => {
  try {
    const existing = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
      select: { headshot: true },
    });

    if (existing?.headshot) {
      await deleteFromS3(existing.headshot);
      await prisma.profile.update({
        where:  { userId: req.user.userId },
        data:   { headshot: null },
      });
    }

    return res.json({ message: 'Headshot removed.' });
  } catch (err) {
    console.error('Headshot delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Reel upload ──────────────────────────────────────────────────────────────

router.post(
  '/me/reel',
  authenticate,
  reelUpload.single('reel'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const existing = await prisma.profile.findUnique({
        where: { userId: req.user.userId },
        select: { reelUrl: true },
      });
      // Only delete if old URL is an S3 URL we own (not an external link)
      if (existing?.reelUrl?.includes(process.env.AWS_CDN_URL || '')) {
        deleteFromS3(existing.reelUrl).catch(console.error);
      }

      const url = await uploadToS3(req.file, 'reels');

      await prisma.profile.upsert({
        where:  { userId: req.user.userId },
        update: { reelUrl: url },
        create: { userId: req.user.userId, reelUrl: url },
      });

      return res.json({ reelUrl: url });
    } catch (err) {
      console.error('Reel upload error:', err);
      return res.status(500).json({ error: 'Upload failed.' });
    }
  }
);

// ─── Resume upload ────────────────────────────────────────────────────────────

router.post(
  '/me/resume',
  authenticate,
  resumeUpload.single('resume'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const url = await uploadToS3(req.file, 'resumes');

      await prisma.profile.upsert({
        where:  { userId: req.user.userId },
        update: { resumeUrl: url },
        create: { userId: req.user.userId, resumeUrl: url },
      });

      return res.json({ resumeUrl: url });
    } catch (err) {
      console.error('Resume upload error:', err);
      return res.status(500).json({ error: 'Upload failed.' });
    }
  }
);

// ─── Credits ──────────────────────────────────────────────────────────────────

router.post('/me/credits', authenticate, async (req, res) => {
  const result = CreditSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: 'Validation failed', issues: result.error.issues });
  }

  try {
    const profile = await prisma.profile.upsert({
      where:  { userId: req.user.userId },
      update: {},
      create: { userId: req.user.userId },
    });

    const credit = await prisma.credit.create({
      data: { profileId: profile.id, ...result.data },
    });

    return res.status(201).json(credit);
  } catch (err) {
    console.error('Add credit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/me/credits/:id', authenticate, async (req, res) => {
  const result = CreditSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: 'Validation failed', issues: result.error.issues });
  }

  try {
    // Ensure credit belongs to this user
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const credit = await prisma.credit.findFirst({
      where: { id: req.params.id, profileId: profile.id },
    });

    if (!credit) return res.status(404).json({ error: 'Credit not found.' });

    const updated = await prisma.credit.update({
      where: { id: req.params.id },
      data:  result.data,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Update credit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/me/credits/:id', authenticate, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const deleted = await prisma.credit.deleteMany({
      where: { id: req.params.id, profileId: profile.id },
    });

    if (deleted.count === 0) return res.status(404).json({ error: 'Credit not found.' });

    return res.json({ message: 'Credit removed.' });
  } catch (err) {
    console.error('Delete credit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Portfolio ────────────────────────────────────────────────────────────────

router.post(
  '/me/portfolio',
  authenticate,
  portfolioUpload.single('media'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const result = PortfolioItemSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ error: 'Validation failed', issues: result.error.issues });
    }

    try {
      const mediaUrl = await uploadToS3(req.file, 'portfolio');
      const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

      const profile = await prisma.profile.upsert({
        where:  { userId: req.user.userId },
        update: {},
        create: { userId: req.user.userId },
      });

      const item = await prisma.portfolioItem.create({
        data: {
          profileId: profile.id,
          mediaUrl,
          mediaType,
          ...result.data,
        },
      });

      return res.status(201).json(item);
    } catch (err) {
      console.error('Portfolio upload error:', err);
      return res.status(500).json({ error: 'Upload failed.' });
    }
  }
);

router.delete('/me/portfolio/:id', authenticate, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    const item = await prisma.portfolioItem.findFirst({
      where: { id: req.params.id, profileId: profile.id },
    });

    if (!item) return res.status(404).json({ error: 'Portfolio item not found.' });

    await deleteFromS3(item.mediaUrl);
    await prisma.portfolioItem.delete({ where: { id: req.params.id } });

    return res.json({ message: 'Portfolio item removed.' });
  } catch (err) {
    console.error('Delete portfolio item error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Follow / Unfollow ────────────────────────────────────────────────────────

router.post('/:userId/follow', authenticate, async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.userId) {
    return res.status(400).json({ error: 'You cannot follow yourself.' });
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return res.status(404).json({ error: 'User not found.' });

    await prisma.follow.create({
      data: { followerId: req.user.userId, followingId: userId },
    });

    return res.status(201).json({ message: 'Following.' });
  } catch (err) {
    // Unique constraint violation = already following
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Already following this user.' });
    }
    console.error('Follow error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId/follow', authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await prisma.follow.deleteMany({
      where: { followerId: req.user.userId, followingId: userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'You are not following this user.' });
    }

    return res.json({ message: 'Unfollowed.' });
  } catch (err) {
    console.error('Unfollow error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId/followers', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  || '1'));
  const limit = Math.min(50, parseInt(req.query.limit || '20'));
  const skip  = (page - 1) * limit;

  try {
    const [follows, total] = await prisma.$transaction([
      prisma.follow.findMany({
        where: { followingId: req.params.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            select: {
              id: true, firstName: true, lastName: true,
              profile: { select: { displayName: true, headshot: true, profession: true } },
            },
          },
        },
      }),
      prisma.follow.count({ where: { followingId: req.params.userId } }),
    ]);

    return res.json({
      data: follows.map(f => f.follower),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Followers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId/following', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  || '1'));
  const limit = Math.min(50, parseInt(req.query.limit || '20'));
  const skip  = (page - 1) * limit;

  try {
    const [follows, total] = await prisma.$transaction([
      prisma.follow.findMany({
        where: { followerId: req.params.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            select: {
              id: true, firstName: true, lastName: true,
              profile: { select: { displayName: true, headshot: true, profession: true } },
            },
          },
        },
      }),
      prisma.follow.count({ where: { followerId: req.params.userId } }),
    ]);

    return res.json({
      data: follows.map(f => f.following),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Following error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
