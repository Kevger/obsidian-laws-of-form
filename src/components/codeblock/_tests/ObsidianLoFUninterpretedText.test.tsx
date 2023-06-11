// write tests for ObsidianLoFUninterpretedText here
import { type ReactTestRenderer, create as render } from "react-test-renderer";
import { ObsidianLoFUninterpretedText } from "../ObsidianLoFUninterpretedText";

describe("ObsidianLoFUninterpretedText", () => {
  describe("given we have an uninterpreted text", () => {
    const uninterpretedText =
      "(Lorem ipsum dolor () sit amet, consectetur adipiscing elit.)";
    let component: ReactTestRenderer;

    describe("and it's placed left", () => {
      beforeEach(() => {
        component = render(
          <ObsidianLoFUninterpretedText
            text={uninterpretedText}
            placeRight={false}
          />
        );
      });
      it("renders correctly", () => {
        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();
      });

      it("contains the uninterpreted text", () => {
        expect(component.root.findByType("span").children[0]).toBe(
          uninterpretedText
        );
      });
    });

    describe("and it's placed right", () => {
      beforeEach(() => {
        component = render(
          <ObsidianLoFUninterpretedText
            text={uninterpretedText}
            placeRight={true}
          />
        );
      });
      it("renders correctly", () => {
        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();
      });

      it("contains the uninterpreted text", () => {
        expect(component.root.findByType("span").children[0]).toBe(
          uninterpretedText
        );
      });
    });
  });
});
