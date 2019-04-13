import { ISettingsProvider } from '../lib/i';

export let mockSettingsProviderFactory = () => {
    return <ISettingsProvider> {
        get: (key: string) => "",
        set: (key: string, value: string) => {}
    };
}