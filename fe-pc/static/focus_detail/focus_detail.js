(function(){

  function setTemplete(el,data) {
    return Handlebars.compile($(el).html())(data);
  }

  var focusDetail = {
    init: function() {

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
            $('.share-popup img').attr('src','http://qr.liantu.com/api.php?&w=180&text='+window.location.href);


            //share action
            $('.share-btn').click(function(){
              var apopup = $('.share-popup').apopup({},function(){});
            });
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
            $('.sidebar .hot-list').append(setTemplete($('#hot-list'),data));
          }
      });

      //banner
      $.ajax({
          type: 'POST',
          url: host + 'cFigure/getCarouselFigures.htm',
          data:{
            type:4,
            clientType:'pc'
          },
          dataType: 'JSON',
          success:function(data) {
            $('.sidebar .banner').append(setTemplete($('#banner-list'),data));
            var owlEl = $('#banner-carousel');
      			owlEl.owlCarousel({
    		        loop:true,
    		        items:1,
    		        center:true,
    		        dots: true,
    		        autoplay: true,
    		        autoplayTimeout: 5000,
                onInitialized:function() {
                  $('.banner-list').append($('.banner-text'));
                  $('.banner-text li').hide();
                  $('.banner-labels li').hide();
                  $($('.banner-text li')[0]).show();
                  $($('.banner-labels li')[0]).show();
                },
                onChanged:function(e) {
                  var index = e.page.index;
                  if(index >= 0){
                    $('.banner-text li').hide();
                    $('.banner-labels li').hide();
                    $($('.banner-text li')[index]).show();
                    $($('.banner-labels li')[index]).show();
                  }
                }
    		    });
          }
      });

      //ad
      $.ajax({
          type: 'POST',
          url: host + 'cFigure/getAdvert.htm',
          data:{
            type:5,
            clientType:'pc'
          },
          dataType: 'JSON',
          success:function(data) {
            if(data.code === '0000'){
              $('.sidebar .ad').append(setTemplete($('#ad-image'),data.data));
            }
          }
      });


      //mock data
      //$('.main').append(setTemplete($('#main-template'),{}));
      //$('.sidebar').append(setTemplete($('#relative-template'),{}));
    }
  };

  focusDetail.init();

})();
