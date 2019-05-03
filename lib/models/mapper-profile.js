export class MapperProfile {
    constructor() {
        /** Destination properties to ignore. Overrides exceptions. */
        this.ignore = null;
        /** Destination mapping exceptions. */
        this.exceptions = null;
        /** Hook to call after mapping is done. */
        this.afterMap = null;
        /** Hook to call before mapping begins. */
        this.beforeMap = null;
        this.destType = null;
    }
}
//# sourceMappingURL=mapper-profile.js.map