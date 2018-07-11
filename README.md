# LifeScope Embed Server

This is a modified version of the self-hosted version of [Iframely's](https://github.com/itteco/iframely) APIs and parsers. It has been changed to only allow authenticated LifeScope users to use its core functionality. 

Iframely gives your fast and simple API for responsive web embeds and semantic meta. The parsers cover well [over 1800 domains](https://iframely.com/domains) through 200+ custom domain plugins and generic support for [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards), that are powered by Iframely's whitelist. 

The whitelist file is pulled from iframely.com database and is updated automatically. The whitelisting is manual process on our end. You can also [have your own whitelist](https://iframely.com/docs/whitelist-format) file. 

HTTP APIs are available in [oEmbed](https://iframely.com/docs/oembed-api) or [Iframely API](https://iframely.com/docs/iframely-api) formats. To make it simple to understand, Iframely format mimics the `<head>` section of the page with its `meta` and `links` elements.

In response to `url` request, APIs returns you the embeds and meta for a requested web page. Below are data samples from [hosted API](https://iframely.com), just to show you the format:

## Running the server

After installing the required node dependencies with npm or yarn, run

```
npm run serve
```