module.exports = {
  MODELS: {
    USER: 'User',
  },
  DEFAULT_USER: {
    SUPER_ADMIN: {
      NAME: 'Super Admin',
      USERNAME: process.env.SUPER_ADMIN_USERNAME,
      EMAIL: process.env.SUPER_ADMIN_EMAIL,
    },
    ADMIN: {
      NAME: 'Admin',
      USERNAME: process.env.SUPER_ADMIN_USERNAME,
      EMAIL: process.env.SUPER_ADMIN_EMAIL,
    }
  }
}