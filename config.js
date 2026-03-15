import dotenv from 'dotenv';
dotenv.config();

function require_env(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || '4000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',

  jwt: {
    accessSecret:  require_env('JWT_ACCESS_SECRET'),
    refreshSecret: require_env('JWT_REFRESH_SECRET'),
    accessExpires:  process.env.JWT_ACCESS_EXPIRES  || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d',
  },

  email: {
    host:     process.env.SMTP_HOST     || 'smtp.sendgrid.net',
    port:     parseInt(process.env.SMTP_PORT || '587'),
    user:     process.env.SMTP_USER     || '',
    pass:     process.env.SMTP_PASS     || '',
    from:     process.env.EMAIL_FROM    || 'no-reply@filmlink.com',
    fromName: process.env.EMAIL_FROM_NAME || 'FilmLink',
  },

  aws: {
    region:          process.env.AWS_REGION          || 'us-east-1',
    accessKeyId:     require_env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: require_env('AWS_SECRET_ACCESS_KEY'),
    bucket:          require_env('AWS_S3_BUCKET'),
    cdnUrl:          process.env.AWS_CDN_URL || `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com`,
  },

  resetTokenExpiresMinutes: parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES || '30'),
};
