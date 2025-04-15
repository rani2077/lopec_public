/* **********************************************************************************************************************
* name		             :	 lostarkApiCall
* version                :   2.0
* description            :   검색한 유저의 json정보를 반환
* USE_TN                 :   사용
*********************************************************************************************************************** */
export async function lostarkApiCall(inputName) {
    const MAIN_CACHE_KEY = 'lostarkApiData'; // 단일 키 사용
    const MAX_CACHE_ENTRIES = 7; // 최대 저장 개수
    const oneMinute = 60 * 1000 * 2; // 1분 (밀리초)
    const now = Date.now();

    // 1. 메인 캐시 객체 가져오기
    let allCachedData = {};
    const rawCachedData = sessionStorage.getItem(MAIN_CACHE_KEY);
    if (rawCachedData) {
        try {
            allCachedData = JSON.parse(rawCachedData);
            // Ensure it's an object
            if (typeof allCachedData !== 'object' || allCachedData === null) {
                allCachedData = {};
            }
        } catch (e) {
            console.error("Error parsing cached data, resetting cache.", e);
            allCachedData = {}; // 파싱 오류 시 초기화
        }
    }

    // 2. 특정 inputName에 대한 캐시 확인 및 유효성 검사
    if (allCachedData[inputName]) {
        const { data, timestamp } = allCachedData[inputName];
        if (now - timestamp < oneMinute) {
            // alert("캐싱데이터 반환 (개별)");
            return data; // 캐시 유효하면 반환
        } else {
            // alert("캐싱데이터 만료 (개별)");
            delete allCachedData[inputName]; // 만료된 특정 캐릭터 데이터만 삭제
            // 전체 캐시를 다시 저장해야 하므로 여기서 바로 저장하지 않음
        }
    }

    // alert("api 호출");
    // 3. 캐시 없거나 만료 시 API 호출
    // let apiKey = localApiKey;
    let apiKey;
    try { // Cloudflare 호출 에러 핸들링 추가
        let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
        if (cloudflareResponse.ok) { // .ok 로 상태 확인, 호스트 체크 추가
            const responseData = await cloudflareResponse.json();
            apiKey = responseData.apiKey;
        } else if (!cloudflareResponse.ok && cloudflareResponse.status !== 403) {
            // 403 외의 에러 로깅
            console.warn(`Cloudflare worker fetch failed with status: ${cloudflareResponse.status}`);
        }
    } catch (error) {
        console.error("Error fetching API key from Cloudflare worker:", error);
        // apiKey는 localApiKey로 계속 진행
    }
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            // 'Content-Type': 'application/json', // GET 요청에는 보통 Content-Type 불필요
            'Authorization': `bearer ${apiKey}`,
        },
    };

    let data;
    try { // Lost Ark API 호출 에러 핸들링 추가
        const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inputName}`, options);
        const rateLimitHeaders = [
            response.headers.get('X-RateLimit-Limit'),
            response.headers.get('X-RateLimit-Remaining'),
            response.headers.get('X-RateLimit-Reset'),
        ]
        // console.log(rateLimitHeaders);
        if (!response.ok) {
            // API 호출 실패 시 에러 처리
            console.error(`Lost Ark API call failed for ${inputName} with status: ${response.status}`);
            // 실패 시 null 또는 적절한 에러 객체를 반환하거나 throw 할 수 있습니다.
            // 여기서는 null을 반환하여 호출 측에서 처리하도록 합니다.
            return null;
        }
        data = await response.json();

        // 4. 새 데이터 캐시에 추가 및 관리
        allCachedData[inputName] = { data, timestamp: now };

        // 5. 캐시 크기 제한 (FIFO)
        const keys = Object.keys(allCachedData);
        if (keys.length > MAX_CACHE_ENTRIES) {
            // alert(`캐시 초과: ${keys[0]} 삭제`);
            delete allCachedData[keys[0]]; // 가장 오래된 항목 (배열의 첫 번째 키) 삭제
        }

        // 6. 업데이트된 전체 캐시 객체를 세션 스토리지에 저장
        sessionStorage.setItem(MAIN_CACHE_KEY, JSON.stringify(allCachedData));

    } catch (error) {
        console.error(`Error during Lost Ark API call or caching for ${inputName}:`, error);
        // 네트워크 오류 등 발생 시 null 반환
        return null;
    }

    return data; // 새 데이터 반환
}

/* **********************************************************************************************************************
* name		             :	 clearLostarkApiCache
* variable
* inputName              :   유저 닉네임
* element                :   초기화 버튼 html 요소
* version                :   2.0
* description            :   element에 해당하는 요소를 클릭시 캐싱데이터가 아닌 새로 데이터를 호출
* USE_TN                 :   사용
*********************************************************************************************************************** */
/* **********************************************************************************************************************
* name		             :	 clearLostarkApiCache
* variable
* inputName              :   유저 닉네임
* element                :   초기화 버튼 html 요소
* version                :   2.0
* description            :   element에 해당하는 요소를 클릭시 캐싱데이터가 아닌 새로 데이터를 호출
* USE_TN                 :   사용
*********************************************************************************************************************** */
export async function clearLostarkApiCache(inputName, element) {
    const cacheKey = `lostarkApiData`; // 메인 캐시 키
    element.addEventListener("click", () => { clearCache() })

    function clearCache() {
        let alertText = `접속을 종료해야 api가 갱신됩니다.\n캐릭터 선택창으로 이동 후 갱신버튼을 눌러주세요`
        alert(alertText); // 필요하다면 주석 해제

        // 1. 세션 스토리지에서 전체 캐시 객체 가져오기
        const rawCachedData = sessionStorage.getItem(cacheKey);
        if (rawCachedData) {
            try {
                let allCachedData = JSON.parse(rawCachedData);

                // 2. 객체이고 inputName 키가 있는지 확인
                if (typeof allCachedData === 'object' && allCachedData !== null && allCachedData.hasOwnProperty(inputName)) {
                    // 3. 해당 inputName 키 삭제
                    delete allCachedData[inputName];
                    // console.log(`캐시에서 '${inputName}' 항목 삭제됨.`);

                    // 4. 수정된 객체를 다시 세션 스토리지에 저장
                    sessionStorage.setItem(cacheKey, JSON.stringify(allCachedData));
                } else {
                    // console.log(`캐시에 '${inputName}' 항목이 없거나 캐시 형식이 올바르지 않습니다.`);
                }
            } catch (e) {
                // console.error("캐시 데이터 처리 중 오류 발생:", e);
                // 오류 발생 시 전체 캐시를 제거하는 것을 고려할 수 있습니다.
                // sessionStorage.removeItem(cacheKey);
            }
        } else {
            // console.log("세션 스토리지에 캐시 데이터가 없습니다.");
        }

        // 페이지 새로고침은 필요에 따라 주석 해제
        location.reload();
    }
}


/* **********************************************************************************************************************
* name		             :	 expeditionApiCall
* version                :   2.0
* description            :   해당 닉네임의 원정대 정보를 호출
* USE_TN                 :   사용
*********************************************************************************************************************** */
export async function expeditionApiCall(inputName) {
    let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
    let apiKey;
    if (cloudflareResponse.status !== 403) {
        apiKey = await cloudflareResponse.json();
        apiKey = apiKey.apiKey;
    }
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${apiKey}`,
        },
    };
    const response = await fetch(`https://developer-lostark.game.onstove.com/characters/${inputName}/siblings`, options);
    const data = await response.json();
    // console.log(data)
    return data
}