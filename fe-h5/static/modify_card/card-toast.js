(function () {

    var Security = {
        init: function () {
            this.setSecurityHeader();
        },

        setSecurityHeader: function () {
            $('.cmn-header-title').text('更换银行卡');
        }
    };

    Security.init();

})();

function codefans(){
    var box=document.getElementById("toastBox");
    box.style.display="none";   
}
$("#modifySuccess").click(function(){
    var box=document.getElementById("toastBox");
    box.style.display="block";
    setTimeout("codefans()",3000);//3秒
})