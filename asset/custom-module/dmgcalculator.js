export async function damageCalc(inputObj) {



    /* **********************************************************************************************************************
     * name		              :	  Damage Calculator
     * version                :   2.0
     * description            :   스킬 데미지 계산
     * USE_TN                 :   사용
     *********************************************************************************************************************** */

    let totalCriticalChance = inputObj.jobObj.criticalChancePer + inputObj.accObj.criticalChancePer + inputObj.arkObj.criticalChancePer + inputObj.bangleObj.criticalChancePer + inputObj.defaultObj.criticalChancePer + inputObj.engObj.criticalChancePer + inputObj.elixirObj.criticalChancePer
    let totalCriticalDamage = inputObj.accObj.criticalDamagePer + inputObj.arkObj.criticalDamagePer + inputObj.bangleObj.criticalDamagePer + inputObj.defaultObj.criticalDamagePer + inputObj.engObj.criticalDamagePer + inputObj.elixirObj.criticalDamagePer

    let totalStat = (inputObj.etcObj.armorStatus + inputObj.etcObj.expeditionStats + inputObj.hyperObj.str + inputObj.elixirObj.str + inputObj.elixirObj.dex + inputObj.elixirObj.int + inputObj.bangleObj.str + inputObj.bangleObj.dex + inputObj.bangleObj.int) * inputObj.etcObj.avatarStats // 최종 힘민지 계산값
    let totalWeaponAtk = ((inputObj.defaultObj.weaponAtk + inputObj.hyperObj.weaponAtkPlus + inputObj.elixirObj.weaponAtkPlus + inputObj.accObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkPlus + inputObj.bangleObj.weaponAtkBonus) * (inputObj.arkObj.weaponAtkPer + (inputObj.accObj.weaponAtkPer / 100))) // 최종 무공 계산값 //1.021 대신 카르마에서 반환받은 무공 채우기
    let totalAttackBonus = ((inputObj.etcObj.gemAttackBonus + inputObj.etcObj.abilityAttackBonus) / 100) + 1
    let totalAtk = (((totalStat * totalWeaponAtk / 6) ** 0.5) * attackBonus + (inputObj.elixirObj.atkPlus + inputObj.hyperObj.atkPlus + inputObj.accObj.atkPlus + inputObj.elixirObj.atkBonus)) * (((inputObj.accObj.atkPer + inputObj.elixirObj.atkPer + inputObj.engObj.atkPer) === 0 ? 1 : (inputObj.accObj.atkPer + inputObj.elixirObj.atkPer + inputObj.engObj.atkPer)) / 100 + 1)




}