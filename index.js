"use strict";

let rule = require('unified-lint-rule');
let generated = require('unist-util-generated');
let visit = require('unist-util-visit');

let fullUrlRegex = /^https?:\/\/(?:osu|new)\.ppy\.sh\/wiki\/(.+?)\/?$/;
let wikiUrlRegex = /^\/wiki\/(.+)\/?$/;
let wikiUriWarnings = [
  [/^.+?\.md$/, 'Wiki links must not include the file name.'],
  [/\/#.*$/, 'Wiki section links must not have a slash before the "#".'],
  [/\/$/, 'Wiki links must not have a trailing slash.']
]

function osuWikiLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        let fullUriMatch = node.url.match(fullUrlRegex);
        if (fullUriMatch !== null) {
          file.message("Wiki links must use /wiki/{article-name}, not the full URL.", node);
        }

        let wikiUriMatch = node.url.match(wikiUrlRegex);
        if (wikiUriMatch !== null)
            wikiUriWarnings.forEach(function ([wikiUrlRegex, warning]) {
                if (wikiUrlRegex.test(wikiUriMatch[1]))
                    file.message(warning, node);
            });
    }
}

module.exports = rule('remark-lint-osu:wiki-links', osuWikiLinks);
