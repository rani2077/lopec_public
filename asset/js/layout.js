// document.addEventListener("DOMContentLoaded", function () {
//     const baseURL = window.location.origin + '/layout/';
    
//     fetch(baseURL + 'header.html')
//         .then(response => response.text())
//         .then(data => document.querySelector('.sc-header').innerHTML = data);

//     fetch(baseURL + 'footer.html')
//         .then(response => response.text())
//         .then(data => document.querySelector('.sc-footer').innerHTML = data);
// });



// 헤더
document.querySelector('.sc-header').innerHTML = `
<div class="logo-group">
    <h1 class="logo">
        <span class="blind">로스트아크 전투정보실 전투력계산 스펙포인트</span>
        <a href="https://lopec.kr/" class="link-site"></a>

    </h1>
    <div class="link-box">
        <a href="https://cool-kiss-ec2.notion.site/10a758f0e8da809ead94d78f142f671d" target="_blink" class="link-alert">공지사항</a>
        <a href="https://cool-kiss-ec2.notion.site/v1-0-137758f0e8da80bc95c7da1ffc0f3e34" target="_blink" class="link-alert">로펙체커</a>
        <a href="https://cool-kiss-ec2.notion.site/120758f0e8da80889d2fe738c694a7a1" target="_blink" class="link-alert">후원/배너</a>
        <a href="https://cool-kiss-ec2.notion.site/12a758f0e8da807a936ae883e773f646" target="_blink" class="link-alert">문의/제보</a>
    </div>

</div>
<form action="./search.php" class="group-search search-page">
    <input id="headerInput" autocomplete="off" name="headerCharacterName" class="header-input character-name-search" type="text" value="" placeholder="캐릭터 검색">
    <button class="search-btn"></button>
</form>
<div class="group-sns">
    <span class="light-dark">다크모드</span>
    <input id="toggle" class="dark-mode-button" type="checkbox" alt="다크모드 전환" title="다크모드 전환하기" checked="">
</div>`;



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

if(localStorage.getItem('darkMode') == 'enabled'){
    document.querySelector(".dark-mode-button").checked = false
}



// 최근검색및 즐겨찾기
function recentBookmark(){

    
    let nameListStorage = JSON.parse(localStorage.getItem("nameList"))  || []           //로컬스토리지 최근 검색어
    let userBookmarkStorage = JSON.parse(localStorage.getItem("userBookmark")) || []    //로컬스토리지 즐겨찾기 목록
    nameListStorage = nameListStorage.reverse()                                         //최신순으로 정렬
    userBookmarkStorage = userBookmarkStorage.reverse()                                 //최신순으로 정렬


    let recentNameBox = ""
    let bookmarkNameBox = ""

    nameListStorage.forEach(function(recentNameArry){                                       //최근검색HTML목록

        recentNameBox += `
            <div class="name-box" data-sort="recent">
                <a href="https://lopec.kr/search/search.php?mainCharacterName=${recentNameArry}" class="name">${recentNameArry}</a>
                <em class="del remove"></em>
            </div>`;
    })

    userBookmarkStorage.forEach(function(bookmarkArry){

        bookmarkNameBox +=`
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


document.querySelectorAll("input[type='text']").forEach(function(inputArry){
    inputArry.addEventListener("click",userInputMemoHtml(inputArry))
})

let recentFlag = 0;
function userInputMemoHtml(inputElement){
    inputElement.addEventListener("focus",function(input){
        let leftPos = input.target.getBoundingClientRect().left;
        let topPos = input.target.getBoundingClientRect().top;
    
        // 브라우저 외부에서 브라우저로 포커스시 좌표 버그 해결 코드
        if(recentFlag == 0){
            document.body.appendChild( 
                document.createRange().createContextualFragment(recentBookmark())
            )    
        }
    
    
        
        let recentHtml = document.querySelector(".group-recent")
        
        recentHtml.style.top = topPos+55+"px";
        recentHtml.style.left = leftPos+"px";
        
        
        // 분류명 클릭
        document.querySelectorAll(".group-recent .name-area .sort").forEach(function(sort){
            sort.addEventListener("click", function(){
                let nowSort = sort.getAttribute("data-sort")
                
    
                document.querySelectorAll(".group-recent .memo").forEach(function(memo){
                    memo.classList.remove("on");
                })
                document.querySelectorAll(".group-recent .name-area .sort").forEach(function(removeSort){
                    removeSort.classList.remove("on");
                })
                
                document.querySelector("."+nowSort+"-area").classList.add("on");
                document.querySelector("."+nowSort).classList.add("on");
    
            })
        })
        
        // 목록제거버튼
    
        let nowUserName = JSON.parse(localStorage.getItem("nameList")).reverse()[0]                  // 현재 검색된 유저명
    
    
        document.querySelectorAll(".group-recent .memo .remove").forEach(function(removeBtn){
    
            removeBtn.addEventListener("click",function(){
                let nowRecentName = removeBtn.parentElement.querySelector(".name").textContent       // 선택한 유저명
                console.log(removeBtn.parentElement.getAttribute("data-sort"))
    
                if(removeBtn.parentElement.getAttribute("data-sort") == "recent"){
    
                    let nameListStorage = JSON.parse(localStorage.getItem("nameList")).reverse()     // 로컬스토리지 최근 검색어
    
    
                    nameListStorage = nameListStorage.filter(item => item !== nowRecentName);
                    localStorage.setItem("nameList",JSON.stringify(nameListStorage.reverse()))
    
                }else if(removeBtn.parentElement.getAttribute("data-sort") == "bookmark"){
    
                    let nameListStorage = JSON.parse(localStorage.getItem("userBookmark")).reverse() // 즐겨찾기 리스트
    
    
                    nameListStorage = nameListStorage.filter(item => item !== nowRecentName);
                    localStorage.setItem("userBookmark",JSON.stringify(nameListStorage.reverse()))
                    
                    if(document.querySelector(".star.full") && nowRecentName == nowUserName){
                        
                        document.querySelector(".star.full").classList.remove("full");
                    }
                }
                
                removeBtn.parentElement.remove()
            })
        })
        
    
    
        //.group-recent포커스해제
        recentHtml.addEventListener("blur",inputBlur)
        recentFlag = 1;
    })
    
}

// input포커스해제
document.querySelectorAll("input[type='text']").forEach(function(inputArry){
    inputArry.addEventListener("blur",inputBlur)
})



function inputBlur(){
    let recentHTML = document.querySelector(".group-recent")
    let input = document.querySelector("input")

    // console.log("input포커스 : "+!input.contains(document.activeElement))
    // console.log("검색기록 포커스 : "+!recentHTML.contains(document.activeElement))
    setTimeout(function(){
        if( !input.contains(document.activeElement) &&  !recentHTML.contains(document.activeElement) ){
            recentHTML.remove()
            recentFlag = 0;
        }
    },0)
}



// 푸터
document.querySelector('.sc-footer').innerHTML = `<span>© 2024 lopec.kr / lopec.kr isn’t endorsed by Smilegate RPG and doesn’t reflect the views or opinions of Smilegate RPG or anyone officially involved in producing or managing Lostark. Lostark and Smilegate RPG are trademarks or registered trademarks of Smilegate RPG, Inc. Lostark © Smilegate RPG, Inc.</span>`;

// 푸터 하단 고정 스크립트(앵커광고 삽입시 레이아웃 깨짐 대책)
function footerPostionFnc(){
    let footer = document.querySelector(".sc-footer")
    footer.style.display = "block"
    footer.style.top = (document.body.offsetHeight - footer.offsetHeight) + "px";
    footer.style.width = window.offsetWidth+"px"
}

footerPostionFnc()
window.addEventListener("resize",footerPostionFnc)