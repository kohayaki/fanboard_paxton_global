function getIdByBrandName (brand) {
  var rows = getBrand(brand);
  var brandNameIdx = 0;
  var targetIdx = 1;
  if (rows && rows.length > 1) {
    for (var i = 0; i < rows[0].length; i++) {
      if (rows[0][i] == 'spread sheet id') {
        targetIdx = i;
      }
      if (rows[0][i] == 'brand') {
        brandNameIdx = i;
      }
    }
    var t = rows.find(function (item) {
      return brand == item[brandNameIdx];
    });
    if (t) {
      return t[targetIdx];
    }
  }
  return null;
}


function getLastRowFromColumnName (sheet, column) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var startColumn = headers.indexOf(column) + 1;
  var columnAlphabet = convertColNumToColAlphabet(sheet, startColumn);
  var targetRows = getTargetColumnValues(sheet, columnAlphabet);
  var startRow = targetRows.filter(String).length + 1;
  return startRow;
}

function getTargetColumnValues (sheet, columnAlphabet) {
  var targetColumn = columnAlphabet + ":" + columnAlphabet
  var targetColumnValues = sheet.getRange(targetColumn).getValues();
  return flattenArray(targetColumnValues);
}

function flattenArray (arr) {
  return arr.reduce(function (acc, val) {
    return acc.concat(val);
  }, []);
}

function convertColNumToColAlphabet (sheet, columnNumber) {
  var result = sheet.getRange(1, columnNumber);
  result = result.getA1Notation();
  result = result.replace(/\d/, '');
  return result;
}

function myRes (jsono) {
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify(jsono));
  return out;
}
