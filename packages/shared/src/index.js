// Shared constants, validators, and types used across web, mobile, and backend

export const USER_ROLES = {
  FAN: 'fan',
  CREATIVE: 'creative',
  ADMIN: 'admin',
};

export const APPLICATION_STATUS = {
  PENDING:  'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PROJECT_COMPENSATION = {
  PAID:   'paid',
  UNPAID: 'unpaid',
  DEFERRED: 'deferred',
};

export const PROFESSION_TYPES = [
  'actor', 'writer', 'director', 'producer',
  'cinematographer', 'editor', 'composer', 'other',
];
