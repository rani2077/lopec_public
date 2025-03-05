import {key} from "../../config.js"

export async function lostarkApiCall(inputName) {
    let cloudflareResponse = await fetch('https://lucky-sea-34dd.tassardar6-c0f.workers.dev/');
    if(cloudflareResponse !== 403){
        let key = await cloudflareResponse.json();
    }
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