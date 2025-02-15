function parseValue(value) {
    if (value.startsWith("Number:")) {
        let num = value.replace("Number:", "").trim();
        return isNaN(num) ? value : Number(num); // 숫자로 변환
    } else if (value.includes(":")) {
        return value.split(":")[1].trim(); // 앞 부분 제거 후 문자열 유지
    }
    return value; // 그대로 반환
}

function setNestedValue(obj, keys, value, sortKey = null) {
    let lastKey = keys.pop(); // 마지막 키 가져오기 (예: "Level", "Grade")
    let parentKey = keys.pop(); // 마지막 이전 키 가져오기 (예: "ArkPassiveEffects")
    let nestedObj = obj;

    // 중첩된 키 순회하면서 객체 생성
    keys.forEach(key => {
        if (!nestedObj[key]) {
            nestedObj[key] = {}; // 중첩 객체가 없으면 생성
        }
        nestedObj = nestedObj[key]; // 다음 중첩 객체로 이동
    });

    if (sortKey) {
        // sortKey가 있으면 해당 키의 값들을 합치기
        if (!nestedObj[parentKey]) {
            nestedObj[parentKey] = {}; // 없으면 객체 생성
        }
        if (!nestedObj[parentKey][sortKey]) {
            nestedObj[parentKey][sortKey] = parseValue(value); // 없으면 초기 값 설정
        } else {
            nestedObj[parentKey][sortKey] += parseValue(value); // 값이 있으면 그대로 합침
        }
    } else {
        // 기존 방식대로 객체 배열 생성
        if (!nestedObj[parentKey]) {
            nestedObj[parentKey] = []; // 없으면 배열 생성
        }

        let existingEntry = nestedObj[parentKey].find(obj => !obj.hasOwnProperty(lastKey));

        if (existingEntry) {
            existingEntry[lastKey] = parseValue(value); // 기존 객체에 속성 추가
        } else {
            let newEntry = {};
            newEntry[lastKey] = parseValue(value);
            nestedObj[parentKey].push(newEntry); // 새로운 객체 추가
        }
    }
}

function getSelectedOptionsAsJson() {
    let data = {};
    let sortMap = {};

    // 모든 <select> 요소 찾기
    document.querySelectorAll("select").forEach(select => {
        let name = select.getAttribute("name"); // name 속성 가져오기
        if (!name) return; // name이 없으면 무시

        let keys = name.split(/\s+/); // 공백 기준으로 분할
        let value = select.value; // 선택된 옵션 값
        let sortKey = select.getAttribute("data-sort"); // data-sort 속성 가져오기

        if (sortKey) {
            // sortKey가 있으면 sortMap에 저장
            if (!sortMap[sortKey]) {
                sortMap[sortKey] = []; // 없으면 배열 생성
            }
            sortMap[sortKey].push({ keys, value });
        } else {
            // 기존 방식대로 값 저장
            setNestedValue(data, keys, value);
        }
    });

    // sortMap의 값을 합쳐서 data에 추가
    Object.keys(sortMap).forEach(sortKey => {
        let combinedValue = sortMap[sortKey].map(item => parseValue(item.value)).join("<>");
        let keys = sortMap[sortKey][0].keys;
        setNestedValue(data, keys, combinedValue);
    });

    return JSON.stringify(data, null, 4); // JSON 문자열 반환 (들여쓰기 4칸)
}

console.log(JSON.parse(getSelectedOptionsAsJson()));
