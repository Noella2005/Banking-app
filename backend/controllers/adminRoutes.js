const express = require('express');
const router = express.Router();
const { protect, manager } = require('../middleware/authMiddleware');
const { getAllUsers, approveUser, freezeAccount } = require('../controllers/adminController');

// All admin routes are protected and require manager role
router.use(protect, manager);

router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/freeze', freezeAccount);
// ... Add other admin routes

module.exports = router;