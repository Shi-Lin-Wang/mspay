var account_haruUse="";


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
  $.ajax({
    url:"../php/navSigninCheck.php",  //呼叫的位址
    type:"GET",      //請求方式
    data:"",//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    success: function(reData){     //成功的時候跑的函式
      console.log("Account Show Data");
      console.log(reData);
      var account = reData[0][0];
      account_haruUse=account;
      $("#user").html("<span class='glyphicon glyphicon-user'></span> &nbsp "+account+"&nbsp <i class='fa fa-caret-down'></i>");
	  $("#navRight").html("Hi !  "+account);
	  $("#navPoint").attr("href", "http://127.0.0.1:3000/SQL/" +account);
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });

}




var storeID="";
var totalprice=0;
$(document).ready(function(){
  //檢查登入狀態
  if(getCookie("token") != "" &&getCookie("token") != null ){
      if(!getCookie("authOver")){
      }else{		//authOver = true
          alert("等候逾時，請重新登入");
          window.location = "https://127.0.0.1/wtlab108/index.html";
      }
  }
  console.log("checkState結束");


  //ajax處理    用來抓購物車內資料  然後放入表格內容(tbody)
  var url=window.location.toString(); //取得當前網址
    var id=""; //參數中等號右邊的值
    if(url.indexOf("?")!=-1){ //如果網址有"?"符號
      id = decodeURI(url.split("?")[1].split("=")[1]);
    }
    storeID=id;
    console.log(storeID);
  $.ajax({
    url:"/getcartDetail",  //呼叫的位址
    type:"GET",      //請求方式
    data:{'storeID':storeID},//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    async:false,     //非同步
    success: function(reData){     //成功的時候跑的函式
      console.log("This is Cart's Data");
      console.log(reData);

      //資料丟進表格

      var cartTbody="";
      for( var i=0 ; i<reData.length ; i++){
        cartTbody +="<tr>";
        for( var j=2 ; j<reData[i].length ; j++){
            cartTbody +="<td>"+reData[i][j]+"</td>";
        }
        //刪除按鈕
        cartTbody +="<td><button class='btn btn-default delete_button'><i class='material-icons'>delete</i></button></td>";
        totalprice+=parseInt(reData[i][5]);
        cartTbody+="</tr>";
      }
      cartTbody +="<tr><td></td><td></td><td>"+"合計"+"</td><td>"+totalprice+"</td><td></td></tr>";


      var button = "<button id='checkOut' class='btn btn-primary' onclick='sendOrder2()' disabled=true>結帳</button>";
      button +="&nbsp;&nbsp;<button class='btn btn-primary' onclick='window.location=\"../browserProduct?id="+storeID+"\"'>繼續購物</button>";
      $("#cartTbody").html(cartTbody);//history.go(-2)"
      $("#button").html(button);//history.go(-2)"
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });
  //ajax結束

  //刪除按鈕的操作
  $(function () {
    $(".delete_button").click(function () {
      var product=$(this).parent().parent().find("td").eq(0).html();

      //ajax 去刪除購物車內的東西
      $.ajax({
        url:"/CartDelete",  //呼叫的位址
        type:"GET",      //請求方式
        data:{"product":product},//傳送到server的資料
        dataType:'text', //預期server回傳的形式
        async:false,     //非同步
        success: function(reData){     //成功的時候跑的函式
           window.location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
          console.log( errorThrown);
        }
      })
      //ajax結束*/
    });
  });


}); //document.ready結束



//測試

function sendOrder2(){
  if($('#cash').prop("checked")){
      //alert("cash");
      window.location="/CartToOrder?storeID="+storeID;
  }else if($('#iotaPay').prop("checked")){
      window.location="php/iotaPay.php?storeID="+storeID+"&price="+totalprice/10+"i";
      //alert("iotaPay");

  } else if($('#paypal').prop("checked")){
      //window.location="http://127.0.0.1/laravel/public/pay?storeID="+storeID;
	 //window.location="http://localhost:8003/pay?storeID="+storeID;
	window.location="http://localhost:8003/pay?storeID="+storeID;



  }else{
      alert("地球很危險的");
  }

}

//結帳按鈕的設定
function sendOrder(){
  var cartAmount=0;

  $.ajax({
    url:"/getCartAmount",  //呼叫的位址
    type:"GET",      //請求方式
    data:{'store':storeID},//傳送到server的資料
    dataType:'text', //預期server回傳的形式
    async:false,     //非同步
    success: function(reData){     //成功的時候跑的函式
      console.log(reData);
      cartAmount=parseInt(reData);

    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  })

   if(cartAmount>0){
     //ajax orderNumber
     var orderID="";
     $.ajax({
       url:"php/getOrderID.php",  //呼叫的位址
       type:"GET",      //請求方式
       data:{},//傳送到server的資料
       dataType:'text', //預期server回傳的形式
       async:false,     //非同步
       success: function(reData){     //成功的時候跑的函式
         console.log(reData);
         orderID=reData;
       },
       error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
         console.log( errorThrown);
       }
     })
     //ajax結束*/
     console.log("account_haruUse="+account_haruUse);


     //ajax line notify
     /*
     $.ajax({
       url:"https://script.google.com/macros/s/AKfycbxjVt6c5ckQnLNb_y-2nABdCS-x_GluzYWnIaBXKQ/exec?",  //呼叫的位址
       type:"GET",      //請求方式
       data:{"customer":account_haruUse,
             "orderID":orderID,
             "orderCheck":"https://127.0.0.1/wtlab108/orderWithIOTA/orderCheck.php?orderID="+orderID},//傳送到server的資料
       dataType:'text', //預期server回傳的形式
       async:false,     //非同步
       success:{},
       error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
         console.log( errorThrown);
       }
     })*/
     //ajax結束*/

   }
   window.location="/CartToOrder?storeID="+storeID;
}


function logout(){
	var now = new Date();
	now.setTime(now.getTime()-1000*600);
	document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=127.0.0.1";
	//document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=140.127.74.168";
    window.location = "/logout";
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



//顯示密碼的切換
$(function(){
  $('#iotaPay').click(function(){
  // 如果是勾選則...
      if(this.checked){
          $('#price').html("總共："+totalprice/10+" i")
          $('#checkOut').attr("disabled",false);
      }
  });
  $('#cash').click(function(){
  // 如果是勾選則...
      if(this.checked){
          $('#price').html("總共："+totalprice +" NTD")
          $('#checkOut').attr("disabled",false);
      }
  });

    $('#paypal').click(function(){
  // 如果是勾選則...
      if(this.checked){
          $('#price').html("總共："+totalprice +" NTD")
          $('#checkOut').attr("disabled",false);
      }
  });
});
