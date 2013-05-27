var jquery = require('jquery');

module.exports = {

    // TODO: check thumbnail.

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "keywords",
        "geo-url"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div />');
        $container.html(oembed.html);
        var $embed = $container.find('embed');

        return {
            href: $embed.attr('src') + '&' + $embed.attr("FlashVars"),
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": oembed.width / oembed.height
        }
    },

    tests: [{
        page: "http://qik.com/video/search?order=recent&query=music",
        selector: "h6 a"
    },
        "http://qik.com/video/52767028"
    ]
};