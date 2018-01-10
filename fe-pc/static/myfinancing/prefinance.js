(function() {

  Handlebars.registerHelper('formatAmount', function(str) {
      return new Handlebars.SafeString(formatAmount(str))
  });

  //get data
  $.ajax({
      type: 'POST',
      url: host + 'finPro/details.htm',
      data:{
        id:getRequest().id,
        token:getToken(),
        clientType:'pc'
      },
      dataType: 'JSON',
      success:function(data) {

        if(data.code === '0000') {
            $('.prefinance-bd').append(setHandlebarsTemplete($('#prefinance-template'),data.data));
        }

      }
  });

  //show financing-line
  $('.financing-line').show();

})()
