/**
 * Created by hasee on 2016/9/1.
 */

(function () {
	checkUserLogin();
	$.ajax({
        url: host + "user/getUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                $("#myid").val(data.data.nickname);
            }
		}
    });
})();

function save(datas){
	var value = $('#myid').val();
	if(value == ''){
		showError('昵称不能为空，请重填');
		return false;
	}
	var datas = "nickname="+value;
    $.ajax({
        url: host + "user/updateUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: datas+"&clientType=wap&token=" + getToken(),
        success: function (data) {
            if (data.code == '0000') {
                // 2016-12-09 history.back(-1) 回到前一个页面不会刷新，改成 document.referrer
                window.location.href = document.referrer;
            	// history.back(-1);
            }else{
            	showError('操作失败');
            }
        }
    });
}

//显示错误信息
function showError(errorDesc){
	/*$(".errormsg").html(errorDesc);
	$("#toastBoxerror").show();
	setTimeout("closebox()",1000);*/
	new SmartToast({
		content:errorDesc,
		type:'warn',
		duration:3
	});
}
//关闭错误提示框
function closebox(){
	var box=document.getElementById('toastBoxerror');
	box.style.display="none";
}