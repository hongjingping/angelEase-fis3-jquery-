(function(){

  function setTemplete(el,data) {
    return Handlebars.compile($(el).html())(data);
  }

  var angelDetail = {

    init: function() {

      $.ajax({
          type: 'POST',
          url: host + 'focus/getAngelFocusDetail.htm',
          data:{
            id:getRequest().id
          },
          dataType: 'JSON',
          success:function(data) {

            $('.main').append(setTemplete($('#main-template'),data.data));
            $('.sidebar .author').append(setTemplete($('#author-template'),data.data));
            $('.share-popup img').attr('src','http://qr.liantu.com/api.php?&w=180&text='+window.location.href);

            //share action
            $('.share-btn').click(function(){
              var apopup = $('.share-popup').apopup({},function(){
              });
            });
          }
      });



      //relative
      $.ajax({
          type: 'POST',
          url: host + 'focus/getRelevantArticleList.htm',
          data:{
            type:0,
            id:getRequest().id
          },
          dataType: 'JSON',
          success:function(data) {
            $('.sidebar .relative').append(setTemplete($('#relative-template'),data));

            //$('.main').append(setTemplete($('#main-template'),data.data));
          }
      });


      //mock data
      /*
      $('.main').append(setTemplete($('#main-template'),{}));
      $('.sidebar').append(setTemplete($('#author-template'),{}));
      $('.sidebar').append(setTemplete($('#relative-template'),{}));
      */
    }

  };

  angelDetail.init();

})();
