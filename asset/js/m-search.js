// spec-point.js html코드
import { getCharacterProfile, searchHtml } from './spec-point.js'




// .character-name-search클래스명의 input 엔터 검색 스크립트

// 검색 스크립트

document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);

    // input name 변경 필요함

    const paramNames = ['mainCharacterName', 'headerCharacterName', 'mobileCharacterName'];
    let inputText = '';
    let inputFlag = 1;

    paramNames.forEach(function (param) {
        let value = urlParams.get(param);
        if (value) {
            inputText = value;

            // 검색기록

            let nameListStorage = JSON.parse(localStorage.getItem("nameList")) || []
            // localStorage.removeItem("userBookmark");    //로컬스토리지 비우기

            if (nameListStorage.includes(inputText)) {

                nameListStorage = nameListStorage.filter(item => item !== inputText)
                nameListStorage.push(inputText)
                localStorage.setItem('nameList', JSON.stringify(nameListStorage));

            } else {

                if (nameListStorage.length >= 5) {
                    nameListStorage.shift();
                }
                nameListStorage.push(inputText);
                localStorage.setItem('nameList', JSON.stringify(nameListStorage));

            }



            // 캐릭터 검색
            getCharacterProfile(inputText, function () {
                document.getElementById("sc-info").innerHTML = searchHtml;
                specBtn();                 //스펙포인트 상세정보보기
                renewFnc();                //갱신하기 버튼
                userBookmarkSave(inputText)//즐겨찾기 기능
                detailPosSet()             //detail 좌우 위치조정
                levelAvgPoint()            //레벨별 평균점수 보기
            });


        }
    })


    if (inputText) {
        let inputs = document.querySelectorAll('.character-name-search');
        inputs.forEach(function (inputArry) {
            inputArry.value = inputText;
            inputArry.addEventListener('input', function (inputEvent) {
                if (inputFlag == 1) {
                    inputEvent.target.value = '';
                    inputFlag = 0
                }
            });
        })
    }

});


// 레벨별 평균점수 보기

function levelAvgPoint(){
    document.querySelector(".link-split").addEventListener("click", function(){
        this.classList.toggle("on");
    });
}



// 스펙포인트 더보기 버튼

function specBtn() {
    document.getElementById("extra-btn").addEventListener("click", function () {
        let specAreaClass = document.querySelector(".spec-area").classList
        // console.log(specAreaClass)
        if (specAreaClass.contains("on")) {
            specAreaClass.remove('on')
        } else {
            specAreaClass.add('on')
        }
    })
}



// 갱신하기 버튼 스크립트

function renewFnc() {
    let alertArea = document.querySelector(".alert-area")

    document.querySelector(".group-profile .renew-button").addEventListener("click", function () {
        alertArea.style.display = "block";
    })

    document.querySelector(".group-profile .refresh").addEventListener("click", function () {
        window.location.reload();
    })

    document.querySelector(".group-profile .cancle").addEventListener("click", function () {
        alertArea.style.display = "none";
    })
}



// 즐겨찾기 추가

function userBookmarkSave(userName) {

    document.querySelector(".group-profile .star").addEventListener("click", bookmarkToggle)
    // localStorage.removeItem("userBookmark");                                             //로컬스토리지 비우기
    // localStorage.clear();                                                                //로컬스토리지 전체 제거
    function bookmarkToggle(el) {

        let userBookmarkList = JSON.parse(localStorage.getItem("userBookmark")) || []       //북마크 리스트

        el.target.classList.toggle("full");                                                 //북마크 아이콘 토글  
        if (userBookmarkList.length < 5 && el.target.classList.contains("full")) {

            userBookmarkList.push(userName)                                                 //북마크 추가하기
            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

        } else if (!el.target.classList.contains("full")) {

            userBookmarkList = userBookmarkList.filter(item => item !== userName)
            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

        } else if (userBookmarkList.length >= 5) {
            el.target.classList.remove("full");                                              //북마크 아이콘 토글  
            alert("즐겨찾기는 5개까지 저장됩니다.")
        }

        console.log(userBookmarkList)


    }
}




// question > detail 좌우 여백감지 스크립트

function detailPosSet() {
    document.querySelectorAll(".question").forEach(function (question) {
        question.addEventListener("mouseenter", function () {

            let bodyWidth = document.documentElement.offsetWidth;
            let questionPos = question.getBoundingClientRect().left;
            let detail = question.querySelector(".detail");

            detail.style.width = "initial";
            detail.style.whiteSpace = "nowrap"


            if(bodyWidth - (bodyWidth - questionPos) - 20 < detail.offsetWidth && bodyWidth < questionPos * 2){    //detail위치 좌측 + detail너비가 body초과
                detail.style.width = (bodyWidth - (bodyWidth - questionPos) - 20) + "px"
                detail.style.left = "initial";
                detail.style.right = "10px";
                detail.style.whiteSpace = "normal"
            }else if (bodyWidth < questionPos * 2) {                                                               //detail 위치 좌측
                detail.style.left = "initial"
                detail.style.right = "10px"
            }else if(bodyWidth - questionPos - 30 < detail.offsetWidth && bodyWidth > questionPos * 2){            //detail위치 우측 + detail너비가 body초과
                detail.style.width = (bodyWidth - questionPos - 30) + "px"
                detail.style.right = "initial"
                detail.style.left = "10px"
                detail.style.whiteSpace = "normal"
            }else if(bodyWidth > questionPos * 2){                                                                 //detail위치 우측
                detail.style.right = "initial"
                detail.style.left = "10px"
            }

        })
    })
}
