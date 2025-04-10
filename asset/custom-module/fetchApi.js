//import { localApiKey } from "../../config.js"
import { insertLopecCharacters } from '../js/character.js'
import { insertLopecSearch } from '../js/search.js'

/* **********************************************************************************************************************
* name		             :	 lostarkApiCall
* version                :   2.0
* description            :   검색한 유저의 json정보를 반환
* USE_TN                 :   사용
*********************************************************************************************************************** */
export async function lostarkApiCall(inputName) {
    const cacheKey = `lostarkApiData_${inputName}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const oneMinute = 60 * 1000; // 1분 (밀리초)

        // 캐시가 1분 이내에 생성되었으면 캐시된 데이터 반환
        if (now - timestamp < oneMinute) {
            // alert("캐싱데이터 반환")
            return data;
        } else {
            // 캐시 만료: 세션 스토리지에서 제거하고 API 호출
            // alert("캐싱데이터 만료")
            sessionStorage.removeItem(cacheKey);
        }
    }
    // alert("api 호출")
    // 캐시가 없거나 만료되었을 경우 API 호출
    let apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDA1NTc2MTkifQ.IZ0KOLE_2fmBS9O11MNjN_9fj5oKuljWpX5w80QiX90zfmx-gDVkPaB1BGRebXRbtQNQ2P4zjpIzJtnfHE0DVfqVwl0fin3A0UXP7bToZ8a10cM9kWWKoh_nNkP672XZDcUWnYvkWOc5t88hY-4CnAull5ra-es0l18PGeeHGQ4T2bXq7tQmomCpyY54cX02dqkUEoAU3HQi7iM6kuYaa9v62ydrh_TOlYj8uRk_1h0Zj-NCzHrH1IrF3p31lBCWvOiWiV0BgNAw1k5Ykl2ZG86kSWkAA4aL9wAeFfmHbXY0JYgnjlrB5EHx2immRnLtiNus43hXsW6crJq7tGL3JQ";
    let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
    if (cloudflareResponse.status !== 403 && /lopec.kr/.test(window.location.host)) {
        const responseData = await cloudflareResponse.json();
        apiKey = responseData.apiKey;
    }
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `bearer ${apiKey}`,
        },
    };

    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${inputName}`, options);
    const data = await response.json();

    // API 응답을 세션 스토리지에 캐싱 (1분 만료)
    sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

    return data;
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
export async function clearLostarkApiCache(inputName, element) {
    const cacheKey = `lostarkApiData_${inputName}`;
    element.addEventListener("click", () => { clearCache() })
    function clearCache() {
        let alertText = `접속을 종료해야 API가 갱신됩니다.\n캐릭터 선택창으로 이동 후 갱신 버튼을 눌러주세요.`
        alert(alertText);
        sessionStorage.removeItem(cacheKey);
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
    let apiKey = localApiKey;
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