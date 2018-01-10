(function () {

  checkUserLogin();

  var popup;
  //先投资人认证，再检查是否已经点击
  $.ajax({
      type: 'POST',
      url: host + "/baseuser/getUserStatus.htm",
      data: token_client_data,
      dataType: 'JSON',
      success: function(result) {
        if(result.data.investorStatus == '2' || result.data.investorStatus == '2' || result.data.investorStatus == '4'){
          $.ajax({
            type: 'POST',
            url: host + 'mac/readFlag.htm',
            data: token_client_data,
            dataType: 'JSON',
            success:function(result){
              if(!result.data){
                popup = $('.notice-popup').apopup({
                    maskColor:'#000',
                    opacity:'.5'
                },function(){
                  $('.notice-popup .action button').click(function(e){
                    $.ajax({
                      type: 'POST',
                      url: host + 'mac/saveFlag.htm',
                      data: token_client_data,
                      dataType: 'JSON',
                      success:function(result){
                        if(result && result.data){
                          popup.close();
                        }
                      }
                    });
                  });
                });
              }
            }
          });
        }
      }
    });

})()
