const { format } = require('date-fns');
const moment = require('moment-timezone');
const Promise = require("../models/promise");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const ChatRoom = require("../models/chatRoom");
const Matching = require("../models/matching");
const Message = require('../models/message');

let io; // io 객체를 모듈 스코프에 정의

exports.init = function (socketIo) {
    io = socketIo;
    console.log('IO 객체 초기화:', io); // IO 객체가 제대로 초기화되었는지 확인
};

exports.savePromise = async (req, res) => {
    try {
        console.log('컨트롤러 IO 객체:', io); // io 객체가 제대로 불러와졌는지 확인
        const user = req.session.userID;
        const roomNum = req.params.roomNum;
        const { promiseDay, startTime, finishTime } = req.body;

        console.log('현재 사용자', user);
        console.log('채팅방 번호', roomNum);
        console.log('약속 내용 확인. 날짜:', promiseDay, '시작 시간: ', startTime, "종료 시간: ", finishTime);

        //chatRoom 조회
        const chatRoom = await ChatRoom.findOne({ where: { roomNum } });
        let promise;
        let time;
        let sender;
        let receiver;

        if (chatRoom.stdNum==user) {
            receiver = chatRoom.protectorNum;

            promise = await Promise.create({
                stdNum: user,
                protectorNum: receiver,
                roomNum: roomNum,
                promiseDay: promiseDay,
                startTime: startTime,
                finishTime: finishTime,
                promiseSender: user
            });
            
            console.log('약속 저장 성공', promise);

            time = moment().tz("Asia/Seoul").format("A h:mm").replace('AM', '오전').replace('PM', '오후');
            sender = promise.promiseSender;
        } else if (chatRoom.protectorNum == user) {
            receiver = chatRoom.stdNum;

            promise = await Promise.create({
                stdNum: receiver,
                protectorNum: user,
                roomNum: roomNum,
                promiseDay: promiseDay,
                startTime: startTime,
                finishTime: finishTime,
                promiseSender: user
            });

            console.log('약속 저장 성공', promise);

            time = moment().tz("Asia/Seoul").format("A h:mm").replace('AM', '오전').replace('PM', '오후');
            sender = promise.promiseSender;
        }

        const matching = await Matching.create ({
            promiseNum: promise.promiseNum,
            reportNum: null,
            depositStatus: false,
            reportStatus: false
        });

        console.log("매칭 저장 성공", matching);

        const formattedPromiseDay = moment(promise.promiseDay).tz("Asia/Seoul").format("YYYY년 MM월 DD일");
        const formattedStartTime = moment(promise.startTime, "HH:mm").format("A h시 mm분").replace('AM', '오전').replace('PM', '오후');
        const formattedFinishTime = moment(promise.finishTime, "HH:mm").format("A h시 mm분").replace('AM', '오전').replace('PM', '오후');

        console.log("senderNum 확인", promise.promiseSender);
        console.log("receiverNum 확인", receiver);
        // Message 생성 예시
        const message= await Message.create({
            senderNum: promise.promiseSender, // 메시지 발신자
            receiverNum: receiver, // 메시지 수신자
            roomNum: roomNum,
            message: '약속이 성사되었습니다.', // 메시지 내용
            promiseNum: promise.promiseNum, // 생성된 약속의 promiseNum
        });
        // 채팅방 정보 업데이트
        await ChatRoom.update({
            lastMessageContent: message.message,
            lastMessageTime: message.sendDay,
            lastMessageID: message.messageID
        }, {
            where: { roomNum: roomNum }
        });
        console.log("메세지 저장 성공", message);

        // `roomNum`을 포함한 데이터 객체를 채팅방으로 전송
        io.emit("promise", {
            sender,
            time,
            roomNum, // roomNum을 데이터 객체에 포함
            promise,
            formattedPromiseDay,
            formattedStartTime,
            formattedFinishTime
        });
        res.json({ success: true, message: 'Promise saved' });  // 클라이언트로 응답을 보내기
    } catch (error) {
        console.error('Error saving promise message(약속 저장 오류):', error);
        res.status(500).json({ error: 'Failed to save promise message' });
    }
};

exports.confirmDeposit = async (req, res) => {
    try {
        console.log("입금 확인 컨트롤러 시작");
        const { roomNum, promiseNum } = req.params;

        //요청이 도착했는지 확인
        console.log(`Received request to show promise complete page for roomNum: ${roomNum}, promiseNum: ${promiseNum}`);

        const matching = await Matching.findOne({ where: { promiseNum: promiseNum } });

        if (!matching) {
            console.log(`Matching record for promise number ${promiseNum} not found.`);
            return res.status(404).json({ error: '매칭 레코드를 찾을 수 없습니다.' });
        }

        matching.depositStatus = true;
        await matching.save();

        console.log(`Deposit confirmation for promise number ${promiseNum} updated successfully.`);

        //성공적으로 업데이트되었음을 응답합니다.
        res.status(200).json({ message: '입금 확인이 정상적으로 완료되었습니다.' });
        //res.redirect('/promiseList/matchingPromiseList');
    } catch (error) {
        console.error('Error confirming deposit:', error);
        res.status(500).json({ error: '입금 확인 중 오류가 발생했습니다.' });
    }
};

exports.showProfileDepoistDetail = async (req, res) => {
    try {
        console.log("show student deposit detail...");
        const { promiseNum, stdNum } = req.params;
        const user = req.session.userID;

        console.log("promiseNum: ", promiseNum);
        //console.log("promiseSender: ", stdNum);
        console.log("user: ", user);

        const promise = await Promise.findOne({ where: { promiseNum: promiseNum } });

        if (!promise) {
            console.log(`Promise with ID ${promiseNum} not found.`);
            return res.status(404).json({ error: '약속을 찾을 수 없습니다.' });
        }

        let student;
        if (parseInt(stdNum) === promise.stdNum) {
            student = await fetchData3(promise.stdNum);

            const year = calculateKoreanAgeByYear(student.yearOfBirth);
            const interestField = await interestFieldData(student.stdNum);
            const review = await reviewData(student.stdNum);
            const encodedImageBase64String = student.profileImage ? Buffer.from(student.profileImage).toString('base64') : '';
            //const member = await fetchData(student.stdNum);
            const member = await fetchData(student.stdNum);

            return res.render('stdPromiseDepositDetail', { student, member, encodedImageBase64String, interests: interestField, review, user: user, age: year, promise });
        } else {
            console.log("Invalid userProfile.");
            return res.status(400).json({ error: '올바르지 않은 사용자 프로필입니다.' });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
}