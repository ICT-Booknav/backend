const { Book } = require("../models");
const { Shelf } = require("../models");
const { Op } = require("sequelize");
const { execFile } = require('child_process'); // 추가
const { title } = require("process");

// LLM에게 질문하기
exports.askLLM = async (req, res, next) => {
    try {
        /*const { type="1", question} = req.body;
        for(data in req.body){
            console.log("req.body : ", JSON.stringify(req.body));
        }*/
        const type = "1";
        const question = "어드벤쳐";
        if (!question) return res.status(400).json({ error: "질문이 필요합니다." });

        // 현재 책장에 있는 책 목록
        //임의수정함
        /*const bookIds = await Shelf.findAll({ 
            where: { bookId: { [Op.ne]: null } },
            attributes: ['bookId'],
            raw:true,
        });
        const bookshelfData = bookIds.map(book => book.bookId);  */
        const bookshelfData = ["000000000000000001", "000000000000000002", "000000000000000003", "000000000000000004", "000000000000000005", "000000000000000006", "000000000000000007", "000000000000000008", "000000000000000009", "000000000000000010"];

        // LLM 호출
        const response = await queryLLM(type, question, bookshelfData);
        if(!response){ 
            return res.status(500).json({ error: "LLM 호출 중 오류가 발생했습니다." });
        }
        req.query.answer = response.answer;
        req.query.query = Object.values(response.booknames);
        //console.log("query: ", req.query.query);
        res.json({ answer: response.answer, books: Object.values(response.booknames)});  
        //next();
    } catch (err) {
        console.log("error : ",err);
        res.status(500).json({ error: "서버 오류" });
    }
};
function testLLM(type, keyword, bookshelfData){
    const parsedOutput =  {
        answer: "어드벤처를 즐기는 상황에 맞추어, '해리포터'과 '해저2만리'를 추천해드립니다. 이 두 책은 모험과 판타지 요소가 풍부하여 즐거 운 독서 경험을 선사할 것입니다. 즐거운 여정이 되시길 바랍니다!",
        booknames: { bookname1: '해리포터', bookname2: '해저2만리' }
      };
    return parsedOutput;
}

//bookshelf => title: bookshelf.title, location: bookshelf.location
function queryLLM(type, question, bookshelfData) {
    const llmScriptPath = 'D:\\CodeStudy\\2025_ICT_Contest\\bookshelfLLM\\communication.py'; // LLM 모듈 파일 경로
    const requestData = {
        type: String(type),
        question: question,
        bookshelfData: bookshelfData//.map(book => book.bookId), // bookshelf를 리스트로 변환
    };
    console.log("requestData : ", requestData);

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
                //console.log("stdout : ", stdout);
                const parsedOutput = JSON.parse(stdout.trim());
                resolve(parsedOutput);
            } catch (parseError) {
                console.error('Parsing Error:', parseError);
                console.error('Raw Output:', stdout);
                return reject(new Error('LLM 값 파싱 중 오류가 발생했습니다(Error parsing LLM script output).'));
            }
        });
    });
}
