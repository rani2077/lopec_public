import { gradeModule ,specDetail,getCharacterProfile, specBtn} from '../js/custom.js';

// 캐릭터 검색하기
let loadingFlag = 0
document.querySelectorAll('.character-name-search-minimum').forEach(function(inputArry){
    inputArry.addEventListener('keypress', function(e) {
        if (e.keyCode == 13 && loadingFlag == 0) {
            loadingFlag = 1
            patreonSkeleton()
            setTimeout(function() {
                getCharacterProfile(inputArry.value,function(){
                    patreonSpecPoint()
                    specBtn()
                });
                
                loadingFlag = 0;
            }, 1000);
    
        }
    });
})




// 검색결과 표시하기
function patreonSpecPoint(){    
    document.querySelector(".spec-area").innerHTML = `
    <p class="title">스펙 포인트</p>
    <div class="tier-box">
        <img src=".${gradeModule.ico}" alt="">
        <p class="tier-info">${gradeModule.info}</p>
    </div>
    <span class="spec-point">${formatNumber(specDetail.spec)}</span>
    <div class="extra-info">
        <p class="detail-info">세부정보</p>
        <p class="text">전투레벨 : ${(specDetail.character.toLocaleString())}</p>
        <p class="text">장비 : ${(specDetail.armor.toLocaleString())}</p>
        <p class="text">아크패시브 : ${(specDetail.ark.toLocaleString())}</p>
        <p class="text">T4 악세서리 : ${(specDetail.accessory.toLocaleString())}</p>
        <p class="text">세트자비 : ${(specDetail.set.toLocaleString())}</p>
        <p class="text">엘릭서 : ${(specDetail.elixir.toLocaleString())}</p>
        <p class="text">보석 : ${(specDetail.gems.toLocaleString())}</p>
        <p class="text">각인 : ${(specDetail.engraving.toLocaleString())}</p>
        <p class="text">초월 : ${(specDetail.hyper.toLocaleString())}</p>
        <p class="text">팔찌 : ${(specDetail.bangle.toLocaleString())}</p>
        <p class="text">카드 : ${(specDetail.card.toLocaleString())}</p>
        <p class="text">어빌리티 스톤 : ${(specDetail.abilityStone.toLocaleString())}</p>
    </div>
    <span class="extra-btn" id="extra-btn"></span>
`;
}

// 억천만
function formatNumber(num) {
    if (num >= 100000000) {
        return Math.floor(num / 100000000) + '억 ' + formatNumber(num % 100000000);
    } else if (num >= 10000) {
        const remainder = num % 10000;
        return Math.floor(num / 10000) + '만' + (remainder > 0 ? ' ' + formatNumber(remainder) : '');
    } else {
        return num.toString();
    }
}




// 로딩효과 구현
function patreonSkeleton(){
    document.querySelector(".spec-area").innerHTML = `
        <p class="title">스펙 포인트</p>
        <div class="tier-box">
            <!-- <img class="skeleton" src="" alt=""> -->
            <!-- <p class="tier-info">티어정보</p> -->
            <span class="skeleton">
        </div>
        <span class="spec-point skeleton skeleton-frame"></span>
        <div class="extra-info">
            <p class="detail-info">
                <span class="skeleton"></span>
            </p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
            <p class="text skeleton"></p>
        </div>
        <span class="extra-btn" id="extra-btn"></span>
`;
}

