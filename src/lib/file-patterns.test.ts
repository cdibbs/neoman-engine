// 3rd party imports installed via npm install
import { Setup, Test, TestFixture } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { FilePatterns } from './file-patterns';


@TestFixture("File Patterns tests")
export class FilePatternsTests {
    fp: FilePatterns;

    @Setup
    public beforeEach() {
        this.fp = new FilePatterns();
    }

    @Test("match - should return empty list on empty")
    public match_emptyGlobList_returnsEmpty() {
        const results = this.fp.match("/my/path", []);
        Assert(results).deeplyEquals([]);
    }

    @Test("match - should return match when matched")
    public match_matches_returnsMatch() {
        const results = this.fp.match("/my/path", [ "**/path" ]);
        Assert(results).deeplyEquals(["**/path"]);
    }

    @Test("match - should return a filtered list of matching globs")
    public match_matchesMany_returnsMatches() {
        const results = this.fp.match("/my/path", [ "**/path", "**/my/*", "nope", "**/*" ]);
        Assert(results).deeplyEquals(["**/path", "**/my/*", "**/*"]);
    }
}