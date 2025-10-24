function registerSendLimit (brand, body) {
  if (!brand) {
    return myRes({ success: false, message: 'invalid brand' });
  }
  if (!body || !body.sku || !body.date || !body.rate) {
    return myRes({ success: false, message: 'invalid body' });
  }
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var sid = getIdByBrandName(brand);
    var spreadsheet = SpreadsheetApp.openById(sid);
    var sheet = spreadsheet.getSheetByName('SendLimit');
    var rows = sheet.getDataRange().getValues();

    var existingDataIndex = rows.findIndex(function (row) {
      return row[0] === body.sku && row[1] === body.date && row[2] == body.rate
    })
    if (existingDataIndex !== -1) {
      var currentValue = sheet.getRange(existingDataIndex + 1, 4).getValue()
      sheet.getRange(existingDataIndex + 1, 4).setValue(currentValue + 1)
    } else {
      sheet.insertRowBefore(2)
      sheet.getRange(2, 1, 1, 4).setValues([[body.sku, `'${body.date}`, body.rate, 1]]);
    }

    return myRes({ success: true, message: 'success' });
  } catch (e) {
    return myRes({ success: false, message: e.message });
  } finally {
    lock.releaseLock();
  }
}

function registerForm (brand, body, sheetName) {
  if (!brand) {
    return myRes({ success: false, message: 'invalid brand' });
  }
  if (!body) {
    return myRes({ success: false, message: 'invalid form' });
  }
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var sid = getIdByBrandName(brand);
    var form = body;
    var spreadsheet = SpreadsheetApp.openById(sid);
    var sheet = spreadsheet.getSheetByName(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = getLastRowFromColumnName(sheet, "date");

    // セルへ書き込み
    for (var i = 0; i < headers.length; i++) {
      if (headers[i] != "" && form.hasOwnProperty(headers[i])) {
        sheet.getRange(nextRow, (i + 1)).setValue(form[headers[i]]);
      }
    }
    return myRes({ success: true, message: 'success' });
  } catch (e) {
    return myRes({ success: false, message: e.message });
  } finally {
    lock.releaseLock();
  }
}
