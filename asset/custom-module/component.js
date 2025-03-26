/* **********************************************************************************************************************
* function name		:	scProfileSkeleton
* description       : 	유저 프로필 정보 스켈레톤 화면
*********************************************************************************************************************** */
export async function scProfileSkeleton() {
    return `
        <section class="sc-profile">
            <div class="group-img skeleton">
                <img src="/asset/image/skeleton-img.png" alt="">
            </div>
            <div class="group-profile">
                <div class="name-area">
                    <span class="name skeleton-text">LV.N NNN <i class="job">#NNN</i></span>
                    <button class="favorite-button">
                        <div class="icon">
                            <div class="star"></div>
                        </div>
                    </button>
                </div>
                <div class="info-area">
                    <div class="info-box">
                        <span class="name skeleton-text">서버 : NNN</span>
                        <span class="name skeleton-text">레벨 : NNN</span>
                    </div>
                    <div class="info-box">
                        <span class="name skeleton-text">직업랭킹 : NNN</span>
                        <span class="name skeleton-text">전체랭킹 : NNN</span>
                    </div>
                </div>
            </div>
        </section>`;
}
/* **********************************************************************************************************************
* function name		:	scProfile
* description       : 	유저 프로필 정보
*********************************************************************************************************************** */
export async function scProfile(imageSrc, jobName, serverName, level, name, totalLevel, jobRank, totalRank) {
    setTimeout(() => {
        starAnimation();
        userBookmarkSave(name);
    }, 0)
    let jobRankVariable = "-수집중"
    let totalRankVariable = "-수집중"
    if (jobRank && totalRank) {
        jobRankVariable = jobRank
        totalRankVariable = totalRank
    }
    return `
    <section class="sc-profile">
        <div class="group-img">
            <img src="${imageSrc}" alt="">
        </div>
        <div class="group-profile">
            <div class="name-area">
                <span class="name">LV.${level} ${name} <i class="job">#${jobName}</i></span>
                <button class="favorite-button">
                    <div class="icon">
                        <div class="star"></div>
                    </div>
                </button>
            </div>
            <div class="info-area">
                <div class="info-box">
                    <span class="name">서버 : ${serverName}</span>
                    <span class="name">레벨 : ${totalLevel}</span>
                </div>
                <div class="info-box">
                    <span class="name">직업랭킹 : ${jobRankVariable}</span>
                    <span class="name">전체랭킹 : ${totalRankVariable}</span>
                </div>
            </div>
        </div>
    </section>`;
}

/* **********************************************************************************************************************
* function name		:	starAnimation()
* description       : 	북마크 별 아이콘 애니메이션
*********************************************************************************************************************** */
function starAnimation() {
    document.querySelectorAll('.sc-profile .favorite-button').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();

            if (button.classList.contains('animated')) {
                return;
            }
            button.classList.add('animated');

            const starY = { value: -20 };
            const starScale = { value: 1 };
            const buttonY = { value: 0 };
            const starFaceScale = { value: 1 };
            const starHoleScale = { value: 1 };
            const starRotate = { value: 0 };

            // 애니메이션 1 (위로 튀어오르기 + 빠른 회전)
            animate(starY, -36, 300, 'easeOutPower2', () => {
                button.classList.add('star-round');
                animate(starY, 48, 350, 'easeOutPower2', () => {
                    setTimeout(() => button.classList.remove('star-round'), 100);
                    // starScale.value = 0.4;
                    animate(starY, -64, 450, 'easeOutPower2', () => {
                        button.classList.toggle('active');
                        starScale.value = 1;
                        animate(starY, 0, 450, 'easeInPower2', () => {
                            animate(buttonY, 3, 210, '', () => {
                                starFaceScale.value = 0.65;
                                animate(buttonY, 0, 225, '', () => {
                                    starFaceScale.value = 1;
                                    // 회전 애니메이션을 여기에서 제거하고 별이 튀어오를 때 함께 실행
                                    button.classList.remove('animated');
                                    button.style.setProperty('--star-y', '0px');
                                    button.style.setProperty('--star-scale', '1');
                                    button.style.setProperty('--button-y', '0px');
                                    button.style.setProperty('--star-face-scale', '1');
                                    button.style.setProperty('--star-rotate', '0deg');
                                });
                            });
                        });
                    });
                });
            });

            // 회전 애니메이션을 별이 튀어오를 때 함께 실행 (속도 증가)
            animate(starRotate, 360, 1400, ''); // duration 값을 700으로 줄임

            // 애니메이션 2 (별 구멍 확장)
            animate(starHoleScale, 0.8, 500, 'easeOutElastic', () => {
                setTimeout(() => {
                    animate(starHoleScale, 0, 200, '');
                }, 200);
            });

            // 애니메이션 함수 (간단한 선형 애니메이션)
            function animate(target, to, duration, ease, onComplete) {
                const start = target.value;
                const startTime = performance.now();

                function update() {
                    const currentTime = performance.now();
                    const elapsed = currentTime - startTime;
                    let progress = elapsed / duration;

                    if (progress > 1) progress = 1;

                    if (ease === 'easeOutPower2') {
                        progress = 1 - (1 - progress) * (1 - progress);
                    } else if (ease === 'easeInPower2') {
                        progress = progress * progress;
                    } else if (ease === 'easeOutElastic') {
                        const p = 0.3;
                        const s = p / 4;
                        progress = 1 + Math.pow(2, -10 * progress) * Math.sin((progress - s) * (2 * Math.PI) / p);
                    }

                    target.value = start + (to - start) * progress;

                    button.style.setProperty('--star-y', starY.value + 'px');
                    button.style.setProperty('--star-scale', starScale.value);
                    button.style.setProperty('--button-y', buttonY.value + 'px');
                    button.style.setProperty('--star-face-scale', starFaceScale.value);
                    button.style.setProperty('--star-hole-scale', starHoleScale.value);
                    button.style.setProperty('--star-rotate', starRotate.value + 'deg');

                    if (elapsed < duration) {
                        requestAnimationFrame(update);
                    } else if (onComplete) {
                        onComplete();
                    }
                }

                requestAnimationFrame(update);
            }
        });
    });
}

/* **********************************************************************************************************************
* function name		:	userBookmarkSave
* description       : 	즐겨찾기 저장
*********************************************************************************************************************** */
function userBookmarkSave(userName) {
    let element = document.querySelector(".sc-profile .favorite-button")
    element.addEventListener("click", bookmarkToggle)
    // localStorage.removeItem("userBookmark");                                             //로컬스토리지 비우기
    // localStorage.clear();                                                                //로컬스토리지 전체 제거
    let userBookmarkList = JSON.parse(localStorage.getItem("userBookmark")) || []           //북마크 리스트
    function bookmarkToggle(el) {

        el.target.classList.toggle("full");                                                 //북마크 아이콘 토글  
        if (userBookmarkList.length < 5 && el.target.classList.contains("full")) {
            userBookmarkList.push(userName)                                                 //북마크 추가하기
            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

        } else if (!el.target.classList.contains("full")) {
            userBookmarkList = userBookmarkList.filter(item => item !== userName)
            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

        } else if (userBookmarkList.length >= 5) {
            el.target.classList.remove("full");                                             //북마크 아이콘 토글  
            alert("즐겨찾기는 5개까지 저장됩니다.")
        }
    }
    if (userBookmarkList.includes(userName)) {
        element.classList.add("active");
    } else {
        element.classList.remove("active");
    }


    // userBookmarkList.includes(userName) ? document.querySelector(".sc-profile .favorite-button").classList.add("active") : document.querySelector(".sc-profile .favorite-button").classList.remove("active")
}

/* **********************************************************************************************************************
* function name		:	scNav
* description       : 	메인, 원정대, 시뮬레이터로 이동할 수 있는 네비게이션
*********************************************************************************************************************** */
export async function scNav(userName) {
    let name = "";
    if (userName) {
        name = userName;
    }
    const urlParams = window.location.pathname;
    let simulatorClassName = "";
    let searchClassName = "";
    let nowPage = "";
    if (urlParams.includes("simulator")) {
        simulatorClassName = "on";
        nowPage = "simulator";
    } else if (urlParams.includes("search")) {
        searchClassName = "on";
        nowPage = "search";
    }
    function scNavEvent() {
        document.querySelector(".sc-nav").insertAdjacentHTML('afterend', scExpeditionSkeleton());
        let expeditionFlag = null;
        // if(!expeditionFlag){
        //     expeditionFlag = true;
        //     let expeditionElement = document.querySelector(".sc-expedition");
        //     expeditionElement.outerHTML = scExpedition(inputName);
        // }
        let elements = document.querySelectorAll(`.sc-nav .link.${nowPage}, .sc-nav .link.expedition`);
        elements.forEach((element, idx) => {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                elements.forEach(sibling => {
                    sibling.classList.remove("on");
                });
                element.classList.add("on");
                let scInfo = document.querySelector(".sc-info");
                let scExpedition = document.querySelector(".sc-expedition");

                let page = element.getAttribute("data-page");
                scInfo.style.display = "none";
                scExpedition.style.display = "none";
                document.querySelector(`.${page}`).style.display = "flex";
            })
        })
    }
    setTimeout(() => { scNavEvent() }, 0)
    return `
    <nav class="sc-nav">
        <a href="/search/search.php?Name=${name}" class="link ${searchClassName} search" data-page="sc-info" >메인</a>
        <a href="" class="link expedition" data-page="sc-expedition">원정대</a>
        <a href="/simulator/simulator.html?Name=${name}" class="link simulator ${simulatorClassName}" data-page="sc-info">시뮬레이터</a>
    </nav>`
}

/* **********************************************************************************************************************
* function name		:	scExpedition
* description       : 	원정대 컴포넌트
*********************************************************************************************************************** */
function scExpeditionSkeleton() {
    return `
        <section class="sc-expedition">
            <div class="group-server shadow">
                <div class="server-area">
                    <span class="server-name">아브렐슈드</span>
                </div>
                <div class="expedition-area">
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="character-level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="armor-level">1100.00</span>
                            <span class="spec-point">2200.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>`;
}
/* **********************************************************************************************************************
* function name		:	scExpedition
* description       : 	원정대 컴포넌트
*********************************************************************************************************************** */
function scExpedition(inputName) {
    return `
        <section class="sc-expedition">
            <div class="group-server shadow">
                <div class="server-area">
                    <span class="server-name">ajdkflae;jifla</span>
                </div>
                <div class="expedition-area">
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="character-level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="armor-level">1100.00</span>
                            <span class="spec-point">2200.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>
                    <a href="" class="expedition-list">
                        <img src="https://cdn.korlark.com/lostark/avatars/striker.png" alt="">
                        <div class="info-box">
                            <span class="level">Lv.70 스트라이커</span>
                            <span class="name">청염각</span>
                            <span class="spec">1100.00</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>`;
}
