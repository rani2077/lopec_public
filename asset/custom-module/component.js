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
export function scNav() {
    return `
    <nav class="sc-nav">
        <a href="" class="link on">메인</a>
        <a href="" class="link">원정대</a>
        <a href="" class="link">시뮬레이터</a>
    </nav>`
}
