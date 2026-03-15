const router = require('express').Router();

// TODO: implement auth routes
router.get('/', (_req, res) => res.json({ message: 'auth route — coming soon' }));

module.exports = router;
