module.exports = {

    provides: '__promoUri',

    getData: function(video_src) {

        // Allow YouTube
        var urlMatch = video_src.match(/https?:\/\/(?:www\.)?youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube-nocookie\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtube\.googleapis\.com\/v\/([\-_a-zA-Z0-9]+)/i) //youtube.googleapis.com/v/k3Cd2lvQlN4?rel=0
                    || video_src.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtu\.be\/([\-_a-zA-Z0-9]+)/i);


        if (urlMatch) {
            return {
                __promoUri: "https://www.youtube.com/watch?v=" + urlMatch[1]
            };
        } 

        urlMatch = video_src.match(/^https?:\/\/vimeo\.com\/(\d+)/i)
                || video_src.match(/^https?:\/\/player.vimeo\.com\/video\/(\d+)/i)
                || video_src.match(/^https?:\/\/(?:www\.)?vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i);


        // Or Vimeo
        if (urlMatch) {
            return {
                __promoUri: "https://vimeo.com/" + urlMatch[1]
            };
        } 


        // or DailyMotion, e.g. Liberation, Le Point, L'Express
        urlMatch = video_src.match(/^https?:\/\/(?:www\.)?dailymotion\.com\/(?:swf|embed)?\/?video\/([_a-zA-Z0-9\-]+)/i)
                || video_src.match(/^https?:\/\/dai.ly\/([_a-zA-Z0-9\-]+)/i); // e.g. Libération.fr

        if (urlMatch) {
            return {
                __promoUri: "http://www.dailymotion.com/video/" + urlMatch[1]
            };
        } 


        // or theplatform flash
        urlMatch = video_src.match(/^https?:\/\/player\.theplatform\.com\/p\/([_a-zA-Z0-9\-]+)\/([_a-zA-Z0-9\-]+)\/swf(\/select\/(?:media\/)?[_a-zA-Z0-9\-]+)/i);

        if (urlMatch) {
            return {
                __promoUri: {
                    url: 'https://player.theplatform.com/p/' + urlMatch[1] + '/' + urlMatch[2] + urlMatch[3] + '?for=iframely', // otherwise player=canonical,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }

        // or theplatform
        urlMatch = video_src.match(/^https?:\/\/player\.theplatform\.com\/p\/[_a-zA-Z0-9\-]+(?:\/embed)?\/select\/[_a-zA-Z0-9\-]+/i)
                || video_src.match(/^https?:\/\/player\.theplatform\.com\/p\/[_a-zA-Z0-9\-\/]+(?:\/embed)?\/select\/[_a-zA-Z0-9\-]+/i);
                

        if (urlMatch) {
            return {
                __promoUri: {
                    url: video_src  + '?for=iframely', // otherwise player=canonical,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }


        // or jwplatform
        urlMatch = video_src.match(/^https?:\/\/content\.jwplatform\.com\/players\/([_a-zA-Z0-9\-]+)\.html/i)
                || video_src.match(/^https?:\/\/content\.jwplatform\.com\/videos\/([_a-zA-Z0-9\-]+)\.(?:mp4|m3u8)/i)
                || video_src.match(/^https?:\/\/content\.jwplatform\.com\/previews\/([_a-zA-Z0-9\-]+)/i);                

        if (urlMatch) {
            return {
                __promoUri: {
                    url: 'https://content.jwplatform.com/players/' + urlMatch[1] + '.html?for=iframely', // otherwise player=canonical
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }

        // or wistia
        urlMatch = video_src.match(/^https?:\/\/fast\.wistia\.(?:net|com)\/embed\/iframe\/([_a-zA-Z0-9\-]+)/i);

        if (urlMatch) {
            return {
                __promoUri: {
                    url: 'https://fast.wistia.net/embed/iframe/' + urlMatch[1] + '?for=iframely'                    
                }
            };
        } 


        // or simplecast
        urlMatch = video_src.match(/https?:\/\/simplecast\.com\/card\/[a-zA-Z0-9\-]+/i);

        if (urlMatch) {
            return {
                __promoUri: {
                    url: urlMatch[0],
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }

        // or brightcove
        urlMatch = video_src.match(/^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-_]+|default)_default\/index.html\?videoId=([a-zA-Z0-9\-:]+)/i) ||
                   video_src.match(/^https?:\/\/bcove\.me\/[a-zA-Z0-9]+/i);

        if (urlMatch) {
            return {
                __promoUri: video_src + (!/^https?:\/\/bcove\.me\/[a-zA-Z0-9]+/i.test(video_src) ? '&autoplay=true': '')
            };
        }

        // Or Soundcloud || Giphy
        urlMatch = video_src.match(/^https?:\/\/(?:\w+\.)?soundcloud\.com/i) || video_src.match(/^https?:\/\/giphy\.com\/embed/i);


        if (urlMatch) {
            return {
                __promoUri: video_src
            };
        } 


    }
};