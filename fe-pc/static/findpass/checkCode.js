$(function () {
    $.ajax({
        url: host + 'user/CheckUpdatePwdByCode.htm',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        type: 'post',
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                $('#mobile').val(data.data.substring(0, 3) + '****' + data.data.substring(7));
                $('#for_login_userphone').val(data.data);
            } else {
                window.location.href = baseUrl + 'findpass/first.html';
            }
        }
    });
});