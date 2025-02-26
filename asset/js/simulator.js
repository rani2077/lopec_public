let cachedData = null;

async function simulatorInputCalc() {
    let module = await Promise.all([
        import("../custom-module/fetchApi.js"),      // fetchApi
        import("../custom-module/trans-value.js"),   // transValue
        import("../custom-module/calculator.js"),    // calcValue
        import("../custom-module/calc-module.js"),   // calcModule
        import("../filter/simulator-data.js")        // simulatorData

    ])


    let [fetchApi, transValue, calcValue, calcModule, simulatorData] = module

    if (!cachedData) {
        cachedData = await fetchApi.lostarkApiCall("청염각");
        console.log(cachedData)
        await selectCreate(cachedData)

    }
    let extractValue = await transValue.getCharacterProfile(cachedData)




    /* **********************************************************************************************************************
     * function name		:	engOutputCalc
     * description			: 	각인 계산값
     *********************************************************************************************************************** */

    let engObjList = await calcModule.engExtract()
    let simulatorEngObj = await calcModule.engOutputCalc(engObjList)




    // console.log(engObjList)
    // console.log(simulatorEngObj)

    /* **********************************************************************************************************************
     * function name		:	armoryLevelCalc()
     * description			: 	사용자가 선택한 장비 level stat special 객체 반환
     *********************************************************************************************************************** */

    function armoryLevelCalc() {
        let result = []
        let armorNameElements = document.querySelectorAll(".armor-item .armor-tag");
        let startLevelElements = document.querySelectorAll(".armor-item .plus");
        let normaleUpgradeLevelElements = document.querySelectorAll(".armor-item .armor-name");
        let advancedUpgradeLevelElements = document.querySelectorAll(".armor-item .armor-upgrade");

        for (let i = 0; i < armorNameElements.length; i++) {
            let startLevelValue = Number(startLevelElements[i].value)
            let normaleUpgradeLevelValue = Number(normaleUpgradeLevelElements[i].value * 5)
            let advancedUpgradeLevelValue = Number(advancedUpgradeLevelElements[i].value)
            let obj = {
                name: armorNameElements[i].textContent,
                level: startLevelValue + normaleUpgradeLevelValue + advancedUpgradeLevelValue,
                special: advancedUpgradeLevelValue
            }
            result.push(obj)
        }

        // console.log(result)

        let armorObj = []

        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 투구
        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 어깨
        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 상의
        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 하의
        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 장갑
        armorPartObjCreate(simulatorData.helmetlevels, result[0].level)           // 무기

        function armorPartObjCreate(armorData, resultObj) {
            let obj = armorData.find(part => part.level == resultObj);
            obj.special = result[0].special;
            obj.name = result[0].name;
            armorObj.push(obj)

        }
        // console.log(armorObj)

        return armorObj
    }
    // console.log(armoryLevelCalc())
    /* **********************************************************************************************************************
     * function name		:	specPointCalc
     * description			: 	최종 스펙포인트 계산식
     *********************************************************************************************************************** */

    let originSpecPoint = await calcValue.specPointCalc(extractValue)

}
simulatorInputCalc()
document.body.addEventListener('change', () => { simulatorInputCalc() })


/**
 * 아이템 레벨에 따른 스탯 값을 계산하는 함수
 * @param {number} itemLevel - 아이템 레벨
 * @returns {number} - 계산된 스탯 값 (정수)
 */
function calculateStat(itemLevel) {
    // 입력값 유효성 검사
    if (typeof itemLevel !== 'number') {
        throw new Error('아이템 레벨은 숫자여야 합니다.');
    }

    if (itemLevel < 0) {
        throw new Error('아이템 레벨은 0 이상이어야 합니다.');
    }

    // 데이터 분석을 통해 얻은 지수 함수 공식 적용
    // 스탯 = 0.54 × e^(0.006839 × 아이템레벨)
    let exponent = 0.006839 * itemLevel;
    let statValue = 0.54 * Math.exp(exponent);

    // 소수점 이하 반올림하여 정수 반환
    return Math.round(statValue);
}

// 사용 예시
// let level = 1650;
// let stat = calculateStat(level);
// console.log(`아이템 레벨 ${level}의 스탯: ${stat}`);







async function selectCreate(data) {
    let module = await Promise.all([
        import("../filter/simulator-filter.js"),      // simulatorFilter
        import("../filter/simulator-data.js"),        // simulatorData
        import("../filter/filter.js"),                // originFilter
        import("../custom-module/calc-module.js"),    // calcModule
    ])

    let [simulatorFilter, simulatorData, originFilter, calcModule] = module


    /* **********************************************************************************************************************
    * function name		:	applyDataMinMaxToOptions()
    * description	    : 	data-min data-max값을 이용하여 select 드롭박스 숫자값 자동생성
    *********************************************************************************************************************** */

    function applyDataMinMaxToOptions() {
        const selectElements = document.querySelectorAll('select[data-max]');
        selectElements.forEach(selectElement => {
            const max = parseInt(selectElement.getAttribute('data-max'), 10);
            const min = selectElement.hasAttribute('data-min') ? parseInt(selectElement.getAttribute('data-min'), 10) : 1;

            for (let i = min; i <= max; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                selectElement.appendChild(option);
            }
        });
    }
    applyDataMinMaxToOptions()

    /* **********************************************************************************************************************
    * function name		:	applyDataStringToOptions()
    * description	    : 	data-string값을 이용하여 select 드롭박스 표시내용 수정
    *********************************************************************************************************************** */

    function applyDataStringToOptions() {
        const selectElementsWithDataString = document.querySelectorAll('select[data-string]');
        selectElementsWithDataString.forEach(selectElement => {
            const dataString = selectElement.getAttribute('data-string');
            const options = selectElement.querySelectorAll('option');

            options.forEach(option => {
                const originalText = option.textContent.replace(dataString, '');
                option.textContent = `${dataString}${originalText}`;
            });
        });
    }
    applyDataStringToOptions()


    /* **********************************************************************************************************************
    * function name		:	engFilterToOptions()
    * description	    : 	.engraving-box .engraving-name option 생성하기
    *********************************************************************************************************************** */


    function engFilterToOptions() {

        let engNameObj = simulatorFilter.engFilter.filter((obj, index, self) =>
            index === self.findIndex((o) => (
                o.name === obj.name
            ))
        );


        // calcModule.supportCheck(data) 값과 일치하는 job의 block 값 제거
        originFilter.engravingCalFilter.forEach(filter => {
            if (filter.job === calcModule.supportCheck(data)) {
                filter.block = [...new Set(filter.block)]; // 중복 제거
                engNameObj = engNameObj.map(engName => {
                    if (filter.block.includes(engName.name)) {
                        return { name: `${engName.name} - 무효` };
                    }
                    return engName;
                });
            }
        });

        // .engraving-box .engraving-name 요소에 option 추가
        document.querySelectorAll(".engraving-box .engraving-name").forEach(el => {
            engNameObj.forEach(engNameObj => {
                el.innerHTML += `<option value="${engNameObj.name}">${engNameObj.name}</option>`;
            });
        });

    }
    engFilterToOptions()

    /* **********************************************************************************************************************
    * function name		:	elixirFilterToOption()
    * description	    : 	엘릭서의 고유옵션과 공용옵션을 동적으로 생성(좌측 고유옵션+공용옵션 우측 공용옵션만)
    *********************************************************************************************************************** */

    function elixirFilterToOption() {
        let commonElixirElements = document.querySelectorAll('.armor-item .elixir.common');
        let helmetElixirElement = document.querySelector(".armor-item .elixir.helmet");
        let shoulderElixirElement = document.querySelector(".armor-item .elixir.shoulder");
        let armorElixirElement = document.querySelector(".armor-item .elixir.armor");
        let pantsElixirElement = document.querySelector(".armor-item .elixir.pants");
        let gloveElixirElement = document.querySelector(".armor-item .elixir.glove");


        optionCreate(commonElixirElements, simulatorFilter.elixirOptionData.common)
        optionCreate(helmetElixirElement, simulatorFilter.elixirOptionData.helmet)
        optionCreate(shoulderElixirElement, simulatorFilter.elixirOptionData.shoulder)
        optionCreate(armorElixirElement, simulatorFilter.elixirOptionData.armor)
        optionCreate(pantsElixirElement, simulatorFilter.elixirOptionData.pants)
        optionCreate(gloveElixirElement, simulatorFilter.elixirOptionData.glove)

        function optionCreate(element, filter) {
            if (element instanceof NodeList) {
                element.forEach(element => {
                    filter.forEach(common => {
                        for (const key in common) {
                            if (common.hasOwnProperty(key) && key !== "name") {
                                let option = document.createElement("option");
                                option.value = `${key}:${common[key]}`;
                                option.textContent = common.name;
                                element.appendChild(option);
                            }
                        }
                    })
                })
            } else {
                filter.forEach(specialFilter => {
                    for (const key in specialFilter) {
                        if (specialFilter.hasOwnProperty(key) && key !== "name") {
                            let option = document.createElement("option");
                            option.value = `${key}:${specialFilter[key]}`;
                            option.textContent = specialFilter.name;
                            element.appendChild(option);
                        }
                    }
                })
            }
        }

    }
    elixirFilterToOption()

    /* **********************************************************************************************************************
    * function name		:	applyDataSelectToOptions()
    * description	    : 	data-select을 이용하여 사용자의 기본값에 해당하는 option을 선택함
    *********************************************************************************************************************** */

    function applyDataSelectToOptions() {
        const selectElements = document.querySelectorAll("select[data-select]");
        selectElements.forEach(selectElement => {
            const name = selectElement.getAttribute("data-select");
            // const option = document.createElement('option');
            // option.value = name;
            // option.textContent = name;
            // option.selected = true;
            // selectElement.appendChild(option);
            let optionElements = Array.from(selectElement.querySelectorAll("option"))
            let selectOption = optionElements.find(optionElement => optionElement.value == name || optionElement.value == name + " - 무효");
            if (selectOption) {
                selectOption.selected = true;
            }
        })
    }
    applyDataSelectToOptions()

    /* **********************************************************************************************************************
    * function name		:	
    * description	    : 	
    *********************************************************************************************************************** */

    let engObjList = await calcModule.engExtract()

    /* **********************************************************************************************************************
    * function name		:	armoryEnforceLimite()
    * description	    : 	.armor-item .armor-name와 .armor-item .tier 의 값에 따라 상급재련 선택요소 생성
    *********************************************************************************************************************** */
    function armoryEnforceLimite() {
        let armorElements = document.querySelectorAll(".armor-item .armor-name");

        armorElements.forEach(armorElement => {
            applyUpgradeOptions(armorElement);

            armorElement.addEventListener("change", () => {
                applyUpgradeOptions(armorElement);
            });
            armorElement.parentElement.parentElement.parentElement.querySelector(".plus").addEventListener("change", () => {
                applyUpgradeOptions(armorElement);
            });
        });

        function applyUpgradeOptions(armorElement) {
            let upgradeElement = armorElement.parentElement.querySelector(".armor-upgrade");
            let normalUpgradeValue = Number(armorElement.value)
            let tierValue = Number(armorElement.parentElement.querySelector(".plus").value)
            if (tierValue + normalUpgradeValue * 5 < 1620) {
                createOptions(upgradeElement, -1);
            } else if (tierValue + normalUpgradeValue * 5 < 1680) {
                createOptions(upgradeElement, 1, 20);
            } else if (tierValue + normalUpgradeValue * 5 < 1700) {
                createOptions(upgradeElement, 21, 30);
            } else {
                createOptions(upgradeElement, 31, 40);
            }
            applyDataStringToOptions();
        }

        function createOptions(selectElement, start, end) {
            if (!selectElement) {
                return;
            }

            // 기존 옵션 제거
            selectElement.innerHTML = '';

            if (start === -1) {
                const option = document.createElement('option');
                option.value = 0;
                option.textContent = '없음';
                selectElement.setAttribute('data-string', "")
                selectElement.appendChild(option);
            } else {
                // 옵션 생성 및 추가
                for (let i = start; i <= end; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    selectElement.setAttribute('data-string', "X ")
                    selectElement.appendChild(option);
                }
            }
        }
    }
    armoryEnforceLimite()
    /* **********************************************************************************************************************
    * function name		:	applyDataNameToOptions()
    * description	    : 	data-name을 이용하여 필터에 없는 각인을 장착시 표시해줌
    *********************************************************************************************************************** */
    function applyDataNameToOptions() {
        const selectElements = document.querySelectorAll("select[data-name]");
        selectElements.forEach(selectElement => {
            // selectElement.innerHTML = "";
            const name = selectElement.getAttribute("data-name");
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name + "- 무효";
            option.selected = true;
            selectElement.appendChild(option);

        })
    }
    applyDataNameToOptions()

}







// // 툴팁
const selectElements = document.querySelectorAll('select');

selectElements.forEach((selectElement) => {
    selectElement.addEventListener('mouseover', (event) => {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = selectedOption.text;

        document.body.appendChild(tooltip);
        tooltip.style.left = `${event.clientX + window.scrollX + 10}px`;
        tooltip.style.top = `${event.clientY + window.scrollY + 10}px`;

        selectElement.addEventListener('mousemove', (moveEvent) => {
            tooltip.style.left = `${moveEvent.clientX + window.scrollX + 10}px`;
            tooltip.style.top = `${moveEvent.clientY + window.scrollY + 10}px`;
        });

        selectElement.addEventListener('mouseout', () => {
            tooltip.remove();
        }, { once: true });
    });

    selectElement.addEventListener('change', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.textContent = selectElement.options[selectElement.selectedIndex].text;
        }
    });
});
