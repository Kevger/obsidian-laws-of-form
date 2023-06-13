import { Setting } from 'obsidian';
import { type CSSProperties } from 'react';
import type LoFPlugin from 'src/main';
import { cssStringToLoFParameters } from 'src/utils';

/**
 * Creates a setting to set raw css.
 * @param containerEl Element to append the setting to.
 * @param plugin Plugin to get and set the settings.
 * @param onFinish Callback function to call when the user is done with this setting -> `focusout` event.
 * @returns The created setting
 */
export default function createRawCSSSetting(containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  const settings = new Setting(containerEl)
    .setName('raw css')
    .setDesc('Add or modify the raw css of the LoF expressions for full customization. For example, to change the color of the text, use `color: red;`')
    .addTextArea((text) => {
      text
        .setPlaceholder('font-color: red; background-color: blue; ...')
        .setValue(reactCSSToString(plugin.settings.blockSettings.style))
        .onChange(async (value) => {
          const parameters = cssStringToLoFParameters(value);
          plugin.settings.blockSettings = {
            ...parameters
          };
          await plugin.saveSettings();
        });
      text.inputEl.style.width = '100%';
      text.inputEl.style.minHeight = '16vh';
    });
  settings.descEl.createEl('br');
  settings.descEl.createEl('a', {
    text: 'More information about inline css',
    href: 'https://www.w3schools.com/cssref/index.php'
  });
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish();
  });

  return settings;
};

/**
 * Converts a react css object to a css string.
 *
 * This is needed since the user sees inline css and not the react css object.
 *
 * @param css css string in camelCase to convert to kebab-case
 * @returns kebab-case inline css string
 *
 * @example
 * reactCSSToString({fontSize: "16px", color: "blue"}) // returns "font-size:16px\ncolor: blue;"
 */
function reactCSSToString(css: CSSProperties): string {
  let cssString = '';
  for (const [key, value] of Object.entries(css)) {
    const kebabKey = key
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
      .toLowerCase();
    cssString += `${kebabKey}: ${value as string};\n`;
  }
  return cssString;
}
