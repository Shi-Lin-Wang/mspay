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

//http://www.eion.com.tw/Blogger/?Pid=1130
/*
	1. homepage get failToLogin //  return int
	2. homepage get token //
	3. homepage get AuthOver (true or false)
*/
//進入登入頁面時做的動作，如果網頁有cookie則檢查登入狀態
function index(){
    //console.log("yaya"+document.cookie.length);
    if(document.cookie.length>0){
        checkLoginState();
    }
}

//檢查登入狀態
function checkLoginState(){
    console.log("checkState");
    checkSignState();
    if(getCookie("failToLogin") != null ){
        loginLimit();
    }else{
  	    if(getCookie("token") != "" &&getCookie("token") != null ){
  		      if(!getCookie("authOver")){
  			        console.log(getCookie("token"));
                window.location = "https://wtlab.ddns.net/wtlab108/testChing/chooseShop.html";
  		      }else{		//authOver = true
  			        alert("等候逾時，請重新登入");
  			        window.location = "https://wtlab.ddns.net/wtlab108/index.html";
  		      }
  	    }
    }
      console.log("checkState結束");
}

//檢查登入次數
function loginLimit(){
    if(getCookie("failToLogin") < 5){
		    alert("帳號密碼錯誤，請重新再試\n" + "剩餘嘗試次數: " + (5 - parseInt(getCookie("failToLogin"))) + "次");
	  }else{		//failToLogin >= 3
		    alert("登入失敗次數過多，請於5分鐘後再試!");
	  }
}

//檢查註冊狀態
function checkSignState(){
    console.log("checkSignState");
    var now = new Date();
    now.setTime(now.getTime()-1000*600);
    var signinError=getCookie("signError");
    if( signinError == "true" ){
        alert("該帳號或手機已被註冊");
    }else if( signinError == "false" ){
        alert("帳號註冊成功");
    }
    //顯示完錯誤訊息後刪除這個cookie
    document.cookie = "signError=null;expires="+now.toGMTString()+";path=/wtlab108;domain=wtlab.ddns.net";
    //到學校改成這ㄍ
    //document.cookie = "signError=null;expires="+now.toGMTString()+";path=/;domain=140.127.74.168";
    console.log("checkSignState結束");
}




//顯示密碼的切換
$(function(){
    //先取得 #password1 及產生一個文字輸入框
	  var $password = $("#password");
		var $passwordInput = $("<input type='text' class='form-control form-singin-input' id='password' name='password' placeholder='Password' required>");
    //$passwordInput = $('<input type="text" name="' + $password.attr('name') + '" class="' + $password.attr('className') + '" />');
    //當勾選顯示密碼框時
    $('#show_password').click(function(){
		// 如果是勾選則...
        if(this.checked){
			      // 用 $passwordInput 來取代 $password
			      // 並把 $passwordInput 的值設為 $password 的值
			      $password.replaceWith($passwordInput.val($password.val()));
		    }else{
			      // 用 $password 來取代 $passwordInput
			      // 並把 $password 的值設為 $passwordInput 的值
		     	  $passwordInput.replaceWith($password.val($passwordInput.val()));
		    }
    });
});


/*
//跳出model的方法
function signupFormPop(){
    document.getElementById("signup-pop").style.display="block";
    document.getElementById("signup-form").reset();
}
//model內部取消按鈕的方法
function signupFormCancel(){
    document.getElementById("signup-pop").style.display="none";
    document.getElementById("checkRepeatPassword").innerHTML="&nbsp;";
}

//檢查確認密碼是否正確
function checkRepeatPassword() {
    var password = document.getElementById("signup-password").value;
    var repeatPassword = document.getElementById("signup-repeatPassword").value;
    if(password == repeatPassword) {
          document.getElementById("checkRepeatPassword").innerHTML="<font color='green'>兩次密碼相同</font>";
        //document.getElementById("checkRepeatPassword").innerHTML="<img src='good.png'>";
        document.getElementById("submit").disabled = false;
    }else {
        document.getElementById("checkRepeatPassword").innerHTML="<font color='red'>兩次密碼不相同</font>";
        document.getElementById("submit").disabled = true;
    }
}

*/
