import { create as render } from "react-test-renderer";
import { ObsidianLoFExpression } from "../ObsidianLoFExpression";

const PRIMITIVE_EXPRESSIONS = ["()", "( )", "", " "];

const NON_PRIMITIVE_EXPRESSIONS = [
  "(())",
  "(()) () ()",
  "(a)",
  "((hello world) ((abc)))",
  "()()()",
  "(((((((())))))))",
];

const REENTRY_EXPRESSIONS = [
  "((a[0])b$0)",
  "((a[0])(b[0])$0c)()",
  "([0]$0Autopoiesis)",
  "(((((((([0]a $1)$6[2])[1]$3)[0]$4)a$5)$2[6])a[5]) [4]$0)",
  "((a ((b [0] )c $1))(((d [2])(e $0))f[1]) g $2)",
];

describe("ObsidianLoFExpression", () => {
  beforeEach(() => {
    let randomMockValue = 0.000001;
    let dateMockValue = 1;
    jest.spyOn(global.Math, "random").mockImplementation(() => {
      randomMockValue = randomMockValue + 0.000001;
      return randomMockValue;
    });

    jest.spyOn(global.Date.prototype, "valueOf").mockImplementation(() => {
      return dateMockValue++;
    });
  });

  describe.each(PRIMITIVE_EXPRESSIONS)(
    "given we have an primitive expression %s",
    (primitiveExpression) => {
      it("renders correctly", () => {
        const component = render(
          <ObsidianLoFExpression expression={primitiveExpression} />
        );
        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();
      });
    }
  );

  describe.each(NON_PRIMITIVE_EXPRESSIONS)(
    "given we have an non-primitive expression %s",
    (nonPrimitiveExpression) => {
      it("renders correctly", () => {
        const component = render(
          <ObsidianLoFExpression expression={nonPrimitiveExpression} />
        );
        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();
      });
    }
  );

  describe.each(REENTRY_EXPRESSIONS)(
    "given we have an reentry expression %s",
    (reentryExpression) => {
      it("renders correctly", () => {
        const component = render(
          <ObsidianLoFExpression expression={reentryExpression} />
        );
        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();
      });
    }
  );

  describe("given we have an invalid expression", () => {
    it("should return an ObsidianLoFBlockErrorMessage in virtual dom", () => {
      const component = render(<ObsidianLoFExpression expression="(()" />);
      expect((component.toTree()!.rendered as any).type.name).toBe(
        "ObsidianLoFBlockErrorMessage"
      );
    });

    it("should contain the error message", () => {
      const component = render(<ObsidianLoFExpression expression="(()" />);
      expect((component.toTree()!.rendered as any).rendered.rendered[0]).toBe(
        'SyntaxError: Expected Expression, end of input, or whitespace but "(" found.'
      );
    });
  });
});
