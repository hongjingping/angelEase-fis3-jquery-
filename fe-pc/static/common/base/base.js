// test
//var host = 'http://ixsh.yixin.com/rest/';
var host = 'http://10.36.106.76:8080/rest/';
var loginUrl = 'http://ixsh.yixin.com/page/login/login';
var baseUrl = 'http://ixsh.yixin.com/page/';
var wapUrl = 'http://ixsh.yixin.com/page/';
var staticUrl='http://ixsh.yixin.com/statics/';
var indexUrl = baseUrl + 'home/home.html';

/* bind polyfill */
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/* array.indexOf polyfill */

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let o be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of o with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = o.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of o with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of o with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

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
    storage.remove('addressIndex');
    storage.remove('bankIndex');
    storage.remove('randomtoken');
    storage.remove('addBankFrom');
}

var token_client_data = {'token':getToken(),'clientType':'pc'};

// 2016-12-18 jihongzhang@creditease.cn
// 获取 token 和 clientType 参数
function getTokenWithClient() {
    return {
        'token': getToken(),
        'clientType': 'pc'
    }
}


/**
 * 用户登录超时公用方法(data.code === '4000')
 * 2017-02-13 jihong.zhang@creditease.cn
 */
function handleLoginTimeout () {
    var timeoutAlert = new SmartAlert({
        title: '登录超时',
        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">当前登录已超时，请重新登录</span>',
        type: 'confirm',
        okText: '重新登录',
        maskClosable: false,
        onOk: function () {
            window.location.href = "/page/login/login.html"
        },
        onCancel: function () {
            window.location.href = "/page/login/login.html"
        }
    });
    timeoutAlert.open();
}

// check用户是否登录
function checkUserLogin(){
    $.ajax({
        type: 'POST',
        url: host + 'user/checkUserLogin.htm',
        dataType: 'JSON',
        data:{'token':getToken(),'clientType':'pc'},
        async: false,
        success: function (data) {
            if(data.code!='0000'){
                // location.href=loginUrl;
                handleLoginTimeout();
            }
        }, error:function(e){
            //1111-undefined不弹出

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
        data: {'token':getToken(),'clientType':'pc'},
        url: host + 'dream/checkUser.htm',
        dataType: 'JSON',
        success: function(data) {
            code = data.code;
        },
        error: function(e) {
            console.log(e);
        }
    });

    if (code == '0000') {
        return true;
    } else if (code == '0002') {
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先进行登录</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        window.location.href = loginUrl;
    } else if (code == '0006') {
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先进行实名认证</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        window.location.href = baseUrl + 'usercenter/certification/certification.html';
    } else if (code == '0011') {
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先进行合格投资人认证</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        window.location.href = baseUrl + 'usercenter/investor/form.html';
    }  else {
        var readSmartAlert = new SmartAlert({
            title: '错误',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">校验用户身份失败，请联系客服人员。</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        return false;
    }
}

// check订单号是否有效
function checkOrderIdUser(orderId) {
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: {'token':getToken(),'clientType':'pc'},
        url: host + 'order/checkOrderIdUser.htm?orderId=' + orderId,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == '0016') {
                var readSmartAlert = new SmartAlert({
                    title: '提示',
                    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                    type: 'confirm',
                    okText: '我知道了',
                    maskClosable: false,
                });
                readSmartAlert.open();
                window.location.href = baseUrl + 'home/home.html';
            }
        },
        error: function(e) {
            console.log(e);
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

function getImageBase64(file) {
    if(!/image\/\w+/.test(file.type)){
        alert("请确保文件为图像类型");
        return false;
    }
    var fr = new FileReader();
    return new Promise(function(resolve) {
        fr.onload = function() {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}

// 金额format，保留两位小数
function formatMoney(num) {
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0,num.length-(4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    if (cents == '00') {
        return (((sign) ? '' : '-') + num);
    } else {
        return (((sign) ? '' : '-') + num + '.' + cents);
    }
}

var SmartAlertSeed = 0;

var SmartAlert = function (options) {
    this.alertId = SmartAlertSeed++;
    this.options = options;
    this.createAlert();
};

SmartAlert.prototype.createAlert = function () {
    var alertTmpl = this.createAlertTmpl(this.options);
    $(alertTmpl).appendTo('body');
    this.$alert = $((".smartAlert#smartAlert-" + (this.alertId)));
    this.$body = $('body');
    this.alertInitEvents();
};

SmartAlert.prototype.getEl = function () {
    return this.$alert;
};

SmartAlert.prototype.open = function () {
    var self = this;
    this.$alert.css('display', 'table');
    this.$alert.show();
    setTimeout(function () {
        self.$alert.addClass('in');
    }, 10);
    this.$body.addClass('smartAlert-open');
};

SmartAlert.prototype.close = function () {
    var self = this;
    // this.$alert.removeClass('in');
    // setTimeout(function () {
    //   self.$alert.hide();
    // }, 200);
    this.$alert.hide();
    this.$body.removeClass('smartAlert-open');
    if (this.options.forceDestroy) this.destroy();
};

SmartAlert.prototype.destroy = function () {
    this.$alert.remove();
};

SmartAlert.prototype.getEl = function () {
    return this.$alert;
};

SmartAlert.prototype.createAlertTmpl = function () {
    var ref = this.options;
    var title = ref.title;
    var content = ref.content;
    var header = '<div class="smartAlert-header cmn-clearfix"><div class="smartAlert-title">'
        + (title ? title : '') + '</div><i class="ae-icon ae-icon-close close"></i></div>';
    var body = '<div class="smartAlert-body cmn-clearfix"><p class="cmn-clearfix"><div class="smartalert-content-wrapper cmn-clearfix">' + content + '</div></p></div>';
    var footer = '<div class="smartAlert-footer">' + this.createFooter() + '</div>';
    var TMPL = '<div class="smartAlert fade" id="smartAlert-'
        + this.alertId
        +'"><div class="smartAlert-dialog"><div class="smartAlert-content">'
        + header + body
        + (ref.footer === null ? '' : footer)
        + '</div></div></div>';

    return $.trim(TMPL);
};

SmartAlert.prototype.createFooter = function () {
    var ref = this.options;
    var type = ref.type;
    var okText = ref.okText;
    var cancelText = ref.cancelText;
    var footer = ref.footer;

    var defaultFooter = '<button type="button" class="cmn-btn-gold-w12 save">'
        + (okText ? okText : '确定')
        + '</button>';
    if (type !== 'confirm') {
        defaultFooter = '<button type="button" class="btn btn-default cmn-btn-white-w12 cancel">'
            + (cancelText ? cancelText : '取消')
            + '</button>'
            + '<button type="button" class="cmn-btn-gold-w12 save">'
            + (okText ? okText : '确定')
            + "</button>";
    }
    // set custom footer to override defaultFooter
    if (footer) defaultFooter = footer;
    return defaultFooter;
};

SmartAlert.prototype.handleOK = function handleOK () {
    var ref = this.options;
    var onOk = ref.onOk;
    onOk && onOk();
    this.close();
};

SmartAlert.prototype.handleCancel = function handleCancel () {
    var ref = this.options;
    var onCancel = ref.onCancel;
    onCancel && onCancel();
    this.close();
};

SmartAlert.prototype.alertInitEvents = function alertInitEvents () {
    var self = this;
    if (this.options.maskClosable) {
        this.$alert.on('click', function (e) {
            var $alertContent = self.$alert.find('.smartAlert-content');
            if (!$.contains($alertContent[0], e.target)) self.handleCancel();
        });
    }

    this.$alert.on('click', 'button.save', function (e) {
        self.handleOK();
    }).on('click', 'button.cancel', function (e) {
        self.handleCancel();
    }).on('click', '.close', function (e) {
        self.handleCancel();
    });
};

// 图片上传
function reduceImg(src,bizType,bizId) {
    var totalLength = src.length;
    var uploadFlag = false;
    if (totalLength >= 2801747) {
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请选择2M以内的图片</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        return uploadFlag;
    }
    var devideNum = 300000;
    var times = parseInt(totalLength / devideNum) + 1;
    var imgToken = '';
    for (var i=1;i<=times;i++) {
        var datas = 'img=';
        var completeFlag = '0';
        if (i == times) {// 最后一次
            completeFlag = '1';
            var start = (i-1) * devideNum;
            datas = datas + src.substring(start,totalLength);
        } else {
            var start = (i - 1) * devideNum;
            var end = i * devideNum;
            datas = datas + src.substring(start,end);
        }
        $.ajax({
            url: host + "upload/uploadImg.htm?imgToken=" + imgToken + '&type=' + bizType,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            async: false,
            data: datas + "&clientType=pc&token=" + getToken() + '&completeFlag=' + completeFlag + '&bizId=' + bizId,
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
}

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
