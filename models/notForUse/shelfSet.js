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

    set -> 책장 전체(){
        size = 1; 6칸
        size = 2; 4칸
        size = 3; 2칸
        size = ;
        size
    }

    set -> 책장 전체(){
        size = 1; 6칸
        size = 2; 4칸
        size = 3; 2칸
        size = ;
        size
    }

    set -> 책장 전체(){

    ...
    .
    .
    .
    

*/