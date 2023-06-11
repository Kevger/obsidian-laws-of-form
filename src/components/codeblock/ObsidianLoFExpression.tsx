import LoF, { parser } from "laws-of-form-react";
import { ObsidianLoFBlockErrorMessage } from "./ObsidianLoFBlockErrorMessage";

/**
 * Displays a LoF expression based on the bracket notation e.g. ((a)b).
 *
 * If the expression is invalid, an error message is displayed instead.
 *
 * @param expression the LoF bracket expression to display
 * @returns JSX.Element with the LoF expression
 *
 */
export function ObsidianLoFExpression({
  expression,
}: {
  expression: string;
}): JSX.Element {
  try {
    // first we need to check if the expression is valid before creating the virtual dom
    parser.parse(expression, undefined);
  } catch (e) {
    return <ObsidianLoFBlockErrorMessage msg={e.toString()} />;
  }
  return <LoF>{expression}</LoF>;
}
