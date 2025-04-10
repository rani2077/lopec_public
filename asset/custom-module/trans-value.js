// import 'https://code.jquery.com/jquery-3.6.0.min.js';

const baseUrl = "https://cdnlopec.xyz/asset"; // CDN 경로 주석 처리
async function importModuleManager() {
    let interValTime = 60 * 1000;
    let modules = await Promise.all([
        import(`${baseUrl}/filter/filter.js`),              // CDN 로드 주석 처리
        import(`${baseUrl}/filter/simulator-filter.js`),   // CDN 로드 주석 처리
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
    defaultObj.hpActive = ( 0.000071427 * vitalitySum) + 1

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
                gesmCoolCount += 1
            } else if (arry.Name.includes("1레벨 작열") || arry.Name.includes("3레벨 홍염")) {
                gemsCool += 6
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
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 잔재";
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "터닝 슬래쉬", dmg) && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 터닝 잔재";
        } else if (classCheck("일격") && skillCheck(gemSkillArry, "오의 : 뇌호격", dmg) && skillCheck(gemSkillArry, "오의 : 풍신초래", dmg) && skillCheck(gemSkillArry, "오의 : 호왕출현", dmg) && skillCheck(gemSkillArry, "방천격", dmg)) {
            specialClass = "4멸 일격";
        } else if (classCheck("억제") && skillCheck(gemSkillArry, "데몰리션", dmg)) {
            specialClass = "사멸 억모닉";
        } else if (classCheck("환각") || classCheck("서폿") || classCheck("진실된 용맹") || classCheck("회귀") || classCheck("환류")) {
            specialClass = "데이터 없음";
        } else {
            specialClass = supportCheck();
        }

    }
    // console.log("보석전용 직업 : ",specialClass)


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
        ////    defaultHp: defaultObj.statHp,
        ////    elixirHp: elixirObj.statHp,
        ////    accHp: accObj.statHp,
        ////    hyperHp: hyperObj.statHp,
        ////    bangleHp: bangleObj.statHp
        //});
        //console.log("생명 활성력(vitalityRate):", vitalityRate);
        //console.log("직업 체력 계수(healthValue):", healthValue);

        // --- 상수 정의 ---
        const KARMA_HP_PER_LEVEL = 400; // 외부로 이동

        // --- calculateKarmaLevel 함수 재작성 시작 ---
        // 함수 정의에 isSupport 파라미터 추가
        function calculateKarmaLevel(maxHealth, baseHealth, vitalityRate, healthValue, isSupport) {
            // --- 상수 정의 --- // 함수 내부로 다시 이동 (가독성 및 유지보수)
            const PET_PERCENTS = [0, 0.01, 0.02, 0.03, 0.04, 0.05]; // 펫 효과 (0% ~ 5%)
            const RANGER_PERCENTS = [0, 0.008, 0.014, 0.02];         // 방범대 효과 %
            const FEAST_HPS = [0, 0, 0, 0, 0];             // 만찬 HP (baseHealth에 포함됨)
            const RAID_HPS = [0];                   // 레이드 HP (baseHealth에 포함됨)
            const PROXIMITY_THRESHOLD = 0.008;         // 근사치 비교 허용 오차
            const HP_DIFF_THRESHOLD = 10.0; // 딜러 방범대0 우선순위 적용을 위한 체력 차이 임계값
            const EXACT_HP_TOLERANCE = 2.5; // 정확한 체력 비교 시 허용 오차
            // --- 상수 정의 끝 ---

            let allResults = [];

            // --- 모든 경우의 수 순회 (만찬/레이드 루프 제거) ---
            for (let petIdx = 0; petIdx < PET_PERCENTS.length; petIdx++) {
                for (let rangerIdx = 0; rangerIdx < RANGER_PERCENTS.length; rangerIdx++) {
                    // feastIdx, raidIdx 루프 제거
                    // for (let feastIdx = 0; feastIdx < FEAST_HPS.length; feastIdx++) {
                    //     for (let raidIdx = 0; raidIdx < RAID_HPS.length; raidIdx++) {
                            const petPercent = PET_PERCENTS[petIdx];
                            const rangerPercent = RANGER_PERCENTS[rangerIdx];
                            // const feastHp = FEAST_HPS[feastIdx]; // 항상 0
                            // const raidHp = RAID_HPS[raidIdx];   // 항상 0
                            const currentCardPercent = cardHP || 0;

                            // 1. 퍼센트 효과 합계 계산
                            const percentFactor = (1 + petPercent + rangerPercent + currentCardPercent);

                            // 2. 고정 체력 보너스 계산 (항상 0)
                            const flatHpBonus = 0;

                            // 역산 공식 세부 계산
                            const step1 = maxHealth / (percentFactor * vitalityRate);
                            const step2 = step1 - baseHealth - flatHpBonus;
                            const estimatedKarma = step2 / KARMA_HP_PER_LEVEL;

                            // 4. 결과 유효성 검사 및 근사치 계산
                            const roundedValue = Math.round(estimatedKarma);
                            const proximity = Math.abs(estimatedKarma - roundedValue);
                            const isPossible = (estimatedKarma >= -0.5 && !isNaN(estimatedKarma));

                            // 중간 반올림 적용된 체력 계산들
                            const calculatedKarmaHp = estimatedKarma * KARMA_HP_PER_LEVEL;
                            const sumForEstimation = baseHealth + flatHpBonus + calculatedKarmaHp;
                            const intermediateEstimation = sumForEstimation * vitalityRate;
                            const roundedIntermediateEstimation = Math.round(intermediateEstimation);
                            const calculatedMaxHpWithExactKarma = roundedIntermediateEstimation * percentFactor;

                            const karmaHpForRounded = roundedValue * KARMA_HP_PER_LEVEL;
                            const sumForRounded = baseHealth + flatHpBonus + karmaHpForRounded;
                            const intermediateRounded = sumForRounded * vitalityRate;
                            const roundedIntermediateRounded = Math.round(intermediateRounded);
                            const maxHpUsingRoundedKarma = roundedIntermediateRounded * percentFactor;

                            // 5. 결과 저장 (formulaDesc 및 buffLevelSum 수정)
                            // --- formulaDesc 통일 로직 시작 ---
                            // const petPercent = PET_PERCENTS[petIdx]; // 중복 선언 제거 (이미 위에서 선언됨)
                            // const rangerPercent = RANGER_PERCENTS[rangerIdx]; // 중복 선언 제거 (이미 위에서 선언됨)
                            const totalPercentBonus = petPercent + rangerPercent; // 총 퍼센트 보너스 합계 (위에서 선언된 petPercent, rangerPercent 사용)
                            let unifiedDesc = `펫${petIdx}|방범대${rangerIdx}`; // 기본 설명 유지

                            // 부동 소수점 오차를 고려하여 비교 (0.001 정도의 허용 오차)
                            if (Math.abs(totalPercentBonus - 0.02) < 0.001) { // 펫2(0.02) 또는 방범대3(0.02) -> 총합 2%
                                unifiedDesc = `효과(2%)`; 
                            } else if (Math.abs(totalPercentBonus - 0.05) < 0.001) { // 펫3(0.03)+방범대3(0.02) 또는 펫5(0.05) -> 총합 5%
                                unifiedDesc = `효과(5%)`; 
                            }
                            // 다른 조합은 기본 설명(펫X|방범대Y) 유지
                            // --- formulaDesc 통일 로직 끝 ---

                            allResults.push({
                                formulaDesc: unifiedDesc, // 수정된 통일 설명 사용
                                rangerIdx: rangerIdx, // 기존 정보 유지 (Tie-breaking 등에 사용 가능)
                                karmaExact: estimatedKarma,
                                karmaRounded: roundedValue,
                                proximity: proximity,
                                isPossible: isPossible,
                                buffLevelSum: petIdx + rangerIdx, // 기존 정보 유지 (Tie-breaking 등에 사용 가능)
                                calculatedMaxHp: calculatedMaxHpWithExactKarma.toFixed(2),
                                maxHpUsingRoundedKarma: maxHpUsingRoundedKarma
                            });
                    //     } // raidIdx 루프 닫기
                    // } // feastIdx 루프 닫기
                }
            }

            // --- 필터링 및 오류 처리 복원 ---
            const possibleResults = allResults.filter(result => result.isPossible && result.karmaRounded <= 30);

            // --- 새로운 로그: Proximity 필터링(<=0.02) *전*의 중복 제거 및 정렬 결과 ---
            const uniquePossibleResults = [];
            const seenPossibleKeys = new Set();
            possibleResults.forEach(result => {
                const uniqueKey = `${result.karmaRounded}-${result.proximity.toFixed(6)}`;
                if (!seenPossibleKeys.has(uniqueKey)) {
                    uniquePossibleResults.push(result);
                    seenPossibleKeys.add(uniqueKey);
                }
            });
            const sortedUniquePossible = [...uniquePossibleResults].sort((a, b) => a.proximity - b.proximity);
            //console.log("정렬된 초기 유효 후보 (Proximity 필터 전, 중복 제거 후):");
            //console.table(sortedUniquePossible.map(r => ({
            //    formulaDesc: r.formulaDesc,
            //    karmaExact: r.karmaExact.toFixed(5),
            //    karmaRounded: r.karmaRounded,
            //    proximity: r.proximity.toFixed(5),
            //    calculatedMaxHp: r.calculatedMaxHp,
            //    maxHpUsingRoundedKarma: r.maxHpUsingRoundedKarma.toFixed(2)
            //})));
            // --- 로그 추가 끝 ---

            if (possibleResults.length === 0) {
                //console.error("카르마 레벨 추정 불가: 유효한 시나리오 없음", { maxHealth, baseHealth, vitalityRate, healthValue });
                return {
                    bestResult: { formulaDesc: "오류: 추정 불가", karmaLevel: 0, exactValue: NaN, proximity: Infinity },
                    allResults: allResults // 오류 시에는 전체 결과 반환
                };
            }
            // --- 필터링 및 오류 처리 끝 ---

            // --- proximity 0.1 초과 값 필터링 ---
            const filteredByProximity = possibleResults.filter(result => result.proximity <= 0.02);
            if (filteredByProximity.length === 0) {
                //console.log("프록시미티 필터: 프록시미티가 0.1 이하인 결과가 없습니다. 원본 결과를 사용합니다.");
            } else {
                //console.log(`프록시미티 필터: ${possibleResults.length}개 중 ${filteredByProximity.length}개의 결과가 프록시미티 0.1 이하 조건을 만족합니다.`);
            }
            
            // 필터링된 결과가 있으면 사용, 없으면 원본 사용
            const workingResults = filteredByProximity.length > 0 ? filteredByProximity : possibleResults;
            // --- proximity 필터링 끝 ---

            // --- 중복 결과 제거 로직 시작 ---
            const uniqueResults = [];
            const seenKeys = new Set();
            workingResults.forEach(result => {
                // 고유 키를 karmaRounded와 proximity(소수점 5자리)로만 정의 (buffLevelSum 제외)
                const uniqueKey = `${result.karmaRounded}-${result.proximity.toFixed(5)}`;
                if (!seenKeys.has(uniqueKey)) {
                    uniqueResults.push(result);
                    seenKeys.add(uniqueKey);
                } else {
                    // 중복 발견 시 어떤 결과가 제거되는지 로그 추가 (선택 사항)
                    //console.log(`중복 결과 제거: 키(${uniqueKey}), 제거된 항목: ${result.formulaDesc}`);
                }
            });
            if (workingResults.length !== uniqueResults.length) {
                //console.log(`중복 제거: ${workingResults.length}개의 결과 중 ${uniqueResults.length}개의 고유 결과만 남김.`);
            }
            const finalWorkingResults = uniqueResults; // 중복 제거된 배열 사용
            // --- 중복 결과 제거 로직 끝 ---

            // --- 중복 결과 제거 로직 끝 ---
            let currentWorkingResults = uniqueResults; // 처리할 배열 변수 이름 변경
                    
            // --- 추가된 로그: Proximity 기준 정렬된 초기 후보 결과 ---
            //const sortedInitialCandidates = [...uniqueResults].sort((a, b) => a.proximity - b.proximity);
            //console.log("정렬된 초기 후보 결과 (Proximity 기준):");
            //console.table(sortedInitialCandidates.map(r => ({ // 가독성을 위해 table 형식 사용
            //    formulaDesc: r.formulaDesc,
            //    karmaExact: r.karmaExact.toFixed(5),
            //    karmaRounded: r.karmaRounded,
            //    proximity: r.proximity.toFixed(5),
            //    calculatedMaxHp: r.calculatedMaxHp,
            //    maxHpUsingRoundedKarma: r.maxHpUsingRoundedKarma.toFixed(2)
            //})));
            // --- 로그 추가 끝 ---
                    
            // --- 새로운 로직: Proximity < 0.005 그룹만 남기기 ---
            let finalBestResult; // 최종 결과 변수 
                    
            const lowProximityMatches = currentWorkingResults.filter(result => result.proximity < 0.005);
                    
            if (lowProximityMatches.length > 0) {
                //console.log(`후처리 (Low Proximity 그룹 사용): Proximity < 0.005 인 ${lowProximityMatches.length}개 결과만 대상으로 이후 로직을 진행합니다.`);
                // 이후 처리는 lowProximityMatches 배열만 사용하도록 변경
                currentWorkingResults = lowProximityMatches; 
            } else {
                //console.log(`후처리 (Low Proximity 그룹 없음): Proximity < 0.005 인 결과가 없어 기존 결과 전체를 대상으로 로직을 진행합니다.`);
                // lowProximityMatches가 없으면 원래 배열(uniqueResults) 그대로 사용
            }
            // --- Low Proximity 그룹 처리 로직 끝 ---

            // --- 추가: currentWorkingResults가 비었는지 확인 ---
            if (currentWorkingResults.length === 0) {
                //console.error("카르마 레벨 추정 불가: 필터링/중복제거 후 유효한 후보 없음");
                // possibleResults가 비었을 때와 동일한 오류 객체 반환
                return {
                    bestResult: { formulaDesc: "오류: 유효 후보 없음", karmaLevel: 0, exactValue: NaN, proximity: Infinity },
                    allResults: [] // 빈 배열 반환
                };
            }
            // --- 빈 배열 체크 끝 ---
            
            
            // --- 이후 모든 로직은 currentWorkingResults 배열을 사용 ---
            
            // --- 기존 로직 시작: 정확한 체력 일치 우선 확인 ---
            // 변수 선언은 이미 위에서 했으므로 여기서는 값을 할당하거나 사용합니다.
            const exactMatches = currentWorkingResults.filter(result => Math.abs(maxHealth - result.calculatedMaxHp) < EXACT_HP_TOLERANCE); // 여기 선언은 유지
            let exactMatchFound = false; // const -> let 으로 변경, 여기서 선언 유지

                            // --- 새로운 비교 로직 함수 정의 ---
            function compareCandidates(a, b, maxHealth) {
                const proxA = a.proximity;
                const proxB = b.proximity;

                // Proximity가 0인 경우 처리 (0이 가장 좋음)
                if (proxA === 0 && proxB === 0) {
                    // 둘 다 0이면 calculatedMaxHp 차이 비교
                    const diffA = Math.abs(maxHealth - a.calculatedMaxHp);
                    const diffB = Math.abs(maxHealth - b.calculatedMaxHp);
                    return diffA - diffB; // 체력 차이 작은 쪽 우선
                } else if (proxA === 0) {
                    return -1; // a가 0이면 a가 우선
                } else if (proxB === 0) {
                    return 1; // b가 0이면 b가 우선
                }

                // Proximity 비율 계산 (항상 1 이상)
                const ratio = Math.max(proxA / proxB, proxB / proxA);

                if (ratio >= 5) {
                    // 비율이 5배 이상 차이나면 proximity 작은 쪽 우선
                    return proxA - proxB;
                } else {
                    // 비율이 5배 미만이면 calculatedMaxHp 차이 비교
                    const diffA = Math.abs(maxHealth - a.calculatedMaxHp);
                    const diffB = Math.abs(maxHealth - b.calculatedMaxHp);

                    if (diffA !== diffB) {
                        return diffA - diffB; // 체력 차이 작은 쪽 우선
                    } else {
                        // 체력 차이도 같으면 proximity 작은 쪽으로 최종 결정
                        return proxA - proxB;
                    }
                }
            }
            // --- 비교 함수 정의 끝 ---

            if (exactMatches.length > 0) {
                exactMatchFound = true;
                let bestPet5Match = null; // 최종 펫5/효과5% 후보
                let bestPet0Match = null; // 최종 펫0(효과제외) 후보
                let bestFallbackPet0Match = null; // 최종 폴백펫0 후보

                let standaloneEffect5Matches = [];
                let regularPet5Matches = [];
                let nonEffectPet0Matches = [];
                let allPet0Matches = []; // 폴백용

                // --- 후보 분류 ---
                for (const match of exactMatches) {
                    const petIdx = match.buffLevelSum - match.rangerIdx;
                    const isEffectDesc = match.formulaDesc.startsWith('효과');

                    if (match.formulaDesc === '효과(5%)') {
                        standaloneEffect5Matches.push(match);
                    } else if (petIdx === 5) {
                        regularPet5Matches.push(match);
                    }

                    if (!isEffectDesc && petIdx === 0) {
                        nonEffectPet0Matches.push(match);
                    }
                    if (petIdx === 0) { // 설명 무관 펫0
                        allPet0Matches.push(match);
                    }
                }

                // --- 최종 결과 결정 (우선순위 적용) ---
                if (standaloneEffect5Matches.length > 0) {
                    // 1순위: 단독 효과(5%)
                    //console.log("후처리 (정확한 체력): 단독 효과(5%) 우선 적용 시도.");
                    standaloneEffect5Matches.sort((a, b) => compareCandidates(a, b, maxHealth));
                    finalBestResult = standaloneEffect5Matches[0];
                    //console.log(` -> 단독 효과(5%) 중 최적 후보 선택: ${finalBestResult.formulaDesc} (Proximity: ${finalBestResult.proximity.toFixed(5)})`);
                
                } else if (regularPet5Matches.length > 0) {
                    // 2순위: 펫5 (비단독)
                    //console.log("후처리 (정확한 체력): 펫5 (비단독) 우선 적용 시도.");
                    regularPet5Matches.sort((a, b) => compareCandidates(a, b, maxHealth));
                    finalBestResult = regularPet5Matches[0];
                    //console.log(` -> 펫5(비단독) 중 최적 후보 선택: ${finalBestResult.formulaDesc} (Proximity: ${finalBestResult.proximity.toFixed(5)})`);
                
                } else if (nonEffectPet0Matches.length > 0) {
                    // 3순위: 펫0 (효과 제외)
                    //console.log("후처리 (정확한 체력): 펫0 (효과 제외) 우선 적용 시도.");
                    nonEffectPet0Matches.sort((a, b) => compareCandidates(a, b, maxHealth));
                    finalBestResult = nonEffectPet0Matches[0];
                    //console.log(` -> 펫0(효과 제외) 중 최적 후보 선택: ${finalBestResult.formulaDesc} (Proximity: ${finalBestResult.proximity.toFixed(5)})`);
                
                } else if (allPet0Matches.length > 0) {
                     // 4순위: Fallback 펫0 (설명 무관)
                    //console.log("후처리 (정확한 체력): 1차/2차/3차 우선순위 후보 없음. Fallback 펫0 검사 시도.");
                    allPet0Matches.sort((a, b) => compareCandidates(a, b, maxHealth));
                    finalBestResult = allPet0Matches[0];
                   //console.log(` -> Fallback: 설명 무관 펫0 중 최적 후보 선택: ${finalBestResult.formulaDesc} (Proximity: ${finalBestResult.proximity.toFixed(5)})`);
               
                } else {
                    // 5순위: 최종 정렬 (단, 단독 펫1 후보 제외)
                    //console.log("후처리 (정확한 체력): 모든 우선순위 후보 없음. 최종 규칙 적용 (단독 펫1 제외).");

                    // 단독 펫1 후보를 제외한 새 배열 생성
                    const filteredMatches = exactMatches.filter(match => {
                        const petIdx = match.buffLevelSum - match.rangerIdx;
                        const isPet1Alone = (petIdx === 1 && match.rangerIdx === 0);
                        return !isPet1Alone; // 단독 펫1이 아닌 경우만 포함
                    });

                    if (filteredMatches.length < exactMatches.length) {
                        //console.log(` -> 단독 펫1 후보 ${exactMatches.length - filteredMatches.length}개 제외됨.`);
                    } else {
                        //console.log(" -> 제외할 단독 펫1 후보 없음.");
                    }

                    let finalCandidatesToConsider;
                    if (filteredMatches.length > 0) {   
                        // 제외 후 후보가 남아있으면 그 후보들을 사용
                        finalCandidatesToConsider = filteredMatches;
                    } else {
                        // 제외 후 후보가 없으면 (모두 단독 펫1이었던 극단적 경우) 원래 후보 사용
                        //console.warn(" -> 모든 후보가 단독 펫1 이었음. 원래 후보로 최종 정렬 진행.");
                        finalCandidatesToConsider = exactMatches;
                    }

                    // 최종 후보 결정
                    if (finalCandidatesToConsider.length === 1) {
                        // 남은 후보가 하나면 바로 선택
                        finalBestResult = finalCandidatesToConsider[0];
                        //console.log(` -> 단독 후보 최종 선택: ${finalBestResult.formulaDesc}`);
                    } else {
                        // 남은 후보가 여러 개면 비교 함수로 정렬 후 선택
                        //console.log(" -> 남은 후보 대상 최종 비교 함수 기준 정렬 적용.");
                        finalCandidatesToConsider.sort((a, b) => compareCandidates(a, b, maxHealth));
                        finalBestResult = finalCandidatesToConsider[0];
                        //console.log(` -> 비교 함수 정렬 후 최적 결과 선택: ${finalBestResult.formulaDesc}`);
                    }
                }
                // --- 결정 로직 끝 ---
                
                 /* --- 기존 로직 제거 ---
                // --- 수정된 규칙: (펫5 또는 효과5%) 우선, 이후 (펫0) 차선, 나머지는 Proximity ---
                // for (const match of exactMatches) { ... } // 루프 제거됨

                // 3. 최종 결과 결정
                // if (bestPet5Match) { ... } else if (bestPet0Match) { ... } else { ... Fallback ... } // 결정 로직 제거됨
                // --- 수정된 규칙 끝 ---
                */
            }

            // --- 정확한 체력 일치가 없을 경우에만 기존 정렬 및 후처리 실행 ---
            if (!exactMatchFound) {
                //console.log("후처리: 정확한 체력 일치 결과 없음. 기존 정렬(Rounded 기준) 및 후처리 로직 실행.");
            
                // --- 1차 정렬: 체력 차이 (Rounded 기준) -> proximity -> buffLevelSum ---
                currentWorkingResults.sort((a, b) => {
                    const diffA = Math.abs(maxHealth - a.maxHpUsingRoundedKarma);
                    const diffB = Math.abs(maxHealth - b.maxHpUsingRoundedKarma);
                
                    if (diffA !== diffB) {
                        return diffA - diffB; // (1) Rounded 기준 체력 차이가 가장 적은 순서
                    }
                    if (a.proximity !== b.proximity) {
                        return a.proximity - b.proximity; // (2) Proximity가 낮은 순서
                    }
                    // buffLevelSum 비교는 제거되었으므로 여기서는 순서 영향 없음
                    return 0; 
                });
            
                finalBestResult = currentWorkingResults[0]; 
                let dealerPriorityApplied = false; 
            
                // --- 후처리 로직 시작 (기존 규칙 5, 6, 7) ---
                // workingResults 대신 currentWorkingResults 사용하도록 수정 필요
                // 예: if (!isSupport && currentWorkingResults.length >= 2) { ... }
                //     if (!dealerPriorityApplied && currentWorkingResults.length >= 2) { ... }
                //     const top5 = currentWorkingResults.slice(0, 5);
                // ... (규칙 5, 6, 7 로직 적용 - 단, buffLevelSum 비교는 없음) ...
                // --- 후처리 로직 끝 ---
            } // End of if(!exactMatchFound)

            // --- 최종 결과 선택 및 반환 로직 ---
            // finalBestResult를 사용하여 최종 카르마 레벨 계산
            let finalKarmaLevel = Math.round(finalBestResult.karmaExact);
            if (finalKarmaLevel < 0) {
                finalKarmaLevel = 0;
            }
            finalKarmaLevel = Math.max(0, Math.min(30, finalKarmaLevel)); // 0~30 범위 보정

            // 최종 반환 객체 생성
            return {
                bestResult: {
                    formulaDesc: finalBestResult.formulaDesc + (Math.round(finalBestResult.karmaExact) < 0 ? ` (Rounded: ${finalKarmaLevel}, 음수 보정->0)` : ''),
                    karmaLevel: finalKarmaLevel,
                    exactValue: finalBestResult.karmaExact.toFixed(4),
                    proximity: finalBestResult.proximity.toFixed(4)
                },
                allResults: currentWorkingResults // 필터링 및 중복 제거된 결과 목록
            };

            /* 기존의 불필요한 return문 제거
            // --- 최종 결과 선택 로직 ---
            // ... (이하 최종 레벨 결정 및 반환 로직 - allResults는 currentWorkingResults로 반환) ...
            return {
                bestResult: {
                    // ... 기존 코드 ...
                },
                allResults: currentWorkingResults // 최종 처리된 배열 반환
            };
            */
        }
        // --- calculateKarmaLevel 함수 재작성 끝 ---

        // isSupport 인자 추가하여 함수 호출
        const result = calculateKarmaLevel(maxHealth, baseHealth, vitalityRate, healthValue, isSupport);

         //console.log("카르마 추정 결과:", result.bestResult);
         //console.log("모든 가능성:", result.allResults); // 상세 결과 확인 필요 시 주석 해제

        let evolutionkarmaPoint = result.bestResult.karmaLevel;
        let evolutionkarmaRank = 0
        if (evolutionkarmaPoint >= 21) {
            evolutionkarmaRank = 6
        } else if (evolutionkarmaPoint >= 17) {
            evolutionkarmaRank = 5
        } else if (evolutionkarmaPoint >= 13) {
            evolutionkarmaRank = 4
        } else if (evolutionkarmaPoint >= 9) {
            evolutionkarmaRank = 3
        } else if (evolutionkarmaPoint >= 5) {
            evolutionkarmaRank = 2
        } else if (evolutionkarmaPoint >= 1) {
            evolutionkarmaRank = 1
        }
        //console.log(evolutionkarmaRank, "랭크", evolutionkarmaPoint, "레벨")

        etcObj.evolutionkarmaRank = evolutionkarmaRank;
        etcObj.evolutionkarmaPoint = evolutionkarmaPoint;

        let enlightkarmaPoint = (arkPassiveValue(1) - (data.ArmoryProfile.CharacterLevel - 50) - accObj.enlightPoint - 14)
        if (enlightkarmaPoint >= 6) {
            arkObj.weaponAtkPer = 1.021
        } else if (enlightkarmaPoint >= 5) {
            arkObj.weaponAtkPer = 1.017
        } else if (enlightkarmaPoint >= 4) {
            arkObj.weaponAtkPer = 1.013
        } else if (enlightkarmaPoint >= 3) {
            arkObj.weaponAtkPer = 1.009
        } else if (enlightkarmaPoint >= 2) {
            arkObj.weaponAtkPer = 1.005
        } else if (enlightkarmaPoint >= 1) {
            arkObj.weaponAtkPer = 1.001
        } else {
            arkObj.weaponAtkPer = 1
        }
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
                return obj;
            } else {
                return null;
            }
        }).filter(item => item !== null);
        return result;
    }
    htmlObj.accessoryInfo = accessoryInfoExtract();

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
                    }

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
     * USE_TN                      :   사용
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