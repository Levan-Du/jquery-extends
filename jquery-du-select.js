//create by Levan@20190329
! function ($) {
    var $options = {};
    $.dataSelect = function (options) {
        var opts = $options = $.extend({}, options);
        var height = parseInt(opts.height || "30px");
        var maxHeight = parseInt(opts.maxOptionHeight || '300px');
        var html = '' +
            '<div class="du-select-input-container" style="border: solid 1px #ccc;height:' + height + 'px;background:'+opts.background+'">' +
            '   <input class="du-select-input" type="text" style="display:inline-block;border:0;outline: none;height:' + (height - 2) + 'px;" />' +
            '   <span class="iconfont icon-xiasanjiao du-select-dropdown" style="height:' + (height - 2) + 'px;"></span>' +
            '</div>' +
            '<ul class="du-select-option-container" style="display: none;list-style: none;position: absolute;z-index:1001;background:white;max-height:' + maxHeight + 'px;overflow-y: scroll;margin:0;padding: 0;width: 99%;border:solid 1px #ccc;border-top:0;font-size: .8rem;">' +
            opts.option.map(function (el) {
                return '' +
            	'<li class="du-select-option visible" style="padding:3px 0 3px 10px;">' +
        		'	<span class="value" style="display: none;">' + el.value + '</span>' +
        		'	<span class="label" style="color:#666;">' + el.label + '</span>' +
        		'</li>';
            }).join('') +
            '</ul>';
        var _this = $(opts.el);
        if (_this.length == 0) {
            console.error('不存在' + opts.el);
            return;
        }

        if ((_this.attr('class') || "").indexOf('du-select') == -1) {
            _this.prop('class', 'du-select');
        }

        _this.html(html).css({ display: 'inline-block', position: 'relative', marginLeft: '5px' });

        if (_this.find('.du-select-option').length > 0)
            setOption($(_this.find('.du-select-option')[0]));


        function setOption($this) {
            var selectText = $this.find('.label').text();
            var selectValue = $this.find('.value').text();
            _this.find('.du-select-input').val(selectText);
            _this.prop('value', selectValue);
            _this.prop('text', selectText);
            _this.find('.du-select-option-container').hide();

            var oldIndex = -1, newIndex = -1;
            _this.find('.du-select-option.visible').each(function (i, el) {
                if (el == _this.find('.du-select-option.visible.hover')[0])
                    oldIndex = i;
            });
            _this.find('.du-select-option.visible').each(function (i, el) {
                if (el == $this[0])
                    newIndex = i;
            });
            setOptionHover(oldIndex, newIndex);
        }

        function setOptionHover(oldIndex, newIndex) {
            $(_this.find('.du-select-option.visible')[oldIndex]).removeClass('hover');
            $(_this.find('.du-select-option.visible')[newIndex]).addClass('hover');
        }

        var duselectinputcontainerWidth = _this.find('.du-select-input-container').width();
        _this.find('.du-select-option-container').width(duselectinputcontainerWidth+parseInt(_this.find('.du-select-input-container').css('padding-left')));

        _this.find('.du-select-input').on('click', function (e) {
            e.stopPropagation();
            $(this).focus();
        });
        _this.find('.du-select-input').on('focus', function (e) {
            e.stopPropagation();
            $('.du-select-option-container').hide();
            var duselectinputcontainerWidth = _this.find('.du-select-input-container').width();
        _this.find('.du-select-option-container').width(duselectinputcontainerWidth+parseInt(_this.find('.du-select-input-container').css('padding-left')));
            _this.find('.du-select-input-container').css({ border: 'solid 1px #18f' });
            _this.find('.du-select-option-container').css({ border: 'solid 1px #18f', display: 'block', borderTop: 0 });
        });

        $(_this.find('.du-select-option.visible')[0]).addClass('hover');

        _this.find('.du-select-input').on('input', function (e) {
            e.stopPropagation();
            var $input = $(this);
            _this.find('.du-select-option').each(function (i, el) {
                var text = $(el).find('.label').text().toLowerCase();
                var v = $input.val().toString().toLowerCase();
                if (text.indexOf(v) != -1)
                    $(el).addClass("visible");
                else {
                    $(el).removeClass("visible");
                    $(el).removeClass("hover");
                }
            });
        });

        _this.on('keydown', 'input', function (e) {
            switch (e.keyCode) {
                case 38:
                    var index = -1;
                    _this.find('.du-select-option.visible').each(function (i, el) {
                        if (el == _this.find('.du-select-option.visible.hover')[0])
                            index = i;
                    });
                    if (index > 0) {
                        setOptionHover(index, index - 1);
                    }

                    var hoverTop = _this.find('.du-select-option.visible.hover').position().top;
                    if (hoverTop < 0) {
                        var scrollTop = _this.find('.du-select-option-container')[0].scrollTop;
                        scrollTop -= (maxHeight - 30);
                        if (scrollTop <= 0) {
                            scrollTop = 0;
                        }
                        _this.find('.du-select-option-container').scrollTop(scrollTop);
                    }

                    if (_this.find('.du-select-option-container').css('display') == 'none') {
                        setOption($(_this.find('.du-select-option.visible.hover')));
                    }
                    break;
                case 40:
                    var index = -1;
                    _this.find('.du-select-option.visible').each(function (i, el) {
                        if (el == _this.find('.du-select-option.visible.hover')[0])
                            index = i;
                    });
                    if (index < _this.find('.du-select-option.visible').length - 1) {
                        setOptionHover(index, index + 1);
                    }

                    var hoverTop=_this.find('.du-select-option.visible.hover').position().top;
                    if (hoverTop > parseInt(maxHeight) - 30) {
                        var scrollTop = _this.find('.du-select-option-container')[0].scrollTop;
                        scrollTop += maxHeight - 30;
                        if (scrollTop > _this.find('.du-select-option-container')[0].scrollHeight) {
                            scrollTop = _this.find('.du-select-option-container')[0].scrollHeight;
                        }
                        _this.find('.du-select-option-container').scrollTop(scrollTop);
                    }

                    if (_this.find('.du-select-option-container').css('display') == 'none') {
                        setOption($(_this.find('.du-select-option.visible.hover')));
                    }
                    break;
                case 13:
                    setOption($(_this.find('.du-select-option.visible.hover')));
                    break;
            }
        });
        _this.find('.du-select-dropdown').on('click', function (e) {
            e.stopPropagation();
            _this.find('.du-select-input').focus();
        });
        _this.find('.du-select-option').on('click', function (e) {
            setOption($(this));

            var selectText = $(this).find('.label').text();
            var selectValue = $(this).find('.value').text();
            opts.selectedChange && opts.selectedChange.call(_this, { selectedText: selectText, selectedValue: selectValue });
        });
        $(document).on('click', function () {
            _this.find('.du-select-option-container').hide();
            console.log('document click');
            _this.find('.du-select-input-container').css({ border: 'solid 1px #ccc' });
            _this.find('.du-select-option-container').css({ border: 'solid 1px #ccc', borderTop: 0 });
        });
    }
}(window.jQuery);

function mapOption(arr) {
    return arr.map(function (el) { return { value: el, label: el }; });
}

function ajaxFunc(action, parms, successFunc) {
    $.ajax({
        method: 'POST',
        url: action,
        data: parms,
        success: function (data) {
            successFunc.call(this, data);
        },
        error: function (err) {

        }
    });
}

function loadSelectAjax(el, data, selectedChange) {
    $.dataSelect({
        el: el,
        option: data,
        selectedChange: selectedChange,
        height: 32,
        maxOptionHeight: '180px'
    });
}
