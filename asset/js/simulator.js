let cachedData = null;

async function customModuleImport() {
    let module = await Promise.all([
        import("../custom-module/fetchApi.js"),
        import("../custom-module/trans-value.js"),
        import("../custom-module/calculator.js"),
        import("../custom-module/calc-module.js")

    ])

    let [fetchApi, transValue, calcValue, calcModule] = module

    if (!cachedData) {
        cachedData = await fetchApi.lostarkApiCall("청염각");
    }
    let extractValue = await transValue.getCharacterProfile(cachedData)




    /* **********************************************************************************************************************
     * function name		:	tempFncFnc
     * description			: 	각인 계산값
     *********************************************************************************************************************** */

    function engExtract() {
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

    // let objArr = [
    //     {
    //         name: "타격의 대가",
    //         grade: "유물",
    //         level: 4
    //     },
    //     {
    //         name: "타격의 대가",
    //         grade: "유물",
    //         level: 4
    //     }
    // ]

    let simulatorEngObj = await calcModule.engOutputCalc(engExtract())
    console.log(simulatorEngObj)





    /* **********************************************************************************************************************
     * function name		:	specPointCalc
     * description			: 	최종 스펙포인트 계산식
     *********************************************************************************************************************** */

    let originSpecPoint = await calcValue.specPointCalc(extractValue)

}
customModuleImport()
document.body.addEventListener('change', function(){customModuleImport()})










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
