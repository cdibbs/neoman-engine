export interface IHandlerReference {
    /**
     * A path to a javascript file relative to .neoman.config/handlers.
     */
    handler: string;

    /**
     * Optional and arbitrary parameters to supply to the handler function when calling it.
     */
    params?: any;
}