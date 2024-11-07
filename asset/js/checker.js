import {
    lowTierSpecPointObj ,   //3티어 스펙포인트
    highTierSpecPointObj ,  //4티어 스펙포인트 객체
    gradeObj ,              //등급 아이콘및 이미지
    userSecondClass ,       //2차전직명
    apiData ,               //유저 데이터
    getCharacterProfile     //스펙포인트 계산 함수
} from './spec-point.js'


import {engravingFilter} from './filter.js'






// 검색 스크립트
document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // input name 변경 필요함
    
    const paramNames = ['patreonCharacterName'];
    let inputText = '';
    let inputFlag = 1;

    let value = urlParams.get(paramNames);
    if (value) {
        inputText = value;
        getCharacterProfile(inputText,function(){
            const data = apiData


            // 스펙포인트 표시
            function simpleGroup(){
                let originClass = data.ArmoryProfile.CharacterClassName
                let specPoint = ""
                if(data.ArmoryEngraving.ArkPassiveEffects){
                    specPoint = formatNumber(Math.max( highTierSpecPointObj.supportSpecPoint, highTierSpecPointObj.dealerlastFinalValue ).toFixed(0))
                }else{
                    specPoint = formatNumber(lowTierSpecPointObj.specPoint)
                }

                return`
                    <div class="simple-group">
                        <div class="name">
                            <a href="https://lopec.kr/search/search.php?mainCharacterName=${inputText}" target="_blink"><strong>${inputText}</strong><em>${userSecondClass + " " + originClass}</em></a>
                        </div>
                        <span class="grade"><img src="${gradeObj.ico}" alt=""></span>
                        <span class="point">${specPoint}</span>
                    </div>
                    <div class="patron-group"></div>`;
            }


            // 보석 요약정보 표시
            function gemArea(){

                let regex = />([^<>]+)</g;
                const gemsArry = [];
                let gemBox = ""

                if(!(data.ArmoryGem.Gems == null)){
                    data.ArmoryGem.Gems.forEach(function(gem){
                        let match;
                        while ((match = regex.exec(gem.Name)) !== null) {
                            let regex = /(\d+).*(작열|겁화|멸화|홍염)/;
                            match[1].match(regex);
                            
                            let result = {
                                level : match[1].match(regex)[1] ,
                                name : match[1].match(regex)[2]
                            }
                            gemsArry.push(result);
                        }
                    })    
                }
                let value = {};
                
                gemsArry.sort(function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    if (a.level < b.level) return -1;
                    if (a.level > b.level) return 1;
                    return 0;
                });
                
                console.log(gemsArry)
                gemsArry.forEach(item => {
                    let key = `${item.level}${item.name}`;
                    if (value[key]) {
                        value[key]++;
                    } else {
                        value[key] = 1;
                    }
                });
                console.log(value)

                                                      
                Object.entries(value).forEach(([keyWord, count]) => {
                    gemBox += 
                        `<div class="gem-box">
                            <span class="tag">${keyWord}</span>
                            <span class="count">${count}개</span>
                        </div>`;
    
                });

                return `
                    <div class="gem-area">
                        <p class="gem-title sub-title">보석</p>
                        ${gemBox}
                    </div>`
            }

            // 악세서리
            function accessoryArea(){
                let accessoryBox = ""
                let homeLess = "떡"
                data.ArmoryEquipment.forEach(function(accessory,index){
                    let grade = ""
                    if(accessory.Type == "목걸이"){
                        let filterObjFirst = []
                        if(!(userSecondClass == "서폿")){ //딜러
                            filterObjFirst = [
                                {name:'적에게 주는 피해 +2.00%',grade:'상'},
                                {name:'적에게 주는 피해 +1.20%',grade:'중'},
                                {name:'적에게 주는 피해 +0.55%',grade:'하'},
                                {name:'추가 피해 +2.60%',grade:'상'},
                                {name:'추가 피해 +1.60%',grade:'중'},
                                {name:'추가 피해 +0.60%',grade:'하'},
                            ]
                        }else if(userSecondClass == "서폿"){ // 서폿
                            filterObjFirst = [
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +6.00%',grade:'상'},
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +3.60%',grade:'중'},
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +1.60%',grade:'하'},
                                {name:'낙인력 +8.00%',grade:'<em>상<small>낙</small></em>'},
                                {name:'낙인력 +4.80%',grade:'<em>중<small>낙</small></em>'},
                                {name:'낙인력 +2.15%',grade:'<em>하<small>낙</small></em>'},
                            ]
                        }

                        filterObjFirst.forEach(function(firstFilter){
                            if(accessory.Tooltip.includes(firstFilter.name)){
                                grade += firstFilter.grade
                            }
                        })
                        if(grade == ""){
                            grade += homeLess
                        }
                        accessoryBox +=`
                        <div class="accessory-box">
                            <span class="name">${accessory.Type}</span>
                            <span class="grade">${grade}</span>
                        </div>`;
                    }else if(accessory.Type == "귀걸이"){
                        let filterObjFirst = [
                            {name:'무기 공격력 +3.00%',grade:'상'},
                            {name:'무기 공격력 +1.80%',grade:'중'},
                            {name:'무기 공격력 +0.80%',grade:'하'},
                            {name:'공격력 +1.55%',grade:'상'},
                            {name:'공격력 +0.95%',grade:'중'},
                            {name:'공격력 +0.40%',grade:'하'},

                        ]
                        
                        filterObjFirst.forEach(function(firstFilter){
                            if(accessory.Tooltip.includes(firstFilter.name)){
                                grade += firstFilter.grade
                            }
                        })
                        if(grade == ""){
                            grade += homeLess
                        }
                        accessoryBox +=`
                        <div class="accessory-box">
                            <span class="name">${accessory.Type}</span>
                            <span class="grade">${grade}</span>
                        </div>`;
                    }else if(accessory.Type == "반지"){
                        let filterObjFirst = []
                        
                        if(!(userSecondClass == "서폿")){ //딜러
                            filterObjFirst = [
                                {name:'치명타 피해 +4.00%',grade:'상'},
                                {name:'치명타 피해 +2.40%',grade:'중'},
                                {name:'치명타 피해 +1.10%',grade:'하'},
                                {name:'치명타 적중률 +1.55%',grade:'상'},
                                {name:'치명타 적중률 +0.95%',grade:'중'},
                                {name:'치명타 적중률 +0.40%',grade:'하'},
                                ]
                        }else if(userSecondClass == "서폿"){ // 서폿
                            filterObjFirst = [
                                {name:'아군 공격력 강화 효과 +5.00%',grade:'상'},
                                {name:'아군 공격력 강화 효과 +3.00%',grade:'중'},
                                {name:'아군 공격력 강화 효과 +1.35%',grade:'하'},
                                {name:'아군 피해량 강화 효과 +7.50%',grade:'상'},
                                {name:'아군 피해량 강화 효과 +4.50%',grade:'중'},
                                {name:'아군 피해량 강화 효과 +2.00%',grade:'하'},
                                ]
                        }

                        filterObjFirst.forEach(function(firstFilter){
                            if(accessory.Tooltip.includes(firstFilter.name)){
                                grade += firstFilter.grade
                            }
                        })
                        if(grade == ""){
                            grade += homeLess
                        }
                        accessoryBox +=`
                        <div class="accessory-box">
                            <span class="name">${accessory.Type}</span>
                            <span class="grade">${grade}</span>
                        </div>`;
                    }



                })

                return `
                    <div class="accessory-area">
                        <p class="accessory-title sub-title">악세(특옵)</p>
                        ${accessoryBox}
                    </div>`;

            }



            // 각인
            function engravingArea(){
                let engravingBox = ""

                if(data.ArmoryEngraving.ArkPassiveEffects){
                    data.ArmoryEngraving.ArkPassiveEffects.forEach(function(engraving){

                        let engName = ""
                        engravingFilter.forEach(function(engFilter){
                            if(engFilter.name == engraving.Name){
                                engName = engFilter.short
                            }
                        })
                        engravingBox += `
                            <div class="engraving-box">
                                <span class="name">${engName}</span>
                                <div class="tag">${engraving.Grade} ${engraving.Level}</div>
                            </div>`;
                    })
                    return `
                        <div class="engraving-area">
                            <p class="engraving-title sub-title">각인</p>
                            ${engravingBox}
                        </div>`;
                }else{
                    let engName = ""
                    let engBox = ""
                    data.ArmoryEngraving.Effects.forEach(function(lowEng){
                        engravingFilter.forEach(function(engFilter){
                            if(engFilter.name == lowEng.Name.replace(/Lv\. \d+/g, "").trim()){
                                engName = engFilter.short
                            }
                        })
                        engBox +=`
                        <div class="engraving-box" style="justify-content:center;">
                                <span class="">${engName}</span>
                        </div>`
                    })
                    return `
                        <div class="engraving-area">
                            <p class="engraving-title sub-title">각인</p>
                            ${engBox}
                        </div>`;
                }

            }

            function detailGroup(){
                return`
                <div class="detail-group">
                    ${gemArea()}
                    ${accessoryArea()}
                    ${engravingArea()}
                </div>`;
            }




            // 요약 최종 정보 렌더링
            function completeHtml(){
                let html = ""
                
                html += simpleGroup()
                html += detailGroup()
                document.querySelector(".sc-result").innerHTML = html
            }
            completeHtml()

            // if(data.ArkPassive.IsArkPassive){
            //     completeHtml()
            // }else{
            //     document.querySelector(".sc-result").innerHTML = `3티어 캐릭터의 경우 현재 지원되지 않습니다.`
            // }
           
            
        });

    }

    

});






// 숫자 단위 표현
function formatNumber(num) {
    if (num >= 100000000) {
        return Math.floor(num / 100000000) + '억 ' + formatNumber(num % 100000000);
    } else if (num >= 10000) {
        const remainder = num % 10000;
        return Math.floor(num / 10000) + '만' + (remainder > 0 ? ' ' + formatNumber(remainder) : '');
    } else {
        return num.toString();
    }
}




