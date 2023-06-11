/**
 * React component for displaying uninterpreted text in a code block.
 *
 * @param text - The raw text to display.
 * @returns - JSX.Element
 */
export function ObsidianLoFUninterpretedText({
  text,
  placeRight,
}: {
  text: string;
  placeRight: boolean;
}): JSX.Element {
  return (
    <span
      style={{ marginLeft: placeRight ? "auto" : undefined, whiteSpace: "pre" }}
    >
      {text}
    </span>
  );
}
