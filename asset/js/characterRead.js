// 특정 캐릭터의 최고 점수 정보 읽기
export function getLopecCharacterBest(characterNickname) {
    var atMode = "selectCharacterBest";
    var requestData = {
        atMode: atMode,
        lchaCharacterNickname: characterNickname
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log("LOPEC_CHARACTER_BEST 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("LOPEC_CHARACTER_BEST 조회 실패");
            console.log("request.status : " + request.status);
            console.log("request.responseText : " + request.responseText);
        }
    });
}

// 랭킹 정보 읽기 (타입별)
export function getLopecCharacterRanking(type, page, limit) {
    var atMode = "selectRanking";
    var requestData = {
        atMode: atMode,
        rankingType: type, // "DEAL" 또는 "SUP" 값을 전달
        page: page || 1,
        limit: limit || 100
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log("LOPEC_CHARACTER_BEST_RANKING 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("LOPEC_CHARACTER_BEST_RANKING 조회 실패");
            console.log("request.status : " + request.status);
        }
    });
}