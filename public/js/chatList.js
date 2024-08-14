let currentRoom = '';
//let promiseNum;

const userType = document.getElementById('userType').value; // 현재 로그인한 사용자의 userType
/*
function openChatRoom(roomNum) {
    console.log("openChatRoom 실행 중, roomNum: ", roomNum);
    currentRoom = roomNum;

    // 채팅 메시지창을 보여줍니다
    const chatMessageContainer = document.getElementById('chat-message-container');
    chatMessageContainer.style.display = 'block';

    // 채팅 메시지를 가져옴
    fetch(`/chat/room/${roomNum}`)
        .then(response => response.json())
        .then(data => {
            console.log(`경로 확인 /chat/room/${roomNum}`);
            const seniorName = data.seniorName;
            console.log("채팅 데이터: ", data);

            // 채팅방 제목 업데이트
            document.getElementById('chat-room-title').innerText = seniorName;
            // 기존 메시지 지우기
            const chatList = document.getElementById('chatting-list');
            chatList.innerHTML = '';

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

                    if (message.promiseNum) {
                        const promiseNum = message.promiseNum;
                        // 약속 정보가 있는 경우
                        const formattedPromiseDay = message.promiseInfo.formattedPromiseDay;
                        const formattedStartTime = message.promiseInfo.formattedStartTime;
                        const formattedFinishTime = message.promiseInfo.formattedFinishTime;
                        const userRoleClass = userType == 'student' ? 'student' : 'protector'; // 예시로, 이 값은 실제 사용자 역할에 따라 다를 수 있음

                        const promiseFormId = `promiseDeposit_${message.promiseNum}`; // 고유한 ID 생성

                        dom = `
            <span class="${containerClass}" >
                <span class="${messageContentClass}" >
                    <div class="${userRoleClass}">
                        <div ${userRoleClass == "protector" ? 'class= "promise__comment" ' : ''}>
                            <span> 약속이 성사되었습니다.</span>
                            ${userRoleClass == "protector" ? '<span class="deposit__status"> 입금 확인 대기 </span>' : ''}
                        </div>
                        <span>${userRoleClass == "student" ? "입금이 확인되면 아래의 입금 확인 버튼을 눌러주세요!" : "학생의 계좌번호를 확인하고 입금해주세요!"}</span>
                        <br>
                        <br>
                        <div>
                            <span class="promise__info"> 날짜</span>
                            <span>${formattedPromiseDay}</span>
                        </div>
                        <div>
                            <div class="time__box">
                                <span class="promise__info">시작시간</span>
                                <span>${formattedStartTime}</span>
                                <span class="promise__info">종료시간</span>
                                <span>${formattedFinishTime}</span>
                            </div>
                        </div>
                        <br>
                    <div class="button__box">
                        ${userRoleClass == "student" ?
                            `<form id="${promiseFormId}" method="POST" onsubmit="clickDeposit(event, ${promiseNum})">
                                <button class="deposit__button" type="submit">입금확인</button>
                            </form>` :
                                `<a href="/promise/${encodeURIComponent(message.promiseNum)}/deposit/${encodeURIComponent(message.promiseInfo.stdNum)}" class="account__button">계좌번호 보기</a>`
                        }
                    </div>
                    </div>

                </span>
                <span class="${messageTimeClass}">
                    ${message.sendDay || '시간 오류'}
                </span>
            </span>`;
                    } else {
                        // 약속 정보가 없는 경우
                        dom = `
              <span class="${containerClass}">
                  <span class="${messageContentClass}">
                      ${message.message}
                  </span>
                  <span class="${messageTimeClass}">
                      ${message.sendDay || '시간 오류'}
                  </span>
              </span>`;
                    }

                    // li 요소에 HTML 삽입 및 추가
                    li.innerHTML = dom;
                    chatList.appendChild(li);
                });
            } else {
                console.error('메시지 데이터가 배열이 아닙니다:', data.messages);
            }

            // 스크롤을 최신 메시지로 이동
            const displayContainer = document.getElementById('chat-message-container');
            displayContainer.scrollTo(0, displayContainer.scrollHeight);
        })
        .catch(error => console.error('Error loading messages:', error));
}
*/
function openChatRoom(roomNum) {
    console.log("openChatRoom 실행 중, roomNum: ", roomNum);
    currentRoom = roomNum;

    // 채팅 메시지창을 보여줍니다
    const chatMessageContainer = document.getElementById('chat-message-container');
    chatMessageContainer.style.display = 'block';

    // 채팅 메시지를 가져옴
    fetch(`/chat/chatList/room/${roomNum}`)
        .then(response => response.json())
        .then(data => {
            console.log(`경로 확인 /chat/chatList/room/${roomNum}`);
            const name = data.name;
            console.log("채팅 데이터: ", data);

            // 채팅방 제목 업데이트
            document.getElementById('chat-room-title').innerText = name;
            
            //전체가 다 바뀜...
            /*
            document.querySelectorAll('.chat__other-user').forEach((element) => {
                element.innerText = name;
            });
            */ 
           
            // 기존 메시지 지우기
            const chatList = document.getElementById('chatting-list');
            chatList.innerHTML = '';

            // 가져온 메시지들을 채팅창에 추가
            if (Array.isArray(data.messages)) {
                data.messages.forEach(message => {
                    console.log("Received message:", message); // message 객체의 내용을 확인

                    const li = document.createElement('li');
                    const isSentByUser = message.senderNum == currentUser;
                    // 메시지의 클래스 설정
                    li.classList.add(isSentByUser ? 'sent' : 'received');

                    // 메시지의 컨테이너 클래스 설정
                    const containerClass = isSentByUser ? 'sent__container' : 'received__container';
                    const messageContentClass = isSentByUser ? 'sent__message__content' : 'received__message__content';
                    const messageTimeClass = isSentByUser ? 'sent__message__time' : 'received__message__time';

                    if (message.promiseNum) {
                        const promiseNum = message.promiseNum;
                        const depositStatus = message.promiseInfo.depositStatus; // 입금 상태 확인
                        // 약속 정보가 있는 경우
                        const formattedPromiseDay = message.promiseInfo.formattedPromiseDay;
                        const formattedStartTime = message.promiseInfo.formattedStartTime;
                        const formattedFinishTime = message.promiseInfo.formattedFinishTime;
                        const userRoleClass = userType === 'student' ? 'student' : 'protector';
                        console.log(`Message ${promiseNum} depositStatus:`, depositStatus); // 디버깅을 위해 depositStatus 출력
                        
                        const promiseFormId = `promiseDeposit_${message.promiseNum}`; // 고유한 ID 생성
                        dom = `
<span class="${containerClass}">
    <span class="${messageContentClass}">
        <div class="${userRoleClass}">
            <div ${userRoleClass == "protector" ? 'class= "promise__comment"' : ''}>
                <span> 약속이 성사되었습니다.</span>
                ${userRoleClass == "protector" ?
                            (depositStatus === false ? '<span class="deposit__status">입금 확인 대기 </span>' : '<span class="deposit__status"> 입금 확인 완료 </span>') : ''}
            </div>
            <span>
                ${userRoleClass == "student" ?
                                (depositStatus === false ? "입금이 확인되면 아래의 입금 확인 버튼을 눌러주세요!" : "") :
                                (depositStatus === false ? "학생의 계좌번호를 확인하고 입금해주세요!" : "")}
            </span>
            <br><br>
            <div>
                <span class="promise__info"> 날짜</span>
                <span>${formattedPromiseDay}</span>
            </div>
            <div>
                <div class="time__box">
                    <span class="promise__info">시작시간</span>
                    <span>${formattedStartTime}</span>
                    <span class="promise__info">종료시간</span>
                    <span>${formattedFinishTime}</span>
                </div>
            </div>
            <br>
            <div class="button__box">
                ${userRoleClass === "student" && depositStatus === false ?
                                `<form id="${promiseFormId}" method="POST" onsubmit="clickDeposit(event, ${promiseNum})">
                        <button class="deposit__button" type="submit">입금확인</button>
                    </form>` :
                                (userRoleClass === "protector" && depositStatus === false ?
                                    `<a href="/promise/${encodeURIComponent(message.promiseInfo.promiseNum)}/deposit/${encodeURIComponent(message.promiseInfo.stdNum)}" class="account__button">계좌번호 보기</a>` : '')
                            }
            </div>
        </div>
    </span>
    <span class="${messageTimeClass}">
        ${message.sendDay || '시간 오류'}
    </span>
</span>`;


                    } else {
                        // 약속 정보가 없는 경우
                        dom = `
                            <span class="${containerClass}">
                                <span class="${messageContentClass}">
                                    ${message.message}
                                </span>
                                <span class="${messageTimeClass}">
                                    ${message.sendDay || '시간 오류'}
                                </span>
                            </span>`;
                    }

                    // li 요소에 HTML 삽입 및 추가
                    li.innerHTML = dom;
                    chatList.appendChild(li);
                });
            } else {
                console.error('메시지 데이터가 배열이 아닙니다:', data.messages);
            }

            // 스크롤을 최신 메시지로 이동
            const displayContainer = document.getElementById('chat-message-container');
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

const socket = io();

const chatList = document.querySelector(".chatting__list"); // ul 부분
const chatInput = document.querySelector(".chatting__input"); // input
const sendButton = document.querySelector(".send__button"); // button
const displayContainer = document.querySelector(".chat__message");

const currentUser = document.getElementById('currentUser').value; // 현재 로그인한 사용자
const seniorNum = document.getElementById('seniorNum').value; // 채팅 상대방 회원번호

chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") { // keyCode는 deprecated, key를 사용하는 것이 좋습니다
        event.preventDefault(); // 엔터 키로 인해 폼 제출 등을 방지
        send();
    }
});

// 전송 버튼 클릭 시 메시지를 전송
sendButton.addEventListener("click", () => {
    send();
});

async function send() {
    const messageContent = chatInput.value.trim();

    //메시지가 비어있는지 확인
    if (!messageContent) {
        console.log("빈 메시지.");
        return; //메시지를 전송하지 않고 함수 종료
    }
    
    const time = new Date();
    const param = {
        senderNum: currentUser,  // 현재 사용자의 ID
        recipientNum: seniorNum, // 채팅 상대방의 ID
        msg: chatInput.value,
        time
    };
    socket.emit("chatting", param);

    // 메시지를 전송한 후 입력 필드 비우기
    chatInput.value = '';

    // 추가: roomNum을 URL 경로에 포함하여 메시지를 저장하는 요청 추가
    const roomNum = currentRoom;
    try {
        const response = await fetch(`/chat/chatList/room/${roomNum}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('currentRoom Message saved:', data);
        } else {
            console.error('Failed to save message');
        }
    } catch (error) {
        console.error('Error saving message with roomNum:', error);
    }
}

socket.on("chatting", (data) => {
    console.log("서버로부터 데이터 받음", data);
    console.log("chatList NULL여부 확인", chatList); // chatList가 null이 아닌지 확인
    const { msg, senderNum, time } = data;

    console.log(`Message: ${msg}, Number: ${senderNum}, Time: ${time}`); // 로그로 각 값 확인
    console.log("현재 사용자 ", currentUser)
    const item = new LiModel(msg, senderNum, time); // 인스턴스화
    item.makeLI();
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

function LiModel(msg, senderNum, time) {
    this.msg = msg;
    this.senderNum = senderNum; // 메시지 발송자의 ID
    this.time = time;

    this.makeLI = () => {
        const li = document.createElement("li");
        // 메시지 발송자가 현재 사용자와 같으면 "sent", 다르면 "received"
        const isSentByUser = currentUser === this.senderNum;

        // 메시지의 클래스 설정
        li.classList.add(isSentByUser ? "sent" : "received");

        console.log("현재 로그인한 사용자 번호", currentUser);
        console.log("보호자번호", this.senderNum);
        
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

//약속 관련

const user = document.getElementById('currentUser').value;

document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById("settings-button");
    const settingsMenu = document.getElementById("settings-menu");

    if (settingsButton && settingsMenu) {
        settingsButton.addEventListener("click", function () {
            console.log("Settings button clicked"); // 디버깅용 로그
            console.log("roomNum 확인", currentRoom);
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

    // 시작 시간과 종료 시간을 저장할 변수
    let startTimeValue = '';
    let finishTimeValue = '';

    // 시작 시간 선택 이벤트 리스너 추가
    document.getElementById('startTime').addEventListener('change', function () {
        startTimeValue = this.value; // 선택한 시작 시간을 저장
        validateTimes(); // 시간 검증 함수 호출
    });

    // 종료 시간 선택 이벤트 리스너 추가
    document.getElementById('finishTime').addEventListener('change', function () {
        finishTimeValue = this.value; // 선택한 종료 시간을 저장
        validateTimes(); // 시간 검증 함수 호출
    });

    // 시간 검증 함수
    function validateTimes() {
        if (startTimeValue && finishTimeValue) {
            const start24HourTime = convertTo24HourFormat(startTimeValue);
            const finish24HourTime = convertTo24HourFormat(finishTimeValue);

            console.log("start24HourTime", start24HourTime);
            console.log("finish24HourTime", finish24HourTime);
            // 종료 시간이 시작 시간보다 이른 경우
            if (finish24HourTime < start24HourTime) {
                showCustomAlert('종료 시간은 시작 시간보다 빠를 수 없습니다.');
                document.getElementById('finishTime').value = ''; // 종료 시간 필드를 비워서 유효하지 않은 시간을 제거
                finishTimeValue = ''; // 저장된 종료 시간도 비우기
            }
        }
    }

    // 12시간 형식의 시간을 24시간 형식으로 변환하는 함수
    function convertTo24HourFormat(time) {
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes; // 시간을 분 단위로 변환
    }
});

function handleFormSubmit(event) {
    event.preventDefault(); // 기본 폼 제출을 방지
    console.log('handleFormSubmit 실행 중 roomNum 확인', currentRoom);
    // 폼 데이터 가져오기
    const promiseDay = document.getElementById('promiseDay').value;
    const startTime = document.getElementById('startTime').value;
    const finishTime = document.getElementById('finishTime').value;
    const roomNum = currentRoom;

    const promiseForm = {
        promiseDay: promiseDay,
        startTime: startTime,
        finishTime: finishTime,
        roomNum
    };
    console.log("약속 폼 확인", promiseForm);

    const time = new Date();
    const promiseMessage = {
        sender: user,
        time,
        roomNum,
        promiseForm
    }
    socket.emit("promise", promiseMessage);
    console.log("약속 메세지 ", promiseMessage);

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


socket.on("promise", (data) => {
    console.log("약속 받은 데이터", data);
    console.log("프론트 서버응답")
    console.log(chatList); // chatList가 null이 아닌지 확인
    const { sender, time, roomNum, promise, formattedPromiseDay, formattedStartTime, formattedFinishTime } = data;

    console.log(`PromiseSender: ${sender} Time: ${time}, RoomNum: ${roomNum}, promise: ${promise}`); // 로그로 각 값 확인

    // promise 객체가 존재하는지 확인
    if (!promise) {
        console.error('Promise object is missing');
        return;
    }

    const item = new LiPromiseModel(sender, time, roomNum, promise, formattedPromiseDay, formattedStartTime, formattedFinishTime); //인스턴스화
    item.makePromiseLI();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})
console.log(socket);

function LiPromiseModel(sender, time, roomNum, promise, formattedPromiseDay, formattedStartTime, formattedFinishTime) {
    this.sender = sender,
    this.time = time;
    this.roomNum = roomNum;
    this.promise = promise;
    this.formattedPromiseDay = formattedPromiseDay;
    this.formattedStartTime = formattedStartTime;
    this.formattedFinishTime = formattedFinishTime;

    console.log(`LiPromiseModel PromiseSender: ${sender} Time: ${this.time}, RoomNum: ${this.roomNum}, promise: ${promise}`); // 로그로 각 값 확인

    this.makePromiseLI = () => {
        const li = document.createElement("li");
        console.log("this.promise.promiseSender 확인", this.promise.promiseSender);
        const isSentByUser = currentUser == this.promise.promiseSender;
        console.log("isSentByUser 확인", isSentByUser);

        // 메시지의 클래스 설정
        li.classList.add(isSentByUser ? "sent" : "received");
        console.log("현재 로그인한 사용자 번호", currentUser)
        console.log("학생번호", this.promise.stdNum);
        console.log("보호자번호", this.promise.protectorNum);

        // 사용자 역할에 따른 클래스 설정
        let userRoleClass = "";
        if (currentUser == this.promise.stdNum) {
            userRoleClass = "student";
        } else if (currentUser == this.promise.protectorNum) {
            userRoleClass = "protector";
        }

        console.log("userRoleClass 확인", userRoleClass);
        // 메시지의 컨테이너 클래스 설정
        const containerClass = isSentByUser ? "sent__container" : "received__container";
        const messageContentClass = isSentByUser ? "sent__message__content" : "received__message__content";
        const messageTimeClass = isSentByUser ? "sent__message__time" : "received__message__time";

        // DOM 문자열 생성
        const dom = `
            <span class="${containerClass}" >
                <span class="${messageContentClass}" >
                    <div class="${userRoleClass}">
                        <div ${userRoleClass == "protector" ? 'class= "promise__comment" ' : ''}>
                            <span> 약속이 성사되었습니다.</span>
                            ${userRoleClass == "protector" ? '<span class="deposit__status"> 입금 확인 대기 </span>' : ''}
                        </div>
                        <span>${userRoleClass == "student" ? "입금이 확인되면 아래의 입금 확인 버튼을 눌러주세요!" : "학생의 계좌번호를 확인하고 입금해주세요!"}</span>
                        <br>
                        <br>
                        <div>
                            <span class="promise__info"> 날짜</span>
                            <span>${formattedPromiseDay}</span>
                        </div>
                        <div>
                            <div class="time__box">
                                <span class="promise__info">시작시간</span>
                                <span>${formattedStartTime}</span>
                                <span class="promise__info">종료시간</span>
                                <span>${formattedFinishTime}</span>
                            </div>
                        </div>
                        <br>
                        <div class="button__box">
                            ${userRoleClass === "student" ?
                '<button button class="deposit__button" type = "submit" > 입금확인</button >' :
                '<a href="/promise/<%= encodeURIComponent(message.promiseInfo.promiseNum) %>/deposit/<%= encodeURIComponent(message.promiseInfo.stdNum) %>" class="account__button"" class="account__button">계좌번호 보기</a>'
            }
                        </div>
                    </div>

                </span>
                <span class="${messageTimeClass}">
                    ${this.time || '시간 오류'}
                </span>
            </span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}
/*
function clickDeposit(event, promiseNum) {
    event.preventDefault(); // 기본 폼 제출을 방지
    console.log('입금 확인 버튼 클릭', currentRoom);
    console.log("promiseNum 확인", promiseNum)
    // 추가: roomNum을 URL 경로에 포함하여 메시지를 저장하는 요청 추가
    console.log(`chatList clickDeposit 요청할 URL: /promise/${roomNum}/${promiseNum}`);


    fetch(`/promise/${roomNum}/${promiseNum}`, {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('입금 확인 중 오류 발생');
            }
            return response.json(); // JSON 응답으로 반환
        })
        .then(data => {
            console.log('입금 확인 성공:', data);
            // 서버에서 성공적인 응답을 받았을 때의 처리
            // 예를 들어, 사용자에게 성공 메시지를 보여주거나, UI를 업데이트하는 코드
        })
        .catch(error => {
            // 오류가 발생한 경우 오류 메시지를 출력합니다.
            console.error('입금 확인 오류:', error);
        });
}
*/
/*
function clickDeposit(event, promiseNum) {
    event.preventDefault(); // 기본 폼 제출을 방지
   
    console.log('입금 확인 버튼 클릭', currentRoom);
    console.log("promiseNum 확인", promiseNum);

    const roomNum = currentRoom;
    // 추가: roomNum을 URL 경로에 포함하여 메시지를 저장하는 요청 추가
    console.log(`chatList clickDeposit 요청할 URL: /promise/${roomNum}/${promiseNum}`);

    fetch(`/promise/${roomNum}/${promiseNum}`, {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('입금 확인 중 오류 발생');
            }
            return response.json(); // JSON 응답으로 반환
        })
        .then(data => {
            console.log('입금 확인 성공:', data);

            // 입금 확인이 성공했을 때 UI 업데이트
            const promiseElement = document.getElementById(`promiseDeposit_${promiseNum}`);
            if (promiseElement) {
                const depositStatusElement = promiseElement.querySelector('.deposit__status');
                if (depositStatusElement) {
                    depositStatusElement.textContent = '입금 확인 완료';
                }

                // student의 경우 입금 확인 버튼 제거
                if (userType === 'student') {
                    const depositButton = promiseElement.querySelector('.deposit__button');
                    if (depositButton) {
                        depositButton.style.display = 'none';
                    }
                }
            }
        })
        .catch(error => {
            console.error('입금 확인 오류:', error);
        });
}
*/
function clickDeposit(event, promiseNum) {
    event.preventDefault(); // 기본 폼 제출을 방지
    let roomNum;
    if (currentRoom) {
        roomNum = currentRoom;
    } else {
        roomNum = document.getElementById('roomNum').value; // 채팅방 번호
    }
    console.log('입금 확인 버튼 클릭', currentRoom);
    console.log("promiseNum 확인", promiseNum);

    // 추가: roomNum을 URL 경로에 포함하여 메시지를 저장하는 요청 추가
    console.log(`chatList clickDeposit 요청할 URL: /promise/${roomNum}/${promiseNum}`);

    fetch(`/promise/${roomNum}/${promiseNum}`, {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('입금 확인 중 오류 발생');
            }
            return response.json(); // JSON 응답으로 반환
        })
        .then(data => {
            console.log('입금 확인 성공:', data);

            // 입금 확인이 성공했을 때 UI 업데이트
            const promiseElement = document.getElementById(`promiseDeposit_${promiseNum}`);
            if (promiseElement) {
                const depositStatusElement = promiseElement.querySelector('.deposit__status');
                if (depositStatusElement) {
                    depositStatusElement.textContent = '입금 확인 완료';
                }

                // student의 경우 입금 확인 버튼 제거
                if (userType === 'student') {
                    const depositButton = promiseElement.querySelector('.deposit__button');
                    if (depositButton) {
                        depositButton.style.display = 'none';
                    }
                }

                // protector의 경우 상태를 '입금 확인 완료'로 업데이트
                if (userType === 'protector') {
                    const depositStatusElement = promiseElement.querySelector('.deposit__status');
                    if (depositStatusElement) {
                        depositStatusElement.textContent = '입금 확인 완료';
                    }
                }
            }
        })
        .catch(error => {
            console.error('입금 확인 오류:', error);
        });
}

function clickReview() {
    const roomNum = currentRoom;
    if (roomNum) {
        window.location.href = `/review/${roomNum}`;
    }
}