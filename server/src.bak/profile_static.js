const express = require('express');
const path = require('path');
const { uploadsDir } = require('./profile_upload');

const staticRouter = express.Router();
staticRouter.use('/uploads', express.static(uploadsDir));

module.exports = staticRouter;



