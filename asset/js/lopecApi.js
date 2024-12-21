import { getCharacterProfile, apiData } from '../js/spec-point.js'


getCharacterProfile('청염각',function(){
    document.body.innerHTML = `
{
    "name": "청염각CURL",
    "class": "스트라이커",
    "point": "100,000",
    "level": 1680
}
    `
});


// document.addEventListener('DOMContentLoaded', (event) => {
//     const urlParams = new URLSearchParams(window.location.search);
    
//     // input name 변경 필요함
    
//     const paramNames = ['mainCharacterName', 'headerCharacterName', 'mobileCharacterName'];
//     let inputText = '';
//     let inputFlag = 1;

//     paramNames.forEach(function(param){
//         let value = urlParams.get(param);
//         if (value) {
//             inputText = value;


//             // 캐릭터 검색
//             getCharacterProfile(inputText,function(){
//                 console.log(inputText)
//             });


//         }
//     })

// });
