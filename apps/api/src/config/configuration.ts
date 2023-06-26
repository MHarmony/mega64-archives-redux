/**
 * The configuration object.
 */
export default () => ({
  auth: {
    callbackUrl:
      process.env.AUTH_CALLBACK_URL ||
      'http://localhost:3000/auth/login/callback',
    expiration: process.env.MAGIC_LINK_EXPIRATION || '5m',
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    jwtSecret: process.env.JWT_SECRET,
    secret: process.env.MAGIC_LINK_SECRET,
  },
  cache: {
    max: parseInt(process.env.CACHE_MAX_ITEMS as string, 10) || 50,
    ttl: parseInt(process.env.CACHE_TTL_MS as string, 10) || 60000,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    name: process.env.DATABASE_NAME || 'mega64_archives_redux',
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    user: process.env.DATABASE_USER,
  },
  port: parseInt(process.env.PORT as string, 10) || 3000,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  throttle: {
    limit: parseInt(process.env.THROTTLE_LIMIT as string, 10) || 20,
    ttl: parseInt(process.env.THROTTLE_TTL as string, 10) || 60,
  },
});
