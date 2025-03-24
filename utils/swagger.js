const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "도서관 API 문서",
            version: "1.0.0",
            description: "도서관 시스템 API 문서입니다.",
        },
        servers: [
            { url: "http://localhost:3003", description: "개발 서버" },
        ],
    },
    apis: [
        path.join(__dirname, "../routes/*.js"), 
        path.join(__dirname, "../models/*.js")
    ], // API 문서화할 파일 경로 수정
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };