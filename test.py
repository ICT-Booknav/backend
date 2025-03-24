import sys
import json

def main():
    # 입력 데이터 수신
    input_data = sys.argv[1]
    data = json.loads(input_data)

    # 수신 데이터 출력
    #print("Received data:", data)
    #print("Data received successfully")

    # 더미 데이터 생성
    response_data = {
        "answer": ["테스트 텍스트 전송"],
        "recommend": ["자료구조", "머신러닝", "알고리즘"]
    }
    sys.stdout.reconfigure(encoding='utf-8')
    # 더미 데이터 반환
    sys.stdout.buffer.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

if __name__ == "__main__":
    main()