"use strict";

let rule = require('unified-lint-rule');
let generated = require('unist-util-generated');
let visit = require('unist-util-visit');

let urlRegex = /^(https?:\/\/(?:osu|new)\.ppy\.sh)?\/wiki\/.+?\/.+?\.md\/?$/;
let uriWarnings = [
  [/^https?:\/\/(?:osu|new)\.ppy\.sh\/wiki\/.+?\/?$/, 'Wiki links must use /wiki/{article-name}}, not the full URL.'],
  [/^\/wiki\/.+?\/.+?\.md\/?$/, 'Wiki links must not include the file name.'],
  [/^\/wiki\/.+?\/$/, 'Wiki links must not have a trailing slash.']
]

function osuWikiLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        let uriMatch = node.url.match(urlRegex);

        if (uriMatch !== null)
            uriWarnings.forEach(function ([uriRegex, warning]) {
                if (uriRegex.test(uriMatch[1]))
                    file.message(warning, node);
            });
    }
}

module.exports = rule('remark-lint-osu:wiki-links', osuWikiLinks);
