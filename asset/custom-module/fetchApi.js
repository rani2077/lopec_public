import {key} from "../../config.js"

export async function lostarkApiCall(inputName,callback) {
    const options = {
        method: 'GET', // 기본값은 GET
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
            'Authorization': `bearer ${key}`,
        },
    };
    const response = await fetch('https://developer-lostark.game.onstove.com/armories/characters/'+inputName, options);
    const data = await response.json();

    return data

}