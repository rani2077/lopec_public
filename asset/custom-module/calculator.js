export async function specPointCalc(inputObj) {


    // 4티어 스펙포인트
    let highTierSpecPointObj = {

        dealerAttackPowResult: 0, // 공격력
        dealerTotalStatus: 0, // 치특신 합계
        dealerEngResult: 0, // 각인 효율
        dealerEvloutionResult: 0, // 진화 효율
        dealerEnlightResult: 0, // 깨달음 효율
        dealerLeapResult: 0, // 도약 효율
        dealerBangleResult: 0, // 팔찌 효율

        supportStigmaResult: 0, // 낙인력
        supportAllTimeBuff: 0, // 상시버프
        supportFullBuff: 0, //풀버프
        supportEngBonus: 0, //각인 보너스
        supportgemsCoolAvg: 0, // 보석 쿨감
        supportCarePowerResult: 0, // 케어력
        supportBangleResult: 0, // 팔찌효율

        supportSpecPoint: 0,     // 서폿 최종 스펙포인트
        dealerlastFinalValue: 0, // 딜러 최종 스펙포인트
        completeSpecPoint: 0, // 통합된 최종 스펙포인트
    }

    /* **********************************************************************************************************************
     * name		              :	  Variable for SpecPoint calc for deal
     * version                :   2.0
     * description            :   스펙 포인트 계산을 위한 변수 모음
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    //let attackPowResult = (inputObj.defaultObj.attackPow).toFixed(0) // 최종 공격력 (아드 등 각인 포함된)
    //let criticalDamageResult = (inputObj.defaultObj.criticalDamagePer + inputObj.engObj.criticalDamagePer + inputObj.accObj.criticalDamagePer + inputObj.bangleObj.criticalDamagePer + inputObj.arkObj.criticalDamagePer + inputObj.elixirObj.criticalDamagePer + inputObj.jobObj.criticalDamagePer) //치명타 피해량
    //let criticalFinalResult = (inputObj.jobObj.criFinalDamagePer * inputObj.elixirObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
    //let weaponAtkResult = ((inputObj.defaultObj.weaponAtk + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus) * inputObj.accObj.weaponAtkPer)
    //let totalWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * inputObj.arkObj.weaponAtk) // 최종 무공 계산값
    //let totalAtk0 = (Math.sqrt((totalStat * totalWeaponAtk) / 6))
    //let totalAtk1 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus)) * attackBonus
    //let totalAtk2 = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    //let finalDamageResult = ((1.06 * inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * addDamageResult * inputObj.elixirObj.finalDamagePer)).toFixed(2) // 적에게 주는 피해
    //let addDamageResult = ((inputObj.defaultObj.addDamagePer + inputObj.accObj.addDamagePer + inputObj.elixirObj.addDamagePer) / 100) + 1 // 추가 피해    
    //let bangleStatValue = ((inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * 0.00011375) / 100 + 1
    //let bangleCriticalFinalResult = (inputObj.jobObj.criFinalDamagePer * inputObj.elixirObj.criFinalDamagePer * inputObj.bangleObj.criFinalDamagePer) // 치명타시 적에게 주는 피해
    //let minusBangleWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus) * inputObj.arkObj.weaponAtk)
    //let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus)) * attackBonus
    //let minusBangleFinal = (inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * bangleAddDamageResult * inputObj.elixirObj.finalDamagePer)
    //1차 환산
    //let finalValue = (totalAtk * criticalFinalResult * finalDamageResult * evolutionDamageResult * enlightResult * (((inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special - inputObj.bangleObj.crit - inputObj.bangleObj.haste - inputObj.bangleObj.special) / 100 * 1) / 100 + 1))
    //팔찌 포함 환산
    //let bangleFinalValue = (totalAtk * criticalFinalResult * bangleFinalDamageResult * evolutionDamageResult * enlightResult * (((inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special) / 100 * 1) / 100 + 1))
    //팔찌 딜증율
    //let bangleEff = ((((bangleFinalValue - finalValue) / finalValue) + 1) * (inputObj.bangleObj.finalDamagePerEff) * bangleStatValue * 1.03).toFixed(4)

    let attackBonus = ((inputObj.etcObj.gemAttackBonus + inputObj.etcObj.abilityAttackBonus) / 100) + 1 // 기본 공격력 증가(보석, 어빌리티 스톤)
    let evolutionDamageResult = (inputObj.arkObj.evolutionDamage) //진화형 피해
    let enlightResult = inputObj.arkObj.enlightenmentDamage // 깨달음 딜증
    let enlightBuffResult = inputObj.arkObj.enlightenmentBuff // 깨달음 버프
    
    let totalStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats // 최종 힘민지 계산값

    let totalWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100))) // 최종 무공 계산값 //1.021 대신 카르마에서 반환받은 무공 채우기
    let totalAtk = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus + inputObj.accObj.atkPlus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus

    let gemsCoolValue = (1 / (1 - (inputObj.etcObj.gemCheckFnc.gemAvg) / 100) - 1) + 1

    let bangleAddDamageResult = ((inputObj.defaultObj.addDamagePer + inputObj.accObj.addDamagePer) / 100) + 1 // 추가 피해
    let bangleFinalDamageResult = (inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * bangleAddDamageResult * inputObj.bangleObj.finalDamagePer * inputObj.elixirObj.finalDamagePer) // 적에게 주는 피해
    // console.log("악세",inputObj.accObj.finalDamagePer)

    let minusHyperStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats
    let minusHyperWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100)))
    let minusHyperAtk = ((Math.sqrt((minusHyperStat * minusHyperWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let minusHyperFinal = (inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * bangleAddDamageResult * inputObj.bangleObj.finalDamagePer * inputObj.elixirObj.finalDamagePer)

    let minusElixirStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats
    let minusElixirWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100)))
    let minusElixirAtk = ((Math.sqrt((minusElixirStat * minusElixirWeaponAtk) / 6)) + (inputObj.hyperObj.atkPlus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let minusElixirFinal = (inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * bangleAddDamageResult * inputObj.bangleObj.finalDamagePer)

    let minusBangleStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int) * inputObj.etcObj.avatarStats
    let minusBangleWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100)))
    let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let bangleAtkValue = ((totalAtk - minusBangleAtk) / minusBangleAtk) + 1

    /* **********************************************************************************************************************
     * name		              :	  최종 계산식 for deal
     * version                :   2.0
     * description            :   모든 변수를 취합하여 스펙 포인트 계산식 작성
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    //최종 환산
    let lastFinalValue = ((totalAtk) * evolutionDamageResult * bangleFinalDamageResult * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    //console.log(totalAtk)

    //초월 효율
    let minusHyperValue = ((minusHyperAtk) * evolutionDamageResult * minusHyperFinal * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let hyperValue = ((lastFinalValue - minusHyperValue) / lastFinalValue * 100).toFixed(2)

    //엘릭서 효율
    let minusElixirValue = ((minusElixirAtk) * evolutionDamageResult * minusElixirFinal * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let elixirValue = ((lastFinalValue - minusElixirValue) / lastFinalValue * 100).toFixed(2)

    //팔찌 효율
    let bangleValue = (((1 * bangleAtkValue * inputObj.bangleObj.finalDamagePer * (((inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2.55) / 100 + 1)) - 1) * 100).toFixed(2)
    /* **********************************************************************************************************************
     * name		              :	  Variable for SpecPoint calc for sup
     * version                :   2.0
     * description            :   스펙포인트 계산을 위한 변수 모음
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    let finalStigmaPer = ((10 * ((inputObj.accObj.stigmaPer + inputObj.arkObj.stigmaPer + inputObj.hyperObj.stigmaPer) / 100 + 1)).toFixed(1)) // 낙인력 // inputObj.arkObj.stigmaPer = 20으로 대체
    let atkBuff = (1 + ((inputObj.accObj.atkBuff + inputObj.elixirObj.atkBuff + inputObj.hyperObj.atkBuff + inputObj.bangleObj.atkBuff + inputObj.gemObj.atkBuff) / 100)) // 아공강 
    let finalAtkBuff = (totalAtk * 0.15 * atkBuff) // 최종 공증
    let damageBuff = (inputObj.accObj.damageBuff + inputObj.bangleObj.damageBuff + inputObj.gemObj.damageBuff) / 100 + 1 // 아피강
    let hyperBuff = (10 * ((inputObj.accObj.damageBuff + inputObj.bangleObj.damageBuff) / 100 + 1)) / 100 + 1 // 초각성
    let statDamageBuff = ((inputObj.defaultObj.special + inputObj.defaultObj.haste) * 0.015) / 100 + 1 // 특화 신속
    let finalDamageBuff = (13 * damageBuff * statDamageBuff) / 100 + 1 // 최종 피증
    let evolutionBuff = (inputObj.arkObj.evolutionBuff / 100) // 진화형 피해 버프

    let beforeBuff = ((150000 ** 1.095) * 1.7 * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) // 가상의 딜러
    let afterBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (inputObj.bangleObj.atkBuffPlus / 100 + 1)
    let afterFullBuff = ((((150000 + finalAtkBuff) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.4 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * (inputObj.bangleObj.atkBuffPlus / 100 + 1) * finalDamageBuff * hyperBuff

    let allTimeBuffPower = ((afterBuff - beforeBuff) / beforeBuff) * 100
    let fullBuffPower = ((afterFullBuff - beforeBuff) / beforeBuff) * 100
    /* **********************************************************************************************************************
     * name		              :	  최종 계산식 for sup
     * version                :   2.0
     * description            :   모든 변수를 취합하여 스펙 포인트 계산식 작성
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    //최종 환산
    let supportSpecPoint = (fullBuffPower ** 2.546) * 20 * enlightBuffResult * inputObj.arkObj.leapDamage * inputObj.engObj.engBonusPer * ((1 / (1 - inputObj.etcObj.gemsCoolAvg / 100) - 1) + 1)
    //console.log(supportSpecPoint)
    //팔찌 제외 무공&공격력
    let supportTotalWeaponAtkMinusBangle = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100)))
    let totalAtk5 = (Math.sqrt((totalStat * supportTotalWeaponAtkMinusBangle) / 6)) * attackBonus
    //팔찌 제외 아공강&공증
    let atkBuffMinusBangle = (1 + ((inputObj.accObj.atkBuff + inputObj.elixirObj.atkBuff + inputObj.hyperObj.atkBuff + inputObj.gemObj.atkBuff) / 100))
    let finalAtkBuffMinusBangle = (totalAtk5 * 0.15 * atkBuffMinusBangle)
    //팔찌 제외 아피강&초각성
    let damageBuffMinusBangle = (inputObj.accObj.damageBuff + inputObj.gemObj.damageBuff) / 100 + 1
    let hyperBuffMinusBangle = (10 * ((inputObj.accObj.damageBuff) / 100 + 1)) / 100 + 1
    //팔찌 제외 스탯&피증
    let statDamageBuffMinusBangle = ((inputObj.defaultObj.special + inputObj.defaultObj.haste - inputObj.bangleObj.special - inputObj.bangleObj.haste) * 0.015) / 100 + 1 // 팔찌 제외 스탯
    let finalDamageBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle) / 100 + 1 // 팔찌 제외 최종 피증
    //팔찌 효율 계산
    let afterBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035
    let afterFullBuffMinusBangle = ((((150000 + finalAtkBuffMinusBangle) * 1.06) ** 1.095) * (1.7 + evolutionBuff) * (5.275243 ** 1.01) * 1.36 * 1.1 * 1.80978) * (finalStigmaPer / 100 + 1) * 1.035 * finalDamageBuffMinusBangle * hyperBuffMinusBangle

    let allTimeBuffPowerMinusBangle = ((afterBuffMinusBangle - beforeBuff) / beforeBuff) * 100
    let fullBuffPowerMinusBangle = ((afterFullBuffMinusBangle - beforeBuff) / beforeBuff) * 100

    let supportSpecPointMinusBangle = (fullBuffPowerMinusBangle ** 2.526) * 21 * enlightBuffResult * inputObj.arkObj.leapDamage * inputObj.engObj.engBonusPer * ((1 / (1 - inputObj.etcObj.gemsCoolAvg / 100) - 1) + 1)
    let supportBangleEff = ((fullBuffPower - fullBuffPowerMinusBangle) / fullBuffPowerMinusBangle * 100)

    let carePower = (inputObj.engObj.carePower / 100 + 1) * (inputObj.accObj.carePower / 100 + 1) * (inputObj.elixirObj.carePower / 100 + 1)
    let finalCarePower = (inputObj.defaultObj.maxHp * 0.3) * (inputObj.engObj.carePower / 100 + 1) * (inputObj.accObj.carePower / 100 + 1) * (inputObj.elixirObj.carePower / 100 + 1)

    /* **********************************************************************************************************************
     * name		              :	  스펙포인트 값 저장
     * version                :   2.0
     * description            :   db저장 및 외부 반환을 위한 값 저장
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    // 딜러
    highTierSpecPointObj.dealerAttackPowResult = totalAtk
    highTierSpecPointObj.dealerTotalStatus = (inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special)
    highTierSpecPointObj.dealerEngResult = (inputObj.engObj.finalDamagePer * 100 - 100)
    highTierSpecPointObj.dealerEvloutionResult = ((evolutionDamageResult - 1) * 100)
    highTierSpecPointObj.dealerEnlightResult = ((enlightResult - 1) * 100)
    highTierSpecPointObj.dealerLeapResult = ((inputObj.arkObj.leapDamage - 1) * 100)
    highTierSpecPointObj.dealerBangleResult = bangleValue
    // 서폿
    highTierSpecPointObj.supportStigmaResult = finalStigmaPer
    highTierSpecPointObj.supportAllTimeBuff = allTimeBuffPower
    highTierSpecPointObj.supportFullBuff = fullBuffPower
    highTierSpecPointObj.supportEngBonus = ((inputObj.engObj.engBonusPer - 1) * 100)
    highTierSpecPointObj.supportgemsCoolAvg = inputObj.etcObj.gemsCoolAvg
    highTierSpecPointObj.supportCarePowerResult = ((finalCarePower / 280000) * 100)
    highTierSpecPointObj.supportBangleResult = supportBangleEff
    // 최종 스펙 포인트
    highTierSpecPointObj.dealerlastFinalValue = lastFinalValue //딜러 스펙포인트
    highTierSpecPointObj.supportSpecPoint = supportSpecPoint //서폿 스펙포인트
    // 스펙포인트 db저장 통합
    if (!(inputObj.etcObj.supportCheck == "서폿")) {   // 딜러
        highTierSpecPointObj.completeSpecPoint = lastFinalValue/1948
    } else if (inputObj.etcObj.supportCheck == "서폿") {
        highTierSpecPointObj.completeSpecPoint = supportSpecPoint/10000
    }
    highTierSpecPointObj.supportSpecPoint = isNaN(highTierSpecPointObj.supportSpecPoint) ? 0 : highTierSpecPointObj.supportSpecPoint;


    return highTierSpecPointObj
}

