const { Book } = require("../models");
const { Shelf } = require("../models");
const { Op } = require("sequelize");
const { execFile } = require('child_process'); // 추가
const { title } = require("process");

// LLM 모델과 통신하는 함수 (가정)
//ver1 , LLM http 호출
/*
async function queryLLM(question, books, id) {
    //  LLM 호출 (현재는 더미 응답)
    const llmApiAdress= "http://test.llm.api/query";
    const requestData = {
        question: question,
        books: books.map((book => ({title: book.title, location: book.location}))),
        id: id,
    };

    try{
        const response = await axois.post(llmApiAdress, requestData,{
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data.answer
    }
    catch{
        console.error('Error querying LLM: ',error);
        throw new Error("LLM 호출 에러");
    }
}
*/
//ver2 , 동일 서버에서 LLM program 실행
async function queryLLM2(question, bookshelf, id) {
    //const llmScriptPath = 'D:\\CodeStudy\\2025_ICT_Contest\\bookshelfLLM\\main.py'; // LLM 모듈 파일 경로
    const testPath = '../test.py';

    const requestData = {
        question: question,
        books: bookshelf.map((bookshelf => ({title: bookshelf.title, location: bookshelf.location}))),
    };

    return new Promise((resolve, reject) => {
        const process = execFile('python', [llmScriptPath, JSON.stringify(requestData)], (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing LLM script:', error);
                return reject(new Error('LLM 호출 중 오류가 발생했습니다.'));
            }
            if (stderr) {
                console.error('LLM script stderr:', stderr);
                return reject(new Error('LLM 호출 중 오류가 발생했습니다.'));
            }
            resolve(stdout.trim());
        });
    });
}

// LLM에게 질문하기
exports.askLLM = async (req, res) => {
    try {
        //const {type, question} = req.body;
        const type = "1";
        const question = "IT";
        if (!question) return res.status(400).json({ error: "질문이 필요합니다." });

        // 현재 책장에 있는 책 목록
        const bookshelfData = await Shelf.findAll({ 
            where: { bookId: { [Op.ne]: null } },
            attributes: ['bookId'],
            raw:true,
        });
        console.log("bookshelfData : ",bookshelfData);
    
        // LLM 호출
        const response = await queryLLM3(type, question, bookshelfData);
        console.log("response : ",response);
        if(!response){ 
            return res.status(500).json({ error: "LLM 호출 중 오류가 발생했습니다." });
        }   
        //console.log("response : ",response.recommend);
        res.json({ answer: response.answer, recommend: llmRecommend(response.recommend)});  

    } catch (err) {
        console.log("error : ",err);
        res.status(500).json({ error: "서버 오류" });
    }
};


async function llmRecommend(recommend) {
    console.log("llmRecommend: ", recommend);
    const llmRecommendBook = await Promise.all(recommend.map(async (recommendBook) => {
        const book = await Book.findOne({
            where: { title: recommendBook },
            raw: true,
        });
        return book;
    }));
    console.log('reulst_Information : ', llmRecommendBook);
    return llmRecommendBook;
}

//bookshelf => title: bookshelf.title, location: bookshelf.location
function queryLLM3(type, question, bookshelf) {
    const llmScriptPath = 'D:\\CodeStudy\\2025_ICT_Contest\\bookshelfLLM\\communication.py'; // LLM 모듈 파일 경로
    //테스트 링크
    //const llmScriptPath = 'd:\\CodeStudy\\2025_ICT_Contest\\SmartShelf_server\\test.py'; // LLM 모듈 파일 경로
    const requestData = {
        type: type,
        question: question,
        bookshelf: bookshelf,
        //bookshelf: bookshelf.map((bookshelf => ({title: bookshelf.title, location: bookshelf.location}))),
    };
    console.log("requestData : ",requestData);

    return new Promise((resolve, reject) => {
        const process = execFile('python', [llmScriptPath, JSON.stringify(requestData)], (error, stdout, stderr) => {
            console.log("파이썬 실행");
            if (error) {
                console.error('Error executing LLM script:', error);
                return reject(new Error('LLM 호출 중 오류가 발생했습니다(Error executing LLM script)'));
            }
            if (stderr) {
                console.error('LLM script stderr:', stderr);
                return reject(new Error('LLM 호출 중 오류가 발생했습니다(LLM script stderr)'));
            }
            try {
                console.log("stdout : ",stdout);
                const parsedOutput = JSON.parse(stdout.trim());
                resolve(parsedOutput);
            } catch (parseError) {
                console.error('parseingError:', parseError);
                return reject(new Error('LLM 값 파싱 중 오류가 발생했습니다(Error parsing LLM script output).'));
            }
            resolve(stdout.trim());
        });
    });
}
