import {
  splitExpressionBySeparator,
  ObsidianLoFLinePartType,
} from "../../utils";
import { ObsidianLoFUninterpretedText } from "./ObsidianLoFUninterpretedText";
import { ObsidianLoFBlockErrorMessage } from "./ObsidianLoFBlockErrorMessage";
import { ObsidianLoFExpression } from "./ObsidianLoFExpression";
import "./styles.css";

/**
 * Each line of a LoF block is rendered by this component. The line is split into parts by the separator. Each part is either a text or a LoF expression. The parts are then rendered by the appropriate component.
 *
 * @param children The content of the line e.g. `()() :: = :: ()`
 * @param separator The separator used to split the line into parts e.g. `::`
 * @returns A JSX element representing the line in form of the LoF notation
 */
export function ObsidianLoFExpressionLine({
  children,
  separator,
}: {
  children?: string;
  separator: string;
}): JSX.Element {
  if (typeof children !== "string") {
    throw new Error("[LoFExpressionLine]: children must be a string");
  }

  const parts = splitExpressionBySeparator(children.toString(), separator);

  return (
    <div className="StyleObsidianLoFExpressionLine">
      {parts.length === 0 ? (
        <br key="br" />
      ) : (
        parts.map((part, i) => {
          switch (part.type) {
            case ObsidianLoFLinePartType.text:
              return (
                <ObsidianLoFUninterpretedText
                  key={`text ${part.value}${i}`}
                  text={part.value}
                  placeRight={parts.length - 1 === i}
                />
              );
            case ObsidianLoFLinePartType.lof:
              return (
                <ObsidianLoFExpression
                  key={`expr ${part.value}${i}`}
                  expression={part.value}
                />
              );
            default:
              return (
                <ObsidianLoFBlockErrorMessage
                  key={`err ${part.value}${i}`}
                  msg={"Unknown part type"}
                />
              );
          }
        })
      )}
    </div>
  );
}
