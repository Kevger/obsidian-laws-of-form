import { Notice, Setting } from 'obsidian';
import type LoFPlugin from 'src/main';

// These separators are not allowed, because they are used by the parser
const FORBIDDEN_SEPARATORS = [
  '((',
  '))',
  '(',
  ')',
  '[',
  ']',
  ' ',
  '$',
  '\t',
  '\n',
  '\0'
];

const description = `Separator to enclose uninterpreted text. A text between the separator "::" e.g. ::((hello) (world)):: will not be transformed to a LoF expression. 
    Thus the raw text \`((hello) (world))\` will be displayed. 
    This is useful if u have separate LoF expressions in the same line e.g. equations \`()()::=::()\``;

/**
 * Creates a setting to change the separator
 *
 * The separator is used to enclose uninterpreted text.
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings
 * @param onFinish Callback to call when the setting is finished -> `focusout` event
 * @returns The created setting
 */
export default function createSeparatorSetting(containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: () => void): Setting {
  const settings = new Setting(containerEl)
    .setName('separator')
    .setDesc(description)
    .addText((text) =>
      text
        .setPlaceholder('::')
        .setValue(plugin.settings.blockSettings.separator)
        .onChange(async (value) => {
          plugin.settings.blockSettings.separator = value;
          if (FORBIDDEN_SEPARATORS.includes(value)) {
            plugin.settings.blockSettings.separator = '::';
            // eslint-disable-next-line no-new
            new Notice(`Invalid separator ${value}. Please choose another one.`);
          }
          await plugin.saveSettings();
        })
    );
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish();
  });

  return settings;
};
