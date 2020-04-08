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

window.addEventListener( "load", start, false );

function start(){
 // $token = getCookie("token");
  //console.log($token);
  $.ajax({
    url:"/navSigninCheck",  //呼叫的位址
    type:"GET",      //請求方式
    data:{},//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    success: function(reData){     //成功的時候跑的函式
      console.log("Account Show Data");
      console.log(reData);
      var account = reData[0][0];
     $("#user").html("<span class='glyphicon glyphicon-user'></span> &nbsp "+account+"&nbsp <i class='fa fa-caret-down'></i>");
	 $("#navRight").html("Hi !  "+account);
	 $("#navPoint").attr("href", "http://127.0.0.1:3000/SQL/" +account);
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });

}

$(document).ready(function(){
  //ajax處理  用來抓訂單資料  然後用表格做顯示
  $.ajax({
    url:"/getOrder",  //呼叫的位址
    type:"GET",      //請求方式
    data:{},//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    async:false,     //非同步
    success: function(reData){     //成功的時候跑的函式
      console.log("Show Data");
      console.log(reData);

      //資料丟進表格
      var orderTbody="";
      for( var i=0 ; i<reData.length ; i++){
        orderTbody += "<tr>";
        orderTbody += "<td>"+reData[i].date+"</td>";
        orderTbody += "<td>"+reData[i].orderNumber+"</td>";

        var store="";
        switch (reData[i].store) {
          case "0":
            store="Super WTLab's Shop";
            break;
          case "1":
            store="我們家 & Starbox 冷飲站";
            break;
        }
        orderTbody += "<td>"+store+"</td>";
        orderTbody += "<td>"+reData[i].price+"</td>";

        var status="";
        switch (reData[i].status) {
          case "0":
            status="交易完成";
            break;
          case "1":
            status="交易中";
            break;1
          case "2":
            status="交易完成";
            break;
        }
        orderTbody += "<td>"+status+"</td>";

        //兩個按鈕
        orderTbody += "<td><a class='btn btn-primary' href='https://127.0.0.1/wtlab108/orderWithIOTA/viewOrderDetail.php?orderID="+reData[i][0]+"'>查看訂單明細</a>&nbsp;&nbsp;";

        if(status=="交易中"){
        orderTbody += "<a class='btn btn-primary' href='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://127.0.0.1/wtlab108/orderWithIOTA/php/QR.php?orderID="+reData[i][0]+"'>顯示QRCODE</a>";
        }
        orderTbody += "</td>";
        orderTbody+= "</tr>";
      }

      $("#orderTbody").html(orderTbody);//history.go(-2)"
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });
  //ajax結束

}); //document.ready結束

function logout(){
	var now = new Date();
	now.setTime(now.getTime()-1000*600);
	document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=127.0.0.1";
	//document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=140.127.74.168";
	window.location = "../index.html";
}

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
