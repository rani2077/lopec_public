let cachedData = null;

async function simulatorInputCalc() {
    let module = await Promise.all([
        import("../custom-module/fetchApi.js"),      // fetchApi
        import("../custom-module/trans-value.js"),   // transValue
        import("../custom-module/calculator.js"),    // calcValue
        import("../custom-module/calc-module.js"),   // calcModule
        import("../filter/simulator-data.js")        // simulatorData

    ])


    let [fetchApi, transValue, calcValue, calcModule, simulatorData] = module

    if (!cachedData) {
        cachedData = await fetchApi.lostarkApiCall("청염각");
        console.log(cachedData)
        await selectCreate(cachedData)

    }
    let extractValue = await transValue.getCharacterProfile(cachedData)



    /* **********************************************************************************************************************
     * function name		:	engOutputCalc
     * description			: 	각인 계산값
     *********************************************************************************************************************** */

    let engObjList = await calcModule.engExtract()
    let simulatorEngObj = await calcModule.engOutputCalc(engObjList)




    // console.log(engObjList)
    // console.log(simulatorEngObj)

    /* **********************************************************************************************************************
     * function name		:	armoryLevelCalc()
     * description			: 	사용자가 선택한 장비 level stat special 객체 반환
     *********************************************************************************************************************** */

    function armoryLevelCalc() {
        let result = []
        let armorNameElements = document.querySelectorAll(".armor-item .armor-tag");
        let startLevelElements = document.querySelectorAll(".armor-item .plus");
        let normaleUpgradeLevelElements = document.querySelectorAll(".armor-item .armor-name");
        let advancedUpgradeLevelElements = document.querySelectorAll(".armor-item .armor-upgrade");

        for (let i = 0; i < armorNameElements.length; i++) {
            let startLevelValue = Number(startLevelElements[i].value)
            let normaleUpgradeLevelValue = Number(normaleUpgradeLevelElements[i].value * 5)
            let advancedUpgradeLevelValue = Number(advancedUpgradeLevelElements[i].value)
            let obj = {
                name: armorNameElements[i].textContent,
                level: startLevelValue + normaleUpgradeLevelValue + advancedUpgradeLevelValue,
                special: advancedUpgradeLevelValue
            }
            result.push(obj)
        }

        // console.log(result)

        let armorObj = []

        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 투구
        // armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 어깨
        // armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 상의
        // armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 하의
        // armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 장갑
        // armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 무기

        function armorPartObjCreate(armorData, resultObj) {
            let obj = armorData.find(part => part.level == resultObj);
            obj.special = result[0].special;
            obj.name = result[0].name;
            armorObj.push(obj)

        }
        // console.log(armorObj)

        return armorObj
    }
    console.log(armoryLevelCalc())
    /* **********************************************************************************************************************
    * function name         :	armorElixirToObj()
    * description			: 	장비 엘릭서 스텟 수치를 추출함
    *********************************************************************************************************************** */

    function armorElixirToObj() {
        let arr = []
        let result
        let elements = document.querySelectorAll(".armor-item .elixir");

        elements.forEach(element => {
            let key = element.value.split(":")[0]
            let value = element.value.split(":")[1]
            let level = Number(element.value.split(":")[2])
            let text = element.options[element.selectedIndex].textContent.replace(/Lv.\d+/g, "").trim();
            let obj = {}
            if (key && value) { // key와 value가 존재할 경우만 수행
                obj[key] = Number(value); // obj 객체에 key 속성에 value 값을 할당, value는 숫자로 변환
                obj.level = level;
                obj.name = `${text}`;
            }
            arr.push(obj); // arr 배열에 obj를 추가

        })
        // 객체들을 키별로 그룹화
        const grouped = {};
        arr.forEach(obj => {
            for (const key in obj) {
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(obj[key]);
            }
        });

        // 그룹화된 데이터를 바탕으로 새로운 객체 생성
        const combinedObj = {};
        for (const key in grouped) {
            if (key === "finalDamagePer") {
                // finalDamagePer는 곱셈
                combinedObj[key] = grouped[key].reduce((acc, val) => acc * val, 1);
            } else {
                // 기타 스텟은 덧셈
                combinedObj[key] = grouped[key].reduce((acc, val) => acc + val, 0);
            }
        }

        const elixirNames = arr.map(item => item.name);

        const group1 = ["회심", "달인", "선봉대"];
        const group2 = ["강맹", "칼날방패", "행운"];
        const group3 = ["선각자", "신념"];
        const group4 = ["진군"];

        let group1Count = 0;
        let group2Count = 0;
        let group3Count = 0;
        let group4Count = 0;

        elixirNames.forEach(name => {
            if (group1.includes(name)) {
                group1Count++;
            }
            if (group2.includes(name)) {
                group2Count++;
            }
            if (group3.includes(name)) {
                group3Count++;
            }
            if (group4.includes(name)) {
                group4Count++;
            }
        });

        // console.log("----------------엘릭서 확인------------------");

        if (group1Count >= 2 && combinedObj.level >= 40) {
            console.log("회심, 달인, 선봉대 중 2개 이상 존재합니다. 레벨 40 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.12
        } else if (group1Count >= 2 && combinedObj.level >= 35) {
            console.log("회심, 달인, 선봉대 중 2개 이상 존재합니다. 레벨 35 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.06
        }
        if (group2Count >= 2 && combinedObj.level >= 40) {
            console.log("강맹, 칼날방패, 행운 중 2개 이상 존재합니다. 레벨 40 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.08
        } else if (group2Count >= 2 && combinedObj.level >= 35) {
            console.log("강맹, 칼날방패, 행운 중 2개 이상 존재합니다. 레벨 35 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.04
        }

        if (group3Count >= 2 && combinedObj.level >= 40) {
            console.log("선각자, 신념 이 모두 존재합니다. 레벨 40 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 14
        } else if (group3Count >= 2 && combinedObj.level >= 35) {
            console.log("선각자, 신념 이 모두 존재합니다. 레벨 35 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 8
        }

        if (group4Count >= 1 && combinedObj.level >= 40) {
            console.log("진군 존재합니다. 레벨 40 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 6
        } else if (group4Count >= 1 && combinedObj.level >= 35) {
            console.log("진군 존재합니다. 레벨 35 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 0
        }


        // 결과 확인
        // console.log("그룹화된 데이터:", grouped);
        // console.log("병합된 객체:", combinedObj);
        result = combinedObj
        return result
    }
    armorElixirToObj()
    // console.log(armorElixirToObj())


    /* **********************************************************************************************************************
     * function name		:	extractHyperStageValue
     * description			: 	초월 N성 N단계 추출 후 계산 모듈에 넣기
     *********************************************************************************************************************** */

    function extractHyperStageValue() {
        let result
        let elementLevels = document.querySelectorAll(".hyper-wrap select.level");
        let elementHypers = document.querySelectorAll(".hyper-wrap select.hyper");
        let totalHyper = 0;

        let helmetHyper = elementHypers[0].value;
        let shoulderHyper = elementHypers[1].value;
        let armorHyper = elementHypers[2].value;
        let pantsHyper = elementHypers[3].value;
        let gloveHyper = elementHypers[4].value;
        let weaponHyper = elementHypers[5].value;

        let helmetLevel = elementLevels[0].value;
        let shoulderLevel = elementLevels[1].value;
        let armorLevel = elementLevels[2].value;
        let pantsLevel = elementLevels[3].value;
        let gloveLevel = elementLevels[4].value;
        let weaponLevel = elementLevels[5].value;

        let obj = {
            atkPlus: 0,
            weaponAtkPlus: 0,
            atkBuff: 0,
            stigmaPer: 0,
            stats: 0,
            finalDamagePer: 1,
        }

        elementLevels.forEach((level, idx) => {
            if (idx !== 5) {
                obj.stats += 560 * Number(level.value) + 40 * (Number(level.value) ** 2)
            } else {
                obj.weaponAtkPlus += 280 * Number(level.value) + 20 * (Number(level.value) ** 2)
            }
        })
        elementHypers.forEach(hyper => {
            totalHyper += Number(hyper.value);
        })
        // 투구 초월 별 개수에 따른 버프 계산 (helmetHyper)
        if (helmetHyper >= 20) {
            obj.atkBuff += totalHyper * 0.04
            obj.stats += totalHyper * 55;
            obj.weaponAtkPlus += totalHyper * 14;
            obj.atkPlus += totalHyper * 6;
        } else if (helmetHyper >= 15) {
            obj.atkBuff += totalHyper * 0.03;
            obj.stats += totalHyper * 55;
            obj.weaponAtkPlus += totalHyper * 14;
        } else if (helmetHyper >= 10) {
            obj.atkBuff += totalHyper * 0.02;
            obj.stats += totalHyper * 55;
        } else if (helmetHyper >= 5) {
            obj.atkBuff += totalHyper * 0.01;
        }

        // 어깨
        if (shoulderHyper >= 20) {
            obj.atkBuff += 3
            obj.weaponAtkPlus += 3600
        } else if (shoulderHyper >= 15) {
            obj.atkBuff += 2
            obj.weaponAtkPlus += 2400
        } else if (shoulderHyper >= 10) {
            obj.atkBuff += 1
            obj.weaponAtkPlus += 1200
        } else if (shoulderHyper >= 5) {
            obj.atkBuff += 1
            obj.weaponAtkPlus += 1200
        }

        // 상의
        if (armorHyper >= 20) {
            obj.weaponAtkPlus += 7200
        } else if (armorHyper >= 15) {
            obj.weaponAtkPlus += 4000
        } else if (armorHyper >= 10) {
            obj.weaponAtkPlus += 2000
        } else if (armorHyper >= 5) {
            obj.weaponAtkPlus += 2000
        }

        // 하의
        if (pantsHyper >= 20) {
            obj.atkBuff += 6
            obj.finalDamagePer *= (1.5 / 100) + 1
        } else if (pantsHyper >= 15) {
            obj.atkBuff += 3
        } else if (pantsHyper >= 10) {
            obj.atkBuff += 1.5
        }

        // 장갑
        if (gloveHyper >= 20) {
            obj.stats += 12600
            obj.atkBuff += 3
        } else if (gloveHyper >= 15) {
            obj.stats += 8400
            obj.atkBuff += 2
        } else if (gloveHyper >= 10) {
            obj.stats += 4200
            obj.atkBuff += 1
        } else if (gloveHyper >= 5) {
            obj.stats += 4200
            obj.atkBuff += 1
        }

        // 무기
        if (weaponHyper >= 20) {
            obj.atkPlus += 3525
            obj.stigmaPer += 8
            obj.atkBuff += 2
        } else if (weaponHyper >= 15) {
            obj.atkPlus += 2400
            obj.stigmaPer += 4
            obj.atkBuff += 2
        } else if (weaponHyper >= 10) {
            obj.atkPlus += 1600
            obj.stigmaPer += 2
            obj.atkBuff += 2
        } else if (weaponHyper >= 5) {
            obj.atkPlus += 800
            obj.stigmaPer += 2
        }

        console.log(obj)
        return result = obj;
    }
    extractHyperStageValue()

    /* **********************************************************************************************************************
     * function name		:	defaultObjAddDamgerPerEdit
     * description			: 	defaultObj.addDamagePer의 값을 수정하는 함수
     *********************************************************************************************************************** */
    // defaultObj.addDamagePer = 10 + 0.002 * (quality) ** 2
    // console.log(extractValue.defaultObj.addDamagePer)

    function defaultObjAddDamgerPerEdit() {
        let element = document.querySelector(".armor-item select.progress");
        let quality = Number(element.value)
        extractValue.defaultObj.addDamagePer = 10 + 0.002 * (quality) ** 2
    }
    defaultObjAddDamgerPerEdit()
    // console.log(extractValue.defaultObj.addDamagePer)

    /* **********************************************************************************************************************
     * function name		:	specPointCalc
     * description			: 	최종 스펙포인트 계산식
     *********************************************************************************************************************** */

    let originSpecPoint = await calcValue.specPointCalc(extractValue)

}
simulatorInputCalc()
document.body.addEventListener('change', () => { simulatorInputCalc() })


/**
 * 아이템 레벨에 따른 스탯 값을 계산하는 함수
 * @param {number} itemLevel - 아이템 레벨
 * @returns {number} - 계산된 스탯 값 (정수)
 */
function calculateStat(itemLevel) {
    // 입력값 유효성 검사
    if (typeof itemLevel !== 'number') {
        throw new Error('아이템 레벨은 숫자여야 합니다.');
    }

    if (itemLevel < 0) {
        throw new Error('아이템 레벨은 0 이상이어야 합니다.');
    }

    // 데이터 분석을 통해 얻은 지수 함수 공식 적용
    // 스탯 = 0.54 × e^(0.006839 × 아이템레벨)
    let exponent = 0.006839 * itemLevel;
    let statValue = 0.54 * Math.exp(exponent);

    // 소수점 이하 반올림하여 정수 반환
    return Math.round(statValue);
}

// 사용 예시
// let level = 1650;
// let stat = calculateStat(level);
// console.log(`아이템 레벨 ${level}의 스탯: ${stat}`);







async function selectCreate(data) {
    let module = await Promise.all([
        import("../filter/simulator-filter.js"),      // simulatorFilter
        import("../filter/simulator-data.js"),        // simulatorData
        import("../filter/filter.js"),                // originFilter
        import("../custom-module/calc-module.js"),    // calcModule
    ])

    let [simulatorFilter, simulatorData, originFilter, calcModule] = module


    /* **********************************************************************************************************************
    * function name		:	applyDataMinMaxToOptions()
    * description	    : 	data-min data-max값을 이용하여 select 드롭박스 숫자값 자동생성
    *********************************************************************************************************************** */

    function applyDataMinMaxToOptions() {
        const selectElements = document.querySelectorAll('select[data-max]');
        selectElements.forEach(selectElement => {
            const max = parseInt(selectElement.getAttribute('data-max'), 10);
            const min = selectElement.hasAttribute('data-min') ? parseInt(selectElement.getAttribute('data-min'), 10) : 1;

            for (let i = min; i <= max; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                selectElement.appendChild(option);
            }
        });
    }
    applyDataMinMaxToOptions()

    /* **********************************************************************************************************************
    * function name		:	applyDataStringToOptions()
    * description	    : 	data-string값을 이용하여 select 드롭박스 표시내용 수정
    *********************************************************************************************************************** */

    function applyDataStringToOptions() {
        const selectElementsWithDataString = document.querySelectorAll('select[data-string]');
        selectElementsWithDataString.forEach(selectElement => {
            const dataString = selectElement.getAttribute('data-string');
            const options = selectElement.querySelectorAll('option');

            options.forEach(option => {
                const originalText = option.textContent.replace(dataString, '');
                option.textContent = `${dataString}${originalText}`;
            });
        });
    }
    applyDataStringToOptions()


    /* **********************************************************************************************************************
    * function name		:	engFilterToOptions()
    * description	    : 	.engraving-box .engraving-name option 생성하기
    *********************************************************************************************************************** */


    function engFilterToOptions() {

        let engNameObj = simulatorFilter.engFilter.filter((obj, index, self) =>
            index === self.findIndex((o) => (
                o.name === obj.name
            ))
        );


        // calcModule.supportCheck(data) 값과 일치하는 job의 block 값 제거
        originFilter.engravingCalFilter.forEach(filter => {
            if (filter.job === calcModule.supportCheck(data)) {
                filter.block = [...new Set(filter.block)]; // 중복 제거
                engNameObj = engNameObj.map(engName => {
                    if (filter.block.includes(engName.name)) {
                        return { name: `${engName.name} - 무효` };
                    }
                    return engName;
                });
            }
        });

        // .engraving-box .engraving-name 요소에 option 추가
        document.querySelectorAll(".engraving-box .engraving-name").forEach(el => {
            engNameObj.forEach(engNameObj => {
                el.innerHTML += `<option value="${engNameObj.name}">${engNameObj.name}</option>`;
            });
        });

    }
    engFilterToOptions()

    /* **********************************************************************************************************************
    * function name		:	elixirFilterToOption()
    * description	    : 	엘릭서의 고유옵션과 공용옵션을 동적으로 생성(좌측 고유옵션+공용옵션 우측 공용옵션만)
    *********************************************************************************************************************** */

    function elixirFilterToOption() {
        let commonElixirElements = document.querySelectorAll('.armor-item .elixir.common');
        let helmetElixirElement = document.querySelector(".armor-item .elixir.helmet");
        let shoulderElixirElement = document.querySelector(".armor-item .elixir.shoulder");
        let armorElixirElement = document.querySelector(".armor-item .elixir.armor");
        let pantsElixirElement = document.querySelector(".armor-item .elixir.pants");
        let gloveElixirElement = document.querySelector(".armor-item .elixir.glove");


        optionCreate(commonElixirElements, simulatorFilter.elixirOptionData.common)

        optionCreate(helmetElixirElement, simulatorFilter.elixirOptionData.helmet)
        optionCreate(helmetElixirElement, simulatorFilter.elixirOptionData.common, "common")

        optionCreate(shoulderElixirElement, simulatorFilter.elixirOptionData.shoulder)
        optionCreate(shoulderElixirElement, simulatorFilter.elixirOptionData.common, "common")

        optionCreate(armorElixirElement, simulatorFilter.elixirOptionData.armor)
        optionCreate(armorElixirElement, simulatorFilter.elixirOptionData.common, "common")

        optionCreate(pantsElixirElement, simulatorFilter.elixirOptionData.pants)
        optionCreate(pantsElixirElement, simulatorFilter.elixirOptionData.common, "common")

        optionCreate(gloveElixirElement, simulatorFilter.elixirOptionData.glove)
        optionCreate(gloveElixirElement, simulatorFilter.elixirOptionData.common, "common")

        function optionCreate(element, filter, tag) {
            if (element instanceof NodeList) {

                element.forEach((element, idx) => {
                    if (idx == 0) {
                        let tag = document.createElement("option");
                        tag.value = "";
                        tag.disabled = true;
                        tag.textContent = "--------공용--------";
                        element.appendChild(tag);

                    }
                    filter.forEach(common => {
                        for (const key in common) {
                            if (common.hasOwnProperty(key) && key !== "name" && key !== "level") {
                                let option = document.createElement("option");
                                option.value = `${key}:${common[key]}:${common.level}`;
                                option.textContent = common.name;
                                element.appendChild(option);
                            }
                        }
                    })
                })
            } else {

                filter.forEach((specialFilter, idx) => {
                    if (idx === 0 && tag === "common") {
                        let tag = document.createElement("option");
                        tag.value = "";
                        tag.disabled = true;
                        tag.textContent = "--------공용--------";
                        element.appendChild(tag);
                    } else if (idx === 0) {
                        let tag = document.createElement("option");
                        tag.value = "";
                        tag.disabled = true;
                        tag.textContent = "--------특옵--------";
                        element.appendChild(tag);
                    }
                    for (const key in specialFilter) {
                        if (specialFilter.hasOwnProperty(key) && key !== "name" && key !== "level") {
                            let option = document.createElement("option");
                            option.value = `${key}:${specialFilter[key]}:${specialFilter.level}`;
                            option.textContent = specialFilter.name;
                            element.appendChild(option);
                        }
                    }
                })
            }
        }

    }
    elixirFilterToOption()

    /* **********************************************************************************************************************
    * function name		:	applyDataSelectToOptions()
    * description	    : 	data-select을 이용하여 사용자의 기본값에 해당하는 option을 선택함
    *********************************************************************************************************************** */

    function applyDataSelectToOptions() {
        const selectElements = document.querySelectorAll("select[data-select]");
        selectElements.forEach(selectElement => {
            const name = selectElement.getAttribute("data-select");
            // const option = document.createElement('option');
            // option.value = name;
            // option.textContent = name;
            // option.selected = true;
            // selectElement.appendChild(option);
            let optionElements = Array.from(selectElement.querySelectorAll("option"))
            let selectOption = optionElements.find(optionElement => optionElement.value == name || optionElement.value == name + " - 무효");
            if (selectOption) {
                selectOption.selected = true;
            }
        })
    }
    applyDataSelectToOptions()

    /* **********************************************************************************************************************
    * function name		:	
    * description	    : 	
    *********************************************************************************************************************** */

    let engObjList = await calcModule.engExtract()

    /* **********************************************************************************************************************
    * function name		:	armoryEnforceLimite()
    * description	    : 	.armor-item .armor-name와 .armor-item .tier 의 값에 따라 상급재련 선택요소 생성
    *********************************************************************************************************************** */
    function armoryEnforceLimite() {
        let armorElements = document.querySelectorAll(".armor-item .armor-name");

        armorElements.forEach(armorElement => {
            applyUpgradeOptions(armorElement);

            armorElement.addEventListener("change", () => {
                applyUpgradeOptions(armorElement);
            });
            armorElement.parentElement.parentElement.parentElement.querySelector(".plus").addEventListener("change", () => {
                applyUpgradeOptions(armorElement);
            });
        });

        function applyUpgradeOptions(armorElement) {
            let upgradeElement = armorElement.parentElement.querySelector(".armor-upgrade");
            let normalUpgradeValue = Number(armorElement.value)
            let tierValue = Number(armorElement.parentElement.querySelector(".plus").value)
            if (tierValue + normalUpgradeValue * 5 < 1620) {
                createOptions(upgradeElement, -1);
            } else if (tierValue + normalUpgradeValue * 5 < 1680) {
                createOptions(upgradeElement, 1, 20);
            } else if (tierValue + normalUpgradeValue * 5 < 1700) {
                createOptions(upgradeElement, 21, 30);
            } else {
                createOptions(upgradeElement, 31, 40);
            }
            applyDataStringToOptions();
        }

        function createOptions(selectElement, start, end) {
            if (!selectElement) {
                return;
            }

            // 기존 옵션 제거
            selectElement.innerHTML = '';

            if (start === -1) {
                const option = document.createElement('option');
                option.value = 0;
                option.textContent = '없음';
                selectElement.setAttribute('data-string', "")
                selectElement.appendChild(option);
            } else {
                // 옵션 생성 및 추가
                for (let i = start; i <= end; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    selectElement.setAttribute('data-string', "X ")
                    selectElement.appendChild(option);
                }
            }
        }
    }
    armoryEnforceLimite()

    /* **********************************************************************************************************************
    * function name		:	hyperStageToStarCreate
    * description			: 	초월 N단계를 바탕으로 3N성을 생성
    *********************************************************************************************************************** */

    function hyperStageToStarCreate() {
        let elements = document.querySelectorAll(".hyper-wrap select.level");

        elements.forEach(element => {
            element.addEventListener("change", () => applyDataStringToOptions())
            function applyDataStringToOptions() {
                let stage = Number(element.value);
                let hyper = element.parentElement.querySelector("select.hyper");
                hyper.innerHTML = "";
                for (let i = 1; i <= stage * 3; i++) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    hyper.appendChild(option);
                }
            }
            applyDataStringToOptions()

        })
    }
    hyperStageToStarCreate()

    /* **********************************************************************************************************************
    * function name		:	applyDataNameToOptions()
    * description	    : 	data-name을 이용하여 필터에 없는 각인을 장착시 표시해줌
    *********************************************************************************************************************** */
    function applyDataNameToOptions() {
        const selectElements = document.querySelectorAll("select[data-name]");
        selectElements.forEach(selectElement => {
            // selectElement.innerHTML = "";
            const name = selectElement.getAttribute("data-name");
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name + "- 무효";
            option.selected = true;
            selectElement.appendChild(option);

        })
    }
    applyDataNameToOptions()

}







// // 툴팁
const selectElements = document.querySelectorAll('select');

selectElements.forEach((selectElement) => {
    selectElement.addEventListener('mouseover', (event) => {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = selectedOption.text;

        document.body.appendChild(tooltip);
        tooltip.style.left = `${event.clientX + window.scrollX + 10}px`;
        tooltip.style.top = `${event.clientY + window.scrollY + 10}px`;

        selectElement.addEventListener('mousemove', (moveEvent) => {
            tooltip.style.left = `${moveEvent.clientX + window.scrollX + 10}px`;
            tooltip.style.top = `${moveEvent.clientY + window.scrollY + 10}px`;
        });

        selectElement.addEventListener('mouseout', () => {
            tooltip.remove();
        }, { once: true });
    });

    selectElement.addEventListener('change', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.textContent = selectElement.options[selectElement.selectedIndex].text;
        }
    });
});
