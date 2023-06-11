import { type MarkdownPostProcessorContext } from 'obsidian';
import { type CSSProperties } from 'react';

export interface LoFParameters {
  style: CSSProperties;
  separator: string;
}

export const enum ObsidianLoFLinePartType {
  text = 'text',
  lof = 'lof',
}

// separator to mark uninterpreted text parts
const LOF_DEFAULT_SEPARATOR = '::';

/**
 * Splits a string by a separator into an array of (type, value) objects.
 *
 * The type is either `text` or `lof` depending if the part is enclosed by the separators.
 *
 * @param text String to split, e.g. "(()) :: = :: ."
 * @param separator Separator to split the string, e.g. "::"
 * @returns Array of objects containing the type and the value
 *
 * @example
 * splitExpressionBySeparator("(()) :: = :: .", "::")
 * // returns
 * [{type: "lof", value: "(())"}, {type: "text", value: " = "}, {type: "lof", value: "."}]
 */
export function splitExpressionBySeparator(text: string, separator = '::'): Array<{ type: ObsidianLoFLinePartType, value: string; }> {
  return text
    .split(separator)
    .map((part, i) => ({ type: i % 2 === 1 ? ObsidianLoFLinePartType.text : ObsidianLoFLinePartType.lof, value: part }))
    .filter((part) => part.value.length > 0);
}

/**
 * Convert a css key string to a react key string
 *
 * kebab-case -> camelCase
 *
 * e.g. "font-size" -> "fontSize"
 *
 * @param key css key
 * @returns kebab-cased react key
 */
export function cssToReactKey(key: string): string {
  return key
    .trim()
    .split('-')
    .map((part, i) => {
      if (i === 0) return part;
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
}

/**
 * Init the default parameters for the lof code block
 *
 * @returns an object containing the default parameters
 */
export function initLoFParameters(): LoFParameters {
  return {
    style: {},
    separator: LOF_DEFAULT_SEPARATOR
  };
}

/**
 * This function extract the optional parameters from the lof code block.
 * These parameters are defined after the lof keyword and before the first newline.
 *
 * @param ctx - the context of the code block
 * @param el - the htmlElement of the code block
 * @returns - an object containing the optional parameters
 *
 * @example
 * ````
 * ```lof font-size: 1.5em; color: red;
 * ...
 * ```
 * ````
 * returns ` { "font-size": "1.5em", "color": "red" } `
 */
export function getLoFBlockParameters(
  ctx: MarkdownPostProcessorContext,
  el: HTMLElement,
  defaultValues: LoFParameters
): LoFParameters {
  const sectionInfo = ctx.getSectionInfo(el);
  if (sectionInfo == null) {
    console.error(
      '[LoFPlugin|getLoFBlockParameters]: sectionInfo is undefined',
      sectionInfo
    );
    throw new Error('[LoFPlugin|getLoFBlockParameters]: sectionInfo is undefined');
  }

  let blockHeader = sectionInfo.text.split('\n')[sectionInfo.lineStart];

  // we need to find `lof`since a code block can start with a different number of apostrophes
  const lofKeyWordStart = blockHeader.indexOf('lof');

  if (lofKeyWordStart === -1) {
    console.error(
      '[LoFPlugin|getLoFBlockParameters]: lof keyword not found',
      blockHeader
    );
    throw new Error('[LoFPlugin|getLoFBlockParameters]: lof keyword not found');
  }

  blockHeader = blockHeader.substring(lofKeyWordStart + 3).trim();

  // use the default values first and overwrite them with possible extracted parameters
  const extractedParameters = cssStringToLoFParameters(blockHeader);
  const copyDefaultValues = deepCopy(defaultValues); // deep copy for safety
  return {
    ...copyDefaultValues,
    ...extractedParameters,
    style: {
      ...copyDefaultValues.style,
      ...extractedParameters.style
    }
  };
}

/**
 * Convert a css string e.g. "font-size: 1.5em; color: red;" to an LoFParameters object
 *
 * @param cssString the css string
 * @returns an object containing the parameters
 *
 * @example
 * cssStringToLoFParameters("font-size: 1.5em; color: red; separator: ::")
 * // returns
 * {
 *  separator: "::",
 *  style: { "fontSize": "1.5em", "color": "red" }
 * }
 */
export function cssStringToLoFParameters(cssString: string): LoFParameters {
  const parameters = cssString
    .split(';')
    .filter((parameter) => parameter.trim().length > 0);

  const parametersObject: LoFParameters = { style: {} } as any;
  parameters.forEach((parameter) => {
    const colon = parameter.indexOf(":"); // split(":") doesn't work if "::" is the separator 
    const [key, value] = [parameter.slice(0, colon), parameter.slice(colon + 1)];
    if (key.length > 0 && value.length > 0) {
      if (key.trim() === 'separator') {
        parametersObject.separator = value.trim();
        return;
      }

      (parametersObject.style as any)[cssToReactKey(key)] = value.trim();
    }
  });

  return parametersObject;
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
