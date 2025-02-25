export async function specPointCalc(valueObj) {

    // 3티어 스펙포인트
    let lowTierSpecPointObj = {
        characterPoint: 0,
        armorPoint: 0,
        weaponPoint: 0,
        arkPoint: 0,
        accessoryPoint: 0,
        elixirPoint: 0,
        gemsPoint: 0,
        engravingPoint: 0,
        hyperPoint: 0,
        cardPoint: 0,
        abilityStonePoint: 0,
        setPoint: 0,
        banglePoint: 0,
        specPoint: 0,
    }

    // 4티어 스펙포인트
    let highTierSpecPointObj = {


        // 딜러
        dealerAttackPowResult: 0, // 공격력
        dealerTotalStatus: 0, // 치특신 합계
        dealerEngResult: 0, // 각인 효율
        dealerEvloutionResult: 0, // 진화 효율
        dealerEnlightResult: 0, // 깨달음 효율
        dealerLeapResult: 0, // 도약 효율
        dealerBangleResult: 0, // 팔찌 효율


        // 서포터
        supportStigmaResult: 0, // 낙인력
        supportAllTimeBuff: 0, // 상시버프
        supportFullBuff: 0, //풀버프
        supportEngBonus: 0, //각인 보너스
        supportgemsCoolAvg: 0, // 보석 쿨감
        supportCarePowerResult: 0, // 케어력
        supportBangleResult: 0, // 팔찌효율


        // 서폿 최종 스펙포인트
        supportSpecPoint: 0,
        // 딜러 최종 스펙포인트
        dealerlastFinalValue: 0,

        // 통합된 최종 스펙포인트
        completeSpecPoint: 0,
    }




    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
    let attackBonus = ((valueObj.gemAttackBonus + valueObj.abilityAttackBonus) / 100) + 1 // 기본 공격력 증가(보석, 어빌리티 스톤)
    let attackPowResult = (valueObj.defaultObj.attackPow).toFixed(0) // 최종 공격력 (아드 등 각인 포함된)
    let criticalDamageResult = (valueObj.defaultObj.criticalDamagePer + valueObj.engObj.criticalDamagePer + valueObj.accObj.criticalDamagePer + valueObj.bangleObj.criticalDamagePer + valueObj.arkObj.criticalDamagePer + valueObj.elixirObj.criticalDamagePer + valueObj.jobObj.criticalDamagePer) //치명타 피해량
    let criticalFinalResult = (valueObj.jobObj.criFinalDamagePer * valueObj.elixirObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
    let evolutionDamageResult = (valueObj.arkObj.evolutionDamage) //진화형 피해
    let addDamageResult = ((valueObj.defaultObj.addDamagePer + valueObj.accObj.addDamagePer + valueObj.elixirObj.addDamagePer) / 100) + 1 // 추가 피해
    let finalDamageResult = ((valueObj.jobObj.finalDamagePer * valueObj.engObj.finalDamagePer * valueObj.accObj.finalDamagePer * valueObj.hyperObj.finalDamagePer * addDamageResult * valueObj.elixirObj.finalDamagePer)).toFixed(2) // 적에게 주는 피해
    let enlightResult = valueObj.arkObj.enlightenmentDamage // 깨달음 딜증
    let enlightBuffResult = valueObj.arkObj.enlightenmentBuff
    let weaponAtkResult = ((valueObj.defaultObj.weaponAtk + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus) * valueObj.accObj.weaponAtkPer)
    let bangleStatValue = ((valueObj.bangleObj.str + valueObj.bangleObj.dex + valueObj.bangleObj.int) * 0.00011375) / 100 + 1

    let totalStat = (valueObj.armorStatus + valueObj.expeditionStats + valueObj.hyperObj.str + valueObj.elixirObj.str + valueObj.elixirObj.dex + valueObj.elixirObj.int + valueObj.bangleObj.str + valueObj.bangleObj.dex + valueObj.bangleObj.int) * valueObj.avatarStats // 최종 힘민지 계산값
    let totalWeaponAtk = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus) * valueObj.arkObj.weaponAtk) // 최종 무공 계산값
    let totalWeaponAtk2 = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus) * (valueObj.arkObj.weaponAtk + (valueObj.accObj.weaponAtkPer / 100))) // 최종 무공 계산값

    let totalAtk0 = (Math.sqrt((totalStat * totalWeaponAtk) / 6))
    let totalAtk1 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (valueObj.elixirObj.atkPlus + valueObj.hyperObj.atkPlus)) * attackBonus
    let totalAtk2 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (valueObj.elixirObj.atkPlus + valueObj.hyperObj.atkPlus)) * (((valueObj.accObj.atkPer + valueObj.elixirObj.atkPer) === 0 ? 1 : (valueObj.accObj.atkPer + valueObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let totalAtk3 = ((Math.sqrt((totalStat * totalWeaponAtk2) / 6)) + (valueObj.elixirObj.atkPlus + valueObj.hyperObj.atkPlus)) * (((valueObj.accObj.atkPer + valueObj.elixirObj.atkPer) === 0 ? 1 : (valueObj.accObj.atkPer + valueObj.elixirObj.atkPer)) / 100 + 1) * attackBonus

    let gemsCoolValue = (1 / (1 - (valueObj.finalGemDamageRate.gemAvg) / 100) - 1) + 1

    let bangleCriticalFinalResult = (valueObj.jobObj.criFinalDamagePer * valueObj.elixirObj.criFinalDamagePer * valueObj.bangleObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
    let bangleAddDamageResult = ((valueObj.defaultObj.addDamagePer + valueObj.accObj.addDamagePer + valueObj.elixirObj.addDamagePer) / 100) + 1 // 추가 피해
    let bangleFinalDamageResult = (valueObj.engObj.finalDamagePer * valueObj.accObj.finalDamagePer * valueObj.hyperObj.finalDamagePer * bangleAddDamageResult * valueObj.bangleObj.finalDamagePer * valueObj.elixirObj.finalDamagePer) // 적에게 주는 피해

    let bangleCriDamage = (1 * valueObj.criticalChanceResult * bangleCriticalFinalResult * (criticalDamageResult / 100) + 1 * (100 - valueObj.criticalChanceResult)) / (1 * (valueObj.criticalChanceResult - valueObj.bangleObj.criticalChancePer) * criticalFinalResult * (criticalDamageResult - valueObj.bangleObj.criticalDamagePer) / 100 + 1 * (100 - (valueObj.criticalChanceResult - valueObj.bangleObj.criticalChancePer))) // 팔찌 치피 상승 기대값

    let minusHyperStat = (valueObj.armorStatus + valueObj.expeditionStats + valueObj.elixirObj.str + valueObj.elixirObj.dex + valueObj.elixirObj.int + valueObj.bangleObj.str + valueObj.bangleObj.dex + valueObj.bangleObj.int) * valueObj.avatarStats
    let minusHyperWeaponAtk = ((valueObj.defaultObj.weaponAtk + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus) * valueObj.arkObj.weaponAtk)
    let minusHyperAtk = ((Math.sqrt((minusHyperStat * minusHyperWeaponAtk) / 6)) + (valueObj.elixirObj.atkPlus)) * attackBonus
    let minusHyperFinal = (valueObj.engObj.finalDamagePer * valueObj.accObj.finalDamagePer * bangleAddDamageResult * valueObj.bangleObj.finalDamagePer * valueObj.elixirObj.finalDamagePer)

    let minusElixirStat = (valueObj.armorStatus + valueObj.expeditionStats + valueObj.hyperObj.str + valueObj.bangleObj.str + valueObj.bangleObj.dex + valueObj.bangleObj.int) * valueObj.avatarStats
    let minusElixirWeaponAtk = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus) * valueObj.arkObj.weaponAtk)
    let minusElixirAtk = ((Math.sqrt((minusElixirStat * minusElixirWeaponAtk) / 6)) + (valueObj.hyperObj.atkPlus)) * attackBonus
    let minusElixirFinal = (valueObj.engObj.finalDamagePer * valueObj.accObj.finalDamagePer * valueObj.hyperObj.finalDamagePer * bangleAddDamageResult * valueObj.bangleObj.finalDamagePer)

    let minusBangleStat = (valueObj.armorStatus + valueObj.expeditionStats + valueObj.hyperObj.str + valueObj.elixirObj.str + valueObj.elixirObj.dex + valueObj.elixirObj.int) * valueObj.avatarStats
    let minusBangleWeaponAtk = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus) * valueObj.arkObj.weaponAtk)
    let minusBangleWeaponAtk2 = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus) * (valueObj.arkObj.weaponAtk + (valueObj.accObj.weaponAtkPer / 100)))

    let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (valueObj.elixirObj.atkPlus + valueObj.hyperObj.atkPlus)) * attackBonus
    let minusBangleAtk2 = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk2) / 6)) + (valueObj.elixirObj.atkPlus + valueObj.hyperObj.atkPlus)) * (((valueObj.accObj.atkPer + valueObj.elixirObj.atkPer) === 0 ? 1 : (valueObj.accObj.atkPer + valueObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let minusBangleFinal = (valueObj.engObj.finalDamagePer * valueObj.accObj.finalDamagePer * valueObj.hyperObj.finalDamagePer * bangleAddDamageResult * valueObj.elixirObj.finalDamagePer)
    let bangleAtkValue = ((totalAtk3 - minusBangleAtk2) / minusBangleAtk2) + 1


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////   
    let finalValue = (totalAtk1 * criticalFinalResult * finalDamageResult * evolutionDamageResult * enlightResult * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special - valueObj.bangleObj.crit - valueObj.bangleObj.haste - valueObj.bangleObj.special) / 100 * 1) / 100 + 1))
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1차 환산 공격력////




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////
    let bangleFinalValue = (totalAtk1 * criticalFinalResult * bangleFinalDamageResult * evolutionDamageResult * enlightResult * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special) / 100 * 1) / 100 + 1))
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 포함 환산////



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////
    let bangleEff = ((((bangleFinalValue - finalValue) / finalValue) + 1) * (valueObj.bangleObj.finalDamagePerEff) * bangleStatValue * 1.03).toFixed(4)
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////팔찌 딜증율////


    /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////   
    let lastFinalValue = ((totalAtk1) * evolutionDamageResult * bangleFinalDamageResult * enlightResult * valueObj.arkObj.leapDamage * valueObj.finalGemDamageRate.gemValue * valueObj.finalGemDamageRate.etcAverageValue * gemsCoolValue * bangleStatValue * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    /////////////////////////////////////////////////////////////특성 포함 최종 환산 공격력////////////////////////////////////////////////////////////////////////////////////////////////////////

    let minusHyperValue = ((minusHyperAtk) * evolutionDamageResult * minusHyperFinal * enlightResult * valueObj.arkObj.leapDamage * valueObj.finalGemDamageRate.gemValue * valueObj.finalGemDamageRate.etcAverageValue * gemsCoolValue * bangleStatValue * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let hyperValue = ((lastFinalValue - minusHyperValue) / lastFinalValue * 100).toFixed(2)
    //console.log("초월 효율" + hyperValue)

    let minusElixirValue = ((minusElixirAtk) * evolutionDamageResult * minusElixirFinal * enlightResult * valueObj.arkObj.leapDamage * valueObj.finalGemDamageRate.gemValue * valueObj.finalGemDamageRate.etcAverageValue * gemsCoolValue * bangleStatValue * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let elixirValue = ((lastFinalValue - minusElixirValue) / lastFinalValue * 1.1 * 100).toFixed(2)
    //console.log("엘릭서 효율" + elixirValue)

    let minusBangleValue = ((minusBangleAtk) * evolutionDamageResult * minusBangleFinal * enlightResult * valueObj.arkObj.leapDamage * valueObj.finalGemDamageRate.gemValue * valueObj.finalGemDamageRate.etcAverageValue * gemsCoolValue * bangleStatValue * (((valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special - valueObj.bangleObj.crit - valueObj.bangleObj.haste - valueObj.bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let bangleValue = (((1 * bangleAtkValue * valueObj.bangleObj.finalDamagePer * (((valueObj.bangleObj.crit + valueObj.bangleObj.haste + valueObj.bangleObj.special) / 100 * 2.55) / 100 + 1)) - 1) * 100).toFixed(2)
    //console.log("팔찌 효율" + bangleValue)


    function formatNumber(num) {
        if (num >= 10000) {
            let formatted = (num / 10000).toFixed(1);
            return formatted.endsWith('.0') ? formatted.slice(0, -2) + '만' : formatted + '만';
        }
        return num.toString();
    }


    // valueObj.armorStatus() 장비 힘민지
    // valueObj.expeditionStats 원정대 힘민지

    // let baseAttackStats = ( (data.ArmoryProfile.CharacterLevel - 9) * 8.86 + 54 )








    //////////////////////////////////////// 서폿 공증 계산식 ////////////////////////////////////////
    let supportTotalWeaponAtk = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus + valueObj.bangleObj.weaponAtkPlus) * (valueObj.arkObj.weaponAtk + (valueObj.accObj.weaponAtkPer / 100))) // 서폿 무공 계산값
    let totalAtk4 = (Math.sqrt((totalStat * supportTotalWeaponAtk) / 6)) * attackBonus

    let finalStigmaPer = ((valueObj.jobObj.stigmaPer * ((valueObj.accObj.stigmaPer + valueObj.arkObj.stigmaPer + valueObj.hyperObj.stigmaPer) / 100 + 1)).toFixed(1)) // 낙인력

    let atkBuff = (1 + ((valueObj.accObj.atkBuff + valueObj.elixirObj.atkBuff + valueObj.hyperObj.atkBuff + valueObj.bangleObj.atkBuff + valueObj.gemObj.atkBuff) / 100)) // 아공강 
    let finalAtkBuff = (totalAtk4 * 0.15 * atkBuff) // 최종 공증

    let damageBuff = (valueObj.accObj.damageBuff + valueObj.bangleObj.damageBuff + valueObj.gemObj.damageBuff) / 100 + 1 // 아피강
    let hyperBuff = (10 * ((valueObj.accObj.damageBuff + valueObj.bangleObj.damageBuff) / 100 + 1)) / 100 + 1 // 초각성


    let statDamageBuff = ((valueObj.defaultObj.special + valueObj.defaultObj.haste) * 0.015) / 100 + 1 // 특화 신속
    let finalDamageBuff = (13 * damageBuff * statDamageBuff) / 100 + 1 // 최종 피증

    let evolutionBuff = (valueObj.arkObj.evolutionBuff / 100) // 진화형 피해 버프

    let beforeBuff = ((150000 ** 1.095) * 1.7 * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) // 가상의 딜러
    let afterBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (valueObj.bangleObj.atkBuffPlus / 100 + 1)
    let afterFullBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (valueObj.bangleObj.atkBuffPlus / 100 + 1) * finalDamageBuff * hyperBuff

    let allTimeBuffPower = ((afterBuff - beforeBuff) / beforeBuff) * 100
    let fullBuffPower = ((afterFullBuff - beforeBuff) / beforeBuff) * 100


    //console.log("최종 공증" + finalAtkBuff)
    //console.log("진피" + evolutionBuff)
    //console.log("낙인력" + finalStigmaPer)
    //console.log("최종 피증" + finalDamageBuff)
    //console.log("팔찌 추가" + (valueObj.bangleObj.atkBuffPlus/100+1))
    //console.log("풀버프 전" + beforeBuff)
    //console.log("풀버프 후" + afterFullBuff)




    //console.log(valueObj.bangleObj.atkBuff/100+1)
    //console.log(valueObj.bangleObj.atkBuffPlus/100+1)
    //console.log((valueObj.bangleObj.damageBuff/100)/30+1)
    //console.log((valueObj.bangleObj.special*0.017/100+1))
    //console.log((valueObj.bangleObj.haste*0.017/100+1))

    // 4티어 서폿 최종 스펙포인트1
    let supportSpecPoint = (fullBuffPower ** 2.546) * 20 * enlightBuffResult * valueObj.arkObj.leapDamage * valueObj.engObj.engBonusPer * ((1 / (1 - valueObj.gemsCoolAvg / 100) - 1) + 1)

    let supportTotalWeaponAtkMinusBangle = ((valueObj.defaultObj.weaponAtk + valueObj.hyperObj.weaponAtkPlus + valueObj.elixirObj.weaponAtkPlus + valueObj.accObj.weaponAtkPlus) * (valueObj.arkObj.weaponAtk + (valueObj.accObj.weaponAtkPer / 100)))
    let totalAtk5 = (Math.sqrt((totalStat * supportTotalWeaponAtkMinusBangle) / 6)) * attackBonus

    let atkBuffMinusBangle = (1 + ((valueObj.accObj.atkBuff + valueObj.elixirObj.atkBuff + valueObj.hyperObj.atkBuff + valueObj.gemObj.atkBuff) / 100)) // 팔찌 제외 아공강
    let finalAtkBuffMinusBangle = (totalAtk5 * 0.15 * atkBuffMinusBangle) // 팔찌 제외 최종 공증

    let damageBuffMinusBangle = (valueObj.accObj.damageBuff + valueObj.gemObj.damageBuff) / 100 + 1 // 팔찌 제외 아피강
    let hyperBuffMinusBangle = (10 * ((valueObj.accObj.damageBuff) / 100 + 1)) / 100 + 1 // 팔찌 제외 초각성

    let statDamageBuffMinusBangle = ((valueObj.defaultObj.special + valueObj.defaultObj.haste - valueObj.bangleObj.special - valueObj.bangleObj.haste) * 0.015) / 100 + 1 // 팔찌 제외 스탯
    let finalDamageBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle) / 100 + 1 // 팔찌 제외 최종 피증


    let afterBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035
    let afterFullBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * finalDamageBuffMinusBangle * hyperBuffMinusBangle

    let allTimeBuffPowerMinusBangle = ((afterBuffMinusBangle - beforeBuff) / beforeBuff) * 100
    let fullBuffPowerMinusBangle = ((afterFullBuffMinusBangle - beforeBuff) / beforeBuff) * 100

    let supportSpecPointMinusBangle = (fullBuffPowerMinusBangle ** 2.526) * 21 * enlightBuffResult * valueObj.arkObj.leapDamage * valueObj.engObj.engBonusPer * ((1 / (1 - valueObj.gemsCoolAvg / 100) - 1) + 1)
    let supportBangleEff = ((fullBuffPower - fullBuffPowerMinusBangle) / fullBuffPowerMinusBangle * 100)
    //+ 1 * (valueObj.bangleObj.special*0.01/100+1) * (valueObj.bangleObj.haste*0.01/100+1)) * 100 - 100

    //console.log ( supportSpecPointMinusBangle )
    //console.log("팔찌 효율" + ((fullBuffPower)))
    //console.log("특화 효율" + (valueObj.bangleObj.special*0.045/100+1))
    //console.log("신속 효율" + (valueObj.bangleObj.haste*0.045/100+1))

    //////////////////////////////////////// 서폿 케어력 계산식 ////////////////////////////////////////


    let carePower = (valueObj.engObj.carePower / 100 + 1) * (valueObj.accObj.carePower / 100 + 1) * (valueObj.elixirObj.carePower / 100 + 1)
    let finalCarePower = (valueObj.defaultObj.hp * 0.3) * (valueObj.engObj.carePower / 100 + 1) * (valueObj.accObj.carePower / 100 + 1) * (valueObj.elixirObj.carePower / 100 + 1)









    //console.log("각인 케어력 : " + valueObj.engObj.carePower)
    //console.log("악세 케어력 : " + valueObj.accObj.carePower)
    //console.log("엘릭서 케어력 : " + valueObj.elixirObj.carePower)



    //console.log("아공강 총합 : " + atkBuff)
    //console.log("낙인력 : "+finalStigmaPer + "%")
    //console.log("기준 딜러 버프 전 : " + beforeBuff)
    //console.log("기준 딜러 버프 후 : " + afterBuff )







    // export용 3티어 스펙포인트 객체에 값 넣기
    // lowTierSpecPointObj.characterPoint = characterPoint
    // lowTierSpecPointObj.armorPoint = armorPoint
    // lowTierSpecPointObj.weaponPoint = weaponPoint
    // lowTierSpecPointObj.arkPoint = arkPoint
    // lowTierSpecPointObj.accessoryPoint = accessoryPoint
    // lowTierSpecPointObj.elixirPoint = elixirPoint
    // lowTierSpecPointObj.gemsPoint = gemsPoint
    // lowTierSpecPointObj.engravingPoint = engravingPoint
    // lowTierSpecPointObj.hyperPoint = hyperPoint
    // lowTierSpecPointObj.cardPoint = cardPoint
    // lowTierSpecPointObj.abilityStonePoint = abilityStonePoint
    // lowTierSpecPointObj.setPoint = setPoint
    // lowTierSpecPointObj.banglePoint = banglePoint
    // lowTierSpecPointObj.specPoint = specPoint


    // console.log(lowTierSpecPointObj)



    // export용 4티어 스펙포인트 값 저장

    // 딜러
    highTierSpecPointObj.dealerAttackPowResult = totalAtk1
    highTierSpecPointObj.dealerTotalStatus = (valueObj.defaultObj.crit + valueObj.defaultObj.haste + valueObj.defaultObj.special)
    highTierSpecPointObj.dealerEngResult = (valueObj.engObj.finalDamagePer * 100 - 100)
    highTierSpecPointObj.dealerEvloutionResult = ((evolutionDamageResult - 1) * 100)
    highTierSpecPointObj.dealerEnlightResult = ((enlightResult - 1) * 100)
    highTierSpecPointObj.dealerLeapResult = ((valueObj.arkObj.leapDamage - 1) * 100)
    highTierSpecPointObj.dealerBangleResult = (bangleEff * 100 - 100)
    
    // 서폿
    highTierSpecPointObj.supportStigmaResult = finalStigmaPer
    highTierSpecPointObj.supportAllTimeBuff = allTimeBuffPower
    highTierSpecPointObj.supportFullBuff = fullBuffPower
    highTierSpecPointObj.supportEngBonus = ((valueObj.engObj.engBonusPer - 1) * 100)
    highTierSpecPointObj.supportgemsCoolAvg = valueObj.gemsCoolAvg
    highTierSpecPointObj.supportCarePowerResult = ((finalCarePower / 280000) * 100)
    highTierSpecPointObj.supportBangleResult = supportBangleEff


    // 최종 스펙 포인트
    highTierSpecPointObj.dealerlastFinalValue = lastFinalValue //딜러 스펙포인트
    highTierSpecPointObj.supportSpecPoint = supportSpecPoint //서폿 스펙포인트

    // console.log(highTierSpecPointObj)




    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------


    return highTierSpecPointObj
}

