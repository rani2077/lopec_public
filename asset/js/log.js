// /* ############################## 페이지 접속 로그 저장  */
// index.php 
// /search/search.php 파일에서 직접 실행되어야 함.
/*
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
*/