
import { FocusTests, Setup, Test, TestFixture, TestCase, FocusTest } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { IFileSystem, IPath, IUserMessager } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { Regexer } from './regexer';

@TestFixture("Regexer Tests")
export class RegexerTests {
    msgr: IUserMessager;
    inst: Regexer;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.msgr = mockMessagerFactory({out: out});
        this.inst = new Regexer();
    }

    @TestCase("")
    @TestCase("abc")
    @Test()
    transform_handlesRegexesWithoutSlashes(rep: string) {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "a{2,}", rep, {});
        const expected = source.replace(new RegExp("a{2,}"), rep);
        Assert(result).equals(expected);
    }

    @Test()
    transform_handlesReplacementWithoutParts() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "a{2,}", "e", {});
        const expected = source.replace(/a{2,}/, "e");
        Assert(result).equals(expected);
    }

    @Test()
    transform_handlesReplacementsWithPartsWithoutPartMods() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "(a{2,})", "$1$1$1", {});
        const expected = "With whoaaaaaaaaam am I talking?";
        Assert(result).equals(expected);
    }

    @Test()
    transform_handles1digitReplaceMods() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "(a{2,}).*(am).*(alk)", "$1-$2-$3",
            {
                "$1": pi => pi.toLowerCase() + pi.toUpperCase(),
                "$2": pi => pi.toUpperCase(),
                "$3": pi => pi.toLowerCase()
            }
        );
        const expected = "With whoaaaAAA-AM-alking?";
        Assert(result).equals(expected);
    }

    @Test()
    transform_handlesReplaceModsWithPartiallyEmptyDict() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "(a{2,}).*(am).*(alk)", "$1-$2-$3",
            {
                "$1": pi => pi.toLowerCase() + pi.toUpperCase(),
                "$3": pi => pi.toLowerCase()
            }
        );
        const expected = "With whoaaaAAA-am-alking?";
        Assert(result).equals(expected);
    }

    @Test()
    transform_handlesReplaceModsWithEmptyReplaceString() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "(a{2,}).*(am).*(alk)", "",
            {
                "$1": pi => pi.toLowerCase() + pi.toUpperCase(),
                "$3": pi => pi.toLowerCase()
            }
        );
        const expected = "With whoing?";
        Assert(result).equals(expected);
    }

    @TestCase("$01-$02-$03", "$1", "$2", "$3")
    @TestCase("$1-$2-$3", "$01", "$02", "$03")
    @TestCase("$1-$2-$03", "$01", "$2", "$03")
    @Test()
    transform_handlesZeroPadReplaceMods(rep: string, m1Key: string, m2Key: string, m3Key: string) {
        const source = "With whoaaam am I talking?";
        const mods = {};
        mods[m1Key] = (pi: string) => pi.toLowerCase() + pi.toUpperCase();
        mods[m2Key] = (pi: string) => pi.toUpperCase();
        mods[m3Key] = (pi: string) => pi.toLowerCase();
        const result = this.inst.transform(source, "(a{2,}).*(am).*(alk)", rep, mods);
        const expected = "With whoaaaAAA-AM-alking?";
        Assert(result).equals(expected);
    }

    @Test()
    transform_handles2digitReplaceMods() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "([Ww])(i)(t)(h)( )(w)(h)(o)(aaa)(m)( )(am)", "hi $12 there", {
            "$12": pi => pi.toUpperCase()
        });
        const expected = "hi AM there I talking?";
        Assert(result).equals(expected);
    }


    @Test()
    replacer_handlesSpecialReplaceMods() {
        const source = "With whoaaam am I talking?";
        const result = this.inst.transform(source, "(am I)", "$'-$`-$$-$$$$-$&", {
            "$'": pi => pi.toUpperCase(),
            "$`": pi => "123",
            "$&": pi => "matched substring"
        });
        const expected = "With whoaaam  TALKING?-123-$-$$-matched substring talking?";
        Assert(result).equals(expected);
    }
}