import * as simulatorFilter from "../filter/simulator-filter.js"



/* **********************************************************************************************************************
 * function name		:	engObj
 * description			: 	각인
 *********************************************************************************************************************** */


export async function engOutputCalc(inputValueObjArr) {
    let result = [];

    inputValueObjArr.forEach(function (inputValue) {
        const matchingFilters = simulatorFilter.engFilter.filter(function (filter) {
            return filter.name === inputValue.name && filter.grade === inputValue.grade && filter.level === inputValue.level;
        });

        matchingFilters.forEach(function (filter) {
            result.push({
                finalDamagePer: filter.finalDamagePer,
                engBonus: filter.engBonus
            });
        });
    });

    return result;
}

// 필터에 없는값과 무효값들 어떻게 처리할 건지


/* **********************************************************************************************************************
 * function name		:	engObj
 * description			: 	어빌리티 스톤
 *********************************************************************************************************************** */




/* **********************************************************************************************************************
 * function name		:	armorStatus()
 * description			: 	장비 (방어구 및 악세서리)
 *********************************************************************************************************************** */
