module.exports = {

    getLink: function(oembed, $empty) {

        var $container = $empty('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed],
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    }
};