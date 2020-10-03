'use strict';

const rule = require('unified-lint-rule');
const generated = require('unist-util-generated');
const visit = require('unist-util-visit');

const wikiUrlRegex = /^(https?:\/\/(?:osu|new)\.ppy\.sh(?:\/help)?)?\/wiki\/(.+)/;
const wikiUriWarnings = [
    [/\.md$/, 'Wiki links must not include the file name'],
    [/\/#.*/, 'Wiki section links must not have a slash before the "#"'],
    [/\/$/, 'Wiki links must not have a trailing slash'],
];

function osuWikiLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        const wikiUriMatch = node.url.match(wikiUrlRegex);

        if (wikiUriMatch === null)
            return;

        if (wikiUriMatch[1] !== undefined)
            file.message('Wiki links must use /wiki/{article-name}, not the full URL', node);

        wikiUriWarnings.forEach(function ([wikiUriRegex, warning]) {
            if (wikiUriRegex.test(wikiUriMatch[2]))
                file.message(warning, node);
        });
    }
}

module.exports = rule('remark-lint-osu:wiki-links', osuWikiLinks);
