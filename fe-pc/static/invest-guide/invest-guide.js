/**
 * Created by jingpinghong on 2016/12/14.
 * 楼层滚动导航
 */
$(function(){
    $('#nav').onePageNav({
        currentClass: 'current',
        changeHash: true,
        scrollSpeed: 750,
        scrollThreshold: 0.5,
        filter: '',
        easing: 'swing'
    });
});




