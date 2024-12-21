// /* ############################## 검색 저장  */
// 검색과 동시에 캐릭터명 넘겨 주면 검색에 저장 / 검색 횟수 등을 판단하기 위한 용도
export var insertLopecSearch = function(lschCharactername) {
	var atMode = "insertSearch"; 	
	var saveDatas = {
		atMode : atMode
		, lschCharactername : lschCharactername
	}
	$.ajax({ 
		dataType	: "json"
		, type		: "POST"
		, url		: "/applications/process/lopecSearch/"
		, data		: saveDatas
		, success	: function(msg) {
			console.log("msg : " + msg);
			console.log("msg.result : " + msg.result);
			if(msg.result == "S") {
				console.log("log insert result : LOPEC_SEARCH 저장 성공");
			} else if(msg.result == "F") {
				console.log("log insert result : LOPEC_SEARCH 저장 실패");
			} else if(msg.result == "E") {
				console.log("log insert result : LOPEC_SEARCH 저장 Exception");
			} 
		}
	 	, error	: function(request, status, error) {
			// console.log("log insert result : LOPEC_SEARCH 저장 Error");
			// console.log("request.status : " + request.status);
			// console.log("request.responseText : " + request.responseText);
			// console.log("request.error : " + request.error);
		}
	});	
}
