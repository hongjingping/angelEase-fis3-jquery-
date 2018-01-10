<div class="project-payinfo">
	<p class="item-title">
		<span>支付信息</span>
	</p>
	<div class="payinfo-box">
		<table class="cmn-table cmn-table-bordered">
            <colgroup>
                <col width="100px"></col>
                <col></col>
            </colgroup>
            <tbody>
                <tr>
                    <td>支付类别</td>
                    <td>投资款</td>
                </tr>
                <tr>
                    <td>投资项目</td>
                    <td id="proName"></td>
                </tr>
                <tr>
                    <td>投资金额</td>
                    <td id="proInveseAmount">元</td>
                </tr>
                <tr>
                    <td>姓名</td>
                    <td id="userName"></td>
                </tr>
                <tr>
                    <td>地址</td>
                    <td id="userAddress"></td>
                </tr>
                <tr>
                    <td>联系方式</td>
                    <td id="mobile"></td>
                </tr>
                 <tr>
                    <td>邮政编码</td>
                    <td id="zipCode"></td>
                </tr>
            </tbody>
        </table>
		<!-- <ul class="info-item info-key">
			<li>支付类别</li>
			<li>投资项目</li>
			<li>投资金额</li>
			<li>姓名</li>
			<li>地址</li>
			<li>联系方式</li>
			<li>邮政编码</li>
		</ul>
		<ul class="info-item info-val">
			<li>投资款</li>
			<li id="proName"></li>
			<li id="proInveseAmount"></li>
			<li id="userName"></li>
			<li id="userAddress"></li>
			<li id="mobile"></li>
			<li id="zipCode"></li>
		</ul> -->
	</div>
	<div class="payinfo-num">
		<div class="pay-info">
			<div class="pay-txt">应付金额</div>
			<div>
                <span id="proInveseAmountSpan" class="pay-num"></span>
                <span>元</span>
            </div>
		</div>
		<div class="payinfo-btns">
			<a href="javascript:;" class="cmn-btn-gold-w12 pay-sign" id="toSign">去签约</a>
			<a href="javascript:history.back(-1);" class="back-edit">返回修改</a>
		</div>
	</div>
</div>