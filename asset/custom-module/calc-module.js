import * as simulatorFilter from "../filter/simulator-filter.js"
import * as filter from "../filter/filter.js"



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
 * function name		:	engExtract()
 * description			: 	현재 각인 객체로 추출
 *********************************************************************************************************************** */

export async function engExtract() {
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
 * function name		:	supportCheck()
 * description			: 	2차 직업명
 *********************************************************************************************************************** */

export function supportCheck(data) {
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
    return arkResult
}
