//发送短信验证码
var iscansend=true;
var passtime=60;
var acmsgtime=passtime;
function sendSmsCode(url, id, mobile){
	var desc = '';
	if(!iscansend)
		return desc;
	var _this =$('#'+id);
	$.ajax({
        type: 'POST',
        async:false, 
        url: url,
        data:'mobile='+mobile,
        dataType: 'JSON',
        success: function (data) {
        	if (data.code == '0000') {
        		//成功业务处理
        		iscansend=false;
				var t=setInterval(function () {
					if(passtime>0){
						_this.html(passtime+'秒后重新获得');
						_this.addClass('disabled');
						passtime--;
					} else{
						clearInterval(t);
						_this.html('重新获取').removeClass('disabled');
						iscansend=true;
						passtime=acmsgtime;
					}
					 
				},1000)
        	}
        	desc = data.desc;
		}
    });
	return desc;
}







