<!DOCTYPE html>
<html lang="kr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no;" /> 
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta name="description" content="로스트아크 스펙 점수 확인, 전투정보실, 캐릭터 정보, 랭킹">
    <meta name="keywords" content="로펙, 로스트아크 스펙, 로스트아크 정보">



    
    <link rel="icon" type="image/png" href="../asset/image/lopec-ico.png">
    
    <link rel="stylesheet" href="../asset/css/layout.css">
    <link rel="stylesheet" href="../asset/css/main.css">
    <title>로펙 : 로아 스펙 포인트 및 캐릭터 정보</title>
</head>


<body class="">

    <?php //  공용헤더 ?>
    <header></header>
    <?php //  공용헤더 ?>



    <div class="wrapper">

    <?php //  상단광고 ?>
        <div class="sc-top-ads">
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





        <section class="sc-info search-page" id="sc-info">
            <div class="loader"></div>



            <div class="group-profile">
                <div class="img-area shadow">
                    <?php //  <img id="character-image" src="../asset/image/skeleton-img.png" alt="프로필 이미지"> ?>
                    <?php //  <button class="renew-button">갱신하기</button> ?>
                    <span class="image skeleton"></span>
                    <p class="level" id="character-level">Lv.N/A</p>
                    <p class="name" id="character-nickname">닉네임</p>
                    <p class="class" id="character-class">직업</p>
                </div>
                <ul class="tag-list shadow">
                    <li class="tag-item">
                        <p class="tag radius">서버</p>
                        <span class="name"></span>
                    </li>
                    <li class="tag-item">
                        <p class="tag radius">레벨</p>
                        <span class="name"></span>
                    </li>
                    <li class="tag-item">
                        <p class="tag radius">길드</p>
                        <span class="name"></span>
                    </li>
                    <li class="tag-item">
                        <p class="tag radius">칭호</p>
                        <span class="name"></span>
                    </li>
                    <li class="tag-item">
                        <p class="tag radius">영지</p>
                        <span class="name"></span>
                    </li>
                    <li class="tag-item">
                        <p class="tag radius">카드</p>
                        <span class="name"></span>
                    </li>
                </ul>


                <div class="alert-area">
                    <div class="alert-wrap">
                        <p class="desc">api갱신 조건에 대한 문장</p>
                        <div class="button-box">
                            <button class="refresh">갱신하기</button>
                            <button class="cancle">취소하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="group-info">
                <div class="spec-area shadow minimum flag">
                    <p class="title">스펙 포인트</p>
                    <div class="tier-box">
                        <img src="../asset/image/bronze.png" alt="">
                        <?php //  <p class="tier-info">티어정보</p> ?>
                    </div>
                    <div class="spec-point">
                        N/A
                        <div class="question">
                            <span class="detail">
                                스펙포인트 정보 로딩중
                            </span>
                        </div>
                    </div>
                    <div class="extra-info">
                        <p class="detail-info">세부정보</p>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                        <div class="info-box">
                            <p class="text">전투레벨 : 100000</p>
                            <div class="question">
                                <span class="detail">세부전투력X9999</span>
                            </div>
                        </div>
                    </div>
                    <span class="extra-btn" id="extra-btn"></span>
                </div>
                <div class="button-area">
                    <a href="https://cool-kiss-ec2.notion.site/2024-10-16-121758f0e8da8029825ef61b65e22568" target="_blink" class="link-block">무효각인 목록</a>
                    <form class="link-split" action="../split/split.html" method="get" >
                        <button type="button" id="split-input">캐릭터 비교하기</button>
                    </form>
                </div>
                <div class="engraving-area shadow">
                    <div class="engraving-box">
                        <img src="../asset/image/skeleton-img.png" class="engraving-img" alt="">
                    </div>
                    <div class="engraving-box">
                        <img src="../asset/image/skeleton-img.png" class="engraving-img" alt="">
                    </div>
                    <div class="engraving-box">
                        <img src="../asset/image/skeleton-img.png" class="engraving-img" alt="">
                    </div>
                    <div class="engraving-box">
                        <img src="../asset/image/skeleton-img.png" class="engraving-img" alt="">
                    </div>
                    <div class="engraving-box">
                        <img src="../asset/image/skeleton-img.png" class="engraving-img" alt="">
                    </div>

                </div>
            </div>
            <div class="group-equip">
                <div class="gem-area shadow">
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                    <div class="gem-box radius skeleton">
                        <img src="../asset/image/skeleton-img.png" alt="">
                    </div>
                </div>
                <div class="armor-wrap">
                    <div class="armor-area shadow">
                        <ul class="armor-list">
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                    <div class="elixir-wrap">
                                    </div>
                                    <div class="hyper-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="armor-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                </div>
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="name-wrap">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="accessory-area shadow">
                        <ul class="accessory-list">
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="text-box">
                                    <div class="grinding-wrap">
                                    </div>
                                    <div class="grinding-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                            <li class="accessory-item">
                                <div class="img-box radius skeleton">
                                    <img src="../asset/image/skeleton-img.png" alt="">
                                    <span class="progress"></span>
                                </div>
                                <div class="option-box">
                                    <div class="option-wrap">
                                    </div>
                                    <div class="buff-wrap">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="ark-area shadow">
                    <div class="ark-list-wrap">
                        <ul class="ark-list evolution">
                            <li class="title-box evolution">
                                <span class="tag">진화</span>
                                <span class="title">N/A</span>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                        </ul>
                        <ul class="ark-list enlightenment">
                            <li class="title-box enlightenment">
                                <span class="tag">진화</span>
                                <span class="title">N/A</span>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>

                        </ul>
                        <ul class="ark-list leap">
                            <li class="title-box leap">
                                <span class="tag">진화</span>
                                <span class="title">N/A</span>
                            </li>

                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>
                            <li class="ark-item">
                                <div class="img-box">
                                    <span class="tier">N</span>
                                    <img src="../asset/image/skeleton-img.png" alt="아크패시브">
                                </div>
                                <div class="text-box">
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <?php //  공요푸터 ?>
    <footer class="sc-footer"></footer>
    <?php //  공요푸터 ?>

    
    <?php //  db관련 ?>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <?php //  db관련 ?>


    <?php //  공용 헤더,푸터 ?>
    <script>
        document.write('<script type="module" src="/asset/js/layout.js?' + (new Date).getTime() + '"><\/script>');
    </script>
    <script>
        document.write('<script type="module" src="/asset/js/custom.js?' + (new Date).getTime() + '"><\/script>');
    </script>


</body>



</html>