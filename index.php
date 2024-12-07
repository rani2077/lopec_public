<!DOCTYPE html>
<html lang="kr">
<head>
    <meta charset="UTF-8">

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
    <meta name="description" content="로스트아크 스펙 점수 확인, 전투정보실, 캐릭터 정보, 랭킹">
    
    
    <?php //  START - 구글 소유권 확인및 에드센스 ?>
    <?php // 	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329" crossorigin="anonymous"></script>  ?>
    <?php //  END - 구글 소유권 확인및 에드센스 ?>
    
    
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    
    <link rel="icon" type="image/png" href="./asset/image/lopec-ico.png">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>

    
    <link rel="stylesheet" href="./asset/css/layout.css">
    <link rel="stylesheet" href="./asset/css/main.css">
    <title>로펙 : 로아 스펙 포인트 및 캐릭터 정보</title>
</head>

<body>

    <?php //  공용헤더 ?>
    <header class="sc-header shadow"></header>
    <?php //  공용헤더 ?>



    <div class="wrapper">

        <?php //  상단광고 ?>
        <div class="sc-top-ads">

            <?php // 
            // <div class="group-top-ads swiper">
            //     <div class="swiper-wrapper">
            //         <div class="swiper-slide">광고1</div>
            //         <div class="swiper-slide">광고2</div>
            //         <div class="swiper-slide">광고3</div>
            //     </div>
            //     <div class="swiper-pagination"></div>
            // </div>
            // <div class="group-top-ads swiper">
            //     <div class="swiper-wrapper">
            //         <div class="swiper-slide">광고1</div>
            //         <div class="swiper-slide">광고2</div>
            //         <div class="swiper-slide">광고3</div>
            //     </div>
            //     <div class="swiper-pagination"></div>
            // </div>
            ?>
            <?php //  광고?>

             <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
                 crossorigin="anonymous">
             </script>
             <ins class="adsbygoogle"
                 style="display:inline-block;width:728px;height:90px"
                 data-ad-client="ca-pub-5125145415518329"
                 data-ad-slot="5389359448">
             </ins>
             <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
             </script>
        </div>
        <div class="sc-top-ads-mobile">
            
        </div>

        <?php //  상단광고 ?>

        
        <?php // 좌우광고 ?>
        <aside class="side-ads left">
            <div class="ads">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
                    crossorigin="anonymous">
                </script>
                <ins class="adsbygoogle"
                    style="display:inline-block;width:160px;height:600px"
                    data-ad-client="ca-pub-5125145415518329"
                    data-ad-slot="2763196104">
                </ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </aside>

        <aside class="side-ads right">
            <div class="ads">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
                    crossorigin="anonymous">
                </script>
                <ins class="adsbygoogle"
                    style="display:inline-block;width:160px;height:600px"
                    data-ad-client="ca-pub-5125145415518329"
                    data-ad-slot="1340463485">
                </ins>
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
            
            <!-- <form id="main-form" onsubmit="return false;" accept-charset="UTF-8"> -->
            <form id="main-form" action="./search/search.php"  method="GET">
                <div class="group-input shadow">
                    <input id = "nickName" autocomplete="off" name="mainCharacterName" class="input-name main-page character-name-search" type= "text" value = "" placeholder="캐릭터 검색">
                    <button type="submit" class="search-btn"></button>
                    
                </div>
            </form>
            
        </section>
        
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
    <script src="./asset/js/layout.js"></script>


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
    <script type="text/javascript">
        var swiper = new Swiper(".group-top-ads", {
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    </script>


</body>

</html>