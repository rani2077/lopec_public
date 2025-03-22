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




    <link rel="icon" type="image/png" href="../asset/image/lopec-ico.png">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />


    <link rel="stylesheet" href="../asset/css/layout.css">
    <link rel="stylesheet" href="../asset/css/main.css">
    <title>로펙 : 로아 스펙 포인트 및 캐릭터 정보</title>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            }).catch(function(error) {
                console.log('Service Worker 등록 해제 실패:', error);
            });
        }
    </script>
</head>


<body class="">

    <?php //  공용헤더 
    ?>
    <header></header>
    <?php //  공용헤더 
    ?>



    <div class="wrapper">

        <?php //  상단광고 
        ?>
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
            //
            ?>

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
        <?php //  상단광고 
        ?>


        <?php // 좌우광고 
        ?>
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
        <?php // 좌우광고 
        ?>

        <section class="sc-profile">
            <div class="group-img">
                <span class="img"></span>
            </div>
            <div class="group-profile">
                <div class="name-area">
                    <span class="name">LV.70 청염각 <i class="job">#일격 스트라이커</i></span>
                </div>
                <div class="info-area">
                    <div class="info-box">
                        <span class="name">서버 : 아브렐슈드</span>
                        <span class="name">레벨 : 1697</span>
                    </div>
                    <div class="info-box">
                        <span class="name">직업랭킹 : 1111</span>
                        <span class="name">전체랭킹 : 39211</span>
                    </div>
                </div>
            </div>
        </section>

        <nav class="sc-nav">
            <a href="" class="link on">메인</a>
            <a href="" class="link">원정대</a>
            <a href="" class="link">시뮬레이터</a>
        </nav>

        <section class="sc-info search-page" id="sc-info">

            <div class="group-info">
                <div class="spec-area shadow minimum flag on">
                    <div class="tier-box">
                        <img src="../asset/image/bronze.png" alt="">
                        <?php //  <p class="tier-info">티어정보</p> 
                        ?>
                        <div class="spec-point">
                            1800.<i style="font-size:20px">99</i>
                        </div>
                    </div>
                    <div class="best-box">
                        <span class="desc">달성최고점수 - 1800.99</span>
                    </div>
                </div>
                <div class="detail-area shadow" style="width:100%;background-color:#2f2f2f;height:300px;margin-top:20px;">

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
            <div class="group-system">
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
        </section>
    </div>

    <?php //  공요푸터 
    ?>
    <footer class="sc-footer"></footer>
    <?php //  공요푸터 
    ?>


    <?php //  db관련 
    ?>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <?php //  db관련 
    ?>



    <?php //  스와이퍼 광고 
    ?>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <?php //  스와이퍼 광고 
    ?>

    <script>
        document.write('<script type="module" src="/asset/js/layout.js?' + (new Date).getTime() + '"><\/script>');
        document.write('<script type="module" src="/asset/js/custom.js?' + (new Date).getTime() + '"><\/script>');
    </script>


</body>



</html>