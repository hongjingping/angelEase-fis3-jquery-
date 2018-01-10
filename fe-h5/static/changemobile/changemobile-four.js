(function () {

	// 倒计时
	var InterValObj;
	var count = 20000;
	var curCount;

	var ChangeMobile = {
		init: function () {
			this.changeMobileHeader();
			this.showSuc();
		},

		changeMobileHeader: function () {
			$('.cmn-header-title').text('更换绑定手机号');
		},

		showSuc:function(){
			$('.toast').attr("style","display:block");
			curCount = count;
			InterValObj = window.setInterval(countdown, 20000);
			location.href = loginUrl;
		}
	};
    
	ChangeMobile.init();

	// 倒计时
	function countdown() {  
		if (curCount == 0) {
			window.clearInterval(InterValObj);  
		}  
		else {  
			curCount--;
		}  
	};
    
})();