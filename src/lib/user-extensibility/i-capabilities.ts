export interface ICapabilities {
    /** A semver.org semantic version string. When provided by Neoman to a plugin, this
     * represents the running version. When provided by a plugin to Neoman, this
     * represents the plugin's minimum version requirements. */
    version: string;

    /** When sent from Neoman: a list of identifiers for installed plugins.
     *  When sent to Neoman: a list of identifiers for required plugins. */
    plugins: string[];
}