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
    
    <link rel="stylesheet" href="./asset/css/layout.css">
    <link rel="stylesheet" href="./asset/css/main.css">
    <style>
        <?php //  불꽃놀이 이벤트 끝난후 제거예정 ?>
        body {
            /* background:linear-gradient(#0007,#0000),#123; */
            margin:0;
            height:100vh;
            overflow:hidden;
        }
        @keyframes firework {
            0% {
                transform:translate(var(--x),var(--initialY));
                width:var(--initialSize);
                opacity:1;
            }
            50% {
                width:0.5vmin;
                opacity:1;
            }
            100% {
                width:var(--finalSize);
                opacity:0;
            }
        }
        /* @keyframes fireworkPseudo{0%{transform:translate(-50%,-50%);width:var(--initialSize);opacity:1;}50%{width:0.5vmin;opacity:1;}100%{width:var(--finalSize);opacity: 0;}}*/
        .firework,.firework::before,.firework::after {
            --initialSize:0.5vmin;
            --finalSize:45vmin;
            --particleSize:0.2vmin;
            --color1: black;
            --color2: darkred;
            --color3: dimgray;
            --color4: darkblue;
            --color5: darkorange;
            --color6: darkgreen;
            --y:-30vmin;
            --x:-50%;
            --initialY:60vmin;
            content:"";
            animation:firework 2s infinite;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,var(--y));
            width:var(--initialSize);
            aspect-ratio:1;
            background:/* radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 0% 0%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 100% 0%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 100% 100%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 0% 100%,*/
            radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 50% 0%,radial-gradient(circle,var(--color2) var(--particleSize),#0000 0) 100% 50%,radial-gradient(circle,var(--color3) var(--particleSize),#0000 0) 50% 100%,radial-gradient(circle,var(--color4) var(--particleSize),#0000 0) 0% 50%,/* bottom right */
            radial-gradient(circle,var(--color5) var(--particleSize),#0000 0) 80% 90%,radial-gradient(circle,var(--color6) var(--particleSize),#0000 0) 95% 90%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 90% 70%,radial-gradient(circle,var(--color2) var(--particleSize),#0000 0) 100% 60%,radial-gradient(circle,var(--color3) var(--particleSize),#0000 0) 55% 80%,radial-gradient(circle,var(--color4) var(--particleSize),#0000 0) 70% 77%,/* bottom left */
            radial-gradient(circle,var(--color5) var(--particleSize),#0000 0) 22% 90%,radial-gradient(circle,var(--color6) var(--particleSize),#0000 0) 45% 90%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 33% 70%,radial-gradient(circle,var(--color2) var(--particleSize),#0000 0) 10% 60%,radial-gradient(circle,var(--color3) var(--particleSize),#0000 0) 31% 80%,radial-gradient(circle,var(--color4) var(--particleSize),#0000 0) 28% 77%,radial-gradient(circle,var(--color5) var(--particleSize),#0000 0) 13% 72%,/* top left */
            radial-gradient(circle,var(--color6) var(--particleSize),#0000 0) 80% 10%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 95% 14%,radial-gradient(circle,var(--color2) var(--particleSize),#0000 0) 90% 23%,radial-gradient(circle,var(--color3) var(--particleSize),#0000 0) 100% 43%,radial-gradient(circle,var(--color4) var(--particleSize),#0000 0) 85% 27%,radial-gradient(circle,var(--color5) var(--particleSize),#0000 0) 77% 37%,radial-gradient(circle,var(--color6) var(--particleSize),#0000 0) 60% 7%,/* top right */
            radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 22% 14%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 45% 20%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 33% 34%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 10% 29%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 31% 37%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 28% 7%,radial-gradient(circle,var(--color1) var(--particleSize),#0000 0) 13% 42%;
            background-size:var(--initialSize) var(--initialSize);
            background-repeat:no-repeat;
        }
        .firework::before {
            --x:-50%;
            --y:-50%;
            --initialY:-50%;
            /* transform:translate(-20vmin,-2vmin) rotate(40deg) scale(1.3) rotateY(40deg);*/
            transform:translate(-50%,-50%) rotate(40deg) scale(1.3) rotateY(40deg);
            /* animation:fireworkPseudo 2s infinite;*/
        }
        .firework::after {
            --x:-50%;
            --y:-50%;
            --initialY:-50%;
            /* transform:translate(44vmin,-50%) rotate(170deg) scale(1.15) rotateY(-30deg);*/
            transform:translate(-50%,-50%) rotate(170deg) scale(1.15) rotateY(-30deg);
            /* animation:fireworkPseudo 2s infinite;*/
        }
        .firework:nth-child(2) {
            --x:30vmin;
        }
        .firework:nth-child(2),.firework:nth-child(2)::before,.firework:nth-child(2)::after {
            --color1: hotpink;
            --color2: purple;
            --color3: deeppink;
            --color4: darkorchid;
            --color5: darkmagenta;
            --color6: blueviolet;
            --finalSize:40vmin;
            left:30%;
            top:60%;
            animation-delay:-0.25s;
        }
        .firework:nth-child(3) {
            --x:-30vmin;
            --y:-30vmin;
        }
        .firework:nth-child(3),.firework:nth-child(3)::before,.firework:nth-child(3)::after {
            --color1: darkcyan;
            --color2: teal;
            --color3: deepskyblue;
            --color4: darkturquoise;
            --color5: steelblue;
            --color6: mediumpurple;
            --finalSize:35vmin;
            left:70%;
            top:60%;
            animation-delay: -0.4s;
        } 
        <?php //  따크모드 ?>
        .dark-mode .firework,
        .dark-mode .firework::before,
        .dark-mode .firework::after{
            --color1:yellow;
            --color2:khaki;
            --color3:white;
            --color4:lime;
            --color5:gold;
            --color6:mediumseagreen;
        }
        .dark-mode .dark-mode .firework:nth-child(2),
        .dark-mode .firework:nth-child(2)::before,
        .dark-mode .firework:nth-child(2)::after{
            --color1:pink;
            --color2:violet;
            --color3:fuchsia;
            --color4:orchid;
            --color5:plum;
            --color6:lavender;
        }
        .dark-mode .firework:nth-child(3),
        .dark-mode .firework:nth-child(3)::before,
        .dark-mode .firework:nth-child(3)::after{
            --color1:cyan;
            --color2:lightcyan;
            --color3:lightblue;
            --color4:PaleTurquoise;
            --color5:SkyBlue;
            --color6:lavender;
        }
  
    </style>
    <title>로펙 : 로아 스펙 포인트 및 캐릭터 정보</title>
</head>

<body>

    <?php //  공용헤더 ?>
    <header class="sc-header shadow"></header>
    <?php //  공용헤더 ?>


    <?php //  불꽃놀이 ?>
    <div class="firework"></div>
    <div class="firework"></div>
    <div class="firework"></div>


    <div class="wrapper">

        <?php //  상단광고 ?>
        <div class="sc-top-ads">
            
            <?php //  광고
            // <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5125145415518329"
            //     crossorigin="anonymous">
            // </script>
            // <ins class="adsbygoogle"
            //     style="display:inline-block;width:728px;height:90px"
            //     data-ad-client="ca-pub-5125145415518329"
            //     data-ad-slot="5389359448">
            // </ins>
            // <script>
            //     (adsbygoogle = window.adsbygoogle || []).push({});
            // </script>
            ?>

            <img src="./asset/donate/001.png" alt="">
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
                    <input id = "nickName" name="mainCharacterName" class="input-name main-page character-name-search" type= "text" value = "" placeholder="캐릭터 검색">
                    <button type="submit" class="search-btn"></button>
                    
                </div>
            </form>


            <?php //  출시 기념 이벤트 배너 광고 ?>
            <p class="rainbow-text event">
                !!!로펙 전용 프로그램 출시<br>
                <a href="https://cool-kiss-ec2.notion.site/137758f0e8da80bc95c7da1ffc0f3e34" target="_blink" class="temp">여기</a>
                를 눌러 확인하세요!!!
            </p>

            <style> .rainbow-text { display: inline-block; animation: rainbow 5s ease-in-out infinite; transition: color 0.5s; } @keyframes rainbow { 0% { color: red; } 14.28% { color: orange; } 28.56% { color: yellow; } 42.84% { color: green; } 57.12% { color: blue; } 71.40% { color: indigo; } 85.68% { color: violet; } 100% { color: red; } } .temp:hover .rainbow-text { animation: rainbow 3s ease-in-out infinite; }</style>
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
    <?php //  출시 기념 이벤트 배너 광고 ?>
    <img class="enjoy event" src="./asset/image/enjoy.png" alt="">
    <img class="fimally event" src="./asset/image/fimally.png" alt="">

    
    

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


</body>

</html>