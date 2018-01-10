/* 
 * smsCode 0.1
 * Date: 2016-3-8
 * 短信倒计时
 *@default：未点击过或重新获取为这个状态
 *@granted：用户点击允许后的状态，时间60s倒计时
 */
	$.fn.extend({
		smsCode: function(options) {
			// 短信验证码
			var defaults = {
				time: 120,
				callback:function(){}
			}
			options =  $.extend(defaults, options);
			return this.each(function() {
				var o = options;
				var validCode=true,
					wait=o.time;
				$(this).on("click",function(e){
					var _this=$(this);
					var t;
					if (validCode) {
						validCode=false;

						t=setInterval(function  () {
							wait--;

							if(o.time<10){
								_this.html("0"+wait+'秒后重新获得');
							}else{
								_this.html(wait+' 秒后重新获得');
							}
							_this.addClass("disabled");

							if (wait==0) {
								clearInterval(t);
								_this.html("重新获取").removeClass("disabled");
								validCode=true;
								wait=o.time;
								o.callback && o.callback();
							}
						},1000)
					}
				})
			})
		},

		clearInput:function(options){
			/*
			 *文本框输入内容后添加删除按钮，
			 *删除按钮需与文本框同级
			 *objClear:删除按钮的class
			 *className:出现删除按钮时的class
			 */
			var defaults={
				objClear:"j-clear-input",
				className:'clean'
			}
			options=$.extend(defaults,options);

			return this.each(function(){
				var o=options;

				$(this).on("input focus",function(t) {
					var e = $(t.target),a;
					a = e.next("."+o.objClear);
					"" == e.val() ? a.removeClass(o.className) : a.addClass(o.className)
				});


				$("."+o.objClear).on("click",function(t) {
					var e = $(t.target),
						a = e.prev("input");
					a.val(""),
						e.removeClass(o.className);
				});
			})
		},
		//遮罩
		mask:function(obj){
			var defaults = {
				duration: 400,
				//easing: "easeOutCubic",
				color: "rgba(0,0,0,0.3)",
				click: !1
			};
			if (void 0 === obj) var obj = {};
			$.extend(defaults, obj);
			obj = defaults;
			var h = $("<div class='mask'></div>");
			return obj.insertBefore ? h.insertBefore(obj.insertBefore) : h.appendTo("body"),h.css({
				height: "100%",
				width: "100%",
				position: "fixed",
				"background-color": obj.color,
				top: "0",
				bottom: "0",
				left: "0",
				right: "0",
				display: "none"
			}),h.fadeIn();
		}






	})

	$.extend({
		getUrlParam:function(name){
			var reg= new RegExp("(^|&)"+name +"=([^&]*)(&|$)");
			var r= window.location.search.substr(1).match(reg);
			if (r!=null) return unescape(r[2]); return null;
		},
		isNull:function(_num){
			if(!_num){
				return true;
			}
			return false
		}



	})



