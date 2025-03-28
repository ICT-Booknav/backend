const { Book, Shelf } = require("../models");
const axios = require("axios");

/*
    입력 예시 
    curl -X POST -H "Content-Type: application/json" -d '{"id":1,"row":1,"column":1,"book_id":"0000000000000001"}' http://192.168.137.1:3003/api/mcu/update
*/
exports.updateShelf = async (req, res) => {
    const { shelfId, row, column, bookId } = req.body;
    console.log("recived data: ", shelfId, row, column, bookId);

    try {
        // 책장 정보 조회
        const shelf = await Shelf.findOne({
            where: {
                shelfId: shelfId,
                row: row,
                column: column,
            },
        });

        if (!shelf) {
            return res.status(404).json({ message: "책장 정보를 찾을 수 없음" });
        }

        // 이전 책 정보 조회
        const prevBook = shelf.bookId
            ? await Book.findOne({ where: { id: shelf.bookId } })
            : null;
        console.log("prevBook: ", prevBook);

        // 새 책 정보 조회
        const newBook = bookId
            ? await Book.findOne({ where: { id: bookId } })
            : null;

        if (bookId && !newBook) {
            return res.status(404).json({ message: "새 책 정보를 찾을 수 없음" });
        }
        console.log("newBook: ", newBook);

        // 책장 정보 업데이트 + 이전 책 정보 삭제
        await Shelf.update({ bookId: bookId || null }, { where: { id: shelf.id } });
        await Book.update({ currentState: false, location: null }, { where: { id: shelf.bookId } });

        // 새 책 정보 업데이트
        if (bookId) {
            await Book.update(
                { currentState: true, location: shelf.column },
                { where: { id: bookId } }
            );
        }

        res.status(200).json({ message: "책장 정보 수정 완료" });
    } catch (error) {
        console.error("Error updating shelf: ", error);
        res.status(500).json({ error: "서버 오류" });
    }
};

//해당 책을 뽑기 명령 라즈베리파이에 전송 -> 책장id, row, column만 전달하면 됨.
//현재는 단일 책장이므로번호에 따라 라즈베리파이를 분할 선택하는 로직은 생략
//단일 주소를 const 변수로 담아 그대로 사용하자.

exports.selectBook = async (req, res) => {
    const title = req.params.title; // URL 파라미터 가져오기    
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
        //http://localhost:3003/api/mcu/update
        const raspiURL = "http://192.168.137.4:5000/api/mcu/selectBook";
        const response = await axios.post(raspiURL, {
            shelfId: selectShelf.shelfid,
            row: selectShelf.row,
            column: selectShelf.column,
        });
        console.log("raspberry pi response: ", response.data);
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