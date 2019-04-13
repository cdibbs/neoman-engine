
import { FocusTests, Setup, Test, TestFixture } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { IFileSystem, IPath, IUserMessager, IFilePatterns, IHandlerService } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { BaseTransformManager } from './base-transform-manager';
import { IMock, Mock } from 'typemoq';
import { IPluginManager } from '../plugin-manager/i-plugin-manager';

@TestFixture("Test Fixture Name")
export class BaseTransformManagerTest {
    msgr: IUserMessager;
    filePtrnsMock: IMock<IFilePatterns>;
    hndlrSrvMock: IMock<IHandlerService>;
    plugMgrMock: IMock<IPluginManager>;
    inst: BaseTransformManager;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.filePtrnsMock = Mock.ofType<IFilePatterns>();
        this.hndlrSrvMock = Mock.ofType<IHandlerService>();
        this.plugMgrMock = Mock.ofType<IPluginManager>();
        this.msgr = mockMessagerFactory({out: out});
        this.inst = new BaseTransformManager(this.filePtrnsMock.object, this.msgr, this.hndlrSrvMock.object, this.plugMgrMock.object);
    }

    @Test()
    configure_setsUpNeededState() {
        //throw new Error("Unimplemented test.");
    }

    @Test()
    preprocess_() {
        
    }
}