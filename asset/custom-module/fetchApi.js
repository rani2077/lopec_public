import {key} from "../../config.js"

export async function lostarkApiCall(inputName,callback) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${key}`,
        },
    };
    const response = await fetch('https://developer-lostark.game.onstove.com/armories/characters/'+inputName, options);
    const data = await response.json();

    return data

}