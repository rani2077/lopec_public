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

/* **********************************************************************************************************************
* variable name		:	scLopecClickCreate
* description       : 	sc-lopec-click를 생성하고 드래그 가능하게 하며, 위치를 저장/동기화하는 함수 (on 클래스 시 드래그 방지, 클릭/드래그 구분)
* useDevice         : 	데스크탑
*********************************************************************************************************************** */
async function scLopecClickCreate() {
    const clickElementHtml = `
        <section class="sc-lopec-click" title="드래그 하여 옮길 수 있습니다.">
            <div class="blob blob1"></div>
            <div class="blob blob2"></div>
            <div class="blob blob3"></div>
            <div class="group-category">
                <span class="category">로펙딸깍</span>
            </div>
            <div class="group-simple">
                <div class="search-area">
                    <input type="text no-recent" placeholder="/ 검색 . 자동검색">
                    <span class="search btn">검색</span>
                    <span class="auto btn">딸깍</span>
                </div>
                <div class="result-area scrollbar">
                    <div class="result-item">
                        <span class="name result">닉네임</span>
                        <span class="job result">직업</span>
                        <span class="point result">점수</span>
                        <span class="change result">딜러환산</span>
                    </div>
                </div>
            </div>
            <div class="group-auto"></div>
            <span class="hint">아이콘을 드래그로 옮길 수 있습니다</span>
        </section>`;

    if (mobileCheck) {
        return;
    }

    document.body.insertAdjacentHTML('beforeend', clickElementHtml);

    const lopecClickElement = document.querySelector(".sc-lopec-click");
    const storageKey = 'lopecClickPosition';

    if (!lopecClickElement) {
        console.error(".sc-lopec-click 요소를 찾을 수 없습니다.");
        return;
    }

    // --- 위치 관련 함수 (loadPosition, applyPosition, savePosition) ---
    function loadPosition() {
        const savedPosition = localStorage.getItem(storageKey);
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                applyPosition(pos);
            } catch (e) {
                console.error("저장된 위치 데이터 파싱 오류:", e);
                localStorage.removeItem(storageKey);
            }
        }
    }

    function applyPosition(pos) {
        if (!pos) return;
        lopecClickElement.style.transform = '';
        lopecClickElement.style.left = pos.left ?? 'auto';
        lopecClickElement.style.top = pos.top ?? 'auto';
        lopecClickElement.style.right = pos.right ?? 'auto';
        lopecClickElement.style.bottom = pos.bottom ?? 'auto';
    }

    function savePosition(pos) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(pos));
        } catch (e) {
            console.error("localStorage 저장 오류:", e);
        }
    }

    // --- 드래그 및 클릭/드래그 구분 관련 변수 ---
    let isDragging = false;       // 실제 드래그 중인지 여부
    let potentialDrag = false;    // 드래그 시작 가능성이 있는지 여부
    let wasDragging = false;      // 직전에 드래그가 있었는지 여부 (클릭 이벤트 방지용)
    let startX = 0;               // mousedown 시 X 좌표
    let startY = 0;               // mousedown 시 Y 좌표
    let offsetX = 0;              // 드래그 시작 시 요소 내부 X 오프셋
    let offsetY = 0;              // 드래그 시작 시 요소 내부 Y 오프셋
    const dragThreshold = 5;      // 드래그로 간주할 최소 이동 거리 (px)

    // --- 드래그 시작 (mousedown) ---
    lopecClickElement.addEventListener("mousedown", (e) => {
        // 1. 'on' 클래스가 있으면 드래그 시작 안 함
        if (lopecClickElement.classList.contains('on')) {
            console.log("'.on' 클래스가 있어 드래그를 시작하지 않습니다.");
            return;
        }

        // 2. 특정 자식 요소 클릭 시 드래그 시작 방지
        if (e.target.closest('input, button, .btn, a')) {
            return;
        }

        // 3. 드래그 시작 가능성 설정 및 시작 좌표 기록
        potentialDrag = true;
        isDragging = false; // 아직 실제 드래그는 아님
        wasDragging = false; // 드래그 상태 초기화
        startX = e.clientX;
        startY = e.clientY;

        // 4. mousemove, mouseup 리스너 등록 (드래그 감지 및 종료 처리용)
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        // 5. 기본 커서 설정 (아직 grabbing 아님)
        lopecClickElement.style.cursor = 'grab';
    });

    // --- 드래그 중 (mousemove) ---
    function handleMouseMove(e) {
        // 드래그 시작 가능성이 없으면 아무것도 안 함
        if (!potentialDrag && !isDragging) return;

        // 드래그 시작 가능성이 있다면, 임계값 이상 움직였는지 확인
        if (potentialDrag) {
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);

            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                // 임계값 이상 움직였으면 실제 드래그 시작
                isDragging = true;
                potentialDrag = false; // 시작 가능성 해제
                wasDragging = true; // 드래그 발생 기록

                // 드래그 스타일 적용
                lopecClickElement.style.cursor = 'grabbing';
                lopecClickElement.style.userSelect = 'none';

                // 현재 위치 기준으로 오프셋 계산 (드래그 시작 시점)
                const rect = lopecClickElement.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                console.log("드래그 시작됨");
            }
        }

        // 실제 드래그 중일 때만 요소 이동
        if (isDragging) {
            const elementRect = lopecClickElement.getBoundingClientRect();
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            const constrainedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - elementRect.width));
            const constrainedTop = Math.max(0, Math.min(newTop, window.innerHeight - elementRect.height));

            const centerX = constrainedLeft + elementRect.width / 2;
            const centerY = constrainedTop + elementRect.height / 2;

            const newPosition = { left: 'auto', top: 'auto', right: 'auto', bottom: 'auto' };

            if (centerX > window.innerWidth / 2) {
                newPosition.right = `${window.innerWidth - (constrainedLeft + elementRect.width)}px`;
            } else {
                newPosition.left = `${constrainedLeft}px`;
            }

            if (centerY > window.innerHeight / 2) {
                newPosition.bottom = `${window.innerHeight - (constrainedTop + elementRect.height)}px`;
            } else {
                newPosition.top = `${constrainedTop}px`;
            }

            applyPosition(newPosition);
        }
    }

    // --- 드래그 종료 (mouseup) ---
    function handleMouseUp(e) {
        // 드래그 시작 가능성이나 실제 드래그 중이 아니었으면 무시
        if (!potentialDrag && !isDragging) return;

        if (isDragging) {
            console.log("드래그 종료됨, 위치 저장");
            // 실제 드래그가 발생했을 경우에만 최종 위치 계산 및 저장
            const finalRect = lopecClickElement.getBoundingClientRect();
            const finalLeft = finalRect.left;
            const finalTop = finalRect.top;
            const finalCenterX = finalLeft + finalRect.width / 2;
            const finalCenterY = finalTop + finalRect.height / 2;

            const finalPosition = { left: 'auto', top: 'auto', right: 'auto', bottom: 'auto' };

            if (finalCenterX > window.innerWidth / 2) {
                finalPosition.right = `${window.innerWidth - (finalLeft + finalRect.width)}px`;
            } else {
                finalPosition.left = `${finalLeft}px`;
            }

            if (finalCenterY > window.innerHeight / 2) {
                finalPosition.bottom = `${window.innerHeight - (finalTop + finalRect.height)}px`;
            } else {
                finalPosition.top = `${finalTop}px`;
            }

            savePosition(finalPosition);
        } else {
            // isDragging이 false이면 단순 클릭으로 간주 (별도 처리 없음, click 이벤트가 처리)
            console.log("단순 클릭으로 간주됨 (mouseup)");
        }

        // 상태 초기화 및 리스너 제거
        potentialDrag = false;
        isDragging = false;
        // wasDragging은 click 핸들러에서 초기화

        lopecClickElement.style.cursor = 'grab';
        lopecClickElement.style.removeProperty('user-select');

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    // --- 외부 클릭 시 'on' 클래스 제거 / 내부 클릭 시 'on' 클래스 추가 로직 ---
    window.addEventListener("click", (e) => {
        // 직전에 드래그가 있었다면 클릭 이벤트 무시
        if (wasDragging) {
            wasDragging = false; // 플래그 초기화
            console.log("드래그 후 클릭 이벤트 무시됨");
            return;
        }

        // '.on' 클래스가 없고, 클릭된 요소가 lopecClickElement 내부에 있다면 'on' 추가
        if (!lopecClickElement.classList.contains('on') && lopecClickElement.contains(e.target)) {
            lopecClickElement.classList.add("on");
            console.log("내부 클릭: 'on' 클래스 추가");
        }
        // 클릭된 요소가 lopecClickElement 외부에 있다면 'on' 제거
        else if (!lopecClickElement.contains(e.target)) {
            lopecClickElement.classList.remove("on");
            console.log("외부 클릭: 'on' 클래스 제거");
        }
        // (내부 클릭인데 이미 'on'이 있는 경우는 아무것도 안 함)
    });

    // --- 탭 간 동기화 (storage 이벤트) ---
    window.addEventListener('storage', (e) => {
        if (e.key === storageKey) {
            console.log("Storage event detected for", storageKey);
            if (e.newValue) {
                try {
                    const newPos = JSON.parse(e.newValue);
                    applyPosition(newPos);
                } catch (err) {
                    console.error("Error parsing storage event data:", err);
                }
            } else {
                console.log("Position data removed from localStorage.");
            }
        }
    });

    // --- 초기화 ---
    loadPosition();
    lopecClickElement.style.position = 'fixed';
    lopecClickElement.style.cursor = 'grab';
}

// 함수 실행
scLopecClickCreate();
