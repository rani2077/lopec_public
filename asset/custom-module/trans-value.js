// import 'https://code.jquery.com/jquery-3.6.0.min.js';

async function importModuleManager() {
    let interValTime = 60 * 1000;
    let modules = await Promise.all([
        import(`../filter/filter.js?${Math.floor((new Date).getTime() / interValTime)}`),              // CDN 로드 주석 처리
        import(`../filter/simulator-filter.js?${Math.floor((new Date).getTime() / interValTime)}`),   // CDN 로드 주석 처리
        //import("../filter/filter.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),              // 기존 타임스탬프 방식 복구
        //import("../filter/simulator-filter.js" + `?${Math.floor((new Date).getTime() / interValTime)}`), // 기존 타임스탬프 방식 복구
    ])
    let moduleObj = {
        originFilter: modules[0],
        simulatorFilter: modules[1],
    }
    return moduleObj
}

// 필터
// import {
//     keywordList,
//     grindingFilter,
//     arkFilter,
//     bangleJobFilter,
//     engravingImg,
//     engravingCalFilter,
//     dealerAccessoryFilter,
//     calAccessoryFilter,
//     elixirFilter,
//     cardPointFilter,
//     bangleFilter,
//     engravingCheckFilter,
//     stoneCheckFilter,
//     elixirCalFilter,
//     arkCalFilter,
//     // engravingCheckFilterLowTier,
//     classGemFilter,
// } from '../filter/filter.js';
// import * as Filter from "../filter/filter.js";
// import * as SimulatorFilter from "../filter/simulator-filter.js";



export async function getCharacterProfile(data) {
    let Modules = await importModuleManager();
    // console.log(Modules.originFilter)
    // console.log(Modules.simulatorFilter.bangleOptionData.t4MythicData)



    // 호출api모음
    let characterImage = data.ArmoryProfile.CharacterImage //캐릭터 이미지
    let characterLevel = data.ArmoryProfile.CharacterLevel //캐릭터 레벨
    let characterNickName = data.ArmoryProfile.CharacterName //캐릭터 닉네임
    let characterClass = data.ArmoryProfile.CharacterClassName //캐릭터 직업
    let serverName = data.ArmoryProfile.ServerName //서버명
    let itemLevel = data.ArmoryProfile.ItemMaxLevel //아이템레벨
    let guildNullCheck = data.ArmoryProfile.GuildName //길드명
    function guildName() {
        if (guildNullCheck == null) {
            return ("없음")
        } else {
            return (guildNullCheck)
        }
    }
    let titleNullCheck = data.ArmoryProfile.Title //칭호명
    function titleName() {
        if (titleNullCheck == null) {
            return ("없음")
        } else {
            return (titleNullCheck)
        }
    }


    /* **********************************************************************************************************************
     * name		              :     htmlObj{}
     * version                :     2.0
     * description            :     search, m-search 페이지에서 사용될 정보를 저장하는 객체 
     * inUse                  :     사용중
     *********************************************************************************************************************** */

    let htmlObj = {};

    /* **********************************************************************************************************************
     * name		              :	 suppportCheck{}
     * version                :   2.0
     * description            :   서폿/딜러 검증 및 직업각인 포함 직업명 출력 
     * inUse                  :   사용중
     *********************************************************************************************************************** */

    let enlightenmentCheck = []
    let enlightenmentArry = []
    data.ArkPassive.Effects.forEach(function (arkArry) {
        if (arkArry.Name == '깨달음') {
            enlightenmentCheck.push(arkArry)
        }
    })


    function supportArkLeft(arkName) {
        arkName.map(function (arkNameArry) {
            // 아크이름 남기기
            let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
            enlightenmentArry.push(arkName)
        });
    }
    supportArkLeft(enlightenmentCheck)


    // 직업명 단축이름 출력
    function supportCheck() {
        let arkResult = ""
        try {
            Modules.originFilter.arkFilter.forEach(function (arry) {
                let arkInput = arry.name;
                let arkOutput = arry.initial;
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
        return arkResult
    }


    /* **********************************************************************************************************************
     * name		              :	 allCardDescriptions[]
     * version                :   2.0
     * description            :   카르마 랭크 뻥튀기 방지를 위한 카드 옵션 검사
     * inUse                  :   사용중
     *********************************************************************************************************************** */


    let allCardDescriptions = []; // 모든 Description을 저장할 배열 초기화

    if (data.ArmoryCard && data.ArmoryCard.Effects && Array.isArray(data.ArmoryCard.Effects)) {
        // effect를 순회
        data.ArmoryCard.Effects.forEach(effect => {
            // 현재 effect 객체와 그 안의 Items가 존재하고 배열인지 확인
            if (effect && effect.Items && Array.isArray(effect.Items)) {
                // item 순회
                effect.Items.forEach(item => {
                    // Description 속성이 존재하는지 확인
                    if (item && item.Description) {
                        // Description 값을 allCardDescriptions 배열에 추가
                        allCardDescriptions.push(item.Description);
                    }
                });
            }
        });
    }

    let totalMaxHpBonus = 0; // 추출된 최대 생명력 보너스 합계

    // allCardDescriptions 순회
    allCardDescriptions.forEach(description => {
        // "최대 생명력"이 포함되어 있는지 확인
        if (description.includes("최대 생명력")) {
            // 정규식
            const regex = /최대 생명력 \+(\d+(?:\.\d+)?)\%/;
            const match = description.match(regex);

            // 정규식 매칭에 성공했고, 숫자를 포함한 그룹이 있는지 확인합니다.
            if (match && match[1]) {
                // 추출된 숫자 문자열을 부동소수점 숫자로 변환하여 합계에 더합니다.
                totalMaxHpBonus += parseFloat(match[1]);
            }
        }
    });

    //console.log("최대 생명력 보너스 총합:", totalMaxHpBonus);
    totalMaxHpBonus = (totalMaxHpBonus / 100)
    //console.log(totalMaxHpBonus)



    /* **********************************************************************************************************************
     * name		              :	  bangleTierFnc{}
     * version                :   2.0
     * description            :   캐릭터의 팔찌 티어 검사
     * inUse                  :   사용 중
     *********************************************************************************************************************** */


    let bangleOptionArry = [];
    let bangleSpecialStats = ["힘", "민첩", "지능", "체력"]

    data.ArmoryEquipment.forEach(function (arry) {
        if (arry.Type == "팔찌") {
            let bangleTier = JSON.parse(arry.Tooltip).Element_001.value.leftStr2.replace(/<[^>]*>/g, '').replace(/\D/g, '')
            let bangleTool = JSON.parse(arry.Tooltip).Element_004.value.Element_001
            bangleTierFnc(bangleTier, bangleTool)
        }
    })


    // 팔찌 티어 검사 후 옵션 배열저장
    function bangleTierFnc(bangle, bangleTool) {
        if (bangle == 3) {
            let regex = />([^<]+)</g;
            let regexEnd = />([^<]*)$/;
            let matches;

            while ((matches = regex.exec(bangleTool)) !== null) {
                // console.log(matches[1])
                bangleOptionArry.push(matches[1].trim());
            }
            if ((matches = regexEnd.exec(bangleTool)) !== null) {
                bangleOptionArry.push(matches[1].trim());
            }

        } else if (bangle == 4) {
            let regex = />([^<]+)</g;
            let regexEnd = />([^<]*)$/;
            let matches;

            while ((matches = regex.exec(bangleTool)) !== null) {
                // console.log(matches[1])
                bangleOptionArry.push(matches[1].trim());
            }
            if ((matches = regexEnd.exec(bangleTool)) !== null) {
                bangleOptionArry.push(matches[1].trim());
            }
        }
    }

    /* **********************************************************************************************************************
     * name		             :	 etcObj{}
     * version               :   2.0
     * description           :   하나의 종류로 묶이지 않는 값들을 묶기 위한 객체
     * inUse                 :   사용중
     *********************************************************************************************************************** */

    let etcObj = {
        expeditionStats: 0,
        gemsCoolAvg: 0,
        gemAttackBonus: 0,
        abilityAttackBonus: 0,
        armorStatus: 0,
        avatarStats: 1,
        supportCheck: supportCheck(),
        gemCheckFnc: {
            specialSkill: 1,
            originGemValue: 1,
            gemValue: 1,
            gemAvg: 0,
            etcAverageValue: 1,
        },

    }

    /* **********************************************************************************************************************
     * name		             :	 defaultObj{}
     * version               :   2.0
     * description           :   캐릭터의 기본 스탯 요소 종합
     * inUse                 :   special/haste/crit 제외 미사용
     *********************************************************************************************************************** */

    let defaultObj = {
        attackPow: 0,
        baseAttackPow: 0,
        criticalChancePer: 0,
        addDamagePer: 0,
        criticalDamagePer: 200,
        moveSpeed: 14,
        atkSpeed: 14,
        skillCool: 0,
        special: 0,
        haste: 0,
        crit: 0,
        weaponAtk: 0,
        maxHp: 0,
        statHp: 0,
        hpActive: 0,
    }

    data.ArmoryProfile.Stats.forEach(function (statsArry) {
        if (statsArry.Type == "공격력") {
            defaultObj.attackPow = Number(statsArry.Value)
        } else if (statsArry.Type == "치명") {
            let regex = />(\d+(\.\d+)?)%/;
            defaultObj.criticalChancePer = Number(statsArry.Tooltip[0].match(regex)[1])
            defaultObj.crit = Number(statsArry.Value)
        } else if (statsArry.Type == "신속") {
            let atkMoveSpeed = statsArry.Tooltip[0].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
            let skillCool = statsArry.Tooltip[2].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
            defaultObj.atkSpeed += Number(atkMoveSpeed)
            defaultObj.moveSpeed += Number(atkMoveSpeed)
            defaultObj.skillCool = Number(skillCool)
            defaultObj.haste = Number(statsArry.Value)
        } else if (statsArry.Type == "특화") {
            defaultObj.special = Number(statsArry.Value)
        } else if (statsArry.Type == "최대 생명력") {
            defaultObj.maxHp = Number(statsArry.Value)
            defaultObj.statHp = Number(statsArry.Tooltip[1].match(/>(\d+(\.\d+)?)<\/font>/)[1])
            //defaultObj.hpActive = Number(statsArry.Tooltip[2].match(/<font[^>]*>(\d+(\.\d+)?)%<\/font>/)[1])
            //console.log(defaultObj.hpActive)
        }
    })

    let vitalitySum = 0; // 툴팁에서 추출한 생명 활성력 합계를 위한 변수
    data.ArmoryEquipment.forEach(function (equip) {
        if (equip.Type == "무기") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue;
            defaultObj.addDamagePer += 10 + 0.002 * (quality ** 2);
        } else if (/투구|상의|하의|장갑|어깨/.test(equip.Type)) { // 방어구 5종
            try {
                let tooltipJson = JSON.parse(equip.Tooltip);
                let vitalityValue = 0; // 해당 장비에서 찾은 값
                let foundVitality = false; // 찾았는지 여부 플래그

                // Element_006.value.Element_001 확인
                let vitalityStringFrom006 = tooltipJson?.Element_006?.value?.Element_001;
                if (vitalityStringFrom006 && vitalityStringFrom006.startsWith("생명 활성력")) {
                    const match = vitalityStringFrom006.match(/\d+/);
                    if (match) {
                        vitalityValue = Number(match[0]);
                        foundVitality = true; // 006에서 찾음
                    }
                }

                // Element_006에서 못 찾았으면 Element_007.value.Element_001 확인
                if (!foundVitality) { // 006에서 못 찾았을 경우에만 007 확인
                    let vitalityStringFrom007 = tooltipJson?.Element_007?.value?.Element_001;
                    if (vitalityStringFrom007 && vitalityStringFrom007.startsWith("생명 활성력")) {
                        const match = vitalityStringFrom007.match(/\d+/);
                        if (match) {
                            vitalityValue = Number(match[0]);
                            // foundVitality 플래그는 여기서 설정할 필요 없음 (마지막 확인이므로)
                        }
                    }
                }

                vitalitySum += vitalityValue; // 해당 장비에서 찾은 값을 합계에 더함 (못 찾으면 0)

            } catch (e) {
                console.error("Error parsing tooltip or finding vitality for:", equip.Type, e);
            }
        }
    });

    //console.log(vitalitySum)
    // 합산된 생명 활성력 값을 사용하여 최종 hpActive 계산
    //defaultObj.hpActive = (vitalitySum / 140) / 100 + 1;
    //console.log(defaultObj.hpActive)
    //defaultObj.hpActive = (defaultObj.hpActive / 100) + 1
    //defaultObj.hpActive = (0.000071427 * vitalitySum) + 1
    defaultObj.hpActive = 1 + (vitalitySum / 14000);

    // 무기 공격력
    data.ArmoryEquipment.forEach(function (weapon) {
        if (weapon.Type == "무기") {
            const regex = /무기 공격력\s*\+(\d+)/;
            defaultObj.weaponAtk = Number(weapon.Tooltip.match(regex)[1])
        }
    })


    // baseAttckPow(기본 공격력 stats)
    data.ArmoryProfile.Stats.forEach(function (stats) {
        if (stats.Type == "공격력") {
            const regex = />(\d+)</
            defaultObj.baseAttackPow += Number(stats.Tooltip[1].match(regex)[1])
        }
    })

    etcObj.expeditionStats = Math.floor((data.ArmoryProfile.ExpeditionLevel - 1) / 2) * 5 + 5 // 원정대 힘민지


    /* **********************************************************************************************************************
     * name		              :	  jobObj{}
     * version                :   2.0
     * description            :   직업별 기본 스탯 요소 종합
     * USE_TN                 :   finalDamagePer 제외 미사용
     *********************************************************************************************************************** */


    let jobObj = {
        criticalChancePer: 0,
        criticalDamagePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        skillCool: 0,
        atkPer: 0,
        healthPer: 0,

        finalDamagePer: 1,
        criFinalDamagePer: 1,
    }

    Modules.originFilter.arkFilter.forEach(function (filterArry) {

        let plusArry = []
        let perArry = []

        objExtrudeFnc(jobObj, plusArry, perArry)

        plusArry.forEach(function (plusAttr) {
            if (filterArry.initial == supportCheck() && !(filterArry[plusAttr] == undefined)) {
                jobObj[plusAttr] = filterArry[plusAttr]
            }
        })
        perArry.forEach(function (percent) {
            if (filterArry.initial == supportCheck() && !(filterArry[percent] == undefined)) {
                jobObj[percent] = (filterArry[percent] / 100) + 1
            }

        })

    })

    function objExtrudeFnc(object, plus, percent) {
        Object.keys(object).forEach(function (objAttr) {
            if (object[objAttr] == 0) {
                plus.push(objAttr);
            } else if (object[objAttr] == 1) {
                percent.push(objAttr);
            }
        })
    }


    /* **********************************************************************************************************************
     * name		              :	  accObj{}
     * version                :   2.0
     * description            :   악세서리 옵션 값 추출
     * USE_TN                 :   enlightPoint 미사용
     *********************************************************************************************************************** */


    let accObj = {
        addDamagePer: 0,
        finalDamagePer: 1,
        weaponAtkPlus: 0,
        weaponAtkPer: 0,
        atkPlus: 0,
        atkPer: 0,
        statHp: 0,
        criticalChancePer: 0,
        criticalDamagePer: 0,
        stigmaPer: 0,
        atkBuff: 0,
        damageBuff: 0,
        enlightPoint: 0,
        carePower: 1,
    }


    function equimentCalPoint() {
        data.ArmoryEquipment.forEach(function (equipArry) {
            let accOption
            try {
                accOption = JSON.parse(equipArry.Tooltip).Element_005.value.Element_001
                accessoryFilterFnc(accOption)
            }
            catch { }

        })
    }


    equimentCalPoint()
    function accessoryFilterFnc(accessoryOption) {
        Modules.originFilter.calAccessoryFilter.forEach(function (filterArry) {
            let optionCheck = accessoryOption.includes(filterArry.name)
            if (optionCheck && filterArry.attr == "AddDamagePer") { //추가 피해 %
                accObj.addDamagePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "FinalDamagePer") { //에게 주는 피해가 %
                accObj.finalDamagePer += (filterArry.value / 100)
            } else if (optionCheck && filterArry.attr == "WeaponAtkPlus") { //무기 공격력 +
                accObj.weaponAtkPlus += filterArry.value
            } else if (optionCheck && filterArry.attr == "WeaponAtkPer") { //무기 공격력 %
                accObj.weaponAtkPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkPlus") { //공격력 +
                accObj.atkPlus += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkPer") { //공격력 %   
                accObj.atkPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "CriticalChancePer") { //치명타 적중률 %
                accObj.criticalChancePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "CriticalDamagePer") { //치명타 피해 %
                accObj.criticalDamagePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "StigmaPer") { //낙인력 %
                accObj.stigmaPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkBuff") { //아군 공격력 강화 %
                accObj.atkBuff += filterArry.value
            } else if (optionCheck && filterArry.attr == "DamageBuff") { //아군 피해량 강화 %
                accObj.damageBuff += filterArry.value
            } else if (optionCheck && filterArry.attr == "CarePower") { // 아군 보호막, 회복 강화 %
                accObj.carePower += filterArry.value
            } else if (optionCheck && filterArry.attr == "StatHp") { // 최대 생명력
                accObj.statHp += filterArry.value
            }
        })
    }
    accObj.finalDamagePer *= ((accObj.criticalChancePer * 0.684) / 100 + 1)
    accObj.finalDamagePer *= ((accObj.criticalDamagePer * 0.3625) / 100 + 1)
    //accObj.finalDamagePer *= ((accObj.weaponAtkPer * 0.4989) / 100 + 1)
    //accObj.finalDamagePer *= ((accObj.atkPer * 0.9246) / 100 + 1)



    // 악세 깨달음 포인트
    data.ArmoryEquipment.forEach(function (arry) {
        let regex = /"([^"]*)"/g;
        let matches = [];
        let match;
        if (/목걸이|귀걸이|반지/.test(arry.Type)) {
            while ((match = regex.exec(arry.Tooltip)) !== null) {             // ""사이값 추출
                matches.push(match[1]);
            }
            let enlightStr = matches.filter(item => /깨달음/.test(item));     // 깨달음 포인트값 추출
            accObj.enlightPoint += Number(enlightStr[0]?.match(/\d+/)[0]);
        }
    })


    /* **********************************************************************************************************************
     * name		              :	  bangleObj{}
     * version                :   2.0
     * description            :   팔찌 옵션 값 추출
     * USE_TN                 :   critical / atk&moveSpeed / skillCool 미사용
     *********************************************************************************************************************** */


    let bangleObj = {
        atkPlus: 0,
        atkPer: 0,
        weaponAtkPlus: 0,
        criticalDamagePer: 0,
        criticalChancePer: 0,
        addDamagePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        skillCool: 0,
        atkBuff: 0,
        atkBuffPlus: 1,
        damageBuff: 0,

        crit: 0,
        special: 0,
        haste: 0,

        str: 0,
        dex: 0,
        int: 0,
        statHp: 0,

        weaponAtkPer: 1,
        finalDamagePer: 1,
        finalDamagePerEff: 1,
        criFinalDamagePer: 1,
    }

    bangleOptionArry.forEach(function (realBangleArry, realIdx) {

        let plusArry = ['atkPlus', 'atkPer', 'weaponAtkPlus', 'criticalDamagePer', 'criticalChancePer', 'addDamagePer', 'moveSpeed', 'atkSpeed', "skillCool", 'atkBuff', 'damageBuff']
        let perArry = ['weaponAtkPer', 'finalDamagePer', 'criFinalDamagePer', 'finalDamagePerEff', 'atkBuffPlus']
        let statsArry = ["치명:crit", "특화:special", "신속:haste", "힘:str", "민첩:dex", "지능:int", "최대 생명력:statHp"];

        statsArry.forEach(function (stats) {
            let regex = new RegExp(`${stats.split(":")[0]}\\s*\\+\\s*(\\d+)`);
            if (regex.test(realBangleArry)) {

                // console.log(realBangleArry.match(regex)[1])
                bangleObj[stats.split(":")[1]] += Number(realBangleArry.match(regex)[1]);

            }

        })


        Modules.originFilter.bangleFilter.forEach(function (filterArry) {

            if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && filterArry.secondCheck == null) {
                typeCheck(filterArry)

            } else if (realBangleArry == filterArry.name && filterArry.option == null && filterArry.secondCheck == null) {
                typeCheck(filterArry)

            } else if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && bangleOptionArry[realIdx + 2] != filterArry.secondCheck) {
                typeCheck(filterArry)

            }

        })
        function typeCheck(validValue) {
            plusArry.forEach(function (value) {
                if (!(validValue[value] == undefined)) {

                    bangleObj[value] += validValue[value]
                    // console.log(value+" : "+bangleObj[value])
                }
            })
            perArry.forEach(function (value) {
                if (!(validValue[value] == undefined)) {
                    // console.log(value+" : "+ bangleObj[value])
                    bangleObj[value] *= (validValue[value] / 100) + 1
                }
            })
        }
    })
    /* **********************************************************************************************************************
     * name		              :	  bangleBlockStats
     * version                :   2.0
     * description            :   직업에 따라 팔찌의 힘/민첩/지능 수치를 일부 무효처리함
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function bangleBlockStats() {
        let userClass = data.ArmoryProfile.CharacterClassName;
        let filter = Modules.originFilter.bangleJobFilter;
        let vailedStat = filter.find(item => item.job === userClass).stats;
        if (vailedStat === "str") {
            bangleObj.dex = 0;
            bangleObj.int = 0;
        } else if (vailedStat === "dex") {
            bangleObj.str = 0;
            bangleObj.int = 0;
        } else if (vailedStat === "int") {
            bangleObj.str = 0;
            bangleObj.dex = 0;
        }
    };
    bangleBlockStats();


    /* **********************************************************************************************************************
     * name		              :	  hyperObj{}
     * version                :   2.0
     * description            :   초월 옵션 값 추출
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    let hyperPoint = 0;
    let hyperArmoryLevel = 0;
    let hyperWeaponLevel = 0;

    function hyperCalcFnc(e) {
        let hyperStr = data.ArmoryEquipment[e].Tooltip;


        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            hyperPoint += Number(hyperArry[3]) * 1600 + Number(hyperArry[1] * 3400)
            return Number(hyperArry[3])
        } catch {
            return 0
        }
    }

    data.ArmoryEquipment.forEach(function (arry, idx) {
        if (arry.Type == "무기") {
            hyperWeaponLevel += hyperCalcFnc(idx)
        } else {
            hyperArmoryLevel += hyperCalcFnc(idx)
        }
    })

    let hyperSum = hyperWeaponLevel + hyperArmoryLevel

    let hyperObj = {
        atkPlus: 0,
        weaponAtkPlus: 0,
        atkBuff: 0,
        stigmaPer: 0,

        str: 0,
        dex: 0,
        int: 0,
        statHp: 0,

        finalDamagePer: 1,

    }


    // hyperObj객체에 무언가 영향을 미침 원인 해명 필요
    data.ArmoryEquipment.forEach(function (equip, equipIdx) {

        // function hyperInfoFnc(e ,parts){
        let hyperStr = data.ArmoryEquipment[equipIdx].Tooltip;

        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            // console.log(hyperArry)
            headStarCal(hyperArry[3], equip.Type)
            shoulderStarCal(hyperArry[3], equip.Type)
            shirtStarCal(hyperArry[3], equip.Type)
            pantsStarCal(hyperArry[3], equip.Type)
            gloveStarCal(hyperArry[3], equip.Type)
            weaponStarCal(hyperArry[3], equip.Type)
        } catch { }
        // }

        // hyperInfoFnc(equipIdx, equip.Type)
    })


    function hyperStageCalc(e) {
        let hyperStr = data.ArmoryEquipment[e].Tooltip;


        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            return Number(hyperArry[1])

            // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)

        } catch {
            return 0
        }
    }


    let armoryListArry = ["투구", "상의", "하의", "장갑", "어깨"]
    data.ArmoryEquipment.forEach(function (equip, equipIdx) {
        if (equip.Type == "무기") {

            let n = hyperStageCalc(equipIdx)
            hyperObj.weaponAtkPlus += 280 * n + 20 * (n ** 2)
            // console.log(equip.Type + "초월 단계 " + n )
            // console.log("무공 초월 "+ ( 280*n + 20*(n**2) ))
        }
        armoryListArry.forEach(function (armoryList) {
            if (equip.Type == armoryList) {

                let n = hyperStageCalc(equipIdx)
                // console.log(equip.Type + "초월 단계 " + n )
                // console.log(equip.Type+" 초월 "+" : "+ ( 560*n + 40*(n**2) ))
                hyperObj.str += 560 * n + 40 * (n ** 2)
                hyperObj.dex += 560 * n + 40 * (n ** 2)
                hyperObj.int += 560 * n + 40 * (n ** 2)
            }
        })
    })




    // 투구 N성
    function headStarCal(value, parts) {
        let check = (parts == "투구")
        if (value >= 20 && check) {
            hyperObj.statHp += hyperSum * 80
            hyperObj.atkBuff += hyperSum * 0.04
            hyperObj.atkPlus += hyperSum * 6
            hyperObj.weaponAtkPlus += hyperSum * 14
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 15 && check) {
            hyperObj.statHp += hyperSum * 80
            hyperObj.atkBuff += hyperSum * 0.03
            hyperObj.weaponAtkPlus += hyperSum * 14
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 10 && check) {
            hyperObj.statHp += hyperSum * 80
            hyperObj.atkBuff += hyperSum * 0.02
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 5 && check) {
            hyperObj.atkBuff += hyperSum * 0.01
            hyperObj.statHp += hyperSum * 80
        }
    }

    // 어깨 N성
    function shoulderStarCal(value, parts) {
        let check = (parts == "어깨")
        if (value >= 20 && check) {
            hyperObj.atkBuff += 3
            hyperObj.weaponAtkPlus += 3600

        } else if (value >= 15 && check) {
            hyperObj.atkBuff += 2
            hyperObj.weaponAtkPlus += 2400
        } else if (value >= 10 && check) {
            hyperObj.atkBuff += 1
            hyperObj.weaponAtkPlus += 1200
        } else if (value >= 5 && check) {
            hyperObj.atkBuff += 1
            hyperObj.weaponAtkPlus += 1200
        }
    }
    // 상의 N성
    function shirtStarCal(value, parts) {
        let check = (parts == "상의")
        if (value >= 20 && check) {
            hyperObj.weaponAtkPlus += 7200
        } else if (value >= 15 && check) {
            hyperObj.weaponAtkPlus += 4000
        } else if (value >= 10 && check) {
            hyperObj.weaponAtkPlus += 2000
        } else if (value >= 5 && check) {
            hyperObj.weaponAtkPlus += 2000
        }
    }
    // 하의 N성
    function pantsStarCal(value, parts) {
        let check = (parts == "하의")
        if (value >= 20 && check) {
            hyperObj.atkBuff += 6
            hyperObj.finalDamagePer *= 1.015 * 1.01
        } else if (value >= 15 && check) {
            hyperObj.atkBuff += 3
            hyperObj.finalDamagePer *= 1.01
        } else if (value >= 10 && check) {
            hyperObj.atkBuff += 1.5
            hyperObj.finalDamagePer *= 1.005

        }
    }
    // 하의 N성
    function gloveStarCal(value, parts) {
        let check = (parts == "장갑")
        if (value >= 20 && check) {
            hyperObj.str += 12600
            hyperObj.dex += 12600
            hyperObj.int += 12600
            hyperObj.atkBuff += 3
        } else if (value >= 15 && check) {
            hyperObj.str += 8400
            hyperObj.dex += 8400
            hyperObj.int += 8400
            hyperObj.atkBuff += 2
        } else if (value >= 10 && check) {
            hyperObj.str += 4200
            hyperObj.dex += 4200
            hyperObj.int += 4200
            hyperObj.atkBuff += 1
        } else if (value >= 5 && check) {
            hyperObj.str += 4200
            hyperObj.dex += 4200
            hyperObj.int += 4200
            hyperObj.atkBuff += 1
        }
    }
    // 무기 N성
    function weaponStarCal(value, parts) {
        let check = (parts == "무기")
        if (value >= 20 && check) {
            hyperObj.atkPlus += 3525
            hyperObj.stigmaPer += 8
            hyperObj.atkBuff += 2
        } else if (value >= 15 && check) {
            hyperObj.atkPlus += 2400
            hyperObj.stigmaPer += 4
            hyperObj.atkBuff += 2
        } else if (value >= 10 && check) {
            hyperObj.atkPlus += 1600
            hyperObj.stigmaPer += 2
            hyperObj.atkBuff += 2
        } else if (value >= 5 && check) {
            hyperObj.atkPlus += 800
            hyperObj.stigmaPer += 2
        }
    }



    /* **********************************************************************************************************************
     * name		              :	  armorStatus{}
     * version                :   2.0
     * description            :   착용 장비 및 악세 STR/DEX/INT 추출
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    function armorStatus() {
        let result = 0;
        data.ArmoryEquipment.forEach(function (armor) {

            if (/^(투구|상의|하의|장갑|어깨|목걸이|귀걸이|반지|)$/.test(armor.Type)) {

                let firstExtract = armor.Tooltip.match(/>([^<]+)</g).map(match => match.replace(/[><]/g, ''))
                let secondExtract = firstExtract.filter(item => item.match(/^(힘|민첩|지능) \+\d+$/));
                let thirdExtract = secondExtract[0].match(/\d+/)[0]
                result += Number(thirdExtract)

            }
        })
        return result
    }
    etcObj.armorStatus = armorStatus()

    /* **********************************************************************************************************************
     * name		              :	  engObj{}
     * version                :   2.0
     * description            :   각인 딜증율 추출
     * USE_TN                 :   criticalChance&Damage 미사용
     *********************************************************************************************************************** */


    let engObj = {
        finalDamagePer: 1,
        atkPer: 0,
        engBonusPer: 1,
        carePower: 1,
        utilityPower: 1,
    }


    // 4티어 각인 모든 옵션 값 계산(무효옵션 하단 제거)
    Modules.originFilter.engravingCheckFilter.forEach(function (checkArry) {
        if (!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.ArkPassiveEffects == null)) {
            data.ArmoryEngraving.ArkPassiveEffects.forEach(function (realEngArry) {
                if (checkArry.name == realEngArry.Name && checkArry.grade == realEngArry.Grade && checkArry.level == realEngArry.Level) {


                    engCalMinus(checkArry.name, checkArry.finalDamagePer, checkArry.criticalChancePer, checkArry.criticalDamagePer, checkArry.atkPer, checkArry.atkSpeed, checkArry.moveSpeed, checkArry.carePower, checkArry.utilityPower, checkArry.engBonusPer)

                    engObj.finalDamagePer = (engObj.finalDamagePer * (checkArry.finalDamagePer / 100 + 1));
                    engObj.engBonusPer = (engObj.engBonusPer * (checkArry.engBonusPer / 100 + 1));
                    engObj.atkPer = (engObj.atkPer + checkArry.atkPer);
                    engObj.carePower = (engObj.carePower + checkArry.carePower);
                    if (supportCheck() !== "서폿") {
                        stoneCalc(realEngArry.Name, checkArry.finalDamagePer)
                    } else {
                        stoneCalc(realEngArry.Name, checkArry.engBonusPer)
                    }
                }
            })
        }


    })

    // 무효옵션 값 제거4티어만 해당
    function engCalMinus(name, finalDamagePer, criticalChancePer, criticalDamagePer, atkPer) {
        Modules.originFilter.engravingCalFilter.forEach(function (FilterArry) {
            if (FilterArry.job == supportCheck()) {
                FilterArry.block.forEach(function (blockArry) {
                    if (blockArry == name) {
                        engObj.finalDamagePer = (engObj.finalDamagePer / (finalDamagePer / 100 + 1));
                        engObj.atkPer = (engObj.atkPer - atkPer);
                    }
                })
            }
        })
    }


    // 어빌리티스톤(곱연산 제거 후 곱연산+어빌리티스톤 적용)
    function stoneCalc(name, minusVal) {
        function notZero(num) {
            if (num == 0) {
                return 1;
            } else {
                return num / 100 + 1
            }
        }
        data.ArmoryEngraving.ArkPassiveEffects.forEach(function (stoneArry) {
            Modules.originFilter.stoneCheckFilter.forEach(function (filterArry, idx) {
                if (idx === 0) {

                }
                if (stoneArry.AbilityStoneLevel == filterArry.level && stoneArry.Name == filterArry.name && stoneArry.Name == name) {

                    engObj.finalDamagePer = (engObj.finalDamagePer) / notZero(minusVal) //퐁트라이커기준 저주받은 인형(돌맹이) 제거값
                    engObj.finalDamagePer = (engObj.finalDamagePer * (notZero(minusVal) + filterArry.finalDamagePer / 100));
                    engObj.engBonusPer = (engObj.engBonusPer) / notZero(minusVal)
                    engObj.engBonusPer = (engObj.engBonusPer * (notZero(minusVal) + filterArry.engBonusPer / 100));
                    engObj.atkPer = (engObj.atkPer + filterArry.atkPer);
                }
            })

        })
    }


    /* **********************************************************************************************************************
     * name		              :	  elixirObj{}
     * version                :   2.0
     * description            :   엘릭서 옵션 추출
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    let elixirObj = {
        atkPlus: 0,
        atkBuff: 0,
        weaponAtkPlus: 0,
        criticalDamagePer: 0,
        criticalChancePer: 0,
        criFinalDamagePer: 1,
        addDamagePer: 0,
        atkPer: 0,
        finalDamagePer: 1,
        carePower: 0,
        statHp: 0,
        str: 0,
        dex: 0,
        int: 0,
    }

    // 엘릭서 레벨 추출
    function elixirKeywordCheck(e) {
        let elixirValString = data.ArmoryEquipment[e].Tooltip;


        const matchedKeywordsWithContext = Modules.originFilter.keywordList.flatMap(keyword => {
            const index = elixirValString.indexOf(keyword);
            if (index !== -1) {
                const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
            }
            return [];
        });


        // span태그로 반환
        let elixirSpan = []
        let i
        for (i = 0; i < matchedKeywordsWithContext.length; i++) {
            elixirSpan.push(matchedKeywordsWithContext[i])
        }
        return (elixirSpan)

    }

    let elixirData = []
    // 엘릭서 인덱스 번호 검사
    data.ArmoryEquipment.forEach(function (arry, idx) {
        elixirKeywordCheck(idx).forEach(function (elixirArry, idx) {
            elixirData.push({ name: ">" + elixirArry.split("Lv.")[0], level: elixirArry.split("Lv.")[1] })
        })
    })

    elixirData.forEach(function (realElixir) {
        // console.log(realElixir.name)

        Modules.originFilter.elixirCalFilter.forEach(function (filterArry) {
            if (realElixir.name == filterArry.name && !(filterArry.atkPlus == undefined)) {

                elixirObj.atkPlus += filterArry.atkPlus[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAtkPlus)

            } else if (realElixir.name == filterArry.name && !(filterArry.weaponAtkPlus == undefined)) {

                elixirObj.weaponAtkPlus += filterArry.weaponAtkPlus[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirWeaponAtkPlus)

            } else if (realElixir.name == filterArry.name && !(filterArry.criticalDamage == undefined)) {

                elixirObj.criticalDamagePer += filterArry.criticalDamagePer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirCriticalDamage)

            } else if (realElixir.name == filterArry.name && !(filterArry.addDamagePer == undefined)) {

                elixirObj.addDamagePer += filterArry.addDamagePer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAddDamagePer)

            } else if (realElixir.name == filterArry.name && !(filterArry.atkPer == undefined)) {

                elixirObj.atkPer += filterArry.atkPer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAtkPer)

            } else if (realElixir.name == filterArry.name && !(filterArry.finalDamagePer == undefined)) {
                // console.log(realElixir.name)

                elixirObj.finalDamagePer *= filterArry.finalDamagePer[realElixir.level - 1] / 100 + 1
                // console.log(realElixir.name+" : " + elixirFinalDamagePer)

            } else if (realElixir.name == filterArry.name && !(filterArry.str == undefined)) {

                elixirObj.str += filterArry.str[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.dex == undefined)) {

                elixirObj.dex += filterArry.dex[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.dex[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.int == undefined)) {

                elixirObj.int += filterArry.int[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.atkBuff == undefined)) {

                elixirObj.atkBuff += filterArry.atkBuff[realElixir.level - 1]

            } else if (realElixir.name == filterArry.name && !(filterArry.carePower == undefined)) {

                elixirObj.carePower += filterArry.carePower[realElixir.level - 1]

            } else if (realElixir.name == filterArry.name && !(filterArry.statHp == undefined)) {

                elixirObj.statHp += filterArry.statHp[realElixir.level - 1]
            }

        })
    })

    Modules.originFilter.elixirCalFilter.forEach(function (arr) {

    })

    let elixirLevel = 0

    elixirData.forEach(function (arry) {
        Modules.originFilter.elixirFilter.forEach(function (filterArry) {
            if (arry.name == filterArry.split(":")[0]) {
                elixirLevel += Number(arry.level)
            } else {
            }
        })
    })

    function containsTwoWord(data, doubleString) {
        let count = data.filter(item => item.name.includes(doubleString)).length;
        return count === 2;
    }


    function doubleElixir() {
        if (containsTwoWord(elixirData, "회심") && elixirLevel >= 40) {
            elixirObj.criFinalDamagePer *= 1.12
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "회심") && elixirLevel >= 35) {
            elixirObj.criFinalDamagePer *= 1.06
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 40) {
            elixirObj.criticalChancePer += 7
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 35) {
            elixirObj.criticalChancePer += 7
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 40) {
            elixirObj.finalDamagePer *= 1.08
        } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 35) {
            elixirObj.finalDamagePer *= 1.04
        } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 40) {
            elixirObj.finalDamagePer *= 1.08
        } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 35) {
            elixirObj.finalDamagePer *= 1.04
        } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 40) {
            defaultObj.attackPow *= 1.03
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 35) {
            defaultObj.attackPow *= 1.03
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 40) {
            elixirObj.atkBuff += 14
        } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 35) {
            elixirObj.atkBuff += 8
        } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 40) {
            elixirObj.atkBuff += 14
        } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 35) {
            elixirObj.atkBuff += 8
        } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 40) {
            elixirObj.atkBuff += 6
        } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 35) {
            elixirObj.atkBuff += 0
        }
    }
    doubleElixir()

    /* **********************************************************************************************************************
     * name		              :	  gemsCool{}
     * version                :   2.0
     * description            :   작열/홍염 보석 평균값 추출
     * USE_TN                 :   for support
     *********************************************************************************************************************** */

    let gemsCool = 0;
    let gemsCoolCount = 0;


    if (!(data.ArmoryGem.Gems == null)) {
        data.ArmoryGem.Gems.forEach(function (arry) {
            if (arry.Name.includes("10레벨 작열")) {
                gemsCool += 24
                gemsCoolCount += 1
            } else if (arry.Name.includes("9레벨 작열")) {
                gemsCool += 22
                gemsCoolCount += 1
            } else if (arry.Name.includes("8레벨 작열") || arry.Name.includes("10레벨 홍염")) {
                gemsCool += 20
                gemsCoolCount += 1
            } else if (arry.Name.includes("7레벨 작열") || arry.Name.includes("9레벨 홍염")) {
                gemsCool += 18
                gemsCoolCount += 1
            } else if (arry.Name.includes("6레벨 작열") || arry.Name.includes("8레벨 홍염")) {
                gemsCool += 16
                gemsCoolCount += 1
            } else if (arry.Name.includes("5레벨 작열") || arry.Name.includes("7레벨 홍염")) {
                gemsCool += 14
                gemsCoolCount += 1
            } else if (arry.Name.includes("4레벨 작열") || arry.Name.includes("6레벨 홍염")) {
                gemsCool += 12
                gemsCoolCount += 1
            } else if (arry.Name.includes("3레벨 작열") || arry.Name.includes("5레벨 홍염")) {
                gemsCool += 10
                gemsCoolCount += 1
            } else if (arry.Name.includes("2레벨 작열") || arry.Name.includes("4레벨 홍염")) {
                gemsCool += 8
                gemsCoolCount += 1
            } else if (arry.Name.includes("1레벨 작열") || arry.Name.includes("3레벨 홍염")) {
                gemsCool += 6
                gemsCoolCount += 1
            } else if (arry.Name.includes("2레벨 홍염")) {
                gemsCool += 4
                gemsCoolCount += 1
            } else if (arry.Name.includes("1레벨 홍염")) {
                gemsCool += 2
                gemsCoolCount += 1
            }
        })
    } else {
        gemsCool = 1
        gemsCoolCount = 1
    }
    etcObj.gemsCoolAvg = Number(((gemsCool / gemsCoolCount)).toFixed(1))


    /* **********************************************************************************************************************
     * name		              :	  arkObj{}
     * version                :   2.0
     * description            :   아크패시브 옵션 추출
     * USE_TN                 :   evolution/enlightenment/leap 사용
     *********************************************************************************************************************** */


    let arkPassiveArry = [];
    let arkObj = {
        skillCool: 0,
        evolutionDamage: 0,
        enlightenmentDamage: 0,
        leapDamage: 0,
        criticalChancePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        stigmaPer: 0,
        criticalDamagePer: 0,
        evolutionBuff: 0,
        enlightenmentBuff: 0,
        weaponAtkPer: 1,
    }

    data.ArkPassive.Effects.forEach(function (arkArry) {
        const regex = /<FONT.*?>(.*?)<\/FONT>/g;
        let match;
        while ((match = regex.exec(arkArry.Description)) !== null) {
            const text = match[1];
            const levelMatch = text.match(/(.*) Lv\.(\d+)/);
            if (levelMatch) {
                const name = levelMatch[1];
                const level = parseInt(levelMatch[2], 10);
                arkPassiveArry.push({ name, level });

            }
        }
    });

    arkPassiveArry.forEach(function (ark) {
        Modules.originFilter.arkCalFilter.forEach(function (filter) {
            if (ark.name == filter.name && ark.level == filter.level) {
                arkAttrCheck(filter)
            }
        })
    })

    function arkAttrCheck(validValue) {
        let arkAttr = ['skillCool', 'evolutionDamage', 'criticalChancePer', 'moveSpeed', 'atkSpeed', 'stigmaPer', 'criticalDamagePer', 'evolutionBuff']
        arkAttr.forEach(function (attrArry) {
            if (!(validValue[attrArry] == undefined) && data.ArkPassive.IsArkPassive) {
                arkObj[attrArry] += validValue[attrArry];
            }
        })
    }


    /* **********************************************************************************************************************
     * name		              :	  arkPassiveValue{}
     * version                :   2.0
     * description            :   아크패시브 수치 추출 및 계산
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    function arkPassiveValue(e) {
        let arkPassiveVal = data.ArkPassive.Points[e].Value
        return arkPassiveVal
    }



    if (arkPassiveValue(0) >= 120) { // arkPassiveValue(0) == 진화수치

        arkObj.evolutionDamage += 1.45

    } else if (arkPassiveValue(0) >= 105) {

        arkObj.evolutionDamage += 1.35

    } else if (arkPassiveValue(0) >= 90) {

        arkObj.evolutionDamage += 1.30

    } else if (arkPassiveValue(0) >= 80) {

        arkObj.evolutionDamage += 1.25

    } else if (arkPassiveValue(0) >= 70) {

        arkObj.evolutionDamage += 1.20

    } else if (arkPassiveValue(0) >= 60) {

        arkObj.evolutionDamage += 1.15

    } else if (arkPassiveValue(0) >= 50) {

        arkObj.evolutionDamage += 1.10

    } else if (arkPassiveValue(0) >= 40) {

        arkObj.evolutionDamage += 1
    }



    if (arkPassiveValue(1) >= 100) { // arkPassiveValue(1) == 깨달음수치

        arkObj.enlightenmentDamage += 1.42
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 98) {

        arkObj.enlightenmentDamage += 1.40
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 97) {

        arkObj.enlightenmentDamage += 1.37
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 96) {

        arkObj.enlightenmentDamage += 1.37
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 95) {

        arkObj.enlightenmentDamage += 1.36
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 94) {

        arkObj.enlightenmentDamage += 1.36
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 93) {

        arkObj.enlightenmentDamage += 1.35
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 92) {

        arkObj.enlightenmentDamage += 1.35
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 90) {

        arkObj.enlightenmentDamage += 1.34
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 88) {

        arkObj.enlightenmentDamage += 1.33
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 86) {

        arkObj.enlightenmentDamage += 1.28
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 84) {

        arkObj.enlightenmentDamage += 1.27
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 82) {

        arkObj.enlightenmentDamage += 1.26
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 80) {

        arkObj.enlightenmentDamage += 1.25
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 78) {

        arkObj.enlightenmentDamage += 1.18
        arkObj.enlightenmentBuff += 1.32

    } else if (arkPassiveValue(1) >= 76) {

        arkObj.enlightenmentDamage += 1.17
        arkObj.enlightenmentBuff += 1.31

    } else if (arkPassiveValue(1) >= 74) {

        arkObj.enlightenmentDamage += 1.16
        arkObj.enlightenmentBuff += 1.30

    } else if (arkPassiveValue(1) >= 72) {

        arkObj.enlightenmentDamage += 1.15
        arkObj.enlightenmentBuff += 1.29

    } else if (arkPassiveValue(1) >= 64) {

        arkObj.enlightenmentDamage += 1.13
        arkObj.enlightenmentBuff += 1.28

    } else if (arkPassiveValue(1) >= 56) {

        arkObj.enlightenmentDamage += 1.125
        arkObj.enlightenmentBuff += 1.27

    } else if (arkPassiveValue(1) >= 48) {

        arkObj.enlightenmentDamage += 1.12
        arkObj.enlightenmentBuff += 1.26

    } else if (arkPassiveValue(1) >= 40) {

        arkObj.enlightenmentDamage += 1.115
        arkObj.enlightenmentBuff += 1.25

    } else if (arkPassiveValue(1) >= 32) {

        arkObj.enlightenmentDamage += 1.11
        arkObj.enlightenmentBuff += 1.24

    } else if (arkPassiveValue(1) >= 24) {

        arkObj.enlightenmentDamage += 1.10
        arkObj.enlightenmentBuff += 1.23

    } else {
        arkObj.enlightenmentDamage += 1
    }


    if (arkPassiveValue(2) >= 70) { // arkPassiveValue(2) == 도약 수치

        arkObj.leapDamage += 1.15

    } else if (arkPassiveValue(2) >= 68) {

        arkObj.leapDamage += 1.14

    } else if (arkPassiveValue(2) >= 66) {

        arkObj.leapDamage += 1.13

    } else if (arkPassiveValue(2) >= 64) {

        arkObj.leapDamage += 1.12

    } else if (arkPassiveValue(2) >= 62) {

        arkObj.leapDamage += 1.11

    } else if (arkPassiveValue(2) >= 60) {

        arkObj.leapDamage += 1.10

    } else if (arkPassiveValue(2) >= 50) {

        arkObj.leapDamage += 1.05

    } else if (arkPassiveValue(2) >= 40) {

        arkObj.leapDamage += 1.03

    } else {
        arkObj.leapDamage += 1
    }


    /* **********************************************************************************************************************
     * name		              :	  gemObj{}
     * version                :   2.0
     * description            :   직업 별 보석 딜지분 계산
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    let gemObj = {
        atkBuff: 0,
        damageBuff: 0,
    }

    // 보석4종 레벨별 비율
    let gemPerObj = [
        { name: "겁화", level1: 8, level2: 12, level3: 16, level4: 20, level5: 24, level6: 28, level7: 32, level8: 36, level9: 40, level10: 44 },
        { name: "멸화", level1: 3, level2: 6, level3: 9, level4: 12, level5: 15, level6: 18, level7: 21, level8: 24, level9: 30, level10: 40 },
        { name: "홍염", level1: 2, level2: 4, level3: 6, level4: 8, level5: 10, level6: 12, level7: 14, level8: 16, level9: 18, level10: 20 },
        { name: "작열", level1: 6, level2: 8, level3: 10, level4: 12, level5: 14, level6: 16, level7: 18, level8: 20, level9: 22, level10: 24 },
    ]

    let gemSkillArry = [];
    let specialClass;

    // 유저가 착용중인 보석,스킬 배열로 만들기

    if (data.ArmoryGem.Gems != null) {
        data.ArmoryGem.Gems.forEach(function (gem) {

            data.ArmoryProfile.CharacterClassName

            let regex = />([^<]*)</g;
            let match;
            let results = [];
            while ((match = regex.exec(gem.Tooltip)) !== null) {
                results.push(match[1]);
            }


            results.forEach(function (toolTip, idx) {

                toolTip = toolTip.replace(/"/g, '');

                if (toolTip.includes(data.ArmoryProfile.CharacterClassName) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {

                    let etcGemValue = results[idx + 2].substring(0, results[idx + 2].indexOf('"'))
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1])
                    } else {
                        gemName = "기타보석"
                    }
                    // let obj = { name: results[idx+1], gem: gemName, level : level};
                    let obj = { skill: results[idx + 1], name: gemName, level: level };
                    gemSkillArry.push(obj)

                } else if (!(toolTip.includes(data.ArmoryProfile.CharacterClassName)) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {  // 자신의 직업이 아닌 보석을 장착중인 경우

                    //console.log(toolTip)
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1])
                    } else {
                        gemName = "기타보석"
                    }
                    let obj = { skill: "직업보석이 아닙니다", name: gemName, level: level };
                    gemSkillArry.push(obj)

                }

            })

        })

    }

    htmlObj.gemSkillArry = gemSkillArry;
    //console.log("gemSkillArry",gemSkillArry)

    // 같은 스킬에 멸화/겁화 또는 작열/홍염이 중복되는 경우 처리하는 함수
    function filterDuplicateGems() {

        // 스킬 이름으로 그룹화
        const skillGroups = {};

        // 스킬 이름으로 gemSkillArry 그룹화
        gemSkillArry.forEach(gem => {
            if (!skillGroups[gem.skill]) {
                skillGroups[gem.skill] = [];
            }
            skillGroups[gem.skill].push(gem);
        });

        // 필터링된 보석 수 추적
        let filteredCount = 0;

        // 각 스킬 그룹에서 멸화/겁화 중복 처리
        Object.keys(skillGroups).forEach(skillName => {
            const gems = skillGroups[skillName];

            // 멸화/겁화 보석만 필터링
            const dmgGems = gems.filter(gem => gem.name === "멸화" || gem.name === "겁화");

            // 멸화/겁화 보석이 2개 이상인 경우에만 처리
            if (dmgGems.length >= 2) {
                //console.log(`중복 보석 발견: ${skillName} - ${dmgGems.length}개`);

                // 각 보석의 실제 값 계산
                dmgGems.forEach(gem => {
                    const gemInfo = gemPerObj.find(info => info.name === gem.name);
                    if (gemInfo) {
                        gem.actualValue = gemInfo[`level${gem.level}`];
                        //console.log(`${gem.skill} - ${gem.name} 레벨 ${gem.level} - 값: ${gem.actualValue} - 현재 skillPer: ${gem.skillPer}`);
                    } else {
                        gem.actualValue = 0;
                    }
                });

                // 배열에 담긴 겁멸+레벨의 값이 가장 높은 보석 찾기
                const maxValueGem = dmgGems.reduce((max, gem) =>
                    (gem.actualValue > max.actualValue) ? gem : max, dmgGems[0]);

                // 값이 가장 높은 것 외에는 skillPer를 0으로 설정
                dmgGems.forEach(gem => {
                    if (gem !== maxValueGem && gem.skillPer !== "none") {
                        gem.skillPer = 0;
                        //console.log(`skillPer 0으로 설정: ${gem.skill} - ${gem.name} 레벨 ${gem.level}`);
                        filteredCount++;
                    }
                });
            }

            // 작열/홍염 보석 필터링 및 처리
            const coolGems = gems.filter(gem => gem.name === "작열" || gem.name === "홍염");

            // 작열/홍염 보석이 2개 이상인 경우 처리
            if (coolGems.length >= 2) {
                //console.log(`중복 쿨다운 보석 발견: ${skillName} - ${coolGems.length}개`);

                // 각 보석의 실제 값 계산
                coolGems.forEach(gem => {
                    const gemInfo = gemPerObj.find(info => info.name === gem.name);
                    if (gemInfo) {
                        gem.actualValue = gemInfo[`level${gem.level}`];
                        //console.log(`${gem.skill} - ${gem.name} 레벨 ${gem.level} - 값: ${gem.actualValue} - 현재 skillPer: ${gem.skillPer}`);
                    } else {
                        gem.actualValue = 0;
                    }
                });

                // 배열에 담긴 작열/홍염+레벨의 값이 가장 높은 보석 찾기
                const maxValueGem = coolGems.reduce((max, gem) =>
                    (gem.actualValue > max.actualValue) ? gem : max, coolGems[0]);

                // 값이 가장 높은 것 외에는 skillPer를 0으로 설정
                coolGems.forEach(gem => {
                    if (gem !== maxValueGem && gem.skillPer !== "none") {
                        gem.skillPer = 0;
                        //console.log(`skillPer 0으로 설정: ${gem.skill} - ${gem.name} 레벨 ${gem.level}`);
                        filteredCount++;
                    }
                });
            }
        });
        return gemSkillArry;
    }


    if (true) {

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
            return supportCheck() == className;
        }

        if (classCheck("전태") && skillCheck(gemSkillArry, "버스트 캐넌", dmg)) {
            specialClass = "버캐 채용 전태";
        } else if (classCheck("고기") && !skillCheck(gemSkillArry, "파이어 불릿", dmg)) {
            specialClass = "5겁 고기";
        } else if (classCheck("세맥") && !skillCheck(gemSkillArry, "환영격", dmg)) {
            specialClass = "5멸 세맥";
        } else if (classCheck("역천") && !skillCheck(gemSkillArry, "벽력장", dmg)) {
            specialClass = "5겁 역천";
        } else if (classCheck("핸건") && skillCheck(gemSkillArry, "데스파이어", dmg)) {
            specialClass = "7멸 핸건";
        } else if (classCheck("포강") && skillCheck(gemSkillArry, "에너지 필드", per)) {
            specialClass = "에필 포강";
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
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "데스 센텐스", dmg) && skillCheck(gemSkillArry, "블리츠 러시", dmg) && skillCheck(gemSkillArry, "터닝 슬래쉬", dmg)) {
            specialClass = "슈차 7멸 잔재";
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "터닝 슬래쉬", dmg) && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 터닝 잔재";
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 잔재";
        } else if (classCheck("일격") && skillCheck(gemSkillArry, "오의 : 뇌호격", dmg) && skillCheck(gemSkillArry, "오의 : 풍신초래", dmg) && skillCheck(gemSkillArry, "오의 : 호왕출현", dmg) && skillCheck(gemSkillArry, "방천격", dmg)) {
            specialClass = "4멸 일격";
        } else if (classCheck("일격") && !skillCheck(gemSkillArry, "오의 : 뇌호격", dmg) && skillCheck(gemSkillArry, "오의 : 풍신초래", dmg) && skillCheck(gemSkillArry, "오의 : 호왕출현", dmg)) {
            specialClass = "풍신 일격";
        } else if (classCheck("수라") && !skillCheck(gemSkillArry, "청월난무", dmg) && !skillCheck(gemSkillArry, "유성 낙하", dmg)) {
            specialClass = "4겁 수라";
        } else if (classCheck("수라") && skillCheck(gemSkillArry, "수라결 기본 공격", dmg) && skillCheck(gemSkillArry, "파천섬광", dmg) && skillCheck(gemSkillArry, "진 파공권", dmg) && skillCheck(gemSkillArry, "유성 낙하", dmg) && skillCheck(gemSkillArry, "청월난무", dmg) && skillCheck(gemSkillArry, "비상격", dmg)) {
            specialClass = "6겁 수라";
        } else if (classCheck("억제") && skillCheck(gemSkillArry, "데몰리션", dmg) && (skillCheck(gemSkillArry, "그라인드 체인", dmg) || skillCheck(gemSkillArry, "스피닝 웨폰", dmg))) {
            specialClass = "반사멸 억모닉";
        } else if (classCheck("억제") && skillCheck(gemSkillArry, "데몰리션", dmg)) {
            specialClass = "사멸 억모닉";
        } else if (classCheck("환각") || classCheck("서폿") || classCheck("진실된 용맹") || classCheck("회귀") || classCheck("환류")) {
            specialClass = "데이터 없음";
        } else {
            specialClass = supportCheck();
        }

    }
    //console.log("보석전용 직업 : ",specialClass)


    gemSkillArry.forEach(function (gemSkill, idx) {

        let realClass = Modules.originFilter.classGemFilter.filter(item => item.class == specialClass);

        if (realClass.length == 0) {
            gemSkillArry[idx].skillPer = "none"
        } else {

            let realSkillPer = realClass[0].skill.filter(item => item.name == gemSkill.skill);

            if (realSkillPer[0] != undefined) {
                gemSkillArry[idx].skillPer = realSkillPer[0].per;
            } else {
                gemSkillArry[idx].skillPer = "none";
            }
        }
    })

    // skillPer가 설정된 후 중복된 멸화/겁화 보석 필터링 적용
    filterDuplicateGems();

    // 직업별 보석 지분율 필터
    let classGemEquip = Modules.originFilter.classGemFilter.filter(function (filterArry) {
        return filterArry.class == specialClass;
    })
    //console.log(classGemEquip)
    //console.log("gemSkillArry",gemSkillArry)

    function gemCheckFnc() {
        try {
            // console.log(classGemEquip)
            let realGemValue = classGemEquip[0].skill.map(skillObj => {

                // 필터링 결과(skillPer가 0인 보석은 제외)를 realGemValue에 올바르게 반영
                let matchValue = gemSkillArry.filter(item =>
                    item.skill == skillObj.name &&
                    (item.skillPer !== 0 || item.skillPer === "none")
                );

                if (!(matchValue.length == 0)) {
                    // console.log(matchValue)
                    return {
                        name: skillObj.name,
                        per: skillObj.per,
                        gem: matchValue,
                    }
                }
            }).filter(Boolean);

            // console.log(realGemValue)
            // gemPerObj.name == realGemValue.name && realGemValue.gem.match(/멸화|겁화/g)[0];


            let coolGemTotal = 0;
            let count = 0;

            gemSkillArry.forEach(function (gemListArry) {
                if (gemListArry.name == "홍염" || gemListArry.name == "작열") {
                    let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                    // console.log(perValue[0][`level${gemListArry.level}`]);

                    coolGemTotal += perValue[0][`level${gemListArry.level}`];
                    count++;
                }
            })

            let averageValue = count > 0 ? coolGemTotal / count : 0;



            // console.log("평균값 : "+averageValue)

            let etcAverageValue;
            let dmgGemTotal = 0;
            let dmgCount = 0;

            // console.log(gemList)
            if (specialClass == "데이터 없음") {
                gemSkillArry.forEach(function (gemListArry) {
                    if (gemListArry.name == "멸화" || gemListArry.name == "겁화") {
                        let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                        // console.log(perValue[0][`level${gemListArry.level}`]);

                        dmgGemTotal += perValue[0][`level${gemListArry.level}`];
                        dmgCount++;
                    }
                })

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
            let gemValue = getLevels(gemPerObj, realGemValue).reduce((gemResultValue, finalGemValue) => {
                // console.log("gemResultValue" + gemResultValue)
                // console.log("finalGemValue.per" + finalGemValue.per)
                // console.log("finalGemValue.skillper" + finalGemValue.skillPer)
                return gemResultValue + finalGemValue.per * finalGemValue.skillPer
            }, 0)


            // special skill Value 값 계산식
            function specialSkillCalc() {
                let result = 0;
                classGemEquip[0].skill.forEach(function (skill) {
                    if (skill.per != "etc") {
                        result += skill.per;
                    }
                })
                return 1 / result
            }

            // 홍염,작열 평균레벨
            return {
                specialSkill: specialSkillCalc(),
                originGemValue: gemValue,
                gemValue: (gemValue * specialSkillCalc()) / 100 + 1,
                gemAvg: averageValue,
                etcAverageValue: etcAverageValue / 100 + 1,
            }
        } catch (error) {
            console.log(error)
            return {
                specialSkill: 1,
                originGemValue: 1,
                gemValue: 1,
                gemAvg: 0,
                etcAverageValue: 1,
            }

        }
    }
    // gemCheckFnc() // <==보석 딜지분 최종값
    // console.log("잼체크함수",gemCheckFnc())
    etcObj.gemCheckFnc = gemCheckFnc();






    // 서폿용 보석 스킬명, 스킬수치 구하기

    if (!(data.ArmoryGem.Gems == null) && supportCheck() == "서폿") {

        data.ArmoryGem.Gems.forEach(function (gem) {
            let atkBuff = ['천상의 축복', '천상의 연주', '묵법 : 해그리기']
            let damageBuff = ['신성의 오라', '세레나데 스킬', '음양 스킬']
            let gemInfo = JSON.parse(gem.Tooltip)
            let type = gemInfo.Element_000.value
            let level
            if (!(gemInfo.Element_004.value == null)) {
                level = gemInfo.Element_004.value.replace(/\D/g, "")
            }
            let skill
            if (!(gemInfo.Element_006.value.Element_001 == undefined)) {
                skill = gemInfo.Element_006.value.Element_001.match(/>([^<]+)</)[1]
            }

            atkBuff.forEach(function (buffSkill) {
                if (skill == buffSkill && type.includes("겁화")) {
                    gemObj.atkBuff += Number(level)
                }
            })

            damageBuff.forEach(function (buffSkill) {
                if (skill == buffSkill && type.includes("겁화")) {
                    gemObj.damageBuff += Number(level)
                }
            })

        })
    }


    /* **********************************************************************************************************************
     * name		              :	  AttackBonus{}
     * version                :   2.0
     * description            :   보석, 어빌리티스톤 기본 공격력 추출
     * USE_TN                 :   사용
     *********************************************************************************************************************** */


    function gemAttackBonus() {
        let regex = /:\s*([\d.]+)%/
        if (!(data.ArmoryGem.Effects.Description == "")) {
            return Number(data.ArmoryGem.Effects.Description.match(regex)[1])
        } else {
            return 0
        }
    }
    function abilityAttackBonus() {
        let result = 0
        data.ArmoryEquipment.forEach(function (equip) {
            if (equip.Type == "어빌리티 스톤") {
                let regex = /기본 공격력\s\+([0-9.]+)%/;
                if (regex.test(equip.Tooltip)) {
                    result = Number(equip.Tooltip.match(regex)[1]);
                    return result
                }

            }
        })
        return result
    }
    etcObj.gemAttackBonus = gemAttackBonus();
    etcObj.abilityAttackBonus = abilityAttackBonus();

    /* **********************************************************************************************************************
     * name		              :	  avatarStats{}
     * version                :   2.0
     * description            :   전설/영웅 아바타 힘민지 추출
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    function avatarStats() {

        let result;

        const validTypes = ["무기 아바타", "머리 아바타", "상의 아바타", "하의 아바타"];
        const seenTypes = new Set();
        let bonusTotal = 0;
        let hasTopBottomLegendary = false;

        if (data.ArmoryAvatars != null) {
            data.ArmoryAvatars.forEach(item => {
                if ((item.Type === "상의 아바타" || item.Type === "하의 아바타") && item.Grade === "전설") {
                    hasTopBottomLegendary = true;
                }
            });
            data.ArmoryAvatars.forEach(item => {
                const isTopBottomAvatar = item.Tooltip.includes("상의&하의 아바타");
                if (validTypes.includes(item.Type) && !seenTypes.has(item.Type)) {
                    if (isTopBottomAvatar && !hasTopBottomLegendary) {
                        bonusTotal += 2;
                        seenTypes.add(item.Type);
                    } else if (item.Grade === "전설") {
                        bonusTotal += 2;
                        seenTypes.add(item.Type);
                    } else if (item.Grade === "영웅" && !seenTypes.has(item.Type)) {
                        bonusTotal += 1;
                        seenTypes.add(item.Type);
                    }
                }
            });

            result = bonusTotal / 100 + 1;
        } else {

            result = 1;
        }

        return result
    }
    // console.log(avatarStats()) <= 전설/영웅 아바타 스텟
    etcObj.avatarStats = avatarStats();


    /* **********************************************************************************************************************
     * name		              :	  karmaPoint{}
     * version                :   2.0
     * description            :   깨달음 및 진화 카르마
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    function karmaPointCalc() {
        let cardHP = totalMaxHpBonus
        let maxHealth = defaultObj.maxHp
        let baseHealth = defaultObj.statHp + elixirObj.statHp + accObj.statHp + hyperObj.statHp + bangleObj.statHp;
        let vitalityRate = defaultObj.hpActive;
        let healthValue = jobObj.healthPer;
        const isSupport = etcObj.supportCheck === "서폿" || etcObj.supportCheck === "진실된 용맹" || etcObj.supportCheck === "회귀" || etcObj.supportCheck === "심판자"; // isSupport 값 계산

        // 체력 계산 관련 추가 로그
        //console.log("==== 체력 계산 기본 정보 ====");
        //console.log("최대 체력(maxHealth):", maxHealth);
        //console.log("기본 체력(baseHealth):", baseHealth, "내역:", {
        //    defaultHp: defaultObj.statHp,
        //    elixirHp: elixirObj.statHp,
        //    accHp: accObj.statHp,
        //    hyperHp: hyperObj.statHp,
        //    bangleHp: bangleObj.statHp
        //});
        //console.log("생명 활성력(vitalityRate):", vitalityRate);
        //console.log("직업 체력 계수(healthValue):", healthValue);

        // --- 상수 정의 ---
        const KARMA_HP_PER_LEVEL = 400; // 외부로 이동

        // --- calculateKarmaLevel 함수: 카르마 레벨 추정 ---
        function calculateKarmaLevel(maxHealth, baseHealth, vitalityRate, healthValue, isSupport) {
            const PET_PERCENTS = [0, 0.01, 0.02, 0.03, 0.04, 0.05];
            const RANGER_PERCENTS = [0, 0.008, 0.014, 0.02];
            const KARMA_HP_PER_LEVEL = 400;
            const EXACT_HP_TOLERANCE = 2.5;

            let allResults = [];

            // 1. 모든 버프 조합에 대해 카르마 레벨 역산 및 후보 생성
            for (let petIdx = 0; petIdx < PET_PERCENTS.length; petIdx++) {
                for (let rangerIdx = 0; rangerIdx < RANGER_PERCENTS.length; rangerIdx++) {
                    const petPercent = PET_PERCENTS[petIdx];
                    const rangerPercent = RANGER_PERCENTS[rangerIdx];
                    const currentCardPercent = cardHP || 0;
                    const percentFactor = (1 + petPercent + rangerPercent + currentCardPercent);
                    const flatHpBonus = 0;

                    const estimatedKarma = ((maxHealth / (percentFactor * vitalityRate)) - baseHealth - flatHpBonus) / KARMA_HP_PER_LEVEL;
                    const roundedValue = Math.round(estimatedKarma);
                    const proximity = Math.abs(estimatedKarma - roundedValue);
                    const isPossible = !isNaN(estimatedKarma) && estimatedKarma >= -0.5 && roundedValue <= 30;

                    const karmaHpForRounded = roundedValue * KARMA_HP_PER_LEVEL;
                    const sumForRounded = baseHealth + flatHpBonus + karmaHpForRounded;
                    const intermediateRounded = sumForRounded * vitalityRate;
                    const roundedIntermediateRounded = Math.round(intermediateRounded);
                    const maxHpUsingRoundedKarma = roundedIntermediateRounded * percentFactor;

                    const totalPercentBonus = petPercent + rangerPercent;
                    let unifiedDesc = `펫${petIdx}|방범대${rangerIdx}`;
                    if (Math.abs(totalPercentBonus - 0.02) < 0.001) unifiedDesc = `효과(2%)`;
                    else if (Math.abs(totalPercentBonus - 0.05) < 0.001) unifiedDesc = `효과(5%)`;

                    allResults.push({
                        formulaDesc: unifiedDesc, rangerIdx: rangerIdx,
                        karmaExact: estimatedKarma, karmaRounded: roundedValue, proximity: proximity,
                        isPossible: isPossible, buffLevelSum: petIdx + rangerIdx,
                        maxHpUsingRoundedKarma: maxHpUsingRoundedKarma
                    });
                }
            }

            // 2. 필터링: 유효성, Proximity, 중복 제거, Low Proximity
            const possibleResults = allResults.filter(r => r.isPossible);
            if (possibleResults.length === 0) {
                console.error("Karma Calc Error: No possible scenarios", { maxHealth, baseHealth, vitalityRate });
                return { bestResult: { formulaDesc: "오류: 추정 불가", karmaLevel: 0, exactValue: NaN, proximity: Infinity }, allResults };
            }

            const filteredByProximity = possibleResults.filter(r => r.proximity <= 0.02);
            const workingResultsStep1 = filteredByProximity.length > 0 ? filteredByProximity : possibleResults;

            const uniqueResults = [];
            const seenKeys = new Set();
            workingResultsStep1.forEach(r => {
                const key = `${r.karmaRounded}-${r.proximity.toFixed(5)}`;
                if (!seenKeys.has(key)) { uniqueResults.push(r); seenKeys.add(key); }
            });
            let currentWorkingResults = uniqueResults;

            const lowProximityMatches = currentWorkingResults.filter(r => r.proximity < 0.005);
            if (lowProximityMatches.length > 0) currentWorkingResults = lowProximityMatches;

            if (currentWorkingResults.length === 0) {
                console.error("Karma Calc Error: No candidates after filtering");
                return { bestResult: { formulaDesc: "오류: 유효 후보 없음", karmaLevel: 0, exactValue: NaN, proximity: Infinity }, allResults: [] };
            }

            // 3. 정확한 체력 일치 확인 (maxHpUsingRoundedKarma 기준)
            const exactMatches = currentWorkingResults.filter(r =>
                Math.abs(maxHealth - r.maxHpUsingRoundedKarma) < EXACT_HP_TOLERANCE
            );
            let exactMatchFound = exactMatches.length > 0;
            let finalBestResult;

            // --- 후보 비교 함수 ---
            function compareCandidates(a, b) {
                const diffA = Math.abs(maxHealth - a.maxHpUsingRoundedKarma);
                const diffB = Math.abs(maxHealth - b.maxHpUsingRoundedKarma);
                if (diffA !== diffB) return diffA - diffB;
                if (a.proximity === 0 && b.proximity === 0) return 0;
                if (a.proximity === 0) return -1;
                if (b.proximity === 0) return 1;
                return a.proximity - b.proximity;
            }
            // --- 비교 함수 끝 ---

            // 4. 최종 후보 선택
            if (exactMatchFound) {
                // 단독 펫1 후보 제외 시도
                const filteredMatches = exactMatches.filter(match => {
                    const petIdx = match.buffLevelSum - match.rangerIdx;
                    return !(petIdx === 1 && match.rangerIdx === 0);
                });
                let candidates = filteredMatches.length > 0 ? filteredMatches : exactMatches;

                if (candidates.length === 1) {
                    finalBestResult = candidates[0];
                } else {
                    candidates.sort(compareCandidates);
                    finalBestResult = candidates[0];
                }
            } else { // 정확한 일치 없을 경우
                currentWorkingResults.sort(compareCandidates); // Rounded HP diff -> proximity 정렬
                finalBestResult = currentWorkingResults[0];
            }

            // 5. 최종 결과 반환 (범위 보정 포함)
            let finalKarmaLevel = Math.round(finalBestResult.karmaExact);
            finalKarmaLevel = Math.max(0, Math.min(30, finalKarmaLevel));

            return {
                bestResult: {
                    formulaDesc: finalBestResult.formulaDesc + (Math.round(finalBestResult.karmaExact) < 0 ? ` (R:${finalKarmaLevel}, fix)` : ''),
                    karmaLevel: finalKarmaLevel,
                    exactValue: finalBestResult.karmaExact.toFixed(4),
                    proximity: finalBestResult.proximity.toFixed(4)
                },
                allResults: currentWorkingResults
            };
        }
        // --- calculateKarmaLevel 함수 끝 ---

        // 함수 호출 및 결과 처리
        const result = calculateKarmaLevel(maxHealth, baseHealth, vitalityRate, healthValue, isSupport);

        // 결과 로깅 (필요시 주석 해제)
        //console.log("카르마 추정 결과:", result.bestResult);
        //console.log("모든 가능성:", result.allResults);

        etcObj.evolutionkarmaRank = 0; // 기본값 설정
        etcObj.evolutionkarmaPoint = result.bestResult.karmaLevel;

        // 랭크 계산
        if (etcObj.evolutionkarmaPoint >= 21) etcObj.evolutionkarmaRank = 6;
        else if (etcObj.evolutionkarmaPoint >= 17) etcObj.evolutionkarmaRank = 5;
        else if (etcObj.evolutionkarmaPoint >= 13) etcObj.evolutionkarmaRank = 4;
        else if (etcObj.evolutionkarmaPoint >= 9) etcObj.evolutionkarmaRank = 3;
        else if (etcObj.evolutionkarmaPoint >= 5) etcObj.evolutionkarmaRank = 2;
        else if (etcObj.evolutionkarmaPoint >= 1) etcObj.evolutionkarmaRank = 1;

        // 깨달음 포인트 및 무기 공격력 계산
        let enlightkarmaPoint = (arkPassiveValue(1) - (data.ArmoryProfile.CharacterLevel - 50) - accObj.enlightPoint - 14);
        arkObj.weaponAtkPer = 1;
        if (enlightkarmaPoint >= 6) arkObj.weaponAtkPer = 1.021;
        else if (enlightkarmaPoint >= 5) arkObj.weaponAtkPer = 1.017;
        else if (enlightkarmaPoint >= 4) arkObj.weaponAtkPer = 1.013;
        else if (enlightkarmaPoint >= 3) arkObj.weaponAtkPer = 1.009;
        else if (enlightkarmaPoint >= 2) arkObj.weaponAtkPer = 1.005;
        else if (enlightkarmaPoint >= 1) arkObj.weaponAtkPer = 1.001;

    };
    karmaPointCalc();


    /* **********************************************************************************************************************
     * name		              :	  armoryInfoExtract
     * version                :   2.0
     * description            :   html에 사용될 armory정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function armoryInfoExtract() {
        let result = null;
        result = data.ArmoryEquipment.map(armoryObj => {
            if (/무기|투구|상의|하의|장갑|어깨/.test(armoryObj.Type)) {
                let obj = {};
                let betweenText = armoryObj.Tooltip.match(/>([^<]+)</g)?.map(match => match.slice(1, -1)) || [];
                let advancedLevelIndex = betweenText.findIndex(text => text === "[상급 재련]");

                let elixir = betweenText.map((text, idx) => {
                    if (/\[(투구|어깨|장갑|상의|하의|무기|공용)\]/.test(text)) {
                        let obj = {}
                        obj.type = text;
                        obj.name = betweenText[idx + 1].trim();
                        obj.level = betweenText[idx + 2].trim();
                        return obj
                    }
                    return null;
                }).filter(item => item !== null);

                let qualityIndex = betweenText.findIndex(text => text === "품질");
                let qualityValue = betweenText[qualityIndex + 3].match(/"qualityValue":\s*(\d+)/)[1];

                let tierValue = betweenText.find(text => /\(티어\s[0-9]+\)/.test(text)).match(/\(티어\s([0-9]+)\)/)[1];

                let hyperIndex = betweenText.findIndex(text => text === "[초월]");
                let hyperLevel = betweenText[hyperIndex + 2];
                let hyperStar = betweenText[hyperIndex + 4].match(/\d+/)[0];

                obj.hyperIndex = hyperIndex;
                obj.hyperLevel = hyperLevel;
                obj.hyperStar = hyperStar;
                obj.tier = tierValue;
                obj.quality = qualityValue;
                obj.elixir = elixir;
                obj.advancedLevelIndex = advancedLevelIndex;
                obj.advancedLevel = betweenText[advancedLevelIndex + 2];
                obj.grade = armoryObj.Grade;
                obj.name = armoryObj.Name;
                obj.type = armoryObj.Type;
                obj.icon = armoryObj.Icon;
                return obj
            } else {
                return null
            }
        }).filter(item => item !== null);
        return result
    }
    htmlObj.armoryInfo = armoryInfoExtract()

    /* **********************************************************************************************************************
     * name		              :	  accessoryInfoExtract
     * version                :   2.0
     * description            :   html에 사용될 accessory정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function accessoryInfoExtract() {
        let result = data.ArmoryEquipment.map((accessoryObj, idx) => {
            if (/목걸이|귀걸이|반지/.test(accessoryObj.Type)) {
                let obj = {};
                let betweenText = accessoryObj.Tooltip.match(/>([^<]+)</g)?.map(match => match.slice(0, -1)) || [];
                let gradeMatch = betweenText[2].match(/(고대|유물)/g);
                let grade = gradeMatch ? gradeMatch[0] : "없음";
                let strStats = betweenText.find(item => /힘 \+(\d+)/.test(item));
                strStats = Number(strStats.match(/힘 \+(\d+)/)[1]);
                let tierMatch = betweenText[6].match(/\d+/);
                let tier = tierMatch ? tierMatch[0] : null;
                let accessoryTooltip = accessoryObj.Tooltip.replace(/<[^>]*>/g, '')

                let accessoryGradeArray = Modules.originFilter.grindingFilter.filter(filter => {
                    let check = filter.split(":")[0];
                    if (accessoryTooltip.includes(check)) {
                        accessoryTooltip = accessoryTooltip.replace(check, "")
                        return true;
                    }
                })
                // console.log(accessoryGradeArray)
                let qualityIndex = betweenText.findIndex(text => text === ">품질");
                let qualityValueMatch = betweenText[qualityIndex + 3]?.match(/"qualityValue":\s*(\d+)/);
                let qualityValue = qualityValueMatch ? qualityValueMatch[1] : null;

                obj.grade = grade;
                obj.quality = qualityValue;
                obj.accessory = accessoryGradeArray;
                obj.tier = tier;
                obj.type = accessoryObj.Type;
                obj.name = accessoryObj.Name;
                obj.icon = accessoryObj.Icon;
                obj.stats = strStats;
                return obj;
            } else {
                return null;
            }
        }).filter(item => item !== null);
        return result;
    }
    htmlObj.accessoryInfo = accessoryInfoExtract();

    etcObj.sumStats = htmlObj.accessoryInfo.reduce((acc, item) => {
        return acc + (item.stats || 0);
    }, 0);

    /* **********************************************************************************************************************
     * name		              :	  stoneInfoExtract
     * version                :   2.0
     * description            :   html에 사용될 accessory정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function stoneInfoExtract() {
        let result = null;
        data.ArmoryEquipment.forEach(stone => {
            let obj = {};
            if (stone.Type === "어빌리티 스톤") {
                let betweenText = stone.Tooltip.match(/>([^<]+)</g)?.map(match => match.slice(1, -1)) || [];

                let tier = betweenText[4].match(/\d+/)[0];

                let optionArray = betweenText.map((text, idx) => {
                    if (Modules.originFilter.engravingFilter.some(filter => text === filter.name)) {
                        let obj = {};
                        obj.name = text;
                        obj.level = betweenText[idx + 2].match(/\d+/)[0];
                        return obj
                    } else {
                        return null;
                    }
                }).filter(item => item !== null);
                obj.optionArray = optionArray;
                obj.tier = tier
                obj.grade = stone.Grade;
                obj.name = stone.Name;
                obj.icon = stone.Icon;
                result = obj;
            }
        })
        return result;
    }
    htmlObj.stoneInfo = stoneInfoExtract();

    /* **********************************************************************************************************************
     * name		              :	  bangleInfoExtract
     * version                :   2.0
     * description            :   html에 사용될 accessory정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    function bangleInfoExtract() {
        let result = null;
        data.ArmoryEquipment.forEach(bangle => {
            let obj = {};
            if (bangle.Type === "팔찌") {
                let betweenText = bangle.Tooltip.match(/>([^<]+)</g)?.map(match => match.slice(1, -1)) || [];
                let replaceText = bangle.Tooltip.replace(/<[^>]*>/g, '');
                let tier = betweenText[4].match(/\d+/)[0];
                let bangleFilter;
                if (tier === "3" && bangle.Grade === "유물") {
                    bangleFilter = Modules.simulatorFilter.bangleOptionData.t3RelicData;
                } else if (tier === "3" && bangle.Grade === "고대") {
                    bangleFilter = Modules.simulatorFilter.bangleOptionData.t3MythicData;
                } else if (tier === "4" && bangle.Grade === "유물") {
                    bangleFilter = Modules.simulatorFilter.bangleOptionData.t4RelicData;
                } else if (tier === "4" && bangle.Grade === "고대") {
                    bangleFilter = Modules.simulatorFilter.bangleOptionData.t4MythicData;
                }
                // console.log(replaceText)
                let options = bangleFilter.filter(filter => {
                    if (replaceText.includes(filter.fullName)) {
                        // console.log(filter.fullName)
                        replaceText = replaceText.replace(filter.fullName, "")
                        return true;
                    };
                });
                let specialStats = betweenText.filter(text => /(치명|특화|신속)\s*\+(\d+)/g.test(text.trim()));
                let normalStats = betweenText.filter(text => /(힘|민첩|지능|체력)\s*\+(\d+)/g.test(text.trim()));
                specialStats = specialStats.map(stat => stat.match(/(치명|특화|신속)\s*\+(\d+)/g)[0])
                normalStats = normalStats.map(stat => stat.match(/(힘|민첩|지능|체력)\s*\+(\d+)/g)[0])
                obj.normalStatsArray = normalStats;
                obj.specialStatsArray = specialStats;
                obj.optionArray = options;
                obj.tier = tier;
                obj.grade = bangle.Grade;
                obj.name = bangle.Name;
                obj.icon = bangle.Icon;
                result = obj;
            }

        })
        return result;
    }
    htmlObj.bangleInfo = bangleInfoExtract();

    /* **********************************************************************************************************************
     * name		                   :   DB READ
     * version                     :   2.0
     * description                 :   DB 조회용 코드
     * USE_TN                      :   layout.js로 이전됨
     * getCombinedCharacterData    :   단일 요청으로 캐릭터 종합 데이터 조회
     *********************************************************************************************************************** */
    // getCombinedCharacterData(
    //     data.ArmoryProfile.CharacterName,
    //     supportCheck() == "서폿" ? "SUP" : "DEAL"
    // ).then(function (response) {
    //     if (response.result === "S") {
    //         const combinedData = response.data;
    //         const characterClass = data.ArmoryProfile.CharacterClassName;
    //         const isSupport = supportCheck() === "서폿";
    //         const rankingType = isSupport ? "SUP" : "DEAL";

    //         // 1. 캐릭터 최고 점수 정보 출력
    //         if (combinedData.characterBest) {
    //             const characterData = combinedData.characterBest;
    //             console.log("=== 달성 최고 점수 정보 ===");
    //             console.log("달성 최고 점수(서포트):", characterData.LCHB_TOTALSUMSUPPORT);
    //             console.log("달성 최고 점수(딜러):", characterData.LCHB_TOTALSUM);
    //             console.log("달성 일시:", characterData.LCHB_ACHIEVE_DATE);
    //         }

    //         // 2. 직업별 랭킹 정보 출력
    //         if (combinedData.classRanking) {
    //             const rankingData = combinedData.classRanking;
    //             let CLASS_PERCENTILE = ((rankingData.CLASS_RANK / rankingData.TOTAL_IN_CLASS) * 100).toFixed(2)

    //             // 직접 객체 사용 (배열이 아님)
    //             console.log("=== 직업 랭킹 정보 ===");
    //             console.log(`${characterClass} 직업 내 순위: ${rankingData.CLASS_RANK}위`);
    //             console.log(`전체 ${rankingData.TOTAL_IN_CLASS}명 중 상위 ${CLASS_PERCENTILE}%`);
    //         } else {
    //             console.log(`${characterClass} 직업 랭킹 정보를 찾을 수 없습니다.`);
    //         }

    //         // 3. 캐릭터 랭킹 정보 출력
    //         if (combinedData.characterRanking) {
    //             const rankData = combinedData.characterRanking;
    //             console.log("랭킹:", rankData.RANKING_NUM);
    //             console.log("점수:", rankData.LCHB_TOTALSUM);
    //         } else {
    //             console.log("랭킹에 해당 캐릭터 정보가 없습니다.");
    //         }

    //         // 4. 전체 랭킹 백분율 정보 출력
    //         if (combinedData.percentile) {
    //             const rankData = combinedData.percentile;
    //             console.log("=== 전체 랭킹 정보 ===");
    //             console.log(`전체 순위: ${rankData.OVERALL_RANK}위`);
    //             console.log(`전체 ${rankData.TOTAL_CHARACTERS}명 중 상위 ${rankData.OVERALL_PERCENTILE}%`);
    //         }
    //     } else {
    //         console.log("종합 데이터 조회 실패:", response.error);
    //     }
    // }).catch(function (error) {
    //     console.error("종합 데이터 조회 중 오류 발생:", error);
    // });


    /* **********************************************************************************************************************
     * name		              :	  engravingInfoExtract
     * version                :   2.0
     * description            :   html에 사용될 각인정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function engravingInfoExtract() {
        let result = [];

        if (data.ArmoryEngraving) {
            data.ArmoryEngraving.ArkPassiveEffects.forEach(eng => {
                let obj = {};
                let icon = Modules.originFilter.engravingImg.find(filter => filter.split("^")[0] === eng.Name);

                obj.stone = eng.AbilityStoneLevel;
                obj.grade = eng.Grade;
                obj.level = eng.Level;
                obj.name = eng.Name;
                obj.icon = icon.split("^")[1];
                result.push(obj);
            })

        }
        return result;
    }
    htmlObj.engravingInfo = engravingInfoExtract();

    /* **********************************************************************************************************************
     * name		              :	  medianInfoExtract
     * version                :   2.0
     * description            :   현재 유저통계 중앙값 정보를 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function medianInfoExtract() {
        let result = {
            dealerMedianValue: 0,
            supportMedianValue: 0,
            supportMinMedianValue: 467.7,
            dealerMinMedianValue: 850.76,

        };
        let itemLevel = Number(data.ArmoryProfile.ItemAvgLevel.replace(",", ""));
        if (itemLevel >= 1660 && itemLevel < 1665) {
            result.dealerMedianValue = 850.76;
        } else if (itemLevel >= 1665 && itemLevel < 1670) {
            result.dealerMedianValue = 924.28;
        } else if (itemLevel >= 1670 && itemLevel < 1675) {
            result.dealerMedianValue = 964.7;
        } else if (itemLevel >= 1675 && itemLevel < 1680) {
            result.dealerMedianValue = 994.5;
        } else if (itemLevel >= 1680 && itemLevel < 1685) {
            result.dealerMedianValue = 1325.26;
        } else if (itemLevel >= 1685 && itemLevel < 1690) {
            result.dealerMedianValue = 1519.61;
        } else if (itemLevel >= 1690 && itemLevel < 1695) {
            result.dealerMedianValue = 1582.77;
        } else if (itemLevel >= 1695 && itemLevel < 1700) {
            result.dealerMedianValue = 1667.06;
        } else if (itemLevel >= 1700 && itemLevel < 1705) {
            result.dealerMedianValue = 1752.28;
        } else if (itemLevel >= 1705 && itemLevel < 1710) {
            result.dealerMedianValue = 1892.32;
        } else if (itemLevel >= 1710 && itemLevel < 1715) {
            result.dealerMedianValue = 1975.57;
        } else if (itemLevel >= 1715 && itemLevel < 1720) {
            result.dealerMedianValue = 2035.25;
        } else if (itemLevel >= 1720 && itemLevel < 1725) {
            result.dealerMedianValue = 2194.97;
        } else if (itemLevel >= 1725 && itemLevel < 1730) {
            result.dealerMedianValue = 2313.58;
        } else if (itemLevel >= 1730 && itemLevel < 1735) {
            result.dealerMedianValue = 2442.87;
        } else if (itemLevel >= 1735 && itemLevel < 1740) {
            result.dealerMedianValue = 2579.64;
        } else if (itemLevel >= 1740 && itemLevel < 1745) {
            result.dealerMedianValue = 2760.11;
        } else if (itemLevel >= 1745 && itemLevel < 1750) {
            result.dealerMedianValue = 2874.06;
        } else if (itemLevel >= 1750) {
            result.dealerMedianValue = 3265.48;
        }

        // console.log(itemLevel)
        if (itemLevel >= 1660 && itemLevel < 1665) {
            result.supportMedianValue = 467.7;
        } else if (itemLevel >= 1665 && itemLevel < 1670) {
            result.supportMedianValue = 489.26;
        } else if (itemLevel >= 1670 && itemLevel < 1675) {
            result.supportMedianValue = 521.7;
        } else if (itemLevel >= 1675 && itemLevel < 1680) {
            result.supportMedianValue = 529.00;
        } else if (itemLevel >= 1680 && itemLevel < 1685) {
            result.supportMedianValue = 656.21;
        } else if (itemLevel >= 1685 && itemLevel < 1690) {
            result.supportMedianValue = 716.56;
        } else if (itemLevel >= 1690 && itemLevel < 1695) {
            result.supportMedianValue = 733.28;
        } else if (itemLevel >= 1695 && itemLevel < 1700) {
            result.supportMedianValue = 773.79;
        } else if (itemLevel >= 1700 && itemLevel < 1705) {
            result.supportMedianValue = 826.31;
        } else if (itemLevel >= 1705 && itemLevel < 1710) {
            result.supportMedianValue = 904.36;
        } else if (itemLevel >= 1710 && itemLevel < 1715) {
            result.supportMedianValue = 946.05;
        } else if (itemLevel >= 1715 && itemLevel < 1720) {
            result.supportMedianValue = 976.62;
        } else if (itemLevel >= 1720 && itemLevel < 1725) {
            result.supportMedianValue = 1083.07;
        } else if (itemLevel >= 1725 && itemLevel < 1730) {
            result.supportMedianValue = 1238.52;
        } else if (itemLevel >= 1730 && itemLevel < 1735) {
            result.supportMedianValue = 1327.09;
        } else if (itemLevel >= 1735 && itemLevel < 1740) {
            result.supportMedianValue = 1403.59;
        } else if (itemLevel >= 1740 && itemLevel < 1745) {
            result.supportMedianValue = 1455.45;
        } else if (itemLevel >= 1745 && itemLevel < 1750) {
            result.supportMedianValue = 1503.26;
        } else if (itemLevel >= 1750) {
            result.supportMedianValue = 1621.35;
        }

        return result;
    }
    htmlObj.medianInfo = medianInfoExtract();
    /* **********************************************************************************************************************
     * name		              :	  elxirInfoExtract
     * version                :   2.0
     * description            :   중복된 유효 엘릭서 여부를 확인하여 유효 중복엘릭서와 총 레벨값을 반환함
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function elxirInfoExtract() {
        let result = {};
        let elixirDouble = ["회심", "달인 (", "강맹", "칼날방패", "선봉대", "행운", "선각자", "진군", "신념"]
        // extractValue.htmlObj.armoryInfo[i].elixir[i]
        let allElixirData = [];
        htmlObj.armoryInfo.forEach(item => {
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

        function elixirLevelSum(array) {
            let sumValue = 0;
            array.forEach(item => {
                let value = Number(item.level.match(/Lv\.(\d+)/)[1]);
                sumValue += value;
            })
            return sumValue
        }
        // console.log(countDuplicates(specialElixir))
        // console.log(elixirLevelSum(allElixirData))
        result.count = countDuplicates(specialElixir) ? countDuplicates(specialElixir).count : 0;
        result.name = countDuplicates(specialElixir) ? countDuplicates(specialElixir).name : "";
        result.sumValue = elixirLevelSum(allElixirData);
        return result;
    }
    htmlObj.elxirInfo = elxirInfoExtract();

    /* **********************************************************************************************************************
     * name		              :	  hyperInfoExtract
     * version                :   2.0
     * description            :   초월의 총합을 반환
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function hyperInfoExtract() {
        let reulst = {};
        let hyperStarArray = htmlObj.armoryInfo.map(item => item.hyperStar);
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
        reulst.sumValue = hyperAvgValue(hyperStarArray).sumValue;
        reulst.avgValue = hyperAvgValue(hyperStarArray).avgValue;
        return reulst;
    }
    htmlObj.hyperInfo = hyperInfoExtract();
    /* **********************************************************************************************************************
     * name		              :	  
     * version                :   2.0
     * description            :   export할 값들을 정리
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    let extractValue = {
        defaultObj,
        engObj,
        accObj,
        bangleObj,
        arkObj,
        elixirObj,
        jobObj,
        hyperObj,
        gemObj,
        etcObj,
        htmlObj,
    }
    return extractValue
}