const express = require("express");
const chatController = require("../controller/chatController");
const mcuController = require("../controller/mcuController");

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
 *         400:
 *           description: 잘못된 요청
 *         500:
 *           description: 서버 오류
 */
router.get("/chat", chatController.askLLM);


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

router.post("/chat/:title/selectBook/:selectedTitle", mcuController.selectBook);
module.exports = router;