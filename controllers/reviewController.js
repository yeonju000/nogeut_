const Member = require('../models/member');
const Promise = require('../models/promise');
const Matching = require('../models/matching');
const Review = require('../models/review');
const StudentProfile = require("../models/studentProfile");
const SeniorProfile = require("../models/seniorProfile");
const { Op } = require('sequelize');
const { format } = require('date-fns');

async function fetchData2(userID) {
    try {
        const senior = await SeniorProfile.findOne({ where: { seniorNum: userID } });
        if (senior) {
            console.log("시니어 회원");
        } else {
            console.log("시니어 회원 아닙니다.");
        }
        return senior;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData3(userID) {
    try {
        const student = await StudentProfile.findOne({ where: { stdNum: userID } });
        if (student) {
            console.log("주니어 회원");
        } else {
            console.log("주니어 회원이 아닙니다.");
        }
        return student;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData(userID) {
    try {
        const user = await Member.findOne({ where: { memberNum: userID } });
        return user;
    } /*catch (error) {
        console.error(error);
        throw error;
    }*/
    catch (error) {
        if (error.message.includes("Duplicate entry")) {
            console.log("중복오류");
            res.status(409).json({ error: '후기가 이미 존재합니다.' });
            
        } else {
            console.error('Error creating review:', error);
            console.log("그냥오류");
            res.status(500).json({ error: '후기를 작성하는 동안 오류가 발생했습니다.' });
        }
    }
}

exports.createReview = async (req, res) => {
    try {
        console.log("Review creation process started.");
    
        const userID = req.session.userID;
        const { reviewContent, rating } = req.body;
        const { roomNum, promiseNum } = req.params;
        const score = parseInt(rating, 10);

        console.log("userId: ", userID)
        console.log("Request body: ", req.body);
        console.log("req.params: ", req.params)
        const user = await fetchData(userID);

        if (!user) {
            return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        console.log("find promise...");

        //약속 정보 조회
        const promise = await Promise.findOne({ where: { promiseNum: parseInt(promiseNum) } });

        if (!promise) {
            return res.status(400).json({ error: '약속을 찾을 수 없습니다.' });
        }

        // 약속 정보를 기반으로 매칭 정보를 조회합니다.
        const matching = await Matching.findOne({ where: { promiseNum: promise.promiseNum } });

        if (!matching) {
            return res.status(400).json({ error: '해당 약속에 대한 매칭을 찾을 수 없습니다.' });
        }


        console.log("매칭 조회 완료");

        //sender, receiver 구분하기
        let reviewSender, reviewReceiver;
        if (userID === promise.stdNum) {
            reviewSender = promise.stdNum;
            reviewReceiver = promise.protectorNum;
        } else if (userID === promise.protectorNum) {
            reviewSender = promise.protectorNum;
            reviewReceiver = promise.stdNum;
        } else {
            console.log("Invalid userProfile.");
            return res.status(400).json({ error: '올바르지 않은 사용자 프로필입니다.' });
        }


        console.log("reviewSender: ", reviewSender);
        console.log("reviewReceiver: ", reviewReceiver);

        //사용자가 이전에 후기를 작성한 적 있는지 검사
        const existingReview = await Review.findOne({
            where: {
                matchingNum: matching.matchingNum,
                reviewSender: reviewSender,
                reviewReceiver: reviewReceiver
            }
        });
        //후기가 이미 존재할 경우
        if (existingReview) {
            return res.status(409).json({ error: '후기가 이미 존재합니다.' });
        }

        // 후기가 존재하지 않을 경우 후기를 작성
        const review = await Review.create({
            matchingNum: matching.matchingNum,
            reviewSender: reviewSender, 
            reviewReceiver: reviewReceiver, 
            reviewContent: reviewContent,
            score: score
        });

        if (reviewReceiver == promise.stdNum) {
            const student = await fetchData3(promise.stdNum);
            //학생 프로필 업데이트
            if (student) {
                student.scoreCount += 1;
                student.scoreTotal += score;
                student.score = student.scoreTotal / student.scoreCount;
                await student.save();
            } else {
                console.log("Student profile not found for user: ", promise.stdNum);
                return res.status(400).json({ error: '학생 프로필을 찾을 수 없습니다.' });
            }
        } else if (reviewReceiver == promise.protectorNum) {
            const senior = await fetchData2(promise.protectorNum);
            //노인 프로필 업데이트
            if (senior) {
                senior.scoreCount += 1;
                senior.scoreTotal += score;
                senior.score = senior.scoreTotal / senior.scoreCount;
                await senior.save();
            } else {
                console.log("Senior profile not found for user: ", promise.protectorNum);
                return res.status(400).json({ error: '노인 프로필을 찾을 수 없습니다.' });
            }
        }

        console.log("Review created:", review);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: '후기를 작성하는 동안 오류가 발생했습니다.' });
    }
};

//리뷰 작성 페이지 렌더링 함수
exports.renderReviewPage = async (req, res) => {
    console.log("Review render process started.");
    //const { matchingNum, userProfile } = req.params; 
    //const { promiseNum, matchingNum } = req.params; //URL에서 matchingNum 가져오기
    const user = req.session.userID; //세션에서 userProfile 가져오기
    const { roomNum, promiseNum } = req.params;
    const stickerValues = [1, 2, 3, 4, 5];
    const reviewContent = ""; //초기화할 값 또는 데이터베이스에서 가져온 값
    const score = 0; //초기화할 값 또는 데이터베이스에서 가져온 값

    const matching = await Matching.findOne({ where: { promiseNum: promiseNum } });

    if (!matching) {
        console.log(`Matching record for promise number ${promiseNum} not found.`);
        return res.status(404).json({ error: '매칭 레코드를 찾을 수 없습니다.' });
    }
    
    res.render("review", {
        stickerValues: stickerValues,
        reviewContent: reviewContent,
        score: score,
        formAction: `/review/<%=roomNum%>/<%=promiseNum%>`,
        matchingNum: matching.matchingNum, // matchingNum 전달
        promiseNum: promiseNum,
        user: user,
        roomNum: roomNum
    });
};

// 보고서 목록 조회
exports.reviewList = async (req, res) => {
    try {
        const userID = req.session.userID;

        if (!userID) {
            return res.status(401).json({ error: '사용자가 로그인하지 않았습니다.' });
        }

        const roomNum = req.params.roomNum; // URL에서 roomNum을 가져옴
        // 채팅방 번호로 모든 약속 조회
        const promises = await Promise.findAll({
            where: { roomNum: roomNum }  // roomNum을 기준으로 약속을 조회
        });

        if (promises.length === 0) {
            return res.status(404).json({ error: '해당 채팅방에 연결된 약속이 없습니다.' });
        }

        //매칭이 없는 약속 필터링 및 학생과 노인 정보 추가
        const promiseList = [];

        for (const promise of promises) {
            const student = await StudentProfile.findOne({ where: { stdNum: promise.stdNum } });
            const senior = await SeniorProfile.findOne({ where: { seniorNum: promise.protectorNum } });

                //npm install date-fns
                // 날짜 형식을 'yyyy.MM.dd (E)' 형식으로 변환
            const formattedDate = format(new Date(promise.promiseDay), 'yyyy.MM.dd (E)');

            promiseList.push({
                promiseNum: promise.promiseNum,
                date: formattedDate,
                startTime: promise.startTime,
                finishTime: promise.finishTime
            });
            
        }

        res.render('reviewList', { promises: promiseList, roomNum });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
