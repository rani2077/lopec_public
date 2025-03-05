// import 'https://code.jquery.com/jquery-3.6.0.min.js';



// 필터
import {
    keywordList,
    grindingFilter,
    arkFilter,
    bangleJobFilter,
    engravingImg,
    engravingCalFilter,
    dealerAccessoryFilter,
    calAccessoryFilter,
    elixirFilter,
    cardPointFilter,
    bangleFilter,
    engravingCheckFilter,
    stoneCheckFilter,
    elixirCalFilter,
    arkCalFilter,
    // engravingCheckFilterLowTier,
    classGemFilter,
} from '../filter/filter.js';
import * as Filter from "../filter/filter.js"



export async function getCharacterProfile(data) {




    // 호출api모음
    let characterImage = data.ArmoryProfile.CharacterImage //캐릭터 이미지
    let characterLevel = data.ArmoryProfile.CharacterLevel //캐릭터 레벨
    let characterNickName = data.ArmoryProfile.CharacterName //캐릭터 닉네임
    let characterClass = data.ArmoryProfile.CharacterClassName //캐릭터 직업


    let serverName = data.ArmoryProfile.ServerName //서버명
    let itemLevel = data.ArmoryProfile.ItemMaxLevel //아이템레벨
    let guildNullCheck = data.ArmoryProfile.GuildName //길드명
    function guildName() {
        if (guildNullCheck == null) {
            return ("없음")
        } else {
            return (guildNullCheck)
        }
    }
    let titleNullCheck = data.ArmoryProfile.Title //칭호명
    function titleName() {
        if (titleNullCheck == null) {
            return ("없음")
        } else {
            return (titleNullCheck)
        }
    }

    let townName = data.ArmoryProfile.TownName //영지명




    // -----------------------계산식 함수 호출하기-----------------------------
    // -----------------------계산식 함수 호출하기-----------------------------
    // -----------------------계산식 함수 호출하기-----------------------------



    // ----------------------------------------------------------------------
    // --------------------------------서포터 함수----------------------------

    let enlightenmentCheck = []
    let enlightenmentArry = []
    data.ArkPassive.Effects.forEach(function (arkArry) {
        if (arkArry.Name == '깨달음') {
            enlightenmentCheck.push(arkArry)
        }
    })
    // console.log(enlightenmentArry)


    function supportArkLeft(arkName) {
        let result = []
        arkName.map(function (arkNameArry) {
            // 아크이름 남기기
            let arkName = arkNameArry.Description.replace(/<[^>]*>/g, '').replace(/.*티어 /, '')
            enlightenmentArry.push(arkName)
        });
    }
    supportArkLeft(enlightenmentCheck)
    // console.log(enlightenmentArry)


    // 3티어 캐릭터 각인 추출
    let engArryLowTier = []
    if (!data.ArkPassive.IsArkPassive && !(data.ArmoryEngraving == null)) {
        data.ArmoryEngraving.Effects.forEach(function (realEng) {
            engArryLowTier.push(realEng.Name.replace(/Lv\. \d+/g, '').trim())
        })
    }
    engArryLowTier = engArryLowTier.reverse() //낮은 레벨 순서로 저장됨
    // console.log(engArryLowTier)

    // 직업명 단축이름 출력
    function supportCheck() {
        let arkResult = ""
        try {
            arkFilter.forEach(function (arry) {
                let arkInput = arry.name;
                let arkOutput = arry.initial;

                // console.log(arkInput)

                enlightenmentArry.forEach(function (supportCheckArry) {
                    if (supportCheckArry.includes(arkInput) && data.ArkPassive.IsArkPassive) {
                        arkResult = arkOutput
                        return arkResult
                    }
                })

                engArryLowTier.forEach(function (realEng) {
                    if (realEng == arkInput) {
                        arkResult = arkOutput
                        return arkResult
                    }
                })
            })
        } catch (err) {
            console.log(err)
        }
        return arkResult
    }



    // console.log(supportCheck())

    // 직업명 풀네임 출력
    function jobCheck() {
        let arkResult = ""
        try {
            arkFilter.forEach(function (arry) {
                let arkInput = arry.name;

                enlightenmentArry.forEach(function (supportCheckArry) {
                    if (supportCheckArry.includes(arkInput)) {
                        arkResult = arkInput
                        return arkResult
                    }
                })
            })
        } catch (err) {
            console.log(err)
        }
        return arkResult
    }


    // 3티어 서폿 구분
    function supportLowTierCheck() {
        let result = null
        if (!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.Effects == null)) {
            data.ArmoryEngraving.Effects.forEach(function (engravingArry) {
                let name = engravingArry.Name.replace(/Lv.*/, "").trim()
                bangleJobFilter.forEach(function (jobArry) {
                    if (name == jobArry.job && jobArry.class == "support") {
                        result = "3티어 서폿"
                        return result
                    }
                })
            })
        }
        return result
    }


    if (supportCheck() == "서폿") {

    } else if (supportLowTierCheck() == "3티어 서폿") {

    }



    // --------------------------------서포터 끗------------------------------
    // ----------------------------------------------------------------------






    // --아크패시브 활성화 딜러 계산식--

    let characterPoint = 0

    // 캐릭터 레벨 기본 전투력값
    function characterCal(level) {

        // 기본 레벨 점수식
        let defaultPoint = (level - 50) * 2000

        // 추가 점수식
        if (level < 55) {
            characterPoint = defaultPoint
        } else if (level < 60) {
            characterPoint = defaultPoint + 20000
        } else if (level < 65) {
            characterPoint = defaultPoint + 40000
        } else if (level < 70) {
            characterPoint = defaultPoint + 60000
        } else if (level < 99) {
            characterPoint = defaultPoint + 100000
        }

        // 캐릭터 레벨 최종점수
        return characterPoint
    }

    characterCal(data.ArmoryProfile.CharacterLevel)

    // armorEquipment 무기 레벨 전투력값
    let weaponLevel = data.ArmoryEquipment

    // 무기 레벨 최종점수
    let weaponPoint = 0
    function weaponCal() {
        weaponLevel.forEach(function (arry, idx) {
            if (arry.Type == "무기") {
                let weaponString = JSON.parse(arry.Tooltip).Element_001.value.leftStr2
                let weaponNum = Number(weaponString.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '').replace(/\D/g, '').trim())

                console.log()

                if (weaponNum < 1580) {
                    // console.log("1580미만")
                    weaponPoint = (weaponNum - 50) * 100
                } else if (weaponNum >= 1580 && weaponNum < 1735) {
                    // console.log("1580이상 1735미만")
                    weaponPoint = 153000 + (weaponNum - 1580) * 800 * 4
                } else if (weaponNum == 1735 && !(arry.Grade == "에스더")) {
                    // console.log("레벨 1735 에스더 아님")
                    weaponPoint = (153000 + (weaponNum - 1580) * 800 * 4) + 30000
                } else if (weaponNum >= 1735 && weaponNum <= 1764) {
                    // console.log("1735이상 1764이하 에스더 등급")
                    weaponPoint = (153000 + (weaponNum - 1580) * 800 * 4) + 50000
                }
                else if (weaponNum >= 1765) {
                    // console.log("weaponNum >= 1765")
                    weaponPoint = (153000 + (weaponNum - 1580) * 800 * 4) + 110000
                }

            }
            return weaponPoint
        })
        return weaponPoint

    }
    weaponCal()
    //console.log(weaponCal())


    // 방어구 레벨 최종점수

    let armorPoint = 0;

    function armorCal() {
        weaponLevel.forEach(function (arry) {
            let weaponString = JSON.parse(arry.Tooltip).Element_001.value.leftStr2
            let weaponNum = Number(weaponString.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '').replace(/\D/g, '').trim())







            if (arry.Type == "투구") {
                if (weaponNum < 1580) {
                    // console.log("투구 1580미만")
                    armorPoint += ((weaponNum - 50) * 100) * 0.2
                } else if (weaponNum >= 1580) {
                    // console.log("투구 1580이상")
                    armorPoint += (153000 + (weaponNum - 1580) * 800 * 4) * 0.16
                }
            } else if (arry.Type == "상의") {
                if (weaponNum < 1580) {
                    // console.log("상의 1580미만")
                    armorPoint += ((weaponNum - 50) * 100) * 0.2
                } else if (weaponNum >= 1580) {
                    // console.log("상의 1580이상")
                    armorPoint += (153000 + (weaponNum - 1580) * 800 * 4) * 0.16
                }
            } else if (arry.Type == "하의") {
                if (weaponNum < 1580) {
                    // console.log("하의 1580미만")
                    armorPoint += ((weaponNum - 50) * 100) * 0.2
                } else if (weaponNum >= 1580) {
                    // console.log("하의 1580이상")
                    armorPoint += (153000 + (weaponNum - 1580) * 800 * 4) * 0.16
                }
            } else if (arry.Type == "장갑") {
                if (weaponNum < 1580) {
                    // console.log("장갑 1580미만")
                    armorPoint += ((weaponNum - 50) * 100) * 0.2
                } else if (weaponNum >= 1580) {
                    // console.log("장갑 1580이상")
                    armorPoint += (153000 + (weaponNum - 1580) * 800 * 4) * 0.16
                }
            } else if (arry.Type == "어깨") {
                if (weaponNum < 1580) {
                    // console.log("어깨 1580미만")
                    armorPoint += ((weaponNum - 50) * 100) * 0.2
                } else if (weaponNum >= 1580) {
                    // console.log("어깨 1580이상")
                    armorPoint += (153000 + (weaponNum - 1580) * 800 * 4) * 0.16
                }
            }
            return armorPoint
        })
        return armorPoint
    }
    armorCal()
    //  console.log(armorCal())







    // 아크패시브 최종 포인트
    let arkPoint = 0

    function arkBonus(arkArry, arkName) {
        if (arkArry < 72 && arkName == "진화") {
            return arkArry * 500
        } else if (arkArry > 71 && arkArry < 84 && arkName == "진화") {
            return arkArry * 600 + 50000
        } else if (arkArry < 96 && arkName == "진화") {
            return arkArry * 600 + 180000
        } else if (arkArry < 108 && arkName == "진화") {
            return arkArry * 600 + 225000
        } else if (arkArry < 120 && arkName == "진화") {
            return arkArry * 600 + 270000
        } else if (arkArry < 999 && arkName == "진화") {
            return arkArry * 600 + 330000
        } else if (arkArry < 80 && arkName == "깨달음") {
            return arkArry * 700
        } else if (arkArry > 79 && arkArry < 88 && arkName == "깨달음") {
            return arkArry * 700 + 280000
        } else if (arkArry < 999 && arkName == "깨달음") {
            return arkArry * 700 + 330000
        } else if (arkArry < 50 && arkName == "도약") {
            return arkArry * 800
        } else if (arkArry > 59 && arkName == "도약") {
            return arkArry * 800 + 77000
        } else if (arkArry > 49 && arkName == "도약") {
            return arkArry * 800 + 52000
        }
    }



    function arkCal() {
        let arkPointArry = data.ArkPassive.Points
        arkPointArry.forEach(function (arry) {
            // console.log(arry)
            if (arry.Name == "진화") {
                // console.log("진화"+arkBonus(arry.Value, arry.Name)+"포인트")
                arkPoint += arkBonus(arry.Value, arry.Name)

            } else if (arry.Name == "깨달음") {
                // console.log("깨달음"+arkBonus(arry.Value, arry.Name)+"포인트")
                arkPoint += arkBonus(arry.Value, arry.Name)

            } else if (arry.Name == "도약") {
                // console.log("도약"+arry.Value*750+"포인트")
                arkPoint += arkBonus(arry.Value, arry.Name)
            }
        })
        return arkPoint
    }
    if (data.ArkPassive.IsArkPassive == true) {
        arkCal()
    }


    // console.log(arkPoint)

    // 악세서리 최종 포인트

    let accessoryPoint = 0;
    let accessoryGrade = []


    // 악세서리 상중하 추출 필터
    function accessoryCheck(accessoryOption) {
        dealerAccessoryFilter.forEach(function (filterArry) {
            // console.log(accessoryOption)

            if (accessoryOption.includes(filterArry.split(":")[0])) {
                // console.log(filterArry.split(":")[1])
                return accessoryGrade.push(filterArry.split(":")[1])
            }
        })
        return accessoryGrade
    }


    // 악세서리 추출 필터 실행함수
    function accessoryCal() {
        weaponLevel.forEach(function (arry) {
            try {
                let accessoryName = JSON.parse(arry.Tooltip).Element_005.value.Element_001
                // console.log(accessoryName)
                accessoryCheck(accessoryName)
            } catch { }
        })
    }
    accessoryCal()


    // 배열 3개 단위로 나누기 함수
    function splitArrayIntoChunks(array, chunkSize) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }
    let chunkSize = Math.ceil(accessoryGrade.length / (accessoryGrade.length / 3));
    accessoryGrade = splitArrayIntoChunks(accessoryGrade, chunkSize);


    // 배열 3개(1세트) 점수 검사

    // 딜러
    function normalTmlDealer(e) {
        if (e == "Zlow" || e == "Zmiddle" || e == "Zhigh") {
            return 0
        } else if (e == "SPhigh" || e == "Duelhigh") {
            return 55000
        } else if (e == "SPmiddle" || e == "Duelmiddle") {
            return 33900
        } else if (e == "SPlow" || e == "Duellow") {
            return 12600
        } else if (e == "PUBhigh" || e == "DuelPubhigh") {
            return 11000
        } else if (e == "PUBmiddle" || e == "DuelPubmiddle") {
            return 5500
        } else if (e == "PUBlow" || e == "DuelPublow") {
            return 2340
        } else {
            return 0
        }
    }
    function spTmlDealer(spVal, pubVal) {
        if (spVal == 1 && pubVal == 2) {
            return 1000
        } else if (spVal == 2 && pubVal == 0) {
            return 3000
        } else if (spVal == 2 && pubVal == 1) {
            return 5000
        } else {
            return 0
        }
    }


    // 서폿
    function normalTmlSupport(e) {
        if (e == "Zlow" || e == "Zmiddle" || e == "Zhigh") {
            return 0
        } else if (e == "SupportSPhigh" || e == "Duelhigh") {
            return 88000
        } else if (e == "SupportSPmiddle" || e == "Duelmiddle") {
            return 45000
        } else if (e == "SupportSPlow" || e == "Duellow") {
            return 21000
        } else if (e == "DuelPubhigh" || e == "Supporthigh") {
            return 19000
        } else if (e == "DuelPubmiddle" || e == "Supportmiddle") {
            return 9500
        } else if (e == "DuelPublow" || e == "Supportlow") {
            return 4500
        } else {
            return 0
        }
    }
    function spTmlSupport(spVal, pubVal) {
        if (spVal == 1 && pubVal == 2) {
            return 1000
        } else if (spVal == 2 && pubVal == 0) {
            return 3000
        } else if (spVal == 2 && pubVal == 1) {
            return 5000
        } else {
            return 0
        }
    }


    if (supportCheck().trim() == "서폿") { //서포터일 경우
        accessoryGrade.forEach(function (arry, index) {
            // console.log("서폿적용중")
            arry.forEach(function (tmlArry) {
                // normalTml(tmlArry)
                accessoryPoint += normalTmlSupport(tmlArry)
            })
            let spNum = arry.filter((item => item === "SupportSPhigh")).length
            let pubNum = arry.filter(item => item === "Supporthigh" || item === "DuelPubhigh").length

            return accessoryPoint += spTmlSupport(spNum, pubNum)
        })

    } else { //딜러일 경우
        accessoryGrade.forEach(function (arry, index) {
            arry.forEach(function (tmlArry) {
                accessoryPoint += normalTmlDealer(tmlArry)
            })
            let spNum = arry.filter((item => item === "SPhigh" || item === "Duelhigh")).length
            let pubNum = arry.filter(item => item === "PUBhigh" || item === "DuelPubhigh").length

            return accessoryPoint += spTmlDealer(spNum, pubNum)
        })

    }





    // console.log(accessoryGrade)
    // console.log(accessoryPoint)






    // 엘릭서 계산식 최종포인트(딜러)


    // 엘릭서 레벨 추출
    function elixirKeywordCheck(e) {
        let elixirValString = data.ArmoryEquipment[e].Tooltip;


        const matchedKeywordsWithContext = keywordList.flatMap(keyword => {
            const index = elixirValString.indexOf(keyword);
            if (index !== -1) {
                const endIndex = Math.min(index + keyword.length + 4, elixirValString.length);
                return [elixirValString.slice(index, endIndex).replace(/<[^>]*>/g, '')];
            }
            return [];
        });


        // span태그로 반환
        let elixirSpan = []
        let i
        for (i = 0; i < matchedKeywordsWithContext.length; i++) {
            elixirSpan.push(matchedKeywordsWithContext[i])
        }
        return (elixirSpan)

    }

    let elixirData = []
    // 엘릭서 인덱스 번호 검사
    data.ArmoryEquipment.forEach(function (arry, idx) {
        elixirKeywordCheck(idx).forEach(function (elixirArry, idx) {
            elixirData.push({ name: ">" + elixirArry.split("Lv.")[0], level: elixirArry.split("Lv.")[1] })
        })
    })

    let doubleCheck = []
    let elixirFilterVal
    // console.log(supportCheck())
    if (supportCheck().trim() == "서폿") { //4티어 서포터일 경우
        function elixirSupportVal(optionGrade, level) { // 옵션 분류명, 레벨
            if ((optionGrade == "DuelPub" || optionGrade == "SupPub") && level == 5) {
                return level * 4000 + 1500
            } else if (optionGrade == "Duelpub") {
                return level * 4000
            } else if (optionGrade == "Sup1" && level == 5) {
                return level * 10500 + 15000
            } else if (optionGrade == "Sup1") {
                return level * 10500
            } else if (optionGrade == "Sup2" && level == 5) {
                return level * 5500 + 15000
            } else if (optionGrade == "Sup2") {
                return level * 5500
            } else if (optionGrade == "Sup3" && level == 5) {
                return level * 9300 + 12500
            } else if (optionGrade == "Sup3") {
                return level * 9300
            } else {
                return 0
            }
        }

        elixirFilterVal = elixirSupportVal
        doubleCheck = ["선각자", "진군", "신념"]

    } else if (supportLowTierCheck() == "3티어 서폿") { //3티어 서폿일 경우
        function elixirDealerVal(optionGrade, level) { // 옵션 분류명, 레벨
            if ((optionGrade == "DuelPub" || optionGrade == "SupPub") && level == 5) {
                return level * 4000 + 1500
            } else if (optionGrade == "Duelpub") {
                return level * 4000
            } else if (optionGrade == "Sup1" && level == 5) {
                return level * 10500 + 15000
            } else if (optionGrade == "Sup1") {
                return level * 10500
            } else if (optionGrade == "Sup2" && level == 5) {
                return level * 5500 + 15000
            } else if (optionGrade == "Sup2") {
                return level * 5500
            } else if (optionGrade == "Sup3" && level == 5) {
                return level * 9300 + 12500
            } else if (optionGrade == "Sup3") {
                return level * 9300
            } else {
                return 0
            }
        }

        elixirFilterVal = elixirDealerVal
        doubleCheck = ["선각자", "진군", "신념"]

    } else { // 딜러일 경우 
        function elixirDealerVal(optionGrade, level) { // 옵션 분류명, 레벨
            if ((optionGrade == "pub" || optionGrade == "DuelPub") && level == 5) {
                return level * 4000 + 1500
            } else if (optionGrade == "pub" || optionGrade == "DuelPub") {
                return level * 4000
            } else if (optionGrade == "sp") {
                return level * 2500
            } else if (optionGrade == "sp1" && level == 5) {
                return level * 10500 + 15000
            } else if (optionGrade == "sp1") {
                return level * 10500
            } else if (optionGrade == "sp2" && level == 5) {
                return level * 9300 + 12500
            } else if (optionGrade == "sp2") {
                return level * 9300
            } else {
                return 0
            }
        }

        elixirFilterVal = elixirDealerVal
        doubleCheck = ["회심", "달인 (", "강맹", "칼날방패", "선봉대", "행운"]
    }



    let elixirPoint = 0
    let elixirLevel = 0



    elixirData.forEach(function (arry) {

        // console.log((arry.name))
        // console.log(arry.level)




        elixirFilter.forEach(function (filterArry) {
            if (arry.name == filterArry.split(":")[0]) {
                // elixirFilterVal(filterArry.split(":")[1],arry.level)

                // console.log("엘릭레벨:"+arry.level+"엘릭서명:"+arry.name+",엘릭서 점수:"+elixirFilterVal(filterArry.split(":")[1],arry.level))
                elixirLevel += Number(arry.level)
                elixirPoint += elixirFilterVal(filterArry.split(":")[1], arry.level)
            } else {
            }
        })
    })
    // console.log(elixirLevel)


    // 회심,달인 2개 존재시 가산점

    function containsTwoWord(data, doubleString) {
        let count = data.filter(item => item.name.includes(doubleString)).length;
        return count === 2;
    }


    // console.log(containsTwoWord(elixirData)); // true
    doubleCheck.forEach(function (arry) {
        if (containsTwoWord(elixirData, arry) && elixirLevel >= 50) {
            // console.log("레벨합계"+elixirLevel+"가산점 100000")
            elixirPoint += 110000
        } else if (containsTwoWord(elixirData, arry) && elixirLevel >= 40) {
            // console.log("레벨합계"+elixirLevel+"가산점 105000")
            elixirPoint += 105000
        } else if (containsTwoWord(elixirData, arry) && elixirLevel >= 35) {
            // console.log("레벨합계"+elixirLevel+"가산점 85000")
            elixirPoint += 85000
        }
    })
    // console.log("엘릭서 최종 점수:"+elixirPoint)



    // 보석 최종점수

    let gemsPoint = 0;
    try {
        data.ArmoryGem.Gems.forEach(function (arry) {
            // console.log(arry.Level)
            if (arry.Name.includes("멸화") || arry.Name.includes("홍염")) {
                gemsPoint += arry.Level * 3750
                // console.log("멸화or홍염:"+gemsPoint)
            } else if (arry.Name.includes("겁화") || arry.Name.includes("작열")) {
                gemsPoint += (arry.Level + 2) * 3750 * 1.6
                // console.log("겁화or작열:"+gemsPoint)
            }

            // 보석 10레벨 보너스 가산점
            if (arry.Level == 6) {
                // console.log("보석 보너스 가산점")
                gemsPoint += 4000
            } else if (arry.Level == 7) {
                gemsPoint += 19750
            } else if (arry.Level == 8) {
                gemsPoint += 22000
            } else if (arry.Level == 9) {
                gemsPoint += 40000
            } else if (arry.Level == 10) {
                gemsPoint += 52500
            }

            if (arry.Name.includes("10레벨 겁화") || arry.Name.includes("10레벨 작열")) {
                gemsPoint += 5000
            }

        })
    } catch {

    }
    // console.log(gemsPoint)



    // 각인점수 최종점수(비활성화/활성화)
    let setPoint = 0

    let engravingPoint = 0 //각인 점수
    let arkLevel = 0
    // console.log(!(data.ArmoryEngraving == null))
    if (!(data.ArmoryEngraving == null)) {
        let arkAble = data.ArmoryEngraving.ArkPassiveEffects
        let arkDisable = data.ArmoryEngraving.Effects
        if (!(arkDisable == null)) {//아크패시브 비활성화
            setPoint += 300000
            arkDisable.forEach(function (arry) {
                arkLevel = Number(arry.Name.replace(/\D/g, ''))
                engravingPoint += arkLevel * 11000
            })
        } else if (!(arkAble == null)) {//아크패시브 활성화
            arkAble.forEach(function (arry) {
                if (arry.Grade.includes("전설")) {
                    engravingPoint += Math.round(97000 * (1.13 ** (arry.Level + 1)))
                } else if (arry.Grade.includes("유물")) {
                    engravingPoint += Math.round(126800 * (1.13 ** (arry.Level + 1)))
                } else {
                    engravingPoint += Math.round(10000 * (1.13 ** (arry.Level + 1)))
                }
            })
        }
    }
    // console.log(engravingPoint)


    // 초월 점수 계산식

    let hyperPoint = 0;
    let hyperArmoryLevel = 0;
    let hyperWeaponLevel = 0;

    function hyperCalcFnc(e) {
        let hyperStr = data.ArmoryEquipment[e].Tooltip;


        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            hyperPoint += Number(hyperArry[3]) * 1600 + Number(hyperArry[1] * 3400)
            return Number(hyperArry[3])

            // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)

        } catch {
            return 0
        }
    }

    data.ArmoryEquipment.forEach(function (arry, idx) {
        if (arry.Type == "무기") {
            hyperWeaponLevel += hyperCalcFnc(idx)
        } else {
            hyperArmoryLevel += hyperCalcFnc(idx)
        }
    })

    // 무기 20성 이상 가산점
    if (hyperWeaponLevel >= 20) {
        hyperPoint += 53900
    }
    // 방어구 75성 이상 가산점
    if (hyperArmoryLevel >= 100) {
        hyperPoint += 33500
    } else if (hyperArmoryLevel >= 75) {

        hyperPoint += 20500
    }


    // console.log("무기:"+hyperWeaponLevel+"성")
    // console.log("방어구:"+hyperArmoryLevel+"성")
    // console.log("초월 합산 총점:"+hyperPoint+"점")


    // 카드 점수 계산

    cardPointFilter
    let cardPoint = 0
    let cardLevel = 0


    // 카드 장착유무 확인
    if (!(data.ArmoryCard == null)) {
        data.ArmoryCard.Effects.forEach(function (arry) {
            let lastCardName = arry.Items[arry.Items.length - 1].Name
            lastCardName.replace(/\s*\d+세트(?:\s*\((\d+)각.*?\))?/g, function (match, p1) {
                cardLevel = Number(p1)
                if (isNaN(cardLevel)) {
                    cardLevel = 0;
                }
                // console.log(cardLevel)
            }).trim();

            // console.log(cardLevel);
            cardPointCheck(lastCardName, cardLevel)
        })
    } else {


        // 특정카드 점수 계산기(단일)
    }
    function cardPointCheck(cardName, level) {
        cardPointFilter.forEach(function (arry) {
            if (cardName.includes(arry.split(":")[0]) && arry.split(":")[1] == 1) {
                cardPoint = level * 2220
            } else if (cardName.includes(arry.split(":")[0]) && arry.split(":")[1] == 2) {
                cardPoint = level * 6500
            }
        })
    }

    // console.log(data.ArmoryCard)
    let cardFilter = ['세 우마르가 오리라', "라제니스의 운명"]
    // let comboCardString 
    // let comboFilter
    if (!(data.ArmoryCard == null)) {
        let comboCardString = JSON.stringify(data.ArmoryCard.Effects)
        let comboFilter = comboCardString.includes(cardFilter[0]) && comboCardString.includes(cardFilter[1])
        if (data.ArmoryCard.Effects.length > 1 && comboFilter) {
            cardPoint = 195000
        }
    }
    // 특정카드 조합 계산기(복수)

    // console.log(cardPoint)


    // 어빌리티스톤 점수 계산식(아크패시브 활성화/비활성화) 

    let abilityStonePoint = 0;
    let abilityLevel = 0;
    if (!(data.ArmoryEngraving == null)) {

        if (!(data.ArmoryEngraving.ArkPassiveEffects == null)) {
            abilityStonePoint += abilityStoneCalc()
        }
    }

    function abilityStoneCalc() {
        let result = 0
        data.ArmoryEngraving.ArkPassiveEffects.forEach(function (arry) {
            if (!(arry.AbilityStoneLevel == null)) {

                if (arry.AbilityStoneLevel == 1) {
                    result += 10000
                } else if (arry.AbilityStoneLevel == 2) {
                    result += 15000
                } else if (arry.AbilityStoneLevel == 3) {
                    result += 25000
                } else if (arry.AbilityStoneLevel == 4) {
                    result += 30000
                }

                abilityLevel += arry.AbilityStoneLevel
            }
        })
        return result
    }
    if (abilityLevel >= 8) {
        abilityStonePoint += 50000
    } else if (abilityLevel >= 7) {
        abilityStonePoint += 30000
    } else if (abilityLevel >= 6) {
        abilityStonePoint += 20000
    } else if (abilityLevel >= 5) {
        abilityStonePoint += 10000
    }

    // console.log(abilityStonePoint)





    // 악세서리 팔찌 가산점 (20240928추가함)
    let banglePoint = 0
    let bangleOptionArry = [];
    let bangeleStatsUse = [];
    let statsPercent = 0
    let bangleSpecialStats = ["힘", "민첩", "지능", "체력"]

    let filterTierCheck

    if (supportCheck().trim() == "서폿" || supportLowTierCheck() == "3티어 서폿") { //서포터일 경우
        function bangleSupportPoint(tier) {
            // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 /
            if (false) { banglePoint += 0 }
            else if (tier == "SpPlow1") { banglePoint += 80000 }
            else if (tier == "SpPlow2") { banglePoint += 90000 }
            else if (tier == "SpPmiddle") { banglePoint += 100000 }
            else if (tier == "SpPhigh") { banglePoint += 110000 }
            else if (tier == "SpMlow1") { banglePoint += 60000 }
            else if (tier == "SpMlow2") { banglePoint += 70000 }
            else if (tier == "SpMmiddle") { banglePoint += 90000 }
            else if (tier == "SpMhigh") { banglePoint += 98000 }
            else if (tier == "SpLlow1" || tier == "DuelPlow1" || tier == "Duellow1" || tier == "DuelLlow1") { banglePoint += 43000 }
            else if (tier == "SpLlow2" || tier == "DuelPlow1" || tier == "Duellow1" || tier == "DuelLlow1") { banglePoint += 48000 }
            else if (tier == "SpLmiddle" || tier == "DuelPlow1" || tier == "Duelmiddle" || tier == "DuelLlmiddle") { banglePoint += 55000 }
            else if (tier == "SpLhigh" || tier == "DuelPlow1" || tier == "Duelhigh" || tier == "DuelLhigh") { banglePoint += 60000 }
            else if (tier == "Splow1") { banglePoint += 8000 }
            else if (tier == "Splow2") { banglePoint += 10000 }
            else if (tier == "Spmiddle") { banglePoint += 12000 }
            else if (tier == "Sphigh") { banglePoint += 15000 }
            else { banglePoint += 0 }
        }
        filterTierCheck = bangleSupportPoint
        bangeleStatsUse = ["특화", "신속"]
        statsPercent = 340

    } else { // 딜러일 경우 
        function bangleDealerPoint(tier) {
            // 접두사 z = 무효 / Sp = 서폿용 / P = 더 높은 점수 / L = 낮은 점수 /
            if (false) { banglePoint += 0 }
            else if (tier == "Plow1" || tier == "Plow1") { banglePoint += 80000 }
            else if (tier == "Plow2" || tier == "DuelPlow2") { banglePoint += 90000 }
            else if (tier == "Pmiddle" || tier == "DuelPmiddle") { banglePoint += 100000 }
            else if (tier == "Phigh" || tier == "DuelPhigh") { banglePoint += 110000 }
            else if (tier == "low1" || tier == "Duellow1") { banglePoint += 55000 }
            else if (tier == "low2" || tier == "Duellow2") { banglePoint += 60000 }
            else if (tier == "middle" || tier == "Duelmiddle") { banglePoint += 68000 }
            else if (tier == "high" || tier == "Duelhigh") { banglePoint += 75000 }
            else if (tier == "Llow1" || tier == "DuelLlow1") { banglePoint += 45000 }
            else if (tier == "Llow2" || tier == "DuelLlow2") { banglePoint += 50000 }
            else if (tier == "Lmiddle" || tier == "DuelLmiddle") { banglePoint += 58000 }
            else if (tier == "Lhigh" || tier == "DuelLhigh") { banglePoint += 62000 }
            else if (tier == "Flow1") { banglePoint += 11000 }
            else if (tier == "Flow2") { banglePoint += 13000 }
            else if (tier == "Fmiddle") { banglePoint += 15000 }
            else if (tier == "Fhigh") { banglePoint += 18000 }
            else { banglePoint += 0 }
        }

        filterTierCheck = bangleDealerPoint
        bangeleStatsUse = ["치명", "특화", "신속"];
        statsPercent = 290
    }





    data.ArmoryEquipment.forEach(function (arry) {
        if (arry.Type == "팔찌") {
            let bangleTier = JSON.parse(arry.Tooltip).Element_001.value.leftStr2.replace(/<[^>]*>/g, '').replace(/\D/g, '')
            let bangleTool = JSON.parse(arry.Tooltip).Element_004.value.Element_001

            // console.log("팔찌내용"+bangleTool)
            bangleTierFnc(bangleTier, bangleTool)
            bangleArryFnc(bangleOptionArry)
        }
    })


    // 팔찌 티어 검사 후 옵션 배열저장
    function bangleTierFnc(bangle, bangleTool) {
        if (bangle == 3) {
            let regex = />([^<]+)</g;
            let regexEnd = />([^<]*)$/;
            let matches;

            while ((matches = regex.exec(bangleTool)) !== null) {
                // console.log(matches[1])
                bangleOptionArry.push(matches[1].trim());
            }
            if ((matches = regexEnd.exec(bangleTool)) !== null) {
                bangleOptionArry.push(matches[1].trim());
            }

        } else if (bangle == 4) {
            let regex = />([^<]+)</g;
            let regexEnd = />([^<]*)$/;
            let matches;

            while ((matches = regex.exec(bangleTool)) !== null) {
                // console.log(matches[1])
                bangleOptionArry.push(matches[1].trim());
            }
            if ((matches = regexEnd.exec(bangleTool)) !== null) {
                bangleOptionArry.push(matches[1].trim());
            }
        }
    }
    // console.log(bangleOptionArry)


    function bangleArryFnc(bangleArry) {
        bangleArry.forEach(function (arry, bangleIdx) {

            // 팔찌 옵션 상중하에 따른 점수
            bangleFilter.forEach(function (filterArry) {

                if (filterArry.name == arry) {
                    if (bangleArry[bangleIdx + 1] == filterArry.option) {
                        filterTierCheck(filterArry.tier)
                        // console.log(filterArry.tier)
                    } else if (filterArry.option == null) {
                        filterTierCheck(filterArry.tier)
                        // console.log(filterArry.tier)
                    }

                }

            })


            // 치명 특화 신속 스텟 팔찌 점수 부여
            bangeleStatsUse.forEach(function (statsArry) {

                let regex = new RegExp(`${statsArry} \\+\\d+`);
                // console.log(statsArry+":"+regex.test(optionArry))

                if (regex.test(arry)) {
                    // console.log(arry)
                    let statsNumber = arry.replace(/\D/g, '');
                    banglePoint += statsNumber * statsPercent

                }
            });




            bangleSpecialStats.forEach(function (statsArry) {
                let regex = new RegExp(`${statsArry} \\+\\d+`);
                if (regex.test(arry)) {
                    let val = arry.replace(/\D/g, '')
                    // console.log(val)
                    // console.log(Math.round(bangleSpStats(val)))
                    banglePoint += Math.round(bangleJobSpStats(val)) //3티어 힘민지 점수
                    banglePoint += Math.round(bangleSpStats(val)) //4티어 힘민지 점수
                }
            });

            // 직업별 힘,민첩,지능 점수     
            function bangleSpStats(spStatsVal) {
                let result = 0
                bangleJobFilter.forEach(function (jobArry) {

                    if (jobCheck() == jobArry.job && jobArry.tier == 4) {
                        let pow = (jobArry.option == "pow")
                        let dex = (jobArry.option == "dex")
                        let int = (jobArry.option == "int")
                        if (pow) {
                            result = spStatsVal * 1.5
                        } else if (dex) {
                            result = spStatsVal * 1.5
                        } else if (int) {
                            result = spStatsVal * 1.5
                        } else {
                            result = 0
                        }
                    } else {
                        result = 0
                    }
                })
                return result

            }
        })

    }


    // 3티어 캐릭터 힘,민첩,지능 팔찌점수
    function bangleJobSpStats(spStatsVal) {
        if (!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.Effects == null)) {
            let flag = 0;
            let result = 0
            data.ArmoryEngraving.Effects.forEach(function (engravingArry) {
                let name = engravingArry.Name.replace(/Lv.*/, "").trim()
                bangleJobFilter.forEach(function (jobArry) {
                    if (name == jobArry.job && jobArry.tier == 3 && flag == 0) {
                        flag += 1
                        // console.log("각인 직업 : "+jobArry.job)
                        let pow = (jobArry.option == "pow")
                        let dex = (jobArry.option == "dex")
                        let int = (jobArry.option == "int")
                        if (pow) {
                            result = spStatsVal * 1.5
                        } else if (dex) {
                            result = spStatsVal * 1.5
                        } else if (int) {
                            result = spStatsVal * 1.5
                        } else {
                            result = 0
                        }
                    } else {
                        result += 0
                    }
                })
            })
            return result
        } else {
            return 0;
        }
    }


    // console.log("팔찌점수:"+banglePoint)










    // characterPoint,weaponPoint,arkPoint,accessoryPoint,elixirPoint,gemsPoint,engravingPoint,hyperPoint,cardPoint,abilityStonePoint
    // ---------------------스펙포인트 총합 계산---------------------
    let specPoint = 0;

    // console.log(characterPoint+'전투포인트')
    // console.log(weaponPoint+'장비포인트')
    // console.log(arkPoint+'진화깨달음도약포인트')
    // console.log(accessoryPoint+'악세서리포인트')
    // console.log(elixirPoint+'엘릭서포인트')
    // console.log(gemsPoint+'보석포인트')
    // console.log(engravingPoint+'각인포인트')
    // console.log(hyperPoint+'초월포인트')
    // console.log(cardPoint+'카드포인트')
    // console.log(abilityStonePoint+'스톤포인트')
    // console.log(setPoint+'세트포인트')
    // console.log("팔찌점수:"+banglePoint)



    // 3티어 스펙포인트 최종값
    specPoint = characterPoint +
        armorPoint +
        weaponPoint +
        arkPoint +
        accessoryPoint +
        elixirPoint +
        gemsPoint +
        engravingPoint +
        hyperPoint +
        cardPoint +
        abilityStonePoint +
        setPoint +
        banglePoint

    //console.log(specPoint+"스펙포인트")



    // -----------------------계산식 함수 끝-----------------------------------
    // -----------------------계산식 함수 끝-----------------------------------
    // -----------------------계산식 함수 끝-----------------------------------


    // ---------------------------NEW 계산식 Ver 2.0---------------------------
    // ---------------------------NEW 계산식 Ver 2.0---------------------------
    // ---------------------------NEW 계산식 Ver 2.0---------------------------






    let defaultObj = {
        attackPow: 0,
        baseAttackPow: 0,
        criticalChancePer: 0,
        addDamagePer: 0,
        criticalDamagePer: 200,
        moveSpeed: 14,
        atkSpeed: 14,
        skillCool: 0,
        special: 0,
        haste: 0,
        crit: 0,
        weaponAtk: 0,
        hp: 0,
    }

    data.ArmoryProfile.Stats.forEach(function (statsArry) {
        if (statsArry.Type == "공격력") {
            defaultObj.attackPow = Number(statsArry.Value)
        } else if (statsArry.Type == "치명") {
            let regex = />(\d+(\.\d+)?)%/;
            defaultObj.criticalChancePer = Number(statsArry.Tooltip[0].match(regex)[1])
            defaultObj.crit = Number(statsArry.Value)
        } else if (statsArry.Type == "신속") {
            let atkMoveSpeed = statsArry.Tooltip[0].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
            let skillCool = statsArry.Tooltip[2].match(/>(\d+(\.\d+)?)%<\/font>/)[1]
            defaultObj.atkSpeed += Number(atkMoveSpeed)
            defaultObj.moveSpeed += Number(atkMoveSpeed)
            defaultObj.skillCool = Number(skillCool)
            defaultObj.haste = Number(statsArry.Value)
        } else if (statsArry.Type == "특화") {
            defaultObj.special = Number(statsArry.Value)
        } else if (statsArry.Type == "최대 생명력") {
            defaultObj.hp = Number(statsArry.Value)
        }
    })

    data.ArmoryEquipment.forEach(function (equip) {
        if (equip.Type == "무기") {
            let quality = JSON.parse(equip.Tooltip).Element_001.value.qualityValue
            defaultObj.addDamagePer += 10 + 0.002 * (quality) ** 2
        }
    })

    // 무기 공격력
    data.ArmoryEquipment.forEach(function (weapon) {
        if (weapon.Type == "무기") {
            const regex = /무기 공격력\s*\+(\d+)/;
            defaultObj.weaponAtk = Number(weapon.Tooltip.match(regex)[1])
        }
    })


    // baseAttckPow(기본 공격력 stats)
    data.ArmoryProfile.Stats.forEach(function (stats) {
        if (stats.Type == "공격력") {
            const regex = />(\d+)</
            defaultObj.baseAttackPow += Number(stats.Tooltip[1].match(regex)[1])
        }
    })



    // 직업별 기본점수
    let jobObj = {
        criticalChancePer: 0,
        criticalDamagePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        skillCool: 0,
        atkPer: 0,
        stigmaPer: 0,

        finalDamagePer: 1,
        criFinalDamagePer: 1,
    }

    arkFilter.forEach(function (filterArry) {

        let plusArry = []
        let perArry = []

        objExtrudeFnc(jobObj, plusArry, perArry)

        plusArry.forEach(function (plusAttr) {
            if (filterArry.initial == supportCheck() && !(filterArry[plusAttr] == undefined)) {
                jobObj[plusAttr] = filterArry[plusAttr]
            }
        })
        perArry.forEach(function (percent) {
            if (filterArry.initial == supportCheck() && !(filterArry[percent] == undefined)) {
                jobObj[percent] = (filterArry[percent] / 100) + 1
            }

        })

    })

    // console.log(jobObj)

    function objExtrudeFnc(object, plus, percent) {
        Object.keys(object).forEach(function (objAttr) {
            if (object[objAttr] == 0) {
                plus.push(objAttr);
            } else if (object[objAttr] == 1) {
                percent.push(objAttr);
            }
        })
    }


    // 악세서리 옵션별 
    // let accAddDamagePer = 0 // 추가 피해 %  삭제예정
    // let accFinalDamagePer = 1 //적에게 주는 피해가 %
    // let accWeaponAtkPlus = 0 //무기 공격력 +
    // let accWeaponAtkPer = 1 // 무기 공격력 %
    // let accAtkPlus = 0 // 공격력 +
    // let accAtkPer = 0 // 공격력 %   
    // let accCriticalChancePer = 0 // 치명타 적중률 %
    // let accCriticalDamagePer = 0 // 치명타 피해 %
    // let accStigmaPer = 0 // 낙인력 %
    // let accAtkBuff = 0 // 아군 공격력 강화 %
    // let accDamageBuffPer = 1 // 아군 피해량 강화 %


    let accObj = {
        addDamagePer: 0,
        finalDamagePer: 1,
        weaponAtkPlus: 0,
        weaponAtkPer: 0,
        atkPlus: 0,
        atkPer: 0,
        criticalChancePer: 0,
        criticalDamagePer: 0,
        stigmaPer: 0,
        atkBuff: 0,
        damageBuff: 0,

        enlightPoint: 0,

        carePower: 1,
    }


    function equimentCalPoint() {
        data.ArmoryEquipment.forEach(function (equipArry) {
            let accOption
            try {
                accOption = JSON.parse(equipArry.Tooltip).Element_005.value.Element_001
                accessoryFilterFnc(accOption)
            }
            catch { }

        })
    }


    equimentCalPoint()
    function accessoryFilterFnc(accessoryOption) {
        calAccessoryFilter.forEach(function (filterArry) {
            let optionCheck = accessoryOption.includes(filterArry.name)
            if (optionCheck && filterArry.attr == "AddDamagePer") { //추가 피해 %
                accObj.addDamagePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "FinalDamagePer") { //에게 주는 피해가 %
                accObj.finalDamagePer += (filterArry.value / 100)
            } else if (optionCheck && filterArry.attr == "WeaponAtkPlus") { //무기 공격력 +
                accObj.weaponAtkPlus += filterArry.value
            } else if (optionCheck && filterArry.attr == "WeaponAtkPer") { //무기 공격력 %
                accObj.weaponAtkPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkPlus") { //공격력 +
                accObj.atkPlus += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkPer") { //공격력 %   
                accObj.atkPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "CriticalChancePer") { //치명타 적중률 %
                accObj.criticalChancePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "CriticalDamagePer") { //치명타 피해 %
                accObj.criticalDamagePer += filterArry.value
            } else if (optionCheck && filterArry.attr == "StigmaPer") { //낙인력 %
                accObj.stigmaPer += filterArry.value
            } else if (optionCheck && filterArry.attr == "AtkBuff") { //아군 공격력 강화 %
                accObj.atkBuff += filterArry.value
            } else if (optionCheck && filterArry.attr == "DamageBuff") { //아군 피해량 강화 %
                accObj.damageBuff += filterArry.value
            } else if (optionCheck && filterArry.attr == "CarePower") { // 아군 보호막, 회복 강화 %
                accObj.carePower += filterArry.value
            }
        })
    }

    accObj.finalDamagePer *= ((accObj.criticalChancePer * 0.684) / 100 + 1)
    //console.log("치적 적용"+accObj.finalDamagePer)
    accObj.finalDamagePer *= ((accObj.criticalDamagePer * 0.3625) / 100 + 1)
    //console.log (accObj.criticalDamagePer)
    //console.log("치적,치피 적용"+accObj.finalDamagePer)
    accObj.finalDamagePer *= ((accObj.weaponAtkPer * 0.4989) / 100 + 1)
    //console.log("치적,치피,무공퍼 적용" + accObj.finalDamagePer)
    accObj.finalDamagePer *= ((accObj.atkPer * 0.9246) / 100 + 1)
    //console.log(accObj)


    // 악세 깨달음 포인트
    data.ArmoryEquipment.forEach(function (arry) {
        let regex = /"([^"]*)"/g;
        let matches = [];
        let match;
        if (/목걸이|귀걸이|반지/.test(arry.Type)) {
            while ((match = regex.exec(arry.Tooltip)) !== null) {             // ""사이값 추출
                matches.push(match[1]);
            }
            let enlightStr = matches.filter(item => /깨달음/.test(item));     // 깨달음 포인트값 추출
            accObj.enlightPoint += Number(enlightStr[0]?.match(/\d+/)[0]);
        }
    })


    // 팔찌
    let bangleObj = {
        atkPlus: 0,
        atkPer: 0,
        weaponAtkPlus: 0,
        criticalDamagePer: 0,
        criticalChancePer: 0,
        addDamagePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        skillCool: 0,
        atkBuff: 0,
        atkBuffPlus: 0,
        damageBuff: 0,

        crit: 0,
        special: 0,
        haste: 0,

        str: 0,
        dex: 0,
        int: 0,

        weaponAtkPer: 1,
        finalDamagePer: 1,
        finalDamagePerEff: 1,
        criFinalDamagePer: 1,
    }

    bangleOptionArry.forEach(function (realBangleArry, realIdx) {

        let plusArry = ['atkPlus', 'atkPer', 'weaponAtkPlus', 'criticalDamagePer', 'criticalChancePer', 'addDamagePer', 'moveSpeed', 'atkSpeed', "skillCool", 'atkBuff', 'damageBuff', 'atkBuffPlus']
        let perArry = ['weaponAtkPer', 'finalDamagePer', 'criFinalDamagePer', 'finalDamagePerEff']
        let statsArry = ["치명:crit", "특화:special", "신속:haste", "힘:str", "민첩:dex", "지능:int"];

        statsArry.forEach(function (stats) {
            let regex = new RegExp(`${stats.split(":")[0]}\\s*\\+\\s*(\\d+)`);
            if (regex.test(realBangleArry)) {

                // console.log(realBangleArry.match(regex)[1])
                bangleObj[stats.split(":")[1]] += Number(realBangleArry.match(regex)[1]);

            }

        })


        bangleFilter.forEach(function (filterArry) {

            if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && filterArry.secondCheck == null) {
                typeCheck(filterArry)

            } else if (realBangleArry == filterArry.name && filterArry.option == null && filterArry.secondCheck == null) {
                typeCheck(filterArry)

            } else if (realBangleArry == filterArry.name && bangleOptionArry[realIdx + 1] == filterArry.option && bangleOptionArry[realIdx + 2] != filterArry.secondCheck) {
                typeCheck(filterArry)

            }

        })
        function typeCheck(validValue) {
            plusArry.forEach(function (value) {
                if (!(validValue[value] == undefined)) {

                    bangleObj[value] += validValue[value]
                    // console.log(value+" : "+bangleObj[value])
                }
            })
            perArry.forEach(function (value) {
                if (!(validValue[value] == undefined)) {
                    // console.log(value+" : "+ bangleObj[value])
                    bangleObj[value] *= (validValue[value] / 100) + 1
                }
            })
        }
    })
    // console.log(bangleObj)

    // 초월
    let hyperSum = hyperWeaponLevel + hyperArmoryLevel



    let hyperObj = {
        atkPlus: 0,
        weaponAtkPlus: 0,
        atkBuff: 0,
        stigmaPer: 0,


        str: 0,
        dex: 0,
        int: 0,

        finalDamagePer: 1,

    }


    // hyperObj객체에 무언가 영향을 미침 원인 해명 필요
    data.ArmoryEquipment.forEach(function (equip, equipIdx) {

        // function hyperInfoFnc(e ,parts){
        let hyperStr = data.ArmoryEquipment[equipIdx].Tooltip;

        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            // console.log(hyperArry)
            headStarCal(hyperArry[3], equip.Type)
            shoulderStarCal(hyperArry[3], equip.Type)
            shirtStarCal(hyperArry[3], equip.Type)
            pantsStarCal(hyperArry[3], equip.Type)
            gloveStarCal(hyperArry[3], equip.Type)
            weaponStarCal(hyperArry[3], equip.Type)
        } catch { }
        // }

        // hyperInfoFnc(equipIdx, equip.Type)
    })


    function hyperStageCalc(e) {
        let hyperStr = data.ArmoryEquipment[e].Tooltip;


        const regex = /(\[초월\]\s*.*?\s*<\/img>\s*\d{1,2})/;
        const hyperMatch = hyperStr.match(regex);

        try {
            let hyperReplace = hyperMatch[0].replace(/<[^>]*>/g, ' ')
            hyperReplace = hyperReplace.replace(/\s+/g, ',')
            let hyperArry = hyperReplace.split(","); //초월,N(단계),단계,N(성)
            return Number(hyperArry[1])

            // return Number(hyperArry[3])*3750 + Number(hyperArry[1]*7500)

        } catch {
            return 0
        }
    }


    let armoryListArry = ["투구", "상의", "하의", "장갑", "어깨"]
    data.ArmoryEquipment.forEach(function (equip, equipIdx) {
        if (equip.Type == "무기") {

            let n = hyperStageCalc(equipIdx)
            hyperObj.weaponAtkPlus += 280 * n + 20 * (n ** 2)
            // console.log(equip.Type + "초월 단계 " + n )
            // console.log("무공 초월 "+ ( 280*n + 20*(n**2) ))
        }
        armoryListArry.forEach(function (armoryList) {
            if (equip.Type == armoryList) {

                let n = hyperStageCalc(equipIdx)
                // console.log(equip.Type + "초월 단계 " + n )
                // console.log(equip.Type+" 초월 "+" : "+ ( 560*n + 40*(n**2) ))
                hyperObj.str += 560 * n + 40 * (n ** 2)
                hyperObj.dex += 560 * n + 40 * (n ** 2)
                hyperObj.int += 560 * n + 40 * (n ** 2)
            }
        })
    })




    // 투구 N성
    function headStarCal(value, parts) {
        let check = (parts == "투구")
        if (value >= 20 && check) {

            hyperObj.atkBuff += hyperSum * 0.04
            hyperObj.atkPlus += hyperSum * 6
            hyperObj.weaponAtkPlus += hyperSum * 14
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 15 && check) {
            hyperObj.atkBuff += hyperSum * 0.03
            hyperObj.weaponAtkPlus += hyperSum * 14
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 10 && check) {
            hyperObj.atkBuff += hyperSum * 0.02
            hyperObj.str += hyperSum * 55
            hyperObj.dex += hyperSum * 55
            hyperObj.int += hyperSum * 55
        } else if (value >= 5 && check) {
            atkBuff += hyperSum * 0.01
        }
    }

    // 어깨 N성
    function shoulderStarCal(value, parts) {
        let check = (parts == "어깨")
        if (value >= 20 && check) {
            hyperObj.atkBuff += 3
            hyperObj.weaponAtkPlus += 3600

        } else if (value >= 15 && check) {
            hyperObj.atkBuff += 2
            hyperObj.weaponAtkPlus += 2400
        } else if (value >= 10 && check) {
            hyperObj.atkBuff += 1
            hyperObj.weaponAtkPlus += 1200
        } else if (value >= 5 && check) {
            hyperObj.atkBuff += 1
            hyperObj.weaponAtkPlus += 1200
        }
    }
    // 상의 N성
    function shirtStarCal(value, parts) {
        let check = (parts == "상의")
        if (value >= 20 && check) {
            hyperObj.weaponAtkPlus += 7200
        } else if (value >= 15 && check) {
            hyperObj.weaponAtkPlus += 4000
        } else if (value >= 10 && check) {
            hyperObj.weaponAtkPlus += 2000
        } else if (value >= 5 && check) {
            hyperObj.weaponAtkPlus += 2000
        }
    }
    // 하의 N성
    function pantsStarCal(value, parts) {
        let check = (parts == "하의")
        if (value >= 20 && check) {
            hyperObj.atkBuff += 6
            hyperObj.finalDamagePer *= (1.5 / 100) + 1
        } else if (value >= 15 && check) {
            hyperObj.atkBuff += 3
        } else if (value >= 10 && check) {
            hyperObj.atkBuff += 1.5

        }
    }
    // 하의 N성
    function gloveStarCal(value, parts) {
        let check = (parts == "장갑")
        if (value >= 20 && check) {
            hyperObj.str += 12600
            hyperObj.dex += 12600
            hyperObj.int += 12600
            hyperObj.atkBuff += 3
        } else if (value >= 15 && check) {
            hyperObj.str += 8400
            hyperObj.dex += 8400
            hyperObj.int += 8400
            hyperObj.atkBuff += 2
        } else if (value >= 10 && check) {
            hyperObj.str += 4200
            hyperObj.dex += 4200
            hyperObj.int += 4200
            hyperObj.atkBuff += 1
        } else if (value >= 5 && check) {
            hyperObj.str += 4200
            hyperObj.dex += 4200
            hyperObj.int += 4200
            hyperObj.atkBuff += 1
        }
    }
    // 무기 N성
    function weaponStarCal(value, parts) {
        let check = (parts == "무기")
        if (value >= 20 && check) {
            hyperObj.atkPlus += 3525
            hyperObj.stigmaPer += 8
            hyperObj.atkBuff += 2
        } else if (value >= 15 && check) {
            hyperObj.atkPlus += 2400
            hyperObj.stigmaPer += 4
            hyperObj.atkBuff += 2
        } else if (value >= 10 && check) {
            hyperObj.atkPlus += 1600
            hyperObj.stigmaPer += 2
            hyperObj.atkBuff += 2
        } else if (value >= 5 && check) {
            hyperObj.atkPlus += 800
            hyperObj.stigmaPer += 2
        }
    }



    // 투구, 상의, 하의, 장갑, 어깨 힘민지 구하기
    function armorStatusCalc() {
        let result = 0;
        data.ArmoryEquipment.forEach(function (armor) {

            if (/^(투구|상의|하의|장갑|어깨|목걸이|귀걸이|반지|)$/.test(armor.Type)) {


                let firstExtract = armor.Tooltip.match(/>([^<]+)</g).map(match => match.replace(/[><]/g, ''))
                let secondExtract = firstExtract.filter(item => item.match(/^(힘|민첩|지능) \+\d+$/));
                let thirdExtract = secondExtract[0].match(/\d+/)[0]
                result += Number(thirdExtract)

            }


        })
        return result

    }

    let armorStatus = armorStatusCalc()


    // 각인

    // 4티어 딜러 각인(그냥각인 예정)
    // finalDamagePer:적에게 주는 피해 , criticalChancePer:치명타 적중률, criticalDamage:치명타 피해량, atkPer: 공격력

    let engObj = {
        finalDamagePer: 1,
        criticalChancePer: 0,
        criticalDamagePer: 0,
        atkPer: 0,
        atkSpeed: 0,
        moveSpeed: 0,
        engBonusPer: 1,

        carePower: 1,
        utilityPower: 1,
    }


    // 4티어 각인 모든 옵션 값 계산(무효옵션 하단 제거)
    engravingCheckFilter.forEach(function (checkArry) {
        if (!(data.ArmoryEngraving == null) && !(data.ArmoryEngraving.ArkPassiveEffects == null)) {
            data.ArmoryEngraving.ArkPassiveEffects.forEach(function (realEngArry) {
                if (checkArry.name == realEngArry.Name && checkArry.grade == realEngArry.Grade && checkArry.level == realEngArry.Level) {


                    engCalMinus(checkArry.name, checkArry.finalDamagePer, checkArry.criticalChancePer, checkArry.criticalDamagePer, checkArry.atkPer, checkArry.atkSpeed, checkArry.moveSpeed, checkArry.carePower, checkArry.utilityPower, checkArry.engBonusPer)

                    engObj.finalDamagePer = (engObj.finalDamagePer * (checkArry.finalDamagePer / 100 + 1));
                    engObj.engBonusPer = (engObj.engBonusPer * (checkArry.engBonusPer / 100 + 1));
                    engObj.criticalChancePer = (engObj.criticalChancePer + checkArry.criticalChancePer);
                    engObj.criticalDamagePer = (engObj.criticalDamagePer + checkArry.criticalDamagePer);
                    engObj.atkPer = (engObj.atkPer + checkArry.atkPer);
                    engObj.atkSpeed = (engObj.atkSpeed + checkArry.atkSpeed);
                    engObj.moveSpeed = (engObj.moveSpeed + checkArry.moveSpeed);
                    engObj.carePower = (engObj.carePower + checkArry.carePower);

                    // console.log("------------------"+realEngArry.Name+"----------------")
                    // console.log("engFinalDamagePer : "+engFinalDamagePer)
                    // console.log("engCriticalChancePer : "+engCriticalChancePer)
                    // console.log("engCriticalDamagePer : "+engCriticalDamagePer)
                    // console.log("engAtkPer : "+engAtkPer)

                    stoneCalc(realEngArry.Name, checkArry.finalDamagePer)
                }
            })
        }


    })
    // 무효옵션 값 제거4티어만 해당
    function engCalMinus(name, finalDamagePer, criticalChancePer, criticalDamagePer, atkPer) {
        engravingCalFilter.forEach(function (FilterArry) {
            if (FilterArry.job == supportCheck()) {
                FilterArry.block.forEach(function (blockArry) {
                    if (blockArry == name) {
                        // console.log("무효옵션 : "+name)
                        engObj.finalDamagePer = (engObj.finalDamagePer / (finalDamagePer / 100 + 1));
                        engObj.criticalChancePer = (engObj.criticalChancePer - criticalChancePer);
                        engObj.criticalDamagePer = (engObj.criticalDamagePer - criticalDamagePer);
                        engObj.atkPer = (engObj.atkPer - atkPer);
                    }
                })
            }
        })
    }





    // 3티어 각인
    if (!data.ArkPassive.IsArkPassive) {

        let plusArry = []
        let perArry = []
        objExtrudeFnc(engObj, plusArry, perArry)


        data.ArmoryEngraving.Effects.forEach(function (lowEng) {
            engravingCheckFilterLowTier.forEach(function (filter) {

                let [, name, level] = lowEng.Name.match(/(.*)\sLv\.\s(\d+)/); //이름 레벨 분리
                let result = {
                    name: name.trim(),
                    level: Number(level)
                };

                if (result.name == filter.name && result.level == filter.level) {
                    engCalMinusLowTier(result, filter, plusArry, perArry)
                    plusArry.forEach(function (validValue) {
                        engObj[validValue] += filter[validValue]
                    })
                    perArry.forEach(function (validValue) {
                        engObj[validValue] *= (filter[validValue] / 100) + 1
                    })

                }
            })
        })
    }

    // 무효옵션 값 제거 3티어
    function engCalMinusLowTier(realEng, filterEng, plusArry, perArry) {

        engravingCalFilter.forEach(function (filter) {
            if (filter.job == supportCheck()) {
                filter.block.forEach(function (blockName) {
                    if (blockName == realEng.name && realEng.name == filterEng.name) {
                        plusArry.forEach(function (plusName) {
                            // console.log(filterEng.name)
                            // console.log(plusName)
                            // console.log(-filterEng[plusName])
                            engObj[plusName] -= filterEng[plusName]
                        })
                        perArry.forEach(function (perName) {
                            // console.log(filterEng.name)
                            // console.log(perName)
                            // console.log(-filterEng[perName])
                            engObj[perName] /= (filterEng[perName] / 100) + 1

                        })
                    }
                })
            }
        })
    }


    // 어빌리티스톤(곱연산 제거 후 곱연산+어빌리티스톤 적용)
    function stoneCalc(name, minusVal) {
        function notZero(num) {
            if (num == 0) {
                return 1;
            } else {
                return num / 100 + 1
            }
        }
        data.ArmoryEngraving.ArkPassiveEffects.forEach(function (stoneArry) {
            stoneCheckFilter.forEach(function (filterArry) {

                if (stoneArry.AbilityStoneLevel == filterArry.level && stoneArry.Name == filterArry.name && stoneArry.Name == name) {
                    engObj.finalDamagePer = (engObj.finalDamagePer) / notZero(minusVal) //퐁트라이커기준 저주받은 인형(돌맹이) 제거값
                    // console.log(stoneArry.Name+" 고유값 : "+notZero(minusVal))
                    // console.log(stoneArry.Name+" 제거된 값 : "+engFinalDamagePer)
                    // console.log("돌맹이 고유 값 : "+filterArry.finalDamagePer/100)

                    // engObj.finalDamagePer = parseFloat(engObj.finalDamagePer).toFixed(4)



                    engObj.finalDamagePer = (engObj.finalDamagePer * (notZero(minusVal) + filterArry.finalDamagePer / 100));
                    engObj.engBonusPer = (engObj.engBonusPer * (notZero(minusVal) + filterArry.engBonusPer / 100));
                    engObj.criticalChancePer = (engObj.criticalChancePer + filterArry.criticalChancePer);
                    engObj.criticalDamagePer = (engObj.criticalDamagePer + filterArry.criticalDamagePer);
                    engObj.atkPer = (engObj.atkPer + filterArry.atkPer);

                    engObj.atkSpeed = (engObj.atkSpeed + filterArry.atkSpeed);
                    engObj.moveSpeed = (engObj.moveSpeed + filterArry.moveSpeed);

                    // 유얼마하앍브레이커

                    // console.log("-----------------------"+stoneArry.Name+" : 돌맹이"+"---------------------")
                    // console.log("engFinalDamagePer : "+engFinalDamagePer)
                    // console.log("engCriticalChancePer : "+engCriticalChancePer)
                    // console.log("engCriticalDamagePer : "+engCriticalDamagePer)
                    // console.log("engAtkPer : "+engAtkPer)

                }
            })

        })
    }

    // 엘릭서

    let elixirObj = {
        atkPlus: 0,
        atkBuff: 0,
        weaponAtkPlus: 0,
        criticalDamagePer: 0,
        criticalChancePer: 0,
        criFinalDamagePer: 1,
        addDamagePer: 0,
        atkPer: 0,
        finalDamagePer: 1,
        carePower: 0,
        str: 0,
        dex: 0,
        int: 0,
    }


    elixirData.forEach(function (realElixir) {
        // console.log(realElixir.name)

        elixirCalFilter.forEach(function (filterArry) {
            if (realElixir.name == filterArry.name && !(filterArry.atkPlus == undefined)) {

                elixirObj.atkPlus += filterArry.atkPlus[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAtkPlus)

            } else if (realElixir.name == filterArry.name && !(filterArry.weaponAtkPlus == undefined)) {

                elixirObj.weaponAtkPlus += filterArry.weaponAtkPlus[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirWeaponAtkPlus)

            } else if (realElixir.name == filterArry.name && !(filterArry.criticalDamage == undefined)) {

                elixirObj.criticalDamagePer += filterArry.criticalDamagePer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirCriticalDamage)

            } else if (realElixir.name == filterArry.name && !(filterArry.addDamagePer == undefined)) {

                elixirObj.addDamagePer += filterArry.addDamagePer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAddDamagePer)

            } else if (realElixir.name == filterArry.name && !(filterArry.atkPer == undefined)) {

                elixirObj.atkPer += filterArry.atkPer[realElixir.level - 1]
                // console.log(realElixir.name+" : " + elixirAtkPer)

            } else if (realElixir.name == filterArry.name && !(filterArry.finalDamagePer == undefined)) {
                // console.log(realElixir.name)

                elixirObj.finalDamagePer *= filterArry.finalDamagePer[realElixir.level - 1] / 100 + 1
                // console.log(realElixir.name+" : " + elixirFinalDamagePer)

            } else if (realElixir.name == filterArry.name && !(filterArry.str == undefined)) {

                elixirObj.str += filterArry.str[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.dex == undefined)) {

                elixirObj.dex += filterArry.dex[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.dex[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.int == undefined)) {

                elixirObj.int += filterArry.int[realElixir.level - 1]
                // console.log(realElixir.name+" : " + filterArry.stats[realElixir.level - 1])

            } else if (realElixir.name == filterArry.name && !(filterArry.atkBuff == undefined)) {

                elixirObj.atkBuff += filterArry.atkBuff[realElixir.level - 1]

            } else if (realElixir.name == filterArry.name && !(filterArry.carePower == undefined)) {

                elixirObj.carePower += filterArry.carePower[realElixir.level - 1]
            }

        })
    })

    elixirCalFilter.forEach(function (arr) {

        // console.log("> 추가 피해 " == arr.name && !(arr.finalDamagePer == undefined))
        // console.log(arr.name)
        // console.log(arr.finalDamagePer)
    })


    // 더블엘릭서 N단계별 점수
    // let doubleElixirArry = ["회심","달인 (","강맹","칼날방패","선봉대"]
    // elixirData
    // containsTwoWord(data,doubleString)
    // elixirLevel



    function doubleElixir() {
        if (containsTwoWord(elixirData, "회심") && elixirLevel >= 40) {
            elixirObj.criFinalDamagePer *= 1.12
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "회심") && elixirLevel >= 35) {
            elixirObj.criFinalDamagePer *= 1.06
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 40) {
            elixirObj.criticalChancePer += 7
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "달인 (") && elixirLevel >= 35) {
            elixirObj.criticalChancePer += 7
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 40) {
            elixirObj.finalDamagePer *= 1.08
        } else if (containsTwoWord(elixirData, "강맹") && elixirLevel >= 35) {
            elixirObj.finalDamagePer *= 1.04
        } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 40) {
            elixirObj.finalDamagePer *= 1.08
        } else if (containsTwoWord(elixirData, "칼날방패") && elixirLevel >= 35) {
            elixirObj.finalDamagePer *= 1.04
        } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 40) {
            defaultObj.attackPow *= 1.03
            elixirObj.finalDamagePer *= 1.12
        } else if (containsTwoWord(elixirData, "선봉대") && elixirLevel >= 35) {
            defaultObj.attackPow *= 1.03
            elixirObj.finalDamagePer *= 1.06
        } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 40) {
            elixirObj.atkBuff += 14
        } else if (containsTwoWord(elixirData, "선각자") && elixirLevel >= 35) {
            elixirObj.atkBuff += 8
        } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 40) {
            elixirObj.atkBuff += 14
        } else if (containsTwoWord(elixirData, "신념") && elixirLevel >= 35) {
            elixirObj.atkBuff += 8
        } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 40) {
            elixirObj.atkBuff += 6
        } else if (containsTwoWord(elixirData, "진군") && elixirLevel >= 35) {
            elixirObj.atkBuff += 0
        }
    }
    doubleElixir()


    // console.log(elixirObj)

    let gemsCool = 0;
    let gemsCoolCount = 0;


    if (!(data.ArmoryGem.Gems == null)) {
        data.ArmoryGem.Gems.forEach(function (arry) {
            if (arry.Name.includes("10레벨 작열")) {
                gemsCool += 24
                gemsCoolCount += 1
            } else if (arry.Name.includes("9레벨 작열")) {
                gemsCool += 22
                gemsCoolCount += 1
            } else if (arry.Name.includes("8레벨 작열") || arry.Name.includes("10레벨 홍염")) {
                gemsCool += 20
                gemsCoolCount += 1
            } else if (arry.Name.includes("7레벨 작열") || arry.Name.includes("9레벨 홍염")) {
                gemsCool += 18
                gemsCoolCount += 1
            } else if (arry.Name.includes("6레벨 작열") || arry.Name.includes("8레벨 홍염")) {
                gemsCool += 16
                gemsCoolCount += 1
            } else if (arry.Name.includes("5레벨 작열") || arry.Name.includes("7레벨 홍염")) {
                gemsCool += 14
                gemsCoolCount += 1
            } else if (arry.Name.includes("4레벨 작열") || arry.Name.includes("6레벨 홍염")) {
                gemsCool += 12
                gemsCoolCount += 1
            } else if (arry.Name.includes("3레벨 작열") || arry.Name.includes("5레벨 홍염")) {
                gemsCool += 10
                gemsCoolCount += 1
            } else if (arry.Name.includes("2레벨 작열") || arry.Name.includes("4레벨 홍염")) {
                gemsCool += 8
                gesmCoolCount += 1
            } else if (arry.Name.includes("1레벨 작열") || arry.Name.includes("3레벨 홍염")) {
                gemsCool += 6
                gemsCoolCount += 1
            }
        })
    } else {
        gemsCool = 1
        gemsCoolCount = 1
    }
    // console.log(gemsCool)
    let gemsCoolAvg = ((gemsCool / gemsCoolCount)).toFixed(1)



    // 아크패시브

    let arkPassiveArry = [];
    let arkObj = {
        skillCool: 0,
        evolutionDamage: 0,
        enlightenmentDamage: 0,
        leapDamage: 0,
        criticalChancePer: 0,
        moveSpeed: 0,
        atkSpeed: 0,
        stigmaPer: 0,
        criticalDamagePer: 0,
        evolutionBuff: 0,
        enlightenmentBuff: 0,
        weaponAtk: 1,
    }

    data.ArkPassive.Effects.forEach(function (arkArry) {
        const regex = /<FONT.*?>(.*?)<\/FONT>/g;
        let match;
        while ((match = regex.exec(arkArry.Description)) !== null) {
            const text = match[1];
            const levelMatch = text.match(/(.*) Lv\.(\d+)/);
            if (levelMatch) {
                const name = levelMatch[1];
                const level = parseInt(levelMatch[2], 10);
                arkPassiveArry.push({ name, level });

            }
        }
    });
    // console.log(arkPassiveArry);

    arkPassiveArry.forEach(function (ark) {
        arkCalFilter.forEach(function (filter) {
            if (ark.name == filter.name && ark.level == filter.level) {
                arkAttrCheck(filter)
            }
        })
    })

    function arkAttrCheck(validValue) {
        let arkAttr = ['skillCool', 'evolutionDamage', 'criticalChancePer', 'moveSpeed', 'atkSpeed', 'stigmaPer', 'criticalDamagePer', 'evolutionBuff']
        arkAttr.forEach(function (attrArry) {
            if (!(validValue[attrArry] == undefined) && data.ArkPassive.IsArkPassive) {
                arkObj[attrArry] += validValue[attrArry];
            }
        })
    }

    let criticalChanceResult = (defaultObj.criticalChancePer + jobObj.criticalChancePer + engObj.criticalChancePer + accObj.criticalChancePer + bangleObj.criticalChancePer + arkObj.criticalChancePer + elixirObj.criticalChancePer) // 치명타 적중률
    let atkSpeedResult = (defaultObj.atkSpeed + jobObj.atkSpeed + engObj.atkSpeed + bangleObj.atkSpeed + arkObj.atkSpeed) // 최종 공속
    let moveSpeedResult = (defaultObj.moveSpeed + jobObj.moveSpeed + engObj.moveSpeed + bangleObj.moveSpeed + arkObj.moveSpeed) // 최종 이속



    // 뭉툭한 가시
    let evolutionArry = []
    data.ArkPassive.Effects.forEach(function (arkArry) {
        const regex = /<FONT.*?>(.*?)<\/FONT>/g;
        let match;

        if (arkArry.Name == 'evolution') {
            while ((match = regex.exec(arkArry.Description)) !== null) {
                const text = match[1];
                const levelMatch = text.match(/(.*) Lv\.(\d+)/);
                if (levelMatch) {
                    const name = levelMatch[1];
                    const level = parseInt(levelMatch[2], 10);
                    evolutionArry.push({ name, level });
                }
            }
        }
    })


    // 치명타 적중률 100% 이상시 100% 고정
    if (!evolutionOverCritical()) {
        criticalChanceResult = Math.min(criticalChanceResult, 100);
    }

    function evolutionOverCritical() {

        let check = false;
        for (let i = 0; i < evolutionArry.length; i++) {
            if (evolutionArry[i].name === "뭉툭한 가시") {
                check = true;
                return check
            }
        }

    }

    let spikeDamage = 0
    evolutionArry.forEach(function (evolution) {
        if (evolution.name == "뭉툭한 가시" && evolution.level == 1) {

            let overcritical = Math.max(criticalChanceResult - 80, 0);
            criticalChanceResult = Math.min(criticalChanceResult, 80);
            spikeDamage = Math.min(7.5 + overcritical * 1.2, 50)


        } else if (evolution.name == "뭉툭한 가시" && evolution.level == 2) {

            let overcritical = Math.max(criticalChanceResult - 80, 0);  //오버 치적
            criticalChanceResult = Math.min(criticalChanceResult, 80);
            spikeDamage = Math.min(15 + overcritical * 1.4, 70)

        }


        if (evolution.name == "음속 돌파" && evolution.level == 1) {

            let mStone = {
                damage: 0,
                atkSpeed: 0,
                moveSpeed: 0,
            }

            mStone.atkSpeed = atkSpeedResult
            mStone.moveSpeed = moveSpeedResult
            mStone.damage += mStone.atkSpeed * 0.05 + mStone.moveSpeed * 0.05

            if (atkSpeedResult > 40 && moveSpeedResult > 40) {

                let atkOverSpeed = atkSpeedResult - 40
                let moveOverSpeed = moveSpeedResult - 40
                mStone.damage += atkOverSpeed * 0.1 + moveOverSpeed * 0.1 + 4

            }
            mStone.damage = Math.min(mStone.damage, 12)




        } else if (evolution.name == "음속 돌파" && evolution.level == 2) {


            let mStone = {
                damage: 0,
                atkSpeed: 0,
                moveSpeed: 0,
            }

            mStone.atkSpeed = atkSpeedResult
            mStone.moveSpeed = moveSpeedResult
            mStone.damage += mStone.atkSpeed * 0.1 + mStone.moveSpeed * 0.1

            if (atkSpeedResult > 40 && moveSpeedResult > 40) {

                let atkOverSpeed = atkSpeedResult - 40
                let moveOverSpeed = moveSpeedResult - 40
                mStone.damage += atkOverSpeed * 0.2 + moveOverSpeed * 0.2 + 8

            }
            mStone.damage = Math.min(mStone.damage, 24)


        }
    })


    function arkPassiveValue(e) {
        let arkPassiveVal = data.ArkPassive.Points[e].Value
        return arkPassiveVal
    }



    if (arkPassiveValue(0) >= 120) { // arkPassiveValue(0) == 진화수치

        arkObj.evolutionDamage += 1.45

    } else if (arkPassiveValue(0) >= 105) {

        arkObj.evolutionDamage += 1.35

    } else if (arkPassiveValue(0) >= 90) {

        arkObj.evolutionDamage += 1.30

    } else if (arkPassiveValue(0) >= 80) {

        arkObj.evolutionDamage += 1.25

    } else if (arkPassiveValue(0) >= 70) {

        arkObj.evolutionDamage += 1.20

    } else if (arkPassiveValue(0) >= 60) {

        arkObj.evolutionDamage += 1.15

    } else if (arkPassiveValue(0) >= 50) {

        arkObj.evolutionDamage += 1.10

    } else if (arkPassiveValue(0) >= 40) {

        arkObj.evolutionDamage += 1
    }





    // enlightenmentArry
    if (arkPassiveValue(1) >= 100) { // arkPassiveValue(1) == 깨달음수치

        arkObj.enlightenmentDamage += 1.42
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 98) {

        arkObj.enlightenmentDamage += 1.40
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 97) {

        arkObj.enlightenmentDamage += 1.37
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 96) {

        arkObj.enlightenmentDamage += 1.37
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 95) {

        arkObj.enlightenmentDamage += 1.36
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 94) {

        arkObj.enlightenmentDamage += 1.36
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 93) {

        arkObj.enlightenmentDamage += 1.35
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 92) {

        arkObj.enlightenmentDamage += 1.35
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 90) {

        arkObj.enlightenmentDamage += 1.34
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 88) {

        arkObj.enlightenmentDamage += 1.33
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 86) {

        arkObj.enlightenmentDamage += 1.28
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 84) {

        arkObj.enlightenmentDamage += 1.27
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 82) {

        arkObj.enlightenmentDamage += 1.26
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 80) {

        arkObj.enlightenmentDamage += 1.25
        arkObj.enlightenmentBuff += 1.33

    } else if (arkPassiveValue(1) >= 78) {

        arkObj.enlightenmentDamage += 1.18
        arkObj.enlightenmentBuff += 1.32

    } else if (arkPassiveValue(1) >= 76) {

        arkObj.enlightenmentDamage += 1.17
        arkObj.enlightenmentBuff += 1.31

    } else if (arkPassiveValue(1) >= 74) {

        arkObj.enlightenmentDamage += 1.16
        arkObj.enlightenmentBuff += 1.30

    } else if (arkPassiveValue(1) >= 72) {

        arkObj.enlightenmentDamage += 1.15
        arkObj.enlightenmentBuff += 1.29

    } else if (arkPassiveValue(1) >= 64) {

        arkObj.enlightenmentDamage += 1.13
        arkObj.enlightenmentBuff += 1.28

    } else if (arkPassiveValue(1) >= 56) {

        arkObj.enlightenmentDamage += 1.125
        arkObj.enlightenmentBuff += 1.27

    } else if (arkPassiveValue(1) >= 48) {

        arkObj.enlightenmentDamage += 1.12
        arkObj.enlightenmentBuff += 1.26

    } else if (arkPassiveValue(1) >= 40) {

        arkObj.enlightenmentDamage += 1.115
        arkObj.enlightenmentBuff += 1.25

    } else if (arkPassiveValue(1) >= 32) {

        arkObj.enlightenmentDamage += 1.11
        arkObj.enlightenmentBuff += 1.24

    } else if (arkPassiveValue(1) >= 24) {

        arkObj.enlightenmentDamage += 1.10
        arkObj.enlightenmentBuff += 1.23

    } else {
        arkObj.enlightenmentDamage += 1
    }


    if (arkPassiveValue(2) >= 70) { // arkPassiveValue(2) == 도약 수치

        arkObj.leapDamage += 1.15

    } else if (arkPassiveValue(2) >= 68) {

        arkObj.leapDamage += 1.14

    } else if (arkPassiveValue(2) >= 66) {

        arkObj.leapDamage += 1.13

    } else if (arkPassiveValue(2) >= 64) {

        arkObj.leapDamage += 1.12

    } else if (arkPassiveValue(2) >= 62) {

        arkObj.leapDamage += 1.11

    } else if (arkPassiveValue(2) >= 60) {

        arkObj.leapDamage += 1.10

    } else if (arkPassiveValue(2) >= 50) {

        arkObj.leapDamage += 1.05

    } else if (arkPassiveValue(2) >= 40) {

        arkObj.leapDamage += 1.03

    } else {
        arkObj.leapDamage += 1
    }





    let gemObj = {
        atkBuff: 0,
        damageBuff: 0,
    }



    // 보석4종 레벨별 비율
    let gemPerObj = [
        { name: "겁화", level1: 8, level2: 12, level3: 16, level4: 20, level5: 24, level6: 28, level7: 32, level8: 36, level9: 40, level10: 44 },
        { name: "멸화", level1: 3, level2: 6, level3: 9, level4: 12, level5: 15, level6: 18, level7: 21, level8: 24, level9: 30, level10: 40 },
        { name: "홍염", level1: 2, level2: 4, level3: 6, level4: 8, level5: 10, level6: 12, level7: 14, level8: 16, level9: 18, level10: 20 },
        { name: "작열", level1: 6, level2: 8, level3: 10, level4: 12, level5: 14, level6: 16, level7: 18, level8: 20, level9: 22, level10: 24 },
    ]




    let gemSkillArry = [];
    let specialClass;

    // 유저가 착용중인 보석,스킬 배열로 만들기

    if (data.ArmoryGem.Gems != null) {
        data.ArmoryGem.Gems.forEach(function (gem) {

            data.ArmoryProfile.CharacterClassName

            let regex = />([^<]*)</g;
            let match;
            let results = [];
            while ((match = regex.exec(gem.Tooltip)) !== null) {
                results.push(match[1]);
            }


            results.forEach(function (toolTip, idx) {

                toolTip = toolTip.replace(/"/g, '');

                if (toolTip.includes(data.ArmoryProfile.CharacterClassName) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {

                    let etcGemValue = results[idx + 2].substring(0, results[idx + 2].indexOf('"'))
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1])
                    } else {
                        gemName = "기타보석"
                    }
                    // let obj = { name: results[idx+1], gem: gemName, level : level};
                    let obj = { skill: results[idx + 1], name: gemName, level: level };
                    gemSkillArry.push(obj)

                } else if (!(toolTip.includes(data.ArmoryProfile.CharacterClassName)) && /(^|[^"])\[([^\[\]"]+)\](?=$|[^"])/.test(toolTip) && toolTip.includes("Element")) {  // 자신의 직업이 아닌 보석을 장착중인 경우

                    // console.log(toolTip)
                    let gemName;
                    let level = null;
                    if (results[1].match(/홍염|작열|멸화|겁화/) != null) {
                        gemName = results[1].match(/홍염|작열|멸화|겁화/)[0];
                        level = Number(results[1].match(/(\d+)레벨/)[1])
                    } else {
                        gemName = "기타보석"
                    }
                    let obj = { skill: "직업보석이 아닙니다", name: gemName, level: level };
                    gemSkillArry.push(obj)

                }

            })

        })

    }


    // console.log(gemSkillArry)


    if (true) {

        let per = "홍염|작열";
        let dmg = "겁화|멸화";



        function skillCheck(arr, ...nameAndGem) {
            for (let i = 0; i < nameAndGem.length; i += 2) {
                const name = nameAndGem[i];
                const gemPattern = nameAndGem[i + 1];
                const regex = new RegExp(gemPattern);
                const found = arr.some(item => item.skill === name && regex.test(item.name));
                if (!found) return false;
            }
            return true;
        }
        function classCheck(className) {
            return supportCheck() == className;
        }



        if (classCheck("전태") && skillCheck(gemSkillArry, "버스트 캐넌", dmg)) {
            specialClass = "버캐 채용 전태";
        } else if (classCheck("세맥") && !skillCheck(gemSkillArry, "환영격", dmg)) {
            specialClass = "5멸 세맥";
        } else if (classCheck("핸건") && skillCheck(gemSkillArry, "데스파이어", dmg)) {
            specialClass = "7멸 핸건";
        } else if (classCheck("포강") && skillCheck(gemSkillArry, "에너지 필드", per)) {
            specialClass = "에필 포강";
        } else if (classCheck("환류") && skillCheck(gemSkillArry, "종말의 날", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("환류") && !skillCheck(gemSkillArry, "인페르노", dmg)) {
            specialClass = "6딜 환류";
        } else if (classCheck("질풍") && !skillCheck(gemSkillArry, "여우비 스킬", dmg)) {
            specialClass = "5멸 질풍";
        } else if (classCheck("그믐") && !skillCheck(gemSkillArry, "소울 시너스", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg) && !skillCheck(gemSkillArry, "마운틴 크래쉬", dmg)) {
            specialClass = "6겁 광기";
        } else if (classCheck("광기") && !skillCheck(gemSkillArry, "소드 스톰", dmg)) {
            specialClass = "7겁 광기";
        } else if (classCheck("포식") && !skillCheck(gemSkillArry, "페이탈 소드", dmg)) {
            specialClass = "크블 포식";
        } else if (classCheck("피메") && !skillCheck(gemSkillArry, "대재앙", dmg)) {
            specialClass = "6M 피메";
        } else if (classCheck("잔재") && skillCheck(gemSkillArry, "블리츠 러시", dmg)) {
            specialClass = "슈차 잔재";
        } else if (classCheck("억제") && !skillCheck(gemSkillArry, "피어스 쏜", dmg)) {
            specialClass = "데이터 없음";
        } else if (classCheck("야성") || classCheck("두동") || classCheck("환각") || classCheck("서폿") || classCheck("진실된 용맹") || classCheck("심판자") || classCheck("회귀")) {
            specialClass = "데이터 없음";
        } else {
            specialClass = supportCheck();
        }

    }
    // console.log("보석전용 직업 : ",specialClass)


    gemSkillArry.forEach(function (gemSkill, idx) {

        let realClass = classGemFilter.filter(item => item.class == specialClass);

        if (realClass.length == 0) {
            gemSkillArry[idx].skillPer = "none"
        } else {

            let realSkillPer = realClass[0].skill.filter(item => item.name == gemSkill.skill);

            if (realSkillPer[0] != undefined) {
                gemSkillArry[idx].skillPer = realSkillPer[0].per;
            } else {
                gemSkillArry[idx].skillPer = "none";
            }
        }
    })


    // 직업별 보석 지분율 필터
    let classGemEquip = classGemFilter.filter(function (filterArry) {
        return filterArry.class == specialClass;
    })
    //console.log(classGemEquip)

    function gemCheckFnc() {
        try {





            // console.log(classGemEquip)
            let realGemValue = classGemEquip[0].skill.map(skillObj => {

                let matchValue = gemSkillArry.filter(item => item.skill == skillObj.name);
                if (!(matchValue.length == 0)) {
                    // console.log(matchValue)
                    return {
                        name: skillObj.name,
                        per: skillObj.per,
                        gem: matchValue,
                    }
                }
            }).filter(Boolean);

            // console.log(realGemValue)
            // gemPerObj.name == realGemValue.name && realGemValue.gem.match(/멸화|겁화/g)[0];


            let coolGemTotal = 0;
            let count = 0;

            gemSkillArry.forEach(function (gemListArry) {
                if (gemListArry.name == "홍염" || gemListArry.name == "작열") {
                    let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                    // console.log(perValue[0][`level${gemListArry.level}`]);

                    coolGemTotal += perValue[0][`level${gemListArry.level}`];
                    count++;
                }
            })

            let averageValue = count > 0 ? coolGemTotal / count : 0;



            // console.log("평균값 : "+averageValue)

            let etcAverageValue;
            let dmgGemTotal = 0;
            let dmgCount = 0;

            // console.log(gemList)
            if (specialClass == "데이터 없음") {
                gemSkillArry.forEach(function (gemListArry) {
                    if (gemListArry.name == "멸화" || gemListArry.name == "겁화") {
                        let perValue = gemPerObj.filter(item => gemListArry.name == item.name);
                        // console.log(perValue[0][`level${gemListArry.level}`]);

                        dmgGemTotal += perValue[0][`level${gemListArry.level}`];
                        dmgCount++;
                    }
                })

                etcAverageValue = dmgCount > 0 ? dmgGemTotal / dmgCount : 0;
            } else {
                etcAverageValue = 1;
            }



            // 실제 유저가 장착한 보석의 딜 비율을 가져오는 함수
            function getLevels(gemPerObj, skillArray) {
                let result = [];


                skillArray.forEach(skill => {
                    if (skill.per != "etc") {
                        skill.gem.forEach(gem => {
                            let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                            if (!(gemObj == undefined)) {
                                let level = gemObj[`level${gem.level}`];
                                result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: skill.per });
                            }
                        });
                    } else if (skill.per == "etc") {
                        skill.gem.forEach(gem => {
                            let gemObj = gemPerObj.find(gemPerObj => gemPerObj.name == gem.name && (gem.name == "겁화" || gem.name == "멸화"));
                            if (!(gemObj == undefined)) {
                                let level = gemObj[`level${gem.level}`];
                                result.push({ skill: skill.name, gem: gem.name, per: level, skillPer: etcValue / etcLength });
                            }
                        });
                    }
                });
                return result;
            }
            // console.log(getLevels(gemPerObj, realGemValue))
            let gemValue = getLevels(gemPerObj, realGemValue).reduce((gemResultValue, finalGemValue) => {
                return gemResultValue + finalGemValue.per * finalGemValue.skillPer
            }, 0)


            // special skill Value 값 계산식
            function specialSkillCalc() {
                let result = 0;
                classGemEquip[0].skill.forEach(function (skill) {
                    if (skill.per != "etc") {
                        result += skill.per;
                    }
                })
                return 1 / result
            }


            // 홍염,작열 평균레벨
            return {
                specialSkill: specialSkillCalc(),
                originGemValue: gemValue,
                gemValue: (gemValue * specialSkillCalc()) / 100 + 1,
                gemAvg: averageValue,
                etcAverageValue: etcAverageValue / 100 + 1,
            }
        } catch (error) {
            console.log(error)
            return {
                specialSkill: 1,
                originGemValue: 1,
                gemValue: 1,
                gemAvg: 0,
                etcAverageValue: 1,
            }

        }
    }
    //console.log(gemCheckFnc())
    let finalGemDamageRate = gemCheckFnc()  // <==보석 딜지분 최종값

    // 원정대 힘민지
    let expeditionStats = Math.floor((data.ArmoryProfile.ExpeditionLevel - 1) / 2) * 5 + 5






    // "천상의 축복" > atkBuff 
    // "천상의 연주" > atkBuff
    // "묵법 : 해그리기" > atkBuff

    // "신성의 오라" > damageBuff
    // "세레나데 스킬" > damageBuff
    // "음양 스킬" > damageBuff




    // 서폿용 보석 스킬명, 스킬수치 구하기

    if (!(data.ArmoryGem.Gems == null) && supportCheck() == "서폿") {

        data.ArmoryGem.Gems.forEach(function (gem) {
            let atkBuff = ['천상의 축복', '천상의 연주', '묵법 : 해그리기']
            let damageBuff = ['신성의 오라', '세레나데 스킬', '음양 스킬']
            let gemInfo = JSON.parse(gem.Tooltip)
            let type = gemInfo.Element_000.value
            let level
            if (!(gemInfo.Element_004.value == null)) {
                level = gemInfo.Element_004.value.replace(/\D/g, "")
            }
            let skill
            if (!(gemInfo.Element_006.value.Element_001 == undefined)) {
                skill = gemInfo.Element_006.value.Element_001.match(/>([^<]+)</)[1]
            }

            atkBuff.forEach(function (buffSkill) {
                if (skill == buffSkill && type.includes("겁화")) {
                    gemObj.atkBuff += Number(level)
                }
            })

            damageBuff.forEach(function (buffSkill) {
                if (skill == buffSkill && type.includes("겁화")) {
                    gemObj.damageBuff += Number(level)
                }
            })

        })
    }




    // 추가 기본공격력 총합
    function gemAttackBonusCalc() {
        let regex = /:\s*([\d.]+)%/
        if (!(data.ArmoryGem.Effects.Description == "")) {
            return Number(data.ArmoryGem.Effects.Description.match(regex)[1])
        } else {
            return 0
        }
    }
    function abilityAttackBonusCalc() {
        let result = 0
        data.ArmoryEquipment.forEach(function (equip) {
            if (equip.Type == "어빌리티 스톤") {
                let regex = /기본 공격력\s\+([0-9.]+)%/;
                if (regex.test(equip.Tooltip)) {
                    result = Number(equip.Tooltip.match(regex)[1]);
                    return result
                }

            }
        })
        return result
    }

    let gemAttackBonus = gemAttackBonusCalc()
    let abilityAttackBonus = abilityAttackBonusCalc()

    // 전설/영웅 아바타 힘민지
    function avatarStatsCalc() {

        let result;

        const validTypes = ["무기 아바타", "머리 아바타", "상의 아바타", "하의 아바타"];
        const seenTypes = new Set();
        let bonusTotal = 0;
        let hasTopBottomLegendary = false;

        if (data.ArmoryAvatars != null) {
            data.ArmoryAvatars.forEach(item => {
                if ((item.Type === "상의 아바타" || item.Type === "하의 아바타") && item.Grade === "전설") {
                    hasTopBottomLegendary = true;
                }
            });
            data.ArmoryAvatars.forEach(item => {
                const isTopBottomAvatar = item.Tooltip.includes("상의&하의 아바타");
                if (validTypes.includes(item.Type) && !seenTypes.has(item.Type)) {
                    if (isTopBottomAvatar && !hasTopBottomLegendary) {
                        bonusTotal += 2;
                        seenTypes.add(item.Type);
                    } else if (item.Grade === "전설") {
                        bonusTotal += 2;
                        seenTypes.add(item.Type);
                    } else if (item.Grade === "영웅" && !seenTypes.has(item.Type)) {
                        bonusTotal += 1;
                        seenTypes.add(item.Type);
                    }
                }
            });

            result = bonusTotal / 100 + 1;
        } else {

            result = 1;
        }

        return result
    }

    let avatarStats = avatarStatsCalc()
    // console.log(avatarStats()) <= 전설/영웅 아바타 스텟

    let karmaPoint = (arkPassiveValue(1) - (data.ArmoryProfile.CharacterLevel - 50) - accObj.enlightPoint - 14)
    if (karmaPoint >= 6) {
        arkObj.weaponAtk = 1.021
    } else if (karmaPoint >= 5) {
        arkObj.weaponAtk = 1.017
    } else if (karmaPoint >= 4) {
        arkObj.weaponAtk = 1.013
    } else if (karmaPoint >= 3) {
        arkObj.weaponAtk = 1.009
    } else if (karmaPoint >= 2) {
        arkObj.weaponAtk = 1.005
    } else if (karmaPoint >= 1) {
        arkObj.weaponAtk = 1.001
    } else {
        arkObj.weaponAtk = 1
    }

    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0
    // 최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0최종 계산식 ver 2.0

    // console.log(defaultObj)
    // console.log(engObj)
    // console.log(accObj)
    // console.log(bangleObj)
    // console.log(arkObj)
    // console.log(elixirObj)
    // console.log(jobObj)
    // console.log(hyperObj)
    // console.log(gemObj)
    // console.log(expeditionStats)
    // console.log(gemAttackBonus())
    // console.log(abilityAttackBonus())
    // console.log(armorStatus())
    // console.log(avatarStats())
    // console.log(gemCheckFnc())




    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------
    // ---------------------------NEW 계산식 Ver 2.0 끗---------------------------




    let extractValue = {
        defaultObj,
        engObj,
        accObj,
        bangleObj,
        arkObj,
        elixirObj,
        jobObj,
        hyperObj,
        gemObj,
        expeditionStats,
        gemAttackBonus,
        abilityAttackBonus,
        armorStatus,
        avatarStats,
        finalGemDamageRate,
        criticalChanceResult,
    }
    return extractValue


}