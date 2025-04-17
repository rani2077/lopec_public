// // /* ############################## character insert */
// // api 결과 받은 시점에 파싱 후 각 개별값을 넘겨주면 디비에 저장
// export var insertLopecCharacters = function (lchaCharacterNickname, lchaCharacterLevel, lchaCharacterClass, lchaCharacterImage
// 	, lchaServer, lchaLevel, lchaGuild, lchaTitle, lchaTotalsum, lchaTotalsumSupport
// 	, lchaAlltimebuff, lchaFullbuff, lchaEvoKarma, lchaVersion) {
// 	return new Promise((resolve, reject) => { // Promise 객체를 반환
// 		var atMode = "insertCharacter";
// 		/**
// 		 *
// 		 * {
// 		 * "nickname": "로스트다람쥐",
// 		 * "characterLevel": 70,
// 		 * "characterClass": "황후 아르카나",
// 		 * "characterImage": "2371",
// 		 * "server": "니나브",
// 		 * "itemLevel": 1685.83,
// 		 * "guild": "모코코칩스",
// 		 * "title": "이클립스",
// 		 * "totalSum": 1138.85,
// 		 * "totalSumSupport": 200.27,
// 		 * "allTimeBuff": 33,
// 		 * "fullBuff": 71,
// 		 * "karma": 0,
// 		 * "version": "2.0"
// 		 * }
// 		 *
// 		 */
// 		var saveDatas = {
// 			// atMode : atMode
// 			nickname: lchaCharacterNickname
// 			, characterLevel: lchaCharacterLevel
// 			, characterClass: lchaCharacterClass
// 			, totalStatus: lchaCharacterImage
// 			, server: lchaServer
// 			, itemLevel: lchaLevel
// 			, guild: lchaGuild
// 			, title: lchaTitle
// 			, totalSum: lchaTotalsum
// 			, totalSumSupport: lchaTotalsumSupport
// 			, allTimeBuff: lchaAlltimebuff
// 			, fullBuff: lchaFullbuff
// 			, karma: "0"
// 			, version: "2.0"
// 			// , lchaSearchHit : lchaSearchHit
// 		}

// 		$.ajax({
// 			dataType: "json"
// 			, type: "POST"
// 			, url: "https://lopec.o-r.kr/api/character"
// 			, data: JSON.stringify(saveDatas)
// 			, contentType: "application/json"
// 			, success: function (msg) {
// 				// console.log("best score info : " + JSON.stringify(msg));
// 				// console.log("totalSum : " + msg.totalSum);
// 				// console.log("totalSumSupport : " + msg.totalSumSupport);
// 				// console.log(msg)
// 				if (msg.result == "S") {
// 					// console.log("LOPEC_API 저장 성공");
// 				} else if (msg.result == "F") {
// 					// console.log("LOPEC_API 저장 실패");
// 				} else if (msg.result == "E") {
// 					// console.log("LOPEC_API 저장 Exception");
// 				}
// 				resolve(msg); // 성공 시 resolve 함수를 호출하며 msg 값을 전달
// 			}
// 			, error: function (request, status, error) {
// 				//console.log("LOPEC_API 저장 Error");
// 				//console.log("request.status : " + request.status);
// 				//console.log("request.responseText : " + request.responseText);
// 				//console.log("request.error : " + request.error);
// 				reject(error); // 실패 시 reject 함수를 호출하며 에러를 전달
// 			}
// 		});
// 	});
// }

export var insertLopecCharacters = function (lchaCharacterNickname, lchaCharacterLevel, lchaCharacterClass, lchaCharacterImage
	, lchaServer, lchaLevel, lchaGuild, lchaTitle, lchaTotalsum, lchaTotalsumSupport
	, lchaAlltimebuff, lchaFullbuff, lchaEvoKarma, lchaVersion) {
	return new Promise((resolve, reject) => { // Promise 객체를 반환
		var atMode = "insertCharacter";
		/**
		 *
		 * {
		 * "nickname": "로스트다람쥐",
		 * "characterLevel": 70,
		 * "characterClass": "황후 아르카나",
		 * "characterImage": "2371",
		 * "server": "니나브",
		 * "itemLevel": 1685.83,
		 * "guild": "모코코칩스",
		 * "title": "이클립스",
		 * "totalSum": 1138.85,
		 * "totalSumSupport": 200.27,
		 * "allTimeBuff": 33,
		 * "fullBuff": 71,
		 * "karma": 0,
		 * "version": "2.0"
		 * }
		 *
		 */
		var saveDatas = {
			nickname: lchaCharacterNickname
			, characterLevel: lchaCharacterLevel
			, characterClass: lchaCharacterClass
			, totalStatus: lchaCharacterImage
			, server: lchaServer
			, itemLevel: lchaLevel
			, guild: lchaGuild
			, title: lchaTitle
			, totalSum: lchaTotalsum
			, totalSumSupport: lchaTotalsumSupport
			, allTimeBuff: lchaAlltimebuff
			, fullBuff: lchaFullbuff
			, karma: "0"
			, version: "2.0"
		}

		fetch("https://lopec.o-r.kr/api/character", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(saveDatas)
		})
			.then(response => {
				if (!response.ok) {
					// 서버 응답이 실패인 경우 에러를 발생시킵니다.
					return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, body: ${text}`); });
				}
				return response.json();
			})
			.then(msg => {
				// console.log("best score info : " + JSON.stringify(msg));
				// console.log("totalSum : " + msg.totalSum);
				// console.log("totalSumSupport : " + msg.totalSumSupport);
				// console.log(msg)
				if (msg.result == "S") {
					// console.log("LOPEC_API 저장 성공");
				} else if (msg.result == "F") {
					// console.log("LOPEC_API 저장 실패");
				} else if (msg.result == "E") {
					// console.log("LOPEC_API 저장 Exception");
				}
				resolve(msg); // 성공 시 resolve 함수를 호출하며 msg 값을 전달
			})
			.catch(error => {
				// console.log("LOPEC_API 저장 Error");
				// console.error(error);
				reject(error); // 실패 시 reject 함수를 호출하며 에러를 전달
			});
	});
}