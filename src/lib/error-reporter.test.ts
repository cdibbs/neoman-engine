// 3rd party imports installed via npm install
import { Test, TestFixture, AsyncTest, TestCase, TestCases, AsyncSetup, AsyncTeardown, Teardown, Setup } from 'alsatian';
import { IMock, Mock, It, Times } from 'typemoq';

import { ErrorReporter } from './error-reporter';
import { IUserMessager, IErrorReporter } from './i';
import { CommandValidationResult, CommandErrorType } from "./models";

@TestFixture("Error Reporter tests")
export class ErrorReporterTests {
    reporter: ErrorReporter;
    messagerMock: IMock<IUserMessager>;    

    @Setup
    public beforeEach() {
        this.messagerMock = Mock.ofType<IUserMessager>();
        this.messagerMock.setup(m => m.i18n()).returns(() => this.messagerMock.object);
        this.reporter = new ErrorReporter(this.messagerMock.object);
    }

    @TestCases(userErrorGen())
    @Test("should show stack when appropriate.")
    public reportError_showStackOrNot(err: Error | string, expMsg: string, errorTimes: number, infoTimes: number) {
        this.reporter.reportError(err);

        this.messagerMock.verify(m => m.error(It.isAnyString()), Times.exactly(errorTimes));
        this.messagerMock.verify(m => m.info(It.isAnyString()), Times.exactly(infoTimes));
    }
}

function* userErrorGen(): IterableIterator<[CommandValidationResult | string | Error, string, number, number]> {
    let cv = new CommandValidationResult();
    cv.ErrorType = CommandErrorType.UserError;
    cv.Messages = ["only this"];
    yield [cv, cv.Message, 0, 1];

    yield ["simplemessage", "simplemessage", 2, 0];

    let error = new Error();
    error.stack = "mystacktrace";
    yield [error, error.stack, 3, 0];
}