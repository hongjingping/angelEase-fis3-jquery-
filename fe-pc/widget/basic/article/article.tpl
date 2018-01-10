<div class="basic-main">
    <div class="simple-banner">
        <i class="ae-icon ae-icon-cert-square icon-basic"></i>
        <h1 class="simple-title">基础信息</h1>
    </div>
    <div class="basic-list-wrapper">
        <div class="form-group user-avatar-wrapper cmn-clearfix">
            <div class="label avatar-key">头像</div>
            <div class="pull-left">
                <div class="avatar-wrapper">
                    <img src="../../../static/basic/resource/images/img-avatar.png" alt="" class="user-avatar" id="headphoto">
                    <input type="file" class="upload-file" id="upload-file">
                    <div class="avatar-mask"></div>
                    <img style="display:none" class="upload-file-icon" src="../../../static/basic/resource/images/icon-avatar-upload.png" alt="">
                    <!-- <i class="ae-icon ae-icon-plus upload-file-icon"></i> -->
                </div>
            </div>
        </div>

        <a href="/page/modifypass/stepone.html" class="changePassWord">修改密码</a>

        <div class="error-notice" style="visibility:hidden;">
            <i class="ae-icon ae-icon-attention error-icon"></i><em id="error1"></em>
        </div>
        <div class="form-group cmn-clearfix">
            <div class="info-key label">手机号码</div>
            <div class="info-value value-output">
                <span class="txt-value" id="mobile" ></span>
            </div>
        </div>
        <div class="form-group cmn-clearfix">
            <div class="info-key label">昵称</div>
            <div class="value-output info-value">
                <span class="value" id="nickname"></span>
                <i class="ae-icon ae-icon-edit operate edit"></i>
            </div>
            <div class="pull-left edit-input cmn-clearfix">
                <input class="pull-left form-control" name="nickname" maxlength="25"/>
                <span class="pull-left operate save">保存</span>
                <span class="pull-left operate cancel">取消</span>
            </div>
        </div>
        <div class="cmn-clearfix form-group">
            <div class="info-key label">性别</div>
            <div class="value-output builtin info-value" data-name="性别">
                <span class="value" id="sex"></span>
                <i class="ae-icon ae-icon-edit operate edit"></i>
            </div>
            <div class="pull-left edit-input clearfix">
                <select class="pull-left form-control" name="sex" onchange="updateSex(this.value)">
                    <option value="0">保密</option>
                    <option value="1" selected>男</option>
                    <option value="2">女</option>
                </select>
                <span class="pull-left operate save">保存</span>
                <span class="pull-left operate cancel">取消</span>
            </div>
        </div>
        <div class="form-group cmn-clearfix">
            <div class="info-key label">邮箱</div>
            <div class="info-value value-output">
                <span class="value" id="email" ></span>
                <i class="ae-icon ae-icon-edit operate edit"></i>
            </div>
            <div class="pull-left edit-input cmn-clearfix">
                <input class="pull-left form-control" name="email" maxlength="30" />
                <span class="pull-left operate save">保存</span>
                <span class="pull-left operate cancel">取消</span>
            </div>
        </div>
        <!--<div class="form-group cmn-clearfix">-->
            <!--<div class="info-key label">QQ</div>-->
            <!--<div class="info-value value-output">-->
                <!--<span class="value" id="qq"></span>-->
                <!--<i class="ae-icon ae-icon-edit operate edit"></i>-->
            <!--</div>-->
            <!--<div class="pull-left edit-input cmn-clearfix">-->
                <!--<input class="pull-left form-control" name="qq" maxlength="12" />-->
                <!--<span class="pull-left operate save">保存</span>-->
                <!--<span class="pull-left operate cancel">取消</span>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="form-group cmn-clearfix">-->
            <!--<div class="info-key label">微信</div>-->
            <!--<div class="info-value value-output">-->
                <!--<span class="value" id="weixin"></span>-->
                <!--<i class="ae-icon ae-icon-edit operate edit"></i>-->
            <!--</div>-->
            <!--<div class="pull-left edit-input cmn-clearfix">-->
                <!--<input class="pull-left form-control" name="weixin" maxlength="32" />-->
                <!--<span class="pull-left operate save">保存</span>-->
                <!--<span class="pull-left operate cancel">取消</span>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</div>