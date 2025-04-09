const router = require('express').Router();
module.exports = router;

router.use('/departments', require('./departments'));
router.use('/professors', require('./professors'));