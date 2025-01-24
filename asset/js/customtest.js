// spec-point.js html코드
import {getCharacterProfile,searchHtml} from '/asset/js/spec-point.js'


document.addEventListener('DOMContentLoaded', (event) => {
    // 캐시 버스팅을 위한 스크립트 태그 동적 추가
    const timestamp = window.CACHE_TIMESTAMP || new Date().getTime();
    const scriptUrl = `/asset/js/spec-point.js?v=${timestamp}`;
    
    // 이미 존재하는 스크립트 태그가 있다면 제거
    const existingScript = document.querySelector(`script[src^="/asset/js/spec-point.js"]`);
    if (existingScript) {
        existingScript.remove();
    }
    
    // 새로운 스크립트 태그 추가
    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptUrl;
    document.head.appendChild(script);
    
    // 기존 검색 로직 실행
    const urlParams = new URLSearchParams(window.location.search);
    const paramNames = ['mainCharacterName', 'headerCharacterName', 'mobileCharacterName'];
    let inputText = '';
    let inputFlag = 1;

    paramNames.forEach(function(param) {
        let value = urlParams.get(param);
        if (value) {
            inputText = value;

            // 검색기록 처리
            let nameListStorage = JSON.parse(localStorage.getItem("nameList")) || []
            if(nameListStorage.includes(inputText)) {
                nameListStorage = nameListStorage.filter(item => item !== inputText)
                nameListStorage.push(inputText)
                localStorage.setItem('nameList', JSON.stringify(nameListStorage));
            } else {
                if(nameListStorage.length >= 5) {
                    nameListStorage.shift();
                }
                nameListStorage.push(inputText);
                localStorage.setItem('nameList', JSON.stringify(nameListStorage));
            }

            // 캐릭터 검색 실행
            getCharacterProfile(inputText, function() {
                document.getElementById("sc-info").innerHTML = searchHtml;
                specBtn();
                renewFnc();
                userBookmarkSave(inputText);
                gemSort();
                levelAvgPoint();
            });
        }
    });
                

                    if (inputText) {
                        let inputs = document.querySelectorAll('.character-name-search');
                        inputs.forEach(function(inputArry){
                            inputArry.value = inputText;
                            inputArry.addEventListener('input', function(inputEvent) {
                                if(inputFlag == 1){
                                    inputEvent.target.value = '';
                                    inputFlag = 0
                                }
                            });
                        })
                    }
                
                });





                // 스펙포인트 더보기 버튼

                function specBtn(){
                    document.getElementById("extra-btn").addEventListener("click",function(){
                        let specAreaClass = document.querySelector(".spec-area").classList
                        // console.log(specAreaClass)
                        if(specAreaClass.contains("on")){
                            specAreaClass.remove('on')
                        }else{
                            specAreaClass.add('on')
                        }
                    })    
                }


                // 레벨별 평균점수 보기

                function levelAvgPoint(){
                    document.querySelector(".link-split").addEventListener("click", function(){
                        this.classList.toggle("on");
                    });
                }



                // 갱신하기 버튼 스크립트

                function renewFnc(){
                    let alertArea = document.querySelector(".alert-area")
                
                    document.querySelector(".group-profile .renew-button").addEventListener("click",function(){
                        alertArea.style.display = "block";
                    })
                
                    document.querySelector(".group-profile .refresh").addEventListener("click",function(){
                        location.reload(true);
                    })
                
                    document.querySelector(".group-profile .cancle").addEventListener("click",function(){
                        alertArea.style.display = "none";
                    })
                }



                // 즐겨찾기 추가

                function userBookmarkSave(userName){
                
                    document.querySelector(".group-profile .star").addEventListener("click",bookmarkToggle)
                    // localStorage.removeItem("userBookmark");                                             //로컬스토리지 비우기
                    // localStorage.clear();                                                                //로컬스토리지 전체 제거
                    function bookmarkToggle(el){
                    
                        let userBookmarkList = JSON.parse( localStorage.getItem("userBookmark") ) || []     //북마크 리스트

                        el.target.classList.toggle("full");                                                 //북마크 아이콘 토글  
                        if( userBookmarkList.length < 5 && el.target.classList.contains("full")){

                            userBookmarkList.push(userName)                                                 //북마크 추가하기
                            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

                        }else if( !el.target.classList.contains("full") ){

                            userBookmarkList = userBookmarkList.filter(item => item !== userName)
                            localStorage.setItem("userBookmark", JSON.stringify(userBookmarkList))

                        }else if( userBookmarkList.length >= 5 ){
                            el.target.classList.remove("full");                                              //북마크 아이콘 토글  
                            alert("즐겨찾기는 5개까지 저장됩니다.")
                        }
                    
                        console.log(userBookmarkList)
                    
                    
                    }
                }




                // 보석 순서 정렬

                function gemSort(){
                    const parent = document.querySelector('.gem-area.shadow');
                    const children = Array.from(parent.children);
                
                    // 순서정렬
                    children.sort((a, b) => {
                        const iA = parseInt(a.querySelector('i').textContent);
                        const iB = parseInt(b.querySelector('i').textContent);
                        const levelA = parseInt(a.querySelector('.level').textContent);
                        const levelB = parseInt(b.querySelector('.level').textContent);
                        if (iA === iB) {
                            return levelB - levelA;
                        }
                        return iA - iB;
                    });
                
                
                    // 정렬되지 않은 html 제거
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                
                    // 정렬된 html 추가
                    children.forEach(child => parent.appendChild(child));

                }
