let cachedData = null;

async function simulatorInputCalc() {
    let module = await Promise.all([
        import("../custom-module/fetchApi.js"),      // fetchApi
        import("../custom-module/trans-value.js"),   // transValue
        import("../custom-module/calculator.js"),    // calcValue
        import("../custom-module/calc-module.js"),   // calcModule
        import("../filter/simulator-data.js"),       // simulatorData
        import("../filter/simulator-filter.js"),     // simulatorFilter


    ])


    let [fetchApi, transValue, calcValue, calcModule, simulatorData, simulatorFilter] = module

    /* **********************************************************************************************************************
     * function name		:	
     * description			: 	유저 JSON데이터 캐싱처리
     *********************************************************************************************************************** */
    if (!cachedData) {
        cachedData = await fetchApi.lostarkApiCall("청염각");
        console.log(cachedData)
        await selectCreate(cachedData)
    }

    /* **********************************************************************************************************************
     * function name		:	supportCheck
    * description			: 	2차 직업명 출력
     * function name		:	extractValue
     * description			: 	???
     *********************************************************************************************************************** */

    let supportCheck = await secondClassCheck(cachedData)
    let extractValue = await transValue.getCharacterProfile(cachedData)

    /* **********************************************************************************************************************
     * function name		:	stoneOutputCalc()
     * description			: 	돌맹이 수치 값
     *********************************************************************************************************************** */

    function stoneOutputCalc() {
        let obj = [];
        let elements = document.querySelectorAll(".buff-wrap .buff");
        // simulatorFilter.engFilter
        elements.forEach((element, idx) => {
            if (idx === 0) {
                obj = []
            }
            let name = element.value.split(":")[0]
            let level = Number(element.value.split(":")[1])

            let stoneObj = simulatorFilter.stoneFilter.find((filter) => filter.name === name && filter.level === level);
            if (!stoneObj) {
                stoneObj = { name: "없음", finalDamagePer: 1, engBonus: 1 };
            }
            obj.push(stoneObj)
        })
        return obj;
    }
    // console.log("돌맹이 착용 각인", stoneOutputCalc())

    /* **********************************************************************************************************************
     * function name		:	engExtract()
     * description			: 	현재 각인 객체로 추출
     *********************************************************************************************************************** */

    function engExtract() {
        let result = []


        let name = document.querySelectorAll(".engraving-box .engraving-name")
        let grade = document.querySelectorAll(".engraving-box .relic-ico")
        let level = document.querySelectorAll(".engraving-box .grade")

        for (let i = 0; i < name.length; i++) {
            const obj = {
                name: name[i].value,
                grade: grade[i].value,
                level: Number(level[i].value)
            };
            result.push(obj);
        }

        return result

    }


    /* **********************************************************************************************************************
     * function name		:	engOutputCalc(inputValueObjArr)
     * description			: 	각인 수치 값
     *********************************************************************************************************************** */


    function engOutputCalc(inputValueObjArr) {
        let arr = [];
        let result = {
            engBonus: 1,
            finalDamagePer: 1
        };
        let matchingFilters
        inputValueObjArr.forEach(function (inputValue) {
            if (calcModule.supportCheck !== "서폿") {
                matchingFilters = simulatorFilter.engFilter.dealer.filter(function (filter) {
                    return filter.name === inputValue.name && filter.grade === inputValue.grade && filter.level === inputValue.level;
                });
            } else {
                matchingFilters = simulatorFilter.engFilter.support.filter(function (filter) {
                    return filter.name === inputValue.name && filter.grade === inputValue.grade && filter.level === inputValue.level;
                });

            }

            matchingFilters.forEach(function (filter) {
                arr.push({
                    name: filter.name,
                    finalDamagePer: filter.finalDamagePer,
                    engBonus: filter.engBonus
                });
            });
        });
        // console.log("착용된 각인", arr);


        let mergedEngs = [];
        arr.forEach(eng => {
            let foundStoneEng = stoneOutputCalc().find(stoneEng => stoneEng.name === eng.name);
            if (foundStoneEng && foundStoneEng.name !== "없음") {
                // 이름이 같은 경우, 합연산으로 병합
                mergedEngs.push({
                    name: eng.name,
                    finalDamagePer: eng.finalDamagePer + foundStoneEng.finalDamagePer / 100,
                    engBonus: eng.engBonus + foundStoneEng.engBonus / 100
                });
            } else {
                // 이름이 다른 경우, arr의 객체를 그대로 추가
                mergedEngs.push(eng);
            }

        });

        stoneOutputCalc().forEach(stoneEng => {
            if (stoneEng.name !== "없음" && !mergedEngs.find(eng => eng.name === stoneEng.name)) {
                mergedEngs.push(stoneEng)
            }
        })
        // console.log("각인 + 돌 병합:", mergedEngs);


        // 최종 결과 객체 생성
        mergedEngs.forEach(eng => {
            result.finalDamagePer *= eng.finalDamagePer;
            result.engBonus *= eng.engBonus;
        });

        // console.log("최종결과:", result);


        // result.finalDamagePer *= stoneOutputCalc().finalDamagePer;
        // result.engBonus *= stoneOutputCalc().engBonus;


        return result;
    }


    // console.log(engExtract())
    // console.log(engOutputCalc(engExtract()))
    engOutputCalc(engExtract())

    /* **********************************************************************************************************************
     * function name		:	bangleStatsNumberCalc()
     * description			: 	팔찌 스텟의 힘/민/지 || 치/특/신 값을 가져옴 (사용자의 직업에 사용하지 않는 스텟의 경우 key값을 none으로 처리)
     *********************************************************************************************************************** */

    function bangleStatsNumberCalc() {
        let elements = document.querySelectorAll(".accessory-item.bangle input.option");
        let arr = []

        elements.forEach(element => {
            let statsTag = element.parentElement.querySelector(".stats");
            let value = Number(element.value);
            let obj = {}
            if (statsTag.value !== "none") {
                obj[statsTag.value] = value;
                arr.push(obj)
            }
        })
        // console.log(arr)
        return arr;
    }
    bangleStatsNumberCalc()

    /* **********************************************************************************************************************
     * function name		:	bangleOptionCalc()
     * description			: 	팔찌 옵션의 수치를 가져옴
     *********************************************************************************************************************** */

    function bangleOptionCalc() {
        let elements = document.querySelectorAll(".accessory-item.bangle select.option");
        let arr = []

        elements.forEach(element => {
            let obj = {}
            if (element.value.includes("|")) {
                let splitValue = element.value.split("|");
                splitValue.forEach(split => {
                    let name = split.split(":")[0];
                    let value = Number(split.split(":")[1]);
                    // console.log(name)
                    // console.log(value)
                    obj[name] = value;
                    arr.push(obj);
                    obj = {}
                })
            } else {
                let name = element.value.split(":")[0];
                let value = Number(element.value.split(":")[1]);
                obj[name] = value;
                arr.push(obj)
            }
        })
        // console.log(arr)
    }
    bangleOptionCalc()

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
    // console.log(armoryLevelCalc())
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

        // console.log(obj)
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
     * function name		:	accessoryValueToObj()
     * description			: 	악세서리 수치를 obj로 저장
     *********************************************************************************************************************** */

    function accessoryValueToObj() {
        let result;
        let arr = [];
        let elements = document.querySelectorAll(".accessory-list .accessory-item.accessory .option");
        elements.forEach(element => {
            let key = element.value.split(":")[1];
            let value = Number(element.value.split(":")[2]);
            let obj = {};
            obj[key] = value;
            arr.push(obj);
        })
        // console.log(arr)
        // console.log(objKeyValueSum(arr))
        return result
    }
    accessoryValueToObj()


    /* **********************************************************************************************************************
    * function name		:	objKeyValueSum(objArr)
    * description		: 	악세서리 옵션의 key값이 동일한 경우 합연산 또는 곱연산
    *********************************************************************************************************************** */
    function objKeyValueSum(objArr) {
        const grouped = {};

        // 객체들을 키별로 그룹화
        objArr.forEach(obj => {
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
                combinedObj[key] = Number(grouped[key].reduce((acc, val) => acc * val, 1).toFixed(2));
            } else {
                // 기타 스텟은 덧셈
                combinedObj[key] = Number(grouped[key].reduce((acc, val) => acc + val, 0).toFixed(2));
            }
        }

        return combinedObj;
    }


    /* **********************************************************************************************************************
     * function name		:	specPointCalc
     * description			: 	최종 스펙포인트 계산식
     *********************************************************************************************************************** */

    let originSpecPoint = await calcValue.specPointCalc(extractValue)

}
simulatorInputCalc()
document.body.addEventListener('change', () => { simulatorInputCalc() })



/* **********************************************************************************************************************


 *********************************************************************************************************************** */



async function selectCreate(data) {
    let module = await Promise.all([
        import("../filter/simulator-filter.js"),      // simulatorFilter
        import("../filter/simulator-data.js"),        // simulatorData
        import("../filter/filter.js"),                // originFilter
        import("../custom-module/calc-module.js"),    // calcModule
    ])

    let [simulatorFilter, simulatorData, originFilter, calcModule] = module


    /* **********************************************************************************************************************
    * variable name		:	supportCheck
    * description	    : 	2차 직업명 출력 변수
    *********************************************************************************************************************** */

    let supportCheck = await secondClassCheck(data)

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
    * description	    : 	각인 옵션을 생성하고 사용자의 직업에 따라 무효각인의 경우 무효를 표시해줌
    *********************************************************************************************************************** */


    function engFilterToOptions() {
        let engNameObj
        if (calcModule.supportCheck !== "서폿") {
            engNameObj = simulatorFilter.engFilter.dealer.filter((obj, index, self) =>
                index === self.findIndex((o) => (
                    o.name === obj.name
                ))
            );
        } else {
            engNameObj = simulatorFilter.engFilter.support.filter((obj, index, self) =>
                index === self.findIndex((o) => (
                    o.name === obj.name
                ))
            );
        }


        // calcModule.supportCheck(data) 값과 일치하는 job의 block 값 제거
        originFilter.engravingCalFilter.forEach(filter => {
            if (filter.job === calcModule.supportCheck) {
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
            } else if (tierValue + normalUpgradeValue * 5 >= 1680) {
                createOptions(upgradeElement, 1, 40);
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
                option.textContent = '불가';
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
    * description		: 	초월 N단계를 바탕으로 3N성을 생성
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
    * function name		:	accessoryTierToOptions()
    * description	    : 	악세서리 티어 등급 에 따라 옵션명을 생성
    *********************************************************************************************************************** */

    // simulatorFilter
    function accessoryTierToOptions() {
        let elements = document.querySelectorAll(".accessory-item .tier.accessory");
        elements.forEach(element => {
            element.addEventListener("change", createOption);

            function createOption() {
                let siblingElements = element.parentElement.parentElement.querySelectorAll(".option-box .option");
                siblingElements.forEach(siblingElement => {
                    siblingElement.innerHTML = "";
                    let tier = element.value.split(":")[0];
                    let tag = element.value.split(":")[1];
                    if (tier === "T3유물") {
                        if (tag === "목걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3RelicData.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3RelicData.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3RelicData.ring, "특옵");
                        }
                        optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3RelicData.common, "공용");
                    } else if (tier === "T3고대") {
                        if (tag === "목걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3MythicData.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3MythicData.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3MythicData.ring, "특옵");
                        }
                        optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t3MythicData.common, "공용");
                    } else if (tier === "T4유물" || tier === "T4고대") {
                        if (tag === "목걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t4Data.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t4Data.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t4Data.ring, "특옵");
                        }
                        optionCreate(siblingElement, simulatorFilter.accessoryOptionData.t4Data.common, "공용");
                    }
                });
            }
            createOption();
        });
        function optionCreate(element, data, tag) {
            if (tag === "공용") {
                let option = document.createElement("option");
                option.value = "";
                option.disabled = true;
                option.textContent = "--------공용--------";
                element.appendChild(option);
            } else if (tag === "특옵") {
                let option = document.createElement("option");
                option.value = "";
                option.disabled = true;
                option.textContent = "--------특옵--------";
                element.appendChild(option);
            }
            data.forEach((item, idx) => {
                let option = document.createElement("option");
                option.textContent = item.name;
                let valueParts = [];
                valueParts.push(`${item.grade}`);

                for (const key in item) {
                    if (key !== 'name' && key !== 'grade') {
                        valueParts.push(`${key}:${item[key]}`);
                    }
                }

                option.value = valueParts.join(":");
                element.appendChild(option);
            });
        }

    }
    accessoryTierToOptions()

    /* **********************************************************************************************************************
    * function name		:	bangleTierToOption()
    * description	    : 	팔찌의 티어 등급에 따라 옵션, value를 동적으로 생성
    *********************************************************************************************************************** */

    function bangleTierToOption() {
        // simulatorFilter.bangleOptionData
        let elements = document.querySelectorAll(".accessory-item.bangle select.option");
        let tier = document.querySelector(".accessory-item.bangle .tier");
        tier.addEventListener("change", () => { changeTierToOption() });

        // console.log(simulatorFilter.bangleOptionData.t3RelicData)
        function changeTierToOption() {
            elements.forEach(element => {
                if (tier.value === "T3고대") {
                    createOption(element, simulatorFilter.bangleOptionData.t3RelicData)
                } else if (tier.value === "T3유물") {
                    createOption(element, simulatorFilter.bangleOptionData.t3MythicData)
                } else if (tier.value === "T4고대") {
                    createOption(element, simulatorFilter.bangleOptionData.t4RelicData)
                } else if (tier.value === "T4유물") {
                    createOption(element, simulatorFilter.bangleOptionData.t4MythicData)
                }
            })
            function createOption(element, filterArr) {
                filterArr.forEach((filter, idx) => {
                    if (idx === 0) {
                        element.innerHTML = "";
                    }
                    let option = document.createElement("option");
                    option.textContent = filter.name;
                    let valueParts = []; // key:value 쌍을 저장할 배열
                    for (const key in filter) {
                        if (key !== 'name' && key !== 'grade') {
                            valueParts.push(`${key}:${filter[key]}`); // key:value 형태로 배열에 추가
                        }
                    }

                    option.value = valueParts.join("|"); // 배열의 요소들을 |로 연결하여 value 설정
                    element.appendChild(option);
                })
            }
        }
        changeTierToOption()

    }
    bangleTierToOption()

    /* **********************************************************************************************************************
    * function name		:	userEngToStoneOption()
    * description	    : 	사용자가 장착중인 각인명을 가져와 어빌리티스톤의 옵션을 생성함
    *********************************************************************************************************************** */

    function userEngToStoneOption() {
        let stoneElements = document.querySelectorAll(".buff-wrap .buff");
        let engElements = document.querySelectorAll(".engraving-box .engraving-name");

        // engElements의 change 이벤트 리스너 설정 (각인 -> 어빌리티 스톤)
        engElements.forEach((engElement, idx) => {
            document.querySelector(".engraving-area").addEventListener("change", () => { engElementChange(engElement, idx) });
            engElementChange(engElement, idx);
        });

        function engElementChange(element, idx) {
            const value = element.value; // 현재 변경된 값

            // idx가 0일 때만 engArry를 초기화하고 모든 stoneElement의 옵션을 초기화
            if (idx === 0) {
                stoneElements.forEach(stoneElement => {
                    stoneElement.innerHTML = "";
                });
            }
            // 모든 stoneElement에 현재 선택된 각인을 option으로 추가합니다.
            stoneElements.forEach(stoneElement => {
                if (value === "없음") {
                    return
                } else if (value.includes("- 무효")) {
                    let valueText = value.split("- 무효")[0];
                    for (let i = 0; i <= 4; i++) {
                        let option = document.createElement("option");
                        option.textContent = `${valueText} Lv${i} - 무효`;
                        option.value = `${valueText}- 무효:${i}`;
                        stoneElement.appendChild(option);
                    }
                } else {
                    for (let i = 0; i <= 4; i++) {
                        let option = document.createElement("option");
                        option.textContent = `${value} Lv${i}`;
                        option.value = `${value}:${i}`;
                        stoneElement.appendChild(option);
                    }

                }
            });
        }
    }
    userEngToStoneOption()



    /* **********************************************************************************************************************
    * function name		:	bangleStatsOptionLimit()
    * description	    : 	캐릭터의 1차 직업을 기준으로 힘민지의 무효 표시를 생성함
    *********************************************************************************************************************** */

    function bangleStatsOptionLimit() {
        let elements = document.querySelectorAll(".accessory-item.bangle .stats");
        let validStats = originFilter.bangleJobFilter.find(jobFilter => jobFilter.job === data.ArmoryProfile.CharacterClassName);

        elements.forEach(element => {
            const options = Array.from(element.options);
            const validStatsValues = validStats.stats || [];

            options.forEach(option => {
                const optionValue = option.value;
                const optionText = option.textContent;

                // option의 value가 "stats"이거나 validStats.stats에 포함되는 경우, 변경하지 않음
                if (optionValue === "stats" || validStatsValues.includes(optionValue)) {
                    return;
                }

                // 이미 "- 무효"가 포함되어 있으면 추가하지 않음
                if (!optionText.includes("- 무효")) {
                    option.textContent = optionText + " - 무효";
                    option.value = "none";
                }
            });
        });

        // console.log((validStats.stats))
    }
    bangleStatsOptionLimit()

    /* **********************************************************************************************************************
    * function name		:	calculateGemData
    * description	    : 	
    *********************************************************************************************************************** */

    function calculateGemData(data) {
        let gemObj = {
            atkBuff: 0,
            damageBuff: 0,
        };

        // 보석4종 레벨별 비율
        let gemPerObj = [
            { name: "겁화", level1: 8, level2: 12, level3: 16, level4: 20, level5: 24, level6: 28, level7: 32, level8: 36, level9: 40, level10: 44 },
            { name: "멸화", level1: 3, level2: 6, level3: 9, level4: 12, level5: 15, level6: 18, level7: 21, level8: 24, level9: 30, level10: 40 },
            { name: "홍염", level1: 2, level2: 4, level3: 6, level4: 8, level5: 10, level6: 12, level7: 14, level8: 16, level9: 18, level10: 20 },
            { name: "작열", level1: 6, level2: 8, level3: 10, level4: 12, level5: 14, level6: 16, level7: 18, level8: 20, level9: 22, level10: 24 },
        ];

        let gemSkillArry = [];
        let specialClass;

        // 유저가 착용중인 보석,스킬 배열로 만들기
        data.ArmoryGem.Gems.forEach(function (gem) {
            let regex = />([^<]*)</g;
            let match;
            let results = [];
            while ((match = regex.exec(gem.Tooltip)) !== null) {
                results.push(match[1]);
            }

            results.forEach(function (toolTip, idx) {
                toolTip = toolTip.replace(/"/g, '');

                if (toolTip.includes(data.ArmoryProfile.CharacterClassName) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {
                    let etcGemValue = results[idx + 2].substring(0, results[idx + 2].indexOf('"'));
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1]);
                    } else {
                        gemName = "기타보석";
                    }
                    let obj = { skill: results[idx + 1], name: gemName, level: level };
                    gemSkillArry.push(obj);
                } else if (!(toolTip.includes(data.ArmoryProfile.CharacterClassName)) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {  // 자신의 직업이 아닌 보석을 장착중인 경우
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1]);
                    } else {
                        gemName = "기타보석";
                    }
                    let obj = { skill: "직업보석이 아닙니다", name: gemName, level: level };
                    gemSkillArry.push(obj);
                }
            });
        });

        console.log(gemSkillArry)

        let per = "홍염|작열";
        let dmg = "겁화|멸화";

        function skillCheck(arr, ...nameAndGem) {
            for (let i = 0; i < nameAndGem.length; i += 2) {
                const name = nameAndGem[i];
                const gemPattern = nameAndGem[i + 1];
                const regex = new RegExp(gemPattern);
                const found = arr.some(item => item.skill === name && regex.test(item.name));
                if (!found) return false;
            }
            return true;
        }

        function classCheck(className) {
            return supportCheck == className;
        }

        if (classCheck("전태") && skillCheck(gemSkillArry, "버스트 캐넌", dmg)) {
            specialClass = "버캐 채용 전태";
        } else if (classCheck("세맥") && !skillCheck(gemSkillArry, "환영격", dmg)) {
            specialClass = "5멸 세맥";
        } else if (classCheck("핸건") && skillCheck(gemSkillArry, "데스파이어", dmg)) {
            specialClass = "7멸 핸건";
        } else if (classCheck("포강") && skillCheck(gemSkillArry, "에너지 필드", per)) {
            specialClass = "에필 포강";
        } else if (classCheck("환류") && skillCheck(gemSkillArry, "종말의 날", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("환류") && !skillCheck(gemSkillArry, "인페르노", dmg)) {
            specialClass = "6딜 환류";
        } else if (classCheck("질풍") && !skillCheck(gemSkillArry, "여우비 스킬", dmg)) {
            specialClass = "5멸 질풍";
        } else if (classCheck("그믐") && !skillCheck(gemSkillArry, "소울 시너스", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg) && !skillCheck(gemSkillArry, "마운틴 크래쉬", dmg)) {
            specialClass = "6겁 광기";
        } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg)) {
            specialClass = "7겁 광기";
        } else if (classCheck("포식") && !skillCheck(gemSkillArry, "페이탈 소드", dmg)) {
            specialClass = "크블 포식";
        } else if (classCheck("피메") && !skillCheck(gemSkillArry, "대재앙", dmg)) {
            specialClass = "6M 피메";
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 잔재";
        } else if (classCheck("억제") && !skillCheck(gemSkillArry, "피어스 쏜", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("야성") || classCheck("두동") || classCheck("환각") || classCheck("서폿") || classCheck("진실된 용맹") || classCheck("심판자") || classCheck("회귀")) {
            specialClass = "데이터 없음";
        } else {
            specialClass = supportCheck;
        }

        console.log("보석전용 직업 : ", specialClass)

        gemSkillArry.forEach(function (gemSkill, idx) {
            let realClass = originFilter.classGemFilter.filter(item => item.class == specialClass);
            if (realClass.length == 0) {
                gemSkillArry[idx].skillPer = "none";
            } else {
                let realSkillPer = realClass[0].skill.filter(item => item.name == gemSkill.skill);
                if (realSkillPer[0] != undefined) {
                    gemSkillArry[idx].skillPer = realSkillPer[0].per;
                } else {
                    gemSkillArry[idx].skillPer = "none";
                }
            }
        });

        // 직업별 보석 지분율 필터
        let classGemEquip = originFilter.classGemFilter.filter(function (filterArry) {
            return filterArry.class == specialClass;
        });

        console.log(classGemEquip)

        function gemCheckFnc() {
            try {
                // console.log(classGemEquip)
                let realGemValue = classGemEquip[0].skill.map(skillObj => {
                    let matchValue = gemSkillArry.filter(item => item.skill == skillObj.name);
                    if (!(matchValue.length == 0)) {
                        // console.log(matchValue)
                        return {
                            name: skillObj.name,
                            per: skillObj.per,
                            gem: matchValue,
                        };
                    }
                }).filter(Boolean);

                // console.log(realGemValue)

                let coolGemTotal = 0;
                let count = 0;

                gemSkillArry.forEach(function (gemListArry) {
                    if (gemListArry.name == "홍염" || gemListArry.name == "작열") {
                        let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                        // console.log(perValue[0][`level${gemListArry.level}`]);
                        coolGemTotal += perValue[0][`level${gemListArry.level}`];
                        count++;
                    }
                });

                let averageValue = count > 0 ? coolGemTotal / count : 0;

                console.log("평균값 : " + averageValue)

                let etcAverageValue;
                let dmgGemTotal = 0;
                let dmgCount = 0;

                if (specialClass == "데이터 없음") {
                    gemSkillArry.forEach(function (gemListArry) {
                        if (gemListArry.name == "멸화" || gemListArry.name == "겁화") {
                            let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                            // console.log(perValue[0][`level${gemListArry.level}`]);
                            dmgGemTotal += perValue[0][`level${gemListArry.level}`];
                            dmgCount++;
                        }
                    });
                    etcAverageValue = dmgCount > 0 ? dmgGemTotal / dmgCount : 0;
                } else {
                    etcAverageValue = 1;
                }

                // 실제 유저가 장착한 보석의 딜 비율을 가져오는 함수
                function getLevels(gemPerObj, skillArray) {
                    let result = [];
                    skillArray.forEach(skill => {
                        if (skill.per != "etc") {
                            skill.gem.forEach(gem => {
                                let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                                if (!(gemObj == undefined)) {
                                    let level = gemObj[`level${gem.level}`];
                                    result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: skill.per });
                                }
                            });
                        } else if (skill.per == "etc") {
                            skill.gem.forEach(gem => {
                                let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                                if (!(gemObj == undefined)) {
                                    let level = gemObj[`level${gem.level}`];
                                    result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: etcValue / etcLength });
                                }
                            });
                        }
                    });
                    return result;
                }
                //console.log(getLevels(gemPerObj, realGemValue))
                let gemValue = getLevels(gemPerObj, realGemValue).reduce((gemResultValue, finalGemValue) => {
                    return gemResultValue + finalGemValue.per * finalGemValue.skillPer;
                }, 0);

                // special skill Value 값 계산식
                function specialSkillCalc() {
                    let result = 0;
                    classGemEquip[0].skill.forEach(function (skill) {
                        if (skill.per != "etc") {
                            result += skill.per;
                        }
                    });
                    return 1 / result;
                }

                return {
                    specialSkill: specialSkillCalc(),
                    originGemValue: gemValue,
                    gemValue: (gemValue * specialSkillCalc()) / 100 + 1,
                    gemAvg: averageValue,
                    etcAverageValue: etcAverageValue / 100 + 1,
                };
            } catch (error) {
                console.error("Error in gemCheckFnc:", error);
                return {
                    specialSkill: 1,
                    originGemValue: 1,
                    gemValue: 1,
                    gemAvg: 0,
                    etcAverageValue: 1,
                };
            }
        }
        console.log(gemCheckFnc())
    }


    calculateGemData(data)
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
            option.value = name + "- 무효";
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





/* **********************************************************************************************************************
 * function name		:	secondClassCheck()
 * description			: 	2차 직업명
 *********************************************************************************************************************** */

async function secondClassCheck(data) {
    let filter = await import("../filter/filter.js");
    let result;
    let arkResult = ""
    let enlightenmentArry = [];
    let enlightenmentCheck = [];
    data.ArkPassive.Effects.forEach(function (arkArry) {
        if (arkArry.Name == '깨달음') {
            enlightenmentCheck.push(arkArry)
        }
    })
    // console.log(enlightenmentArry)


    function supportArkLeft(arkName) {
        let result = []
        arkName.map(function (arkNameArry) {
            // 아크이름 남기기
            let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
            enlightenmentArry.push(arkName)
        });
    }
    supportArkLeft(enlightenmentCheck)

    try {
        filter.arkFilter.forEach(function (arry) {
            let arkInput = arry.name;
            let arkOutput = arry.initial;

            // console.log(arkInput)

            enlightenmentArry.forEach(function (supportCheckArry) {
                if (supportCheckArry.includes(arkInput) && data.ArkPassive.IsArkPassive) {
                    arkResult = arkOutput
                    return arkResult
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
    result = arkResult;
    return result
}
