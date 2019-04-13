export class RuleMatchResult {
    constructor(
        public matches: boolean,
        public reason: string,
        public nestedRuleMatchResult: RuleMatchResult = null,
        public rules: string[] = []
    ) {
    }
}