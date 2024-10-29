// /* ############################## main insert */
// api 결과 받은 시점에 해당 변수 넘겨서 호출하면 디비에 저장
export var insertLopecApis = function(lapiCharacterNickname, lapiApiInfo) {
	var atMode		= "insertApi"; 	
	var saveDatas = {
		atMode : atMode
		, lapiCharacterNickname : lapiCharacterNickname
		, lapiApiInfo :lapiApiInfo
	}
	$.ajax({ 
		dataType	: "json"
		, type		: "POST"
		, url		: "/applications/process/lopecApi/"
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