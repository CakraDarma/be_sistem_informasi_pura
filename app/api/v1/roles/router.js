const express = require('express');
const router = express();
const {
	create,
	// index, find, update, destroy
} = require('./controller');
const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/roles', authenticateUser, authorizeRoles('organizer'), index);
// router.get('/roles/:id', authenticateUser, authorizeRoles('organizer'), find);
// router.put('/roles/:id', authenticateUser, authorizeRoles('organizer'), update);
// router.delete(
// 	'/roles/:id',
// 	authenticateUser,
// 	authorizeRoles('organizer'),
// 	destroy
// );
router.post('/roles', authenticateUser, authorizeRoles('admin'), create);

module.exports = router;
