(function() {

  checkUserLogin();

  Handlebars.registerHelper('formatAmount', function(str) {
      return new Handlebars.SafeString(formatAmount(str))
  });

  Handlebars.registerHelper('if_show', function(a, opts) {
    if(Math.floor(a.replace(/,/g,'')) > 10000)
        return opts.fn(this);
    else
        return opts.inverse(this);
  });

  Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a === b)
        return opts.fn(this);
    else
        return opts.inverse(this);
  });

  Handlebars.registerHelper('if_neq', function(a, b, opts) {
    if(a !== b)
        return opts.fn(this);
    else
        return opts.inverse(this);
  });

  //default page
  var tabIndex = getRequest().tab?getRequest().tab:0;


  $.ajax({
      type: 'POST',
      url: host + 'finPro/checkFinProject.htm',
      dataType: 'JSON',
      data:{'token':getToken(),'clientType':'pc'},
      success:function(data){
        if(data.code === '0000'){
          $('.add-project').show();
        }
      }
  });

  //delEvent
  function bindDelEvent(els){
    $(els).each(function(k,v){
      $(v).find('.ae-icon-delete').click(function(){
        var id = $(v).attr('data-pid');
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请您确认是否要删除项目?</span>',
            okText: '确认',
            onOk:function(){
              $.ajax({
                  type: 'POST',
                  url: host + 'finPro/deleteProject.htm',
                  data:{
                    id:id,
                    token:getToken(),
                    clientType:'pc'
                  },
                  dataType: 'JSON',
                  success:function(data) {
                    if(data.code === '0000') {
                      location.reload();
                    }
                  }
              });
            },
            maskClosable: false,
        });
        readSmartAlert.open();
      });
    });
  }

  //tab
  $('.myfinancing-main .tab li a').click(function() {

    var index = $('.myfinancing-main .tab a').index($(this));
    $('.myfinancing-main .tab li a').removeClass('active');
    $(this).addClass('active');

    //modify history
    window.history.replaceState({}, 'page', '/page/myfinancing/myfinancing.html?tab='+index);

    if(index === 0 ) {
      // 融资中
      $('.content').html('');
      $.ajax({
          type: 'POST',
          url: host + 'finPro/finProList.htm',
          data:{
            proState:2,
            token:getToken(),
            clientType:'pc'
          },
          dataType: 'JSON',
          success:function(data) {

            if(data.code === '0000') {
              if(data.data.length === 0){
                $('.content').removeClass('table-content').addClass('nodata-content').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'融资中'}));
              }else{
                $('.content').removeClass('table-content nodata-content').append(setHandlebarsTemplete($('#finance-template'),data));
              }
            }
          }
      });
    }else if(index === 1 ) {
      // 待融资
      $('.content').html('');
      $.ajax({
          type: 'POST',
          url: host + 'finPro/finProList.htm',
          data:{
            proState:1,
            token:getToken(),
            clientType:'pc'
          },
          dataType: 'JSON',
          success:function(data) {
            if(data.code === '0000') {
              if(data.data.length === 0){
                $('.content').addClass('nodata-content').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'待融资'}));
              }else{
                $('.content').removeClass('nodata-content').addClass('table-content').append(setHandlebarsTemplete($('#financing-template'),data));
                bindDelEvent($('.finance-table tbody tr'));
              }
            }
          }
      });
    }else if(index === 2) {
      // 融资完成
      $('.content').html('');
      $.ajax({
          type: 'POST',
          url: host + 'finPro/finProList.htm',
          data:{
            proState:3,
            token:getToken(),
            clientType:'pc'
          },
          dataType: 'JSON',
          success:function(data) {
            if(data.code === '0000') {
              if(data.data.length === 0){
                $('.content').removeClass('table-content').addClass('nodata-content').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'融资成功'}));
              }else{
                $('.content').removeClass('table-content nodata-content').append(setHandlebarsTemplete($('#finance-template'),data));
              }
            }
          }
      });
    }
  });

  $($('.myfinancing-main .tab li a')[tabIndex]).click();

  //show financing-line
  $('.financing-line').show();

})();
