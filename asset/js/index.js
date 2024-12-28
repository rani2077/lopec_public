// 광고 스와이퍼
var swiper = new Swiper(".group-top-ads", {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});


// 공지생성
let noticeArry = [
    {
        name:"2024-11-24 업데이트 내역",
        desc:`캐릭터 정보 갱신하기 기능을 추가하였습니다.`
    },
    {
        name:"2024-12-01 업데이트 내역",
        desc:`즐겨찾기 및 최근검색 기능을 추가하였습니다.`
    },
    {
        name:"2024-12-07 업데이트 내역",
        desc:`로펙체커의 가독성을 소폭 조정하였습니다.`
    },
    {
        name:"2024-12-08 업데이트 내역",
        desc:
        `보정지역에 위치해 있을 시, 스펙포인트가 붉은색으로 출력되도록 변경하였습니다.
        더하여, 보정지역임을 알리는 경고 아이콘이 추가되었습니다.`
    },
    {
        name:"2024-12-11 업데이트 내역",
        desc:`특정 팔찌 옵션이 서폿 직업군에게 적용되지 않는 오류를 수정하였습니다.`
    },
    {
        name:"2024-12-14 업데이트 내역",
        desc:
        `특정 상황에서 귀걸이의 [무기 공격력%] 옵션과 [공격력%] 옵션의 계산식이
        반대로 적용되는 오류를 수정하였습니다.`
    },
    {
        name:"2024-12-20 업데이트 내역",
        desc:
        `- 전구간 아크패시브 통합 대응 작업을 완료하였습니다.
        - 각 스펙업 요소들의 딜 상승 수치를 조금 더 정확하게 조정했습니다.
        - (구)스펙포인트의 잔재였던 '스펙 달성률' 기능을 삭제하였습니다.
        - 모바일 페이지를 대폭 수정하여 가독성 및 접근성을 높였습니다.
        - 사이트의 UI 및 세부 디자인을 소폭 수정하였습니다.
        - 스펙포인트 상향 평준화에 맞춰, 티어 달성에 필요한 수치를 상향 조정하였습니다.`
    },
    {
        name:"카카오톡봇 [엉봇]에서도 로펙을 만나보세요!",
        desc:
        `[엉봇]은 로아의 다양한 정보를 
        카톡에서 쉽게 볼 수 있도록 개발된 봇입니다.
        
        현재 5만 명이 넘는 유저분들이 사용하실 정도로 
        유용한 기능을 많이 제공하고 있어요!
        
        이번에 좋은 기회를 통해 엉봇에서도 
        스펙 포인트 및 티어를 조회하실 수 있게 되었습니다 🙂
        
        엉봇에 대한 자세한 정보는 아래 링크를 참조해주세요!
        <a href="https://www.inven.co.kr/board/lostark/4821/100675" target="_blink">https://www.inven.co.kr/board/lostark/4821/100675</a>


        <img src="asset/image/Sliora1.png">
        <img src="asset/image/Sliora2.png">
        <img src="asset/image/Sliora3.png">
        
        
        `
        },
]






// notice 공지 생성
let noticeListHtml = ""
noticeArry.reverse().forEach(function(notice){
    noticeListHtml += noticeList(notice.name, notice.desc)
})

console.log(noticeListHtml)

function noticeList(name,desc) {

    return `
    <div class="notice-list">
        <div class="name-box">
            <span class="name">${name}</span>
            <span class="detail-btn"></span>
        </div>
        <div class="notice-box">
            <p class="desc">${desc}</p>
        </div>
    </div>`;
}

document.querySelector(".sc-notice .group-notice").innerHTML = noticeListHtml;

// 공지 on/off

document.querySelectorAll(".sc-notice .name-box").forEach(function (noticeElement) {
    noticeElement.addEventListener("click", function () {

        noticeElement.parentNode.classList.toggle("on")

        console.log(noticeElement.nextElementSibling.querySelector(".desc").clientHeight + "px")
        if (noticeElement.parentNode.classList.contains("on")) {
            noticeElement.nextElementSibling.style.height = noticeElement.nextElementSibling.querySelector(".desc").offsetHeight + "px"
        } else {
            noticeElement.nextElementSibling.style.height = "0px"
        }


    })
})    



// 공지 자동 줄바꿈
document.querySelectorAll(".desc").forEach(function (noticeDesc) {
    noticeDesc.innerHTML = noticeDesc.innerHTML.split("\n").join("<br>");
});

