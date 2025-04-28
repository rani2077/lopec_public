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
    let totalStatus = 0
    let totalHealth = Number(((inputObj.etcObj.healthStatus + inputObj.hyperObj.statHp + inputObj.elixirObj.statHp + inputObj.bangleObj.statHp + inputObj.accObj.statHp) * inputObj.defaultObj.hpActive * 1.07).toFixed(0));


    let attackBonus = ((inputObj.etcObj.gemAttackBonus + inputObj.etcObj.abilityAttackBonus) / 100) + 1 // 기본 공격력 증가(보석, 어빌리티 스톤)
    let evolutionDamageResult = (inputObj.arkObj.evolutionDamage) //진화형 피해
    let enlightResult = inputObj.arkObj.enlightenmentDamage // 깨달음 딜증
    let enlightBuffResult = inputObj.arkObj.enlightenmentBuff // 깨달음 버프

    let totalStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats // 최종 힘민지 계산값
    //let totalStat = (inputObj.etcObj.armorStatus + 1688 + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats // 최종 힘민지 계산값
    let totalWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100))) // 최종 무공 계산값 //1.021 대신 카르마에서 반환받은 무공 채우기
    let totalAtk = ((Math.sqrt((totalStat * totalWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus + inputObj.accObj.atkPlus + inputObj.elixirObj.atkBonus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus

    let gemsCoolValue = (1 / (1 - (inputObj.etcObj.gemCheckFnc.gemAvg) / 100) - 1) + 1

    let bangleAddDamageResult = ((inputObj.defaultObj.addDamagePer + inputObj.accObj.addDamagePer + inputObj.bangleObj.addDamagePer) / 100) + 1 // 추가 피해
    let bangleFinalDamageResult = (inputObj.engObj.finalDamagePer * inputObj.accObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * bangleAddDamageResult * inputObj.bangleObj.finalDamagePer * inputObj.elixirObj.finalDamagePer) // 적에게 주는 피해
    // console.log("악세",inputObj.accObj.finalDamagePer)

    let minusAccStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int - inputObj.etcObj.sumStats) * inputObj.etcObj.avatarStats
    let minusAccWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus) * (inputObj.arkObj.weaponAtkPer))
    let minusAccAtk = ((Math.sqrt((minusAccStat * minusAccWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus)) * (((inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let minusAccFinal = (inputObj.engObj.finalDamagePer * inputObj.hyperObj.finalDamagePer * ((inputObj.defaultObj.addDamagePer / 100) + 1) * inputObj.bangleObj.finalDamagePer * inputObj.elixirObj.finalDamagePer)

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
    let minusBangleAtk = ((Math.sqrt((minusBangleStat * minusBangleWeaponAtk) / 6)) + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus + inputObj.accObj.atkPlus + inputObj.elixirObj.atkBonus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1) * attackBonus
    let bangleAtkValue = ((totalAtk - minusBangleAtk) / minusBangleAtk) + 1

    //console.log("딜러 원래", inputObj.defaultObj.crit + inputObj.defaultObj.haste + inputObj.defaultObj.special)
    //console.log("딜러 DB", inputObj.defaultObj.totalStatus + inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special)
    //console.log("서폿 원래", inputObj.defaultObj.haste + inputObj.defaultObj.special)
    //console.log("서폿 DB", inputObj.defaultObj.totalStatus + inputObj.bangleObj.haste + inputObj.bangleObj.special)

    /* **********************************************************************************************************************
     * name		              :	  최종 계산식 for deal
     * version                :   2.0
     * description            :   모든 변수를 취합하여 스펙 포인트 계산식 작성
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    //최종 환산
    let lastFinalValue = ((totalAtk) * evolutionDamageResult * bangleFinalDamageResult * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.totalStatus + inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))

    //악세 효율 
    let minusAccValue = ((minusAccAtk) * evolutionDamageResult * minusAccFinal * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.totalStatus + inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let accValue = ((lastFinalValue - minusAccValue) / minusAccValue * 100).toFixed(2)
    //console.log(accValue) 

    //초월 효율
    let minusHyperValue = ((minusHyperAtk) * evolutionDamageResult * minusHyperFinal * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.totalStatus + inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let hyperValue = ((lastFinalValue - minusHyperValue) / minusHyperValue * 100).toFixed(2)

    //엘릭서 효율
    let minusElixirValue = ((minusElixirAtk) * evolutionDamageResult * minusElixirFinal * enlightResult * inputObj.arkObj.leapDamage * inputObj.etcObj.gemCheckFnc.gemValue * inputObj.etcObj.gemCheckFnc.etcAverageValue * gemsCoolValue * (((inputObj.defaultObj.totalStatus + inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2) / 100 + 1 + 0.3))
    let elixirValue = ((lastFinalValue - minusElixirValue) / minusElixirValue * 100).toFixed(2)

    //팔찌 효율
    let bangleValue = ((((1 * bangleAtkValue * inputObj.bangleObj.finalDamagePer * (((inputObj.bangleObj.crit + inputObj.bangleObj.haste + inputObj.bangleObj.special) / 100 * 2) / 100 + 1)) - 1) * 100) * 1.065).toFixed(2)

    /* **********************************************************************************************************************
     * name		              :	  Variable for SpecPoint calc for sup
     * version                :   2.0
     * description            :   스펙포인트 계산을 위한 변수 모음
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    let totalAtk2 = ((totalStat * totalWeaponAtk / 6) ** 0.5) * attackBonus //기본 공격력
    let finalStigmaPer = ((10 * ((inputObj.accObj.stigmaPer + inputObj.arkObj.stigmaPer + inputObj.hyperObj.stigmaPer) / 100 + 1)).toFixed(1)) // 낙인력 
    let atkBuff = (1 + ((inputObj.accObj.atkBuff + inputObj.elixirObj.atkBuff + inputObj.hyperObj.atkBuff + inputObj.bangleObj.atkBuff + inputObj.gemObj.atkBuff) / 100)) // 아공강 
    let finalAtkBuff = (totalAtk2 * 0.15 * atkBuff) // 최종 공증
    let damageBuff = (inputObj.accObj.damageBuff + inputObj.bangleObj.damageBuff + inputObj.gemObj.damageBuff) / 100 + 1 // 아피강
    let hyperBuff = (10 * ((inputObj.accObj.damageBuff + inputObj.bangleObj.damageBuff) / 100 + 1)) / 100 + 1 // 초각성
    let statDamageBuff = ((inputObj.defaultObj.totalStatus + inputObj.bangleObj.haste + inputObj.bangleObj.special) * 0.015) / 100 + 1 // 특화 신속
    let finalDamageBuff = (13 * damageBuff * statDamageBuff) / 100 + 1 // 최종 피증
    let evolutionBuff = (inputObj.arkObj.evolutionBuff / 100) // 진화형 피해 버프
    let carePower = (1 + (inputObj.engObj.carePower + inputObj.accObj.carePower + inputObj.elixirObj.carePower)) // 케어력
    let finalCarePower = (((totalHealth * 0.3) * carePower) / 260000) * 100 //최종 케어력
    let allTimeBuff = (finalStigmaPer / 100 + 1) * 1.0965 * inputObj.bangleObj.atkBuffPlus

    let cdrPercent = ((1 - ((1 - inputObj.etcObj.gemsCoolAvg / 100) * (1 - inputObj.engObj.cdrPercent))) / (1 + inputObj.bangleObj.skillCool)).toFixed(3) // 마흐 포함 최종 쿨감
    let awakenIdentity = ((1 / (1 - inputObj.engObj.awakencdrPercent)) - 1) * 0.15 + 1 // 각성기로 얻은 아덴 가동률
    let identityUptime = (((40 * inputObj.accObj.identityUptime * awakenIdentity) / (1 - cdrPercent)) / 100).toFixed(4) // 최종 아덴 가동률

    let hyperCdrPercent = (1 - ((1 - inputObj.arkObj.cdrPercent) * (1 - inputObj.engObj.cdrPercent))) / (1 + inputObj.bangleObj.skillCool).toFixed(3) // 초각성 가동률 계산을 위한 쿨감
    let hyperUptime = ((40 / (1 - hyperCdrPercent)) / 100).toFixed(4) // 초각성 가동률

    let defaultAtkBuff = ((110000 + finalAtkBuff * 1.06) - 110000) / 110000 + 1 //기본 공증

    let allTimeBuffv2 = defaultAtkBuff * (finalStigmaPer / 100 + 1) * ((1.45 + evolutionBuff) / 1.45) * inputObj.bangleObj.atkBuffPlus //상시 버프력
    let identityBuffv2 = (13 * damageBuff * statDamageBuff) / 100 + 1 // 아덴 피증
    let hyperBuffv2 = (10 * damageBuff) / 100 + 1 // 초각 피증
    let fullBuffv2 = ((allTimeBuffv2 * identityBuffv2 * hyperBuffv2) - 1) * 100 // 풀버프력

    let avgIdentityBuff = (((allTimeBuffv2 * identityBuffv2) - allTimeBuffv2) * 100) * identityUptime // 가동률 기반 평균 아덴 딜증
    let avgHyperBuff = (((allTimeBuffv2 * hyperBuffv2) - allTimeBuffv2) * 100) * hyperUptime // 가동률 기반 평균 초각 딜증
    let totalAvgBuff = ((allTimeBuffv2 - 1) * 100) + avgIdentityBuff + avgHyperBuff // 가동률 기반 종합 버프력

    let doubleBuffUptime = identityUptime * hyperUptime // 풀버프 가동률
    let onlyIdentityUptime = identityUptime * (1 - hyperUptime) // 아덴 가동률
    let onlyHyperUptime = hyperUptime * (1 - identityUptime) // 초각 가동률
    let noBuffUptime = (1 - identityUptime) * (1 - hyperUptime) // 버프 가동률

    let doubleBuffPower = allTimeBuff * enlightBuffResult * inputObj.arkObj.leapDamage * identityBuffv2 * hyperBuffv2
    let onlyIdentityPower = allTimeBuff * enlightBuffResult * inputObj.arkObj.leapDamage * identityBuffv2
    let onlyHyperPower = allTimeBuff * enlightBuffResult * inputObj.arkObj.leapDamage * hyperBuffv2
    let noBuffPower = allTimeBuff * enlightBuffResult * inputObj.arkObj.leapDamage

    let avgBuffPower = (doubleBuffUptime * doubleBuffPower) + (onlyIdentityUptime * onlyIdentityPower) + (onlyHyperUptime * onlyHyperPower) + (noBuffUptime * noBuffPower)
    let supportPower = Number(((finalAtkBuff * avgBuffPower) / 28.1).toFixed(2))

    //서폿 최종 환산 V2
    let supportSpecPoint = supportPower + (finalCarePower / 5) + (inputObj.engObj.utilityPower / 5)



    /* **********************************************************************************************************************
     * name		              :	  서폿 팔찌 효율 계산식
     * version                :   2.0
     * description            :   서폿 팔찌 효율 계산을 위한 변수 및 계산식 작성
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    //팔찌 제외 상시 피증
    let allTimeBuffPowerMinusBangle = (finalStigmaPer / 100 + 1) * 1.0965
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
    let statDamageBuffMinusBangle = ((inputObj.defaultObj.totalStatus) * 0.015) / 100 + 1 // 팔찌 제외 스탯
    let finalDamageBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle) / 100 + 1 // 팔찌 제외 최종 피증
    //팔찌 제외 쿨감 및 아덴 가동률

    let cdrPercentMinusBangle = (1 - ((1 - inputObj.etcObj.gemsCoolAvg / 100) * (1 - inputObj.engObj.cdrPercent))).toFixed(3) // 마흐 포함 최종 쿨감
    let identityUptimeMinusBangle = (((40 * inputObj.accObj.identityUptime * awakenIdentity) / (1 - cdrPercentMinusBangle)) / 100).toFixed(4) // 최종 아덴 가동률
    let hyperCdrPercentMinusBangle = (1 - ((1 - inputObj.arkObj.cdrPercent) * (1 - inputObj.engObj.cdrPercent))).toFixed(3) // 초각성 가동률 계산을 위한 쿨감
    let hyperUptimeMinusBangle = ((40 / (1 - hyperCdrPercentMinusBangle)) / 100).toFixed(4) // 초각성 가동률



    //팔찌 효율 계산

    let defaultAtkBuffMinusBangle = (((120000 + finalAtkBuffMinusBangle * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer)) / 100 + 1)) * 1.06) - 120000) / 120000 + 1 //팔찌 제외 공증
    let allTimeBuffMinusBangle = defaultAtkBuffMinusBangle * (finalStigmaPer / 100 + 1) * ((1.45 + evolutionBuff) / 1.45)//팔찌 제외 상시 버프력
    let identityBuffMinusBangle = (13 * damageBuffMinusBangle * statDamageBuffMinusBangle) / 100 + 1 //팔찌 제외 아덴 피증
    let hyperBuffPowerMinusBangle = (10 * damageBuff) / 100 + 1 // 초각 피증
    let fullBuffMinusBangle = ((allTimeBuffMinusBangle * identityBuffMinusBangle * hyperBuffPowerMinusBangle) - 1) * 100 // 풀버프력

    let avgIdentityBuffMinusBangle = (((allTimeBuffMinusBangle * identityBuffMinusBangle) - allTimeBuffMinusBangle) * 100) * identityUptime // 가동률 기반 평균 아덴 딜증
    let avgHyperBuffMinusBangle = (((allTimeBuffMinusBangle * hyperBuffPowerMinusBangle) - allTimeBuffMinusBangle) * 100) * hyperUptime // 가동률 기반 평균 초각 딜증
    let totalAvgBuffMinusBangle = ((allTimeBuffMinusBangle - 1) * 100) + avgIdentityBuffMinusBangle + avgHyperBuffMinusBangle // 가동률 기반 종합 버프력

    let doubleBuffUptimeMinusBangle = identityUptimeMinusBangle * hyperUptimeMinusBangle // 풀버프 가동률
    let onlyIdentityUptimeMinusBangle = identityUptimeMinusBangle * (1 - hyperUptimeMinusBangle) // 아덴 가동률
    let onlyHyperUptimeMinusBangle = hyperUptimeMinusBangle * (1 - identityUptimeMinusBangle) // 초각 가동률
    let noBuffUptimeMinusBangle = (1 - identityUptimeMinusBangle) * (1 - hyperUptimeMinusBangle) // 버프 가동률

    let doubleBuffPowerMinusBangle = allTimeBuffPowerMinusBangle * enlightBuffResult * inputObj.arkObj.leapDamage * identityBuffMinusBangle * hyperBuffPowerMinusBangle
    let onlyIdentityPowerMinusBangle = allTimeBuffPowerMinusBangle * enlightBuffResult * inputObj.arkObj.leapDamage * identityBuffMinusBangle
    let onlyHyperPowerMinusBangle = allTimeBuffPowerMinusBangle * enlightBuffResult * inputObj.arkObj.leapDamage * hyperBuffPowerMinusBangle
    let noBuffPowerMinusBangle = allTimeBuffPowerMinusBangle * enlightBuffResult * inputObj.arkObj.leapDamage

    let avgBuffPowerMinusBangle = (doubleBuffUptimeMinusBangle * doubleBuffPowerMinusBangle) + (onlyIdentityUptimeMinusBangle * onlyIdentityPowerMinusBangle) + (onlyHyperUptimeMinusBangle * onlyHyperPowerMinusBangle) + (noBuffUptimeMinusBangle * noBuffPowerMinusBangle)
    let supportPowerMinusBangle = Number(((finalAtkBuffMinusBangle * avgBuffPowerMinusBangle) / 28.1).toFixed(2))
    let supportBangleValue = ((supportPower - supportPowerMinusBangle) / supportPowerMinusBangle * 100) * 2





    /* **********************************************************************************************************************
     * name		              :	  스펙포인트 값 저장
     * version                :   2.0
     * description            :   db저장 및 외부 반환을 위한 값 저장
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    function tierName() {
        let nextTierValue = 0;
        let nowTierValue = 0;
        let tierIndex = 0;
        let tierNameArray = ['브론즈', '실버', '골드', '다이아몬드', '마스터', '에스더'];
        let tierNameEngArray = ['bronze', 'silver', 'gold', 'diamond', 'master', 'esther'];
        if (inputObj.etcObj.supportCheck !== "서폿") {
            if ((lastFinalValue / 2020) >= 3000) {
                nextTierValue = 0;
                nowTierValue = 0;
                tierIndex = 5;
            } else if ((lastFinalValue / 2020) >= 2400) {
                nextTierValue = 3000;
                nowTierValue = 2400;
                tierIndex = 4;
            } else if ((lastFinalValue / 2020) >= 1900) {
                nextTierValue = 2400;
                nowTierValue = 1900;
                tierIndex = 3;
            } else if ((lastFinalValue / 2020) >= 1600) {
                nextTierValue = 1900;
                nowTierValue = 1600;
                tierIndex = 2;
            } else if ((lastFinalValue / 2020) >= 1400) {
                nextTierValue = 1600;
                nowTierValue = 1400;
                tierIndex = 1;
            } else if ((lastFinalValue / 2020) < 1400) {
                nextTierValue = 1400;
                nowTierValue = 1;
                tierIndex = 0;
            }
        } else {
            if (supportSpecPoint >= 3000) {
                nextTierValue = 0;
                nowTierValue = 0;
                tierIndex = 5;
            } else if (supportSpecPoint >= 2400) {
                nextTierValue = 3000;
                nowTierValue = 2400;
                tierIndex = 4;
            } else if (supportSpecPoint >= 1900) {
                nextTierValue = 1900;
                nowTierValue = 1600;
                tierIndex = 3;
            } else if (supportSpecPoint >= 1600) {
                nextTierValue = 1900;
                nowTierValue = 1400;
                tierIndex = 2;
            } else if (supportSpecPoint >= 1400) {
                nextTierValue = 1600;
                nowTierValue = 1400;
                tierIndex = 1;
            } else if (supportSpecPoint < 1400) {
                nextTierValue = 1400;
                nowTierValue = 1;
                tierIndex = 0;
            }
        }
        let result = {
            tierNameEng: tierNameEngArray[tierIndex],
            tierNameKor: tierNameArray[tierIndex],
            nextTierNameEng: tierNameEngArray[tierIndex + 1],
            nextTierNameKor: tierNameArray[tierIndex + 1],
            nextTierValue: nextTierValue,
            nowTierValue: nowTierValue
        };
        return result;
    }

    /* **********************************************************************************************************************
     * name		              :	  스펙포인트 값 저장
     * version                :   2.0
     * description            :   db저장 및 외부 반환을 위한 값 저장
     * USE_TN                 :   사용
     *********************************************************************************************************************** */
    // 딜러
    highTierSpecPointObj.dealerAttackPowResult = totalAtk
    highTierSpecPointObj.dealerEngResult = (inputObj.engObj.finalDamagePer * 100 - 100)
    highTierSpecPointObj.dealerEvloutionResult = ((evolutionDamageResult - 1) * 100)
    highTierSpecPointObj.dealerEnlightResult = ((enlightResult - 1) * 100)
    highTierSpecPointObj.dealerLeapResult = ((inputObj.arkObj.leapDamage - 1) * 100)
    highTierSpecPointObj.dealerBangleResult = bangleValue
    highTierSpecPointObj.dealerExlixirValue = elixirValue
    highTierSpecPointObj.dealerHyperValue = hyperValue
    highTierSpecPointObj.dealerAccValue = accValue
    // 서폿
    highTierSpecPointObj.supportFinalAtkBuff = finalAtkBuff;
    highTierSpecPointObj.supportAvgBuffPower = (avgBuffPower - 1) * 100;
    highTierSpecPointObj.supportStigmaResult = finalStigmaPer;
    highTierSpecPointObj.supportAllTimeBuff = (allTimeBuffv2 - 1) * 100;
    highTierSpecPointObj.supportFullBuff = fullBuffv2;
    highTierSpecPointObj.supportTotalAvgBuff = totalAvgBuff;
    highTierSpecPointObj.supportIdentityUptime = identityUptime * 100;
    highTierSpecPointObj.supportHyperUptime = hyperUptime * 100;
    highTierSpecPointObj.supportFullBuffUptime = identityUptime * hyperUptime * 100;
    highTierSpecPointObj.supportBangleResult = supportBangleValue;
    highTierSpecPointObj.supportCarePowerResult = finalCarePower;
    highTierSpecPointObj.supportUtilityPower = inputObj.engObj.utilityPower
    highTierSpecPointObj.supportTotalStatus = (inputObj.defaultObj.haste + inputObj.defaultObj.special);
    highTierSpecPointObj.supportgemsCoolAvg = (cdrPercent * 100);
    // 최종 스펙 포인트
    highTierSpecPointObj.dealerlastFinalValue = (lastFinalValue / 2020).toFixed(2) //딜러 스펙포인트
    highTierSpecPointObj.supportSpecPoint = (supportSpecPoint / 10000).toFixed(2) //서폿 스펙포인트
    // 스펙포인트 db저장 통합
    if (!(inputObj.etcObj.supportCheck == "서폿")) {   // 딜러
        highTierSpecPointObj.completeSpecPoint = lastFinalValue / 2020
    } else if (inputObj.etcObj.supportCheck == "서폿") {
        highTierSpecPointObj.completeSpecPoint = supportSpecPoint
    }
    highTierSpecPointObj.supportSpecPoint = isNaN(highTierSpecPointObj.supportSpecPoint) ? 0 : highTierSpecPointObj.supportSpecPoint;

    highTierSpecPointObj.tierInfoObj = tierName();

    //console.log(highTierSpecPointObj.completeSpecPoint)
    return highTierSpecPointObj
}