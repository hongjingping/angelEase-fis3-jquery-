<div class="investor-info">
	<div class="info-article">
		<div class="article-notice">
			<i class="ae-icon ae-icon-attention notice-icon"></i>
			<span class="notice-txt">股权投资属于高收益高风险的投资类型，投资者应有充分的资金实力及意愿承担风险，请理性判断、谨慎决策。成功投资者依靠小额、分散投资来降低风险，请您确认您满足以下条件后继续申请
 <br>
                1、充分了解并能承受股权投资的高风险；<br>
                2、资产满足AngelEase《投资人规则》的要求 <br>
                3、用于股权投资的资金不超过家庭年收入的10% <br>
                4、您预期的投资期限应在1-3年甚至更长 <br>
				＊温馨提示：依【有限合伙管理办法】规定，年龄限制为18-69周岁(含69岁)，投资人不可为现役军人或公务员；外籍与港澳台身份可投股权类以外所有项目
            </span>
		</div>
		<table class="article-items">
			<tr>
				<td class="item-key">真实姓名</td>
				<td class="item-val" id="real-name"></td>
			</tr>
			<tr>
				<td class="item-key">手机号码</td>
				<td class="item-val" id="mobile"></td>
			</tr>
			<tr>
				<td class="item-key">认证类型</td>
				<td class="item-val">
					<input type="radio" name="type" class="item-radio" value="0" checked="checked">个人
					<input type="radio" name="type" class="item-radio item-radio-group" value="1">机构
				</td>
			</tr>
			<tr class="fund-env" id="netassets">
				<td class="item-key">投资条件</td>
				<td class="item-val">
					<select name="netAssets" class="cmn-input">
						<option value="">请选择投资条件</option>
                        <option value="1">我的金融资产不低于100万元</option>
                        <option value="2">我的家庭收入不低于60万元</option>
                        <option value="3">我的个人年收入不低于30万元</option>
                        <option value="4">我不符合上述任一条件</option>
					</select>
				</td>
			</tr>
			<tr class="fund-fund" id="realnamediv" style="display:none">
			     <td class="item-key">机构名称</td>
			     <td class="item-val">
			         <input type="text" class="cmn-input" id="realname" name="realname" placeholder="填写您所在的公司机构名称"/>
			     </td>
			</tr>
			<tr class="fund-fund" id="orgCodediv" style="display:none">
                 <td class="item-key">组织机构代码</td>
                 <td class="item-val">
                     <input type="text" class="cmn-input" id="orgCode" name="orgCode" placeholder="填写您所在的公司组织机构代码"/>
                 </td>
            </tr>
			<tr class="free-fund">
				<td class="item-key">可投资产</td>
				<td class="item-val">
					<select name="position" id="position" class="cmn-input">
					</select>
					<p class="free-fund-notice">
						<span id="canmsg"></span>
						<span id="msg">您在Angelease的可投资产为</span>
						<span class="can" id="can"></span>
						<span id="remind-text">万</span>
					</p>
				</td>
			</tr>
			<tr class="fund-env">
				<td class="item-key">所在行业</td>
				<td class="item-val">
					<select name="industry" id="industry" class="cmn-input">
					</select>
				</td>
			</tr>
			<tr class="fund-area">
				<td class="item-key" valign="top">偏好投资领域</td>
				<td class="item-val">
					<p class="fund-area-option"  id="hopeindustry">
					</p>
				</td>
			</tr>

			<tr class="fund-upload" id="imagediv" style="display:none">
				<td class="item-key fund-upload-margin">上传资产证明</td>
				<td class="item-val fund-upload-margin">
					<a href="javascript:;" class="upload-wrap" data-id="certPhoto1">
						<i class="ae-icon ae-icon-plus upload-file-icon"></i>
					</a>

					<a href="javascript:;" class="upload-wrap" data-id="certPhoto2">
						<i class="ae-icon ae-icon-plus upload-file-icon"></i>
					</a>

					<a href="javascript:;" class="upload-wrap" data-id="certPhoto3">
						<i class="ae-icon ae-icon-plus upload-file-icon"></i>
					</a>

					<p class="upload-txt">
						支持小于2MB格式为JPG、JPEG、PNG的图片；至少上传一张图片。您可以上传您的资产证明文件或工作名片，有助于顺利通过认证；（其中资产证明文件包含银行流水、股票、债券、基金份额、资产管理计划、银行理财产品、信托计划、 保险产品、期货权益等的认购合约。）
					</p>
				</td>
			</tr>
			<tr class="fund-upload">
			     <td class="item-key"></td>
			     <td class="item-val">

					<div class="upload-para cmn-clearfix">
						<input class="agree-protocol-checkbox" type="checkbox" id="agreement" value="0">
						<div class="agree-protocol">
							<span>本人承诺以上所有信息属实，已阅读并同意签署</span>
					        <a href="/page/protocol/risk.html" target="_blank">《投资人声明》</a>
					        <span>，如有虚假信息，愿承担相应后果和法律责任。</span>
						</div>
					</div>
					<!-- <p class="upload-para"><input type="checkbox" value="" name="isInves" id="isinves">申请为<a href="/page/help/help.html#help-mode" target="_blank">领投人</a></p> -->

					<p class="upload-para"><input type="checkbox" value="0" name="isInves" id="isinves">本人声明本人非现役军人或在职公务员</p>

					<p class="upload-notice" style="display:none" id="errornotice"><i class="ae-icon ae-icon-attention notice-icon"></i><span id="error"></span></p>
				</td>
			</tr>

			<tr>
				<td></td>
				<td class="item-val">
					<p><a href="javascript:;" class="cmn-btn-gold-w12"  id="investorbtn">提交</a></p>
				</td>
			</tr>
		</table>

	</div>
</div>
