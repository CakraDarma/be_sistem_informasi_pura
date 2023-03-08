const express = require('express');
const router = express();
const { signinCms, signupCms } = require('./controller');

router.post('/auth/signin', signinCms);
router.post('/auth/signup', signupCms);

module.exports = router;
