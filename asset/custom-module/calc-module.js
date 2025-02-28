import * as simulatorFilter from "../filter/simulator-filter.js"
import * as filter from "../filter/filter.js"




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
