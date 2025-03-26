const { raw } = require("mysql2");
const { Book, Shelf } = require("../models");
const { Op, where, Sequelize } = require("sequelize");
const sequelize = require("../models");

// 책의 크기와 상태에 따라 책의 개수를 세는 함수
async function getBookCount(bookSize, currentState) {
    const whereClause = {};
    if (bookSize !== undefined) {
        whereClause.bookSize = bookSize;
    }
    if (currentState !== undefined) {
        whereClause.currentState =  currentState;
    }
    return await Book.count({ where: whereClause, raw: true });
}

// 모든 책 조회 (검색 기능) -> title, genre, description으로 검색 가능
exports.getAllBooks = async (req, res) => {
    try {
        let { query = [], answer="" } = req.query; // 검색어 처리
        const whereClause = {};
        if(typeof query === "string"){
            query = query.split(',');
        }
        console.log("query: ", query);

        // 검색어가 존재하는 경우 조건 추가
        if (query.length > 0) {
            whereClause[Op.or] = query.flatMap(q => [
                { title: { [Op.like]: `%${q}%` } },
                { genre: { [Op.like]: `%${q}%` } },
                { publishYear: { [Op.like]: `%${q}%` } },
                { publisher: { [Op.like]: `%${q}%` } },
            ]);
        }
        console.log("whereClause: ", whereClause); 
        // 책 정보를 조회
        const books = await Book.findAll({
            where: whereClause,
            attributes: ['id', 'title', 'genre', 'publishYear', 'publisher','currentState', 'author', 'bookSize', 'coverimage'], // id 포함
            raw: true
        });

        if (!books.length) {
            return res.status(404).json({ message: "검색 조건에 맞는 책이 없습니다." });
        }
        // title 기준으로 그룹화 및 location 추가
        const bookMap = new Map();

        for (const book of books) {
            if (!bookMap.has(book.title)) {
                bookMap.set(book.title, { 
                    title: book.title, 
                    genre: book.genre, 
                    publishYear: book.publishYear, 
                    publisher: book.publisher, 
                    location: [] ,  // 배열로 초기화 필요
                    currentState: book.currentState,
                    bookSize: book.bookSize,
                    author: book.author,
                    ocoverImage: `/img/${book.coverImage}`,
                });                
            }
            // 위치 정보 가져오기
            const shelves = await Shelf.findAll({
                where: { bookId: book.id },
                attributes: ['column'],
                raw: true
            });

            const bookData = bookMap.get(book.title);
            if (bookData && Array.isArray(bookData.location)) {
                bookData.location.push(...shelves.map(shelf => shelf.column));
            } else {
                console.error(`Invalid bookData or locations for book title: ${book.title}`);
            }

        }

        // Map을 배열로 변환
        const result = Array.from(bookMap.values());
        if(answer){
            result.push({answer: answer});
        }
        console.log("getAllBooks: ", result);
        res.json(result);
    } catch (err) {
        console.error("Error fetching books:", err); // 에러 로그 추가
        res.status(500).json({ error: "서버 오류" });
    }
};

/*
exports.getAllBooks = async (req, res) => {
    try {
        const { query = "" } = req.query; // 검색어만 처리
        const whereClause = {};
    
        // 검색어가 존재하는 경우 조건 추가
        if (query) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { genre: { [Op.like]: `%${query}%` } },
                { publishYear: { [Op.like]: `%${query}%` } },
                { publisher: { [Op.like]: `%${query}%` } },
            ];
        }
    
        const books = await Book.findAll({ 
            where: whereClause,
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('title')), 'title'], // Sequelize 사용
                'genre',
                'publishYear',
                'publisher'
            ],
            group: ['title', 'genre', 'publishYear', 'publisher'],
            raw: true
        });

        if (!books.length) {
            return res.status(404).json({ message: "검색 조건에 맞는 책이 없습니다." });
        }

        // 각 책의 위치 정보를 가져와 추가
        const booksWithLocation = await Promise.all(books.map(async (book) => {
            const shelves = await Shelf.findAll({
                where: { bookId: book.id },
                attributes: ['column'],
                raw: true
            });
            book.location = shelves.map(shelf => shelf.column);
            return book;
        }));

        console.log("getAllBooks: ", booksWithLocation);
        res.json(booksWithLocation);
    } catch (err) {
        console.error("Error fetching books:", err); // 에러 로그 추가
        res.status(500).json({ error: "서버 오류" });
    }
};*/
// 특정 책 조회
exports.getBookById = async (req, res) => {
    try {
        const { title, category, author, publisher, publishYear } = req.query;
        const whereClause = {};

        if (title) {
            whereClause.title = { [Op.like]: `%${title}%` }; // 부분 검색 가능
        }
        if (category) {
            whereClause.genre = category;
        }
        if (author) {
            whereClause.author = { [Op.like]: `%${author}%` };
        }
        if (publisher) {
            whereClause.publisher = { [Op.like]: `%${publisher}%` };
        }
        if (publishYear) {
            whereClause.publishYear = publishYear;
        }

        const books = await Book.findOne({ 
            where: whereClause,
            raw: true,
        });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: "서버 오류" });
    }
};

exports.getBookDetail = async (req, res) => {
    try{
        const books = await Book.findAll({
            where: {title: req.params.title},
            raw: true,
        });
        if(!books.length){
            return res.status(404).json({error: "책을 찾을 수 없음"});
        }
        const book = books[0];
        const shelvesLocation = await Promise.all(
            books.map(async (book) => {
                const shelf = await Shelf.findOne({
                    where: { bookId: book.id },
                    attributes: ["column"],
                    raw: true,
                });
                return shelf ? shelf.column : null;
            })
        );
        console.log("shelvesLocation: ",shelvesLocation);

        book.location = shelvesLocation;
        book.currentState = true;
        console.log("getBookDetail: ", book);
        res.json(book);
    }
    catch{
        res.status(500).json({ error: "서버 오류" });
    }
}

// 관리자 접속 시 모든 책 데이터 전송
exports.getAdminBook = async (req, res) => {
    try {
        const smallBookCount = await getBookCount(1, true);
        const mediumBookCount = await getBookCount(2, true);
        const bigBookCount = await getBookCount(3, true);
        const totalBooksCount = await getBookCount();
        const currentBooksCount = await getBookCount(undefined, true);
        const shelf = await Shelf.findAll({
            where: {
                bookId: { [Op.not]: null }
            },
            raw: true
        });

        const result = {
            smallBookCount,
            mediumBookCount,
            bigBookCount,
            totalBooksCount,
            currentBooksCount,
            shelf,
        };

        res.json(result);
    } catch (err) {
        console.error("cannot fetching shelf info", err);
        res.status(500).json({ error: "서버 오류" });
    }
};



// 책 추가 (admin only)
exports.createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: "서버 오류" });
    }
};

// 책 정보 수정 (admin only)
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "책을 찾을 수 없음" });

        await book.update(req.body);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: "서버 오류" });
    }
};

// 책 삭제 (admin only)
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: "책을 찾을 수 없음" });

        await book.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "서버 오류" });
    }
};

/*
// 책 상세 정보 조회
exports.getBookDetail = async (req, res) => {
    try {
        const book = await Book.findOne({ 
            where: { title: req.params.title}
            , raw: true, 
        });
        if (!book) {
            return res.status(404).json({ error: "책을 찾을 수 없음" });
        }
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류" });
    }
};

// 책 위치 데이터 전송
exports.getBookLocation = async (req,res) => {
    try{
        const books = await Book.findAll({
            where: {
                title: req.params.title,
                currentState: true,
            },
            raw: true,
        });
        if(books.length === 0){
            return res.status(404).json({error: "책을 찾을 수 없음"});
        }

        const shelfLocations = await Promise.all(books.map(async (book) => {
            const shelves = await Shelf.findAll({
                where: { bookId: book.id }
            });

            if (shelves.length === 0) {
                return { error: "현재 없는 책입니다." };
            }

            return shelves.map(Shelf => ({
                shelfId: shelves.shelfId,
                row: shelves.row,
                column: shelves.column,
                location: !!shelves.location
            }));
        }));

        res.json(shelfLocations.flat());
    }catch(err){
        res.status(500).json({error: "서버 오류"});
    }
}
*/