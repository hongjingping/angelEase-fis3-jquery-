(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('重签');
		}
	};a

	UpdatePAssword.init();

})();

var leftInput=false;
var rightInput=false;

function showFront(){
       //以下即为完整客户端路径
       var file_img=document.getElementById("frontImg"),
       iptfileupload = document.getElementById('uploadFrontImg') ;
       getPath(file_img,iptfileupload,file_img) ;
	   leftInput=true;
	    enableNextButtom();
}
function showBack(){
       //以下即为完整客户端路径
       var file_img=document.getElementById("backImg"),
       iptfileupload = document.getElementById('uploadBackImg') ;
       getPath(file_img,iptfileupload,file_img) ;
	   rightInput=true;
	   enableNextButtom();
}

function enableNextButtom(){

	if(leftInput && rightInput )
	{ 
		$("#nextButtom").attr("class","next-btn")
	}
}