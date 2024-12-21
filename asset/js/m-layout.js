// 데스크탑 모바일 리다이렉트 기능

function name() {

    console.log("현재 URL: " + window.location.pathname);

    let userDevice = navigator.userAgent.toLowerCase();
    let mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userDevice);
    let currentPath = window.location.pathname;
    let queryString = window.location.search;

    if (mobileCheck) {    //모바일
        
        if( !currentPath.startsWith('/mobile') ){
            window.location.href = window.location.origin + '/mobile' + currentPath + queryString;
        }
    }else{

        if(currentPath.startsWith('/mobile')){
            window.location.href = window.location.origin + currentPath.replace('/mobile', '') + queryString;
        }
    }
}
name()




// 헤더


console.log("현재 URL: " + window.location.href);

function scHeader() {

    let userDevice = navigator.userAgent.toLowerCase();
    let mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userDevice);
    let searchPath = ""
    if (mobileCheck) {    //모바일
        searchPath = "/mobile/search/search.php"
    } else (              //데스크탑
        searchPath = "/search/search.php"
    )

    console.log(searchPath)
    

    return `
    <div class="sc-header">
        <div class="logo-group">
            <h1 class="logo">
                <span class="blind">로스트아크 전투정보실 전투력계산 스펙포인트</span>
                <a href="https://lopec.kr/mobile/" class="link-site"></a>

            </h1>

        </div>
        <div class="group-search">
            <span class="recent-close"><span class="blind">검색화면 나가기 버튼</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m12.718 4.707-1.413-1.415L2.585 12l8.72 8.707 1.413-1.415L6.417 13H20v-2H6.416l6.302-6.293z"/></svg></span>
            <form action="${searchPath}" class="search-area search-page on">
                <input id="headerInput" autocomplete="off" name="headerCharacterName" class="header-input character-name-search" type="text" value="" placeholder="캐릭터 검색">
                <button class="search-btn"></button>
            </form>


        </div>


    </div>

    <span class="side-btn">

        <em class="blind">사이드메뉴 토글 버튼</em>
        <em class="line1"></em>
        <em class="line2"></em>
        <em class="line3"></em>
    </span>
    <div class="side-blur"></div>
    
    <aside class="sc-sidemenu">

        <div class="group-link">
            <a href="https://open.kakao.com/o/smvJ4DQg" class="link-item" target="_blink">1:1문의</a>
            <a href="https://cool-kiss-ec2.notion.site/120758f0e8da80889d2fe738c694a7a1" target="_blink" class="link-item">후원안내</a>
            <a href="https://discord.gg/5B8SjX4ug4" class="link-item" target="_blink">디스코드</a>
            <a href="https://cool-kiss-ec2.notion.site/v1-0-137758f0e8da80bc95c7da1ffc0f3e34" target="_blink" class="link-item">로펙체커</a>
        </div>


        <div class="group-darkmode">
            <div  class="button b2 dark-mode-button" id="button-17">
                <input type="checkbox" class="checkbox" />
                <div class="knobs">
                    <span></span>
                </div>
                <div class="layer"></div>
            </div>
        </div>
    </aside>
    `;
}


document.querySelector('header').innerHTML = scHeader();



// 사이드메뉴 토글
document.querySelector(".side-btn").addEventListener("click",function(){
    this.classList.toggle("on");

    if(this.classList.contains("on")){
        document.documentElement.style.overflow = "hidden";
    }else{
        document.documentElement.style.overflow = "";
    }

    document.querySelector("header .sc-sidemenu").classList.toggle("on")
    document.querySelector("header .side-blur").classList.toggle("on")
})
document.querySelector(".side-blur").addEventListener("click",function(){
    document.documentElement.style.overflow = "";
    document.querySelector(".side-btn").classList.remove("on")
    document.querySelector("header .sc-sidemenu").classList.remove("on")
    document.querySelector("header .side-blur").classList.remove("on")
})



// 다크모드 스크립트

function enableDarkMode() {
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');

}

function disableDarkMode() {
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
}

if (localStorage.getItem('darkMode') == 'enabled') {
    enableDarkMode();
}




document.querySelector('.dark-mode-button').addEventListener('click', () => {
    if (localStorage.getItem('darkMode') == 'enabled') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

if (localStorage.getItem('darkMode') == 'enabled') {
    document.querySelector(".dark-mode-button .checkbox").checked = true
}



// 최근검색및 즐겨찾기
function recentBookmark() {


    let nameListStorage = JSON.parse(localStorage.getItem("nameList")) || []           //로컬스토리지 최근 검색어
    let userBookmarkStorage = JSON.parse(localStorage.getItem("userBookmark")) || []    //로컬스토리지 즐겨찾기 목록
    nameListStorage = nameListStorage.reverse()                                         //최신순으로 정렬
    userBookmarkStorage = userBookmarkStorage.reverse()                                 //최신순으로 정렬


    let recentNameBox = ""
    let bookmarkNameBox = ""

    nameListStorage.forEach(function (recentNameArry) {                                       //최근검색HTML목록

        recentNameBox += `
            <div class="name-box" data-sort="recent">
                <a href="https://lopec.kr/search/search.php?mainCharacterName=${recentNameArry}" class="name">${recentNameArry}</a>
                <em class="del remove"></em>
            </div>`;
    })

    userBookmarkStorage.forEach(function (bookmarkArry) {

        bookmarkNameBox += `
        <div class="name-box" data-sort="bookmark">
            <a href="https://lopec.kr/search/search.php?mainCharacterName=${bookmarkArry}" class="name">${bookmarkArry}</a>
            <em class="star remove">☆</em>
        </div>`;
    })



    return `
    <div class="group-recent" tabindex="0">
        <div class="name-area">
            <span data-sort="recent" class="recent sort on">최근검색</span>
            <span data-sort="bookmark" class="bookmark sort">즐겨찾기</span>
        </div>
        <div class="recent-area memo on">
            ${recentNameBox}
        </div>

        <div class="bookmark-area memo">
            ${bookmarkNameBox}
        </div>
    </div>`;
}


document.querySelectorAll("input[type='text']").forEach(function (inputArry) {
    inputArry.addEventListener("click", userInputMemoHtml(inputArry))
})

let recentFlag = 0;
function userInputMemoHtml(inputElement) {
    inputElement.addEventListener("focus", function (input) {
        let leftPos = input.target.getBoundingClientRect().left;
        let topPos = input.target.getBoundingClientRect().top;


        // 브라우저 외부에서 브라우저로 포커스시 좌표 버그 해결 코드
        if (recentFlag == 0) {
            document.body.appendChild(
                document.createRange().createContextualFragment(recentBookmark())
            )
        }

        // 모바일 검색화면 뒤로가기 버튼 & 스크롤 금지
        document.querySelector(".group-search").classList.add("on");
        document.documentElement.style.overflow = 'hidden';


        let recentHtml = document.querySelector(".group-recent");


        // recentHtml.style.top = topPos + 55 + "px";
        // recentHtml.style.left = leftPos + "px";


        // 분류명 클릭
        document.querySelectorAll(".group-recent .name-area .sort").forEach(function (sort) {
            sort.addEventListener("click", function () {
                let nowSort = sort.getAttribute("data-sort")


                document.querySelectorAll(".group-recent .memo").forEach(function (memo) {
                    memo.classList.remove("on");
                })
                document.querySelectorAll(".group-recent .name-area .sort").forEach(function (removeSort) {
                    removeSort.classList.remove("on");
                })

                document.querySelector("." + nowSort + "-area").classList.add("on");
                document.querySelector("." + nowSort).classList.add("on");

            })
        })

        // 목록제거버튼

        let nowUserName = JSON.parse(localStorage.getItem("nameList")).reverse()[0]                  // 현재 검색된 유저명


        document.querySelectorAll(".group-recent .memo .remove").forEach(function (removeBtn) {

            removeBtn.addEventListener("click", function () {
                let nowRecentName = removeBtn.parentElement.querySelector(".name").textContent       // 선택한 유저명
                console.log(removeBtn.parentElement.getAttribute("data-sort"))

                if (removeBtn.parentElement.getAttribute("data-sort") == "recent") {

                    let nameListStorage = JSON.parse(localStorage.getItem("nameList")).reverse()     // 로컬스토리지 최근 검색어


                    nameListStorage = nameListStorage.filter(item => item !== nowRecentName);
                    localStorage.setItem("nameList", JSON.stringify(nameListStorage.reverse()))

                } else if (removeBtn.parentElement.getAttribute("data-sort") == "bookmark") {

                    let nameListStorage = JSON.parse(localStorage.getItem("userBookmark")).reverse() // 즐겨찾기 리스트


                    nameListStorage = nameListStorage.filter(item => item !== nowRecentName);
                    localStorage.setItem("userBookmark", JSON.stringify(nameListStorage.reverse()))

                    if (document.querySelector(".star.full") && nowRecentName == nowUserName) {

                        document.querySelector(".star.full").classList.remove("full");
                    }
                }

                removeBtn.parentElement.remove()
            })
        })



        //.group-recent포커스해제
        recentHtml.addEventListener("blur", inputBlur)
        recentFlag = 1;
    })

}

// input포커스해제
document.querySelectorAll("input[type='text']").forEach(function (inputArry) {
    inputArry.addEventListener("blur", inputBlur)
})



function inputBlur() {
    let recentHTML = document.querySelector(".group-recent")
    let input = document.querySelector("input")


    
    setTimeout(function () {
        if (!input.contains(document.activeElement) && !recentHTML.contains(document.activeElement)) {
            document.querySelector(".group-search").classList.remove("on")
            document.documentElement.style.overflow = '';
            recentHTML.remove()
            recentFlag = 0;
            
        }
    }, 0)
}



// 푸터
document.querySelector('footer').innerHTML = `<span>Copyright 2024 lopec.kr All rights reserved.</span>`;

// 푸터 하단 고정 스크립트(앵커광고 삽입시 레이아웃 깨짐 대책)
function footerPositionFnc() {
    let footer = document.querySelector(".sc-footer")
    footer.style.display = "block"
    footer.style.top = (document.body.offsetHeight - footer.offsetHeight) + "px";
    footer.style.width = window.offsetWidth + "px"
}

footerPositionFnc()

var resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.target === document.body) {
            footerPositionFnc();
        }
    });
});
resizeObserver.observe(document.body);
window.addEventListener("resize", footerPositionFnc)

