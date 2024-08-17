const mix = require('laravel-mix');

mix.options({
    postCss: [
        require('tailwindcss')
    ]
})

/******************************************
 * Build and Copy Background Scripts
 ******************************************/
mix.js("src/background.js", "build/background.js")
    .copy("build/background.js", "dist/chrome/background.js")
    .copy("build/background.js", "dist/firefox/background.js")
    .copy("build/background.js", "dist/safari/background.js")
    .copy("build/background.js", "dist/edge/background.js");

/******************************************
 * Copy image directory for extensions
 ******************************************/
mix.copyDirectory('src/public/images', 'dist/chrome/images');
mix.copyDirectory('src/public/images', 'dist/firefox/images');
mix.copyDirectory('src/public/images', 'dist/safari/images');
mix.copyDirectory('src/public/images', 'dist/edge/images');

/******************************************
 * Copy Manifests
 ******************************************/
mix.copy("src/extensions/chrome/manifest.json", "dist/chrome/manifest.json");
mix.copy("src/extensions/firefox/manifest.json", "dist/firefox/manifest.json");
mix.copy("src/extensions/safari/manifest.json", "dist/safari/manifest.json");
mix.copy("src/extensions/edge/manifest.json", "dist/edge/manifest.json");

/******************************************
 * Build Popup and Copy Code
 ******************************************/
// index.html
mix.copy("src/popup/index.html", "dist/chrome/popup/popup.html");
mix.copy("src/popup/index.html", "dist/firefox/popup/popup.html");
mix.copy("src/popup/index.html", "dist/safari/popup/popup.html");
mix.copy("src/popup/index.html", "dist/edge/popup/popup.html");

// styles.css
mix.postCss("src/popup/resources/css/styles.css", "build/popup/css/styles.css")
    .copy("build/popup/css/styles.css", "dist/chrome/popup/css/styles.css")
    .copy("build/popup/css/styles.css", "dist/firefox/popup/css/styles.css")
    .copy("build/popup/css/styles.css", "dist/safari/popup/css/styles.css")
    .copy("build/popup/css/styles.css", "dist/edge/popup/css/styles.css");

// index.js
mix.js("src/popup/index.js", "build/popup/index.js")
    .copy("build/popup/index.js", "dist/chrome/popup/js/index.js")
    .copy("build/popup/index.js", "dist/firefox/popup/js/index.js")
    .copy("build/popup/index.js", "dist/safari/popup/js/index.js")
    .copy("build/popup/index.js", "dist/edge/popup/js/index.js");

/******************************************
 * Build Extension Page and Copy Code
 ******************************************/
// index.html
mix.copy("src/pages/index.html", "dist/chrome/pages/index.html");
mix.copy("src/pages/index.html", "dist/firefox/pages/index.html");
mix.copy("src/pages/index.html", "dist/safari/pages/index.html");
mix.copy("src/pages/index.html", "dist/edge/pages/index.html");

// styles.css
mix.postCss("src/pages/resources/css/styles.css", "build/pages/css/styles.css")
    .copy("build/pages/css/styles.css", "dist/chrome/pages/css/styles.css")
    .copy("build/pages/css/styles.css", "dist/firefox/pages/css/styles.css")
    .copy("build/pages/css/styles.css", "dist/safari/pages/css/styles.css")
    .copy("build/pages/css/styles.css", "dist/edge/pages/css/styles.css");

// index.js
mix.js("src/pages/index.js", "build/pages/index.js")
    .copy("build/pages/index.js", "dist/chrome/pages/js/index.js")
    .copy("build/pages/index.js", "dist/firefox/pages/js/index.js")
    .copy("build/pages/index.js", "dist/safari/pages/js/index.js")
    .copy("build/pages/index.js", "dist/edge/pages/js/index.js");

/******************************************
 * Build Content Script and Copy Code
 ******************************************/
// index.html
mix.copy("src/content/index.html", "dist/chrome/content/index.html")
    .copy("src/content/index.html", "dist/firefox/content/index.html")
    .copy("src/content/index.html", "dist/safari/content/index.html")
    .copy("src/content/index.html", "dist/edge/content/index.html");

// styles.css
mix.postCss("src/content/resources/css/styles.css", "build/content/css/styles.css")
    .copy("build/content/css/styles.css", "dist/chrome/content/css/styles.css")
    .copy("build/content/css/styles.css", "dist/firefox/content/css/styles.css")
    .copy("build/content/css/styles.css", "dist/safari/content/css/styles.css")
    .copy("build/content/css/styles.css", "dist/edge/content/css/styles.css");

// index.js
mix.js("src/content/index.js", "build/content/index.js")
    .copy("build/content/index.js", "dist/chrome/content/index.js")
    .copy("build/content/index.js", "dist/firefox/content/index.js")
    .copy("build/content/index.js", "dist/safari/content/index.js")
    .copy("build/content/index.js", "dist/edge/content/index.js");

/******************************************
 * Build and Copy Webpage Sync Content Script
 ******************************************/
mix.js("src/webpage-sync.js", "build/webpage-sync.js")
    .copy("build/webpage-sync.js", "dist/chrome/webpage-sync.js")
    .copy("build/webpage-sync.js", "dist/firefox/webpage-sync.js")
    .copy("build/webpage-sync.js", "dist/safari/webpage-sync.js")
    .copy("build/webpage-sync.js", "dist/edge/webpage-sync.js");