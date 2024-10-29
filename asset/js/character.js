// /* ############################## character insert */
// api 결과 받은 시점에 파싱 후 각 개별값을 넘겨주면 디비에 저장
export var insertLopecCharacters = function(lchaCharacterNickname, lchaCharacterLevel, lchaCharacterClass, lchaCharacterImage
										, lchaServer, lchaLevel, lchaGuild, lchaTitle, lchaDomain, lchaCard, lchaTotalsum 
										, lchaPrevSpecpoint, lchaAtkpower, lchaEvolution, lchaEnlightment, lchaLeap, lchaBangle, lchaStigma
										, lchaAlltimebuff, lchaFullbuff, lchaEngravebonus, lchaCarepower) {
	var atMode		= "insertCharacter"; 	
	var lchaSearchHit = 0;
	var saveDatas = {
		atMode : atMode
		, lchaCharacterNickname : lchaCharacterNickname
		, lchaCharacterLevel : lchaCharacterLevel
		, lchaCharacterClass : lchaCharacterClass
		, lchaCharacterImage : lchaCharacterImage
		, lchaServer : lchaServer
		, lchaLevel : lchaLevel
		, lchaGuild : lchaGuild
		, lchaTitle : lchaTitle
		, lchaDomain : lchaDomain
		, lchaCard : lchaCard
		, lchaTotalsum : lchaTotalsum
		, lchaPrevSpecpoint : lchaPrevSpecpoint
		, lchaAtkpower : lchaAtkpower
		, lchaEvolution : lchaEvolution
		, lchaEnlightment : lchaEnlightment
		, lchaLeap : lchaLeap
		, lchaBangle : lchaBangle
		, lchaStigma : lchaStigma
		, lchaAlltimebuff : lchaAlltimebuff
		, lchaFullbuff : lchaFullbuff
		, lchaEngravebonus : lchaEngravebonus
		, lchaCarepower : lchaCarepower
		, lchaSearchHit : lchaSearchHit
	}
	$.ajax({ 
		dataType	: "json"
		, type		: "POST"
		, url		: "/applications/process/lopecCharacter/"
		, data		: saveDatas
		, success	: function(msg) {
			console.log("msg : " + msg);
			console.log("msg.result : " + msg.result);
			if(msg.result == "S") {
				console.log("main insert result : LOPEC_API 저장 성공");
			} else if(msg.result == "F") {
				console.log("main insert result : LOPEC_API 저장 실패");
			} else if(msg.result == "E") {
				console.log("main insert result : LOPEC_API 저장 Exception");
			} 
		}
	 	, error	: function(request, status, error) {
			console.log("main insert result : LOPEC_API 저장 Error");
			console.log("request.status : " + request.status);
			console.log("request.responseText : " + request.responseText);
			console.log("request.error : " + request.error);
		}
	});	
}
