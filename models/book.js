/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 도서 ID
 *           example: '0f0f1020101011212123123123123123'
 *         title:
 *           type: string
 *           description: 책 제목
 *           example: '자료구조'
 *         author:
 *           type: string
 *           description: 저자
 *           example: '홍길동'
 *         publisher:
 *           type: string
 *           description: 출판사
 *           example: '한빛미디어'
 *         publishYear:
 *           type: integer
 *           description: 출판 년도
 *           example: 2021
 *         genre:
 *           type: string
 *           description: 장르
 *           example: 'IT'
 *         coverImage:
 *           type: string
 *           description: 책 표지 URL
 *           example: 'https://...'
 *         summary:
 *           type: string
 *           description: 책 줄거리
 *           example: '자료구조에 대한 설명'
 *         tableOfContents:
 *           type: string
 *           description: 책 목차
 *           example: '1장. 자료구조의 개요...'
 *         bookSize:
 *           type: integer
 *           description: 책 크기
 *           example: 1
 *         location:
 *           type: integer
 *           description: 현재 도서 위치 (책장 ID)
 *           example: 1
 */


module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        // Model attributes are defined here
        id: {  // 책 ID (PK)
            type: DataTypes.STRING(32),
            primaryKey: true,
        },
        title: {  // 책 제목
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        author: {  // 저자
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        publisher: {  // 출판사
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        publishYear: {  // 출판 년도
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        genre: {  // 장르
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        coverImage: {  // 책 표지 URL
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        summary: {  // 책 줄거리
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tableOfContents: {  // 책 목차
            type: DataTypes.TEXT,
            allowNull: true,
        },
        bookSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currentState: {  // 현재 도서 상태 (대출 중인지 여부)
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        location: {  // 현재 도서 위치 (책장 ID)
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Shelves",
                key: "id",
            },
        },
    }, {
        timestamps: false,
        tableName: 'books',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

    return Book;
};

/*

+--------------------+------------------------------+-----------+--------------+-------------+------------------+--------------------+------------+-----------------+----------+--------------+----------+
| id                 | title                        | author    | publisher    | publishYear | genre            | coverImage         | summary    | tableOfContents | bookSize | currentState | location |
+--------------------+------------------------------+-----------+--------------+-------------+------------------+--------------------+------------+-----------------+----------+--------------+----------+
| 000000000000000001 | 자료구조                     | Author 1  | Publisher 1  |        2020 | Computer Science | cover_image_1.jpg  | Summary 1  | Contents 1      | 1    |            1 |        1 |
| 000000000000000002 | 1987                         | Author 2  | Publisher 2  |        2021 | History          | cover_image_2.jpg  | Summary 2  | Contents 2      | 1   |            1 |        1 |
| 000000000000000003 | 해저2만리                    | Author 3  | Publisher 3  |        2022 | Adventure        | cover_image_3.jpg  | Summary 3  | Contents 3      | 1    |            1 |        1 |
| 000000000000000004 | 자바의 정석                  | Author 4  | Publisher 4  |        2023 | Programming      | cover_image_4.jpg  | Summary 4  | Contents 4      | 1    |            1 |        1 |
| 000000000000000005 | 파이썬 완벽 가이드           | Author 5  | Publisher 5  |        2024 | Programming      | cover_image_5.jpg  | Summary 5  | Contents 5      | 1    |            1 |        1 |
| 000000000000000006 | 클린 코드                    | Author 6  | Publisher 6  |        2025 | Programming      | cover_image_6.jpg  | Summary 6  | Contents 6      | 1    |            1 |        1 |
| 000000000000000007 | 인간 본성의 법칙             | Author 7  | Publisher 7  |        2026 | Psychology       | cover_image_7.jpg  | Summary 7  | Contents 7      | 2   |            1 |        2 |
| 000000000000000008 | 성공하는 사람들의 7가지 습관 | Author 8  | Publisher 8  |        2027 | Self-Help        | cover_image_8.jpg  | Summary 8  | Contents 8      | 2   |            1 |        2 |
| 000000000000000009 | 돈의 심리학                  | Author 9  | Publisher 9  |        2028 | Finance          | cover_image_9.jpg  | Summary 9  | Contents 9      | 2   |            1 |        2 |
| 000000000000000010 | 생각의 기술                  | Author 10 | Publisher 10 |        2029 | Business         | cover_image_10.jpg | Summary 10 | Contents 10     | 2   |            1 |       2 |
| 000000000000000011 | 종의 기원                    | Author 11 | Publisher 11 |        2030 | Science          | cover_image_11.jpg | Summary 11 | Contents 11     | 3    |            1 |       3 |
| 000000000000000012 | 해리포터                     | Author 12 | Publisher 12 |        2031 | Fantasy          | cover_image_12.jpg | Summary 12 | Contents 12     | 3    |            1 |       3 |
| 000000000000000030 | 자료구조                     | Author 1  | Publisher 1  |        2020 | Computer Science | cover_image_1.jpg  | Summary 1  | Contents 1      | 1    |            0 |         |
| 000000000000000040 | 자료구조                     | Author 1  | Publisher 1  |        2020 | Computer Science | cover_image_1.jpg  | Summary 1  | Contents 1      | 1    |            0 |         |
+--------------------+------------------------------+-----------+--------------+-------------+------------------+--------------------+------------+-----------------+----------+--------------+----------+



+----+---------+-----+--------+--------+------+
| id | shelfId | row | column | bookId | size |
+----+---------+-----+--------+--------+------+
|  1 |       1 |   1 |      1 | NULL   |    1 |
|  2 |       1 |   1 |      2 | NULL   |    1 |
|  3 |       1 |   1 |      3 | NULL   |    1 |
|  4 |       1 |   2 |      1 | NULL   |    1 |
|  5 |       1 |   2 |      2 | NULL   |    1 |
|  6 |       1 |   2 |      3 | NULL   |    1 |
|  7 |       1 |   3 |      1 | NULL   |    2 |
|  8 |       1 |   3 |      2 | NULL   |    2 |
|  9 |       1 |   3 |      3 | NULL   |    2 |
| 10 |       1 |   4 |      1 | NULL   |    2 |
| 11 |       1 |   4 |      2 | NULL   |    3 |
| 12 |       1 |   4 |      3 | NULL   |    3 |
+----+---------+-----+--------+--------+------+



*/

