import { IStrictRawTemplate } from "./i-strict-raw-template";

/**
 * The root template.json format which is designed to be as
 * flexible as possible. Technically, it allows arbitrary
 * keys to be thrown into the mix, but we cannot guarantee
 * such templates will be future-proof, if they do.
 * 
 * For future-proof extensibility, see the 'whims' key in
 * i-strict-raw-template.ts.
 */
export interface IRawTemplate extends IStrictRawTemplate {
    [key: string]: any;
}