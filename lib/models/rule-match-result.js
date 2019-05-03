export class RuleMatchResult {
    constructor(matches, reason, nestedRuleMatchResult = null, rules = []) {
        this.matches = matches;
        this.reason = reason;
        this.nestedRuleMatchResult = nestedRuleMatchResult;
        this.rules = rules;
    }
}
//# sourceMappingURL=rule-match-result.js.map