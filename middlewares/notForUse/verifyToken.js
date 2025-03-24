const jwt = require('jsonwebtoken');

const jwtVerifyToken = (req, res, next) => {
    try{
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);     // 토큰이 유효한지 확인
        return next();
    }
    catch(err){             //토큰 유호 X
        if(err.name === 'TokenExpiredError'){
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        else if(err.name === 'JsonWebTokenError'){
            return res.status(401).json({
                code: 401,
                message: '토큰이 유효하지 않습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '토큰 오류'
        });
    }
}

module.exports = jwtVerifyToken;