<?php
// DB connection: $db_connection from db_connection.php
require 'db_connection.php';

date_default_timezone_set("Asia/Taipei");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 讀取前端傳送過來的JSON資料(F12->網路->酬載)
$data = json_decode(file_get_contents('php://input'), true);

// 檢查是否成功解析JSON資料
if ($data === null) {
    // 處理JSON解析失敗的情況
    echo "Failed to parse JSON data";
} else {
    // 檢查是否存在'action'鍵
    if (isset($data['action'])) {
        // 取得'action'的值
        $action = $data['action'];
    } else {
        echo "Missing 'action' key";
    }
}

// 根據'action'的值執行相應的操作
switch ($action) {
    case 'getAIResults':
        getAIResults();
        break;
    case 'getProductById':
        getProductById($data['productId']);
        break;
    default:
        echo json_encode(["success" => 0, "msg" => "無對應action: '$action'"]);
        break;
}

function getAIResults()
{
    global $db_connection;

    $allproducts = mysqli_query($db_connection, "SELECT * FROM 4b_2oaoi");

    if (mysqli_num_rows($allproducts) > 0) {
        $all_products = mysqli_fetch_all($allproducts, MYSQLI_ASSOC);
        echo json_encode(["success" => 1, "products" => $all_products]);
    } else {
        echo json_encode(["success" => 0, "msg" => "all-data.php沒抓到任何資料"]);
    }
}

function getProductById($productId)
{
    global $db_connection;

    if ($productId !== NULL) {
        $productById = mysqli_query($db_connection, "SELECT * FROM 4b_2oaoi WHERE 4b_2oaoi.Lot LIKE '%$productId%'");
    }

    if (mysqli_num_rows($productById) > 0) {
        $product_byId = mysqli_fetch_all($productById, MYSQLI_ASSOC);
        writeLog('getProductById', 'Success');
        echo json_encode(["success" => 1, "products" => $product_byId], JSON_UNESCAPED_UNICODE);
    } else if (mysqli_num_rows($productById) == 0) {
        $product_byId = mysqli_fetch_all($productById, MYSQLI_ASSOC);
        writeLog('getProductById', 'Success');
        echo json_encode(["success" => 1, "products" => $product_byId], JSON_UNESCAPED_UNICODE);
    } else {
        writeLog('getProductById', 'No Data Found');
        echo json_encode(["success" => 0, "msg" => "No Data Found"]);
    }
}

function writeLog($action, $status)
{
    $currentDate = date('Y-m-d');
    $logFile = 'C:\Users\K18330\Desktop\log\\' . $currentDate . '.txt';
    $currentTime = date('H:i:s');
    $logMessage = "$currentTime $action $status " . PHP_EOL;
    error_log($logMessage, 3, $logFile);
}
