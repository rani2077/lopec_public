// export async function importModuleManager() {
//     let interValTime = 60 * 1000;
//     let modules = await Promise.all([
//         import("../custom-module/fetchApi.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),      // lostark API 호출
//         import("../custom-module/trans-value.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),   // 유저정보 수치화
//         import("../custom-module/calculator.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),    // 수치값을 스펙포인트로 계산
//         import("../custom-module/component.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),     // 컴포넌트 모듈
//         import("../js/character.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),                // 특정 유저의 상세정보를 저장
//         import("../filter/filter.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),               // 필터 호출 (기존 filter.js)
//         import("../filter/simulator-filter.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),     // 시뮬레이터 필터
//         import("../filter/simulator-data.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),       // 장비레벨 스텟 정보
//         import("../custom-module/lopec-ocr.js" + `?${Math.floor((new Date).getTime() / interValTime)}`),     // 수치값을 스펙포인트로 계산(어차피 기본적으로 전역변수가 됨)
//     ])
//     let Modules = {
//         fetchApi: modules[0],
//         transValue: modules[1],
//         calcValue: modules[2],
//         component: modules[3],
//         dataBase: modules[4],
//         originFilter: modules[5],
//         simulatorFilter: modules[6],
//         simulatorData: modules[7],
//     }
//     return Modules
// }

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