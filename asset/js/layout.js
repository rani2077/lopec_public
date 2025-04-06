/* **********************************************************************************************************************
* variable name		:	mobileCheck
* description       : 	현재 접속한 디바이스 기기가 모바일, 태블릿일 경우 true를 반환
*********************************************************************************************************************** */
let mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(navigator.userAgent.toLowerCase());
/* **********************************************************************************************************************
* variable name		:	userDeviceToRedirection
* description       : 	사용자의 접속 기기를 확인하여 모바일과 pc페이지로 리디렉션시켜줌
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function userDeviceToRedirection() {
    // console.log("현재 URL: " + window.location.pathname);
    let currentPath = window.location.pathname;
    let queryString = window.location.search;
    if (mobileCheck) {    //모바일
        if (!currentPath.startsWith('/mobile')) {
            window.location.href = window.location.origin + '/mobile' + currentPath + queryString;
        }
    } else {
        if (currentPath.startsWith('/mobile')) {
            window.location.href = window.location.origin + currentPath.replace('/mobile', '') + queryString;
        }
    }
}
userDeviceToRedirection()


/* **********************************************************************************************************************
* variable name		:	scHeaderCreate
* description       : 	사용자의 접속 기기를 확인하여 모바일과 pc페이지로 리디렉션시켜줌
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function scHeaderCreate() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('headerCharacterName');
    if (nameParam) {
        let nameListStorage = JSON.parse(localStorage.getItem("nameList")) || []
        // localStorage.removeItem("userBookmark");                                 //로컬스토리지 비우기
        if (nameListStorage.includes(nameParam) || nameListStorage.includes(null)) {
            //로컬스토리지 저장
            nameListStorage = nameListStorage.filter(item => item !== nameParam && item !== null)
            nameListStorage.push(nameParam)
            localStorage.setItem('nameList', JSON.stringify(nameListStorage));
        } else {
            if (nameListStorage.length >= 5) {
                nameListStorage.shift();
            }
            nameListStorage.push(nameParam);
            localStorage.setItem('nameList', JSON.stringify(nameListStorage));
        }
    }
    function headerElement() {
        if (mobileCheck) {    //모바일
            return `
                <header>
                    <div class="sc-header">
                        <div class="logo-group">
                            <h1 class="logo">
                                <span class="blind">로스트아크 전투정보실 전투력계산 스펙포인트</span>
                                <a href="/mobile/" class="link-site"></a>
                            </h1>
                        </div>
                        <div class="group-search">
                            <span class="recent-close"><span class="blind">검색화면 나가기 버튼</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m12.718 4.707-1.413-1.415L2.585 12l8.72 8.707 1.413-1.415L6.417 13H20v-2H6.416l6.302-6.293z"/></svg></span>
                            <form action="/mobile/search/search.php" class="search-area search-page on">
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
                        <a href="https://cool-kiss-ec2.notion.site/LOPEC-CREDIT-1cc758f0e8da80a18f49f93dafb886f3" target="_blink" class="link-item">credit</a>
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
            </header>`;
        } else {              //데스크탑
            return `
            <header>
                <section class="sc-header">
                    <div class="logo-group">
                        <h1 class="logo">
                            <span class="blind">로스트아크 전투정보실 전투력계산 스펙포인트</span>
                            <a href="/" class="link-site"></a>
                        </h1>
                    </div>
                    <div class="group-search">
                        <form action="/search/search.php" class="search-area search-page on">
                            <input id="headerInput" autocomplete="off" name="headerCharacterName" class="header-input character-name-search" type="text" value="" placeholder="캐릭터 검색">
                            <button class="search-btn"></button>
                        </form>
                        <div class="dark-area" style="display:flex;align-items:center;">
                
                            <div  class="button b2 dark-mode-button" id="button-17">
                                <input type="checkbox" class="checkbox" />
                                <div class="knobs">
                                    <span></span>
                                </div>
                                <div class="layer"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>`;
        }
    }
    document.body.insertAdjacentHTML('afterbegin', headerElement());

    if (mobileCheck) {
        // 사이드메뉴 토글
        document.querySelector(".side-btn").addEventListener("click", function () {
            this.classList.toggle("on");

            if (this.classList.contains("on")) {
                document.documentElement.style.overflow = "hidden";
            } else {
                document.documentElement.style.overflow = "";
            }

            document.querySelector("header .sc-sidemenu").classList.toggle("on")
            document.querySelector("header .side-blur").classList.toggle("on")
        })
        document.querySelector(".side-blur").addEventListener("click", function () {
            document.documentElement.style.overflow = "";
            document.querySelector(".side-btn").classList.remove("on")
            document.querySelector("header .sc-sidemenu").classList.remove("on")
            document.querySelector("header .side-blur").classList.remove("on")
        })
    }

    // 헤더 좌우스크롤 에 맞게 위치조정
    window.addEventListener("scroll", function () {
        document.querySelector("header").style.left = "-" + window.scrollX + "px"
    })
}
scHeaderCreate()


// <input id="toggle" class="dark-mode-button" type="checkbox" alt="다크모드 전환" title="다크모드 전환하기" checked="">

/* **********************************************************************************************************************
* variable name		:	darkModeSetting
* description       : 	다크모드 활성화 비활성화를 관리함
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function darkModeSetting() {
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

}
darkModeSetting()

/* **********************************************************************************************************************
* variable name		:	recentBookmark()
* description       : 	최근 검색목록과 즐겨찾기를 생성
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
// 최근검색및 즐겨찾기
function recentBookmark() {

    let nameListStorage = JSON.parse(localStorage.getItem("nameList")) || []            //로컬스토리지 최근 검색어
    let userBookmarkStorage = JSON.parse(localStorage.getItem("userBookmark")) || []    //로컬스토리지 즐겨찾기 목록
    nameListStorage = nameListStorage.reverse()                                         //최신순으로 정렬
    userBookmarkStorage = userBookmarkStorage.reverse()                                 //최신순으로 정렬

    let recentNameBox = ""
    let bookmarkNameBox = ""
    let mobilePath = "";
    if (mobileCheck) {
        mobilePath = "/mobile"
    }
    nameListStorage.forEach(function (recentNameArry) {                                       //최근검색HTML목록

        recentNameBox += `
            <div class="name-box" data-sort="recent">
                <a href="${mobilePath}/search/search.php?headerCharacterName=${recentNameArry}" class="name">${recentNameArry}</a>
                <em class="del remove"></em>
            </div>`;
    })

    userBookmarkStorage.forEach(function (bookmarkArry) {

        bookmarkNameBox += `
        <div class="name-box" data-sort="bookmark">
            <a href="${mobilePath}/search/search.php?headerCharacterName=${bookmarkArry}" class="name">${bookmarkArry}</a>
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

        let recentHtml = document.querySelector(".group-recent")
        if (mobileCheck) {
            // 모바일 검색화면 뒤로가기 버튼 & 스크롤 금지
            document.querySelector(".group-search").classList.add("on");
            document.documentElement.style.overflow = 'hidden';
        } else {
            recentHtml.style.top = topPos + 55 + "px";
            recentHtml.style.left = leftPos + "px";

        }

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

/* **********************************************************************************************************************
* variable name		:	inputBlur
* description       : 	input요소에서 포커스가 제거될 시 최근검색 및 즐겨찾기 제거
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function inputBlur() {
    let recentHTML = document.querySelector(".group-recent")
    let input = document.querySelector("input")

    setTimeout(function () {
        if (!input.contains(document.activeElement) && !recentHTML.contains(document.activeElement)) {
            if (mobileCheck) {
                document.querySelector(".group-search").classList.remove("on")
                document.documentElement.style.overflow = '';
            }
            recentHTML.remove()
            recentFlag = 0;
        }
    }, 0)
}
// input포커스
document.querySelectorAll("input[type='text']").forEach(function (element) {
    element.addEventListener("click", userInputMemoHtml(element))
})

// input포커스해제
document.querySelectorAll("input[type='text']").forEach(function (inputArry) {
    inputArry.addEventListener("blur", inputBlur)
})


/* **********************************************************************************************************************
* variable name		:	scFooterCreate
* description       : 	footer요소를 생성함
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function scFooterCreate() {
    let footerElement = "";
    if (mobileCheck) {
        footerElement = `<footer class="sc-footer"><span>Copyright 2024 lopec.kr All rights reserved.</span></footer>`
    } else {
        footerElement = `
        <footer>
            <section class=".sc-footer">
                <div class="group-link">
                    <a href="https://open.kakao.com/o/smvJ4DQg" class="link" target="_blink">1:1문의</a>
                    <a href="https://cool-kiss-ec2.notion.site/120758f0e8da80889d2fe738c694a7a1" target="_blink" class="link">후원안내</a>
                    <a href="https://discord.gg/5B8SjX4ug4" class="link" target="_blink">디스코드</a>
                    <a href="https://cool-kiss-ec2.notion.site/LOPEC-CREDIT-1cc758f0e8da80a18f49f93dafb886f3" target="_blink" class="link">credit</a>
                </div>
                <span>Copyright 2024 lopec.kr All rights reserved.</span>
            </section>
        </footer>`;
    }
    document.body.insertAdjacentHTML('beforeend', footerElement);
}
scFooterCreate()

/* **********************************************************************************************************************
* variable name		:	footerPositionFnc()
* description       : 	푸터 하단 고정 스크립트(앵커광고 삽입시 레이아웃 깨짐 대책)
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function footerPositionFnc() {
    let footer = document.querySelector("footer")
    footer.style.display = "block"
    footer.style.top = (document.body.offsetHeight - footer.offsetHeight) + "px";
    footer.style.width = window.offsetWidth + "px"
}
footerPositionFnc()

/* **********************************************************************************************************************
* variable name		:	windowChangeDetect
* description       : 	변화를 감지하여 dom을 올바르게 수정함
* useDevice         : 	모두 사용
*********************************************************************************************************************** */
function windowChangeDetect() {
    let resizeObserver = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.target === document.body) {
                footerPositionFnc();
            }
        });
    });
    resizeObserver.observe(document.body);
    // window.addEventListener("resize", footerPositionFnc); //필요없다고 판단될시 추후 제거

    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                footerPositionFnc();
            }
        });
    });
    let config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);
}
windowChangeDetect()



// 헤더푸터 너비조정

/* **********************************************************************************************************************
* variable name		:	widthSetFnc
* description       : 	헤더푸터 너비조정
* useDevice         : 	데스크탑
*********************************************************************************************************************** */
function widthSetFnc() {
    document.querySelector("header").style.width = document.querySelector("body").offsetWidth + "px"
    document.querySelector("footer").style.width = document.querySelector("body").offsetWidth + "px"
}
if (mobileCheck) {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.addEventListener("load", function () {
        window.scrollTo(0, 0);
    });
} else {
    widthSetFnc()
    window.addEventListener("resize", widthSetFnc)
}
/* **********************************************************************************************************************
* variable name		:	simpleLogSave()
* description       : 	단순 로그 저장함수
* useDevice         : 	모두 사용
*********************************************************************************************************************** */

async function simpleLogSave() {
    await import('https://code.jquery.com/jquery-3.7.1.min.js');
    $(document).ready(function () {
        insertLopecLog();
    });

    var insertLopecLog = function () {
        var atMode = "insertlog";
        var llogUrl = document.URL;
        var saveDatas = {
            atMode: atMode,
            llogUrl: llogUrl
        }
        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/applications/process/lopecLog/",
            data: saveDatas,
            success: function (msg) {
                // console.log("msg : " + msg);
                // console.log("msg.result : " + msg.result);
                if (msg.result == "S") {
                    // console.log("log insert result : LOPEC_LOG 저장 성공");
                } else if (msg.result == "F") {
                    // console.log("log insert result : LOPEC_LOG 저장 실패");
                } else if (msg.result == "E") {
                    // console.log("log insert result : LOPEC_LOG 저장 Exception");
                }
            },
            error: function (request, status, error) {
                // console.log("log insert result : LOPEC_LOG 저장 Error");
                // console.log("request.status : " + request.status);
                // console.log("request.responseText : " + request.responseText);
                // console.log("request.error : " + request.error);
            }
        });
    }

}
if (/lopec.kr/.test(window.location.host)) {
    simpleLogSave()
} else {
    await import('https://code.jquery.com/jquery-3.7.1.min.js');
}

