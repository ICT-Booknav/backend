const express = require("express");
const bookController = require("../controller/bookController");
//const shelfController = require("../controllers/shelfController");

const router = express.Router();

// 관리자 페이지 정보 API
/**
 * @swagger
 * paths:
 *   /admin:
 *     get:
 *       summary: 관리자 접속 시 모든 책 데이터 전송
 *       description: 전체 책의 개수, 현재 상태가 true인 책의 개수, 책장 정보를 반환합니다.
 *       responses:
 *         200:
 *           description: 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   totalBooksCount:
 *                     type: integer
 *                     description: 전체 책의 개수
 *                     example: 100
 *                   currentBooksCount:
 *                     type: integer
 *                     description: 현재 상태가 true인 책의 개수
 *                     example: 80
 *                   shelf:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: 책장의 ID
 *                         bookId:
 *                           type: integer
 *                           description: 책의 ID
 *                         location:
 *                           type: string
 *                           description: 책장의 위치
 *         500:
 *           description: 서버 오류
 */
router.get("/admin", bookController.getAdminBook);



// 책 전체 검색 페이지 API
/**
 * @swagger
 * paths:
 *   /admin/search:
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
 * 
 * */
router.get("/admin/search", bookController.getAllBooks);


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
router.get("/admin/serach/:bookid", bookController.getBookDetail);


// 책 관리 API (추가, 수정, 삭제)
/** 
 * @swagger
 * paths:
 *   /admin/books:
 *     post:
 *       summary: 책 추가
 *       description: 새로운 책을 추가합니다.
 *       requestBody:
 *         description: 추가할 책 정보
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       responses:
 *         201:
 *           description: 책이 성공적으로 추가됨
 *         500:
 *           description: 서버 오류
 */
router.post("/admin/books", bookController.createBook);

/** 
*  @swagger
*  paths:
*  /admin/books/{id}:
*    put:
*      summary: 책 수정
*      description: 기존 책 정보를 수정합니다.
*      parameters: 
*        - name: id
*          in: path
*          description: 수정할 책의 ID
*          required: true
*          type: string
*        - name: book
*          in: body
*          description: 수정할 책 정보
*          required: true
*          schema:
*            $ref: '#/models/Book'
*      responses:
*        200:
*          description: 책이 성공적으로 수정됨
*        404:
*          description: 책을 찾을 수 없음
*        500:
*          description: 서버 오류
*/
router.put("/admin/books/:id", bookController.updateBook);

/** 
*  @swagger
*  paths:
*  /admin/books/{id}:
*    delete:
*      summary: 책 삭제
*      description: 기존 책을 삭제합니다.
*      parameters: 
*        - name: id
*          in: path
*          description: 삭제할 책의 ID
*          required: true
*          type: string
*      responses:
*        200:
*          description: 책이 성공적으로 삭제됨
*        404:
*          description: 책을 찾을 수 없음
*        500:
*          description: 서버 오류
*/
router.delete("/admin/books/:id", bookController.deleteBook);

/*책장추가*/
//router.post("/admin/shelf", bookController.addShelf);

module.exports = router;




// 책 조건별 검색 페이지 API
//router.get('/admin/search/condition', bookController.getBookById);
