//檢查確認密碼是否正確
function checkRepeatPassword() {
    var password = document.getElementById("signup-password").value;
    var repeatPassword = document.getElementById("signup-repeatPassword").value;
    if(password == repeatPassword) {
      console.log("兩次密碼相同");
        document.getElementById("checkRepeatPassword").innerHTML="<font color='green'>密碼相同</font>";
        //document.getElementById("checkRepeatPassword").innerHTML="<img src='good.png'>";
        document.getElementById("submit").disabled = false;
    }else {
    console.log("兩次密碼不相同");
        document.getElementById("checkRepeatPassword").innerHTML="<font color='red'>密碼不相同</font>";
        document.getElementById("submit").disabled = true;
    }
}
