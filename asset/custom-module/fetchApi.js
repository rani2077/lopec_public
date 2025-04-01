import { localApiKey } from "../../config.js"


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
    let apiKey = localApiKey;
    // let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
    // if (cloudflareResponse.status !== 403) {
    //     const responseData = await cloudflareResponse.json();
    //     apiKey = responseData.apiKey;
    // }
    const options = {
        method: 'GET',
        headers: {
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



export async function expeditionApiCall(inputName) {
    let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
    let apiKey = localApiKey;
    // if(cloudflareResponse.status !== 403){
    //     apiKey = await cloudflareResponse.json();
    //     apiKey = apiKey.apiKey;
    // }
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