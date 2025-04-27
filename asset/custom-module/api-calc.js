export async function importModuleManager() {
    // 이 함수는 매개변수를 받지 않으며, 정의된 모든 모듈을 무조건 로드합니다.

    let interValTime = 60 * 1000;
    const cacheBuster = `?${Math.floor((new Date).getTime() / interValTime)}`;

    // 로드할 가능성이 있는 모든 모듈 정보
    // filename 키는 더 이상 사용되지 않으므로 제거했습니다.
    const potentialModules = [
        { key: 'fetchApi', path: '../custom-module/fetchApi.js' },
        { key: 'transValue', path: '../custom-module/trans-value.js' },
        { key: 'calcValue', path: '../custom-module/calculator.js' },
        // { key: 'apiCalcValue', path: '../custom-module/api-calc.js' },
        { key: 'component', path: '../custom-module/component.js' },
        { key: 'dataBase', path: '../js/character.js' },
        { key: 'originFilter', path: '../filter/filter.js' },
        { key: 'simulatorFilter', path: '../filter/simulator-filter.js' },
        { key: 'simulatorData', path: '../filter/simulator-data.js' },
        { key: 'lopecOcr', path: '../custom-module/lopec-ocr.js' },
    ];

    const promisesToLoad = [];
    const loadedModuleKeys = [];

    // potentialModules 목록을 순회하며 모든 모듈을 로드 대상에 추가
    for (const moduleInfo of potentialModules) {
        // filename 키와 관련된 로직은 모두 제거되었습니다.

        // 모든 모듈을 로드할 프로미스 배열에 추가합니다.
        promisesToLoad.push(import(moduleInfo.path + cacheBuster));
        // 로드될 모듈의 키(key)도 함께 저장합니다.
        loadedModuleKeys.push(moduleInfo.key);
    }

    // 로드 대상으로 선정된 모든 모듈을 비동기적으로 로드
    const loadedModules = await Promise.all(promisesToLoad);

    // 로드된 모듈들을 원래의 키에 매핑하여 결과 객체 생성
    const Modules = {};
    for (let i = 0; i < loadedModules.length; i++) {
        const key = loadedModuleKeys[i];
        Modules[key] = loadedModules[i];
    }

    // 로드되지 않은 모듈에 대한 키는 결과 객체에 포함되지 않습니다.
    return Modules;
}
let Modules = await importModuleManager();
// console.log(Modules)
export async function apiCalcValue(inputName) {
    let data = await Modules.fetchApi.lostarkApiCall(inputName);
    let extractValue = await Modules.transValue.getCharacterProfile(data);
    let calcValue = await Modules.calcValue.specPointCalc(extractValue);
    let dataBase
    if (!window.location.href.includes("lopec.kr")) {
        //console.log(extractValue.defaultObj.totalStatus)
        dataBase = {
            "nickname": "청청청",
            "characterClass": "일격 스트라이커",
            "itemLevel": 1697,
            "totalSum": 1579.75,
            "totalSumSupport": 259.18,
            "karma": 0,
            "totalStatus": extractValue.defaultObj.totalStatus,
            "totalStatusSupport": extractValue.defaultObj.totalStatus,
            "achieveDate": "20250417231756",
            "baseHp": 0,
            "maxHp": 0,
            "classRank": {
                "rank": 9999,
                "total": 9999,
                "percentage": 99.99
            },
            "totalRank": {
                "rank": 9999,
                "total": 9999,
                "percentage": 99.99
            }
        }
        // dataBase = await Modules.dataBase.dataBaseWrite(data, extractValue, calcValue);
        // extractValue.defaultObj.totalStatus = dataBase.totalStatus;
        // calcValue = await Modules.calcValue.specPointCalc(extractValue);
    } else {
        dataBase = await Modules.dataBase.dataBaseWrite(data, extractValue, calcValue);
        extractValue.defaultObj.totalStatus = dataBase.totalStatus;
        calcValue = await Modules.calcValue.specPointCalc(extractValue);
    }
    let result = {};
    result.dataBase = dataBase;
    result.extractValue = extractValue;
    result.calcValue = calcValue;
    result.data = data;
    // console.log(result);
    return result;
}
