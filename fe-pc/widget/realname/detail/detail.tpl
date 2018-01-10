<input type="hidden" name="for_login_userphone" id="for_login_userphone" value="">
<input type="hidden" name="userName" id="userName" value="">

<div class="real-detail">
	<div class="detail-notice cmn-clearfix">
		<span class="notice-slogan">
			<i class="ae-icon ae-icon-about notice-icon"></i>
		</span>

		<p class="notice-txt">
			注意：您的身份证和银行卡将用于签约，请填写真实身份信息和真实有效的银行卡。
		</p>
	</div>

	<div class="detail-forms">
		<div class="forms-item">
			<span class="item-key">真实姓名</span>
			<span class="item-val">
				<input type="text" class="cmn-input" name="realName" placeholder="请填写本人真实姓名" maxlength="50">
			</span>
		</div>

		<div class="forms-item item-card-type">
			<span class="item-key">证件类型</span>
			<span class="item-val">
				<select class="cmn-input select-card-type select-type"
					 	name="idcardtype" id="idcardtype">
					<option value="1">身份证</option>
					<option value="3">港澳回乡证</option>
					<option value="4">台胞证</option>
					<option value="5">外籍护照</option>
				</select>
			</span>
		</div>
		<div class="forms-item item-line" style="display: none;"></div>
		<div class="forms-item">
			<span class="item-key">证件号码</span>
			<span class="item-val">
				<input type="text" class="cmn-input" placeholder="请填写您的真实号码，认证通过后不能修改"
					id="document-num" name="idCardNo" maxlength="20">
			</span>
		</div>

		<div class="forms-item item-ident-card">
			<span class="item-key ident-card-key">上传证件照片</span>
			<span class="item-val">
				<dl>
					<dt>
						<a href="javascript:;" class="upload-wrap" data-id="certPhoto1">
							<input type="file" class="upload-file">
							<i class="ae-icon ae-icon-plus upload-file-icon"></i>
						</a>
					</dt>
					<dd>证件正面照，请确保证件号码清晰</dd>
				</dl>

				<dl>
					<dt>
						<a href="javascript:;" class="upload-wrap" data-id="certPhoto2">
							<input type="file" class="upload-file">
							<i class="ae-icon ae-icon-plus upload-file-icon"></i>
						</a>
					</dt>
					<dd>手持免冠正面证件照，请确保照片清晰</dd>
				</dl>
			</span>
		</div>

		<div class="forms-item bank" style="display: none;">
			<span class="item-key">开户银行</span>
			<span class="item-val">
				<select class="cmn-input select-type"
				 		id="cardType" name="cardType">
					<option value="0102">工商银行</option>
					<option value="0308">招商银行</option>
					<option value="0105">建设银行</option>
					<option value="0103">农业银行</option>
					<option value="0303">光大银行</option>
					<option value="0100">中国邮政储蓄银行</option>
				</select>
			</span>
		</div>

		<div class="forms-item bank" style="display: none;">
			<span class="item-key">银行卡号</span>
			<span class="item-val">
				<input type="text" class="cmn-input" placeholder="请填写可支付的银行卡号"
					id="cardNo" name="cardNo" maxlength="22">
			</span>
		</div>

		<div class="forms-item item-ident-card">
			<span class="item-key ident-card-key">上传银行卡照片</span>
			<span class="item-val">
				<dl>
					<dt>
						<a href="javascript:;" class="upload-wrap" data-id="bankPhoto">
							<input type="file" class="upload-file">
							<i class="ae-icon ae-icon-plus upload-file-icon"></i>
						</a>
					</dt>
					<dd>银行卡正面照，请确保卡号清晰</dd>
				</dl>
			</span>
		</div>

		<div class="forms-item">
			<span class="item-key">手机号码</span>
			<span class="item-val" id="phone"></span>
		</div>

		<div class="forms-item">
			<span class="item-key">验证码</span>

			<span class="item-val">
				<input type="text" class="cmn-input item-val-code" name="code">
				<a href="javascript:send();" class="cmn-btn-white-w12 item-val-btn" id="sendCode" >获取验证码</a>
			</span>
		</div>


		<div class="cmn-notice-wrapper cmn-clearfix" style="display: none;" id="error">
            <div class="cmn-notice-error notice-position-control cmn-clearfix">
            	<div class="cmn-notice-icon">
	            	<i class="ae-icon ae-icon-attention error-icon"></i>
            	</div>
            	<div class="cmn-notice-text error-text" id="error1"></div>
            </div>
        </div>
        <div class="cmn-notice-wrapper cmn-clearfix" style="display: none;" id="success">
            <div class="cmn-notice-success notice-position-control cmn-clearfix">
            	<div class="cmn-notice-icon">
	            	<i class="ae-icon ae-icon-success success-icon"></i>
            	</div>
            	<div class="cmn-notice-text" id="success1"></div>
            </div>
        </div>
		<div class="forms-item">
			<span class="item-only-val">
				<a href="javascript:;" class="cmn-btn-gold-w12" id="nextBtn4">提交</a>
			</span>
		</div>

	</div>
</div>