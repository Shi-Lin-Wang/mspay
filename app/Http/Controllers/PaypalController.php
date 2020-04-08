<?php


namespace App\Http\Controllers;
use Illuminate\Foundation\Bus\DispatchesJobs;
use \PayPal\Api\Payer;
use \PayPal\Api\Item;
use \PayPal\Api\ItemList;
use \PayPal\Api\Details;
use \PayPal\Api\Amount;
use \PayPal\Api\Transaction;
use \PayPal\Api\RedirectUrls;
use \PayPal\Api\Payment;
use \PayPal\Exception\PayPalConnectionException;
//use App\Author;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use PayPal\Api\PaymentExecution;
use PayPal\Api\TransactionBase;

require __DIR__  . '/vendor/autoload.php';
//require_once __DIR__.'/../vendor/autoload.php';

//use Laravel\Lumen\Routing\Controller as BaseController;
//require "app\paypal\first.php";
/**class PaypalController extends Model
{
    /**
     * 指定数据连接为 w2le
     *
     * @var string
     */

//}
class PaypalController extends Controller
{

    use ApiResponser;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
     public function __construct()
    {
        //


    }

    /**public function __construct(PaypalService $paypalService)
    {
        //
        $this->$paypalService = $paypalService;
    }*/
     public function pay()
    {
       $paypal = new \PayPal\Rest\ApiContext(
        new \PayPal\Auth\OAuthTokenCredential(
        'AcJoLvUx_MsRVVPM_wWMj57uTmLuXG-UJuvC5bJAUTugcMXanphkDw8ag6amJZ2-xHmj-FJOMSqu_aYq',     // ClientID
        'EAnpXFJaws3xYVcz6plpoR46i1kNYOwr-qq58p7CEQHpBUmHZXA7U44Ki4QlVKOKxPJvI9KP2JXANggN'      // ClientSecret
    )

);
$DBname = 'wtlab108';
$DBhost = "127.0.0.1";
$DBuser = 'root';
$DBpass = '';

 // $connection = 'mysql';
$connection = mysqli_connect($DBhost, $DBuser, $DBpass);

//$connection = new mysqli($DBhost, $DBuser, $DBpass);
//mysqli_select_db($connection,$DBuser);
mysqli_query($connection,"SET NAMES utf8");
mysqli_select_db($connection,$DBname);
    header('Content-Type: application/json;charset=utf-8');
  $return_arr = array();
    //$token = $_COOKIE["token"];
    $storeID = $_GET["storeID"];


    //這邊傳入verifyToken的方法verifyToken 和getToken 去尋找token內部的值username 和time
    $acc=Auth::user();

    //$acc = $data->UserName;  //將data內的username取出放入acc

    //從資料庫獲得資料
    $sql = "SELECT *  FROM `cart_product` Where `customer`='$acc' AND `store`='$storeID'";

    $result =mysqli_query($connection, $sql);
   // DB::connection('mysql')->select('select * from wtlab108');
 //$results = DB::connection('mysql')->mysqli_query($connection, $sql);

    //$result=$connection->$results = DB::select("SELECT * FROM users");


    //if($result === true)
    //{
        //echo ("Error: ".mysqli_error($connection));
      //  exit();
    //}

    //這邊將抓到的資料放入陣列
    while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
        $row_array = $row;
        array_push($return_arr,$row_array);
    }


    //先把以前訂單編號最大找出來
    $sql = "SELECT MAX(orderNumber) FROM `storeorder_detail`";
    $result = mysqli_query($connection,$sql);
    $row = mysqli_fetch_array($result, MYSQLI_NUM);
    $ordernumber=$row[0]+1;
    //echo $ordernumber;


    //建立一個放總價的變數
    $totalPrice=0;
    //開始把每樣商品丟進storeorder_detail
      for($i=0;$i<count($return_arr);$i++){

            //先把價格抓出來
            $name=$return_arr[$i][2];
            $unitprice=$return_arr[$i][3];
            $amount=$return_arr[$i][4];
            $remark=$return_arr[$i][6];

            //算單樣總價
            $temp=$amount*$unitprice;
            $totalPrice+=$temp;
            $shipping = 0; //运费
            //$total = $unitprice+$shipping;
            //寫進資料庫
            $sql = "INSERT INTO `storeorder_detail`(`orderNumber`,`product`,`unitprice`, `amount`,`totalPrice`,`remark`)" .
                   "VALUES ('$ordernumber','$name','$unitprice','$amount','$temp','$remark')";
            mysqli_query($connection, $sql);


            //先把以前庫存找出來
            $sql = "SELECT `stock` FROM `product` WHERE `productName`='$name'";
            $result = mysqli_query($connection,$sql);
            $sqlStock = mysqli_fetch_array($result,MYSQLI_NUM);
            $stock=(int)$sqlStock[0]-(int)$amount;
            echo $stock;
            $sql = "UPDATE `product` SET `stock`='$stock' WHERE `productName`='$name'";
            mysqli_query($connection, $sql);
            //刪除掉購物車的東西
    }


    //這邊需要做出把購買人跟店家跟總額丟進訂單的功能
    date_default_timezone_set('Asia/Taipei');
    $date=date('Y-m-d  h:i:sa');
    $sql = "INSERT INTO `storeorder`(`orderNumber`,`status`, `customer`,`store`,`price`,`date`)".
           "VALUES ('$ordernumber','0','$acc','$storeID','$totalPrice',NOW())";
    mysqli_query($connection, $sql);

    $sql = "DELETE FROM `cart_product` WHERE customer='$acc' AND `store`='$storeID'";
    mysqli_query($connection, $sql);
    //header("Location:https://127.0.0.1/wtlab108/orderWithIOTA/paypal/paypal.php");
    //return redirect("pay");
    mysqli_free_result($result);
    mysqli_close($connection);
    //$query = app('db')->connection("mysql")->select($connection,"SET NAMES utf8");
    $payer = new Payer();
$payer->setPaymentMethod('paypal');
$item = new Item();
$item->setName($name) ->setCurrency('USD') ->setQuantity(1) ->setPrice($unitprice);
$itemList = new ItemList(); $itemList->setItems([$item]);
$details = new Details(); $details->setSubtotal($unitprice);
$amount = new Amount(); $amount->setCurrency('USD') ->setTotal($totalPrice) ->setDetails($details);
$transaction = new Transaction();
$transaction->setAmount($amount) ->setItemList($itemList) ->setDescription("支付描述内容") ->setInvoiceNumber(uniqid());
$redirectUrls = new \PayPal\Api\RedirectUrls();
//https://www.paypal.com/cgi-bin/webscr
$redirectUrls->setReturnUrl("http://localhost:8008/viewOrder")
//$redirectUrls->setReturnUrl("https://www.sandbox.paypal.com/cgi-bin/webscr")
    ->setCancelUrl("https://127.0.0.1/wtlab108/index.html");
$payment = new Payment();
$payment->setIntent('sale') ->setPayer($payer) ->setRedirectUrls($redirectUrls) ->setTransactions([$transaction]);

    try {
        $payment->create($paypal);
        }
    catch (PayPalConnectionException $e) {
        echo $e->getData();
        die();
    }

    $approvalUrl = $payment->getApprovalLink();
    header("Location: {$approvalUrl}");
     return redirect($approvalUrl);


}


    //
}


