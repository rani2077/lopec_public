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
    let inputFlag = 1;
    let nowVerstion = "?v1.0"
    let checkerMain = "LopecCheckerMain"
    let checkerMainHtml = `<span class="" style="display:block;text-align:center;padding-top:50px;font-size:18px;">닉네임을 입력해 주세요</span>`

    let value = urlParams.get(paramNames);
    if (!value.includes(checkerMain) && value) {
        let inputText = value;
        getCharacterProfile(inputText,function(){
            const data = apiData


            // 스펙포인트 표시
            function simpleGroup(){
                let originClass = data.ArmoryProfile.CharacterClassName
                let specPoint = ""
                if(data.ArmoryEngraving.ArkPassiveEffects){
                    specPoint = formatNumber(Math.max( highTierSpecPointObj.supportSpecPoint, highTierSpecPointObj.dealerlastFinalValue ).toFixed(0))
                }else{
                    specPoint = "스펙포인트 미제공"
                }

                return`
                    <div class="simple-group">
                        <div class="name">
                            <a href="https://lopec.kr/search/search.html?mainCharacterName=${inputText}" target="_blink"><strong>${inputText}</strong><em>${userSecondClass + " " + originClass}</em></a>
                        </div>
                        <span class="grade"  ${gradeObj.lowTier}><img src="${gradeObj.ico}" alt=""></span>
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
                let top = "<em class='top'>상</em>"
                let middle = "<em class='middle'>중</em>"
                let bottom = "<em class='bottom'>하</em>"
                
                data.ArmoryEquipment.forEach(function(accessory,index){
                    let grade = ""
                    if(accessory.Type == "목걸이"){
                        let filterObjFirst = []
                        if(!(userSecondClass == "서폿")){ //딜러
                            filterObjFirst = [
                                {name:'적에게 주는 피해 +2.00%',grade:top},
                                {name:'적에게 주는 피해 +1.20%',grade:middle},
                                {name:'적에게 주는 피해 +0.55%',grade:bottom},
                                {name:'추가 피해 +2.60%',grade:top},
                                {name:'추가 피해 +1.60%',grade:middle},
                                {name:'추가 피해 +0.70%',grade:bottom},
                            ]
                        }else if(userSecondClass == "서폿"){ // 서폿
                            filterObjFirst = [
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +6.00%',grade:top},
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +3.60%',grade:middle},
                                {name:'세레나데, 신앙, 조화 게이지 획득량 +1.60%',grade:bottom},
                                {name:'낙인력 +8.00%',grade:'<em class="top">상<small>낙</small></em>'},
                                {name:'낙인력 +4.80%',grade:'<em class="middle">중<small>낙</small></em>'},
                                {name:'낙인력 +2.15%',grade:'<em class="bottom">하<small>낙</small></em>'},
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
                        
                        let filterObjFirst = []
                        if( !(userSecondClass == "서폿")){ //딜러
                            filterObjFirst = [
                                {name:'무기 공격력 +3.00%',grade:top},
                                {name:'무기 공격력 +1.80%',grade:middle},
                                {name:'무기 공격력 +0.80%',grade:bottom},
                                {name:'공격력 +1.55%',grade:top},
                                {name:'공격력 +0.95%',grade:middle},
                                {name:'공격력 +0.40%',grade:bottom},
                            ]
                        }else if(userSecondClass == "서폿"){ // 서폿
                            filterObjFirst = [
                                {name:'파티원 보호막 효과 +3.50%',grade:top},
                                {name:'파티원 보호막 효과 +2.10%',grade:middle},
                                {name:'파티원 보호막 효과 +0.95%',grade:bottom},
                                {name:'파티원 회복 효과 +3.50%',grade:top},
                                {name:'파티원 회복 효과 +2.10%',grade:middle},
                                {name:'파티원 회복 효과 +0.95%',grade:bottom},
                                {name:'무기 공격력 +3.00%',grade:top},
                                {name:'무기 공격력 +1.80%',grade:middle},
                                {name:'무기 공격력 +0.80%',grade:bottom},
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
                    }else if(accessory.Type == "반지"){
                        let filterObjFirst = []
                        
                        if(!(userSecondClass == "서폿")){ //딜러
                            filterObjFirst = [
                                {name:'치명타 피해 +4.00%',grade:top},
                                {name:'치명타 피해 +2.40%',grade:middle},
                                {name:'치명타 피해 +1.10%',grade:bottom},
                                {name:'치명타 적중률 +1.55%',grade:top},
                                {name:'치명타 적중률 +0.95%',grade:middle},
                                {name:'치명타 적중률 +0.40%',grade:bottom},
                                ]
                        }else if(userSecondClass == "서폿"){ // 서폿
                            filterObjFirst = [
                                {name:'아군 공격력 강화 효과 +5.00%',grade:top},
                                {name:'아군 공격력 강화 효과 +3.00%',grade:middle},
                                {name:'아군 공격력 강화 효과 +1.35%',grade:bottom},
                                {name:'아군 피해량 강화 효과 +7.50%',grade:top},
                                {name:'아군 피해량 강화 효과 +4.50%',grade:middle},
                                {name:'아군 피해량 강화 효과 +2.00%',grade:bottom},
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
                        let gradeClass = ""
                        if(engraving.Grade == "유물"){
                            gradeClass = "top"
                        }else if(engraving.Grade == "전설"){
                            gradeClass = "middle"
                            
                        }else if(engraving.Grade == "영웅"){
                            gradeClass = "low"
                            
                        }


                        let engName = ""
                        engravingFilter.forEach(function(engFilter){
                            if(engFilter.name == engraving.Name){
                                engName = engFilter.short
                            }
                        })
                        console.log(engName)
                        engravingBox += `
                            <div class="engraving-box">
                                <span class="name">${engName}</span>
                                <div class="tag ${gradeClass}">${engraving.Grade} ${engraving.Level}</div>
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

                
                gradeWideDec()                                              //유효옵 3개 너비조정
            }
            completeHtml()

            
        });

    }else if(value == checkerMain+nowVerstion ){ //로펙체커메인화면, 현재버전
        document.querySelector(".sc-result").innerHTML = checkerMainHtml
        // alert("로펙체커 메인  ")
    }else if(value.includes(checkerMain) && !(value == checkerMain+nowVerstion) ){
        checkerMainHtml += `
        <div class="alert-group">
            <div class="alert-area">
                <div class="img-box"><img src="../asset/image/lopec-checker-icon.png" alt="로펙체커로고"></div>
                <div class="text-box">
                    <span class="alert">업데이트 가능</span>
                    <p class="desc">새로운 기능 추가 및 버그 수정.<br>자세한 내용은 업데이트 후 확인하세요.</p>
                </div>
                <div class="button-box">
                    <a href="" class="agree">업데이트</a>
                    <button id="update-disagree" class="disagree">나중에</button>
                </div>
            </div>
        </div>`;
        document.querySelector(".sc-result").innerHTML = checkerMainHtml
        document.getElementById("update-disagree").addEventListener("click",function(){
            document.querySelector(".alert-group").style.display = "none"
        })
        
    }

    

});



function gradeWideDec(){
    document.querySelectorAll(".accessory-area .grade").forEach(function(grade){
        if(grade.children.length > 2){
            document.querySelector(".accessory-area").classList.add("wide")
        }
    })
}




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



