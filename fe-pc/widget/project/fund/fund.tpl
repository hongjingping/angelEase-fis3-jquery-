<div class="fund-container">

	<p class="item-title">
		<span class="title-line">投资意向</span>
	</p>

	<p class="item-notice">
		<i class="ae-icon ae-icon-attention"></i>风险提示：股权投资属于高风险投资，请谨慎决策。
	</p>
    <p class="item-notice" id="sectionSty" style="display:none">
        <i class="ae-icon ae-icon-attention"></i>项目当前已超募，下单后您将进入候补投资人序列，请确认愿意排队后继续操作。
    </p>

    <div class="item-box">
        <table class="cmn-table cmn-table-bordered">
            <colgroup>
                <col width="100px"></col>
                <col></col>
            </colgroup>
            <tbody>
                <tr>
                    <td>投资人</td>
                    <td id="investorName"></td>
                </tr>
                <tr>
                    <td>投资项目</td>
                    <td id="proName"></td>
                </tr>
                <tr>
                    <td>投资金额</td>
                    <td class="cmn-clearfix">
                        <div class="is-customed">
                            <button class="change-btn decrement"><i class="ae-icon ae-icon-subtract"></i></button>
                            <div id="customed-intentionspayment" class="invest-money"></div>
                            <button class="change-btn increment"><i class="ae-icon ae-icon-add"></i></button>
                            <div class="invest-reminder">
                                <i class="ae-icon ae-icon-about"></i>
                                <div class="invest-reminder-content">定制档无法保证全额投资，最终投资金额以合同为准</div>
                            </div>
                        </div>
                        <div class="not-customed">
                            <div id="intentionspayment"></div>
                        </div>
                    </td>
                </tr>
               <!--  <tr>
                    <td>投资金额</td>
                    <td id="intentionspayment"></td>
                </tr> -->
                <tr>
                    <td>投资回报</td>
                    <td id="backInfo"></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="item-title">
        <span class="title-line">投资人地址信息</span>
        <span class="title-noline" id="addAddress">
            <i class="ae-icon ae-icon-plus"></i>
            <em>新增地址</em>
        </span>
    </div>

	<p class="item-notice another-notice">
		<i class="ae-icon ae-icon-about"></i>协议及投后信息等私密材料将寄送到您选择的地址，请您选择真实有效的个人地址。
	</p>

    <p class="item-no-data address-no-data">暂无地址</p>

    <table class="cmn-table cmn-table-bordered" id="order-table">
         <colgroup>
            <col width="50px"></col>
            <col width="80px"></col>
            <col width="150px"></col>
            <col></col>
            <col width="70px"></col>
        </colgroup>
        <tbody id="addressList" class="address-list">

        </tbody>
    </table>

	<div class="item-title">
        <span class="title-line">支付银行卡</span>
        <span class="title-noline" id="add-bankcard">
            <i class="ae-icon ae-icon-plus"></i>
            <em>添加新卡</em>
        </span>
    </div>

    <div class="bank-list-wrap">
        <p class="item-notice another-notice">
            <i class="ae-icon ae-icon-about"></i>此银行卡将用于签约及支付，变更银行卡将导致重新签约，请您谨慎选择。
        </p>

        <p class="item-no-data bankcard-no-data">暂无绑定银行卡</p>

        <table class="cmn-table cmn-table-bordered" id="bank-table">
            <colgroup>
                <col width="50px"></col>
                <col width="80px"></col>
                <col width="220px"></col>
                <col></col>
            </colgroup>
            <tbody id="get-bank-list" class="address-list"></tbody>
        </table>
    </div>

    <div class="bankcard-container">
        <span class="close-panel">
            <i class="ae-icon ae-icon-close"></i>
            <em>取消</em>
        </span>

        <!-- add bankcard panel -->
        <div class="bankcard-panel">
            <!-- begin add bankcard -->
            <div class="modify-pass-content">

                <div class="form-control cmn-clearfix" style="display:none" id="error0">
                    <div class="error-notice">
                        <i class="ae-icon ae-icon-attention error-icon"></i><em id="error1"></em>
                    </div>
                </div>
                <div class="form-control cmn-clearfix" style="display:none;" id="success">
                    <div class="success-notice">
                        <i class="ae-icon ae-icon-success success-icon"></i><em id="successMsg"></em>
                    </div>
                </div>
                <!--持卡人-->
                <div class="form-control cmn-clearfix">
                    <div class="form-key">持卡人</div>
                    <div class="form-value from-value-text"  >
                        <span id="name"></span>
                        <div class="symbols-container">
                            <i class="symbols-attention" id="cardName"></i>

                            <!--持卡人姓名-->
                            <div class="cardName" id="card-name">
                                <p class="cardname-info">为保证您的资金安全，持卡人只能绑定本人的银行卡</p>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" value="" />
                </div>

                <!--银行卡号-->
                <div class="form-control cmn-clearfix bank-card-num" id="main">
                    <div class="form-key">银行卡号</div>
                    <input type="text" id="card-num" maxlength="20"  class="form-value form-value-oneline cmn-input i-text" placeholder="请输入您的银行卡号">
                    <!--扩大显示银行卡号-->
                    <div class="form-control cmn-clearfix bigNum" id="textMag">
                        <div  id="mag-text"  class="form-value form-value-oneline cmn-input cmn-left " ></div>
                    </div>

                    <!--银行卡列表-->
                    <div class="support-bank-wrapper">
                        <div class="support-bank from-value-text" id="support-bank">支持银行卡</div>
                        <div class="bank-list" id="bank-list">
                            <div class="bank-list-head">
                                <table class="banklist">
                                    <thead>
                                    <tr>
                                        <th class="bank-w">银行</th>
                                        <th class="quota-w">单笔限额</th>
                                        <th class="quota-w">每日限额</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="bank-list-body">
                                <table class="banklist">
                                    <tbody id="banklist-Data">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <!--卡类型-->
                <div class="form-control cmn-clearfix">
                    <div class="form-key card-type" id="font-c">卡类型</div>
                    <div class="form-value from-value-text" id="cardType">
                        <div class="cardType" id="loadingImg">
                            <span type="text" class="font-gray  font-text" >
                                <i class="loading-image"></i>
                                <span class="loading-icon">验证中</span>
                            </span>
                        </div>
                    </div>
                    <input type="hidden" value="0" id="card-type-check"/>
                    <input type="hidden" id="card-type"/>
                </div>

                <!--手机号码-->
                <div class="form-control cmn-clearfix">
                    <div class="form-key">手机号码</div>
                    <div class="form-value">
                        <input type="tel" id='phoneNum' class="form-value-oneline cmn-input" placeholder="请输入银行预留手机号" name="for_login_code" maxlength="13"  value="">

                        <div class="symbols-container">
                            <i class="symbols-attention" id="cardNum"></i>

                            <!--银行预留手机号-->
                            <div class="bankCardNum" id="bankCardNum">
                                <div class="bankCardNumInfo">
                                    <h5>银行预留手机号</h5>
                                    <p>1.银行预留的手机号是办理该银行卡时所填写的手机号码</p>
                                    <p>2.没有预留、手机号忘记或已停用，请联系该行银行客服更新处理</p>
                                    <p>3.仅支持大陆11位数字手机号</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--图形验证码-->
                <div class="form-control cmn-clearfix cmn-mb">
                    <div class="form-key">图形验证码</div>
                    <input type="text" id="imgCode" class="form-value form-value-oneline2 cmn-input" placeholder="请输入右图验证码">
                    <div class="img-code" >
                        <img class="imgCode" id="img-code">
                    </div>
                </div>

                <!--协议-->
                <div class="cmn-clearfix cmn-mt">
                    <div class="form-value form-value-oneline protocal">
                        <i class="check-icon check-icon1" id="check-icon"></i>
                        <span class="cmn-l">本人承诺已了解并同意</span>
                        <span class="font-c"><<<a href="/page/protocol/shortCut.html" class="font-c" target="_blank">借记卡快捷支付服务协议</a>>></span>
                    </div>
                </div>

                <!--提交按钮-->
                <div class="form-control cmn-clearfix">
                <div class="pull-right btn-next cmn-btn-gold-w12" >
                    <a href="javascript:;" class="check" id="sub-check">提交</a>
                </div>
                </div>
            </div>

            <!-- end add bankcard-->
        </div>
    </div>

    <p class="item-check">
        <input type="checkbox" id="agreement" class="check-txt">本人承诺已了解并同意<a id="protocolOrder" href="javascript:;" >《预约意向书》</a><a href="javascript:;" id="protocolFund">《投资风险申明书》</a>
    </p>

    <p class="item-btns">
        <a href="javascript:;" class="cmn-btn-gold-w12" id="toConfirm">下一步</a>
        <a href="javascript:;" id="backDetail" class="back-detail">返回详情页</a>
    </p>
</div>

<!-- dialog -->
<div class="mask"></div>

<!-- add address -->
<div class="wgt-dialog-address">
    <form action="" method="post" class="content" id="formAdr" enctype="multipart/form-data">
        <input type="hidden"  id="token" name="token" value=""  />
        <input type="hidden"  id="clientType" name="clientType" value="pc"  />
        <input type="hidden" id="provinceCode" name="provinceCode" value="">
        <input type="hidden" id="cityCode" name="cityCode" value="">
        <input type="hidden" id="districtCode" name="districtCode" value="">
        <input type="hidden" id="adrId" name="id" value="">
        <div class="address-title">
            <span class="title">编辑地址</span>
            <span class="close"><i class="ae-icon ae-icon-close"></i></span>
        </div>

        <div class="address-content">
            <p class="notice common-margin">
                <i class="ae-icon ae-icon-attention"></i>
                <span id="error-txt"></span>
            </p>

            <div class="addr-receiver line">
                <span class="title-txt">收件人</span>
                <input type="text" placeholder="请填写收件人" id="consignee" name="consignee" maxlength="5" class="common-input">
            </div>

            <div class="addr-mobile line">
                <span class="title-txt">联系电话</span>
                <input type="text" placeholder="请填写联系电话" id="mobile" maxlength="11" name="mobile" class="common-input" onkeyup="this.value=this.value.replace(/[^\d]/g,'');" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')">
            </div>

            <div class="addr-area line">
                <span class="title-txt">所在地区</span>
                <select name="province" class="common-select select-province" name="province" id="city1">
                </select>

                <select name="city" class="common-select" name="city" id="city2">
                </select>

                <select name="district" class="common-select" name="district" id="city3">
                </select>
            </div>

            <div class="addr-detail line">
                <span class="title-txt">详细地址</span>
                <textarea rows="4" name="address" id="address" maxlength="40" class="common-textarea" placeholder="填入您的详细地址"></textarea>
            </div>

            <div class="addr-zipcode line">
                <span class="title-txt">邮编</span>
                 <input type="text" placeholder="请填写邮编" id="zipcode" name="zipcode" maxlength="6"
                    onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
                    onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
                    class="common-input">
            </div>

            <div class="addr-default line common-margin">
                <input type="checkbox" id="isDefault" checked="checked" name="isDefault" value="1">
                <span class="default">设置为默认地址</span>
            </div>

            <div class="addr-save line common-margin">
                <a id="saveAddr" class="save-btn">保存</a>
            </div>
        </div>
    </form>
</div>

<!-- send sms -->
<div class="wgt-dialog-sms sms-dialog">
    <div class="address-title">
        <span class="title">短信验证码</span>
        <span class="close"><i class="ae-icon ae-icon-close"></i></span>
    </div>

    <div class="modify-pass-content sms-content">
        <div class="form-control cmn-clearfix" id="error0" style="display:none">
            <div class="form-key"></div>
            <div class="pull-right error-notice">
                <i class="ae-icon ae-icon-attention error-icon"></i><em id="error1"></em>
            </div>
        </div>
        <div class="form-control cmn-clearfix">
            <div class="form-key"></div>
            <div class="pull-right success-notice"  style="display:none;">
                <i class="ae-icon ae-icon-success success-icon"></i><em id=""></em>
            </div>
        </div>
        <!--短信验证码-->
        <div class="form-control cmn-clearfix" style="display:none" id="error2">
            <div class="error-notice error-left-msg">
                <i class="ae-icon ae-icon-attention error-icon"></i><em id="error3"></em>
            </div>
        </div>

        <!--提示语-->
        <div class="form-control cmn-clearfix">
            <input type="hidden" id="mobileNumHidden">
            <p class="tip tip-margin">绑定银行卡需要短信确认，验证码已发送至 <span id="mobileNum"></span></p>
        </div>

        <div class="form-control cmn-clearfix" style="display:none;" id="success2">
            <div class="success-notice error-left-msg">
                <i class="ae-icon ae-icon-success success-icon"></i><em id="successMsg2"></em>
            </div>
        </div>
        <div class="form-control cmn-clearfix">
            <input type="text" maxlength="6" class="form-value cmn-input form-width tip-margin" id="code"  placeholder="请输入验证码">
            <div>
                <input class="timeout" type="button" id="settime-btn" value="重新获取">
                <input type="hidden" id="msg-code" value="">
            </div>
        </div>
        <div class="form-control cmn-clearfix">
            <div class="pull-left btn-next cmn-btn-gold-w12 tip-margin">
                <a href="javascript:;" class="nextBtn"  id="nextBtn-two">下一步</a>
            </div>

            <div class="no-sms-code pull-left noMsg">
                <a href="#" class="no-Msg get-no-code" id="no-Msg">收不到验证码?</a>

                <!--收不到验证码-->
                <div class="no-mag-wrapper">
                    <div class="noMsgTips">
                        <div class="noMsgTips-info">
                            <p>1.请确认当前是否使用银行预留的手机号码</p>
                            <p>2.请检查短信是否被拦截</p>
                            <p>3.预留的手机号码已停用，请联系该银行客服修改</p>
                            <p>还有其他疑问，请联系400-818-0060</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

