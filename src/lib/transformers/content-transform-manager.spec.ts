/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import "reflect-metadata";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

import { mockMessagerFactory } from '../../spec-lib'
import { ContentTransformManager } from './index';
import * as i from '../i';

describe('TransformManager', () => {
    var tm: ContentTransformManager;
    var hnd: i.IHandlerService;

    beforeEach(() => {
        hnd = <any>{ resolveAndLoadSync: sinon.stub() };
        let filePatterns: i.IFilePatterns = {
            match(path: string, patterns: string[]): string[] {
                return [];
            }
        };
        tm = new ContentTransformManager(filePatterns, mockMessagerFactory(), hnd);
    })

    describe('#applyTransforms', () => {
        let rifStub: sinon.SinonStub;
        let path: string, content: string;
        beforeEach(() => {
            path = "/tmp/path", content = "something";
            rifStub = sinon.stub();
            tm["replaceInFile"] = rifStub;
        });

        it('should return input as-is when undefined', () => {
            let rdef: any[] = undefined;

            let result = tm["applyTransforms"](path, content, rdef);
            
            expect(result).to.equal(content);
        });

        it('should cast to array when array', () => {
            let rdef: any[] = [];

            tm["applyTransforms"](path, content, rdef);

            sinon.assert.calledWith(rifStub, path, content, rdef);
        });

        it('should convert to regex def when string', () => {
            let rdef: string = "/my/regex/gi";

            tm["applyTransforms"](path, content, rdef);

            sinon.assert.calledWith(rifStub, path, content, [{ subject: "my", with: "regex", regexFlags: "gi" }]);
        });

        it('should wrap in array when object def', () => {
            let rdef: any = { test: "test" };

            tm["applyTransforms"](path, content, <any>rdef);

            sinon.assert.calledWith(rifStub, path, content, [rdef]);
        });

        it('should throw when transform definition type not recognized', () => {
            expect(() => {
                tm["applyTransforms"](path, content, <any>1);
            }).to.throw().with.property("message").contains("definition not understood");
        });
    });

    describe('#replaceInFile', () => {
        let rstub: sinon.SinonStub, repStub: sinon.SinonStub;
        let path: string, content: string;
        beforeEach(() => {
            path = "/tmp/path"; content = "content";
            rstub = sinon.stub(), repStub = sinon.stub();
            rstub.returns({});
            tm["regexToTransform"] = rstub;
            tm["replaceOne"] = repStub;
        });

        it('should convert strings to regexp defs', () => {
            let tdefs = ["/r/e/"];

            tm["replaceInFile"](path, content, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
        });

        it('should throw on bad transform type', () => {
            let tdefs = [123];

            expect(() => {
                tm["replaceInFile"](path, content, <any>tdefs);
            }).to.throw().with.property("message").contains("Unrecognized");
        });

        it('should replace one and return transformed content', () => {
            let tdefs = ["/r/e/"];
            repStub.returns("weird");

            let result = tm["replaceInFile"](path, content, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
            expect(result).to.equal("weird");
        });

        it('should iterate over all', () => {
            let tdefs = ["/r/e/", "/a/b/"];
            repStub.returns("weird");

            let result = tm["replaceInFile"](path, content, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
            sinon.assert.calledWith(rstub, tdefs[1]);
            sinon.assert.calledWith(repStub, path, content, sinon.match.any);
            sinon.assert.calledWith(repStub, path, "weird", sinon.match.any);
            expect(result).to.equal("weird");            
        });
    });

    describe('#replaceOne', () => {
        let rda: sinon.SinonStub, ar: sinon.SinonStub;
        let path: string, content: string;
        let def: any;
        beforeEach(() => {
            def = { files: new Array<string>(), ignore: new Array<string>(), using: "something" };
            rda = sinon.stub(); ar = sinon.stub();
            path = "/tmp/path"; content = "content";
            tm["replaceDoesApply"] = rda;
            tm["applyReplace"] = ar;
        });

        it('should apply replacement if replace applies', () => {
            rda.returns({ matches: true });

            tm["replaceOne"](path, content, def);

            sinon.assert.calledWith(rda, path, sinon.match.same(def.files), sinon.match.same(def.ignore), def.using);
            sinon.assert.calledWith(ar, content, def, path);
        });

        it('should not apply replacement if replace does not apply', () => {
            rda.returns({ matches: false });

            tm["replaceOne"](path, content, def);

            sinon.assert.calledWith(rda, path, sinon.match.same(def.files), sinon.match.same(def.ignore), def.using);
            expect(ar.called).to.be.false;
        });

        it('should return result of replacement', () => {
            rda.returns({matches: true});
            ar.returns("replaced");

            let result = tm["replaceOne"](path, content, def);

            expect(result).to.equal("replaced");
        });
    });

    describe('#formatSource', () => {
        it('should return comma-seperated list of customization sources', () => {
            let result = tm["formatSource"](<any>{ using: "custom", with: { handler: "custom"} });
            expect(result).to.equal(' (using: custom, handler: custom)');
        });

        it('should handle empty customization sources', () => {
            let result = tm["formatSource"](<any>{ with: "nocustom" });
            expect(result).to.equal('');
        });
    });
});