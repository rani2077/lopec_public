// import 'https://code.jquery.com/jquery-3.6.0.min.js';



// 필터
import {
    keywordList,
    grindingFilter,
    arkFilter,
    bangleJobFilter,
    engravingImg,
    engravingCalFilter,
    dealerAccessoryFilter,
    calAccessoryFilter,
    elixirFilter,
    cardPointFilter,
    bangleFilter,
    engravingCheckFilter,
    stoneCheckFilter,
    elixirCalFilter,
    arkCalFilter,
    // engravingCheckFilterLowTier,
    classGemFilter,
} from '../filter/filter.js';
import * as Filter from "../filter/filter.js";
import { getCombinedCharacterData } from '../js/characterRead2.js'
import * as SimulatorFilter from "../filter/simulator-filter.js";


export async function getCharacterProfile(data) {




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
            arkFilter.forEach(function (arry) {
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
        }
    })

    data.ArmoryEquipment.forEach(function (equip) {
        if (equip.Type == "무기") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.addDamagePer += 10 + 0.002 * (quality) ** 2
        } else if (equip.Type == "투구") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.hpActive += Math.ceil((0.14 * ((quality) ** 2)))
        } else if (equip.Type == "상의") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.hpActive += Math.ceil((0.14 * ((quality) ** 2)))
        } else if (equip.Type == "하의") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.hpActive += Math.ceil((0.14 * ((quality) ** 2)))
        } else if (equip.Type == "장갑") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.hpActive += Math.ceil((0.14 * ((quality) ** 2)))
        } else if (equip.Type == "어깨") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.hpActive += Math.ceil((0.14 * ((quality) ** 2)))
        }
    })
    //defaultObj.hpActive = (defaultObj.hpActive * 0.000071427) + 1
    defaultObj.hpActive = (defaultObj.hpActive / 140) / 100 + 1

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
        stigmaPer: 0,

        finalDamagePer: 1,
        criFinalDamagePer: 1,
    }

    arkFilter.forEach(function (filterArry) {

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
        calAccessoryFilter.forEach(function (filterArry) {
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
        atkBuffPlus: 0,
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

        let plusArry = ['atkPlus', 'atkPer', 'weaponAtkPlus', 'criticalDamagePer', 'criticalChancePer', 'addDamagePer', 'moveSpeed', 'atkSpeed', "skillCool", 'atkBuff', 'damageBuff', 'atkBuffPlus']
        let perArry = ['weaponAtkPer', 'finalDamagePer', 'criFinalDamagePer', 'finalDamagePerEff']
        let statsArry = ["치명:crit", "특화:special", "신속:haste", "힘:str", "민첩:dex", "지능:int", "최대 생명력:statHp"];

        statsArry.forEach(function (stats) {
            let regex = new RegExp(`${stats.split(":")[0]}\\s*\\+\\s*(\\d+)`);
            if (regex.test(realBangleArry)) {

                // console.log(realBangleArry.match(regex)[1])
                bangleObj[stats.split(":")[1]] += Number(realBangleArry.match(regex)[1]);

            }

        })


        bangleFilter.forEach(function (filterArry) {

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
    // console.log(bangleObj)


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
    engravingCheckFilter.forEach(function (checkArry) {
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
        engravingCalFilter.forEach(function (FilterArry) {
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
            stoneCheckFilter.forEach(function (filterArry, idx) {
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


        const matchedKeywordsWithContext = keywordList.flatMap(keyword => {
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

        elixirCalFilter.forEach(function (filterArry) {
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

    elixirCalFilter.forEach(function (arr) {

    })

    let elixirLevel = 0

    elixirData.forEach(function (arry) {
        elixirFilter.forEach(function (filterArry) {
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
        arkCalFilter.forEach(function (filter) {
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
    // console.log("gemSkillArry",gemSkillArry)


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
            specialClass = supportCheck();
        }

    }
    // console.log("보석전용 직업 : ",specialClass)


    gemSkillArry.forEach(function (gemSkill, idx) {

        let realClass = classGemFilter.filter(item => item.class == specialClass);

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


    // 직업별 보석 지분율 필터
    let classGemEquip = classGemFilter.filter(function (filterArry) {
        return filterArry.class == specialClass;
    })
    //console.log(classGemEquip)

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


    let maxHealth = defaultObj.maxHp;
    let baseHealth = defaultObj.statHp + elixirObj.statHp + accObj.statHp + hyperObj.statHp + bangleObj.statHp;
    let vitalityRate = defaultObj.hpActive;
    // console.log("최대 체력", maxHealth)
    // console.log("기본 체력", baseHealth)
    // console.log("생명 활성력", vitalityRate)
    function calculateKarmaLevel(maxHealth, baseHealth, vitalityRate) {
        const cases = [
            // 1. 펫효과 ON(1.05), 만찬 OFF
            {
                formula: "펫효과 ON, 만찬 OFF",
                karma: ((maxHealth / (vitalityRate * 1.05)) - baseHealth) / 400
            },

            // 2. 펫효과 OFF(1.00), 만찬 OFF
            {
                formula: "펫효과 OFF, 만찬 OFF",
                karma: ((maxHealth / vitalityRate) - baseHealth) / 400
            },

            // 3. 펫효과 ON(1.05), 만찬 ON(+10000, x1.1)
            {
                formula: "펫효과 ON, 만찬 ON",
                karma: ((maxHealth / (vitalityRate * 1.15)) - baseHealth - 10000) / 400
            },

            // 4. 펫효과 OFF(1.00), 만찬 ON(+10000, x1.1)
            {
                formula: "펫효과 OFF, 만찬 ON",
                karma: ((maxHealth / (vitalityRate * 1.1)) - baseHealth - 10000) / 400
            }
        ];

        // 각 결과값이 정수에 얼마나 가까운지 계산
        const results = cases.map(item => {
            const roundedValue = Math.round(item.karma);
            return {
                formula: item.formula,
                karmaExact: item.karma,
                karmaRounded: roundedValue,
                proximity: Math.abs(item.karma - roundedValue),
                isPossible: (item.karma >= -1 && !isNaN(item.karma)) // 음수나 NaN 결과는 불가능
            };
        });

        // 가능한 결과 중 정수에 가장 가까운 값 선택
        const possibleResults = results.filter(result => result.isPossible);

        if (possibleResults.length === 0) {
            return {
                error: "유효한 결과가 없습니다. 데이터를 확인해주세요."
            };
        }

        // 30 이하의 결과와 30 초과의 결과 분리
        const resultsUnder30 = possibleResults.filter(result => result.karmaExact <= 30);
        const resultsOver30 = possibleResults.filter(result => result.karmaExact > 30);

        let bestResult;

        // 30 이하의 결과가 있으면 그 중에서 정수에 가장 가까운 값 선택
        if (resultsUnder30.length > 0) {
            resultsUnder30.sort((a, b) => a.proximity - b.proximity);
            bestResult = resultsUnder30[0];
        }
        // 30 이하의 결과가 없으면 30 초과 결과 중 정수에 가장 가까운 값을 선택 (30으로 제한)
        else {
            resultsOver30.sort((a, b) => a.proximity - b.proximity);
            bestResult = resultsOver30[0];
            bestResult.karmaRounded = 30;
            bestResult.formula += " (최대 30 레벨로 제한됨)";
        }

        if (bestResult.karmaExact < 0) {
            bestResult.karmaRounded = 0;
            bestResult.formula += " (오차 보정: 0으로 처리됨)";
        }
        // 모든 가능한 결과 포함해서 반환
        return {
            bestResult: {
                formula: bestResult.formula,
                karmaLevel: bestResult.karmaRounded,
                exactValue: bestResult.karmaExact.toFixed(4),
                proximity: bestResult.proximity.toFixed(4)
            },
            allResults: possibleResults
        };
    }
    const result = calculateKarmaLevel(maxHealth, baseHealth, vitalityRate);

    let evolutionkarmaPoint = result.bestResult.karmaLevel
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
    // console.log(evolutionkarmaRank, "랭크", evolutionkarmaPoint, "레벨")


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

                let accessoryGradeArray = Filter.grindingFilter.filter(filter => {
                    return betweenText.some(text => text.includes(">" + filter.split(":")[0]));
                });

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
                    if (Filter.engravingFilter.some(filter => text === filter.name)) {
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
                    bangleFilter = SimulatorFilter.bangleOptionData.t3RelicData;
                } else if (tier === "3" && bangle.Grade === "고대") {
                    bangleFilter = SimulatorFilter.bangleOptionData.t3MythicData;
                } else if (tier === "4" && bangle.Grade === "유물") {
                    bangleFilter = SimulatorFilter.bangleOptionData.t4RelicData;
                } else if (tier === "4" && bangle.Grade === "고대") {
                    bangleFilter = SimulatorFilter.bangleOptionData.t4MythicData;
                }
                let options = bangleFilter.filter(filter => replaceText.includes(filter.fullName));

                let specialStats = betweenText.filter(text => /^(치명|특화|신속)\s\+\d+$/.test(text.trim()));
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
                let icon = Filter.engravingImg.find(filter => filter.split("^")[0] === eng.Name);

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