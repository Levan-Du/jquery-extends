(function() {
    var filters = {};
    var maxWidth = 350;
    var $currentTH = null;
    var $options = null;
    var closed = false;
    var preInputTexts = {};

    $.fn.showColumnFilter = function(options) {
        debug(this);
        closed = false;
        $('body > .column-filter').remove();

        var $this = $currentTH = this;

        var opts = $options = $.extend({}, options);

        var arr = opts.data || collectData($this);
        var code = new Date().getTime();
        var liHtml = renderLi(arr, code);
        var panelID = 'column-filter-' + code;
        var html = renderFilterPanel(arr, liHtml, panelID);

        var columnIndex = $this.index();
        var width = $this.outerWidth() + 20;
        var left = $this.offset().left - 20;
        if (width > maxWidth)
            left = left + width - maxWidth;
        else if (columnIndex == 0)
            left = $this.offset().left;
        $('body').append(html);
        $currentFilterPanel = $('#' + panelID);
        $('body > .column-filter').css({
            position: 'absolute',
            width: width,
            top: $this.offset().top + $this.outerHeight(),
            left: left,
            zIndex: 100000001,
            background: '#eee',
            maxWidth: maxWidth
        });

        $('body > .column-filter li input[type="checkbox"]').bind('change', function(e) {
            if ($(e.target).siblings('label:first').text() == 'ALL')
                $('body > .column-filter li input[type="checkbox"]').prop('checked', $(e.target).prop('checked'));
            else {
                var $checkboxs = $('body > .column-filter li input[type="checkbox"]');
                var len = $('body > .column-filter li input[type="checkbox"]:checked').filter(function(i, el) { console.log($(el).siblings('label').text()); return $(el).siblings('label').text() != 'ALL'; }).length;
                console.log(len);
                console.log($checkboxs.length - 1);
                if ($checkboxs.length - 1 == len) {
                    $('body > .column-filter li input[type="checkbox"]:first').prop('checked', true);
                } else {
                    $('body > .column-filter li input[type="checkbox"]:first').prop('checked', false);
                }
            }
        });

        setDefaultFilter(panelID, columnIndex);

        function document_click(e) {
            $('body > .column-filter').remove();
            opts.cancel && opts.cancel();
            closed = true;
        }
        $(document).bind('click', document_click);
        $('body > .column-filter').click(function(e) {
            e.stopPropagation();
        });
        $('body > .column-filter').on('click', 'button', function(e) {
            e.stopPropagation();

            var $lbls = $('body > .column-filter li.visible input[type="checkbox"]:checked').siblings('label');
            var $table = $this.closest('table');
            var arr = $lbls.map(function(i, el) {
                return { value: $(el).attr('value'), text: $(el).text() };
            }).get() || [];
            if (arr.length != 0) {
                filters[columnIndex] = arr;
                $table.find('tbody tr').each(function(rowIndex, row) {
                    filterRow($this, $(row));
                });
            }
            opts.ok && opts.ok($.extend({}, e, { filters: filters }));
            $('body > .column-filter').remove();
            closed = true;
            $(document).unbind('click', document_click);
        });

        $('#column-filter-input').on('input', function(e) {
            $('body > .column-filter li:first input[type="checkbox"]').prop('checked', false);
            $('body > .column-filter li:first input[type="checkbox"]').change();
            var inputText = preInputTexts[$this.index()] = $(this).val();
            if (inputText == '') {
                $('body > .column-filter li').removeClass('hidden');
                return;
            }
            $('body > .column-filter li').each(function(i, li) {
                var labelText = $(li).find('label').text();
                if (labelText == 'ALL') {
                    $(li).addClass('visible');
                    $(li).removeClass('hidden');
                } else if (labelText.indexOf(inputText) != -1) {
                    $(li).addClass('visible');
                    $(li).removeClass('hidden');
                } else {
                    $(li).addClass('hidden');
                    $(li).removeClass('visible');
                }
            });
        });

        $('#column-filter-input').on('focus', function(e) {
            $(this).closest('p').css({ outline: 'solid 1px #8be' });
        });

        $('#column-filter-input').on('blur', function(e) {
            $(this).closest('p').css({ outline: 'none' });
        });
    };

    $(window).resize(function(e) {
        if ($currentTH != null && !closed) {
            $currentTH.showColumnFilter($options);
        }
    });

    function renderLi(arr, code) {
        var liHtml = arr.map(function(el, i) {
            var checkId = 'filter-check-' + i + '-' + code;
            if (typeof(el) == 'object')
                return '<li row="' + i + '" class="visible" style="position:relative;border-bottom:solid 1px #ddd;"><label style="width:100%;" for="' + checkId + '" value="' + el.value + '">' + el.text + '</label><input id="' + checkId + '" type="checkbox" style="position:absolute;right:0;" /></li>';
            else
                return '<li row="' + i + '" class="visible" style="position:relative;border-bottom:solid 1px #ddd;"><label style="width:100%;" for="' + checkId + '">' + el + '</label><input id="' + checkId + '" type="checkbox" style="position:absolute;right:0;" /></li>';
        }).join('');
        return liHtml;
    }

    function renderFilterPanel(arr, liHtml, panelID) {
        return '<div id="' + panelID + '" class="column-filter" style="border:solid 1px #aaa;border-radius:0 0 5px 5px;">' +
            '<div style="padding:5px;margin:5px;border-bottom:solid 1px #ddd;"><p style="border:solid 1px #ccc;background:#fff;border-radius:2px;"><input id="column-filter-input" type="text" style="display:inline-block;width:95%;border:0;outline:none;" /><i class="glyphicon glyphicon-search" style="display:inline-block;width:5%;"></i></p></div>' +
            '<div style="margin:0 10px 0 10px;background:#fff;max-height:400px;border:solid 1px #ccc;overflow-y:auto;"><ul style="list-style:none;padding:5px;">' + liHtml + '</ul></div>' +
            '<div style="text-align:right;background:transparent;"><button style="margin:10px;" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-search"></i><span style="display:inline-block;margin-left:5px;">Filter</span></button></div></div>';
    }

    function filterRow($clickTarget, $row) {
        var isfilter = true;
        Object.keys(filters).forEach(function(key, i) {
            var filterArr = filters[key];
            var columnIndex = parseInt(key);
            var cellText = '';
            if (filterArr[0].value == '')
                cellText = $($row.find('td')[columnIndex]).text();
            else
                cellText = $($row.find('td')[columnIndex]).find('select option:selected').text();
            if (!filterArr.some(function(el, i) {
                    return el.text == cellText;
                })) {
                isfilter = false;
            }
        });
        // console.log(cellText);
        if (isfilter) {
            $row.css('display', 'table-row');
        } else {
            $row.css('display', 'none');
        }
    }

    function collectData($clickTarget) {
        var $table = $clickTarget.closest('table');
        var columnIndex = $clickTarget.index();
        var arr = [];
        var firstRowCell = $($table.find('tbody tr:first td')[columnIndex]);
        if (firstRowCell.find('select').length == 0) {
            $table.find('tbody tr').each(function(i, el) {
                var value = '';
                var text = $($(el).find('td')[columnIndex]).text();
                if (!arr.some(function(el, i) { return el.value + el.text == value + text; }))
                    arr.push({ value: value, text: text });
            }).get();
            arr.unshift({ value: '', text: 'ALL' });
        } else {
            arr = $(firstRowCell).find('select option').map(function(i, el) {
                return { value: $(el).attr('value'), text: $(el).text() };
            }).get();
            arr.unshift({ value: 'ALL', text: 'ALL' });
        }
        return arr;
    }

    function setDefaultFilter(filterPanelID, columnIndex) {
        if (!filters[columnIndex]) return;
        // if (filters[columnIndex].some(function(el, i) { el.text == 'ALL' })) {
        //     var $firstFilterCheckbox = $('#' + filterPanelID + ' li input[type="checkbox"]:first');
        //     // $firstFilterCheckbox.prop('checked', true);
        //     // $firstFilterCheckbox.change();
        //     $('#' + filterPanelID + ' li input[type="checkbox"]').prop('checked', true);
        //     $('#' + filterPanelID + ' li input[type="checkbox"]').change();
        //     return;
        // }
        if (!!preInputTexts && preInputTexts[columnIndex] != '') {
            $('#column-filter-input').val(preInputTexts[columnIndex]);
        }
        $('#' + filterPanelID + ' li input[type="checkbox"]').each(function(i, checkbox) {
            var labelText = $(checkbox).siblings('label').text();
            var $li = $(checkbox).closest('li');
            if (labelText == 'ALL') {
                $(checkbox).prop('checked', true);
                $li.addClass('visible');
                $li.remove('hidden');
            } else if (filters[columnIndex].some(function(el, i) {
                    return labelText == el.text;
                })) {
                $(checkbox).prop('checked', true);
                if (!!preInputTexts && preInputTexts[columnIndex] != '') {
                    $li.addClass('visible');
                    $li.remove('hidden');
                }
            } else {
                if (!!preInputTexts && preInputTexts[columnIndex] != '') {
                    $li.addClass('hidden');
                    $li.remove('visible');
                }
            }
        });
    }

    function debug($obj) {
        // console.log($obj);
    }
})(jQuery);