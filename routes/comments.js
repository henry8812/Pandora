const express = require('express');
const router = express.Router();
const articles = require("../DAO/comments");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');

router.use(fileUpload());