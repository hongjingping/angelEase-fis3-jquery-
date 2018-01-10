<div class="inmail-main">
    <div class="simple-banner">
        <i class="ae-icon ae-icon ae-icon-message icon-inmail"></i>
        <h1 class="simple-title">站内信</h1>
    </div>
    <div class="content-tab-list" id="nomsg" style="display:none">
        <div class="list-no-data">
            <p class="no-data-icon">
                <i class="ae-icon ae-icon-card"></i>
            </p>
            <p class="no-data-txt">当前没有发送给您的消息</p>
        </div>
    </div>
    <!-- <div align="center" style="display:none" id="nomsg">当前没有发送给您的消息</div> -->
    <div class="inmail-list-wrapper" id="hasmsg" style="display:none">
        <table class="cmn-table cmn-table-striped cmn-table-bordered">
            <colgroup>
                <col></col>
                <col width="145px"></col>
                <col width="150px"></col>
            </colgroup>
            <thead>
                <tr>
                    <th>标题</th>
                    <th>来源</th>
                    <th>时间</th>
                </tr>
            </thead>
            <tbody class="list">

            </tbody>
        </table>
        <div class="pagination-wrapper">
            <ul class="pagination">
                <!--<li class="disabled">
                    <a href="#"><i class="ae-icon ae-icon-pre-arrow"></i></a>
                </li>
                <li class="active"><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">...</a></li>
                <li>
                    <a href="#"><i class="ae-icon ae-icon-next-arrow"></i></a>
                </li>-->
                <li><a href="#?pageNum=1" onclick="pagecontent(1)" style="border:1px solid #ccc;margin:1px"> 首 页 </a></li>
                <li><a href="javascript:void(0);" onclick="prepage(this)" style="border:1px solid #ccc;margin:1px" id="beforepage"> 上一页 </a></li>
                <li class="pagination-txt"><span id="currentPage" style="margin:2px;font-weight: bold;">0</span>/<span id="totalpage">0</span></li>
                <li><a href="javascript:void(0);" onclick="sufpage(this)"  style="border:1px solid #ccc;margin:1px" id="nextpage"> 下一页 </a></li>
                <li><a href="javascript:void(0);" onclick="lastpages()"  style="border:1px solid #ccc;margin:1px"> 尾 页 </a></li>
                <li><span class="pagination-txt">跳转至</span><span class="pagination-txt"></span><input class="pagination-input" type="text" style="width:20px" id="jumppage" onkeyup="this.value=this.value.replace(/[^\d]/g,''); "/><span class="pagination-txt">页</span><input class="btn-jump" type="button" value="确定" onclick="jumppage()"/>
            </ul>
        </div>
    </div>
</div>