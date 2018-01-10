(function(){

  function setTemplete(el,data) {
    return Handlebars.compile($(el).html())(data);
  }

  //set share qr
  $('.share-popup img').attr('src','http://qr.liantu.com/api.php?&w=300&text='+window.location.href);

  /*
  * share action
  */
  $('.share-icon').click(function(){

      if (!isWeiXin()) {
        //browser
        var img=new Image();
        img.src='http://qr.liantu.com/api.php?&w=300&text='+window.location.href;
        img.onload = function(){
          //$('.share-popup img').attr('src','http://qr.liantu.com/api.php?&w=300&text='+window.location.href);
          var apopup = $('.share-popup').apopup({
            maskColor:'#000',
            opacity:'.3'
          },function(){
          });
        };
      }else{
        //weixin
        var apopup = $('.share-img').apopup({
          maskColor:'#000',
          opacity:'.3',
          position:[$(window).width() - 200,0]
        },function(){
        });
      }

  });

  var focusDetail = {
    init: function() {

      //back nav
      $('.back-nav').click(function(){
        if (history.length > 2 || document.referrer.length > 0) {
    			window.history.go(-1);
    		}else{
    			location.href = '/page/research/research.html';
    		}
      });

      //content
      $.ajax({
          type: 'POST',
          url: host + 'focus/getAngelFocusDetail.htm',
          data:{
            id:getRequest().id
          },
          dataType: 'JSON',
          success:function(data) {

            $('.main').append(setTemplete($('#main-template'),data.data));


          }
      });

      //hot
      $.ajax({
          type: 'POST',
          url: host + 'focus/getRelevantArticleList.htm',
          data:{
            type:1,
            id:getRequest().id
          },
          dataType: 'JSON',
          success:function(data) {

            $('.relative').append(setTemplete($('#relative-template'),data));
          }
      });

      //mock data
      //$('.main').append(setTemplete($('#main-template'),{}));
      //$('.sidebar').append(setTemplete($('#relative-template'),{}));


    }
  };

  focusDetail.init();

})();
