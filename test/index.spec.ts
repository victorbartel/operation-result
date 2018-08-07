import { expect } from "chai";
import {
    chainOperationsAsync,
    failure,
    getFirstFailureOrDefault,
    isFailure,
    isSuccessful,
    success,
} from "../src/index";
import {random} from "faker";
import sinon = require("sinon");

describe("Operation result module test scenarios", () => {

    it("should chain all operations when no failures", async () => {
        // Arrange
        const median = random.number(1000);
        const expected = random.number(1000);
        const sut = chainOperationsAsync;
        async function do1(x: any) {
            return Promise.resolve(success(median));
        }
        const do2 = sinon.stub()
            .withArgs(median)
            .returns(Promise.resolve(success(expected)));

        // Act
        const actual = await sut(do1, do2)(random.number(100));

        // Assert
        expect(true).to.eql(isSuccessful(actual));
        expect(expected).to.eql(actual.value);
    });

    it("should chain all operations with multiple params when no failures", async () => {
        // Arrange
        const p1 = random.number(50);
        const p2 = random.number(50);
        const p3 = random.number(50);
        const median = random.number(1000);
        const expected = random.number(1000);
        const sut = chainOperationsAsync;
        async function do1(x: number, y: number, z: number) {
            return Promise.resolve(success(x + y + z));
        }
        const do2 = async (x: number) => {
            if (x !== p1 + p2 + p3) {throw new Error("Not supposed to happen"); }
            return Promise.resolve(success(expected));
        };

        // Act
        const actual = await sut(do1, do2)(p1, p2, p3);

        // Assert
        expect(true).to.eql(isSuccessful(actual));
        expect(expected).to.eql(actual.value);
    });

    it("should brake the chain when one of operations fails", async () => {
        // Arrange
        const expected = random.alphaNumeric(1000);
        const sut = chainOperationsAsync;
        async function do1(x: any) {
            return Promise.resolve(failure(expected));
        }
        const do2 = sinon.stub()
            .throws(random.alphaNumeric(1024));

        // Act
        const actual = await sut(do1, do2)(random.number(100));

        // Assert
        expect(true).to.eql(isFailure(actual));
        expect(expected).to.eql(actual.reason);
    });

    it("should brake the chain when one of operations throws an error", async () => {
        // Arrange
        const expected = random.alphaNumeric(1000);
        const sut = chainOperationsAsync;
        async function do1(x: any) {
            return Promise.reject(expected);
        }
        const do2 = sinon.stub()
            .throwsException("Not supposed to happen");

        // Act
        const actual = await sut(do1, do2)(random.number(100));

        // Assert
        expect(true).to.eql(isFailure(actual));
        expect(expected).to.eql(actual.reason);
    });

    it("should return first failed when such one is in values", () => {
        // Arrange
        const successful = success(random.alphaNumeric(1024));
        const failed     = failure(random.alphaNumeric(1024));
        const entry      = {successful, failed};
        const sut        = getFirstFailureOrDefault;

        // Act
        const actual     = sut(entry);

        // Assert
        expect(failed).to.eql(actual);
    });

    it("should return successful values when everything is ok", () => {
        // Arrange
        const successful1 = success(random.alphaNumeric(1024));
        const successful2 = success(random.alphaNumeric(1024));
        const entry       = {successful1, successful2};
        const sut         = getFirstFailureOrDefault;

        // Act
        const actual      = sut(entry);

        // Assert
        expect(true).to.eql(isSuccessful(actual));
        expect({successful1: successful1.value, successful2: successful2.value})
            .to.eql(actual.value);
    });
});
