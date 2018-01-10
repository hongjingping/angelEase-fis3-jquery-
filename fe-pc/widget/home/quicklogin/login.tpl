<div class="quick-login-wrapper cmn-clearfix">
    <div class="login-wrapper" style="display: none;">
        <div class="login-title-wrapper cmn-clearfix">
            <div class="title">快捷登录</div>
            <div class="to-sign">
                <span>还没有账号？</span>
                <a href="/page/login/register.html" class="to-sign-btn">立即注册</a>
            </div>
        </div>
        <div class="reminder">
            <i class="ae-icon ae-icon-about"></i>
            <span>宜信财富官网客户可直接通过手机号登录</span>
        </div>
        <div class="form-box">
            <div class="error-txt" id="error"></div>

            <input type="hidden" id="count" value="0">

            <div class="label">
                <input type="text" placeholder="请输入您的手机号"  class="phone-input"  id="userphone"  onblur="checkMobileNum(this.value)" autocomplete="off" maxlength="11" >
                <i class="ae-icon ae-icon-phone phone-icon"></i>
                <div class="delete close-username" id="close-username" style="display: none;">
                  <i class="ae-icon ae-icon-close"></i>
                </div>
            </div>

            <div class="label">
                <input type="password" placeholder="请输入您的密码" maxlength="18" class="phone-input" id="userpwd"  value="" onblur="checkpwd(this.value)" autocomplete="off">
                <i class="ae-icon ae-icon-password phone-icon"></i>
                <div class="delete close-pwd" id="close-pwd" style="display: none;">
                  <i class="ae-icon ae-icon-close"></i>
                </div>
            </div>

            <div class="label captcha" style="display: none;">
                <input type="text" placeholder="请输入验证码" class="img-code-input" id='loginCode' value="" maxlength="4">
                <i class="ae-icon ae-icon-right-code phone-icon"></i>
                <div class="img-code" >
                    <b class="testZy" style="margin:0;"><img id="picImg"/></b>
                </div>
            </div>

            <div class="cmn-btn-gold-w12 login-btn" id="loginBtn">立即登录</div>
        </div>
        <a class="find-password" href="/page/findpass/first.html">忘记密码</a>
    </div>
    <div class="logged-wrapper" style="display: none;">
        <div class="cmn-clearfix">
            <div class="user-welcome">
                <span id="quick-username"></span>
                <span>你好！</span>
            </div>
            <div class="btn-financing">
                <i class="ae-icon ae-icon-rongzi"></i>
                <a class="want-financing" href="/page/apply_for_funding/apply_for_funding.html">我要融资</a>
            </div>
        </div>
        <div class="font-gray">即刻开启您的股权投资之旅</div>
        <a class="btn-my-fund cmn-btn-gold-w12" href="/page/invest/list.html">我的投资</a>
    </div>
</div>
