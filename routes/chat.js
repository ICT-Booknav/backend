const express = require("express");
const chatController = require("../controller/chatController");
const mcuController = require("../controller/mcuController");
const bookController = require("../controller/bookController");
const book = require("../models/book");

const router = express.Router();

// LLM과 대화 요청 (사용자 질문 전송)
/**
 * @swagger
 * paths:
 *   /chat:
 *     post:
 *       summary: LLM과 대화 요청
 *       description: 사용자 질문을 LLM에 전송합니다.
 *       requestBody:
 *         description: 사용자 질문 정보
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: 사용자 ID
 *                   example: 'user123'
 *                 question:
 *                   type: string
 *                   description: 사용자 질문
 *                   example: '책 제목이 무엇인가요?'
 *       responses:
 *         200:
 *           description: LLM 응답
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   answer:
 *                     type: string
 *                     description: LLM의 응답
 *                     example: '책 제목은 자료구조입니다.'
 *                   recommend:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: LLM의 추천 도서
 *                     example: ['자료구조', '알고리즘']
 *         400:
 *           description: 잘못된 요청
 *         500:
 *           description: 서버 오류
 */
router.post("/chat", chatController.askLLM);

// 책 전체 검색 페이지 API
/**
 * @swagger
 * paths:
 *   /search:
 *     get:
 *       summary: LLM 추천천 책 조회
 *       description: 데이터베이스에서 모든 책을 조회하거나, 제공된 검색어를 기준으로 제목, 장르, 발행 연도 또는 출판사에 해당하는 결과를 반환합니다.
 *       tags:
 *         - 책
 *       parameters:
 *         - name: search
 *           in: query
 *           description: 책 정보를 검색하기 위한 검색어
 *           required: false
 *           schema:
 *             type: string
 *             example: "문학"
 *       responses:
 *         200:
 *           description: 책 목록이 성공적으로 반환되었습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *         500:
 *           description: 서버 오류가 발생했습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "서버 오류"
 */
router.get('/chat/search', bookController.getAllBooks);

// 책 사출 (사용자가 선택한 책 사출)
/**
 * @swagger
 * paths:
 *   /chat/{title}/selectBook/{selectedTitle}:
 *     post:
 *       summary: 사용자가 선택한 책 사출
 *       description: 사용자가 선택한 책의 위치 정보를 검색하고, 해당 위치 정보를 라즈베리파이 API에 전송하여 책을 사출하는 기능입니다.
 *       tags:
 *         - 책
 *       parameters:
 *         - name: title
 *           in: path
 *           description: 사용자가 선택한 책의 메인 제목
 *           required: true
 *           schema:
 *             type: string
 *             example: "문학의 이해"
 *         - name: selectedTitle
 *           in: path
 *           description: 사용자가 선택한 세부 제목
 *           required: true
 *           schema:
 *             type: string
 *             example: "고전 문학"
 *       responses:
 *         200:
 *           description: 책 선택 및 사출이 성공적으로 완료되었습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "책 선택 완료"
 *         500:
 *           description: 서버 오류가 발생했습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "서버 오류"
 */

router.post("/chat/:title", mcuController.selectBook);
module.exports = router;