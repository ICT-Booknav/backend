/*
    JWT 라우터 설정 (not for use)
*/

const express = require('express');
const router = express.Router();   
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middlewares/verifyToken');
const { createToken, tokenTest } = require('../controllers/tokenController');


router.post('/login', jwtLogin);                         // 토큰 생성
router.post('/verify', verifyToken, tokenTest);            // 토큰 확인


module.exports = router;