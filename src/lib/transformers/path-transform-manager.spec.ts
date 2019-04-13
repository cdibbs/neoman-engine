/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { mockMessagerFactory } from '../../spec-lib'
import { PathTransformManager } from './path-transform-manager';
import * as i from '../i';

describe('PathTransformManager', () => {
    var tm: PathTransformManager;
    var hnd: i.IHandlerService;

    beforeEach(() => {
        hnd = <any>{ resolveAndLoadSync: sinon.stub() };
        let filePatterns: i.IFilePatterns = {
            match(path: string, patterns: string[]): string[] {
                return [];
            }
        };
        tm = new PathTransformManager(filePatterns, mockMessagerFactory(), hnd);
    })
    describe('#applyTransforms', () => {
        let taStub: sinon.SinonStub;
        let path: string;
        beforeEach(() => {
            path = "/tmp/path";
            taStub = sinon.stub();
            tm["transformAll"] = taStub;
        });

        it('should return the input as is when transform undefined', () => {
            let rdef: any[] = undefined;

            let result = tm["applyTransforms"](path, rdef);

            expect(result).to.equal(path);
        });

        it('should cast to array when array', () => {
            let rdef: any[] = [];

            tm["applyTransforms"](path, rdef);

            sinon.assert.calledWith(taStub, path, rdef);
        });

        it('should convert to regex def when string', () => {
            let rdef: string = "/my/regex/gi";

            tm["applyTransforms"](path, rdef);

            sinon.assert.calledWith(taStub, path, [{ subject: "my", with: "regex", regexFlags: "gi" }]);
        });

        it('should wrap in array when object def', () => {
            let rdef: any = { test: "test" };

            tm["applyTransforms"](path, <any>rdef);

            sinon.assert.calledWith(taStub, path, [rdef]);
        });

        it('should throw when transform definition type not recognized', () => {
            expect(() => {
                tm["applyTransforms"](path, <any>1);
            }).to.throw().with.property("message").contains("definition not understood");
        });
    });

    describe('#regexToTransform', () => {
        it('should throw on invalid regex', () => {
            expect(() => {
                tm["regexToTransform"]("/not/quite-there");
            }).to.throw().with.property("message").contains("valid").contains("regular expression");
        });

        it('should create a valid ITransform from a valid regexp', () => {
            let result = tm["regexToTransform"]("/subject/replacement/gi");
            expect(result.subject).to.equal("subject");
            expect(result.with).to.equal("replacement");
            expect(result.regexFlags).to.equal("gi");
        });
    });

    describe('#transformAll', () => {
        let rstub: sinon.SinonStub, repStub: sinon.SinonStub;

        let path: string;
        beforeEach(() => {
            path = "/tmp/path";
            rstub = sinon.stub(), repStub = sinon.stub();
            rstub.returns({});
            tm["regexToTransform"] = rstub;
            tm["transformOne"] = repStub;
        });

        it('should convert strings to regexp defs', () => {
            let tdefs = ["/r/e/"];

            tm["transformAll"](path, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
        });

        it('should throw on bad transform type', () => {
            let tdefs = [123];

            expect(() => {
                tm["transformAll"](path, <any>tdefs);
            }).to.throw().with.property("message").contains("format").contains("path transform");
        });

        it('should replace one and return transformed content', () => {
            let tdefs = ["/r/e/"];
            repStub.returns("weird");

            let result = tm["transformAll"](path, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
            expect(result).to.equal("weird");
        });

        it('should iterate over all', () => {
            let tdefs = ["/r/e/", "/a/b/"];
            repStub.returns("weird");

            let result = tm["transformAll"](path, tdefs);

            sinon.assert.calledWith(rstub, tdefs[0]);
            sinon.assert.calledWith(rstub, tdefs[1]);
            sinon.assert.calledWith(repStub, path, sinon.match.any);
            sinon.assert.calledWith(repStub, "weird", sinon.match.any);
            expect(result).to.equal("weird");            
        });
    });

    describe('#transformOne', () => {
        let rda: sinon.SinonStub, aim: sinon.SinonStub;
        let path: string;
        let def: any;
        beforeEach(() => {
            def = { files: new Array<string>(), ignore: new Array<string>(), using: "something" };
            rda = sinon.stub(); aim = sinon.stub();
            path = "/tmp/path";
            tm["replaceDoesApply"] = rda;
            tm["applyIfMatch"] = aim;
        });

        it('should apply replacement if replace applies', () => {
            rda.returns({matches: true});

            tm["transformOne"](path, def, 0);

            sinon.assert.calledWith(rda, path, sinon.match.same(def.files), sinon.match.same(def.ignore), def.using);
            sinon.assert.calledWith(aim, def, path);
        });

        it('should not apply replacement if replace does not apply', () => {
            rda.returns({matches: false});

            tm["transformOne"](path, def, 0);

            sinon.assert.calledWith(rda, path, sinon.match.same(def.files), sinon.match.same(def.ignore), def.using);
            expect(aim.called).to.be.false;
        });

        it('should return result of replacement', () => {
            rda.returns({matches: true});
            aim.returns("replaced");

            let result = tm["transformOne"](path, def, 0);

            expect(result).to.equal("replaced");
        });
    });

    describe('#applyIfMatch', () => {
        let ar: sinon.SinonStub;
        beforeEach(() => {
            ar = sinon.stub();
            ar.returns("result!");
            tm["applyReplace"] = ar;
        });

        it('should apply transform if match', () => {
            let t = { subject: "a+" };

            let result = tm["applyIfMatch"](<any>t, "aaaa", 0);

            sinon.assert.calledWith(ar, "aaaa", t, "aaaa");
            expect(result).to.equal("result!");
        });

        it('should not apply transform if not match', () => {
            let t = { subject: "b+" };

            tm["applyIfMatch"](<any>t, "aaaa", 0);

            expect(ar.called).to.be.false;
        });
    });
});