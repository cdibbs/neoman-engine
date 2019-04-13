import { TapBark } from "tap-bark";
import { TestSet, TestRunner } from "alsatian";

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    if (reason) {
        console.log(reason.stack);
    }
});

(async () =>
{
    const testSet = TestSet.create();
    testSet.addTestsFromFiles('./src/lib/**/*.test.ts');

    const testRunner = new TestRunner();

    testRunner.outputStream
        //.pipe(TapBark.create().getPipeable())
        .pipe(process.stdout);

    await testRunner.run(testSet);
})().catch(e =>
{
    console.error(e);
    process.exit(1);
});