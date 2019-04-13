/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import "reflect-metadata";
import * as sinon from 'sinon';
import { expect, assert } from 'chai';
import 'mocha';
let NestedError = require('nested-error-stacks');

import { mockMessagerFactory } from '../../spec-lib'
import { BaseTransformManager } from './index';
import * as i from '../i';

describe('BaseTransformManager', () => {
    var tm: BaseTransformManager;
    let hnd: i.IHandlerService;

    beforeEach(() => {
        hnd = <any>{ resolveAndLoadSync: sinon.stub() };
        let filePatterns: i.IFilePatterns = {
            match(path: string, patterns: string[]): string[] {
                return [];
            }
        };
        tm = new BaseTransformManager(filePatterns, mockMessagerFactory(), hnd);
    })

    describe('#configure', () => {
        it('should setup needed state', () => {
            let tp = { configurations: {} };
            let inputs = { "myvar": true };
            let ppStub = sinon.stub();
            tm["preparePlugins"] = ppStub;

            tm["configure"](<any>tp, inputs);

            expect(tm["inputs"]).to.deep.equal(inputs);
            sinon.assert.calledWith(ppStub, sinon.match.same(tp.configurations));
        });
    });

    describe('#preprocess', () => {
        it('should substitute an unescaped variable', () => {
            tm['inputs'] = { "hello": "world" };
            let result = tm.preprocess("I just wanted to say {{hello}}.");
            expect(result).to.equal("I just wanted to say world.");
        });

        it('should substitute many variables', () => {
            tm['inputs'] = { "hello": "world", "another": "also" };
            let result = tm.preprocess("I just wanted to say {{hello}} {{another}}.");
            expect(result).to.equal("I just wanted to say world also.");
        });

        it('should not substitute a variable that does not exist.', () => {
            tm['inputs'] = { "hello": "world", "another": "also" };
            let result = tm.preprocess("I just wanted to say {{missing}}.");
            expect(result).to.equal("I just wanted to say {{missing}}.");
        });

        it('should ignore bracket mismatches.', () => {
            tm['inputs'] = { "hello": "world" };
            let result = tm.preprocess("I just wanted to say {{hello.");
            expect(result).to.equal("I just wanted to say {{hello.");
            result = tm.preprocess("I just wanted to say hello}}.");
            expect(result).to.equal("I just wanted to say hello}}.");
        });

        it('should ignore escaped curly brackets.', () => {
            // Wrapping the starting {{ in "{{" and "}}" is a special case which will result in escaping the input reference.
            // An alternative is to put { "hello" : "{{hello}}" } in your input.baseInputs.
            tm['inputs'] = { "hello": "world", "another": "also" };
            let result = tm.preprocess("I just wanted to say {{{{}}hello}} {{another}}.");
            expect(result).to.equal("I just wanted to say {{hello}} also.");
        });
    });

    describe('#applyReplace', () => {
        let creStub: sinon.SinonStub;
        beforeEach(() => {
            creStub = sinon.stub();
            tm["chooseReplaceEngine"] = creStub;
        });
        it('should throw when engine unrecognized', () => {
            creStub.returns("alienz!");
            expect(() => {
                tm["applyReplace"]("my string", null, "/tmp/mypath");
            }).to.throw().property("message").contains("Unimplemented").contains("alienz!");
        });

        it('should apply regex when regex', () => {
            let arrStub = sinon.stub();
            tm["applyReplaceRegex"] = arrStub;
            creStub.returns("regex");
            let tdef = {};

            tm["applyReplace"]("mycontent", <any>tdef, "mypath");

            sinon.assert.calledWith(creStub, sinon.match.same(tdef));
            sinon.assert.calledWith(arrStub, "mycontent", sinon.match.same(tdef), "mypath");
        });

        it('should apply simple when simple', () => {
            let stub = sinon.stub();
            tm["applyReplaceSimple"] = stub;
            creStub.returns("simple");
            let tdef = {};

            tm["applyReplace"]("mycontent", <any>tdef, "mypath");

            sinon.assert.calledWith(creStub, sinon.match.same(tdef));
            sinon.assert.calledWith(stub, "mycontent", sinon.match.same(tdef), "mypath");
        });
        it('should apply plugin when plugin', () => {
            let stub = sinon.stub();
            tm["applyReplacePlugin"] = stub;
            creStub.returns("plugin");
            let tdef = {};

            tm["applyReplace"]("mycontent", <any>tdef, "mypath");

            sinon.assert.calledWith(creStub, sinon.match.same(tdef));
            sinon.assert.calledWith(stub, "mycontent", sinon.match.same(tdef), "mypath");
        });
    });

    describe('#applyReplaceRegex', () => {
        let prepStub: sinon.SinonStub, brStub: sinon.SinonStub;
        beforeEach(() => {
            prepStub = sinon.stub(), brStub = sinon.stub();
            tm["preprocess"] = prepStub;
            tm["buildReplacer"] = brStub;
        });

        it('should dispatch to preprocess, if replacement is a string', () => {
            let tdef = { subject: "cool", with: "something" };
            prepStub.returns(tdef.with);

            let result = tm["applyReplaceRegex"]("my cool string", tdef, "");

            sinon.assert.calledWith(prepStub, tdef.with);
            expect(result).to.equal("my something string");
        });

        it('should dispatch to buildReplacer, if replacement is not a string', () => {
            let tdef = { subject: "cool", with: { handler: "myhandlerref" } };
            brStub.returns(() => "handlerreturnedthing");

            let result = tm["applyReplaceRegex"]("my cool string", tdef, "");

            sinon.assert.calledWith(brStub, tdef);
            expect(result).to.equal("my handlerreturnedthing string");
        });
    });

    describe('#applyReplaceSimple', () => {
        let prepStub: sinon.SinonStub, brStub: sinon.SinonStub;
        beforeEach(() => {
            prepStub = sinon.stub(), brStub = sinon.stub();
            tm["preprocess"] = prepStub;
            tm["buildReplacer"] = brStub;
        });

        it('should dispatch to preprocess, if replacement is a string', () => {
            let tdef = { subject: "cool", with: "something" };
            prepStub.returns(tdef.with);

            let result = tm["applyReplaceSimple"]("my cool string", tdef, "");

            sinon.assert.calledWith(prepStub, tdef.with);
            expect(result).to.equal("my something string");
        });

        it('should dispatch to buildReplacer, if replacement is not a string', () => {
            let tdef = { subject: "cool", with: { handler: "myhandlerref" } };
            brStub.returns((subj: string) => "my " + subj);

            let result = tm["applyReplaceSimple"]("my cool string", tdef, "");

            sinon.assert.calledWith(brStub, tdef);
            expect(result).to.equal("my my cool string");
        });
    });

    describe('#applyReplacePlugin', () => {
        let prepStub: sinon.SinonStub, brStub: sinon.SinonStub, pluginStub: sinon.SinonStub;
        let errStub: sinon.SinonStub;
        beforeEach(() => {
            prepStub = sinon.stub(), brStub = sinon.stub();
            pluginStub = sinon.stub(), errStub = sinon.stub();
            tm["configs"] = {};
            tm["configs"]["aplugin"] = <any>{ pluginInstance: { transform: pluginStub } };
            tm["preprocess"] = prepStub;
            tm["buildReplacer"] = brStub;
            tm["msg"]["console"] = { error: errStub, log: tm["msg"]["log"], warn: tm["msg"]["warn"] };
        });

        it('should dispatch to preprocess, if replacement is a string', () => {
            let tdef = { subject: "cool", with: "something", using: "aplugin" };
            prepStub.returns(tdef.with);
            pluginStub.returns("happy");

            let result = tm["applyReplacePlugin"]("my cool string", tdef, "");

            expect(errStub.called && errStub.args[0][0] || undefined).to.be.undefined;
            sinon.assert.calledWith(prepStub, tdef.with);
            sinon.assert.calledWith(pluginStub, "", "my cool string", "cool", tdef.with, sinon.match.any);
            expect(result).to.equal("happy");
        });

        it('should dispatch to buildReplacer, if replacement is not a string', () => {
            let tdef = { subject: "cool", with: { handler: "myhandlerref" }, using: "aplugin" };
            brStub.returns((subj: string) => "my " + subj);
            pluginStub.returns("happy");

            let result = tm["applyReplacePlugin"]("my cool string", tdef, "");

            expect(errStub.called && errStub.args[0][0] || undefined).to.be.undefined;
            sinon.assert.calledWith(brStub, tdef);
            sinon.assert.calledWith(pluginStub, "", "my cool string", "cool", sinon.match.func, sinon.match.any);
            expect(result).to.equal("happy");
        });

        it('should report plugin error but recover by returning untransformed content', () => {
            let tdef = { subject: "cool", with: { handler: "myhandlerref" }, using: "aplugin" };
            brStub.returns((subj: string) => "my " + subj);
            pluginStub.throws(new Error("bad bad"));

            let result = tm["applyReplacePlugin"]("my cool string", tdef, "");

            sinon.assert.calledWith(pluginStub, "", "my cool string", "cool", sinon.match.func, sinon.match.any);
            expect(result).to.equal("my cool string");
        });
    });

    describe('#chooseReplaceEngine', () => {
        // Rationale: configuration should be able to override built-ins.
        it('should allow overriding simple replacer', () => {
            tm["configs"] = { "simple": <any>{} };
            let result = tm.chooseReplaceEngine(<any>{ using: "simple" });
            expect(result).to.equal("plugin");
        });
        it('should use default simple replacer when no user-provided plugin', () => {
            tm["configs"] = { };
            let result = tm.chooseReplaceEngine(<any>{ using: "simple" });
            expect(result).to.equal("simple");
        });
        it('should allow overriding regex replacer', () => {
            tm["configs"] = { "regex": <any>{} };
            let result = tm.chooseReplaceEngine(<any>{ using: "regex" });
            expect(result).to.equal("plugin");
        });
        it('should use default regexp replacer when no user-provided plugin', () => {
            tm["configs"] = { };
            let result = tm.chooseReplaceEngine(<any>{ using: "regex" });
            expect(result).to.equal("regex");
        });
        it('should default to plugin when not an internal name', () => {
            let result = tm.chooseReplaceEngine(<any>{ using: "coconuts" });
            expect(result).to.equal("plugin");
        });
        it('should throw a meaningful error on a malformed transform definition', () => {
            assert.throws(() => tm.chooseReplaceEngine(<any>null), "Malformed transform definition.");
        });
    });

    describe('#buildReplacer', () => {
        let resolveStub: sinon.SinonStub, repWrapStub: sinon.SinonStub;
        beforeEach(() => {
            resolveStub = sinon.stub(), repWrapStub = sinon.stub();
            tm['hnd'] = <any>{ resolveAndLoadSync: resolveStub };
            tm['replacerWrapper'] = repWrapStub;
        });

        it('should throw when "with" definition is not an object', () => {
            // Preceding code should ensure string with definitions never make it this far
            expect(() => {
                tm.buildReplacer(<any>{ with: "bogus" });
            }).to.throw().with.property("message").contains("'with' format invalid");
        });

        it('should resolve handler and return curried replacerWrapper', () => {
            let bogusHnd = sinon.stub();
            resolveStub.returns(bogusHnd);
            tm["tconfigBasePath"] = "something";
            let tdef = { with: { handler: 'mine' }};

            let result = tm.buildReplacer(<any>tdef);
            result("thematch");

            sinon.assert.calledWith(resolveStub, "something", tdef.with.handler);
            expect(resolveStub.calledBefore(repWrapStub)).to.be.true;
            sinon.assert.calledWith(repWrapStub, tdef, tdef.with.handler, bogusHnd);
        });
    });

    describe('#replacerWrapper', () => {
        let hndStub: sinon.SinonStub;
        beforeEach(() => {
            hndStub = sinon.stub();
        });

        it('should rethrow wrapped, caught user handler errors', () => {
            hndStub.throws(new Error('oops'));
            expect(() => {
                tm.replacerWrapper(<any>{}, "name", hndStub, "match");
            }).to.throw();
        });

        it('should pass needed params to handler', () => {
            hndStub.returns("rightval");
            let tdef = { with: { value: "user replacement" } }, orig = "something";

            let result = tm.replacerWrapper(<any>tdef, "name", hndStub, orig);

            sinon.assert.calledWith(hndStub, orig, tdef.with.value, tdef);
            expect(result).to.equal("rightval");
        });
    })

    describe('#replaceDoesApply integration', () => {
        let path: string, fileGlobs: string[], ignoreGlobs: string[];
        let fpMatchStub: sinon.SinonStub, cdaStub: sinon.SinonStub;
        beforeEach(() => {
            path = "/tmp/path";
            fileGlobs = ["nonempty"], ignoreGlobs = ["**glob"];
            tm["configs"] = <any>{
                json : {
                    files: ["**/*.json"]
                }
            };
        });

        it('should not match when files do not', () => {
            let result = tm["replaceDoesApply"]("/tmp/path/something.txt", [ "**/*.json" ], undefined, undefined);
            expect(result.matches).to.be.false;
        });

        it('should not match when config files does not', () => {
            let result = tm["replaceDoesApply"]("/tmp/path/something.txt", undefined, undefined, "json");
            expect(result.matches).to.be.false;
        });
    });

    describe('#replaceDoesApply', () => {
        let path: string, fileGlobs: string[], ignoreGlobs: string[];
        let fpMatchStub: sinon.SinonStub, cdaStub: sinon.SinonStub;
        beforeEach(() => {
            path = "/tmp/path";
            fileGlobs = ["nonempty"], ignoreGlobs = ["**glob"];
            fpMatchStub = sinon.stub();
            cdaStub = sinon.stub();
            tm["configDoesApply"] = cdaStub;
            tm["filePatterns"] = { match: fpMatchStub };
        });

        // undefined
        it('should return true when there are no filters', () => {
            let result = tm["replaceDoesApply"]("/tmp/path", undefined, undefined, undefined);

            expect(result.matches).to.be.true;
            expect(cdaStub.called).to.be.false;
        });

        it('should not match when files undefined and config is non-match (files will not override config when undefined)', () => {
            cdaStub.returns({matches: false});

            let result = tm["replaceDoesApply"](path, undefined, undefined, "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.true;
        });

        
        // 000 = 0
        it('should return false when files do not match, ignores do not match, config does not match', () => {
            cdaStub.returns({matches: false});
            fpMatchStub.withArgs(path, fileGlobs).returns([]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns([]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.true;
        });

        // 001 = 1
        it('should return true when files do not match, ignores do not match, config matches', () => {
            cdaStub.returns({matches: true});
            fpMatchStub.withArgs(path, fileGlobs).returns([]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns([]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.true;
            expect(cdaStub.called).to.be.true;
        });

        // 010 = 0
        it('should return false when files do not match, ignore matches, config does not match', () => {
            cdaStub.returns({matches: false});
            fpMatchStub.withArgs(path, fileGlobs).returns([]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns(["somematch"]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.false;
        });
        
        // 011 = 0, ignore overrides config match
        it('should return false when files do not match, ignores match, config matches', () => {
            cdaStub.returns({matches: true});
            fpMatchStub.withArgs(path, fileGlobs).returns([]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns(["somematch"]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.false;
        });

        // 100 = 1, 
        it('should return true when files match, ignores do not match, config does not match', () => {
            cdaStub.returns({matches: false});
            fpMatchStub.withArgs(path, fileGlobs).returns(["somematch"]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns([]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.true;
            expect(cdaStub.called).to.be.true;
        });

        // 101 = 1
        it('should return true when files match, ignores do not match, config matches', () => {
            cdaStub.returns({matches: true});
            fpMatchStub.withArgs(path, fileGlobs).returns(["somematch"]);
            fpMatchStub.withArgs(path, ignoreGlobs).returns([]);

            let result = tm["replaceDoesApply"](path, fileGlobs, ignoreGlobs, "aConfigKey");
            
            expect(result.matches).to.be.true;
            expect(cdaStub.called).to.be.true;
        });

        // 110 = 0, ignore overrides files match
        it('should return false when files match, ignores match, config does not match', () => {
            cdaStub.returns({matches: false});
            fpMatchStub.returns(["somematch"]);

            let result = tm["replaceDoesApply"]("/tmp/path", ["nonempty"], [ "**glob" ], "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.false;
        });

        // 111 = 0, ignore overrides both config and files match
        it('should return false when files match, ignores match, config matches', () => {
            cdaStub.returns({matches: true});
            fpMatchStub.returns(["somematch"]);

            let result = tm["replaceDoesApply"]("/tmp/path", ["nonempty"], [ "**glob" ], "aConfigKey");
            
            expect(result.matches).to.be.false;
            expect(cdaStub.called).to.be.false;
        });    

        it('should not call configDoesApply and instead default to true when config undefined', () => {
            fpMatchStub.returns([]);

            let result = tm["replaceDoesApply"]("/tmp/path", undefined, [ "**glob" ], undefined);
            
            expect(result.matches).to.be.true;
            expect(cdaStub.called).to.be.false;
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

    describe('#configDoesApply', () => {
        let rstub: sinon.SinonStub;
        beforeEach(() => {
            tm["configs"] = <any>{};
            rstub = sinon.stub();
            tm["replaceDoesApply"] = rstub;
        });
        it('should throw error when configuration does not exist', () => {
            expect(() => {
                tm["configDoesApply"]("/tmp/path", "key");
            }).to.throw().property("message").contains("does not exist");
        });

        it('should return result of replaceDoesApply', () => {
            rstub.returns(true);
            let path = "/tmp/path";
            let mockConfig = { files: new Array<string>(), ignore: new Array<string>() };
            tm["configs"].akey = <any>mockConfig;

            let result = tm["configDoesApply"](path, "akey");

            sinon.assert.calledWith(rstub, path, sinon.match.same(mockConfig.files), sinon.match.same(mockConfig.ignore), undefined);
            expect(result).to.be.true;
        });
    });
});