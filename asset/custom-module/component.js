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
    return `
    <section class="sc-profile">
        <div class="group-img">
            <img src="${imageSrc}" alt="">
        </div>
        <div class="group-profile">
            <div class="name-area">
                <span class="name">LV.${level} ${name} <i class="job">#${jobName}</i></span>
            </div>
            <div class="info-area">
                <div class="info-box">
                    <span class="name">서버 : ${serverName}</span>
                    <span class="name">레벨 : ${totalLevel}</span>
                </div>
                <div class="info-box">
                    <span class="name">직업랭킹 : ${jobRank}</span>
                    <span class="name">전체랭킹 : ${totalRank}</span>
                </div>
            </div>
        </div>
    </section>`;
}


/* **********************************************************************************************************************
* function name		:	scNav
* description       : 	메인, 원정대, 시뮬레이터로 이동할 수 있는 네비게이션
*********************************************************************************************************************** */
export function scNav(userName) {
    let name = "";
    if (userName) {
        name = userName;
    }
    const urlParams = window.location.pathname;
    let simulatorClassName = "";
    let searchClassName = "";
    let nowPage = "";
    if(urlParams.includes("simulator")){
        simulatorClassName = "on";
        nowPage = "simulator";
    }else if(urlParams.includes("search")){
        searchClassName = "on";
        nowPage = "search";
    }
    function scNavEvent() {
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

