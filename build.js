'use strict';

const autoprefixer = require('metalsmith-autoprefixer');
const browserifyAlt = require('metalsmith-browserify-alt');
const bourbon = require('bourbon');
const cleanCSS = require('metalsmith-clean-css');
const htmlMinifier = require('metalsmith-html-minifier');
const ignore = require('metalsmith-ignore');
const inlineSVG = require('metalsmith-inline-svg');
const inPlace = require('metalsmith-in-place')
const layouts = require('metalsmith-layouts');
const metalsmith = require('metalsmith');
const moveUp = require('metalsmith-move-up');
const rewrite = require('metalsmith-rewrite');
const robots = require('metalsmith-robots');
const sass = require('metalsmith-sass');
const sitemap = require('metalsmith-sitemap');
const uglifyjs = require('metalsmith-uglifyjs');

const devMode = process.env.NODE_ENV === 'development';

const autoprefixerOptions = {
  browsers: ['> 1%', 'last 2 versions', 'IE >= 9']
};

const browserifyOptions = {
  defaults: {
    cache: {},
    packageCache: {},
    transform: [],
    plugin: [],
    debug: devMode
  }
};

const cleanCSSOptions = {
  cleanCSS: {
    roundingPrecision: 4,
    keepSpecialComments: 0
  }
};

const folderPerPageOptions = {
  pattern: ['*.html', '!index.html', '!google*.html'],
  filename: '{path.dir}/{path.name}/index.html'
};

const layoutOptions = {
  engine: 'handlebars',
  pattern: '*.html',
  directory: 'src_layouts',
  partials: 'src_partials',
  cache: false
};

const pagesFolderOptions = {
  pattern: 'pages/**'
}

const publicFolderOptions = {
  pattern: 'public/**'
};

const robotsOptions = {
  disallow: ['/css', '/fonts', '/js'],
  sitemap: 'http://HOSTNAME.com/sitemap.xml'
};

let sassIncludes = [];
sassIncludes = sassIncludes.concat(bourbon.includePaths);
const sassOptions = {
  outputDir: 'css/',
  sourceMap: devMode,
  sourceMapContents: devMode,
  outputStyle: devMode ? 'expanded' : 'compressed',
  includePaths: sassIncludes
};

const sitemapOptions = {
  hostname: 'http://HOSTNAME.com',
  omitIndex: true
};

const uglifyjsOptions = {
  src: ['**/*.js', '!**/*.min.js'],
  target: function(inFile) { return inFile + '.js'; },
  deleteSources: true,
  uglifyOptions: {
    mangle: true,
    compress: {
      unused: true,
      warnings: true,
      drop_console: true,
      dead_code: true,
      properties: true
    }
  }
};

const ms = metalsmith(__dirname);
// Base settings.
ms.source('src/');
ms.destination('build/');
ms.clean(true);

// Ignore system files.
ms.use(ignore(['**/.DS_Store', '**/.keep']));

// Move files up from their organized location.
ms.use(moveUp(publicFolderOptions));
ms.use(moveUp(pagesFolderOptions));

// CSS files.
ms.use(sass(sassOptions));
ms.use(ignore(['css/*', '!css/index.css', '!css/index.css.map']));
ms.use(autoprefixer(autoprefixerOptions));
if(!devMode) {
  ms.use(cleanCSS(cleanCSSOptions));
}

// JS Files.
ms.use(browserifyAlt(browserifyOptions));
ms.use(ignore(['js/**', '!js/*.js', '!js/vendor/**']));
if(!devMode && false) {
  ms.use(uglifyjs(uglifyjsOptions));
}

// HTML Files.
ms.use(inPlace(layoutOptions));
ms.use(layouts(layoutOptions));
// Inline the svg files and then ignore them.
ms.use(inlineSVG());
ms.use(ignore(['svg/**']));
// Minify html in production.
if(!devMode) {
  ms.use(htmlMinifier());
}
ms.use(rewrite(folderPerPageOptions));

// SEO stuff.
ms.use(robots(robotsOptions));
ms.use(sitemap(sitemapOptions));

// DO THE THING!
ms.build(function(err){
  if (err) throw err;
});
