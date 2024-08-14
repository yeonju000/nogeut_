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
    console.log("약속 받은 데이터",data);
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
    this.promise=promise;
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
                            '<button class="deposit__button">입금확인</button>' :
                            '<a a href="#2" class="account__button">계좌번호 보기</a>'
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