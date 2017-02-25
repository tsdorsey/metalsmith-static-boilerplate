'use strict';

const path = require('path');

const autoprefixer = require('metalsmith-autoprefixer');
const babel = require('metalsmith-babel');
const browserifyAlt = require('metalsmith-browserify-alt');
const bourbon = require('bourbon');
const cleanCSS = require('metalsmith-clean-css');
const exec = require('child_process').exec;
const htmlMinifier = require('metalsmith-html-minifier');
const ignore = require('metalsmith-ignore');
const inlineSVG = require('metalsmith-inline-svg');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const metalsmith = require('metalsmith');
const moveUp = require('metalsmith-move-up');
const rewrite = require('metalsmith-rewrite');
const robots = require('metalsmith-robots');
const sass = require('metalsmith-sass');
const sitemap = require('metalsmith-sitemap');
const timer = require('metalsmith-timer');
const uglify = require('metalsmith-uglify');

const devMode = process.env.NODE_ENV === 'development';

let protocol = 'https://';
let subdomain = 'www.';
let domain = '{DOMAIN_NAME}.com';
let port = '';
if (devMode) {
  protocol = 'http://';
  subdomain = '';
  domain = 'localhost';
  port = ':3000';
}
const host = protocol + subdomain + domain + port;

const metadata = {
  devMode,
  protocol,
  subdomain,
  domain,
  port,
  host,
};

const autoprefixerOptions = {
  browsers: ['> 1%', 'last 2 versions', 'IE >= 9'],
};

const babelOptions = {
  presets: ['es2015'],
};

const browserifyOptions = {
  defaults: {
    cache: {},
    packageCache: {},
    transform: [],
    plugin: [],
    debug: devMode,
  },
};

const cleanCSSOptions = {
  cleanCSS: {
    roundingPrecision: 4,
    keepSpecialComments: 0,
  },
};

const folderPerPageOptions = {
  pattern: ['*.html', '!index.html', '!google*.html'],
  filename: '{path.dir}/{path.name}/index.html',
};

const layoutOptions = {
  engine: 'handlebars',
  pattern: '*.html',
  directory: 'src_layouts',
  partials: 'src_partials',
  cache: false,
};

const pagesFolderOptions = {
  pattern: 'pages/**/*.html',
};

const publicFolderOptions = {
  pattern: 'public/**',
};

const robotsOptions = {
  disallow: ['/css', '/fonts', '/js'],
  sitemap: host + '/sitemap.xml',
};

let sassIncludes = [];
sassIncludes = sassIncludes.concat(bourbon.includePaths);
const sassOptions = {
  outputDir: 'css/',
  sourceMap: devMode,
  sourceMapContents: devMode,
  outputStyle: devMode ? 'expanded' : 'compressed',
  includePaths: sassIncludes,
};

const sitemapOptions = {
  hostname: host,
  omitIndex: true,
};

const uglifyOptions = {
  filter: 'js/*.js',
  removeOriginal: !devMode,
  sourceMap: devMode,
};

notification('{SITE_NAME}', 'Build started');

const ms = metalsmith(__dirname);
// Base settings.
ms.use(timer('init'));
ms.metadata(metadata);
ms.source('src/');
ms.destination('build/');
ms.clean(true);

// Ignore system files.
ms.use(ignore(['**/.DS_Store', '**/.keep']));

// Move files up from their organized location.
ms.use(moveUp(pagesFolderOptions));
ms.use(moveUp(publicFolderOptions));

// CSS files.
ms.use(sass(sassOptions));
ms.use(ignore(['css/*', '!css/index.css', '!css/index.css.map']));
ms.use(autoprefixer(autoprefixerOptions));
if (!devMode) {
  ms.use(cleanCSS(cleanCSSOptions));
}

// JS Files.
ms.use(browserifyAlt(browserifyOptions));
ms.use(ignore(['js/**', '!js/*.js', '!js/vendor/**/*.js']));
if (!devMode) {
  ms.use(babel(babelOptions));
  ms.use(uglify(uglifyOptions));
}

// HTML Files.
ms.use(inPlace(layoutOptions));
ms.use(layouts(layoutOptions));
// Inline the svg files and then ignore them.
ms.use(inlineSVG());
ms.use(ignore(['svg/**']));
// Minify html in production.
if (!devMode) {
  ms.use(htmlMinifier());
}
ms.use(rewrite(folderPerPageOptions));

// SEO stuff.
ms.use(robots(robotsOptions));
ms.use(sitemap(sitemapOptions));

// DO THE THING!
ms.use(timer('build complete'));
ms.build(function(err) {
  if (err) {
    notification('{SITE_NAME}', 'Build failed');
    throw err;
  } else {
    notification('{SITE_NAME}', 'Build completed');
  }
});

function notification(title, message) {
  if (process.platform === 'darwin') {
    const cmd = 'osascript -e "display notification \\"' +
      message +
      '\\" with title \\"' +
      title +
      '\\""';
    exec(cmd);
  }
}
