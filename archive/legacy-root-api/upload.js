/**
 * FilmLink — File Upload Middleware
 *
 * Uses multer for multipart handling, then streams directly to S3.
 * Supported uploads:
 *   - Headshots: JPEG/PNG/WEBP, max 5MB
 *   - Reels:     MP4/MOV/WEBM, max 500MB
 *   - Resumes:   PDF, max 10MB
 *   - Portfolio: JPEG/PNG/WEBP/MP4, max 50MB
 */

import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { config } from '../config/index.js';

// ─── S3 client ────────────────────────────────────────────────────────────────

export const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// ─── Multer (memory storage — buffer goes straight to S3) ─────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_PDF_TYPES   = ['application/pdf'];

function makeUpload({ allowedTypes, maxSizeMB }) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
      }
    },
  });
}

export const headshotUpload = makeUpload({ allowedTypes: ALLOWED_IMAGE_TYPES, maxSizeMB: 5 });
export const reelUpload     = makeUpload({ allowedTypes: ALLOWED_VIDEO_TYPES, maxSizeMB: 500 });
export const resumeUpload   = makeUpload({ allowedTypes: ALLOWED_PDF_TYPES,   maxSizeMB: 10 });
export const portfolioUpload = makeUpload({
  allowedTypes: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES],
  maxSizeMB: 50,
});

// ─── S3 upload helper ─────────────────────────────────────────────────────────

/**
 * Upload a multer file buffer to S3.
 * Returns the public CDN URL.
 */
export async function uploadToS3(file, folder) {
  const ext = path.extname(file.originalname).toLowerCase();
  const key = `${folder}/${uuid()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Cache aggressively — files are immutable (new upload = new key)
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${config.aws.cdnUrl}/${key}`;
}

/**
 * Delete a file from S3 by its full CDN URL.
 */
export async function deleteFromS3(cdnUrl) {
  if (!cdnUrl) return;
  const key = cdnUrl.replace(`${config.aws.cdnUrl}/`, '');
  await s3.send(new DeleteObjectCommand({ Bucket: config.aws.bucket, Key: key }));
}
