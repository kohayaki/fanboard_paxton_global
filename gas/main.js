function doGet (e) {
  try {
    var type = e.parameter.type;
    var brand = e.parameter.brand;
    if (!(type && brand)) {
      return myRes({ success: false, message: 'invalid type or brand' });
    }
    var sheetId = getIdByBrandName(brand);
    if (sheetId == null) {
      return myRes({ success: false, message: 'invalid brand' });
    }

    switch (type) {
      case 'products':
        return myRes({ success: true, data: getProducts(sheetId) });
      case 'order':
        var orderNumber = e.parameter.q;
        return myRes({ success: true, data: getOrder(sheetId, orderNumber) });
      case 'sendlimit':
        var sku = e.parameter.sku
        var date = e.parameter.date
        var rate = e.parameter.rate
        return myRes({ success: true, data: getSendLimit(sheetId, sku, date, rate) });
      case 'reviewvote':
        return myRes({ success: true, data: getReviewVote(sheetId) });
      case 'imagetest':
        return myRes({ success: true, data: getImageTest(sheetId) });
      default:
        return myRes({ success: false, message: 'invalid' });
    }
  } catch (e) {
    return myRes({ success: false, message: e.message });
  }
}

function doPost (e) {
  var brand = e.parameter.brand;
  var body = JSON.parse(e.postData.getDataAsString());
  if (!body.type || body.type === 'form') {
    return registerForm(brand, body, 'FormOutput');
  } else if (body.type === 'followup' ) {
    return registerForm(brand, body, 'FollowUpUsers');
  } else if (body.type === 'sendlimit') {
    return registerSendLimit(brand, body)
  }
  return myRes({ success: false, message: 'invalid query' });
}

