/**
 * Created by Shen.L on 2016/11/10.
 */

var $document,$window,$body;
var login = function ($) {
    var pub = {
        init: function () {
            console.log('login init');
            intForm();
        },

    };
    function intForm() {
        $("#login-form").submit(function (e) {
            var $form = $(this);
            var data = getData($form);
            // 判断数据情况
            if(''==data.username||''==data.password) {showMessage('请填写账户名或者密码');return false;}
            // TODO 对password进行加密
            data.password = security.encrypt(data.password);
            //window.
            // 提交表单
            $.post(
                '/login',
                data,
                function (res) {
                    // TODO 根据返回信息进行处理
                    console.log(res);
                    if(res.status > 0){
                        showMessage(res.msg);
                        return false;
                    }
                    if(res.redirect) window.location.href = res.redirect;
                    window.location.href = '/';
                }
            );
            return false;
        });
    }
    function showMessage(message) {
        // TODO 展示错误信息
        console.log(message);
    }
    function getData(form) {
        var res = {};
        var items = form.serializeArray();
        $.each(items, function (index,item) {
            res[item.name] = item.value || '';
        });
        return res;
    }
    return pub;

}(jQuery);