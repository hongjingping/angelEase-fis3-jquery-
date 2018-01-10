function getPath(obj,fileQuery,transImg) {
	var imgSrc = '', imgArr = [], strSrc = '' ;
	if(window.navigator.userAgent.indexOf("MSIE")>=1){ // IE浏览器判断
	     if(obj.select){
		     obj.select();
		     var path=document.selection.createRange().text;
		     obj.removeAttribute("src");
		     imgSrc = fileQuery.value ;
		     imgArr = imgSrc.split('.') ;
		     strSrc = imgArr[imgArr.length - 1].toLowerCase() ;
		     if(strSrc.localeCompare('jpg') === 0 || strSrc.localeCompare('jpeg') === 0 || strSrc.localeCompare('gif') === 0 || strSrc.localeCompare('png') === 0){
				      obj.setAttribute("src",transImg);
				      obj.style.filter=
		       "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+path+"', sizingMethod='scale');"; // IE通过滤镜的方式实现图片显示
		     } else {
				 throw new Error('File type Error! please image file upload..'); 
		     }
	    } else {
		     imgSrc = fileQuery.value ;
		     imgArr = imgSrc.split('.') ;
		     strSrc = imgArr[imgArr.length - 1].toLowerCase() ;
		     if(strSrc.localeCompare('jpg') === 0 || strSrc.localeCompare('jpeg') === 0 || strSrc.localeCompare('gif') === 0 || strSrc.localeCompare('png') === 0){
			      obj.src = fileQuery.value ;
		     } else {
			     throw new Error('File type Error! please image file upload..') ;
	     	 }
	    }
	} else {
		var file =fileQuery.files[0];
	    var reader = new FileReader();
	    reader.onload = function(e){
		     imgSrc = fileQuery.value ;
		     imgArr = imgSrc.split('.') ;
		     strSrc = imgArr[imgArr.length - 1].toLowerCase() ;
		     if(strSrc.localeCompare('jpg') === 0 || strSrc.localeCompare('jpeg') === 0 || strSrc.localeCompare('gif') === 0 || strSrc.localeCompare('png') === 0){
			      obj.setAttribute("src", e.target.result) ;
		     }else{
		      throw new Error('File type Error! please image file upload..') ;
     		}
   		 }
    	reader.readAsDataURL(file);
 	}
}
 
