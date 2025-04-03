// characterRead.js - 캐릭터 데이터 조회 모듈
// ES Module 형식으로 작성됨

// 캐릭터 종합 데이터 조회 (단일 요청으로 필요한 모든 데이터 가져오기)
export function getCombinedCharacterData(characterNickname, rankingType = "DEAL") {
    var atMode = "selectCombinedCharacterData";
    var requestData = {
        atMode: atMode,
        lchaCharacterNickname: characterNickname,
        rankingType: rankingType
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log("캐릭터 종합 데이터 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("캐릭터 종합 데이터 조회 실패");
            console.log("request.status : " + request.status);
            console.log("오류 상세: " + error);
        }
    });
}

// 랭킹 정보 읽기 (DEAL과 SUP 데이터 모두 반환)
export function getLopecCharacterRanking(type = "DEAL", startRank = 1, limit = 100) {
    var atMode = "selectRanking";
    var requestData = {
        atMode: atMode,
        rankingType: type,  // 호환성을 위해 파라미터 유지 (서버에서는 무시됨)
        page: startRank,
        limit: limit
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("DEAL/SUP 랭킹 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("랭킹 조회 실패");
            console.log("오류 상세: " + error);
        }
    });
}

// 다수 캐릭터 데이터 일괄 조회
export function getBatchCharacterData(nicknames, rankingType = "DEAL") {
    // 닉네임 배열 검증
    if (!Array.isArray(nicknames) || nicknames.length === 0) {
        console.error("유효한 닉네임 배열이 필요합니다");
        return Promise.reject("유효한 닉네임 배열이 필요합니다");
    }
    
    const atMode = "batchQueryCharacters";
    const requestData = {
        atMode: atMode,
        nicknames: nicknames.join(','), // 쉼표로 구분된 문자열로 변환
        rankingType: rankingType
    };
    
    // jQuery를 쓰지만 자체 Promise로 감싸서 반환값 제어
    return new Promise((resolve, reject) => {
        $.ajax({ 
            dataType: "text", // 서버에서 텍스트 형식으로 받음
            type: "POST",
            url: "../applications/process/lopecCharacterBest/",
            data: requestData,
            success: function(responseText) {
                console.log(`${nicknames.length}개 캐릭터 정보 요청 성공, 응답 길이:`, responseText.length);
                
                try {
                    // JSON 부분 추출 (PHP 오류 메시지가 포함될 수 있으므로)
                    const jsonMatch = responseText.match(/\{.*\}/s);
                    if (!jsonMatch) {
                        console.error("응답에서 JSON을 찾을 수 없음:", responseText);
                        resolve({ result: "F", data: "" }); // reject 대신 resolve로 처리
                        return;
                    }
                    
                    // JSON 파싱
                    const response = JSON.parse(jsonMatch[0]);
                    console.log("파싱된 응답:", response);
                    
                    // resolve로 결과 반환 (return 대신)
                    resolve(response);
                } catch (err) {
                    console.error("응답 파싱 오류:", err, "원본 응답:", responseText);
                    resolve({ result: "F", error: "응답 파싱 오류", data: "" });
                }
            },
            error: function(request, status, error) {
                console.log("캐릭터 일괄 데이터 조회 실패");
                console.log("request.status : " + request.status);
                console.log("오류 상세: " + error);
                reject(error);
            }
        });
    });
}

// 캐릭터 최고 점수 이력 조회
export function getCharacterHistory(characterNickname, options = {}) {
    const {
        historyType = "",       // DEAL, SUP, KARMA 또는 빈 문자열(전체)
        startDate = "",         // YYYYMMDDhhmmss 형식
        endDate = "",           // YYYYMMDDhhmmss 형식
        page = 1,               // 페이지 번호
        limit = 20              // 페이지당 항목 수
    } = options;
    
    const atMode = "selectCharacterHistory";
    const requestData = {
        atMode: atMode,
        lchaCharacterNickname: characterNickname,
        historyType: historyType,
        startDate: startDate,
        endDate: endDate,
        page: page,
        limit: limit
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log("캐릭터 이력 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("캐릭터 이력 조회 실패");
            console.log("request.status : " + request.status);
            console.log("오류 상세: " + error);
        }
    });
}