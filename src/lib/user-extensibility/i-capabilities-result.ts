export interface ICapabilitiesResult {
    /**
     * A tuple representing semantic versioning (semver.org) components.
     * t[0-2] = major, minor, and patch deltas, respectively;
     * t[3] = pre-release tag delta, if any (using alpha = 1, beta = 2,
     * rc = 3, [null/missing] = 4);
     * t[4] = nested array of pre-release deltas (if any).
     * Example: Neoman version 1.0.0-alpha.123 is running. Compared with version
     * 2.0.3-rc.246, this is an offset tuple of [-1, 0, 3, -2, [123]].
     */
    versionOffsets: [number, number, number, number, number];

    /**
     * An array of plugin identifiers that could not be matched, and
     * probably aren't installed.
     */
    missingPluginIds: string[];
}