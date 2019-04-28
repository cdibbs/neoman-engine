
import { Setup, Test, TestFixture } from 'alsatian';
import { IUserMessager, IFilePatterns } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { BaseTransformManager } from './base-transform-manager';
import { IMock, Mock } from 'typemoq';

@TestFixture("Test Fixture Name")
export class BaseTransformManagerTest {
    msgr: IUserMessager;
    filePtrnsMock: IMock<IFilePatterns>;
    inst: BaseTransformManager;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.filePtrnsMock = Mock.ofType<IFilePatterns>();
        this.msgr = mockMessagerFactory({out: out});
        this.inst = new BaseTransformManager(this.filePtrnsMock.object, this.msgr);
    }

    @Test()
    configure_setsUpNeededState() {
        //throw new Error("Unimplemented test.");
    }

    @Test()
    preprocess_() {
        
    }
}