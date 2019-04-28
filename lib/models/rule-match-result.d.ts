export declare class RuleMatchResult {
    matches: boolean;
    reason: string;
    nestedRuleMatchResult: RuleMatchResult;
    rules: string[];
    constructor(matches: boolean, reason: string, nestedRuleMatchResult?: RuleMatchResult, rules?: string[]);
}
