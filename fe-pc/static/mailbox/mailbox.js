$(function () {
	checkUserLogin();
	currentpage = 1;
	$('#currentPage').html(currentpage);

	//PC消息查询
	$.ajax({
		url: host + 'mmessage/getPCMessage.htm',
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.data.modelList.length > 0){
					$('#hasmsg').css('display','block');
					var contentHtml ='<tr onclick="document.location=\'maildetail.html?msgId=#id#\'">' +
                    				 '<td #titleCss# class="title-content">#title#</td>' +
                				 	 '<td class="font-gray">宜信众筹</td>' +
                				 	 '<td class="font-gray">#date#</td>' +
									 '</tr>';
					var newHtml = '';
					var titleCss = '';
					$.each(result.data.modelList , function (index,element){
						newHtml = contentHtml.replace('#title#', '【系统消息】' + element.msgName).
									replace('#date#', element.msgDate).
									replace('#id#', element.msgId);
						if(element.isRead == '1'){
							newHtml = newHtml.replace('#titleCss#', ' style="font-weight: 900;" ');
						}else{
							newHtml = newHtml.replace('#titleCss#', titleCss);
						}
						$('.list').append(newHtml);
						// $("newHtml").appendTo('.list')
					});

					//拼分页
					/*var pageHtml = '<a href="#?pageNum=1" onclick="pagecontent(1)" style="border:1px solid #ccc;margin:1px">首 页 </a>' +
								   '<a href="javascript:void(0);" onclick="prepage(this)" style="border:1px solid #ccc;margin:1px" id="beforepage"> 上一页 </a>' ;
					var pageHtml1 = '';
					var pageHtml2 = '<a id="five" href="javascript:void(0);" >... </a><a href="#?pageNum=' + result.data.page.total + '" onclick="pagecontent(' + result.data.page.total + ')" style="border:1px solid #ccc;margin:1px">' + result.data.page.total + '</a>';
					var pageHtml3 = '<a href="javascript:void(0);"  onclick="sufpage(this,'+result.data.page.total+')"  style="border:1px solid #ccc;margin:1px" id="nextpage"> 下一页 </a><a href="#?pageNum=' + result.data.page.total + '" onclick="pagecontent(' + result.data.page.total + ')"  style="border:1px solid #ccc;margin:1px">尾 页</a>';
					var pageHtml4 = ' 共<span> ' + result.data.page.total + '</span> 页 到第<input type="text" style="width:20px" id="jumppage"/>' + '页<input type="button" value="确定" onclick="jumppage()"/>';
					if(result.data.page.total >= 0){
						if(result.data.page.total < 4){
							for(var i = 1; i < result.data.page.total + 1;i++){
								pageHtml1 += '<a href="#?pageNum=' + i + '" onclick="pagecontent(' + i + ')" style="border:1px solid #ccc;margin:1px">' + i + '</a> ';
							}
						}else{
							for(var i = 1; i < 4;i++){
								pageHtml1 += '<a href="#?pageNum=' + i + '" onclick="pagecontent(' + i + ')" style="border:1px solid #ccc;margin:1px">' + i + '</a> ';
							}
						}
						var pagedivstr = '';
						if(result.data.page.total < 4){
							pagedivstr = pageHtml + pageHtml1 + pageHtml3 + pageHtml4;
						}else{
							pagedivstr = pageHtml + pageHtml1 + pageHtml2 + pageHtml3 + pageHtml4;
						}

						$('#pagediv').append(pagedivstr);
					}*/
					$('#totalpage').html(result.data.page.total);
				}else {
					$('#nomsg').css('display','block');
					$('#hasmsg').css('display','none');
				}
			}else if(result.code=='4000'){
                // location.href = loginUrl;
                handleLoginTimeout();
            }
		}
	});


	$('.message-line').show();

});

function pagecontent(pagenum){
	currentpage = pagenum;
	$('#currentPage').html(currentpage);
	$.ajax({
		url: host + 'mmessage/getPCMessage.htm?pageNum=' + pagenum,
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.data.modelList.length > 0){
					$('.list').empty();
					var contentHtml ='<tr>' +
				   				 	 '<td #titleCss#>#title#</td>' +
								 	 '<td class="font-gray">宜信众筹</td>' +
								 	 '<td class="font-gray">#date#</td>' +
									 '</tr>';
					var newHtml = '';
					var titleCss = '';
					$.each(result.data.modelList , function (index,element){
						newHtml = contentHtml.replace('#title#', '【系统消息】' + element.msgName).
									replace('#date#', element.msgDate).
									replace('#id#', element.msgId);
						if(element.isRead == '1'){
							newHtml = newHtml.replace('#titleCss#', ' style="font-weight: 900;" ');
						}else{
							newHtml = newHtml.replace('#titleCss#', titleCss);
						}
						$('.list').append(newHtml);
					});
				}else {
					$('.list').empty();
					var contentHtml ='<tr>' +
				  				 	 '<td #titleCss#>#title#</td>' +
								 	 '<td class="font-gray">宜信众筹</td>' +
								 	 '<td class="font-gray">#date#</td>' +
									 '</tr>';
				}
			}else if(result.code=='4000'){
                // location.href = loginUrl;
                handleLoginTimeout();
            }
		},
		error:function(e) {
		}
	});
}

//上一页
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

//下一页
function sufpage(suf){
	var total = $('#totalpage').html();
	if(total == currentpage){
		$(suf).attr('href','#');
		$(suf).css('color','#808080');
	}else{
		pagecontent(Number(currentpage) + 1);
		$(suf).attr('href','#?pageNum=' + currentpage);
		$(suf).css('color','black');
	}
	$('#beforepage').css('color','black');
}

//跳转页
function jumppage(){
	var pages = $('#jumppage').val();
	if(pages == ''){
		var readSmartAlert = new SmartAlert({
    	    title: '报错',
    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请输入跳转页码!</span>',
    	    type: 'confirm',
    	    okText: '我知道了',
    	    maskClosable: false,
    	});
    	readSmartAlert.open();
		return;
	}else if(Number(pages) > Number($('#totalpage').html())){
		var readSmartAlert = new SmartAlert({
    	    title: '报错',
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

//尾页
function lastpages(last){
	window.location.href = window.location.href.substring(0,window.location.href.indexOf('html')+4) + '#?pageNum=' + $('#totalpage').html();
	pagecontent($('#totalpage').html());
}