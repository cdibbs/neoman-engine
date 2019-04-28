"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RuleMatchResult = /** @class */ (function () {
    function RuleMatchResult(matches, reason, nestedRuleMatchResult, rules) {
        if (nestedRuleMatchResult === void 0) { nestedRuleMatchResult = null; }
        if (rules === void 0) { rules = []; }
        this.matches = matches;
        this.reason = reason;
        this.nestedRuleMatchResult = nestedRuleMatchResult;
        this.rules = rules;
    }
    return RuleMatchResult;
}());
exports.RuleMatchResult = RuleMatchResult;
//# sourceMappingURL=rule-match-result.js.map