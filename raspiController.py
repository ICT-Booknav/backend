import smbus2
import requests
import time
import threading
from flask import Flask, request, jsonify

app = Flask(__name__)

# I2C 버스 번호 (라즈베리파이 모델에 따라 다를 수 있음)
I2C_BUS = 1

# 아두이노 I2C 주소 목록 및 해당 row 값
ARDUINO_ADDRESSES = {
    0x04: 1,  # 예시 주소 및 row 값
    0x05: 2,
    0x06: 3
}

# 책장 번호 (라즈베리파이마다 지정)
SHELF_ID = "0001"

# I2C 버스 초기화
bus = smbus2.SMBus(I2C_BUS)

# 아두이노로부터 데이터를 읽는 함수
def read_from_arduino(address, row):
    try:
        # 아두이노로부터 19바이트 데이터 읽기 (예시)
        data = bus.read_i2c_block_data(address, 0, 19)
        # 데이터 파싱 (예시)
        column = data[0]
        book_id_bytes = data[1:19]
        book_id = ''.join(format(byte, '02x') for byte in book_id_bytes) or None
        return {
            "id": SHELF_ID,
            "row": row,
            "column": column,
            "book_id": book_id
        }
    except Exception as e:
        print(f"Failed to read from Arduino at address {address}: {e}")
        return None

# 서버로 데이터를 전송하는 함수
def send_data_to_server(data):
    # 테스트중(로컬 서버 사용)
    # url = "http://your-server-address/api/shelves/update"
    url = "http://localhost:3003/api/mcu/update"
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Data sent successfully")
    else:
        print("Failed to send data")

# 각 아두이노로부터 데이터를 읽고 서버로 전송하는 스레드 함수
def read_and_send_data(address, row):
    while True:
        rfid_data = read_from_arduino(address, row)
        if rfid_data:
            send_data_to_server(rfid_data)
        time.sleep(5)  # 5초마다 데이터 전송

# 서버로부터 /api/selectBook 요청을 받아, 아두이노에 모터 컨트롤
@app.route('/api/selectBook', methods=['POST'])
def select_book():
    try:
        data = request.json
        row = data['row']
        column = data['column']

        # 아두이노 주소 찾기
        address = None
        for addr, r in ARDUINO_ADDRESSES.items():
            if r == row:
                address = addr
                break

        if address is None:
            return jsonify({"error": "Invalid row"}), 400

        # 아두이노에 모터 컨트롤 명령 전송 (예시)
        try:
            bus.write_i2c_block_data(address, 0, [column])
            return jsonify({"message": "모터 컨트롤 명령 전송 완료"}), 200
        except Exception as e:
            print(f"Failed to send motor control command to Arduino at address {address}: {e}")
            return jsonify({"error": "Failed to send motor control command"}), 500

    except KeyError as e:
        return jsonify({"error": f"Missing parameter: {e}"}), 400
    except Exception as e:
        print(f"Error processing /api/selectBook request: {e}")
        return jsonify({"error": "서버 오류"}), 500

# 각 아두이노에 대해 스레드를 생성하여 데이터 수집 및 전송
for address, row in ARDUINO_ADDRESSES.items():
    thread = threading.Thread(target=read_and_send_data, args=(address, row))
    thread.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)