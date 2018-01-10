$(function () {
    checkUserLogin();
    getUserinfo();

    
    
});
function getUserinfo(){
    $.ajax({
        url: host + "user/getUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                if (data.data.headphoto != ''&& data.data.headphoto!=null){
                    $("#headphoto").attr("src", staticUrl + data.data.headphoto);
                }
                $("#mobile").html(data.data.mobile.substring(0, 3) + "****" + data.data.mobile.substring(7));
                $("#nickname").html(data.data.nickname);
                $("#email").html(data.data.email);
                $("#qq").html(data.data.qq);
                $("#weixin").html(data.data.weixin);
                var sex = '保密';
                if (data.data.sex == 1){
                	sex = '男'
                }else if (data.data.sex == 2){
                    sex = '女'
                }
                $('#sex').html(sex);
            } else {
                $("#error").html(data.desc)
            }
		}
    });
}

function updateSex(value){
    var data ="sex="+value;
    updateUserinfo(data);
}
function updateUserinfo(datas){
    $("#error").html("");
    $.ajax({
        url: host + "user/updateUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: datas+"&clientType=pc&token=" + getToken(),
        success: function (data) {
            if (data.code == '0000') {
                if(datas.indexOf('img')>=0||datas.indexOf('nick')>=0){
                    getUserinfo();
                }
            } else {
                $("#error").html("<span style='color:red'>"+data.desc+"</span>");
            }
        }
    });
}

/**
 * 将图片转为base64格式
 * @private
 */
function getImageBase64(file) {
    var fr = new FileReader();
    return new Promise(function(resolve) {
        fr.onload = function() {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}