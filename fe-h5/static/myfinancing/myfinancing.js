(function(){


    checkUserLogin();

    Handlebars.registerHelper('formatAmount', function(passedString) {
        return new Handlebars.SafeString(formatAmount(passedString));
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

    //back nav
    $('.back-nav').click(function(){
      history.go(-1);
    });

    //default page
    var tabIndex = getRequest().tab?getRequest().tab:0;

    //tab
    $('.finance-nav a').click(function() {


      var index = $('.finance-nav a').index($(this));
      $('.finance-nav a').removeClass('active');
      $(this).addClass('active');

      //modify history
      window.history.replaceState({}, 'page', '/page/myfinancing/myfinancing.html?tab='+index);

        if(index === 0 ) {
          // 融资中
          $('.finance-list').html('');
          $.ajax({
            type: 'POST',
            url: host + 'finPro/finProList.htm',
            data:{
              proState:2,
              token:getToken(),
              clientType:'wap'
            },
            dataType: 'JSON',
            success:function(data) {
              if(data.code === '0000') {
                if(data.data.length === 0){
                  $('.finance-list').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'融资中'}));
                }else{
                  $('.finance-list').append(setHandlebarsTemplete($('#finance-template'),data));
                }
              }
          }
        });

        }else if(index === 1 ) {
          // 待融资
          $('.finance-list').html('');
          $.ajax({
              type: 'POST',
              url: host + 'finPro/finProList.htm',
              data:{
                proState:1,
                token:getToken(),
                clientType:'wap'
              },
              dataType: 'JSON',
              success:function(data) {
                if(data.code === '0000') {
                  if(data.data.length === 0){
                    $('.finance-list').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'待融资'}));
                  }else{
                    $('.finance-list').append(setHandlebarsTemplete($('#financing-template'),data));
                  }
                }
              }
          });
        }else if(index === 2) {
          // 融资完成
          $('.finance-list').html('');
          $.ajax({
              type: 'POST',
              url: host + 'finPro/finProList.htm',
              data:{
                proState:3,
                token:getToken(),
                clientType:'wap'
              },
              dataType: 'JSON',
              success:function(data) {
                if(data.code === '0000') {
                  if(data.data.length === 0){
                    $('.finance-list').append(setHandlebarsTemplete($('#finance-nodata-template'),{tab:'融资成功'}));
                  }else{
                    $('.finance-list').append(setHandlebarsTemplete($('#finance-template'),data));
                  }
                }
              }
          });
        }

    });

    $($('.finance-nav a')[tabIndex]).click();

})();
