/**
 * Component to display error messages which appear in the code block
 *
 * @param msg  The error message to display
 * @returns A JSX element to display the error message
 */
export function ObsidianLoFBlockErrorMessage({
  msg,
}: {
  msg: string;
}): JSX.Element {
  return (
    <div style={{ color: "red", margin: "1em", fontSize: "50%" }}>{msg}</div>
  );
}
