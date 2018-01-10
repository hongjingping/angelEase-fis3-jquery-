<div class="investor-result">
	<!-- 身份证 -->
	<div class="result-info sfz" style="display: none;">
		<i class="ae-icon ae-icon-success"></i>
		<!--<p class="no-pass">您已完成实名认证并成功绑定银行卡！</p>-->
		<p class="no-pass">恭喜您，实名认证成功！</p>
		<p >现在您可以</p>
		<!-- <a href="javascript:update();" class="cmn-btn-gold-w12 re-ident">更换绑定银行卡</a> -->
		<br>
		<a href="javascript:toInvestor();" class="cmn-btn-gold-w12 re-ident isinvest">去进行合格投资人认证</a>
	</div>

	<div class="result-info gat_0" style="display: none;">
		<i class="ae-icon ae-icon-wait"></i>
		<p class="no-pass">实名认证信息提交成功，请耐心等待审核!</p>
		<a href="javascript:toInvestor();" class="cmn-btn-gold-w12 re-ident isinvest">去进行合格投资人认证</a>
	</div>

	<div class="result-info gat_1" style="display: none;">
		<i class="ae-icon ae-icon-success"></i>
		<p class="no-pass">审核状态：认证成功</p>
		<a href="javascript:toInvestor();" class="cmn-btn-gold-w12 re-ident isinvest">去进行合格投资人认证</a>
	</div>

	<div class="result-info gat_2" style="display: none;">
		<i class="ae-icon ae-icon-attention"></i>
		<p class="no-pass">实名认证失败！</p>
		<p class="result-txt reason"></p>
		<p class="result-txt">若对审核结果有疑问请联系客服电话400-818-0060</p>
		<a href="javascript:recheck();" class="cmn-btn-gold-w12 re-ident">重新认证</a>
	</div>


	<div class="result-notice">
		<ul class="notice-key">
			<li>真实姓名</li>
			<li>证件类型</li>
			<li>证件号码</li>
			<li class="ident-photo gat" style="display: none;">证件照片</li>
			<li class="gat" style="display: none;">开户银行</li>
			<li class="gat" style="display: none;">银行卡号</li>
			<li class="bank-photo gat" style="display: none;">银行卡照片</li>
		</ul>

		<ul class="notice-val">
			<li id="realName1"></li>
			<li id="idcardtype"></li>
			<li id="idcardno"></li>
			<li class="gat" style="display: none;">
				<img src="" id="pic1">
				<img src="" id="pic2">
			</li>
			<li id="bankName"  class="gat" style="display: none;"></li>
			<li id="bankNo"  class="gat" style="display: none;"></li>
			<li class="gat" style="display: none;">
				<img src="" id="pic3">
			</li>
		</ul>
	</div>
</div>