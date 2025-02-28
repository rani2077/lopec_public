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

// 랭킹 정보 읽기 (타입별)
export function getLopecCharacterRanking(type, startRank = 1, limit = 100) {
    var atMode = "selectRanking";
    var requestData = {
        atMode: atMode,
        rankingType: type,
        page: startRank,
        limit: limit
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("전체 랭킹 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("LOPEC_CHARACTER_BEST_RANKING 조회 실패");
            //console.log("request.status : " + request.status);
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
        nicknames: JSON.stringify(nicknames), // 배열을 JSON 문자열로 변환
        rankingType: rankingType
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/", // 기존 URL 유지
        data: requestData,
        success: function(response) {
            console.log(`${nicknames.length}개 캐릭터 일괄 데이터 조회 성공`);
            return response;
        },
        error: function(request, status, error) {
            console.log("캐릭터 일괄 데이터 조회 실패");
            console.log("request.status : " + request.status);
            console.log("오류 상세: " + error);
            return Promise.reject(error);
        }
    });
} 