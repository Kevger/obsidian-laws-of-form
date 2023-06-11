import { type ReactTestRenderer, create as render } from "react-test-renderer";
import { ObsidianLoFExpressionLine } from "../ObsidianLoFExpressionLine";
import * as lofUtils from "../../../utils";

describe("ObsidianLoFExpressionLine", () => {
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

  describe("given we have an expression line", () => {
    const expressionLine = "((hello world) (()))()::((abc))::()()";
    let component: ReactTestRenderer;
    beforeEach(() => {
      component = render(
        <ObsidianLoFExpressionLine separator="::">
          {expressionLine}
        </ObsidianLoFExpressionLine>
      );
    });

    it("renders correctly", () => {
      const snapshot = component.toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it("contains the the uninterpreted raw test", () => {
      expect(component.root.findByType("span").children[0]).toBe("((abc))");
    });
  });

  describe("and given we don't give a string as a child", () => {
    it("should throw an error", () => {
      expect(() =>
        render(
          <ObsidianLoFExpressionLine separator="::">
            {2 as any}
          </ObsidianLoFExpressionLine>
        )
      ).toThrow();
    });
  });

  describe("and given we have an empty string", () => {
    it("renders correctly", () => {
      const component = render(
        <ObsidianLoFExpressionLine separator="::">
          {""}
        </ObsidianLoFExpressionLine>
      );
      const snapshot = component.toJSON();
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe("and given splitExpressionBySeparator returns invalid types", () => {
    beforeEach(() => {
      jest
        .spyOn(lofUtils, "splitExpressionBySeparator")
        .mockImplementation(() => {
          return [{ type: "some invalid type" as any, value: "lorem ipsum" }];
        });
    });

    it("should display an error", () => {
      const rendered = render(
        <ObsidianLoFExpressionLine separator="::">
          {"lorem ipsum"}
        </ObsidianLoFExpressionLine>
      );
      expect((rendered.toTree() as any).rendered.rendered[0].type.name).toBe(
        "ObsidianLoFBlockErrorMessage"
      );
    });
  });
});
