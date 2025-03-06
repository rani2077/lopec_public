/* **********************************************************************************************************************
 * function name		:	importModuleManager()
 * description			: 	사용하는 모든 외부 module파일 import
 *********************************************************************************************************************** */
async function importModuleManager() {
    let modules = await Promise.all([
        import("../custom-module/fetchApi.js"),     // lostark api호출
        import("../filter/filter.js"),              // 기존 filter.js
        import("../filter/simulator-data.js"),      // 장비레벨 스텟 정보
        import("../filter/simulator-filter.js"),    // 시뮬레이터 필터
        import("../custom-module/trans-value.js"),  // 유저정보 수치화
        import("../custom-module/calculator.js"),   // 수치값을 스펙포인트로 계산
    ])
    let moduleObj = {
        fetchApi: modules[0],
        originFilter: modules[1],
        simulatorData: modules[2],
        simulatorFilter: modules[3],
        transValue: modules[4],
        calcValue: modules[5],
    }

    return moduleObj
}





let cachedData = null;
async function simulatorInputCalc() {

    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('Name');
    /* **********************************************************************************************************************
    * function name		:	Modules
    * description		: 	모든 외부모듈 정의
    *********************************************************************************************************************** */
    let Modules = await importModuleManager()

    /* **********************************************************************************************************************
     * function name		:	
     * description			: 	유저 JSON데이터 호출 및 캐싱처리
     *********************************************************************************************************************** */
    if (!cachedData) {
        cachedData = await Modules.fetchApi.lostarkApiCall(nameParam);
        console.log(cachedData)
        await selectCreate(cachedData)
    }

    /* **********************************************************************************************************************
     * function name		:	supportCheck
     * description			: 	2차 직업명 출력
     * function name		:	extractValue
     * description			: 	기존 spec-point.js 로직을 이용해 추출한 값
     *********************************************************************************************************************** */

    let supportCheck = await secondClassCheck(cachedData);
    let extractValue = await Modules.transValue.getCharacterProfile(cachedData);
    console.log("오리진OBJ", extractValue)


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

            let stoneObj = Modules.simulatorFilter.stoneFilter.find((filter) => filter.name === name && filter.level === level);
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
            if (supportCheck !== "서폿") {
                matchingFilters = Modules.simulatorFilter.engFilter.dealer.filter(function (filter) {
                    return filter.name === inputValue.name && filter.grade === inputValue.grade && filter.level === inputValue.level;
                });
            } else {
                matchingFilters = Modules.simulatorFilter.engFilter.support.filter(function (filter) {
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


    // engOutputCalc(engExtract())
    // console.log(engExtract())
    console.log("각인", engOutputCalc(engExtract()))

    /* **********************************************************************************************************************
     * function name		:	stoneLevelBuffStat
     * description			: 	돌맹이 레벨 합계에 따른 공격력 버프 보너스 수치 abilityAttackBonus에 넣으면 됨
     *********************************************************************************************************************** */

    function stoneLevelBuffStat() {
        let elements = document.querySelectorAll(".accessory-item .buff");
        let stoneLevel = 0;
        let result = 0;
        elements.forEach(element => {
            let level = Number(element.value.split(":")[1]);
            stoneLevel += level;
        })
        if (stoneLevel >= 5) {
            result = 1.5;
        }
        return result;
    }
    stoneLevelBuffStat()

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
        console.log(arr)
    }
    bangleOptionCalc()

    /* **********************************************************************************************************************
     * function name		:	armoryLevelCalc()
     * description			: 	사용자가 선택한 장비 level stat special 객체 반환
     *********************************************************************************************************************** */

    function leafPointExtract() {

    }

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

        armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 투구
        // armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 어깨
        // armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 상의
        // armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 하의
        // armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 장갑
        // armorPartObjCreate(Modules.simulatorData.helmetlevels, result[0].level)           // 무기

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
            // console.log("회심, 달인, 선봉대 중 2개 이상 존재합니다. 레벨 40 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.12
        } else if (group1Count >= 2 && combinedObj.level >= 35) {
            console.log("회심, 달인, 선봉대 중 2개 이상 존재합니다. 레벨 35 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.06
        }
        if (group2Count >= 2 && combinedObj.level >= 40) {
            // console.log("강맹, 칼날방패, 행운 중 2개 이상 존재합니다. 레벨 40 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.08
        } else if (group2Count >= 2 && combinedObj.level >= 35) {
            // console.log("강맹, 칼날방패, 행운 중 2개 이상 존재합니다. 레벨 35 이상");
            combinedObj.finalDamagePer = combinedObj.finalDamagePer * 1.04
        }

        if (group3Count >= 2 && combinedObj.level >= 40) {
            // console.log("선각자, 신념 이 모두 존재합니다. 레벨 40 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 14
        } else if (group3Count >= 2 && combinedObj.level >= 35) {
            // console.log("선각자, 신념 이 모두 존재합니다. 레벨 35 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 8
        }

        if (group4Count >= 1 && combinedObj.level >= 40) {
            // console.log("진군 존재합니다. 레벨 40 이상");
            combinedObj.atkBuff = combinedObj.atkBuff + 6
        } else if (group4Count >= 1 && combinedObj.level >= 35) {
            // console.log("진군 존재합니다. 레벨 35 이상");
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
            obj.finalDamagePer *= 1.015 * 1.01
        } else if (pantsHyper >= 15) {
            obj.atkBuff += 3
            obj.finalDamagePer *= 1.01
        } else if (pantsHyper >= 10) {
            obj.atkBuff += 1.5
            obj.finalDamagePer *= 1.005
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
            let parts = element.value.split(":");
            if (parts.length === 3) { // Ensure the value has the correct format
                let key = parts[1];
                let value = Number(parts[2]);
                let obj = {};
                obj[key] = value;
                arr.push(obj);
            } else {
                console.warn(`Invalid accessory option value: ${element.value}`);
            }
        });
        // console.log(arr);
        // console.log(objKeyValueSum(arr));


        //기본 obj 선언
        let defaultObj = {
            "addDamagePer": 0,
            "finalDamagePer": 1,
            "weaponAtkPlus": 0,
            "weaponAtkPer": 0,
            "atkPlus": 0,
            "atkPer": 0,
            "criticalChancePer": 0,
            "criticalDamagePer": 0,
            "stigmaPer": 0,
            "atkBuff": 0,
            "damageBuff": 0,
            "enlightPoint": 0,
            "carePower": 1,
        };

        result = objKeyValueSum(arr, defaultObj); // defaultObj 추가
        result.finalDamagePer *= ((result.criticalChancePer * 0.684) / 100 + 1)
        result.finalDamagePer *= ((result.criticalDamagePer * 0.3625) / 100 + 1)
        result.finalDamagePer *= ((result.weaponAtkPer * 0.4989) / 100 + 1)
        result.finalDamagePer *= ((result.atkPer * 0.9246) / 100 + 1)
        return result;
    }
    // accessoryValueToObj()
    // console.log(accessoryValueToObj())

    /* **********************************************************************************************************************
    * function name		:	objKeyValueSum(objArr)
    * description		: 	악세서리 옵션의 key값이 동일한 경우 합연산 또는 곱연산
    *********************************************************************************************************************** */
    function objKeyValueSum(objArr, defaultObj) { // defaultObj 매개변수 추가
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
        const combinedObj = { ...defaultObj }; // 기본 객체 복사
        for (const key in grouped) {
            if (key === "finalDamagePer") {
                // finalDamagePer는 곱셈
                combinedObj[key] = Number(grouped[key].reduce((acc, val) => acc * val, 1).toFixed(2));
            } else {
                // 기타 스텟은 덧셈
                combinedObj[key] = Number(grouped[key].reduce((acc, val) => acc + val, 0).toFixed(2));
            }
        }
        //defaultObj에 존재하지만 combinedObj에 존재하지 않는 요소 추가
        for (const key in defaultObj) {
            if (!combinedObj.hasOwnProperty(key)) {
                combinedObj[key] = defaultObj[key];
            }
        }

        return combinedObj;
    }


    /* **********************************************************************************************************************
     * function name		:	gemInfoChangeToJson()
     * description			: 	변경된 보석정보의 수치를 계산하여 JSON데이터를 변경함
     *********************************************************************************************************************** */

    // let gemCalcResultAllInfo = await calculateGemData(cachedData);
    function gemInfoChangeToJson() {
        let elements = document.querySelectorAll(".gem-area .gem-box");
        elements.forEach(element => {
            let index = Number(element.getAttribute("data-index"));
            let level = Number(element.querySelector(".level").value);
            let gem = element.querySelector(".gems").value;
            let gemDataJSON = cachedData.ArmoryGem.Gems[index];
            gemDataJSON.Level = level;
            gemDataJSON.Name = modifyGemString(gemDataJSON.Name, level, gem);
            gemDataJSON.Tooltip = modifyGemStringInJsonString(gemDataJSON.Tooltip, level, gem);
            cachedData.ArmoryGem.Gems[index] = gemDataJSON;
            // console.log(gemDataJSON)
        })


        /* **********************************************************************************************************************
         * function name		:	modifyGemString
         * description			: 	보석 문자열 데이터를 변경함. 레벨과 보석이름을 변경할 수 있으며, (귀속) 문자열 유무를 판별하여 분기처리함.
         *********************************************************************************************************************** */
        function modifyGemString(gemString, newLevel, newGemName) {
            // 정규 표현식을 사용하여 레벨, 보석 이름, (귀속) 유무를 추출합니다.
            const regex = /<FONT COLOR='#F99200'>(\d+)레벨\s(.*?)(?:\s\(귀속\))?<\/FONT>/;
            const match = gemString.match(regex);

            if (match) {
                // 추출된 정보를 사용하여 새로운 문자열을 생성합니다.
                const originalLevel = match[1];
                const originalGemName = match[2];
                const isBound = match[3] !== undefined; // (귀속)이 존재하면 true, 없으면 false

                let modifiedString;
                if (isBound) {
                    modifiedString = gemString.replace(regex, `<FONT COLOR='#F99200'>${newLevel}레벨 ${newGemName} (귀속)</FONT>`);
                } else {
                    modifiedString = gemString.replace(regex, `<FONT COLOR='#F99200'>${newLevel}레벨 ${newGemName}</FONT>`);
                }
                return modifiedString;
            } else {
                // 매칭되는 부분이 없을 경우, 원본 문자열을 그대로 반환합니다.
                console.error("보석 문자열 패턴이 일치하지 않습니다.");
                return gemString;
            }
        }

        /* **********************************************************************************************************************
         * function name		:	modifyGemStringInJsonString
         * description			: 	주어진 JSON 문자열 내에서 특정 보석의 레벨과 이름을 변경합니다.
         *                          JSON으로 파싱하지 않고 문자열 조작으로 처리합니다.
         *                          기존 레벨, 기존 이름 매개변수를 제거하고 정규표현식으로 찾아서 변경하도록 수정
         * parameter :
         * jsonString           :   수정할 JSON 형태의 문자열
         * newLevel             :   변경할 새로운 보석 레벨 (숫자)
         * newGemName           :   변경할 새로운 보석 이름 (문자열)
         *********************************************************************************************************************** */
        function modifyGemStringInJsonString(jsonString, newLevel, newGemName) {
            // 유효성 검사
            if (typeof jsonString !== 'string' || typeof newLevel !== 'number' || typeof newGemName !== 'string') {
                console.error("Invalid input: jsonString must be a string, newLevel must be a number, and newGemName must be a string.");
                return jsonString; // 오류 발생 시 원본 문자열 반환
            }

            // 1. NameTagBox value의 패턴을 찾습니다.
            //    - <P ALIGN='CENTER'><FONT COLOR='#F99200'>: 시작 태그
            //    - (\d+)레벨 : 숫자를 캡쳐
            //    - (.*?): 레벨 뒤에 오는 임의의 문자열을 캡처합니다. (이것이 보석 이름입니다)
            //    - (?: \\(귀속\\))?: "(귀속)" 이라는 텍스트가 있을 수도 있고 없을 수도 있습니다.
            //    - <\/FONT><\/P>: 끝 태그
            const nameTagRegex = /<P ALIGN='CENTER'><FONT COLOR='#F99200'>(\d+)레벨 (.*?)(?: \(귀속\))?<\/FONT><\/P>/;

            // 2. SingleTextBox value의 패턴을 찾습니다.
            //   - 보석 레벨 (\d+): 숫자를 캡쳐
            const gemLevelRegex = /보석 레벨 (\d+)/;

            let modifiedJsonString = jsonString;

            // 1. NameTagBox의 value 수정
            modifiedJsonString = modifiedJsonString.replace(nameTagRegex, (match, oldLevel, oldGemName, isBound) => {
                // match: 전체 일치 문자열
                // oldLevel: (\d+) 에 해당하는 기존 레벨
                // oldGemName: (.*?) 에 해당하는 보석 이름
                // isBound : 귀속 여부
                //console.log("nameTagRegex nameTagRegex nameTagRegex match:" , match)
                //console.log("nameTagRegex nameTagRegex nameTagRegex oldLevel:" , oldLevel)
                //console.log("nameTagRegex nameTagRegex nameTagRegex oldGemName:" , oldGemName)
                //console.log("nameTagRegex nameTagRegex nameTagRegex isBound:" , isBound)
                if (match.includes('(귀속)')) {
                    return `<P ALIGN='CENTER'><FONT COLOR='#F99200'>${newLevel}레벨 ${newGemName} (귀속)</FONT></P>`;
                } else {
                    return `<P ALIGN='CENTER'><FONT COLOR='#F99200'>${newLevel}레벨 ${newGemName}</FONT></P>`;
                }
            });

            // 2. SingleTextBox의 value 수정
            modifiedJsonString = modifiedJsonString.replace(gemLevelRegex, `보석 레벨 ${newLevel}`);

            return modifiedJsonString;
        }
    }


    gemInfoChangeToJson()

    /* **********************************************************************************************************************
     * function name		:	karmaRankToValue()
     * description			: 	카르마 랭크를 accObj.weaponAtkPer 수치로 변환
     *********************************************************************************************************************** */

    function karmaRankToValue() {
        let result = 1
        let enlightKarmaElements = document.querySelectorAll(".ark-list.enlightenment .ark-item")[5].querySelectorAll("input[type=radio]");
        enlightKarmaElements.forEach((karma, idx) => {
            if (karma.checked) {
                result = Number(karma.value);
            }
        })
        return result;
    }
    console.log(karmaRankToValue())

    /* **********************************************************************************************************************
     * function name		:	gemAttackBonusValueCalc
     * description			: 	진,깨,도 수치를 반환
     *********************************************************************************************************************** */

    function arkPassiveValue() {
        let result = {
            enlightenmentDamage: 0,
            enlightenmentBuff: 0,
            evolutionDamage: 0,
            leapDamage: 0
        }
        let enlightElement = Number(document.querySelector(".ark-area .title-box.enlightenment .title").textContent);
        let evolutionElement = Number(document.querySelector(".ark-area .title-box.evolution .title").textContent);
        let leapElement = Number(document.querySelector(".ark-area .title-box.leap .title").textContent)

        if (evolutionElement >= 120) { //  == 진화수치
            result.evolutionDamage += 1.45
        } else if (evolutionElement >= 105) {
            result.evolutionDamage += 1.35
        } else if (evolutionElement >= 90) {
            result.evolutionDamage += 1.30
        } else if (evolutionElement >= 80) {
            result.evolutionDamage += 1.25
        } else if (evolutionElement >= 70) {
            result.evolutionDamage += 1.20
        } else if (evolutionElement >= 60) {
            result.evolutionDamage += 1.15
        } else if (evolutionElement >= 50) {
            result.evolutionDamage += 1.10
        } else if (evolutionElement >= 40) {
            result.evolutionDamage += 1
        }



        if (enlightElement >= 100) { // enlightElement == 깨달음수치
            result.enlightenmentDamage += 1.42
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 98) {
            result.enlightenmentDamage += 1.40
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 97) {
            result.enlightenmentDamage += 1.37
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 96) {
            result.enlightenmentDamage += 1.37
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 95) {
            result.enlightenmentDamage += 1.36
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 94) {
            result.enlightenmentDamage += 1.36
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 93) {
            result.enlightenmentDamage += 1.35
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 92) {
            result.enlightenmentDamage += 1.35
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 90) {
            result.enlightenmentDamage += 1.34
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 88) {
            result.enlightenmentDamage += 1.33
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 86) {
            result.enlightenmentDamage += 1.28
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 84) {
            result.enlightenmentDamage += 1.27
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 82) {
            result.enlightenmentDamage += 1.26
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 80) {
            result.enlightenmentDamage += 1.25
            result.enlightenmentBuff += 1.33
        } else if (enlightElement >= 78) {
            result.enlightenmentDamage += 1.18
            result.enlightenmentBuff += 1.32
        } else if (enlightElement >= 76) {
            result.enlightenmentDamage += 1.17
            result.enlightenmentBuff += 1.31
        } else if (enlightElement >= 74) {
            result.enlightenmentDamage += 1.16
            result.enlightenmentBuff += 1.30
        } else if (enlightElement >= 72) {
            result.enlightenmentDamage += 1.15
            result.enlightenmentBuff += 1.29
        } else if (enlightElement >= 64) {
            result.enlightenmentDamage += 1.13
            result.enlightenmentBuff += 1.28
        } else if (enlightElement >= 56) {
            result.enlightenmentDamage += 1.125
            result.enlightenmentBuff += 1.27
        } else if (enlightElement >= 48) {
            result.enlightenmentDamage += 1.12
            result.enlightenmentBuff += 1.26
        } else if (enlightElement >= 40) {
            result.enlightenmentDamage += 1.115
            result.enlightenmentBuff += 1.25
        } else if (enlightElement >= 32) {
            result.enlightenmentDamage += 1.11
            result.enlightenmentBuff += 1.24
        } else if (enlightElement >= 24) {
            result.enlightenmentDamage += 1.10
            result.enlightenmentBuff += 1.23
        } else {
            result.enlightenmentDamage += 1
        }


        if (leapElement >= 70) { // leapElement == 도약 수치
            result.leapDamage += 1.15
        } else if (leapElement >= 68) {
            result.leapDamage += 1.14
        } else if (leapElement >= 66) {
            result.leapDamage += 1.13
        } else if (leapElement >= 64) {
            result.leapDamage += 1.12
        } else if (leapElement >= 62) {
            result.leapDamage += 1.11
        } else if (leapElement >= 60) {
            result.leapDamage += 1.10
        } else if (leapElement >= 50) {
            result.leapDamage += 1.05
        } else if (leapElement >= 40) {
            result.leapDamage += 1.03
        } else {
            result.leapDamage += 1
        }

        return result
    }

    /* **********************************************************************************************************************
     * function name		:	gemAttackBonusValueCalc
     * description			: 	작열,겁화 보석 공격력 보너스 계산 (gemAttackBonusObj에 적용함)
     *********************************************************************************************************************** */

    let gemCalcResultAllInfo = await calculateGemData(cachedData);
    // console.log(gemCalcResultAllInfo)
    function gemAttackBonusValueCalc() {
        let result = 0;
        if (gemCalcResultAllInfo && gemCalcResultAllInfo.gemSkillArry) {
            // let gemAttackBonusObj = [
            //     { name: "겁화", level1: 0, level2: 0.05, level3: 0.1, level4: 0.2, level5: 0.3, level6: 0.45, level7: 0.6, level8: 0.8, level9: 1.00, level10: 1.2 },
            //     { name: "작열", level1: 0, level2: 0.05, level3: 0.1, level4: 0.2, level5: 0.3, level6: 0.45, level7: 0.6, level8: 0.8, level9: 1.00, level10: 1.2 },
            // ];
            let gemAttackBonus = [0, 0.05, 0.1, 0.2, 0.3, 0.45, 0.6, 0.8, 1.00, 1.2];
            gemCalcResultAllInfo.gemSkillArry.forEach((gemTag, idx) => {
                if (/겁화|작열/.test(gemTag.name)) {
                    result += gemAttackBonus[gemTag.level - 1];
                }
            })
        }
        return result;
    }
    // console.log(gemAttackBonusValueCalc())

    /* **********************************************************************************************************************
     * function name		:	simulatorDataToextractValue
     * description			: 	최종 시뮬레이터 결과를 extractValue에 반영
     *********************************************************************************************************************** */
    function simulatorDataToExtractValue() {
        extractValue.gemAttackBonus = gemAttackBonusValueCalc();
        extractValue.abilityAttackBonus = stoneLevelBuffStat();

        extractValue.accObj = accessoryValueToObj();
        extractValue.arkObj = arkPassiveValue();
        // extractValue.bangleObj = "팔찌 OBJ";
        // extractValue.armorStatus = "장비 + 악세 힘/민/지 합산값 넣으면 됨"
        // extractValue.defaultObj = "addDamaePer = 무기 품질 계산식 추가해서 결과값 여기에 넣고, weaponAtk = 무기 공격력 받아와서 넣으면 됨 그리고 crit,hase,special 받아와야 함"
        // extractValue.elixirObj = "엘릭서에서 받아온 값 다 넣으면 됨"
        // extractValue.engObj = "각인 finalDamagePer, engBonusPer 받아오면 됨"
        // extractValue.expeditionStats = 725 + "하드코딩, 원정대 레벨 계산식 추가해서 박으면 됨"
        // extractValue.finalGemDamageRate = "있는거 다 받아오면 됨"
        // extractValue.gemObj = "위에껀 딜러용이고, 이건 서폿용. 다 받아오면됨"
        // extractValue.hyperObj = "안에 있는 거 다 받아오면됨"
        // extractValue.jobObj = "없애도 됨 필요 없음"
    }
    simulatorDataToExtractValue()

    /* **********************************************************************************************************************
     * function name		:	specPointCalc
     * description			: 	최종 스펙포인트 계산식
     *********************************************************************************************************************** */

    let originSpecPoint = await Modules.calcValue.specPointCalc(extractValue)

}
simulatorInputCalc()
document.body.addEventListener('change', () => { simulatorInputCalc() })




/* **********************************************************************************************************************
* function name		:	selectCreate(data)
* data              :   유저 JSON데이터
* description		: 	시뮬레이터 정보를 이용해 html을 생성
*********************************************************************************************************************** */
async function selectCreate(data) {

    /* **********************************************************************************************************************
    * function name		:	Modules
    * description		: 	모든 외부모듈 정의
    *********************************************************************************************************************** */
    let Modules = await importModuleManager()


    /* **********************************************************************************************************************
    * variable name		:	supportCheck
    * description	    : 	2차 직업명 출력 변수
    *********************************************************************************************************************** */

    let supportCheck = await secondClassCheck(data)




    /* **********************************************************************************************************************
    * function name		:	engFilterToOptions()
    * description	    : 	각인 옵션을 생성하고 사용자의 직업에 따라 무효각인의 경우 무효를 표시해줌
    *********************************************************************************************************************** */

    function engFilterToOptions() {
        let engNameObj
        if (supportCheck !== "서폿") {
            engNameObj = Modules.simulatorFilter.engFilter.dealer.filter((obj, index, self) =>
                index === self.findIndex((o) => (
                    o.name === obj.name
                ))
            );
        } else {
            engNameObj = Modules.simulatorFilter.engFilter.support.filter((obj, index, self) =>
                index === self.findIndex((o) => (
                    o.name === obj.name
                ))
            );
        }


        // calcModule.supportCheck(data) 값과 일치하는 job의 block 값 제거
        Modules.originFilter.engravingCalFilter.forEach(filter => {
            if (filter.job === supportCheck) {
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


        optionCreate(commonElixirElements, Modules.simulatorFilter.elixirOptionData.common)

        optionCreate(helmetElixirElement, Modules.simulatorFilter.elixirOptionData.helmet)
        optionCreate(helmetElixirElement, Modules.simulatorFilter.elixirOptionData.common, "common")

        optionCreate(shoulderElixirElement, Modules.simulatorFilter.elixirOptionData.shoulder)
        optionCreate(shoulderElixirElement, Modules.simulatorFilter.elixirOptionData.common, "common")

        optionCreate(armorElixirElement, Modules.simulatorFilter.elixirOptionData.armor)
        optionCreate(armorElixirElement, Modules.simulatorFilter.elixirOptionData.common, "common")

        optionCreate(pantsElixirElement, Modules.simulatorFilter.elixirOptionData.pants)
        optionCreate(pantsElixirElement, Modules.simulatorFilter.elixirOptionData.common, "common")

        optionCreate(gloveElixirElement, Modules.simulatorFilter.elixirOptionData.glove)
        optionCreate(gloveElixirElement, Modules.simulatorFilter.elixirOptionData.common, "common")

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
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3RelicData.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3RelicData.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3RelicData.ring, "특옵");
                        }
                        optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3RelicData.common, "공용");
                    } else if (tier === "T3고대") {
                        if (tag === "목걸이") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3MythicData.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3MythicData.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3MythicData.ring, "특옵");
                        }
                        optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t3MythicData.common, "공용");
                    } else if (tier === "T4유물" || tier === "T4고대") {
                        if (tag === "목걸이") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t4Data.necklace, "특옵");
                        } else if (tag === "귀걸이") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t4Data.earing, "특옵");
                        } else if (tag === "반지") {
                            optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t4Data.ring, "특옵");
                        }
                        optionCreate(siblingElement, Modules.simulatorFilter.accessoryOptionData.t4Data.common, "공용");
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
                    createOption(element, Modules.simulatorFilter.bangleOptionData.t3RelicData)
                } else if (tier.value === "T3유물") {
                    createOption(element, Modules.simulatorFilter.bangleOptionData.t3MythicData)
                } else if (tier.value === "T4유물") {
                    createOption(element, Modules.simulatorFilter.bangleOptionData.t4RelicData)
                } else if (tier.value === "T4고대") {
                    createOption(element, Modules.simulatorFilter.bangleOptionData.t4MythicData)
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
            // 모든 stoneElement에 현재 선택된 각인을 option으로 추가
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
    document.querySelector(".engraving-area").addEventListener("change", () => { userEngToStoneOption() })

    /* **********************************************************************************************************************
    * function name		:	bangleStatsOptionLimit()
    * description	    : 	캐릭터의 1차 직업을 기준으로 힘민지의 무효 표시를 생성함
    *********************************************************************************************************************** */

    function bangleStatsOptionLimit() {
        let elements = document.querySelectorAll(".accessory-item.bangle .stats");
        let validStats = Modules.originFilter.bangleJobFilter.find(jobFilter => jobFilter.job === data.ArmoryProfile.CharacterClassName);
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
    * function name		:	userLevelAccessoryToEnlight()
    * description	    : 	유저레벨정보와 악세서리를 기반으로 깨달음 수치 계산
    *********************************************************************************************************************** */

    function userLevelAccessoryToEnlight() {
        let elements = document.querySelectorAll(".accessory-item .accessory");
        let levelEvolution = Math.max(data.ArmoryProfile.CharacterLevel - 50, 0);
        elements.forEach(element => {
            let tier = element.value.split(":")[0];
            let tag = element.value.split(":")[1];
            if (/T3고대|T3유물|T4유물/.test(tier)) {
                if (tag === "목걸이") {
                    levelEvolution += 10;
                } else if (tag === "귀걸이") {
                    levelEvolution += 9;
                } else if (tag === "반지") {
                    levelEvolution += 9;
                }
            } else if (/T4고대/.test(tier)) {
                if (tag === "목걸이") {
                    levelEvolution += 13;
                } else if (tag === "귀걸이") {
                    levelEvolution += 12;
                } else if (tag === "반지") {
                    levelEvolution += 12;
                }
            }
        })
        // document.querySelectorAll(".ark-list .title")[1].textContent = levelEvolution;
        // console.log(levelEvolution)
        return levelEvolution
    }
    userLevelAccessoryToEnlight()

    /* **********************************************************************************************************************
    * function name		:	collectToKarma()
    * description	    : 	내실 및 카르마 수치 계산
    *********************************************************************************************************************** */

    function collectToKarma() {
        let collectElements = document.querySelectorAll(".ark-list.enlightenment .ark-item input[type=checkbox]");
        let level = stringToNumber(data.ArmoryProfile.ItemAvgLevel);
        function stringToNumber(str) {
            const commaRemoved = str.replace(/,/g, '');
            const number = parseFloat(commaRemoved);
            return number;
        }
        if (level < 1670) {
            collectElements.forEach((element, idx) => {
                let collectValue = data.ArkPassive.Points[1].Value - userLevelAccessoryToEnlight();
                if (collectValue === 14) {
                    element.checked = true;
                } else if (collectValue === 11) {
                    element.checked = true;
                    collectElements[2].checked = false;
                } else if (collectValue === 9) {
                    element.checked = true;
                    collectElements[3].checked = false;
                } else if (collectValue === 8) {
                    collectElements[0].checked = true;
                    collectElements[3].checked = true;
                } else if (collectValue === 6) {
                    collectElements[0].checked = true;
                    collectElements[1].checked = true;
                } else if (collectValue === 5) {
                    collectElements[3].checked = true;
                } else if (collectValue === 3) {
                    collectElements[0].checked = true;
                }
                console.log(collectValue)
            })
            document.querySelectorAll(".ark-list.enlightenment .ark-item")[5].querySelectorAll("input[type=radio]").forEach(radio => {
                radio.disabled = true;
            })
        } else {
            collectElements.forEach(element => {
                element.checked = true;
            })
            let karma = Math.max(1, Math.min(7, data.ArkPassive.Points[1].Value - userLevelAccessoryToEnlight() - 14 + 1));
            document.querySelectorAll(".ark-list.enlightenment .ark-item")[5].querySelectorAll("input[type=radio]")[karma - 1].checked = true;
        }
    }
    collectToKarma()

    /* **********************************************************************************************************************
    * function name		:	enlightValueChange()
    * description	    : 	깨달음 포인트를 유저에게 표시해줌
    *********************************************************************************************************************** */

    function enlightValueChange() {
        let karmaElements = document.querySelectorAll(".ark-list.enlightenment .ark-item")[5].querySelectorAll("input[type=radio]");
        let collectElements = document.querySelectorAll(".ark-list.enlightenment .ark-item input[type=checkbox]");
        let enlightValue = userLevelAccessoryToEnlight()

        karmaElements.forEach((karma, idx) => {
            if (karma.checked) {
                enlightValue += idx;
            }
        })
        collectElements.forEach(collect => {
            if (collect.checked) {
                enlightValue += Number(collect.value);
            }
        })

        document.querySelectorAll(".ark-list .title")[1].textContent = enlightValue;
    }
    enlightValueChange()

    /* **********************************************************************************************************************
    * function name		:	bangleToLeafPoint()
    * description	    : 	도약포인트 표시 및 카르마 수치 계산
    *********************************************************************************************************************** */

    function bangleToLeafPoint() {
        let leafPoint = (data.ArmoryProfile.CharacterLevel - 50) * 2;
        let element = document.querySelector(".accessory-item.bangle .tier");
        if (element.value === "T4유물") {
            leafPoint += 9;
        } else if (element.value === "T4고대") {
            leafPoint += 18;
        }
        // console.log(leafPoint)
        let leap = document.querySelector(".ark-list.leap .title");
        leap.textContent = leafPoint;
        return leafPoint;
    }

    /* **********************************************************************************************************************
    * function name		:	leafPointToKarmaSelect
    * description	    : 	유저의 도약 카르마랭크를 선택함
    *********************************************************************************************************************** */

    function leafPointToKarmaSelect() {
        let karmaValue = Math.min((data.ArkPassive.Points[2].Value - bangleToLeafPoint()) / 2, 6);
        let radioElements = document.querySelectorAll('.ark-list.leap input[type=radio]');
        // console.log(karmaValue)
        radioElements[karmaValue].checked = true;
        radioElements.forEach(radio => {
            if (radio.checked) {
                radioElements[karmaValue - 0].checked = true;
            }
        })
    }

    /* **********************************************************************************************************************
    * function name		:	showLeafInfo
    * description	    : 	선택옵션에 따라 도약포인트 표시를 변경해줌
    *********************************************************************************************************************** */

    function showLeafInfo() {
        let karmaElements = document.querySelectorAll(".ark-list.leap input[type=radio]");
        let leafPoint = bangleToLeafPoint();
        karmaElements.forEach((karma, idx) => {
            if (karma.checked) {
                leafPoint = bangleToLeafPoint() + (idx + 0) * 2
            }
        })
        let leaf = document.querySelector(".ark-list.leap .title");
        leaf.textContent = leafPoint;

    }
    /* **********************************************************************************************************************
    * function name		:	userGemEquipmentToOption()
    * description	    : 	유저가 실제 착용중인 보석 정보를 이용해 html생성
    *********************************************************************************************************************** */

    let gemCalcResultAllInfo = await calculateGemData(data);
    function userGemEquipmentToOption() {
        let element = document.querySelector(".gem-area");
        if (gemCalcResultAllInfo && gemCalcResultAllInfo.gemSkillArry) {
            let customHtml = "";
            element.innerHTML = "";
            gemCalcResultAllInfo.gemSkillArry.forEach((gemElementObj, idx) => {
                // console.log(gemElementObj.level)
                let gemTag = ``;
                if (/멸화|겁화/.test(gemElementObj.name)) {
                    gemTag = `
                        <option value="멸화">멸화</option>
                        <option value="겁화">겁화</option>`;
                } else if (/홍염|작열/.test(gemElementObj.name)) {
                    gemTag = `
                        <option value="홍염">홍염</option>
                        <option value="작열">작열</option>`;
                }
                if (gemElementObj.skill.includes(":")) {
                    gemElementObj.skill = gemElementObj.skill.split(":")[1].trim()
                }
                customHtml += `
                    <div class="gem-box radius common-background" data-index="${idx}">
                        <select class="level" name="ArmoryGem Gems Level" data-max="10" data-select="${gemElementObj.level}">
                        </select>
                        <select class="gems" data-select="${gemElementObj.name}">
                            ${gemTag}
                        </select>
                        <span class="skill">${gemElementObj.skill}</span>
                    </div>`;
            })
            element.innerHTML = customHtml;
            sortGemInfo(".gem-area")
        } else {
            element.innerHTML = `<span style="display: flex;width: 100%;height: 100%;justify-content: center;align-items: center;font-size:18px;">보석없음</span>`;
        }
    }
    userGemEquipmentToOption()


    /* **********************************************************************************************************************
    * function name		:	gemSimpleChangeButtonExtend()
    * description	    :   보석 선택 일괄변경
    *********************************************************************************************************************** */
    function gemSimpleChangeButtonExtend() {
        let element = document.querySelector(".simple-option-area .extend-button");
        let optionList = element.parentElement.querySelector(".extend-list");
        element.addEventListener("click", () => {
            element.classList.toggle("on");
            optionList.classList.toggle("on");
        })
        optionList.querySelectorAll(".extend-item").forEach(element => {
            element.addEventListener("click", () => {
                document.querySelectorAll(".gem-area .gem-box").forEach((gem) => {
                    const levelInput = gem.querySelector(".level");
                    // const gemsSelect = gem.querySelector(".gems");

                    levelInput.dispatchEvent(new Event('change', { bubbles: true }));
                    // gemsSelect.dispatchEvent(new Event('change', { bubbles: true }));  
                    gem.querySelector(".level").value = element.getAttribute("data-once");
                    if (/겁화|멸화/.test(gem.querySelector(".gems").value)) {
                        gem.querySelector(".gems").value = "겁화"
                    }
                    if (/홍염|작열/.test(gem.querySelector(".gems").value)) {
                        gem.querySelector(".gems").value = "작열"
                    }
                })
            })
        })

    }
    gemSimpleChangeButtonExtend()

    /* **********************************************************************************************************************
    * function name		:	userLevelAndArmorToEvolution()
    * description	    : 	진화포인트 계산
    *********************************************************************************************************************** */

    function userLevelAndArmorToEvolution() {
        let levelEvolution = Math.max(data.ArmoryProfile.CharacterLevel - 50, 0);
        let elements = document.querySelectorAll(".armor-item .plus");
        elements.forEach((element, idx) => {
            if (idx !== 5) {
                if (/T3 고대|T4 유물/.test(element.options[element.selectedIndex].text)) {
                    levelEvolution += 16;
                } else if (/T4 고대/.test(element.options[element.selectedIndex].text)) {
                    levelEvolution += 20;
                }
            }
        })

        let evolutionElement = document.querySelectorAll(".ark-list .title")[0];
        evolutionElement.textContent = levelEvolution;
    }
    


    /* **********************************************************************************************************************
    * function name		:	applyDataMinMaxToOptions()
    * description	    : 	data-min data-max값을 이용하여 select 드롭박스 숫자값 자동생성
    *********************************************************************************************************************** */

    function sortGemInfo(parentSelector) {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) {
            console.error(`Parent element not found with selector: ${parentSelector}`);
            return;
        }

        const gemElements = Array.from(parentElement.children); //자식요소만 가져오도록 수정.
        if (gemElements.length === 0) {
            console.warn(`No child elements found within: ${parentSelector}`);
            return;
        }

        // 정렬 로직
        gemElements.sort((a, b) => {
            const aText = a.textContent;
            const bText = b.textContent;

            // 멸화, 겁화가 우선순위
            const aIsDamage = /멸화|겁화/.test(aText);
            const bIsDamage = /멸화|겁화/.test(bText);

            if (aIsDamage && !bIsDamage) {
                return -1; // a가 멸화 또는 겁화이고 b가 아니면 a가 먼저
            }
            if (!aIsDamage && bIsDamage) {
                return 1; // b가 멸화 또는 겁화이고 a가 아니면 b가 먼저
            }

            // a와 b가 모두 멸화 또는 겁화이거나 모두 아니면 순서 변경 없음 (원래 순서 유지)
            return 0;
        });

        // 정렬된 순서대로 다시 추가
        parentElement.innerHTML = ''; // 기존의 하위 요소 모두 제거
        gemElements.forEach(gemElement => {
            parentElement.appendChild(gemElement);
        });
    }

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
    * function name		:	engravingAutoSelect()
    * description	    : 	유저 각인 정보를 바탕으로 각인 자동선택
    *********************************************************************************************************************** */
    function engravingAutoSelect() {
        let elements = document.querySelectorAll(".engraving-area .engraving-box");
        elements.forEach((element, index) => {
            let nameSelect = element.querySelector(".engraving-name");
            let gradeSelect = element.querySelector(".grade");
            let icoSelect = element.querySelector(".engraving-ico");
            let relicIcoSelect = element.querySelector(".relic-ico");


            // "없음" 옵션이 있는지 확인하고, 없으면 추가
            // if (!nameSelect.querySelector("option[value='없음']")) {
            //     let noneOptionName = document.createElement("option");
            //     noneOptionName.value = "없음";
            //     noneOptionName.textContent = "없음";
            //     nameSelect.appendChild(noneOptionName);
            // }
            // if (!gradeSelect.querySelector("option[value='0']")) {
            //     let noneOptionGrade = document.createElement("option");
            //     noneOptionGrade.value = 0;
            //     noneOptionGrade.textContent = "없음";
            //     gradeSelect.appendChild(noneOptionGrade);
            // }

            // if (!icoSelect.querySelector("option[value='없음']")) {
            //     let noneOptionIco = document.createElement("option");
            //     noneOptionIco.value = "없음";
            //     noneOptionIco.textContent = "없음";
            //     icoSelect.appendChild(noneOptionIco);
            // }
            // if (!relicIcoSelect.querySelector("option[value='없음']")) {
            //     let noneOptionRelic = document.createElement("option");
            //     noneOptionRelic.value = "없음";
            //     noneOptionRelic.textContent = "없음";
            //     relicIcoSelect.appendChild(noneOptionRelic);
            // }


            // data.ArmoryEngraving.ArkPassiveEffects 배열 순회
            if (data.ArmoryEngraving) {
                if (data.ArmoryEngraving.ArkPassiveEffects && index < data.ArmoryEngraving.ArkPassiveEffects.length) {
                    let arkEffect = data.ArmoryEngraving.ArkPassiveEffects[index];
                    let targetName = arkEffect.Name;
                    let selectedOption = null;

                    // "이름 - 무효" 옵션 먼저 찾기
                    selectedOption = nameSelect.querySelector(`option[value='${targetName} - 무효']`);

                    if (selectedOption) {
                        // "이름 - 무효" 옵션이 있으면 선택하고 종료
                        nameSelect.value = `${targetName} - 무효`;
                    } else {
                        // "이름 - 무효" 옵션이 없으면 "이름" 옵션 찾기
                        selectedOption = nameSelect.querySelector(`option[value='${targetName}']`);

                        if (selectedOption) {
                            // "이름" 옵션이 있으면 선택
                            nameSelect.value = targetName;
                        } else {
                            // 둘 다 없으면 "이름 - 무효" 옵션 생성 및 선택
                            let newOption = document.createElement("option");
                            newOption.value = `${targetName} - 무효`;
                            newOption.textContent = `${targetName} - 무효`;
                            nameSelect.appendChild(newOption);
                            nameSelect.value = `${targetName} - 무효`;
                        }
                    }
                    // gradeSelect에 옵션 추가 (중복 방지)
                    if (!gradeSelect.querySelector(`option[value='${arkEffect.Level}']`)) {
                        let gradeOption = document.createElement("option");
                        gradeOption.value = arkEffect.Level;
                        gradeOption.textContent = arkEffect.Level;
                        gradeSelect.appendChild(gradeOption);
                    }
                    gradeSelect.value = arkEffect.Level;

                    // relicIcoSelect에 옵션 추가 (중복 방지)
                    if (!relicIcoSelect.querySelector(`option[value='${arkEffect.Grade}']`)) {
                        let relicOption = document.createElement("option");
                        relicOption.value = arkEffect.Grade;
                        relicOption.textContent = arkEffect.Grade;
                        relicIcoSelect.appendChild(relicOption);
                    }
                    relicIcoSelect.value = arkEffect.Grade;
                }
            } else {
                nameSelect.value = "없음";
                gradeSelect.value = 0;
                relicIcoSelect.value = "없음"
            }
        });
    }
    engravingAutoSelect()
    userEngToStoneOption() //각인이 생성된 이후 어빌리티스톤 옵션 생성

    /* **********************************************************************************************************************
    * function name		:	stoneAutoSelect()
    * description	    : 	어빌리티스톤(돌맹이)를 실제 유저의 정보에 맞춰 설정
    *********************************************************************************************************************** */
    function stoneAutoSelect() {
        const buffSelects = document.querySelectorAll(".buff-wrap .buff");
        const abilityStone = data.ArmoryEquipment.find(item => item.Type === "어빌리티 스톤");
        if (!abilityStone) {
            console.warn("어빌리티 스톤을 찾을 수 없습니다.");
            return;
        }

        const tooltip = abilityStone.Tooltip;
        const engravings = [];

        // 정규 표현식 수정
        const regex = /<FONT COLOR='#FFFFFF'>\[<FONT COLOR='#FFFFAC'>(.*?)<\/FONT>\] <img.*?><\/img>Lv\.(\d+)<\/FONT><BR>/g;

        let match;
        while ((match = regex.exec(tooltip)) !== null) {
            const name = match[1];
            const level = parseInt(match[2], 10);
            engravings.push({ name, level });
        }
        buffSelects.forEach((select, index) => {
            if (index >= engravings.length) return;

            const { name, level } = engravings[index];
            const targetValue = `${name}:${level}`;

            let foundOption = Array.from(select.options).find(option => option.value === targetValue);

            if (foundOption) {
                select.value = targetValue;
            } else {
                // "무효" 옵션 검색
                const invalidValue = `${name} - 무효:${level}`;
                foundOption = Array.from(select.options).find(option => option.value === invalidValue);

                if (foundOption) {
                    select.value = invalidValue
                } else {
                    // value와 일치하는 option이 없는 경우 새로운 option 생성
                    const newOption = document.createElement('option');
                    newOption.value = invalidValue;
                    newOption.text = `${name} Lv${level} - 무효`;
                    select.appendChild(newOption);
                    select.value = invalidValue;
                }
            }
        });
    }
    stoneAutoSelect()

    /* **********************************************************************************************************************
    * function name		    :	armoryTierAutoSelect()
    * description	        : 	방어구의 티어등급을 자동으로 선택해줌
    *                       :   변수설명
    * normalUpgradeValue    :   방어구의 일반 강화 수치 텍스트
    * 
    *********************************************************************************************************************** */

    function armoryTierAutoSelect() {

        data.ArmoryEquipment.forEach(armory => {
            let betweenText = betweenTextExtract(armory.Tooltip);

            let normalUpgradeValue;
            let armoryTierValue;
            let armoryTierName;
            let advancedValue;
            let specialElixir;
            let commonElixir;
            let hyperLevel;
            let hyperStar;


            partsAutoSelect("투구");
            partsAutoSelect("어깨");
            partsAutoSelect("장갑");
            partsAutoSelect("상의");
            partsAutoSelect("하의");
            partsAutoSelect("무기");

            function partsAutoSelect(partsName) {
                let elements = document.querySelectorAll(".armor-area .armor-item .armor-tag");

                if (armory.Type === partsName) {
                    normalUpgradeValue = numberExtract(betweenText.find(text => text.includes("+")));                           // +강화 수치값
                    armoryTierValue = tierValueExtract(betweenText.find(text => /\(\D*\d+\D*\)/.test(text)));                   // 티어 숫자값
                    armoryTierName = betweenText.find(text => /고대|유물|에스더/.test(text));                                   // 고대 유물 티어 풀 문자열
                    armoryTierName = armoryTierName.match(/(고대|유물|에스더)/g)[0];                                            // 고대,유물 만 추출
                    if (armoryTierName !== "에스더") {
                        armoryTierName = `T${armoryTierValue} ${armoryTierName}`;                                               // 등급 풀네임 조합 예) T4 고대
                    }
                    advancedValue = advancedUpgradeValue(betweenText);                                                          // 상급강화 수치
                    hyperLevel = hyperValueExtract(betweenText).level;                                                          // 초월 N단계
                    hyperStar = hyperValueExtract(betweenText).star;                                                            // 초월 N성

                    if (armory.Type === partsName && partsName !== "무기") {
                        specialElixir = `${elixirNameExtract(betweenText)[0].value} ${elixirNameExtract(betweenText)[0].level}`     // 고유 엘릭서 옵션
                        commonElixir = `${elixirNameExtract(betweenText)[1].value} ${elixirNameExtract(betweenText)[1].level}`      // 공용 엘릭서 옵션
                    }


                    elements.forEach(element => {
                        if (element.textContent.includes(partsName)) {
                            let parent = element.parentElement;

                            let plus = parent.querySelector(".plus");
                            optionElementAutoCheck(plus, armoryTierName, 'textContent');

                            let armorName = parent.querySelector(".armor-name");
                            optionElementAutoCheck(armorName, normalUpgradeValue, 'value');

                            let armorUpgrade = parent.querySelector('.armor-upgrade');
                            // armorUpgrade 요소에 대한 데이터 속성 추가 (advancedValue 저장)
                            armorUpgrade.dataset.advancedValue = advancedValue;

                            if (partsName !== "무기") {
                                let specialElixirElement = parent.querySelectorAll(".elixir")[0];
                                let commonElixirElement = parent.querySelectorAll(".elixir")[1];
                                optionElementAutoCheck(specialElixirElement, specialElixir, 'textContent');
                                optionElementAutoCheck(commonElixirElement, commonElixir, 'textContent');

                            }

                            let level = parent.querySelector("select.level");
                            optionElementAutoCheck(level, hyperLevel, 'value');

                            let star = parent.querySelector("select.hyper");
                            star.dataset.hyperStar = hyperStar;

                            if (!armorUpgrade.dataset.initialized && !star.dataset.initialized) {
                                armorUpgrade.dataset.initialized = 'true'; // 이미 처리된 요소인지 표시
                                star.dataset.initialized = 'true'; // 이미 처리된 요소인지 표시
                                armoryEnforceLimite(); // 해당 armor-name에 대한 option을 생성
                                hyperStageToStarCreate(); // 초월 N단계를 바탕으로 3N성 생성
                                setTimeout(() => {
                                    // 옵션이 동적으로 생성되는 시간을 고려하여 setTimeout 사용
                                    optionElementAutoCheck(armorUpgrade, armorUpgrade.dataset.advancedValue, 'value');
                                    optionElementAutoCheck(star, star.dataset.hyperStar, 'value');
                                }, 0); // 태스크 큐에 넣어서 비동기 처리하도록 함
                            }
                        }
                    })

                    // console.log("=============================================")
                    // console.log("=============================================")
                    // console.log("=============================================")
                    // console.log(normalUpgradeValue)
                    // console.log(armoryTierValue)
                    // console.log(armoryTierName)
                    // console.log(advancedValue)
                    // console.log(hyperLevel)
                    // console.log(hyperStar)


                }
            }

        });

        function numberExtract(text) {
            if (typeof text !== 'string') {
                console.error("Error: Input must be a string.");
                return null; // 입력이 문자열이 아니면 null 반환
            }
            const numberMatch = text.match(/\d+(\.\d+)?/); // 정규 표현식을 사용하여 숫자(정수 또는 소수)를 찾음 (하나만)
            if (numberMatch === null) {
                return null; // 숫자가 없으면 null 반환
            }
            return Number(numberMatch[0]); // 찾은 숫자를 숫자로 변환하여 반환
        }

        function tierValueExtract(text) {
            let regex = /\(\D*(\d+)\D*\)/;
            let value = text.match(regex)
            return Number(value[1])
        }

        function advancedUpgradeValue(text) {
            let result = 0;
            text.forEach((item, idx) => {
                if (item === "[상급 재련]") {
                    result = Number(text[idx + 2])
                }
            })
            return result;
        }

        function elixirNameExtract(text) {
            let elixirArry = []
            text.forEach((item, idx) => {
                let regex = /\[(투구|어깨|장갑|상의|하의|무기|공용)\]/
                if (regex.test(item)) {
                    let obj = {
                        tag: item,
                        value: text[idx + 1].trim().replace(/\s*\(.*?\)/g, ""),
                        level: text[idx + 2].trim()
                    }
                    if (/힘|민첩|지능/.test(text[idx + 1].trim())) {
                        obj.value = "힘/민첩/지능"
                    }
                    elixirArry.push(obj)
                }
            })

            elixirArry.sort((a, b) => {
                if (a.tag === "[공용]") return 1; // [공용]을 뒤로 보냄
                if (b.tag === "[공용]") return -1; // [공용]이 아니면 앞으로 보냄
                return 0; // 나머지는 순서 유지
            });

            if (elixirArry.length === 0) {
                let emptyObj = {
                    tag: "없음",
                    value: "없음",
                    level: "없음"
                }
                elixirArry.push(emptyObj);
                elixirArry.push(emptyObj);
            } else if (elixirArry.length === 1) {
                let emptyObj = {
                    tag: "없음",
                    value: "없음",
                    level: "없음"
                }
                elixirArry.push(emptyObj);
            }
            // console.log(elixirArry)
            return elixirArry
        }
        function hyperValueExtract(text) {
            let obj = { level: 0, star: 0 };
            text.forEach((item, idx) => {
                if (item === '[초월]') {
                    obj.level = Number(text[idx + 2]);
                    obj.star = Number(text[idx + 5].match(/\d+/)[0]);
                }
            })
            return obj
        }

    }
    armoryTierAutoSelect()

    /* **********************************************************************************************************************
    * function name		:	accessoryAutoSelect()
    * description	    : 	악세서리를 자동으로 선택하는 함수
    *********************************************************************************************************************** */

    function accessoryAutoSelect() {

        partsAutoSelect("목걸이");
        partsAutoSelect("귀걸이");
        partsAutoSelect("반지");

        function partsAutoSelect(partsName) {
            let accessoryCount = 0; // 귀걸이와 반지 개수를 세기 위한 변수

            data.ArmoryEquipment.forEach((accessory, idx) => {
                if (accessory.Type === partsName) {
                    let selectorIndex = 0;
                    let accessoryOptionCount = 0;

                    let tooltipData = betweenTextExtract(accessory.Tooltip);
                    let accessoryFilter = extractItem(Modules.simulatorFilter.accessoryOptionData);

                    let accessoryTierName = tooltipData[5].match(/(고대|유물)/g)[0];
                    let accessoryTierNumber = Number(tooltipData[10].match(/\d+/));

                    let accessoryItem = document.querySelectorAll(".accessory-list .accessory-item.accessory");

                    let accessoryStatsName = /(힘|민첩|지능)\s*\+(\d+)/g.exec(tooltipData)[1]
                    let accessoryStatsValue = Number(/(힘|민첩|지능)\s*\+(\d+)/g.exec(tooltipData)[2])

                    let matchTooltipArr = [];
                    tooltipData.forEach(tooltip => {
                        let tooltipCheck = accessoryFilter.find(filter => tooltip.includes(filter));
                        if (tooltipCheck !== undefined) {
                            matchTooltipArr.push(accessoryFilter.find(filter => tooltip.includes(filter)))
                        }
                    })
                    if (partsName === "목걸이") {
                        let necklace = document.querySelectorAll('.accessory-list .accessory-item.accessory .tier')[0];
                        let necklaceStatsElement = document.querySelectorAll('.accessory-list .accessory-item.accessory input.progress')[0];
                        let necklaceOptions = accessoryItem[0].querySelectorAll(".option");
                        optionElementAutoCheck(necklace, `T${accessoryTierNumber}${accessoryTierName}`, 'textContent');
                        necklace.dispatchEvent(new Event("change"));
                        matchTooltipArr.forEach((matchTooltip, idx) => {
                            optionElementAutoCheck(necklaceOptions[idx], matchTooltip, 'textContent');
                        })
                        necklaceStatsElement.value = accessoryStatsValue;
                    } else if (partsName === "귀걸이" || partsName === "반지") {
                        //귀걸이와 반지일경우
                        if (partsName === "귀걸이") {
                            selectorIndex = 1 + accessoryCount; // 귀걸이 1,2번
                        } else if (partsName === "반지") {
                            selectorIndex = 3 + accessoryCount; // 반지 3,4번
                        }

                        let accessoryStatsElement = document.querySelectorAll('.accessory-list .accessory-item.accessory input.progress')[selectorIndex];
                        let accessoryElement = document.querySelectorAll('.accessory-list .accessory-item.accessory .tier')[selectorIndex];
                        optionElementAutoCheck(accessoryElement, `T${accessoryTierNumber}${accessoryTierName}`, 'textContent');
                        accessoryElement.dispatchEvent(new Event("change"));
                        let accessoryDuplicationElement = accessoryItem[selectorIndex].querySelectorAll(".option");
                        matchTooltipArr.forEach((matchTooltip, idx) => {
                            optionElementAutoCheck(accessoryDuplicationElement[idx], matchTooltip, 'textContent');
                        })
                        accessoryStatsElement.value = accessoryStatsValue;
                        accessoryCount++;
                        //두번째반복문이 필요없어진이유 : partsName이 귀걸이 또는 반지일때만 selectorIndex를 정하고, 값을 입력하기 때문
                        if (accessoryCount >= 2) {
                            accessoryCount = 0
                        }
                    }

                }
            });
        }

        function extractItem(accessoryData) {
            const names = [];
            for (const category in accessoryData) {
                for (const type in accessoryData[category]) {
                    accessoryData[category][type].forEach(item => {
                        names.push(item.name);
                    });
                }
            }
            // 중복 제거
            return [...new Set(names)];
        }

    }

    accessoryAutoSelect()

    /* **********************************************************************************************************************
    * function name		:	bangleAutoSelect()
    * description	    : 	유저의 정보에 맞춰 팔찌의 option을 자동으로 선택함
    *********************************************************************************************************************** */

    function bangleAutoSelect() {

        let bangleTierData = betweenTextExtract(data.ArmoryEquipment.find(obj => obj.Type === "팔찌").Tooltip);
        let tierNumber = Number(bangleTierData[8].match(/\d+/));
        let tierName = bangleTierData[5].match(/(고대|유물)/g)[0];
        let parentElement = document.querySelector(".accessory-area .accessory-item.bangle");
        let tierElement = parentElement.querySelector(".tier");
        optionElementAutoCheck(tierElement, `T${tierNumber}${tierName}`, 'textContent');
        tierElement.dispatchEvent(new Event("change"));

        let bangleTooltip = data.ArmoryEquipment.find(obj => obj.Type === "팔찌").Tooltip.replace(/<[^>]*>/g, '');
        let bangleMergeFilter = mergeFilter(Modules.simulatorFilter.bangleOptionData);
        let optionElements = parentElement.querySelectorAll("select.option");
        let count = 0;
        // console.log(bangleTooltip)

        let userEquipOption = bangleMergeFilter.filter(filter => bangleTooltip.includes(filter.fullName));
        userEquipOption.forEach((option, idx) => {
            optionElementAutoCheck(optionElements[idx], option.name, 'textContent');
        })

        let bangleStats = parentElement.querySelectorAll(".stats");
        let bangleNumbers = parentElement.querySelectorAll("input.option");
        let bangleStatsArry = extractValues(bangleTooltip);
        bangleStatsArry.forEach((stat, idx) => {
            optionElementAutoCheck(bangleStats[idx], stat.name, 'textContent');
            bangleNumbers[idx].value = stat.value;
        })

        function extractValues(str) {
            let regex = /(치명|특화|신속|힘|민첩|지능)\s*\+(\d+)/g;
            let matches, results = [];

            while ((matches = regex.exec(str)) !== null) {
                results.push({
                    name: matches[1], // "치명", "특화", "신속"
                    value: parseInt(matches[2], 10) // 추출된 숫자 값을 정수로 변환
                });
            }
            return results;
        }
        function mergeFilter(data) {
            const extractedData = [];
            const seen = new Set(); // 중복 확인을 위한 Set

            for (const key in data) {
                if (Array.isArray(data[key])) {
                    data[key].forEach(item => {
                        const itemKey = `${item.name}-${item.grade}`; // 중복 검사를 위한 키 생성
                        if (!seen.has(itemKey)) { // 중복된 키가 없는 경우
                            extractedData.push({
                                name: item.name,
                                fullName: item.fullName
                            });
                            seen.add(itemKey); // Set에 키 추가
                        }
                    });
                }
            }
            return extractedData;
        }
    }
    bangleAutoSelect()

    /* **********************************************************************************************************************
    * function name		:	
    * description	    : 	
    *********************************************************************************************************************** */

    function bangleStatsDisable() {
        let optionElements = document.querySelectorAll(".accessory-area .accessory-item.bangle select.option");
        let bangleStatsName = document.querySelectorAll(".accessory-area .accessory-item.bangle .stats")[2];
        let bangleStatsValue = document.querySelectorAll(".accessory-area .accessory-item.bangle input.option")[2];
        optionElements.forEach(select => {
            if (select.options[select.selectedIndex].textContent === "없음") {
                bangleStatsName.disabled = false;
                bangleStatsValue.disabled = false;
            }
        })
    }
    bangleStatsDisable()

    /* **********************************************************************************************************************
    * function name		:	
    * description	    : 	data-name함수 이후 실행되어야 하는 스크립트
    *********************************************************************************************************************** */

    userLevelAccessoryToEnlight()
    collectToKarma()
    enlightValueChange()
    leafPointToKarmaSelect()
    showLeafInfo()
    userLevelAndArmorToEvolution()

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
    * function name		:	
    * description	    : 	값이 변경될때마다 재실행되어야 하는 함수 모음
    *********************************************************************************************************************** */

    document.body.addEventListener('change', () => {
        userLevelAndArmorToEvolution();
        userLevelAccessoryToEnlight();
        showLeafInfo();
        enlightValueChange();
        bangleStatsDisable();
    })
}






/* **********************************************************************************************************************
 * function name		:	secondClassCheck()
 * description			: 	2차 직업명
 *********************************************************************************************************************** */

async function secondClassCheck(data) {

    /* **********************************************************************************************************************
    * function name		:	Modules
    * description		: 	모든 외부모듈 정의
    *********************************************************************************************************************** */
    let Modules = await importModuleManager()

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
        Modules.originFilter.arkFilter.forEach(function (arry) {
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



/* **********************************************************************************************************************
* function name		:	calculateGemData
* description	    :   보석정보 및 계산 모든 로직
*********************************************************************************************************************** */

async function calculateGemData(data) {

    /* **********************************************************************************************************************
    * function name		:	Modules
    * description		: 	모든 외부모듈 정의
    *********************************************************************************************************************** */
    let Modules = await importModuleManager()
    let supportCheck = await secondClassCheck(data)

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
    if (!data.ArmoryGem.Gems) {
        return
    }
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

    // console.log(gemSkillArry) // <= 유저가 착용중인 보석 정보

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

    // console.log("보석전용 직업 : ", specialClass)

    gemSkillArry.forEach(function (gemSkill, idx) {
        let realClass = Modules.originFilter.classGemFilter.filter(item => item.class == specialClass);
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
    let classGemEquip = Modules.originFilter.classGemFilter.filter(function (filterArry) {
        return filterArry.class == specialClass;
    });

    // console.log(classGemEquip[0])

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

            // console.log("평균값 : " + averageValue) // <= 보석 쿨감 평균값

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
                averageValue: averageValue,  // 보석 쿨감 평균값
                gemSkillArry: gemSkillArry,    // 유저가 착용중인 보석
            };
        } catch (error) {
            console.error("Error in gemCheckFnc:", error);
            return {
                averageValue: averageValue,  // 보석 쿨감 평균값
                gemSkillArry: gemSkillArry,    // 유저가 착용중인 보석
                specialSkill: 1,
                originGemValue: 1,
                gemValue: 1,
                gemAvg: 0,
                etcAverageValue: 1,
            };
        }
    }
    // console.log(gemCheckFnc())
    return gemCheckFnc()
}



/* **********************************************************************************************************************
* function name		:   armorAutoCheck(element, selectValue, tag)
* description	    :   조건과 일치하는 option값을 자동으로 선택함

* parameter         :   element
* description       :   선택할 select 요소
* parameter         :   selectValue
* description       :   선택할 select의 option의 조건
* parameter         :   tag
* description       :   option의 value, textContent중 어느것을 기준으로 선택하는지 정함
*********************************************************************************************************************** */
function optionElementAutoCheck(element, selectValue, tag) {
    if (!element) {
        console.error("element is null or undefined in armorAutoCheck");
        return;
    }
    if (tag === "value") {
        for (let i = 0; i < element.options.length; i++) {
            if (element.options[i].value == selectValue) {
                element.selectedIndex = i;
                return;
            }
        }
    } else if (tag === "textContent") {
        for (let i = 0; i < element.options.length; i++) {
            if (element.options[i].textContent.trim() == selectValue) {
                element.selectedIndex = i;
                return;
            }
        }
    }
    console.warn(`No matching option found for ${selectValue} in ${tag}`);
}

/* **********************************************************************************************************************
* function name		:   betweenTextExtract
* description	    :   >< 사이의 텍스트 문자열을 배열로 추출함

* parameter         :   inputString
* description       :   텍스트 문자열
*********************************************************************************************************************** */

function betweenTextExtract(inputString) {
    if (typeof inputString !== 'string') {
        console.error("Error: Input must be a string.");
        return [];
    }
    const regex = />([\s\S]*?)</g;

    let matches;
    const extractedTexts = [];

    while ((matches = regex.exec(inputString)) !== null) {
        extractedTexts.push(matches[1].trim());
    }

    return extractedTexts;
}



/* **********************************************************************************************************************
* function name		:
* description	    :   모든 select요소의 tooltip를 생성함
*********************************************************************************************************************** */

// const selectElements = document.querySelectorAll('select');
// selectElements.forEach((selectElement) => {
//     selectElement.addEventListener('mouseover', (event) => {
//         const selectedOption = selectElement.options[selectElement.selectedIndex];
//         const tooltip = document.createElement('div');
//         tooltip.className = 'tooltip';
//         tooltip.textContent = selectedOption.text;

//         document.body.appendChild(tooltip);
//         tooltip.style.left = `${event.clientX + window.scrollX + 10}px`;
//         tooltip.style.top = `${event.clientY + window.scrollY + 10}px`;

//         selectElement.addEventListener('mousemove', (moveEvent) => {
//             tooltip.style.left = `${moveEvent.clientX + window.scrollX + 10}px`;
//             tooltip.style.top = `${moveEvent.clientY + window.scrollY + 10}px`;
//         });

//         selectElement.addEventListener('mouseout', () => {
//             tooltip.remove();
//         }, { once: true });
//     });

//     selectElement.addEventListener('change', () => {
//         const tooltip = document.querySelector('.tooltip');
//         if (tooltip) {
//             tooltip.textContent = selectElement.options[selectElement.selectedIndex].text;
//         }
//     });
// });