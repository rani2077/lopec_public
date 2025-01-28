<!DOCTYPE html>
<html lang="kr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;" /> 
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="description" content="로스트아크 스펙 점수 확인, 전투정보실, 캐릭터 정보, 랭킹">
    <meta name="keywords" content="로펙, 로스트아크 스펙, 로스트아크 정보">

    <?php //  Google tag (gtag.js) 애널리틱스 ?>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-B9CW6L1BXZ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { 
            dataLayer.push(arguments); 
        }
    gtag('js', new Date());
    gtag('config', 'G-B9CW6L1BXZ');
    </script>
    <?php //  Naver meta tag ?>
    <meta name="naver-site-verification" content="19eca95cfbc6fe761f71d6856b37ecb36696896d" />
    
    
    <?php //  START - 구글 소유권 확인및 에드센스 ?>
    <?php // 	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329" crossorigin="anonymous"></script>  ?>
    <?php //  END - 구글 소유권 확인및 에드센스 ?>
    
    
    
    <link rel="icon" type="image/png" href="./asset/image/lopec-ico.png">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
    <link rel="stylesheet" href="./asset/css/layout.css">
    <link rel="stylesheet" href="./asset/css/main.css">
    <title>로펙 : 로아 스펙 포인트 및 캐릭터 정보</title>
    <script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        }).catch(function(error) {
            console.log('Service Worker 등록 해제 실패:', error);
        });
    }
    </script>
</head>

<body>

    <?php //  공용헤더 ?>
    <header></header>
    <?php //  공용헤더 ?>




    <div class="wrapper">

        <?php //  상단광고 ?>
        <div class="sc-top-ads">

            <!-- <div class="group-top-ads swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">광고1</div>
                    <div class="swiper-slide">광고2</div>
                    <div class="swiper-slide">광고3</div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <div class="group-top-ads swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">광고1</div>
                    <div class="swiper-slide">광고2</div>
                    <div class="swiper-slide">광고3</div>
                </div>
                <div class="swiper-pagination"></div>
            </div> -->


            <?php //  기존 광고?>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
            crossorigin="anonymous"></script>
            <!-- main1 -->
            <ins class="adsbygoogle"
            style="display:inline-block;width:800px;height:120px"
            data-ad-client="ca-pub-5125145415518329"
            data-ad-slot="5389359448"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
        <?php // <div class="sc-top-ads-mobile"> ?>
            
        <?php // </div> ?>

        <?php //  상단광고 ?>

        
        <?php // 좌우광고 ?>
        <aside class="side-ads left">
            <div class="ads">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
                    crossorigin="anonymous"></script>
                <!-- side1 -->
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="ca-pub-5125145415518329"
                    data-ad-slot="2763196104"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>

        </aside>

        <aside class="side-ads right">
            <div class="ads">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
                    crossorigin="anonymous"></script>
                <!-- side1 -->
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="ca-pub-5125145415518329"
                    data-ad-slot="2763196104"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </aside>
        <?php // 좌우광고 ?>


        <section class="sc-container main-page on" id="container">
            <div class="group-logo">
                <a href="https://lopec.kr/" class="link-logo">
                    <span class="blind">로펙 바로가기</span>
                    <?php //  <img src="./asset/image/logo.png" alt="로펙 바로가기" class="logo"> ?>
                </a>
            </div>

            <?php 
            // 작업 사항 
            // 1. id = "nick-name" name="main-character-name"
            // id name 에서 이름을 특수기호 넣으면 좋지 않음 / 변수 넘어가다 보면 다른 변수로 판단하는 경우가 발생힘
            // nickname / maincharactername 또는 nickName / mainCharacterName 을 변경
            // 2. form 변경
            // <form id="main-form" action="./search/search.php" method="GET"> => <form id="main-form" onsubmit="return false;" accept-charset="UTF-8"> 으로 변경
            // 실제 동작은 아래 goCharacterSearch 담당함
            // $(document).ready(function(){ 캐릭터명 input name 으로 엔터키 적용되게 해 두었음
            // <button type="submit" class="search-btn"></button> => <button type="button" class="search-btn" onClick="javascript:goCharacterSearch();"></button> 으로 변경 
            // custom.js 보니 엔터 이벤트가 있으므로 해당 이벤트에서 value 를 받은 후 location.href = "./search/search.php?main-character-name="+main-character-name; 해도 됨

            // 검색 누르는 시점에 로그 저장 필요 
            // 
            ?>
            
            
        </section>
        <div class="notice-wrapper">
            <section class="sc-notice shadow">
                <div class="scrollbar">
                    <div class="group-title">
                        <p class="title">공지 / 업데이트</p>
                    </div>
                    <div class="group-notice">
                    <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                        <div class="notice-list">
                            <div class="name-box">
                                <span class="name skeleton" style="display:block;width:200px;height:15px;"></span>
                                <span class="detail-btn"></span>
                            </div>
                        </div>
                    </div>
                </div>
            
            </section>
            <section class="sc-answer">
                <div class="group-answer answer1 shadow">
                    <div class="scrollbar">
                        <div class="title-area">
                            <p class="title">환산 공격력 / 스펙 포인트란?</p>
                        </div>
                        <div class="answer-area">
                            <p class="desc">[환산 공격력]
                            딜러에게 적용되는 환산 수치입니다.
                            인게임의 [공격력] 수치에 각종 딜증 수치를 곱연산 하여 
                            실질적인 최종 공격력값을 도출합니다.

                            보석을 제외한 각종 딜증 수치는, 직업간의 유불리 없이 
                            보편적 딜증 수치로 적용됩니다.

                            [딜증 요소 : 엘릭서/초월/각인/아크패시브/팔찌/보석/악세/장비/특성]

                            [스펙 포인트]
                            서폿에게 적용 되는 종합 스펙 점수 지표입니다.
                            서폿의 [기본 공격력] 수치를 기반으로 각종 버프 수치를 곱연산 하여 
                            상시 및 풀버프 값을 도출합니다.

                            최종 스펙 포인트는 풀버프 효율을 기준으로 
                            기타 추가 점수를 종합하여 계산됩니다.

                            극특 세팅의 점수 뻥튀기를 방지하기 위해 신속/특화는 같은 계수로 적용됩니다.

                            더하여, 직업간 유불리를 없애기 위해 
                            3서폿 모두 바드의 2버블 효율을 기준으로 계산됩니다.
                            
                            [기타 추가 점수 : 각인/아크패시브]
                            </p>
                        </div>
                    </div>
                </div>
                <div class="group-answer answer2 shadow">
                    <div class="scrollbar">
                        <div class="title-area">
                            <p class="title">FAQ</p>
                        </div>
                        <div class="answer-area">
                            <p class="desc"><em style="font-weight:600;color:red;">Q1. 업데이트를 했다는데 그대로에요</em>
                            보통 브라우저 캐시 문제일 확률이 큽니다.
                            <em style="font-weight:600;color:red;">Ctrl+Shift+R키를 통해 강력 새로고침을 해주시면 곧바로 해결됩니다.</em>
                            
                            Q2. 서폿인데 딜러로 뜨는 현상
                            A. 카던 세팅인 상태로 API가 갱신이 되어 생기는 일 입니다.
                            본래 세팅으로 변경하신 후에 캐릭터 카드 우측 상단의 [갱신하기] 버튼을 통해 갱신을 해주세요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <script type="text/javascript">

        function goCharacterSearch(){
            let inputName = document.querySelectorAll(".input-name")
            inputName.forEach(function(input){
                if(input.value == ""){

                }
            })
        }
        
// 		var goCharacterSearch = function() {
// 			var mainCharacterName	= $("#mainCharacterName").val();
// 			if(mainCharacterName == "" || mainCharacterName == undefined || mainCharacterName == "undefined") {
// 				alert("캐릭터 이름을 입력해 주세요.");
// 				$("#main-character-name").focus();
// 				return;
// 			}				
// 			location.href = "./search/search.php?main-character-name="+main-character-name;
// 		}
        </script>
        
    </div>

    
    

    <?php //  공요푸터 ?>
    <footer class="sc-footer"></footer>
    <?php //  공요푸터 ?>

    <?php //  db관련 ?>
    <script type="module" src= "./asset/js/lopec.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <?php //  db관련 ?>



    <?php //  공용 헤더,푸터 ?>


    <?php //  START / 페이지 접속 로그 저장 ?>
    <?php //  <script type="module" src= "./asset/js/log.js"></script>?>
    <?php //  END / 페이지 접속 로그 저장 ?>
    
	<script type="text/javascript"> 
        $(document).ready(function(){
            <?php // 페이지 접속 로그 저장 ?>
            insertLopecLog ();
        // 	$("#main-character-name").keypress(function(e) { 
        // 		if (e.keyCode == 13){
        // 		    goCharacterSearch();
        // 		}    
        // 	});
        });

        var insertLopecLog = function() {
            var atMode = "insertlog"; 	
            var llogUrl = document.URL;
            var saveDatas = {
                atMode : atMode
                , llogUrl : llogUrl
            }
            $.ajax({ 
                dataType	: "json"
                , type		: "POST"
                , url		: "/applications/process/lopecLog/"
                , data		: saveDatas
                , success	: function(msg) {
                    console.log("msg : " + msg);
                    console.log("msg.result : " + msg.result);
                    if(msg.result == "S") {
                        console.log("log insert result : LOPEC_LOG 저장 성공");
                    } else if(msg.result == "F") {
                        console.log("log insert result : LOPEC_LOG 저장 실패");
                    } else if(msg.result == "E") {
                        console.log("log insert result : LOPEC_LOG 저장 Exception");
                    } 
                }
                , error	: function(request, status, error) {
                    console.log("log insert result : LOPEC_LOG 저장 Error");
                    console.log("request.status : " + request.status);
                    console.log("request.responseText : " + request.responseText);
                    console.log("request.error : " + request.error);
                }
            });	
        }


	</script>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>


    <script>
        document.write('<script type="module" src="/asset/js/layout.js?' + (new Date).getTime() + '"><\/script>');
        document.write('<script type="module" src="/asset/js/index.js?' + (new Date).getTime() + '"><\/script>');
    </script>

</body>

</html>