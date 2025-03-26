const express = require("express");
const bookController = require("../controller/bookController");
const mcuController = require("../controller/mcuController");

const router = express.Router();

// 책 전체 검색 페이지 API
/**
 * @swagger
 * paths:
 *   /search:
 *     get:
 *       summary: 모든 책 조회
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
router.get("/search", bookController.getAllBooks);

// 책 상세 정보 API
/**
 * @swagger
 * paths:
 *   /search/{title}:
 *     get:
 *       summary: 지정된 책 제목으로 책 정보를 조회합니다.
 *       description: 제목에 따라 책의 상세 정보를 검색합니다.
 *       tags:
 *         - 책
 *       parameters:
 *         - name: title
 *           in: path
 *           description: 검색하려는 책의 제목
 *           required: true
 *           schema:
 *             type: string
 *             example: "나의 라임 오렌지 나무"
 *       responses:
 *         200:
 *           description: 책 정보를 성공적으로 조회했습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         404:
 *           description: 해당 제목의 책을 찾을 수 없습니다.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "책을 찾을 수 없음"
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
router.get("/search/:title", bookController.getBookDetail);

// 책 사출 API (책 사출)
/**
 * @swagger
 * paths:
 *   /search/{title}/selectBook/{selectedTitle}:
 *     post:
 *       summary: 책 선택 API (책 사출)
 *       description: 사용자가 지정한 제목(selectedTitle)에 해당하는 책을 선택하고 라즈베리파이로 데이터를 전송하여 책을 사출합니다.
 *       tags:
 *         - Book Management
 *       parameters:
 *         - name: title
 *           in: path
 *           required: true
 *           description: 검색할 책의 제목
 *           schema:
 *             type: string
 *         - name: selectedTitle
 *           in: path
 *           required: true
 *           description: 선택할 책의 제목
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: 책 선택 완료
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "책 선택 완료"
 *         500:
 *           description: 서버 오류
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "서버 오류"
 */
router.post('/search/:title', mcuController.selectBook);

module.exports = router;