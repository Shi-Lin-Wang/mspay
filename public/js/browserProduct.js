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

var url=window.location.toString(); //取得當前網址
var shopID=""; //參數中等號右邊的值
if(url.indexOf("?")!=-1){ //如果網址有"?"符號
	shopID = decodeURI(url.split("?")[1].split("=")[1]);
}

function start(){
 // $token = getCookie("token");
  //console.log($token);
  $.ajax({
    url:"/navSigninCheck",  //呼叫的位址
    type:"GET",      //請求方式
    data:"",//傳送到server的資料
    dataType:'json', //預期server回傳的形式
    success: function(reData){     //成功的時候跑的函式
      console.log("Account Show Data");
      console.log(reData);
      var account = reData[0][0];
      $("#user").html("<span class='glyphicon glyphicon-user'></span> &nbsp "+account+"&nbsp <i class='fa fa-caret-down'></i>");
	  $("#navRight").html("Hi !  "+account);
	  $("#navPoint").attr("href", "http://wtlab.ddns.net:3000/SQL/" +account);

	  if(shopID==0){
		  $("#shopName").text("Super WTLab's Shop");
	  }else{
		  $("#shopName").text("我們家 & Starbox 冷飲站");
	  }
    },
    error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
      console.log( errorThrown);
    }
  });

init();

	//ajax關鍵字搜尋
	var xhr=null;
	$('#query').keyup(function() {
        if(xhr){
            xhr.abort();//如果存在ajax的請求，就放棄請求
        }
        var inputText= $.trim(this.value);
		if(inputText!=""){//檢測鍵盤輸入的內容是否為空，為空就不發出請求
			$.ajax({
				url:"../searchPhp/suggestion.php",
				type:"GET",
				data:{"keyword": inputText,
					  "shopID": shopID
				},
				dataType:'json',
				success: function(product){

					if (product.length != 0) {//檢測返回的結果是否為空

						let lists = "<datalist id='keyword_list'>";
						$.each(product, function () {
							lists += "<option value="+this.productName+">";//遍歷出每一條返回的數據
						});
						lists+="</datalist>";
						$("#hint").html(lists);
					}
				},
				error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
				  console.log( errorThrown);
				}
			});
        }
    });
}
/*
$(function() {

});
*/
function init(){
	$("#query").val("");
	$.ajax({
		url:"/browserProduct1",
		type:"POST",
		data:{"id": shopID},//傳送到server的資料
		dataType:'json',
		success: function(product){
			showAll(product);
		},
		error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
		  console.log( errorThrown);
		}
	});
}
//----------------------------------------------------------------------------------------------
function slidingDescription(){
  // 預設標題區塊 .abgne_tip_gallery_block .caption 的 top
  var _titleHeight = 40; //35
  $('.abgne_tip_gallery_block').each(function(){
   // 先取得區塊的高及標題區塊等資料
   var $this = $(this),
	_height = $this.height(),
	$caption = $('.caption', $this),
	_captionHeight = $caption.outerHeight(true),
	_speed = 200;

   // 當滑鼠移動到區塊上時
   $this.hover(function(){
	// 讓 $caption 往上移動
	$caption.stop().animate({
	 top: _height - _captionHeight
	}, _speed);
	   }, function(){
	// 讓 $caption 移回原位
	$caption.stop().animate({
	 top: _height - _titleHeight
	}, _speed);
	});
  });

	$('.coverflow').css('max-width',$('.coverflow img').width()); //自動調整 carousel 尺寸
}

//https://www.minwt.com/webdesign-dev/html/15877.html

//----------------------------------------------------------------------------------------------
function showProduct(img,name,price,num, id){
	//alert(id+"inShow");
	//alert("num: "+num);
	var block = $('#block'+num);
	var check = $('<a/>')
	.html('<div class="abgne_tip_gallery_block" style="margin:0 auto;"><a href="/viewProduct?id='+id+'"><img src="../uploadImg/'+img+'" class="img-responsive" style="width:213px; height:213px;" alt="Image"></a>'+
		  '<div class="caption"><h4><a href="/viewProduct?id='+id+'" title="標題" style="line-height: 28px; margin-top:-3px; display:inline-block;">'+ name +'</a></h4><div class="desc" style="padding-right:10px; word-break: break-all;">'+
		  '$'+price+'</div></div></div><p>$'+price+'</p>')	 //viewProduct
	.appendTo(block);
}
//----------------------------------------------------------------------------------------------
function emptyBlock(){
	for(var i=0;i<=12;i++){ //9
		var block = $('#block'+i);
		block.empty(); //先清空再重寫html
	}
}
function keywordQuery(){
	var clickVal = $("#query").val();
	$.ajax({
		url:"../searchPhp/search.php",
		type:"POST",
		data:{"clickVal": clickVal,
			  "shopID": shopID
		},
		dataType:'json',
		success: function(product){
			emptyBlock();
			showAll(product);
		},
		error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
		console.log( errorThrown);
		}
	});
}
function categoryQuery(){
	//var clickVal = $("#query").val();
	//$('#sel1').val()
	$.ajax({
		url:"../searchPhp/searchCategory.php",
		type:"POST",
		data:{
			"sel1": $('#sel1').val(),
			"sel2": $('#sel2').val(),
			"sel3": $('#sel3').val(),
			"shopID": shopID
		},
		dataType:'json',
		success: function(product){
			emptyBlock();
			showAll(product);
		},
		error: function(jqXHR, textStatus, errorThrown){    //失敗的時候跑的函式
			console.log( errorThrown);
		}
	});
}
function showAll(product){

	$NumOfJData = product.length; //取得json總數
	$per = 12; //每頁顯示項目數量
	$pages = Math.ceil($NumOfJData/$per); //取得不小於值的下一個整數
	$page=1;
	$start = ($page-1)*$per; //每一頁開始的資料序號

	if($NumOfJData>=12){
		for (var i = 0; i < 12; i++) {  //一開始頁面先顯示
		showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1,product[i].productID);
		}
	}else{ //剩下需顯示的商品數<9
		for (var i = 0; i < $NumOfJData; i++) {  //一開始頁面先顯示
		showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1,product[i].productID);
		}
	}

	slidingDescription();

	$("#pagination").html('共 '+$NumOfJData+' 筆-共 '+$pages+' 頁'+
				"<br /><button type='button' id='first' class='btn btn-info' value='1'>首頁</button> &nbsp 第 ");

	for( $j=1 ; $j<=$pages ; $j++ ) {
		$("#pagination").append('<button type="button" class="pageBtn btn-info" value='+$j+'>'+$j+'</button> &nbsp');
		/*
		if ( $page-3 < $j && $j < $page+3 ) {
			$("#pagination").append('<button type="button" class="pageBtn btn-info" value='+$j+'>'+$j+'</button> &nbsp');
		}
		*/
	}
	$("#pagination").append("頁 &nbsp <button type='button' id='last' class='btn btn-info' value='"+$pages+"'>末頁</button><br /><br />");


	$(".pageBtn, #first, #last").click(function() {
		emptyBlock();
		var nowPage = this.value;

		/*
		$pages = Math.ceil($NumOfJData/9); //取得不小於值的下一個整數
		$page=nowPage;

		$("#pagination").html('共 '+$NumOfJData+' 筆-共 '+$pages+' 頁'+
				"<br /><button type='button' id='first' class='btn btn-info' value='1'>首頁</button> &nbsp 第 ");
		$limit = parseInt(nowPage, 10)+2;

		for( $k=nowPage ; $k<=$limit ; $k++ ) {
			if ( $k <= $pages ) {
				$("#pagination").append('<button type="button" class="pageBtn btn-info" value='+$k+'>'+$k+'</button> &nbsp');
			}
		}
		*/
		if($NumOfJData-12*(nowPage-1)>=12){
			for (var i = 12*(nowPage-1) ; i < 12*(nowPage-1)+12; i++) {
					showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1-12*(nowPage-1),product[i].productID);
			}
		}else{ //剩下需顯示的商品數<9
			for (var i = 12*(nowPage-1) ; i < $NumOfJData; i++) {
				showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1-12*(nowPage-1),product[i].productID);
			}
		}
		slidingDescription();
	});
}
/*
function test(NumOfJData, nowPage, product){
	if(NumOfJData-9*(nowPage-1)>=9){
		for (var i = 9*(nowPage-1) ; i < 9*(nowPage-1)+9; i++) {
			showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1-9*(nowPage-1),product[i].productID);
		}
	}else{ //剩下需顯示的商品數<9
		for (var i = 9*(nowPage-1) ; i < NumOfJData; i++) {
			showProduct(product[i].productImage,product[i].productName,product[i].productPrice,i+1-9*(nowPage-1),product[i].productID);
		}
	}
	slidingDescription();
}
	*/

function logout(){
	var now = new Date();
	now.setTime(now.getTime()-1000*600);
	document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=wtlab.ddns.net";
	//document.cookie = "token=null;expires="+now.toGMTString()+";path=/wtlab108;domain=140.127.74.168";
	window.location = "../../index.html";
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

function checkForm(){
	if(!$('#sel3').val()){
		alert("請選擇分類");
		$("#categorySet").css("color", "red").css("font-weight","bold");
		return false;
	}else{
		categoryQuery();
	}
	return true;
}
