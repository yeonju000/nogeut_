let currentRoom = '';

function openChatRoom(roomNum) {
    currentRoom = roomNum;
    console.log("Switched to chat room:", currentRoom);

    // AJAX 또는 fetch를 사용하여 해당 채팅방의 메시지를 불러옵니다.
    fetch(`/chat/room/${roomNum}`)
        .then(response => response.json())
        .then(data => {
            const seniorName = data.seniorName;  // 서버에서 받은 seniorName을 사용
            console.log("Fetched seniorName:", seniorName);

            // 채팅방 제목을 seniorName으로 업데이트
            document.getElementById('chat-room-title').innerText = `${seniorName}`;

            // 기존 메시지 지우기
            document.querySelector(".chatting__list").innerHTML = '';

            // 가져온 메시지들을 채팅창에 추가
            if (Array.isArray(data.messages)) {
                data.messages.forEach(message => {
                    const li = document.createElement('li');
                    const isSentByUser = message.senderNum == currentUser;

                    // 메시지의 클래스 설정
                    li.classList.add(isSentByUser ? 'sent' : 'received');

                    // 메시지의 컨테이너 클래스 설정
                    const containerClass = isSentByUser ? 'sent__container' : 'received__container';
                    const messageContentClass = isSentByUser ? 'sent__message__content' : 'received__message__content';
                    const messageTimeClass = isSentByUser ? 'sent__message__time' : 'received__message__time';

                    // DOM 문자열 생성
                    const dom = `
            <span class="${containerClass}">
                <span class="${messageContentClass}">
                    ${message.message}
                </span>
                <span class="${messageTimeClass}">
                    ${message.sendDay}
                </span>
            </span>`;

                    // li 요소에 HTML 삽입 및 추가
                    li.innerHTML = dom;
                    chatList.appendChild(li);
                });
            } else {
                console.error('메시지 데이터가 배열이 아닙니다:', data.messages);
            }

            // 스크롤을 최신 메시지로 이동
            displayContainer.scrollTo(0, displayContainer.scrollHeight);
        })
        .catch(error => console.error('Error loading messages:', error));
}

function formatDate(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // 오늘
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        // 어제
        return '어제';
    } else {
        // 날짜만
        return date.toLocaleDateString('ko-KR');
    }
}

function sortChatRoomsByLastMessageTime() {
    const chatList = document.getElementById('chat-room-list'); // 채팅방 목록을 포함하는 <ul> 요소 선택
    const listItems = Array.from(chatList.querySelectorAll('li')); // 모든 <li> 요소를 배열로 변환

    // <li> 요소를 lastMessageTime 기준으로 오름차순으로 정렬
    listItems.sort((a, b) => {
        const timeA = new Date(a.querySelector('.chat_last__message__time').getAttribute('data-time'));
        const timeB = new Date(b.querySelector('.chat_last__message__time').getAttribute('data-time'));
        return timeB - timeA; // 내림차순
    });

    // 정렬된 <li> 요소를 <ul>에 다시 추가
    listItems.forEach(item => chatList.appendChild(item));
}

document.addEventListener('DOMContentLoaded', () => {
    // 채팅방 목록의 마지막 메시지 시간에 대한 포맷팅 적용
    document.querySelectorAll('.chat_last__message__time').forEach(el => {
        const dateStr = el.getAttribute('data-time');
        if (dateStr) {
            el.textContent = formatDate(dateStr);
        } else {
            el.textContent = 'No messages';
        }
    });

    // 채팅방 목록을 마지막 메시지 시간에 따라 정렬
    sortChatRoomsByLastMessageTime();
});

const roomNum = document.getElementById('roomNum').value; // 채팅방 번호
const user = document.getElementById('currentUser').value;

document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById("settings-button");
    const settingsMenu = document.getElementById("settings-menu");

    if (settingsButton && settingsMenu) {
        settingsButton.addEventListener("click", function () {
            console.log("Settings button clicked"); // 디버깅용 로그
            console.log("roomNum 확인", roomNum);
            if (settingsMenu.style.display === "none" || settingsMenu.style.display === "") {
                settingsMenu.style.display = "block";
            } else {
                settingsMenu.style.display = "none";
            }
        });

        document.addEventListener("click", function (event) {
            const isClickInside = settingsButton.contains(event.target);
            if (!isClickInside && settingsMenu.style.display === "block") {
                settingsMenu.style.display = "none";
            }
        });
    }
});

function showModal(modalId) {
    //document.getElementById(modalId).style.display = 'block';
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';

    // 현재 날짜와 시간을 필드에 설정
    document.getElementById('promiseDay').value = getCurrentDate();
    document.getElementById('startTime').value = getCurrentTime();
    document.getElementById('finishTime').value = getCurrentTime();
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}


// 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 현재 시간의 시간과 분을 가져오기
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Custom Alert 표시
function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').classList.remove('hidden');
}

// Custom Alert 닫기
function closeAlert() {
    document.getElementById('customAlert').classList.add('hidden');
}

// 페이지 로드 후 현재 날짜와 시간을 설정
document.addEventListener('DOMContentLoaded', function () {
    const todayDate = getCurrentDate();
    const currentTime = getCurrentTime();

    //document.getElementById('promiseDay').setAttribute('min', todayDate);
    //document.getElementById('startTime').setAttribute('min', currentTime);
    //document.getElementById('finishTime').setAttribute('min', currentTime);

    // 날짜 선택 이벤트 리스너 추가
    document.getElementById('promiseDay').addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const today = new Date(todayDate);

        if (selectedDate < today) {
            showCustomAlert('오늘 이전의 날짜를 선택할 수 없습니다.');
            this.value = ''; // 날짜 필드를 비워서 유효하지 않은 날짜를 제거
        }
    });

    // 시작 시간 선택 이벤트 리스너 추가
    document.getElementById('startTime').addEventListener('change', function () {
        const selectedTime = this.value;
        const [selectedHours, selectedMinutes] = selectedTime.split(':').map(Number);
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

        if (selectedHours < currentHours || (selectedHours === currentHours && selectedMinutes < currentMinutes)) {
            showCustomAlert('현재 시간 이전의 시간을 선택할 수 없습니다.');
            this.value = ''; // 시간 필드를 비워서 유효하지 않은 시간을 제거
        }
    });

    // 종료 시간 선택 이벤트 리스너 추가
    document.getElementById('finishTime').addEventListener('change', function () {
        const selectedTime = this.value;
        const [selectedHours, selectedMinutes] = selectedTime.split(':').map(Number);
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

        if (selectedHours < currentHours || (selectedHours === currentHours && selectedMinutes < currentMinutes)) {
            showCustomAlert('현재 시간 이전의 시간을 선택할 수 없습니다.');
            this.value = ''; // 시간 필드를 비워서 유효하지 않은 시간을 제거
        }
    });
});

function handleFormSubmit(event) {
    event.preventDefault(); // 기본 폼 제출을 방지
    console.log('handleFormSubmit 실행 중 roomNum 확인', roomNum);
    // 폼 데이터 가져오기
    const promiseDay = document.getElementById('promiseDay').value;
    const startTime = document.getElementById('startTime').value;
    const finishTime = document.getElementById('finishTime').value;

    const promiseForm = {
        promiseDay: promiseDay,
        startTime: startTime,
        finishTime: finishTime,
        roomNum
    };

    // AJAX 요청 보내기
    fetch(`/promise/${roomNum}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(promiseForm),
    })
        .then(response => {
            if (response.ok) {
                // 서버에서 성공적인 응답을 받았을 때
                return response.json(); // 또는 적절한 처리
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            // 서버에서 받은 데이터 처리
            console.log('Success:', data);
            hideModal('promise-modal'); // 모달 숨기기


        })
        .catch(error => {
            console.error('Error:', error);
        });
}



const socket = io();

const chatList = document.querySelector(".chatting__list"); /*ul 부분*/
const chatInput = document.querySelector(".chatting__input"); /*input */
const sendButton = document.querySelector(".send__button"); /*button*/
const displayContainer = document.querySelector(".chat__message");

const currentUser = document.getElementById('currentUser').value; // 현재 로그인한 사용자
const seniorNum = document.getElementById('seniorNum').value; // 채팅 상대방 회원번호

//console.log('roomNum: ',roomNum);
chatInput.addEventListener("keypress", (event) => {
    /*if (event.keyCode === 13) {
      send();
    }*/

    if (event.key === "Enter") { // keyCode는 deprecated, key를 사용하는 것이 좋습니다
        event.preventDefault(); // 엔터 키로 인해 폼 제출 등을 방지
        send();
    }
})

// 전송 버튼 클릭 시 메시지를 전송
sendButton.addEventListener("click", () => {
    send();
});

async function send() {
    const time = new Date();
    const param = {
        num: seniorNum,
        msg: chatInput.value,
        time,
        roomNum
    };
    socket.emit("chatting", param);

    // 메시지를 전송한 후 입력 필드 비우기
    chatInput.value = '';
    console.log("start saving");
    if (currentRoom) {
        // 추가: roomNum을 URL 경로에 포함하여 메시지를 저장하는 요청 추가
        const roomNum = currentRoom;
        try {
            const response = await fetch(`/chat/room/${roomNum}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(param)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('currentRoom Message saved:', data);
                // 메시지 입력창 비우기
                chatInput.value = '';
            } else {
                console.error('Failed to save message');
            }
        } catch (error) {
            console.error('Error saving message with roomNum:', error);
        }
    } else {
        // HTTP POST 요청을 통해 메시지를 데이터베이스에 저장
        try {
            const response = await fetch(`/chat/toSenior/${seniorNum}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(param)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Message saved:', data);
                // 메시지 입력창 비우기
                chatInput.value = '';
            } else {
                console.error('Failed to save message');
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    }

}

socket.on("chatting", (data) => {
    console.log(data);
    console.log("프론트 서버응답")
    console.log(chatList); // chatList가 null이 아닌지 확인
    const { msg, num, time, room } = data;

    console.log(`Message: ${msg}, Number: ${num}, Time: ${time}, RoomNum: ${roomNum}`); // 로그로 각 값 확인
    const item = new LiModel(msg, num, time, room); //인스턴스화
    item.makeLI();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})
console.log(socket);

function LiModel(msg, num, time, room) {
    this.msg = msg;
    this.num = num;
    this.time = time;
    this.room = room;

    console.log(`LiModel  Message: ${this.msg}, Number: ${this.num}, Time: ${this.time}, RoomNum: ${this.room}`); // 로그로 각 값 확인

    this.makeLI = () => {
        const li = document.createElement("li");
        const isSentByUser = currentUser;

        // 메시지의 클래스 설정
        li.classList.add(isSentByUser ? "sent" : "received");

        // 메시지의 컨테이너 클래스 설정
        const containerClass = isSentByUser ? "sent__container" : "received__container";
        const messageContentClass = isSentByUser ? "sent__message__content" : "received__message__content";
        const messageTimeClass = isSentByUser ? "sent__message__time" : "received__message__time";

        // DOM 문자열 생성
        const dom = `
            <span class="${containerClass}" >
                <span class="${messageContentClass}" >
                    ${this.msg}
                </span>
                <span class="${messageTimeClass}">
                    ${this.time || '시간 오류'}
                </span>
            </span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);


    }
}