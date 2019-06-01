import { Container } from "inversify";
import 'reflect-metadata';
import { IUserMessager } from '../i';
export declare const containerBuilder: (container?: Container, messenger?: IUserMessager, i18nTranslate?: import("i18next").default.TFunction) => Container;
