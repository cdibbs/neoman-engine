"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XRegExp = require("xregexp");
var curry_1 = require("./curry");
var Regexer = /** @class */ (function () {
    function Regexer() {
    }
    Regexer.prototype.transform = function (source, pattern, replace, mods) {
        var regexp = XRegExp(pattern);
        var replacer = curry_1.curry.twoOf4(this.replacer, this, replace, mods);
        return source.replace(regexp, replacer);
    };
    Regexer.prototype.replacer = function (replacement, mods, match) {
        var pn = []; /* correspond to $1, $2... */
        for (var _i = 3 /* correspond to $1, $2... */; _i < arguments.length /* correspond to $1, $2... */; _i++ /* correspond to $1, $2... */) {
            pn[_i - 3] = arguments[_i]; /* correspond to $1, $2... */
        }
        var offset = arguments[arguments.length - 2];
        var whole = arguments[arguments.length - 1];
        pn = pn.slice(0, -2);
        var results = this.getModResultsDict(mods, match, pn, offset, whole);
        var pieces = replacement.split(/(\$(?:\d{1,2}|\&|`|'|\$))/);
        if (pieces.length === 1) {
            // then no matches, return as is
            return replacement;
        }
        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].substr(0, 1) === "$") {
                pieces[i] = results[pieces[i]];
            }
        }
        return pieces.join("");
    };
    Regexer.prototype.getModResultsDict = function (mods, match, /* corresponds to "$&" */ pn, /* correspond to $1, $2... */ offset, whole) {
        var results = {};
        for (var i = 0; i < pn.length; i++) {
            var key = "$" + (i + 1);
            var key2 = i < 10 ? "$0" + (i + 1) : key;
            var mod = mods[key] || mods[key2];
            if (mod) {
                results[key2] = results[key] = mod(pn[i], match, pn, offset, whole);
            }
            else {
                results[key2] = results[key] = pn[i];
            }
        }
        var matchedSubstringKey = "$&";
        var preMatchedKey = "$`";
        var postMatchedKey = "$'";
        if (mods[matchedSubstringKey]) {
            results[matchedSubstringKey]
                = mods[matchedSubstringKey](match, match, pn, offset, whole);
        }
        if (mods[preMatchedKey]) {
            var prematch = whole.substr(0, offset);
            results[preMatchedKey]
                = mods[preMatchedKey](prematch, match, pn, offset, whole);
        }
        if (mods[postMatchedKey]) {
            var postmatch = whole.substr(offset + match.length);
            results[postMatchedKey]
                = mods[postMatchedKey](postmatch, match, pn, offset, whole);
        }
        results['$$'] = '$';
        return results;
    };
    return Regexer;
}());
exports.Regexer = Regexer;
//# sourceMappingURL=regexer.js.map