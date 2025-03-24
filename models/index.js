const Sequelize = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

// DB 객체 생성
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const Shelf = require('./shelf')(sequelize, Sequelize.DataTypes);
const Book = require('./book')(sequelize, Sequelize.DataTypes);

db.Shelf = Shelf;
db.Book = Book;

// 관계 설정
db.Shelf.hasMany(Book, { foreignKey: "location", as: "books" });  // 책장이 여러 책을 가질 수 있음
db.Book.belongsTo(Shelf, { foreignKey: "location", as: "shelf" });  // 책이 한 책장에 속함

module.exports = db;