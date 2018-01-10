 <div class="address-main">
    <div class="editaddress-wrapper">
        <div class="top-nav cmn-clearfix">
            <div class="tip detail-header-title"></div>
            <div class="goback" onclick="history.go(-1)">返回</div>
        </div>
        <form action="" method="post" class="content" id="formAdr" enctype="multipart/form-data">
        	<input type="hidden"  id="token" name="token" value=""  />
			<input type="hidden"  id="clientType" name="clientType" value="pc"  />
			<input type="hidden" id="provinceCode" name="provinceCode" value="">
			<input type="hidden" id="cityCode" name="cityCode" value="">
			<input type="hidden" id="districtCode" name="districtCode" value="">
			<input type="hidden" id="adrId" name="id" value="">
	        <div class="address-content">
	            <p class="notice" id="error0" style="display:none;">
	                <i class="ae-icon ae-icon-attention"></i><span id="error1"></span>
	            </p>
	            <div class="addr-receiver line">
	                <span class="title-txt">收件人</span>
	                <input type="text" placeholder="请填写收件人" name="consignee" id="consignee" maxlength="5" class="cmn-input address-input">
	            </div>
	            <div class="addr-mobile line">
	                <span class="title-txt">联系电话</span>
	                <input type="text" placeholder="请填写联系电话" name="mobile" id="mobile" maxlength="11"
            			onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
            			class="cmn-input address-input" onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
            			onafterpaste="this.value=this.value.replace(/[^\d]/g,'')">
	            </div>
	            <div class="addr-area line">
	                <span class="title-txt">所在地区</span>
	                <select class="address-select" name="province" id="city1">
	                </select>
	                <select class="address-select" name="city" id="city2">
	                </select>
	                <select class="address-select" name="district" id="city3">
	                </select>
	            </div>
	            <div class="addr-detail line">
	                <span class="title-txt">详细地址</span>
	                <textarea rows="4"name="address" id="address" maxlength="40"  class="address-textarea" placeholder="填入您的详细地址"></textarea>
	            </div>
	            <div class="addr-zipcode line">
	                <span class="title-txt">邮编</span>
	                <input type="text" placeholder="请填写邮编" id="zipcode" name="zipcode" maxlength="6"
	                  onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
	                  onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
	                  class="cmn-input address-input">
	            </div>
	            <div class="addr-default line address-margin">
	                <input type="checkbox" id="agreement" checked="checked" name="isDefault" value="1">
	                <span class="default">设置为默认地址</span>
	            </div>
	            <div class="addr-save line address-margin">
	                <a id="btn" href="javascript:;" class="cmn-btn-gold-w12">保存</a>
	            </div>
	        </div>
        </form>
    </div>
</div>