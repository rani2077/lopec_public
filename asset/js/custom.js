// spec-point.js html코드
// import { getCharacterProfile, searchHtml } from '/asset/js/spec-point.js'

/* **********************************************************************************************************************
 * function name		:	importModuleManager()
 * description			: 	사용하는 모든 외부 module파일 import
 *********************************************************************************************************************** */
async function importModuleManager() {
    let modules = await Promise.all([
        import("../custom-module/fetchApi.js" + `?${(new Date).getTime()}`),     // lostark api호출
        import("../filter/filter.js" + `?${(new Date).getTime()}`),              // 기존 filter.js
        import("../custom-module/trans-value.js" + `?${(new Date).getTime()}`),  // 유저정보 수치화
        import("../custom-module/calculator.js" + `?${(new Date).getTime()}`),   // 수치값을 스펙포인트로 계산
        import("../custom-module/component.js" + `?${(new Date).getTime()}`),    // 컴포넌트 모듈
    ])
    let moduleObj = {
        fetchApi: modules[0],
        originFilter: modules[1],
        transValue: modules[2],
        calcValue: modules[3],
        component: modules[4],
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
    let extractValue = await Modules.transValue.getCharacterProfile(data);
    await Modules.fetchApi.clearLostarkApiCache(nameParam, document.querySelector(".sc-info .spec-area span.reset"));


    let specPoint = await Modules.calcValue.specPointCalc(extractValue);
    // console.log("data", data)
    console.log("오리진obj", extractValue)
    console.log("specPoint", specPoint)
    // console.log("specPoint", specPoint.completeSpecPoint)


    /* **********************************************************************************************************************
    * function name		:	
    * description       : 	user정보가 로딩완료 시 scProfile을 재생성함
    *********************************************************************************************************************** */
    document.querySelector(".sc-profile").outerHTML = await component.scProfile(data, extractValue);

    /* **********************************************************************************************************************
    * function name		:	specAreaCreate
    * description       : 	spec-area html을 생성함
    *********************************************************************************************************************** */
    function specAreaCreate() {
        let specAreaElement = document.querySelector(".sc-info .group-info .spec-area");
        let nowSpecElement = specAreaElement.querySelector(".spec-point");
        let bestSpecElement = specAreaElement.querySelector(".best-box .desc");
        let tierImageElement = specAreaElement.querySelector(".tier-box > img");


        nowSpecElement.innerHTML = (specPoint.completeSpecPoint).toFixed(2);
        nowSpecElement.innerHTML = (specPoint.completeSpecPoint).toFixed(2).replace(/\.(\d{2})$/, ".<i style='font-size:20px'>$1</i>");
        //nowSpecElement.innerHTML = "2000.<i style='font-size:20px'>99</i>";
        bestSpecElement.textContent = "달성 최고 점수 - 준비중";
        tierImageElement.setAttribute("src", "/asset/image/gold.png");

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
                    <span class="detail">${gemItem.skill} <br> 딜 지분 : ${gemItem.skillPer !== "none" ? `${(gemItem.skillPer * 100).toFixed(0)}%` : "데이터 없음"}</span>
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
                        <span class="armor-name">${item.name} ${advancedLevel}</span>
                    </div>
                    ${elixirWrap}
                    ${hyperWrap}
                </div>
            </li>`

            if (item.type === "투구") {
                helmetElement.outerHTML = armorItem;
            } else if (item.type === "상의") {
                shoulderElement.outerHTML = armorItem;

            } else if (item.type === "하의") {
                topElement.outerHTML = armorItem;

            } else if (item.type === "어깨") {
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
    * function name		:	engravingAreaCreate
    * description       : 	engraving-area html을 생성함
    *********************************************************************************************************************** */


}
mainSearchFunction()