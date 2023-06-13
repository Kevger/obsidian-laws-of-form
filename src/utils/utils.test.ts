import { MarkdownPostProcessorContext, MarkdownSectionInformation } from "obsidian";
import {
    LoFParameters,
    cssStringToLoFParameters,
    cssToReactKey,
    getLoFBlockParameters,
    initLoFParameters,
    splitExpressionBySeparator,
} from ".";

describe("splitExpressionBySeparator()", () => {
    describe("given we a separator ::", () => {
        describe("and given we have a string separated by it", () => {
            it("should return an array of correct type/value tuples", () => {
                const tuples = splitExpressionBySeparator("(()) :: = :: .", "::");
                expect(tuples).toStrictEqual([{ type: "lof", value: "(()) " }, { type: "text", value: " = " }, { type: "lof", value: " ." }]);
            });
        });

        describe("and given we have a string with multiple separated pieces", () => {
            it("should return an array of correct type/values tuples", () => {
                const tuples = splitExpressionBySeparator("(a)::=::(b)::=::(d)");
                expect(tuples).toStrictEqual([{ type: "lof", value: "(a)" }, { type: "text", value: "=" }, { type: "lof", value: "(b)" }, { type: "text", value: "=" }, { type: "lof", value: "(d)" }]);
            });
        });
        describe("and given we have an empty string", () => {
            it("should return an empty array", () => {
                const tuples = splitExpressionBySeparator("", "::");
                expect(tuples).toStrictEqual([]);
            });
        });
        describe("and given we have just a string with the separator", () => {
            it("should return an empty array", () => {
                const tuples = splitExpressionBySeparator("::", "::");
                expect(tuples).toStrictEqual([]);
            });
        });
    });
});


describe("cssToReactKey()", () => {
    describe("given we have an kebab-case string", () => {
        it("should convert it to camelCase", () => {
            const converted = cssToReactKey("font-size");
            expect(converted).toBe("fontSize");
        });
    });
    describe("given we have a camelCase string", () => {
        it("should stay camelCase", () => {
            const converted = cssToReactKey("camelCase");
            expect(converted).toBe("camelCase");
        });
    });
});



describe("cssStringToLoFParameters()", () => {
    describe("given we have a css string", () => {
        it("should convert it to a lof parameter object", () => {
            const converted = cssStringToLoFParameters("font-size: 1.5em; color: red;");
            expect(converted).toStrictEqual({
                style: { "fontSize": "1.5em", "color": "red" }
            });
        });
    });

    describe("given we have a css string with a custom lof separator k/v pair", () => {
        it("should convert it to a lof parameter object", () => {
            const converted = cssStringToLoFParameters("font-size: 1.5em; color: red; separator: ::");
            expect(converted).toStrictEqual({
                separator: "::",
                style: { "fontSize": "1.5em", "color": "red" }
            });
        });
    });
});



describe("getLoFBlockParameters()", () => {
    describe("given we have a lof code block", () => {
        const elMock = {} as HTMLElement;
        let lofDefaultParameters: LoFParameters;
        let ctxMock: MarkdownPostProcessorContext;
        let lofCodeBlock: string;
        let lineStart: number;

        beforeEach(() => {
            lofDefaultParameters = initLoFParameters();
            ctxMock = {
                getSectionInfo() {
                    return {
                        lineStart,
                        text: lofCodeBlock
                    } as Partial<MarkdownSectionInformation> as MarkdownSectionInformation;
                }
            } as Partial<MarkdownPostProcessorContext> as MarkdownPostProcessorContext;
        });

        describe("given we have block parameters", () => {
            beforeAll(() => {
                lineStart = 0;
                lofCodeBlock = "```lof font-size: 1.5em; color: red;\nSOME_CODE_BLOCK_STUFF\n```";
            });
            it("should return the block parameters", () => {
                const parameters = getLoFBlockParameters(ctxMock, elMock, lofDefaultParameters);
                expect(parameters).toStrictEqual({ style: { fontSize: '1.5em', color: 'red' }, separator: '::' });
            });
        });
        describe("given we have no lof block parameters", () => {
            beforeAll(() => {
                lineStart = 0;
                lofCodeBlock = "```lof\nSOME_CODE_BLOCK_STUFF\n```";
            });
            it("should return the default block parameters", () => {
                const parameters = getLoFBlockParameters(ctxMock, elMock, lofDefaultParameters);
                expect(parameters).toStrictEqual(initLoFParameters());
            });
        });

        describe("given we have a lof block which starts later in the file", () => {
            beforeAll(() => {
                lineStart = 4;
                lofCodeBlock = "```\n\n\n\nlof font-size: 1.5em; color: red;\nSOME_CODE_BLOCK_STUFF\n```";
            });
            it("should return the block parameters", () => {
                const parameters = getLoFBlockParameters(ctxMock, elMock, lofDefaultParameters);
                expect(parameters).toStrictEqual({ style: { fontSize: '1.5em', color: 'red' }, separator: '::' });
            });
        });

        describe("given no lof keyword is given", () => {
            beforeAll(() => {
                lineStart = 0;
                lofCodeBlock = "```font-size: 1.5em; color: red;\nSOME_CODE_BLOCK_STUFF\n```";
            });
            it("should throw an error", () => {
                expect(() => getLoFBlockParameters(ctxMock, elMock, lofDefaultParameters)).toThrow();
            });
        });

        describe("given no sectionInfo is defined", () => {
            beforeEach(() => {
                ctxMock.getSectionInfo = () => null;
            });
            it("should throw an error", () => {
                expect(() => getLoFBlockParameters(ctxMock, elMock, lofDefaultParameters)).toThrow();
            });
        });


    });
});