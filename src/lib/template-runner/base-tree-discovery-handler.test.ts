import { ITemplateFile } from "../i";
import { Verbosity } from '../types/verbosity';
import { BaseTreeDiscoveryHandler } from './base-tree-discovery-handler';
import { IPathTransform, ITransform } from "../user-extensibility/template";

export class BaseTreeDiscoveryHandlerTest {

}

class TestTreeDiscoveryHandler extends BaseTreeDiscoveryHandler {
    protected matchTmplFile(path: string, pathTransforms: string | IPathTransform | (string | IPathTransform)[], transforms: string | ITransform | (string | ITransform)[], verbosity: Verbosity, tmplFile: ITemplateFile): void {
        throw new Error("Test this within concrete implementation class tests, not here.");
    }

}