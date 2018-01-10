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
        clientType:'wap'
      },
      dataType: 'JSON',
      success:function(data) {

        if(data.code === '0000') {

            $('.main').append(setHandlebarsTemplete($('#prefinance-template'),data.data));

            if(getRequest().status && getRequest().status !== '0') $('.del').show();

            //bind del event
            var id = $('#del-id').val();

            $('.del').click(function(){
              $('#del-popup').apopup({
                maskColor:'#000',
                opacity:'.3'
              },function(){
                $('.i-know').click(function(){
                  $.ajax({
                      type: 'POST',
                      url: host + 'finPro/deleteProject.htm',
                      data:{
                        id:id,
                        token:getToken(),
                        clientType:'wap'
                      },
                      dataType: 'JSON',
                      success:function(data) {
                        if(data.code === '0000') {
                          window.history.go(-1);
                        }
                      }
                  });
                });
              });
            });
        }
      }
  });
})()
