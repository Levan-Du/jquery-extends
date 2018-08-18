! function($) {
    var t_id = 0;
    var pos = 0;
    var dir = 3;
    var len = 0;
    var dotCount = 0;
    var mm = 0;

    $.loading = function(options) {
        var opts = $options = $.extend({}, options);
        var html = '' +
            '<div id="levan_loading" class="loading-container">' +
            '	<div class="loading">' +
            '		<div class="loading-msg" align="center"><span class="msg">' + opts.message + '</span><span class="dot">...</span></div>' +
            '		<div class="loading-bg">' +
            '			<div class="loading-progress"></div>' +
            '		</div>' +
            '	</div>' +
            '</div>';
        $('body').append(html);
        t_id = setInterval(animate, 20);
        opts.running && opts.running();
    }

    function animate() {
        var $elem = $('.loading-progress');
        if ($elem.length > 0) {
            if (pos == 0) len += dir;
            if (len > 40 || pos > 90) pos += dir;
            if (pos > 90) len -= dir;
            if (pos > 90 && len == 0) pos = 0;
            $elem.css({ left: pos, width: len });
            // console.log($elem.css(), pos, len);
        }

        // mm += 20;
        // if (mm == 600) {
        //     $('.loading-msg .dot').text(dotText(dotCount));
        //     dotCount++;
        //     if (dotCount == 3) {
        //         dotCount = 0;
        //     }
        //     mm = 0;
        // }
    }

    function dotText(count) {
        var text = '';
        for (i = 0; i <= count; i++) {
            text += ".";
        }
        return text;
    }

    $.loading.close = function() {
        clearInterval(t_id);
        $('.loading-container').remove();
    }
}(window.jQuery)
