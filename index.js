"use strict";

const rule = require('unified-lint-rule');
const generated = require('unist-util-generated');
const visit = require('unist-util-visit');

const fullUrlRegex = /^https?:\/\/(?:osu|new)\.ppy\.sh\/wiki\/(.+?)\/?$/;
const wikiUrlRegex = /^\/wiki\/(.+)\/?$/;
const wikiUriWarnings = [
    [/^.+?\.md$/, 'Wiki links must not include the file name.'],
    [/\/#.*$/, 'Wiki section links must not have a slash before the "#".'],
    [/\/$/, 'Wiki links must not have a trailing slash.'],
];

function osuWikiLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        const fullUriMatch = node.url.match(fullUrlRegex);
        if (fullUriMatch !== null) {
            file.message("Wiki links must use /wiki/{article-name}, not the full URL.", node);
        }

        const wikiUriMatch = node.url.match(wikiUrlRegex);
        if (wikiUriMatch !== null)
            wikiUriWarnings.forEach(function ([wikiUrlRegex, warning]) {
                if (wikiUrlRegex.test(wikiUriMatch[1]))
                    file.message(warning, node);
            });
    }
}

module.exports = rule('remark-lint-osu:wiki-links', osuWikiLinks);
