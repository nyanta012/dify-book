/**
 * POSTリクエストを処理し、請求書データをスプレッドシートに登録します
 * HTTPステータスコードは常に200を返します
 * 処理結果はレスポンスボディのstatusフィールドで判断してください
 */

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    add_sheet(postData);
    return createResponse(200, "Successfully added");
  } catch (error) {
    return createResponse(400, error.message);
  }
}

/**
 * スプレッドシートに請求書データを追加します
 * シートが空の場合はヘッダーを追加し、データは新しい行として追加されます
 */
function add_sheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = ["請求番号", "取引先名", "請求金額", "支払期限"];
  
  // ヘッダーの確認と追加
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // データを配列に変換
  const rowData = headers.map(header => data[header] || "");
  
  // 新しい行にデータを追加
  const nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1, 1, headers.length).setValues([rowData]);
}

/**
 * APIレスポンスを生成します
 */
function createResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({
    status: status,
    message: message
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * APIの動作確認用のテスト関数です
 * 正常系のテストケースを実行します
 */
function test_add_sheet() {
  const testData = {
    "請求番号": "INV-001",
    "取引先名": "テスト株式会社",
    "請求金額": "100000",
    "支払期限": "2024-12-31"
  };
  
  const testEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const response = doPost(testEvent);
  Logger.log(response.getContent());
}