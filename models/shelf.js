/**
 * @swagger
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 책장 ID (책장 분류)
 *           example: 1
 *         shelfId:
 *           type: integer
 *           description: 책장 ID (책장컨 분류) -> PK
 *           example: 1
 *         row:
 *           type: integer
 *           description: 책장 내 몇 번째 줄인지 (row)
 *           example: 1
 *         column:
 *           type: integer
 *           description: 책장 내 몇 번째 칸인지 (col)
 *           example: 1
 *         bookId:
 *           type: string
 *           description: 현재 책장에 꽂혀 있는 책
 *           example: '12345678901234567890123456789012'
 *         size:
 *           type: integer
 *           description: 책장 크기 (1~3)
 *           example: 3
 */

module.exports = (sequelize, DataTypes) => {
    const Shelf = sequelize.define("Shelf", {
        id: {  // 책장 ID (PK)
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        shelfId: {  // 특정 책장의 ID (책장이 여러 개 있을 경우 구분)
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        row: {  // 책장 내 몇 번째 줄인지
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        column: {  // 책장 내 몇 번째 칸인지
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookId: {  // 현재 책장에 꽂혀 있는 책 (FK)
            type: DataTypes.STRING(32),
            allowNull: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
        tableName: 'shelves',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

    return Shelf;
};

/*
+----+---------+-----+--------+--------------------+------+
| id | shelfId | row | column | bookId             | size |
+----+---------+-----+--------+--------------------+------+
|  1 |       1 |   1 |      1 | 000000000000000001 |    1 |
|  2 |       1 |   1 |      2 | 000000000000000002 |    1 |
|  3 |       1 |   1 |      3 | 000000000000000003 |    1 |
|  4 |       1 |   2 |      1 | 000000000000000004 |    1 |
|  5 |       1 |   2 |      2 | 000000000000000005 |    1 |
|  6 |       1 |   2 |      3 | 000000000000000006 |    1 |
|  7 |       1 |   3 |      1 | 000000000000000007 |    2 |
|  8 |       1 |   3 |      2 | 000000000000000008 |    2 |
|  9 |       1 |   3 |      3 | 000000000000000009 |    2 |
| 10 |       1 |   4 |      1 | 000000000000000010 |    2 |
| 11 |       1 |   4 |      2 | 000000000000000011 |    3 |
| 12 |       1 |   4 |      3 | 000000000000000012 |    3 |
+----+---------+-----+--------+--------------------+------+
*/