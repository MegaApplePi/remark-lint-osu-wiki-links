"use strict";

let rule = require('unified-lint-rule');
let generated = require('unist-util-generated');
let visit = require('unist-util-visit');

let urlRegex = /^https?:\/\/(?:osu|new)\.ppy\.sh\/wiki\/(.+?)\/.+?\.md\/?$/;

function osuWikiLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        let uriMatch = node.url.match(urlRegex);

        file.message('Wiki links must not include the file name.', node);
    }
}

module.exports = rule('remark-lint-osu:wiki-links', osuWikiLinks);
