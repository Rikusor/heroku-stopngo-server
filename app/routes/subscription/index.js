const router = require('express').Router();
const create = require('./create');
const update = require('./update');
const remove= require('./remove');

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
