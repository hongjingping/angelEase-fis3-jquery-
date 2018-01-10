checkUserLogin();

var currentpage = 1;
var InvestOrder = {
	init: function () {
		this.orderList('',1);
	},
	zebraCrossing: function () {
		$('.content-tab-list').find('.tab-list-item:odd').css('background', '#F8F9FA');
	},
	orderList: function (status,pageIndex) {

		$.ajax({
		    url: host + 'invest/invest.htm?status=' + status + '&page=' + pageIndex,
		    type: 'POST',
		    data: token_client_data,
		    dataType: 'JSON',
		    success: function (data) {
		    	if (data.code == '0000') {
		    		var userType = data.data.user.userType;
                    if (userType == 1) {
                        $('.identification.realname').css('display','block');
                        $('.order-content').hide();
                    } else if (userType == 0 || userType == 3) {
                        $('.identification.investor').css('display','block');
                        $('.order-content').hide();
                    } else {
                    	var tpl = __inline('order-list.tmpl');
				        if (data.data.retMaps.length > 0) {
				            var html = tpl(data);
				            $('.content-tab-list').html(html);
				        } else {
				        	$('.content-tab-list').html('');
				        	var htmlNodata = '';
				        		htmlNodata += '<div class="list-no-data">';
				        		htmlNodata += '<p class="no-data-icon">';
				        		htmlNodata += '<i class="ae-icon ae-icon-card"></i>';
				        		htmlNodata += '</p>';
				        		htmlNodata += '<p class="no-data-txt">目前没有投资记录</p>';
				        		htmlNodata += '<a href="../../page/home/home.html" class="cmn-btn-white-w12">去看看项目</a>';
				        		htmlNodata += '</div> ';
				        	$('.content-tab-list').html(htmlNodata);
                        }
                        $('#totalpage').html(data.data.pageCount);
                        $('.content-tab-list').find('.tab-list-item:odd').css('background', '#F8F9FA');
                    }
			    }else if (data.code == '4000') {
                	//window.location.href = loginUrl;
					/*
					 * jingpinghong@creditease.cn
					 * 2017-02-16
					 * */
					handleLoginTimeout();
            	}
		    },
		    error: function(e) {
		    }
		}).done(function () {
			$('#currentPage').html(currentpage);
		});
	}
};

InvestOrder.init();

// 投资订单
$(document).on('click', '.value', function(e) {
    e.preventDefault();
	$('.value').each(function(){
		$(this).removeClass('active');
	});
	$(this).addClass('active');
    status = $(this).attr('value');
    currentpage = 1;
    $('#hidStatus').val(status);
    InvestOrder.orderList(status,1);
})

function pagecontent(pagenum){
	currentpage = pagenum;
	$('#currentPage').html(currentpage);
	InvestOrder.orderList($('#hidStatus').val(),pagenum);
}

// 上一页
function prepage(pre){
	if(currentpage == 1){
		pagecontent(1);
		$(pre).css('color','#808080');
	}else{
		pagecontent(Number(currentpage) -1);
		$(pre).css('color','black');
	}
	$(pre).attr("href",'#?pageNum=' + currentpage);
	$('#nextpage').css('color','black');
}

// 下一页
function sufpage(suf){
	var total = $('#totalpage').html();
	if(total == currentpage){
		$(suf).attr('href','javascript:;');
		$(suf).css('color','#808080');
	}else{
		pagecontent(Number(currentpage) + 1);
		$(suf).attr('href','#?pageNum=' + currentpage);
		$(suf).css('color','black');
	}
	$('#beforepage').css('color','black');
}

// 跳转页
function jumppage(){
	var pages = $('#jumppage').val();
	if(pages == ''){
		var readSmartAlert = new SmartAlert({
    	    title: '错误',
    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请输入跳转页码!</span>',
    	    type: 'confirm',
    	    okText: '我知道了',
    	    maskClosable: false,
    	});
    	readSmartAlert.open();
		return;
	}else if(Number(pages) > Number($('#totalpage').html())){
		var readSmartAlert = new SmartAlert({
    	    title: '错误',
    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">跳转页超过总页数!</span>',
    	    type: 'confirm',
    	    okText: '我知道了',
    	    maskClosable: false,
    	});
    	readSmartAlert.open();
		return;
	}else{
		window.location.href = window.location.href.substring(0,window.location.href.indexOf('html')+4) + '#?pageNum=' + pages;
		pagecontent(pages);
	}
}

// 尾页
function lastpages(last){
	window.location.href = window.location.href.substring(0,window.location.href.indexOf('html')+4) + '#?pageNum=' + $('#totalpage').html();
	pagecontent($('#totalpage').html());
}

// check页码
function checkPage(page) {
	return page.replace(/[^\d]/g,'');
}

//investor 认证  ../../page/investor/identification.html

$.ajax({
	url: host + 'baseuser/getUserStatus.htm',
	dataType: 'JSON',
	type: 'POST',
	data:token_client_data,
	success: function (result) {
		console.log(JSON.stringify(result)+"数据");
		//如果已认证跳转状态页
		if(result.code == '0000'){
			if(result.data.userCheckStatus == '0'){
				$('#investor-check').attr('onclick','window.location.href="/page/realname/auth.html"');
			}else if(result.data.investorStatus != '0'){
				$('#investor-check').attr('onclick','window.location.href="/page/investor/result.html"');
			}else if(result.data.investorStatus == '0'){
				$('#investor-check').attr('onclick','window.location.href="/page/investor/identification.html"');
			}
		}else if(result.code == '4000'){
			//location.href = loginUrl;
			/*
			 * jingpinghong@creditease.cn
			 * 2017-02-16
			 * */
			handleLoginTimeout();
		}
	},
	error: function(e) {
	}
});