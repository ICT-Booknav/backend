const Shelf = require("../models/shelf");
const Book = require("../models/book");
const axios = require("axios");


exports.updateShelf = async (req, res) => {
    const { id, row, column, book_present } = req.body;
    try {
        const shelf = await Shelf.findOne({
            where: {
                shelfId: id,
                row: row,
                column: column,
            },
            raw: true,
        });
        
        if (shelf) {
            await shelf.update({ bookId: book_present ? req.body.bookId : null });
            res.status(200).json({ message: "책장 정보 수정 완료" });
        } else {
            res.status(404).json({ message: "책장 정보를 찾을 수 없음" });
        }
    } catch (error) {
        res.status(500).json({ error: "서버 오류" });
    }
};


//해당 책을 뽑기 명령 라즈베리파이에 전송 -> 책장id, row, column만 전달하면 됨.
//현재는 단일 책장이므로번호에 따라 라즈베리파이를 분할 선택하는 로직은 생략
//단일 주소를 const 변수로 담아 그대로 사용하자.
exports.selectBook = async (req, res) => {
    const { title, selectedTitle } = req.params; // URL 파라미터 가져오기
    console.log("selectBook title: ", title, "selectedTitle: ", selectedTitle);
    
    if (title !== selectedTitle) {
        return res.status(400).json({ error: "요청한 제목이 일치하지 않습니다." });
    }

    try {
        // 책 정보를 가져오기
        const selectBook = await Book.findOne({
            where: { title: title }, // 올바른 WHERE 문법
            raw: true,
        });

        if (!selectBook) {
            return res.status(404).json({ error: "책을 찾을 수 없음" });
        }

        // 선반 정보를 가져오기
        const selectShelf = await Shelf.findOne({
            where: { bookId: selectBook.id },
            raw: true,
        });

        if (!selectShelf) {
            return res.status(404).json({ error: "선반 정보를 찾을 수 없음" });
        }

        // Raspberry Pi API에 요청 보내기
        const raspiURL = "http://192.168.137.4:5000/api/selectBook";
        const response = await axios.post(raspiURL, {
            shelfId: selectShelf.shelfid,
            row: selectShelf.row,
            column: selectShelf.column,
            bookId: selectShelf.bookId,
        });
        response.status =  200;
        if (response.status === 200) {
            return res.status(200).json({ message: "책 선택 완료" });
        } else {
            return res.status(500).json({ error: "Raspberry Pi 서버 오류" });
        }
    } catch (error) {
        console.error("Error selecting book: ", error);
        return res.status(500).json({ error: "서버 오류" });
    }
};