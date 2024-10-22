// /* ############################## main insert */
export var insertLopecMains = function(lmanCharacterNickname, lmanCharacterLevel, lmanCharacterClass, lmanCharacterImage
						, lmanServer, lmanLevel, lmanGuild, lmanTitle, lmanDomain, lmanCard, lmanSearchHit) {
	var atMode		= "insertMain"; 	
	var saveDatas = {
		atMode : atMode
		, lmanCharacterNickname : lmanCharacterNickname
		, lmanCharacterLevel : lmanCharacterLevel
		, lmanCharacterClass : lmanCharacterClass
		, lmanCharacterImage : lmanCharacterImage
		, lmanServer : lmanServer
		, lmanLevel : lmanLevel
		, lmanGuild : lmanGuild
		, lmanTitle : lmanTitle
		, lmanDomain : lmanDomain
		, lmanCard : lmanCard
		, lmanSearchHit : lmanSearchHit
	}
	$.ajax({ 
		dataType	: "json"
		, type		: "POST"
		, url		: "/applications/process/lopecMain/"
		, data		: saveDatas
		, success	: function(msg) {
			console.log("msg : " + msg);
			console.log("msg.result : " + msg.result);
			if(msg.result == "S") {
				console.log("main insert result : LOPEC_MAIN 저장 성공");
			} else if(msg.result == "F") {
				console.log("main insert result : LOPEC_MAIN 저장 실패");
			} else if(msg.result == "E") {
				console.log("main insert result : LOPEC_MAIN 저장 Exception");
			} 
		}
	 	, error	: function(request, status, error) {
			console.log("main insert result : LOPEC_MAIN 저장 Error");
			console.log("request.status : " + request.status);
			console.log("request.responseText : " + request.responseText);
			console.log("request.error : " + request.error);
		}
	});	
}




/* ############################## main insert */
// export var insertLopecMains = function(lmanCharacterNickname, lmanCharacterLevel, lmanCharacterClass, lmanCharacterImage, lmanServer, lmanLevel, lmanGuild, lmanTitle, lmanDomain, lmanCard, lmanSearchHit) {
//     var atMode = "insertMain"; 
//     var saveDatas = { 
//         atMode: atMode,
//         lmanCharacterNickname: lmanCharacterNickname,
//         lmanCharacterLevel: lmanCharacterLevel,
//         lmanCharacterClass: lmanCharacterClass,
//         lmanCharacterImage: lmanCharacterImage,
//         lmanServer: lmanServer,
//         lmanLevel: lmanLevel,
//         lmanGuild: lmanGuild,
//         lmanTitle: lmanTitle,
//         lmanDomain: lmanDomain,
//         lmanCard: lmanCard,
//         lmanSearchHit: lmanSearchHit
//     };

//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "/applications/process/lopecMain/", true);
//     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 var msg = JSON.parse(xhr.responseText);
//                 console.log("msg : " + msg);
//                 console.log("msg.result : " + msg.result);
//                 if (msg.result === "S") {
//                     console.log("main insert result : LOPEC_MAIN 저장 성공");
//                 } else if (msg.result === "F") {
//                     console.log("main insert result : LOPEC_MAIN 저장 실패");
//                 } else if (msg.result === "E") {
//                     console.log("main insert result : LOPEC_MAIN 저장 Exception");
//                 }
//             } else {
//                 console.log("main insert result : LOPEC_MAIN 저장 Error");
//                 console.log("request.status : " + xhr.status);
//                 console.log("request.responseText : " + xhr.responseText);
//                 console.log("request.error : " + xhr.error);
//             }
//         }
//     };

//     xhr.send(JSON.stringify(saveDatas));
// };