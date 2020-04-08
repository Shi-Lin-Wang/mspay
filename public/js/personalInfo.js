//取得cookie的方法  固定在上面
function getCookie(name) {
    var arg = escape(name) + "=";
    var nameLen = arg.length;
    var cookieLen = document.cookie.length;
    //console.log(cookieLen);
    var i = 0;
    while (i < cookieLen) {
        var j = i + nameLen;
        if (document.cookie.substring(i, j) == arg) return getCookieValueByIndex(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function getCookieValueByIndex(startIndex) {
    var endIndex = document.cookie.indexOf(";", startIndex);
    if (endIndex == -1) endIndex = document.cookie.length;
    return unescape(document.cookie.substring(startIndex, endIndex));
}

//登出的方法  可以做參考，原理就只是把token的cookie刪除並回到首頁而已
function logout(){
    var now = new Date();
    now.setTime(now.getTime()-1000*600);
    document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=wtlab.ddns.net";
    //document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=140.127.74.168";
    window.location = "index.html";
}


//navbar get account
$(document).ready(function(){

  $token = getCookie("token");
  console.log($token);
  $.ajax({
    url:"http://127.0.0.1/wtlab108/php/navSigninCheck.php",  //呼叫的位址
    type:"GET",      //請求方式
    data:{"token": $token},//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    success: function(reData){     //成功的時候跑的函式
      console.log("Account Show Data");
      console.log(reData);
      var account = reData[0][0];
      $("#user").html("<span class='glyphicon glyphicon-user'></span> &nbsp "+account+"&nbsp <i class='fa fa-caret-down'></i>");
	  $("#navRight").html("Hi !  "+account);
	  $("#navPoint").attr("href", "http://wtlab.ddns.net:3000/SQL/" +account);
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });


  $.ajax({
    url:"http://127.0.0.1/wtlab108/php/personalInfo.php",
    type:"GET",
    dataType:'json',
    success: function(re){  //一開始進入檢視的名片顯示為自己的
      console.log(re);
      $("#acc").text(re[0].account);
      $("#company").text(re[0].company);
      $("#name").text(re[0].name);
      $("#position").text(re[0].position);
      $("#phone").text(re[0].phone);
      $("#companyTel").text(re[0].companyTel);
      $("#email").text(re[0].email);
      $("#fax").text(re[0].fax);
      $("#address").text(re[0].address);

      $("#myCard").val(re[0].name);
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });
});

// Accordion
function myAccFunc(demoAcc) {
	var demoAccID = (demoAcc.value);

	if($("#demoAcc"+demoAccID).attr('class').indexOf("w3-show") == -1){
		$("#demoAcc"+demoAccID).addClass("w3-show");
	} else {
		$("#demoAcc"+demoAccID).removeClass("w3-show");
	}
}
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}
