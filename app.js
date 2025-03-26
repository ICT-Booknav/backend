const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const guestRouter = require("./routes/guest");
const adminRouter = require("./routes/admin");
const llmRouter = require("./routes/chat");
const mcuRouter = require("./routes/mcu");
const { sequelize } = require('./models');
const {swaggerUi, specs} = require('./utils/swagger');
const cors = require("cors");

dotenv.config();
const app = express();

app.set('port', process.env.PORT||3003);
if(process.env.NODE_ENV === "production"){
    app.use(morgan('combined'));
}
else{
    app.use(morgan('dev'));
}

sequelize.sync({ force: false })
    .then(() => {
        console.log("데이터 베이스 연결 성공")
    })
    .catch((err) => {
        console.log(err);
    });

//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/img', express.static(path.join(__dirname, 'uploads')));
//app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(cors());
app.use("/img", express.static(path.join(__dirname, 'img')));

//정적 파일 제공 코드(not for use)
//app.use(express.static(path.join(__dirname, 'public')));

//app.use()
app.use("/api/search", guestRouter);  // 사용자 기능 API
app.use("/api/admin", adminRouter);  // 관리자 기능 API
app.use("/api/llm", llmRouter);  // LLM 기능 API
app.use("/api/mcu", mcuRouter);  // MCU 관련 API

// Swagger API 문서화
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 404 에러 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 오류 처리 미들웨어 (오타 수정됨)
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.json({ error: err.message });
});


// 서버 실행
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
    console.log(`swagger api addresss : http://localhost:${app.get("port")}/api-docs`);
});
