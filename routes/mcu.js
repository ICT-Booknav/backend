const express = require("express");
const mcuController = require("../controller/mcuController");
const router = express.Router();

/**
 * @swagger
 * paths:
 *   /mcu/update:
 *     post:
 *       summary: 책장 정보 업데이트
 *       description: 센서 데이터로 책장 정보를 업데이트합니다.
 *       requestBody:
 *         description: 업데이트할 책장 정보
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 책장 ID
 *                   example: 1
 *                 row:
 *                   type: integer
 *                   description: 책장 내 몇 번째 줄인지
 *                   example: 1
 *                 column:
 *                   type: integer
 *                   description: 책장 내 몇 번째 칸인지
 *                   example: 1
 *                 book_present:
 *                   type: boolean
 *                   description: 책이 있는지 여부
 *                   example: true
 *                 bookId:
 *                   type: string
 *                   description: 책 ID
 *                   example: '12345678901234567890123456789012'
 *       responses:
 *         200:
 *           description: 책장 정보 수정 완료
 *         404:
 *           description: 책장 정보를 찾을 수 없음
 *         500:
 *           description: 서버 오류
 */
router.post('/update', mcuController.updateShelf);

module.exports = router;

