<div class="cmn-user-menu-bar">
	<p class="menu-bar-head">
		<img src="./resource/images/menu-bar-head.png" id="avatar-img"  class="bar-head-img" >
		<!--
		<img src="./resource/images/head-mask.png" class="bar-head-mask" style="display: none;">
		-->
		<span class="head-mask"  onclick="location.href='/page/basic/basic.html'">
			<i class="ae-icon ae-icon-edit icon-success"></i>
		</span>
	</p>

	<p class="menu-bar-name username" id="uName"></p>

	<!--<div class="menu-bar-ants">
		<div class="bar-ants-wrap">
			<dl class="menu-bar-ant" id="certification" onclick="location.href='/page/realname/auth.html'">
				<dt id="cIcon" class="">
					<i id="cIconI" class=""></i>
					<i id="cIconII" class=""></i>
				</dt>
				<dd>实名认证</dd>
			</dl>

			<dl class="menu-bar-ant" id="investor" >
				<dt id="iIcon" class="">
					<i id="iIconI" class=""></i>
					<i id="iIconII" class=""></i>
				</dt>
				<dd>投资人认证</dd>
			</dl>
			&lt;!&ndash;
			<dl class="menu-bar-ant" onclick="location.href='../financier/form.html'">
				<dt class="bar-ant-finance">
					<i class="ae-icon ae-icon-cert-stars bar-ant-icon"></i>
					<i class="ae-icon ae-icon-attention bar-ant-dot"></i>
				</dt>
				<dd>融资人认证</dd>
			</dl>
			&ndash;&gt;
		</div>
	</div>-->
	<ul class="menu-bar-lists">
		<li class="menu-bar-item my-fund-item" onclick="location.href='../../page/invest/list.html'">
			<a href="../../page/invest/list.html">
				<i class="ae-icon ae-icon-invest"></i>
				<span>我的投资</span>
			</a>
			<span class="bar-item-line my-fund-line"></span>
		</li>
		<li class="menu-bar-item my-financing-item" onclick="location.href='/page/myfinancing/myfinancing.html'">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-finance"></i>
				<span>我的融资</span>
			</a>
			<span class="bar-item-line financing-line"></span>
		</li>
		<li class="menu-bar-item my-attention-item" onclick="location.href='/page/attention/attention_total.html'">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-star2"></i>
				<span>我的关注</span>
			</a>
			<span class="bar-item-line attention-line"></span>
		</li>


		<li class="menu-bar-item my-name-item" id="certification" onclick="location.href='/page/realname/auth.html'">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-shimingrenzheng"></i>
				<span>实名认证</span>
			</a>
			<span class="bar-item-line name-line"></span>
		</li>
		<li class="menu-bar-item my-investor-item"  id="investor"  >
			<a href="javascript:;">
				<i class="ae-icon ae-icon-touzirenrenzheng"></i>
				<span>合格投资人认证</span>
			</a>
			<span class="bar-item-line investor-line"></span>
		</li>

		<li class="menu-bar-item my-bank-item" id="add-bank" >
			<a href="javascript:;">
				<i class="ae-icon ae-icon-yinhangka"></i>
				<span>银行卡</span>
			</a>
			<span class="bar-item-line bankcard-line"></span>
		</li>


			<li class="menu-bar-item message-item" onclick="location.href='/page/mailbox/maillist.html'">
			<a href="javascript:;" class="bar-item-message">
				<i class="ae-icon ae-icon-wodexiaoxi"></i>
				<span>站内信</span>
				<span class="bar-item-num" id="unreadConut"></span>
			</a>
			<span class="bar-item-line message-line"></span>
		</li>
		<li class="menu-bar-item my-address-item" onclick="location.href='/page/address/myaddress.html'">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-location1"></i>
				<span>我的地址</span>
			</a>
			<span class="bar-item-line address-line"></span>
		</li>
<!--
		<li class="menu-bar-item" onclick="location.href='/page/modifypass/stepone.html'">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-password"></i>
				<span>修改密码</span>
			</a>
			<span class="bar-item-line"></span>
		</li>
-->

		<!--
		<li class="menu-bar-item">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-save-center"></i>
				<span>更换绑定银行卡</span>
			</a>
			<span class="bar-item-line"></span>
		</li>
		-->
		<!-- <li class="menu-bar-safe">
			<a href="javascript:;">
				<i class="ae-icon ae-icon-save-center"></i>
				<span>安全中心</span>
			</a>
			<span class="bar-item-line"></span>
		</li> -->
	</ul>
</div>