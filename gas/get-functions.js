function getProducts (sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName('ProductList');
  var rows = sheet.getDataRange().getValues();
  return rows;
}

function getBrand (brand) {
  var spreadsheet = SpreadsheetApp.openById('1zyUeSvAK9O8_h3n89gzrTEqNSPOA2yFEGpKdbIk73ts');
  var sheet = spreadsheet.getSheetByName('brand_id');
  var rows = sheet.getDataRange().getValues();
  return rows.filter(function (row, idx) {
    return idx == 0 || row.join(':::').toLowerCase().indexOf(brand.toLowerCase()) >= 0;
  });
}

function getOrder (sheetId, orderNumber) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName('OrderID Check');
  var rows = sheet.getDataRange().getValues();
  return rows.filter(function (row, idx) {
    return idx == 0 || row.join(':::').toLowerCase().indexOf(orderNumber.toLowerCase()) >= 0;
  });
}

function getSendLimit (sheetId, sku, date, rate) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName('SendLimit');
  var rows = sheet.getDataRange().getValues();
  return rows.find(function (row) {
    return row[0] === sku && row[1] === date && row[2] == rate
  })
}

function getImageTest(sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName('ImageTest');
  return sheet.getDataRange().getValues();
}

function getReviewVote(sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheetByName('ReviewVote');
  return sheet.getDataRange().getValues();
}
