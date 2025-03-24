/*
    not use for this project
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User}   = require('../../models');


const registerUser = async (req, res) => {
    const {id, password} = req.body;
    try{
        const isExist = await User.findOne({
            where:{
                id: id,
            }
        });
        if(isExist){
            return res.status(409).json({
                code: 409,
                message: '이미 존재하는 아이디입니다.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);     //비밀번호 암호화(해싱)
        await User.create({
            id: id,
            password: hashedPassword,
        });

        res.status(201).json({
            code: 201,
            message: '회원가입 성공',
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 오류',
        });
    }
};


const jwtLogin = async (req, res) => {
    const {id, password} = req.body;
    try{
        const user = await User.findOne({
            where:{
                id : id,            //id가 일치하는 유저 찾기
            }
        });
        const checkPassword = await bcrypt.compare(password, user.password);       //비밀번호 확인
        if(!user || !checkPassword){                  //1번 오류 : 존재하지 않는 회원
            return res.status(401).json({
                code: 401,
                message: '비밀번호/ID를 확인해주세요.',
            });
        }
        //Access Token 발급
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
        
        //Refresh Token 발급
        const refreshToken = jwt.sign({ id: user.id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); 
        
        //Access Token을 쿠키에 저장 -> httpOnly 토큰에 저장하여 보안 강화
        res.cookie("accessToken", accessToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: "strict", 
        });

        //Refresh Token을 JSON에 저장.
        res.json({ 
            code: 200,
            message: '로그인 성공/토큰 발급 완료',
            user: {id: user.id, username: user.username},
            refreshToken,
         });
        console.log(user.id+'님이 '+ new Date().toLocaleString()+'에 로그인하셨습니다.');
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 오류',
        });
    }
};


const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ 
        code: 401, 
        message: "Refresh Token 없음",
    });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findOne({ 
            where: { id: decoded.id, refreshToken } 
        });

        if (!user) return res.status(401).json({ 
            code: 401, 
            message: "유효하지 않은 Refresh Token",
        });

        // 새 Access Token 발급 (1시간)
        const newAccessToken = jwt.sign({
                id: user.id, username: user.username 
            }, 
                process.env.JWT_SECRET, { 
                expiresIn: '1h' 
            }
        );

        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict" });
        res.json({ code: 200, message: "Access Token 갱신 완료" });
    } catch (err) {
        return res.status(401).json({ code: 401, message: "Refresh Token 오류" });
    }
};

module.exports = {registerUser, jwtLogin, refreshAccessToken};