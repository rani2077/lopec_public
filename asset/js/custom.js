/* **********************************************************************************************************************
* variable name		:	mobileCheck
* description       : 	현재 접속한 디바이스 기기가 모바일, 태블릿일 경우 true를 반환
*********************************************************************************************************************** */
let mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(navigator.userAgent.toLowerCase());

// const baseUrl = "https://lopec.kr/asset"; // CDN 경로 주석 처리

/* **********************************************************************************************************************
 * function name		:	importModuleManager()
 * description			: 	사용하는 모든 외부 module파일 import
 *********************************************************************************************************************** */
async function importModuleManager() {
    let modules = await Promise.all([
        // import(`${baseUrl}/custom-module/fetchApi.js`),     // CDN 로드 주석 처리
        // import(`${baseUrl}/filter/filter.js`),              // CDN 로드 주석 처리
        // import(`${baseUrl}/custom-module/trans-value.js`),  // CDN 로드 주석 처리
        // import(`${baseUrl}/custom-module/calculator.js`),   // CDN 로드 주석 처리
        // import(`${baseUrl}/custom-module/component.js`),    // CDN 로드 주석 처리

        // import(`${baseUrl}/js/characterRead2.js`),           // CDN 로드 주석 처리
        // import(`${baseUrl}/js/search.js`),                   // CDN 로드 주석 처리
        // import(`${baseUrl}/js/character.js`),                // CDN 로드 주석 처리

        import("../custom-module/fetchApi.js" + `?${(new Date).getTime()}`),     // 기존 타임스탬프 방식 복구
        import("../filter/filter.js" + `?${(new Date).getTime()}`),              // 기존 타임스탬프 방식 복구
        import("../custom-module/trans-value.js" + `?${(new Date).getTime()}`),  // 기존 타임스탬프 방식 복구
        import("../custom-module/calculator.js" + `?${(new Date).getTime()}`),   // 기존 타임스탬프 방식 복구
        import("../custom-module/component.js" + `?${(new Date).getTime()}`),    // 기존 타임스탬프 방식 복구

        import("../js/characterRead2.js" + `?${(new Date).getTime()}`),           // 기존 타임스탬프 방식 복구
        import('../js/search.js' + `?${(new Date).getTime()}`),                   // 기존 타임스탬프 방식 복구
        import('../js/character.js' + `?${(new Date).getTime()}`),                // 기존 타임스탬프 방식 복구
    ])
    let moduleObj = {
        fetchApi: modules[0],
        originFilter: modules[1],
        transValue: modules[2],
        calcValue: modules[3],
        component: modules[4],

        userDataRead: modules[5],
        userDataWriteDeviceLog: modules[6],
        userDataWriteDetailInfo: modules[7],
    }

    return moduleObj
}

async function mainSearchFunction() {

    const urlParams = new URLSearchParams(window.location.search);
    // const nameParam = urlParams.get('headerCharacterName');
    const nameParam = urlParams.get('headerCharacterName');

    let Modules = await importModuleManager();
    let component = await Modules.component;
    /* **********************************************************************************************************************
    * function name		:	scProfileSkeleton
    * description       : 	scProfile컴포넌트의 스켈레톤 html
    *********************************************************************************************************************** */
    let scProfileSkeleton = await component.scProfileSkeleton();
    document.querySelector(".wrapper").insertAdjacentHTML('afterbegin', scProfileSkeleton);
    // let scNavElement = await component.scNav(nameParam)
    document.querySelector(".sc-profile").insertAdjacentHTML('afterend', await component.scNav(nameParam));
    document.querySelector(".wrapper").style.display = "block";

    /* **********************************************************************************************************************
    * function name		:	
    * description       : 	
    *********************************************************************************************************************** */
    let data = await Modules.fetchApi.lostarkApiCall(nameParam);
    console.log(data)
    let extractValue = await Modules.transValue.getCharacterProfile(data);
    await Modules.fetchApi.clearLostarkApiCache(nameParam, document.querySelector(".sc-info .spec-area span.reset"));


    let specPoint = await Modules.calcValue.specPointCalc(extractValue);
    // console.log("data", data);
    console.log("오리진obj", extractValue);
    //console.log("specPoint", specPoint);
    // console.log("specPoint", specPoint.completeSpecPoint);


    /* **********************************************************************************************************************
    * function name		:	
    * description       : 	user정보가 로딩완료 시 scProfile을 재생성함
    *********************************************************************************************************************** */
    let userDbInfo = await Modules.userDataRead.getCombinedCharacterData(nameParam, extractValue.etcObj.supportCheck === "서폿" ? "SUP" : "DEAL");
    //console.log(userDbInfo)
    document.querySelector(".sc-profile").outerHTML = await component.scProfile(data, extractValue, userDbInfo);
    // document.querySelector(".sc-profile").outerHTML = await component.scProfile(data, extractValue, userDbInfo.characterRanking.RANKING_NUM, userDbInfo.classRanking.CLASS_RANK);

    /* **********************************************************************************************************************
    * function name		:	specAreaCreate
    * description       : 	spec-area html을 생성함
    *********************************************************************************************************************** */
    function specAreaCreate() {
        let specAreaElement = document.querySelector(".sc-info .group-info .spec-area");
        let nowSpecElement = specAreaElement.querySelector(".spec-point");
        let gaugeElement = specAreaElement.querySelector(".gauge-box");
        let tierImageElement = specAreaElement.querySelector(".tier-box > img");

        //브론즈 500미만
        //실버 500+
        //골드 700+
        //다이아 900+
        //마스터 1000+
        //에스더 1300+

        let gradeImageSrc = "";
        let nextTierValue = 0;
        let tierIndex = 0;
        let tierNameArray = ['브론즈', '실버', '골드', '다이아몬드', '마스터', '에스더'];
        let tierNameEngArray = ['bronze', 'silver', 'gold', 'diamond', 'master', 'esther'];
        if (extractValue.etcObj.supportCheck !== "서폿") {
            if (specPoint.completeSpecPoint >= 3000) {
                gradeImageSrc = "/asset/image/esther.png";
                nextTierValue = 0;
                tierIndex = 5;
            } else if (specPoint.completeSpecPoint >= 2400) {
                gradeImageSrc = "/asset/image/master.png";
                nextTierValue = 3000;
                tierIndex = 4;
            } else if (specPoint.completeSpecPoint >= 1900) {
                gradeImageSrc = "/asset/image/diamond.png";
                nextTierValue = 2400;
                tierIndex = 3;
            } else if (specPoint.completeSpecPoint >= 1600) {
                gradeImageSrc = "/asset/image/gold.png";
                nextTierValue = 1900;
                tierIndex = 2;
            } else if (specPoint.completeSpecPoint >= 1400) {
                gradeImageSrc = "/asset/image/silver.png";
                nextTierValue = 1600;
                tierIndex = 1;
            } else if (specPoint.completeSpecPoint < 1400) {
                gradeImageSrc = "/asset/image/bronze.png";
                nextTierValue = 1400;
                tierIndex = 0;
            }
        } else {
            if (specPoint.completeSpecPoint >= 1300) {
                gradeImageSrc = "/asset/image/esther.png";
                nextTierValue = 0;
                tierIndex = 5;
            } else if (specPoint.completeSpecPoint >= 1000) {
                gradeImageSrc = "/asset/image/master.png";
                nextTierValue = 1300;
                tierIndex = 4;
            } else if (specPoint.completeSpecPoint >= 800) {
                gradeImageSrc = "/asset/image/diamond.png";
                nextTierValue = 1000;
                tierIndex = 3;
            } else if (specPoint.completeSpecPoint >= 700) {
                gradeImageSrc = "/asset/image/gold.png";
                nextTierValue = 800;
                tierIndex = 2;
            } else if (specPoint.completeSpecPoint >= 400) {
                gradeImageSrc = "/asset/image/silver.png";
                nextTierValue = 700;
                tierIndex = 1;
            } else if (specPoint.completeSpecPoint < 400) {
                gradeImageSrc = "/asset/image/bronze.png";
                nextTierValue = 400;
                tierIndex = 0;
            }
        }
        let gaugePercent = specPoint.completeSpecPoint / nextTierValue * 100;
        let gauge = "";
        if (tierIndex !== 5) {
            gauge = `
            <div class="gauge">
                <span class="tier now ${tierNameEngArray[tierIndex]}">${tierNameArray[tierIndex]}</span>
                <span class="tier next ${tierNameEngArray[tierIndex + 1]}">${tierNameArray[tierIndex + 1]}</span>
                <span class="value">${Math.floor(specPoint.completeSpecPoint)}/${nextTierValue}</span>
                <i class="bar" style="clip-path: polygon(0 0, ${gaugePercent}% 0, ${gaugePercent}% 100%, 0% 100%);"></i>
            </div>`;
        } else {
            gauge = `
                <div class="gauge">
                    <span class="tier now">에스더</span>
                    <span class="value">최고티어달성</span>
                    <i class="bar" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);"></i>
                </div>`;
        }

        gaugeElement.innerHTML = gauge;
        nowSpecElement.innerHTML = (specPoint.completeSpecPoint).toFixed(2);
        nowSpecElement.innerHTML = (specPoint.completeSpecPoint).toFixed(2).replace(/\.(\d{2})$/, ".<i style='font-size:20px'>$1</i>");


        // bestSpecElement.innerHTML = "다이아몬드 티어<br> 마스터까지 앞으로 100점!";
        tierImageElement.setAttribute("src", gradeImageSrc);

    }
    specAreaCreate()

    /* **********************************************************************************************************************
    * function name		:	detailAreaCreate
    * description       : 	detail-area html을 생성함
    *********************************************************************************************************************** */



    /* **********************************************************************************************************************
    * function name		:	gemAreaCreate
    * description       : 	gem-area html을 생성함
    *********************************************************************************************************************** */
    function gemAreaCreate() {
        let element = document.querySelector(".sc-info .group-equip .gem-area");
        let gemArray = extractValue.htmlObj.gemSkillArry;
        let gemBox = ""
        if (gemArray.length !== 0) {
            gemArray.forEach((gemItem, idx) => {
                let sortTag = 0;
                if (/멸화|겁화/.test(gemItem.name)) {
                    sortTag = 1;
                } else {
                    sortTag = 2;
                }
                let grade = data.ArmoryGem.Gems[idx].Grade;
                let gradeClassName = "";
                if (grade === "고대") {
                    gradeClassName = "ultra-background";
                } else if (grade === "유물") {
                    gradeClassName = "rare-background";
                } else if (grade === "전설") {
                    gradeClassName = "common-background";
                } else if (grade === "영웅") {
                    gradeClassName = "hero-background";
                }
                gemBox += `
                <div class="gem-box radius ${gradeClassName}">
                    <img src="${data.ArmoryGem.Gems[idx].Icon}" alt="" style="border-radius:3px;">
                    <span class="level">${gemItem.level}</span>
                    <span class="detail">${gemItem.skill} <br> 딜 지분 : ${gemItem.skillPer !== "none" ? `${(gemItem.skillPer * 100).toFixed(1)}%` : "데이터 없음"}</span>
                    <i style="display:none;">${sortTag}</i>
                </div>`
            })
            element.innerHTML = gemBox;
        } else if (gemArray.length === 0) {
            for (let i = 0; i < 11; i++) {
                gemBox += `
                <div class="gem-box radius empty">
                    <img src="/asset/image/skeleton-img.png" alt="" style="border-radius:3px;">
                    <span class="level">N</span>
                    <span class="detail">보석없음</span>
                    <i style="display:none;">1</i>
                </div>`
            }
            element.innerHTML = gemBox;

        }

    }
    gemAreaCreate()
    /* **********************************************************************************************************************
    * function name		:	gemSort()
    * description       : 	보석을 정렬함
    *********************************************************************************************************************** */
    async function gemSort() {
        const parent = document.querySelector('.sc-info .gem-area');
        const children = Array.from(parent.children);
        // 순서정렬
        children.sort((a, b) => {
            const iA = parseInt(a.querySelector('i').textContent);
            const iB = parseInt(b.querySelector('i').textContent);
            const levelA = parseInt(a.querySelector('.level').textContent);
            const levelB = parseInt(b.querySelector('.level').textContent);
            if (iA === iB) {
                return levelB - levelA;
            }
            return iA - iB;
        });
        // 정렬되지 않은 html 제거
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        // 정렬된 html 추가
        children.forEach(child => parent.appendChild(child));
    }
    gemSort()

    /* **********************************************************************************************************************
    * function name		:	armorAreaCreate
    * description       : 	armor-area html을 생성함
    *********************************************************************************************************************** */
    function armorAreaCreate() {
        let elements = document.querySelectorAll(".group-equip .armor-area .armor-item");
        let helmetElement = elements[0];
        let shoulderElement = elements[1];
        let topElement = elements[2];
        let bottomElement = elements[3];
        let gloveElement = elements[4];
        let weaponElement = elements[5];

        extractValue.htmlObj.armoryInfo.forEach(item => {
            let progressClassName = "";
            if (item.quality < 10) {
                progressClassName = "common";
            } else if (item.quality < 30) {
                progressClassName = "uncommon";
            } else if (item.quality < 70) {
                progressClassName = "rare";
            } else if (item.quality < 90) {
                progressClassName = "epic";
            } else if (item.quality < 100) {
                progressClassName = "legendary";
            } else if (item.quality === '100') {
                progressClassName = "mythic";
            }

            let backgroundClassName = "";
            if (item.grade === "고대") {
                backgroundClassName = "ultra";
            } else if (item.grade === "유물") {
                backgroundClassName = "rare";
            } else if (item.grade === "영웅") {
                backgroundClassName = "hero";
            }

            let advancedLevel = "";
            if (item.advancedLevelIndex !== -1) {
                advancedLevel = "X" + item.advancedLevel;
            }
            let elixirWrap = ""
            if (item.elixir.length !== 0) {
                let spanElixir = ""
                item.elixir.forEach(elixirItem => {
                    spanElixir += `<span class="elixir radius"> ${elixirItem.name} ${elixirItem.level}</span>`;
                });
                elixirWrap = `
                    <div class="elixir-wrap">
                        ${spanElixir}
                    </div>`
            };
            let hyperWrap = ""
            if (item.hyperIndex !== -1) {
                hyperWrap = `
                    <div class="hyper-wrap">
                        <span class="hyper"><img src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png" alt="꽃모양 아이콘">${item.hyperStar}</span>
                        <span class="level">${item.hyperLevel}단계</span>
                    </div>`
            }
            let armorItem = `
            <li class="armor-item">
                <div class="img-box radius ${backgroundClassName}-background">
                    <img src="${item.icon}" alt="착용장비프로필">
                    <span class="tier">T${item.tier}</span>
                    <span class="progress ${progressClassName}-progressbar">${item.quality}</span>
                </div>
                <div class="text-box">
                    <div class="name-wrap">
                        <span class="tag"></span>
                        <span class="armor-name">${item.name} <strong style="font-weight:600;">${advancedLevel}</strong></span>
                    </div>
                    ${elixirWrap}
                    ${hyperWrap}
                </div>
            </li>`

            if (item.type === "투구") {
                helmetElement.outerHTML = armorItem;
            } else if (item.type === "어깨") {
                shoulderElement.outerHTML = armorItem;
            } else if (item.type === "상의") {
                topElement.outerHTML = armorItem;
            } else if (item.type === "하의") {
                bottomElement.outerHTML = armorItem;
            } else if (item.type === "장갑") {
                gloveElement.outerHTML = armorItem;
            } else if (item.type === "무기") {
                weaponElement.outerHTML = armorItem;
            }
        })
    }
    armorAreaCreate()
    /* **********************************************************************************************************************
    * function name		:	armorItemDetailInfoCreate
    * description       : 	armor-item 엘릭서 초월 정보 html을 생성함
    *********************************************************************************************************************** */
    function armorItemDetailInfoCreate() {
        let elixirDouble = ["회심", "달인 (", "강맹", "칼날방패", "선봉대", "행운", "선각자", "진군", "신념"]
        // extractValue.htmlObj.armoryInfo[i].elixir[i]
        let allElixirData = [];
        extractValue.htmlObj.armoryInfo.forEach(item => {
            if (item.elixir && Array.isArray(item.elixir)) {
                allElixirData = allElixirData.concat(item.elixir);
            }
        });
        let specialElixir = allElixirData.filter(elixir => elixirDouble.find(double => elixir.name.includes(double)));
        specialElixir = specialElixir.map(elixir => elixir.name.replace(/\([^)]*\)/g, '').trim())
        function countDuplicates(arr) {
            const counts = {};
            for (const item of arr) {
                counts[item] = (counts[item] || 0) + 1;
            }
            let mostFrequent = null;
            let maxCount = 0;
            for (const item in counts) {
                if (counts[item] > 1) { // 중복된 값만 고려
                    if (counts[item] > maxCount) {
                        maxCount = counts[item];
                        mostFrequent = { name: item, count: counts[item] };
                    }
                }
            }
            return mostFrequent;
        }
        let elixirResult = "비활성화";
        if (countDuplicates(specialElixir) !== null && countDuplicates(specialElixir).count > 1) {
            elixirResult = countDuplicates(specialElixir).name + " 2단계"
        }
        function elixirLevelSum(array) {
            let sumValue = 0;
            array.forEach(item => {
                let value = Number(item.level.match(/Lv\.(\d+)/)[1]);
                sumValue += value;
            })
            return sumValue
        }
        let elixirProgressClassName = "";
        if (elixirLevelSum(allElixirData) < 35) {
            elixirProgressClassName = "common"
        } else if (elixirLevelSum(allElixirData) < 40) {
            elixirProgressClassName = "epic"
        } else if (elixirLevelSum(allElixirData) < 50) {
            elixirProgressClassName = "legendary"
        } else if (elixirLevelSum(allElixirData) < 999) {
            elixirProgressClassName = "mythic"
        }

        let hyperStarArray = extractValue.htmlObj.armoryInfo.map(item => item.hyperStar);
        function hyperAvgValue(array) {
            let sumValue = 0;
            let obj = {};
            array.forEach(item => {
                sumValue += Number(item);
            })
            obj.avgValue = sumValue / array.length;
            obj.sumValue = sumValue;

            return obj;
        }
        let hyperProgressClassName = "";
        if (hyperAvgValue(hyperStarArray).sumValue < 100) {
            hyperProgressClassName = "common"
        } else if (hyperAvgValue(hyperStarArray).sumValue < 120) {
            hyperProgressClassName = "epic"
        } else if (hyperAvgValue(hyperStarArray).sumValue < 126) {
            hyperProgressClassName = "legendary"
        } else if (hyperAvgValue(hyperStarArray).sumValue < 999) {
            hyperProgressClassName = "mythic"
        }

        let element = document.querySelectorAll(".sc-info .group-equip .armor-item")[6];
        element.innerHTML = `
            <div class="img-box radius ultra-background">
                <img src="/asset/image/elixir.png" alt="">
                <span class="progress ${elixirProgressClassName}-progressbar">${elixirLevelSum(allElixirData)}</span>
            </div>
            <div class="text-box">
                <div class="name-wrap">엘릭서</div>
                <div class="name-wrap">${elixirResult}</div>
            </div>
            <div class="img-box radius ultra-background">
                <img src="/asset/image/hyper.png" alt="">
                <span class="progress ${hyperProgressClassName}-progressbar">${hyperAvgValue(hyperStarArray).sumValue}</span>
            </div>
            <div class="text-box">
                <div class="name-wrap">초월</div>
                <div class="name-wrap">평균 ${hyperAvgValue(hyperStarArray).avgValue.toFixed(1)}성</div>
            </div>`
    }
    armorItemDetailInfoCreate()

    /* **********************************************************************************************************************
    * function name		:	accessoryAreaCreate
    * description       : 	armor-area html을 생성함
    *********************************************************************************************************************** */
    function accessoryAreaCreate() {
        let elements = document.querySelectorAll(".group-equip .accessory-area .accessory-item");
        let necklaceElement = elements[0];
        let earringElement1 = elements[1];
        let earringElement2 = elements[2];
        let ringElement1 = elements[3];
        let ringElement2 = elements[4];

        let earringCount = 0;
        let ringCount = 0;
        extractValue.htmlObj.accessoryInfo.forEach(accessory => {

            let grindingWrap = ``;
            if (accessory.accessory && accessory.accessory.length > 0) {
                accessory.accessory.forEach(item => {
                    let grade = item.split(":")[1];
                    let name = item.split(":")[0];
                    let gradeName = "";
                    if (grade === "high") {
                        gradeName = "상";
                    } else if (grade === "middle") {
                        gradeName = "중";
                    } else if (grade === "low") {
                        gradeName = "하";
                    }
                    grindingWrap += `
                    <div class="grinding-wrap">
                        <span class="quality ${grade}">${gradeName}</span>
                        <span class="option">${name}</span>
                    </div>`;
                });
            }
            let progressClassName = "";
            if (accessory.quality < 10) {
                progressClassName = "common";
            } else if (accessory.quality < 30) {
                progressClassName = "uncommon";
            } else if (accessory.quality < 70) {
                progressClassName = "rare";
            } else if (accessory.quality < 90) {
                progressClassName = "epic";
            } else if (accessory.quality < 100) {
                progressClassName = "legendary";
            } else if (accessory.quality === '100') {
                progressClassName = "mythic";
            }

            let backgroundClassName = "";
            if (accessory.grade === "고대") {
                backgroundClassName = "ultra";
            } else if (accessory.grade === "유물") {
                backgroundClassName = "rare";
            } else if (accessory.grade === "영웅") {
                backgroundClassName = "hero";
            }

            let accessoryItem = `
                <div class="img-box radius ${backgroundClassName}-background">
                    <img src="${accessory.icon}" alt="">
                    <span class="tier">T${accessory.tier}</span>
                    <span class="progress ${progressClassName}-progressbar">${accessory.quality}</span>
                </div>
                <div class="option-box">
                    <div class="text-box">
                        ${grindingWrap}
                    </div>

                </div>`
            if (accessory.type === "목걸이") {
                necklaceElement.innerHTML = accessoryItem;
            } else if (accessory.type === "귀걸이") {
                if (earringCount === 0) {
                    earringElement1.innerHTML = accessoryItem;
                    earringCount++;
                } else {
                    earringElement2.innerHTML = accessoryItem;
                }
            } else if (accessory.type === "반지") {
                if (ringCount === 0) {
                    ringElement1.innerHTML = accessoryItem;
                    ringCount++;
                } else {
                    ringElement2.innerHTML = accessoryItem;
                }
            }
        })
    }
    accessoryAreaCreate()

    /* **********************************************************************************************************************
    * function name		:	stoneItemCreate
    * description       : 	steon-item html을 생성함
    *********************************************************************************************************************** */
    function stoneItemCreate() {
        let element = document.querySelectorAll(".group-equip .accessory-area .accessory-item")[5];
        let stone = extractValue.htmlObj.stoneInfo
        if (stone) {
            let buff = "";
            stone.optionArray.forEach(item => {
                let minus = "";
                if (item.name.includes("감소")) {
                    minus = "minus";
                }
                buff += `<span class="buff ${minus}">${item.name} Lv.${item.level}</span>`
            })

            let backgroundClassName = "";
            if (stone.grade === "고대") {
                backgroundClassName = "ultra";
            } else if (stone.grade === "유물") {
                backgroundClassName = "rare";
            } else if (stone.grade === "영웅") {
                backgroundClassName = "hero";
            }

            let progressClassName = "";
            if (stone.grade === "고대") {
                progressClassName = "mythic";
            } else if (stone.grade === "유물") {
                progressClassName = "relics";
            }


            element.innerHTML = `
                <div class="img-box radius ${backgroundClassName}-background">
                    <img src="${stone.icon}" alt="">
                    <span class="tier">T${stone.tier}</span>
                    <span class="progress ${progressClassName}-progressbar">${stone.grade}</span>
                </div>

                <div class="option-box">
                    <span class="option">${stone.name}</span>

                    <div class="buff-wrap">
                        ${buff}
                    </div>

                </div>`
        }

    }
    stoneItemCreate()

    /* **********************************************************************************************************************
    * function name		:	bangleItemCreate
    * description       : 	bangle-item html을 생성함
    *********************************************************************************************************************** */
    function bangleItemCreate() {
        let element = document.querySelectorAll(".group-equip .accessory-area .accessory-item")[6];
        let bangle = extractValue.htmlObj.bangleInfo;
        if (bangle) {

            let backgroundClassName = "";
            if (bangle.grade === "고대") {
                backgroundClassName = "ultra";
            } else if (bangle.grade === "유물") {
                backgroundClassName = "rare";
            } else if (bangle.grade === "영웅") {
                backgroundClassName = "hero";
            }

            let progressClassName = "";
            if (bangle.grade === "고대") {
                progressClassName = "mythic";
            } else if (bangle.grade === "유물") {
                progressClassName = "relics";
            }

            let optionWrap = "";
            if (bangle.specialStatsArray.length !== 0) {
                let option = "";
                bangle.specialStatsArray.forEach(item => {
                    option += `<span class="option">${item.trim()}</span>`
                })
                optionWrap = `
                    <div class="option-wrap">
                        ${option}
                    </div>`
            }

            let grindingWrap = "";
            if (bangle.optionArray.length !== 0) {
                bangle.optionArray.forEach(item => {
                    let grade = "";
                    if (item.grade === "상") {
                        grade = "high";
                    } else if (item.grade === "중") {
                        grade = "middle";
                    } else if (item.grade === "하") {
                        grade = "low";
                    }
                    grindingWrap += `
                        <div class="grinding-wrap">
                            <span class="quality ${grade}">${item.grade}</span>
                            <span class="option">${item.name}</span>
                        </div>`
                })
            }
            if (bangle.normalStatsArray.length !== 0) {
                bangle.normalStatsArray.forEach(item => {
                    let gradeClassName = "";
                    let gradeName = "";
                    let value = Number(item.match(/\d+/)[0]);
                    if (/힘|민첩|지능/.test(item)) {
                        if (bangle.tier == 3 && bangle.grade === "유물") {
                            if (value >= 1500 && value <= 2500) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 2501 && value <= 3250) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 3251 && value <= 4000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 3 && bangle.grade === "고대") {
                            if (value >= 2500 && value <= 3500) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 3501 && value <= 4250) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 4251 && value <= 5000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 4 && bangle.grade === "유물") {
                            if (value >= 6400 && value <= 8960) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 8961 && value <= 10880) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 10881 && value <= 12800) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 4 && bangle.grade === "고대") {
                            if (value >= 9600 && value <= 12160) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 12161 && value <= 14080) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 14081 && value <= 16000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        }

                    } else if (/체력/.test(item)) {
                        if (bangle.tier == 3 && bangle.grade === "유물") {
                            if (value >= 500 && value <= 1500) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 1501 && value <= 2250) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 2251 && value <= 3000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 3 && bangle.grade === "고대") {
                            if (value >= 1500 && value <= 2500) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 2501 && value <= 3250) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 3251 && value <= 4000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 4 && bangle.grade === "유물") {
                            if (value >= 3000 && value <= 3800) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 3801 && value <= 4400) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 4401 && value <= 5000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        } else if (bangle.tier == 4 && bangle.grade === "고대") {
                            if (value >= 4000 && value <= 4800) {
                                gradeClassName = "low";
                                gradeName = "하";
                            } else if (value >= 4801 && value <= 5400) {
                                gradeClassName = "middle";
                                gradeName = "중";
                            } else if (value >= 5401 && value <= 6000) {
                                gradeClassName = "high";
                                gradeName = "상";
                            }
                        }
                    }
                    grindingWrap += `
                        <div class="grinding-wrap">
                            <span class="quality ${gradeClassName}">${gradeName}</span>
                            <span class="option">${item.trim()}</span>
                        </div>`
                })
            }
            element.innerHTML = `
                <div class="img-box radius ${backgroundClassName}-background">
                    <img src="${bangle.icon}" alt="">
                    <span class="tier">T${bangle.tier}</span>
                    <span class="progress ${progressClassName}-progressbar">${bangle.grade}</span>
                </div>
                <div class="option-box">
                    ${optionWrap}
                    <div class="text-box">
                        ${grindingWrap}
                    </div>

                </div>`
        }
    }
    bangleItemCreate();

    /* **********************************************************************************************************************
    * function name		:	arkAreaCreate
    * description       : 	ark-area html을 생성함
    *********************************************************************************************************************** */
    function arkAreaCreate() {
        let elements = document.querySelector(".sc-info .group-equip .ark-area");
        let evolutionElement = elements.querySelector(".ark-list.evolution");
        let enlightenmentElement = elements.querySelector(".ark-list.enlightenment");
        let leapElement = elements.querySelector(".ark-list.leap");

        let evolutionPoint = data.ArkPassive.Points[0].Value;
        let enlightenmentPoint = data.ArkPassive.Points[1].Value;
        let leapPoint = data.ArkPassive.Points[2].Value;

        let arkItemEvolution = `
        <div class="title-box evolution">
            <span class="tag">진화</span>
            <span class="title">${evolutionPoint}</span>
        </div>`;
        let arkItemEnlightenment = `
        <div class="title-box enlightenment">
            <span class="tag">깨달음</span>
            <span class="title">${enlightenmentPoint}</span>
        </div>`;
        let arkItemLeap = `
        <div class="title-box leap">
            <span class="tag">도약</span>
            <span class="title">${leapPoint}</span>
        </div>`;
        data.ArkPassive.Effects.forEach(arkData => {
            let betweenText = arkData.Description.match(/>([^<]+)</g)?.map(match => match.slice(1, -1)) || [];

            let tier = betweenText[1].match(/\d+/)[0];
            let arkItem =
                `<li class="ark-item">
                    <div class="img-box">
                        <span class="tier">${tier}</span>
                        <img src="${arkData.Icon}" alt="">
                    </div>
                    <div class="text-box">
                        <span class="name">${betweenText[2].trim()}</span>
                    </div>
                </li>`
            if (arkData.Name === "진화") {
                arkItemEvolution += arkItem;
            } else if (arkData.Name === "깨달음") {
                arkItemEnlightenment += arkItem;
            } else if (arkData.Name === "도약") {
                arkItemLeap += arkItem;
            }
        })
        evolutionElement.innerHTML = arkItemEvolution;
        enlightenmentElement.innerHTML = arkItemEnlightenment;
        leapElement.innerHTML = arkItemLeap;
    }
    arkAreaCreate();

    /* **********************************************************************************************************************
    * function name		:	engravingAreaCreate
    * description       : 	engraving-area html을 생성함
    *********************************************************************************************************************** */
    function engravingAreaCreate() {
        let element = document.querySelector(".sc-info .group-system .engraving-area");
        if (extractValue.htmlObj.engravingInfo.length !== 0) {
            let engravingBox = "";
            extractValue.htmlObj.engravingInfo.forEach(engraving => {
                let gradeIconClassName = "";
                if (engraving.grade === "유물") {
                    gradeIconClassName = "orange"
                } else if (engraving.grade === "고대") {
                    gradeIconClassName = "yellow"
                } else if (engraving.grade === "영웅") {
                    gradeIconClassName = "puple"
                }
                let abilityStone = "";
                if (engraving.stone) {
                    abilityStone += `
                    <div class="ability-ico engraving-ico"></div>
                    <span class="ability-level">LV.${engraving.stone}</span>`;
                } else if (engraving.stone <= -1) {
                    abilityStone += `
                        <div class="ability-ico engraving-ico red"></div>
                        <span class="ability-level">LV.-${engraving.stone}</span>`;
                }
                engravingBox += `
                <div class="engraving-box">
                    <img src="${engraving.icon}" class="engraving-img" alt="">
                    <div class="relic-ico engraving-ico ${gradeIconClassName}"></div>
                    <span class="grade orange">X ${engraving.level}</span>
                    <span class="engraving-name">${engraving.name}</span>
                    ${abilityStone}
                    </div>`;
            })
            element.innerHTML = engravingBox;
        }
    }
    engravingAreaCreate();

    /* **********************************************************************************************************************
    * function name		:	karmaAreaCreate
    * description       : 	karma-area 상세정보의 내용을 생성함
    *********************************************************************************************************************** */
    function karmaAreaCreate() {
        let element = document.querySelector(".sc-info .group-system .karma-area .karma");
        let rank = extractValue.etcObj.evolutionkarmaRank;
        let level = extractValue.etcObj.evolutionkarmaPoint;

        element.innerHTML = `<em style="color:#f00;font-weight:600;">${rank}</em>랭크`;
    }
    karmaAreaCreate();
    /* **********************************************************************************************************************
    * function name		:	detailAreaCreate()
    * description       : 	detail-area 상세정보의 내용을 생성함
    *********************************************************************************************************************** */
    async function detailAreaCreate() {
        let element = document.querySelector(".sc-info .group-info .detail-area");
        //console.log(userDbInfo)


        function infoWrap(tag, array) {
            let mobilePos = "";
            if (mobileCheck) {
                mobilePos = "top:initial;bottom:95%;left:-50px;";
            }
            let infoBox = array.map(object => {
                return `
                    <div class="info-box">
                        <span class="text">
                            <i class="icon ${object.icon}"></i>
                            ${object.name}
                            ${object.question ?
                        `<div class="question" style="margin-left:5px;">
                            <span class="detail" style="${mobilePos};width:200px;white-space:wrap;">${object.question}</span>
                        </div>` : ""}
                        </span>
                        <span class="text">${object.value}</span>
                    </div>`;
            });
            return `
                <div class="info-wrap">
                    <span class="tag">${tag}</span>
                    ${infoBox.join('')}
                </div>`;
        }
        function todayFormattedDate() {
            const today = new Date();
            const year = String(today.getFullYear()).slice(-2); // 년도의 마지막 두 자리
            const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1), 두 자리로 만들기
            const day = String(today.getDate()).padStart(2, '0'); // 일, 두 자리로 만들기

            return `${year}.${month}.${day}`;
        }
        function formatDate(dateString) {
            // 입력된 날짜 문자열의 형식을 검증합니다.
            if (!/^\d{14}$/.test(dateString)) {
                return '잘못된 날짜 형식입니다.';
            }

            // 문자열에서 년, 월, 일을 추출합니다.
            const year = dateString.substring(2, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);

            // 'YY.MM.DD' 형식의 문자열을 생성합니다.
            return `${year}.${month}.${day}`;
        }
        let itemLevel = Number(data.ArmoryProfile.ItemAvgLevel.replace(",", ""));
        let dealerMedianValue = 0;
        // console.log(itemLevel)
        if (itemLevel >= 1660 && itemLevel < 1665) {
            dealerMedianValue = 847.84;
        } else if (itemLevel >= 1665 && itemLevel < 1670) {
            dealerMedianValue = 926.64;
        } else if (itemLevel >= 1670 && itemLevel < 1675) {
            dealerMedianValue = 965.69;
        } else if (itemLevel >= 1675 && itemLevel < 1680) {
            dealerMedianValue = 985.01;
        } else if (itemLevel >= 1680 && itemLevel < 1685) {
            dealerMedianValue = 1307.2;
        } else if (itemLevel >= 1685 && itemLevel < 1690) {
            dealerMedianValue = 1511.65;
        } else if (itemLevel >= 1690 && itemLevel < 1695) {
            dealerMedianValue = 1575.72;
        } else if (itemLevel >= 1695 && itemLevel < 1700) {
            dealerMedianValue = 1644.27;
        } else if (itemLevel >= 1700 && itemLevel < 1705) {
            dealerMedianValue = 1745.77;
        } else if (itemLevel >= 1705 && itemLevel < 1710) {
            dealerMedianValue = 1882.61;
        } else if (itemLevel >= 1710 && itemLevel < 1715) {
            dealerMedianValue = 1966.17;
        } else if (itemLevel >= 1715 && itemLevel < 1720) {
            dealerMedianValue = 2028.52;
        } else if (itemLevel >= 1720 && itemLevel < 1725) {
            dealerMedianValue = 2177.96;
        } else if (itemLevel >= 1725 && itemLevel < 1730) {
            dealerMedianValue = 2297.06;
        } else if (itemLevel >= 1730 && itemLevel < 1735) {
            dealerMedianValue = 2420.02;
        } else if (itemLevel >= 1735 && itemLevel < 1740) {
            dealerMedianValue = 2557.86;
        } else if (itemLevel >= 1740 && itemLevel < 1745) {
            dealerMedianValue = 2734.59;
        } else if (itemLevel >= 1745 && itemLevel < 1750) {
            dealerMedianValue = 2864.79;
        } else if (itemLevel >= 1750) {
            dealerMedianValue = 3209.7;
        }

        let supportMedianValue = 0;
        // console.log(itemLevel)
        if (itemLevel >= 1660 && itemLevel < 1665) {
            supportMedianValue = 459.98;
        } else if (itemLevel >= 1665 && itemLevel < 1670) {
            supportMedianValue = 501.64;
        } else if (itemLevel >= 1670 && itemLevel < 1675) {
            supportMedianValue = 525.09;
        } else if (itemLevel >= 1675 && itemLevel < 1680) {
            supportMedianValue = 531.38;
        } else if (itemLevel >= 1680 && itemLevel < 1685) {
            supportMedianValue = 646.38;
        } else if (itemLevel >= 1685 && itemLevel < 1690) {
            supportMedianValue = 720.37;
        } else if (itemLevel >= 1690 && itemLevel < 1695) {
            supportMedianValue = 731.09;
        } else if (itemLevel >= 1695 && itemLevel < 1700) {
            supportMedianValue = 773.57;
        } else if (itemLevel >= 1700 && itemLevel < 1705) {
            supportMedianValue = 810.95;
        } else if (itemLevel >= 1705 && itemLevel < 1710) {
            supportMedianValue = 888.4;
        } else if (itemLevel >= 1710 && itemLevel < 1715) {
            supportMedianValue = 939.47;
        } else if (itemLevel >= 1715 && itemLevel < 1720) {
            supportMedianValue = 963.41;
        } else if (itemLevel >= 1720 && itemLevel < 1725) {
            supportMedianValue = 1072.64;
        } else if (itemLevel >= 1725 && itemLevel < 1730) {
            supportMedianValue = 1231.56;
        } else if (itemLevel >= 1730 && itemLevel < 1735) {
            supportMedianValue = 1315.02;
        } else if (itemLevel >= 1735 && itemLevel < 1740) {
            supportMedianValue = 1385.11;
        } else if (itemLevel >= 1740 && itemLevel < 1745) {
            supportMedianValue = 1446.71;
        } else if (itemLevel >= 1745 && itemLevel < 1750) {
            supportMedianValue = 1485.05;
        } else if (itemLevel >= 1750) {
            supportMedianValue = 1609.04;
        }

        let medianDifferencePercent = (specPoint.completeSpecPoint - 459.98) / 459.98 * 100;
        let dealerSupportConversion = 0;
        // 0보다 낮으면 다른 계산
        if (medianDifferencePercent > 0) {
            dealerSupportConversion = 847.84 * (1 + medianDifferencePercent / 100);
        } else {
            dealerSupportConversion = 847.84 * (1 + (medianDifferencePercent / 100));
        }
        


        let specPointInfo = [
            { name: "달성 최고 점수", value: userDbInfo.data.characterBest ? Math.max(userDbInfo.data.characterBest.LCHB_TOTALSUM, specPoint.completeSpecPoint).toFixed(2) : specPoint.completeSpecPoint.toFixed(2), icon: "medal-solid" },
            { name: "현재 레벨 중앙값", value: dealerMedianValue, icon: "chart-simple-solid" },
            { name: "최고 점수 달성일", value: userDbInfo.data.characterBest ? formatDate(userDbInfo.data.characterBest.LCHB_ACHIEVE_DATE) : todayFormattedDate(), icon: "calendar-check-solid" },
        ]
        let armorInfo = [
            { name: "공격력", value: Number(specPoint.dealerAttackPowResult).toFixed(0), icon: "bolt-solid" },
            { name: "엘릭서", value: Number(specPoint.dealerExlixirValue).toFixed(2) + "%", icon: "flask-solid" },
            { name: "초월", value: Number(specPoint.dealerHyperValue).toFixed(2) + "%", icon: "star-solid" },
            { name: "각인", value: Number(specPoint.dealerEngResult).toFixed(2) + "%", icon: "book-solid" },
            { name: "팔찌", value: Number(specPoint.dealerBangleResult).toFixed(2) + "%", icon: "ring-solid" },
        ]
        let arkPassiveInfo = [
            { name: "진화", value: Number(specPoint.dealerEvloutionResult).toFixed(0) + "%", icon: "fire-solid" },
            { name: "깨달음", value: Number(specPoint.dealerEnlightResult).toFixed(0) + "%", icon: "lightbulb-solid" },
            { name: "도약", value: Number(specPoint.dealerLeapResult).toFixed(0) + "%", icon: "feather-pointed-solid" },
        ]
        let gemInfo;
        if (extractValue.etcObj.gemCheckFnc.originGemValue === 0) {
            gemInfo = [
                { name: "보석 실질 딜증", value: Number((extractValue.etcObj.gemCheckFnc.etcAverageValue - 1) * 100).toFixed(2) + "%", icon: "gem-solid", question: "보석을 통해 얻은 스킬 대미지 증가량" },
                { name: "보석 최종 딜증", value: Number((extractValue.etcObj.gemCheckFnc.etcAverageValue - 1) * 100).toFixed(2) + "%", icon: "gem-solid", question: "보석 순수 딜증 x 보정치로 인한 최종 딜증값으로, 스펙포인트에 적용되는 값" },
                { name: "보석 쿨감", value: Number(extractValue.etcObj.gemsCoolAvg).toFixed(2) + "%", icon: "gem-solid", question: "보석 평균 쿨감 수치" },
                { name: "보석 보정치", value: Number(extractValue.etcObj.gemCheckFnc.specialSkill).toFixed(2), icon: "gem-solid", question: "보석에 포함되지 않는 스킬 및 효과를 보정하기 위한 계수. 직각 별로 고정값이며, 소수점 두 번째 자리까지만 표시" },
            ]
        } else {
            gemInfo = [
                { name: "보석 실질 딜증", value: Number(extractValue.etcObj.gemCheckFnc.originGemValue).toFixed(2) + "%", icon: "gem-solid", question: "보석을 통해 얻은 스킬 대미지 증가량" },
                { name: "보석 최종 딜증", value: Number((extractValue.etcObj.gemCheckFnc.gemValue - 1) * 100).toFixed(2) + "%", icon: "gem-solid", question: "보석 순수 딜증 x 보정치로 인한 최종 딜증값으로, 스펙포인트에 적용되는 값" },
                { name: "보석 쿨감", value: Number(extractValue.etcObj.gemsCoolAvg).toFixed(2) + "%", icon: "gem-solid", question: "보석 평균 쿨감 수치" },
                { name: "보석 보정치", value: Number(extractValue.etcObj.gemCheckFnc.specialSkill).toFixed(2), icon: "gem-solid", question: "보석에 포함되지 않는 스킬 및 효과를 보정하기 위한 계수. 직각 별로 고정값이며, 소수점 두 번째 자리까지만 표시" },
            ]
        }

        let supportSpecPointInfo = [
            { name: "달성 최고 점수", value: userDbInfo.data.characterBest ? Math.max(userDbInfo.data.characterBest.LCHB_TOTALSUMSUPPORT, specPoint.completeSpecPoint).toFixed(2) : specPoint.completeSpecPoint.toFixed(2), icon: "medal-solid" },
            { name: "현재 레벨 중앙값", value: supportMedianValue, icon: "chart-simple-solid" },
            { name: "딜러 환산 점수", value: dealerSupportConversion.toFixed(2), icon: "arrows-left-right-to-line-solid" },
            { name: "최고 점수 달성일", value: userDbInfo.data.characterBest ? formatDate(userDbInfo.data.characterBest.LCHB_ACHIEVE_DATE) : todayFormattedDate(), icon: "calendar-check-solid" },
        ]
        let supportBuffInfo = [
            { name: "상시버프", value: Number(specPoint.supportAllTimeBuff).toFixed(2) + "%", icon: "arrows-rotate-solid" },
            { name: "풀버프", value: Number(specPoint.supportFullBuff).toFixed(2) + "%", icon: "wand-magic-sparkles-solid" },
            { name: "낙인력", value: Number(specPoint.supportStigmaResult).toFixed(1) + "%", icon: "bullseye-solid" },
            { name: "팔찌", value: Number(specPoint.supportBangleResult).toFixed(2) + "%", icon: "ring-solid" },
        ]
        let supportEffectInfo = [
            { name: "특성", value: specPoint.supportTotalStatus, icon: "person-solid" },
            { name: "케어력", value: Number(specPoint.supportCarePowerResult).toFixed(2) + "%", icon: "shield-halved-solid" },
            { name: "각인 보너스", value: Number(specPoint.supportEngBonus).toFixed(2) + "%", icon: "book-solid" },
            { name: "쿨타임 감소", value: specPoint.supportgemsCoolAvg + "%", icon: "gem-solid" },
        ]

        let result = "";
        if (mobileCheck) {
            result = `
                <div class="title-box">
                    <span class="title">상세정보</span>
                </div>
                <span class="button" onclick="document.querySelector('.sc-info .detail-area').classList.toggle('on');"></span>`;
        }
        // extractValue.etcObj.supportCheck !== "서폿"
        if (!/서폿|회귀|심판자|진실된 용맹/.test(extractValue.etcObj.supportCheck)) {
            result += infoWrap("점수 통계", specPointInfo);
            result += infoWrap("장비 효과", armorInfo);
            result += infoWrap("아크패시브", arkPassiveInfo);
            result += infoWrap("보석 효과", gemInfo);
        } else {
            result += infoWrap("점수 통계", supportSpecPointInfo);
            result += infoWrap("버프 정보", supportBuffInfo);
            result += infoWrap("추가 효과", supportEffectInfo);
        }
        element.innerHTML = result;
    }
    detailAreaCreate()
    /* **********************************************************************************************************************
    * function name		:	dataBaseWrite
    * description       : 	유저정보를 db로 보내 저장하게 함
    * useDevice         :   모두사용
    *********************************************************************************************************************** */
    async function dataBaseWrite() {
        await Modules.userDataWriteDeviceLog.insertLopecSearch(nameParam);
        await Modules.userDataWriteDetailInfo.insertLopecCharacters(
            nameParam,                                                                      // 닉네임 
            data.ArmoryProfile.CharacterLevel,                                              // 캐릭터 레벨 
            extractValue.etcObj.supportCheck + " " + data.ArmoryProfile.CharacterClassName, // 직업 풀네임 
            "IMGURL",                                                                       // 프로필 이미지 
            data.ArmoryProfile.ServerName,                                                  // 서버 
            parseFloat(data.ArmoryProfile.ItemMaxLevel.replace(/,/g, '')),                  // 아이템 레벨 
            data.ArmoryProfile.GuildName,                                                   // 길드 
            data.ArmoryProfile.Title,                                                       // 칭호 
            specPoint.dealerlastFinalValue,                                                 // 딜러 통합 스펙포인트 
            specPoint.supportSpecPoint,                                                     // 서폿 통합 스펙포인트 
            specPoint.supportAllTimeBuff,                                                   // 상시버프 
            specPoint.supportFullBuff,                                                      // 풀버프 
            null,                                                                           // 진화 카르마 랭크                  
            "2.0"                                                                           // 현재 버전 
        );
    }
    if (/lopec.kr/.test(window.location.host)) {
        setTimeout(async () => { await dataBaseWrite() }, 0);
    }

}
mainSearchFunction()