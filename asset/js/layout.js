// document.addEventListener("DOMContentLoaded", function () {
//     const baseURL = window.location.origin + '/layout/';
    
//     fetch(baseURL + 'header.html')
//         .then(response => response.text())
//         .then(data => document.querySelector('.sc-header').innerHTML = data);

//     fetch(baseURL + 'footer.html')
//         .then(response => response.text())
//         .then(data => document.querySelector('.sc-footer').innerHTML = data);
// });



document.querySelector('.sc-header').innerHTML = `
<div class="logo-group">
    <h1 class="logo">
        <span class="blind">로스트아크 전투정보실 전투력계산 스펙포인트</span>
        <a href="https://lopec.kr/" class="link-site"></a>

    </h1>
    <div class="link-box">
        <a href="https://cool-kiss-ec2.notion.site/10a758f0e8da809ead94d78f142f671d" target="_blink" class="link-alert">공지사항</a>
        <a href="https://cool-kiss-ec2.notion.site/10b758f0e8da802ca4bdccf9a3c5edec" target="_blink" class="link-alert">업데이트</a>
        <a href="https://cool-kiss-ec2.notion.site/120758f0e8da80889d2fe738c694a7a1" target="_blink" class="link-alert">후원하기</a>
        <a href="https://cool-kiss-ec2.notion.site/12a758f0e8da807a936ae883e773f646" target="_blink" class="link-alert">문의/제보</a>
    </div>

</div>
<form action="./search.html" class="group-search search-page">
    <input id="header-input" name="header-character-name" class="header-input character-name-search" type="text" value="" placeholder="캐릭터 검색">
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



// 푸터
document.querySelector('.sc-footer').innerHTML = `<span>© 2024 lopec.kr / lopec.kr isn’t endorsed by Smilegate RPG and doesn’t reflect the views or opinions of Smilegate RPG or anyone officially involved in producing or managing Lostark. Lostark and Smilegate RPG are trademarks or registered trademarks of Smilegate RPG, Inc. Lostark © Smilegate RPG, Inc.</span>`;

// 푸터 하단 고정 스크립트(앵커광고 삽입시 레이아웃 깨짐 대책)
function footerPostionFnc(){
    let footer = document.querySelector(".sc-footer")
    footer.style.display = "block"
    footer.style.top = (document.body.offsetHeight - footer.offsetHeight) + "px";
}

footerPostionFnc()
window.addEventListener("resize",footerPostionFnc)
