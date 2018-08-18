! function($) {
    $.loading = function(options) {
        var opts = $options = $.extend({}, options);
        var html = '' +
            '<div class="levan levan-loading">' +
            '	<div class="msg">' +
            '		<p>正在加载数据，请稍后...</p>' +
            '	</div>' +
            '	<div class="animation">' +
            '		<div class="circle1">' +
            '			<span class="circle"></span>' +
            '		</div>' +
            '		<div class="circle2">' +
            '			<span class="circle"></span>' +
            '		</div>' +
            '		<div class="circle3">' +
            '			<span class="circle"></span>' +
            '		</div>' +
            '	</div>' +
            '</div>';
        $('body').append(html);
        opts.running && opts.running();
    }

    $.loading.close = function() {
        $('.levan-loading').remove();
    }
}(window.jQuery)