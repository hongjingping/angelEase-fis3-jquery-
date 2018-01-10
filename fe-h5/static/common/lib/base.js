// test
// shanghai server host
// var host = 'http://10.36.106.76:8080/rest/';
var host = 'http://ixsh.yixin.com/rest/';
var loginUrl = 'http://127.0.0.1:8080/page/login/login';
var baseUrl = 'http://127.0.0.1:8080/page/';
var staticUrl= 'http://ixsh.yixin.com/statics/';
var indexUrl = baseUrl + 'home/home.html';

//获取url传参  document.referrer
function getRequest() {
    var url = location.search; //获取url中"?"符后的字
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//json数据合并
function extend(des, src, override){
   if(src instanceof Array){
       for(var i = 0, len = src.length; i < len; i++)
            extend(des, src[i], override);
   }
   for( var i in src){
       if(override || !(i in des)){
           des[i] = src[i];
       }
   }
   return des;
}

function setToken(token){
    storage.set('user_token',token);
}

function getToken(){
    return storage.get('user_token');
}

function clearToken(){
    storage.remove('user_token');
}

var token_client_data = {'token':getToken(),'clientType':'wap'};

// check用户是否登录
function checkUserLogin(){
    $.ajax({
        type: 'POST',
        url: host + 'user/checkUserLogin.htm',
        dataType: 'JSON',
        data:{'token':getToken(),'clientType':'wap'},
        async: false,
        success: function (data) {
            if(data.code!='0000'){
                location.href=loginUrl;
            }
        }, error:function(e){
            alert('error:'+e.responseText);
        }
    });
}

// check用户状态
function checkUserStatus(){
    var code;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: token_client_data,
        url: host + 'dream/checkUser.htm',
        dataType: 'JSON',
        success: function(data) {
            code = data.code;
        },
        error: function(e) {
            console.log(e);
        }
    });

    if (code == "0000") {
        return true;
    } else if (code == "0002") {
        alert("请先进行登录");
        window.location.href = loginUrl;
    } else if (code == "0006") {
        alert("请先进行实名认证");
        window.location.href = baseUrl + 'real_name_auth/real_name_auth.html';
    } else if (code == "0011") {
        alert("请先进行合格投资人认证");
        window.location.href = baseUrl + 'investor_cert_part1/investor-cert-form.html';
    }  else {
        alert('校验用户身份失败，请联系客服人员。');
        return false;
    }
}

// 重签流程中错误信息提示
function rejectInfo(orderId){
  $.ajax({
        type: 'POST',
        url: host + '/order/checkResign.htm?orderId=' + orderId,
        data: {'token':getToken(),'clientType':'wap'},
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                var resign = result.data.reSign;
                if (resign == '1') {
                    var clause = result.data.signClause;
                    var cc = clause.split(',');
                    for(var i = 0 ;i<cc.length;i++) {
                        if(cc[i] == '' || typeof(cc[i]) == 'undefined') {
                            cc.splice(i,1);
                            i= i-1;
                        }
                    }
                    var errMsg = '';
                    if (cc != null) {
                        for (var i = 0; i < cc.length; i++) {
                            if(i%2==0){
                                errMsg += (i/2+1) + '、' + cc[i] + ' : &nbsp;';
                            }else{
                                errMsg += cc[i] + '<br />';
                            }
                        }
                    }
                    var remark = result.data.remark;
                    if (remark != null && remark != '') {
                        errMsg = errMsg + '补充说明：' + remark;
                    }
                    $('.orange-font').html(errMsg);
                    $('.background-color').show();
                }
            } else if (result.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

// check订单号是否有效
function checkOrderIdUser(orderId) {
    $.ajax({
        type: 'POST',
        data: {'token':getToken(),'clientType':'wap'},
        url: host + 'order/checkOrderIdUser.htm?orderId=' + orderId,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == '0016') {
                alert(data.desc);
                 window.location.href = baseUrl + 'home/home.html';
            }
        },
        error: function(e) {
        }
    });
}

// check订单号是否有效（APP调用协议页面用）
function checkOrderIdUserByApp(orderId, data) {
    $.ajax({
        type: 'POST',
        data: data,
        url: host + 'order/checkOrderIdUser.htm?orderId=' + orderId,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == '0016') {
                alert(data.desc);
                 window.location.href = baseUrl + 'home/home.html';
            }
        },
        error: function(e) {
        }
    });
}

function setVisitiToken(token){
    storage.set('user_visit_token',token);
}

function getVisitiToken(){
    var token = storage.get('user_visit_token');
    if(token==null||token==''||token==undefined){
        $.ajax({
            type: 'POST',
            url: host + 'user/visit.htm',
            dataType: 'JSON',
            data:'',
            async: false,
            success: function (data) {
                if (data.code=='0000') {
                    setVisitiToken(data.data);
                    token = data.data;
                }
            }, error:function(e){
            }
        });
    }
    return token;
}

//图片上传校验
function checkfile(fileId,tempimg){
    var maxsize = 2*1024*1024;//2M
    var errMsg = "上传的文件不能超过2M！！！";
    var tipMsg = "您的浏览器暂不支持计算上传文件的大小，确保上传文件不要超过2M，建议使用IE、FireFox、Chrome浏览器。";
    var  browserCfg = {};
    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE")>=1){
        browserCfg.ie = true;
    }else if(ua.indexOf("Firefox")>=1){
        browserCfg.firefox = true;
    }else if(ua.indexOf("Chrome")>=1){
        browserCfg.chrome = true;
    }
    try{
        var obj_file = document.getElementById(fileId);
        var files = obj_file.value;
        if(files==""){
            alert("请先选择上传文件");
            return false;
        }
        var extStart=files.lastIndexOf(".");
        var ext=files.substring(extStart,files.length).toUpperCase();
        if(ext != ".JPG" && ext != ".PNG"){
            alert("图片仅限于png,jpg格式");
            return false;
        }
        var filesize = 0;
        if(browserCfg.firefox || browserCfg.chrome ){
            filesize = obj_file.files[0].size;
        }else if(browserCfg.ie){
            var obj_img = document.getElementById(tempimg);
            obj_img.dynsrc=obj_file.value;
            filesize = obj_img.fileSize;
        }else{
            alert(tipMsg);
            return false;
        }
        if(filesize==-1){
            alert(tipMsg);
            return false;
        }else if(filesize>maxsize){
            alert(errMsg);
            return false;
        }else{
            //alert("文件大小符合要求");
            return true;
        }
    }catch(e){
        alert(e);
    }
}

// 金额format，保留两位小数
function formatMoney(num) {
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
    num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    if (cents == '00') {
        return (((sign)?'':'-') + num);
    } else {
        return (((sign)?'':'-') + num + '.' + cents);
    }
}

// 金额小写转大写
function numToCny(num) {
    var strOutput = "";
    var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    num += "00";
    var intPos = num.indexOf('.');
    if (intPos >= 0) {
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (var i=0; i < num.length; i++) {
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
    }
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};

function reduceImg(src,bizType,bizId){
    var totalLength = src.length;
    var uploadFlag = false;

    if (totalLength >= 2801747) {
        new SmartToast({
            content: '请选择2M以内的图片',
            type: '警告',
            duration: 3
        });
        return uploadFlag;
    }

    var devideNum = 300000;
    var times = parseInt(totalLength/devideNum) + 1;
    var imgToken = '';

    for(var i = 1; i <= times; i++) {
        var datas = 'img=';
        var completeFlag = '0';

        if(i == times) {// 最后一次
            completeFlag = '1';
            var start = (i - 1) * devideNum;
            datas = datas + src.substring(start,totalLength);
        } else {
            var start = (i-1)*devideNum;
            var end = i*devideNum;
            datas = datas + src.substring(start,end);
        }

        $.ajax({
            url: host + "upload/uploadImg.htm?imgToken="+imgToken+'&type='+bizType,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            async: false,
            data: datas+"&clientType=wap&token=" + getToken() + '&completeFlag=' + completeFlag + '&bizId=' + bizId,
            success: function (data) {
                if (data.data != '') {
                    imgToken = data.data;
                }

                if (data.code != '9999') {
                    uploadFlag = true;
                    return uploadFlag;
                } else {
                    return uploadFlag;              
                }
            }
        });
    }
    return uploadFlag;
};

//input框后面的删除按钮
function deleteBtn(input,del){
    function clearText() {
        $("#" + input ).val("") ;
        $("#"+del).hide();
    }
    $(function(){
        clearText();
        $("#"+del).on('click',function(){
            clearText();
        });
        $("#" + input).on("focus change keyup",function(){
            var txt =$("#" + input ).val();
            if(txt != '' ){
                $("#"+del).show();
            }else{
                clearText();
            }
        });
        $("#" + input ).on("blur",function(){
            setTimeout(function(){
                $('#'+del).hide();
            },200)
        });

    });
};

/**
 * email: hongjunwang1@creditease.cn
 * description: judge what is weixin browser
 * output:
 *      weixin: true
 *      others: false
 */
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    } else {
        return false;
    }
};

/**
 * whether id card legal
 * @param idcard no
 * @return legal: true
 */
function isIDCard(card) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(card) ? true : false;
}

/**
* Handlebars模板
* @param el 模板DOM节点
* @param data 填充数据
* @return HTML片段
*/

function setHandlebarsTemplete(el,data) {
  return Handlebars.compile($(el).html())(data);
}

/**
* amount format (元 => 万元)
* @param string xxx,xxx元
* @return string xxx.xxx万元
*/
function formatAmount(str) {
  var theString;
  if(str.lastIndexOf('.')>-1) {
   theString = parseInt(str.substring(0,str.lastIndexOf('.')).replace(/,/g,''),10)/10000;
  } else {
   theString = parseInt(str.substring(0,str.length).replace(/,/g,''),10)/10000;
  }
  return theString;
}
