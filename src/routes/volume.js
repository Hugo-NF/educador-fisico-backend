/**
 * This file contains all the routes related to the volume entity
 * 
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// const helpers = require('../helpers/VolumeHelper');

// Importing Controllers
const VolumesController = require('../controllers/VolumesController');

// Importing Validations
const { createValidation, editValidation, idValidation } = require('../validations/volumeValidations');

router.get('/index', VolumesController.index);
router.post('/create', celebrate(createValidation), VolumesController.create);
router.get('/:id', celebrate(idValidation), VolumesController.show);
router.put('/:id', celebrate(editValidation), VolumesController.edit);
router.delete('/:id', celebrate(idValidation), VolumesController.delete);


module.exports = router;