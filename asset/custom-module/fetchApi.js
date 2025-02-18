import {key} from "../../config.js"

export async function lostarkApiCall(callback) {
    const options = {
        method: 'GET', // 기본값은 GET
        headers: {
            'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
            'Authorization': `bearer ${key}`,
        },
    };
    const response = await fetch('https://developer-lostark.game.onstove.com/armories/characters/청염각', options);
    const userDataJSON = await response.json();

    callback(userDataJSON)

}