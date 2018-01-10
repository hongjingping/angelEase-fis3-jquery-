/**
 * Created by jingpinghong on 2016/12/20.
 */
$( function () {
    var bannerImg = {
        init: function () {
            this. bannerImgData();
        },
        bannerImgData: function () {
            $.ajax({
                url: host + 'cFigure/getAdvert.htm?type=5&clientType=pc',
                type: 'post',
                dataType: 'JSON',
                success: function(data){
                    if (data.code == '0000') {
                        var item = data.data;
                        //item.focusImgURL = staticUrl + item.imgUrl;
                        $('.banner-img').attr('href',item.linkUrl);
                        $('.bannerImg').attr('src',item.imgUrl);
                    }
                },
                error: function () {
                }
            });
        }
    };
    bannerImg.init();
});