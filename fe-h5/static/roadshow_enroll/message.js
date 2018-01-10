(function (){
		$("#toastBox").click(function() {
		    $('#toastBox').hide();
		});
	}
)()
function message(obj){
	$(".modify-suc-text").html(obj);
	$("#toastBox").show();
}