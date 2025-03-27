import {localApiKey} from "../../config.js"

export async function lostarkApiCall(inputName) {
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
    const response = await fetch('https://developer-lostark.game.onstove.com/armories/characters/'+inputName, options);
    const data = await response.json();

    return data
}


export async function expeditionApiCall(inputName){
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
    console.log(data)
    return data
}