/**
 * Created by Lei on 2015/6/9.
 */


yii.actionColumn = (function ($) {
    var actionModal = '<div class="modal fade" id="action-modal" tabindex="-1" role="dialog" aria-labelledby="actionModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="actionModalLabel"></h4></div><div class="modal-body ajax-content-wrap"></div> </div> </div> </div>';
    var bottomView = '<tr id="action-bottom-view"><td style="padding: 10px;" class="ajax-content-wrap"></td></tr>';
    var pub = {
        clickableSelector: 'act, a.action-view',
        isActive: true,
        params: {},
        getCsrfParam: function () {
            return $('meta[name=csrf-param]').prop('content');
        },
        getCsrfToken: function () {
            return $('meta[name=csrf-token]').prop('content');
        },
        setCsrfToken: function (name, value) {
            $('meta[name=csrf-param]').prop('content', name);
            $('meta[name=csrf-token]').prop('content', value)
        },
        refreshCsrfToken: function () {
            var token = pub.getCsrfToken();
            if (token) {
                pub.params[pub.getCsrfParam()] = token;
            }
        },
        handleAction: function ($e) {
            var method = $e.data('method'),
                url = $e.data('href'),
                action = $e.data('action'),
                params = $e.data('params'),
                mode = $e.data('mode'),
                pjax = $e.data('pjax');

            //通过Ajax处理删除和刷新
            if (!url || !url.match(/(^\/|:\/\/)/)) {
                url = window.location.href;
            }
            $.extend(pub.params, params);
            if (mode == 'bottom') {
                pub.handleBottomAction($e);
            } else {
                pub.handleModalAction($e);
            }

        },
        init: function () {
            initDataMethods();
        },
        notify: function (data) {
            if (!data) return;
            if (data.type == undefined || data.title == undefined) return;
            toastr[data.type](data.content == undefined ? null : data.content, data.title);
        },
        handleModalAction: function ($e) {
            var modal = $(document).find('#action-modal'),
                title = $e.data('title')||'',
                url = $e.data('href');
            if (modal.length <= 0) modal = $(actionModal);
            modal.find('#actionModalLabel').text(title);
            modal.find('.ajax-content-wrap').text('loading').load(url,
                function (res,status) {
                    if(status=='error'){
                        return pub.notify({type: 'error', title: res});
                    }else if(status == 'timeout'){
                        return pub.notify({type: 'error', title: '连接超时'});
                    }
                    modal.modal('show');
                    pub.handleUpdateModal($e, modal);
                }
            );
        },
        handleUpdateModal: function ($e, modal) {
            console.log(yii.actionColumn.onLoad);
            if (typeof yii.actionColumn.onLoad == 'function') {
                yii.actionColumn.onLoad($e, modal);
            }
            modal.find('form').submit(function (event) {
                event.preventDefault();
                var $this = $(this);
                $this.ajaxSubmit(function (res) {
                    if (typeof yii.actionColumn.onSuccess == 'function') {
                        yii.actionColumn.onSuccess(res, $e, modal);
                    }
                });
                return false;
            })

        },
        handleBottomAction: function ($e) {
            var view = $(document).find('#action-bottom-view');
            var tr = $e.parents('tr');
            var url = $e.data('href');
            if (view.length <= 0) {
                view = $(bottomView);
                view.find('td').attr('colspan', tr.find('td').length);
            }
            if (view.data('key') == tr.data('key')) {
                return tr.parent().append(view.hide().data('key', 0));
            }
            var content = view.find('.ajax-content-wrap');
            content.load(url,function (res,status) {
                if(status=='error'){
                    //tr.parent().append(view.hide().data('key', 0));
                    return pub.notify({type: 'error', title: res});
                }else if(status == 'timeout'){
                    return pub.notify({type: 'error', title: '连接超时'});
                }
                view.show().data('key', tr.data('key'));
                if (typeof yii.actionColumn.onLoad == 'function') {
                    yii.actionColumn.onLoad($e,view);
                }
                tr.after(view);
                $("html,body").animate({scrollTop: $("#action-bottom-view").prev().offset().top-$('header').height()}, 800);
            });
        },
        onLoad:function ($e,$obj) {
            console.log('do something.');
        },
        onSuccess:function (res,$e,modal) {
            if (typeof (res.data) == 'string') {
                pub.notify({type: res.status == 0 ? 'success' : 'error', title: res.data});
            } else {
                pub.notify(res.data);
            }
            modal.modal('hide');
            $.pjax.reload("#pjax-content");
        },
    };

    function initDataMethods() {
        var handler = function (event) {
            var $this = $(this),
                method = $this.data('method'),
                raw = $this.data('raw');
            if (raw) {
                event.stopImmediatePropagation();
                return true;
            }
            if (method === undefined) {
                return true;
            }
            pub.handleAction($this);
            event.stopImmediatePropagation();
            return false;
        };
        pub.refreshCsrfToken();
        $(document)
            .on('click.yiiAction', pub.clickableSelector, handler);
    }

    return pub;

})(jQuery);