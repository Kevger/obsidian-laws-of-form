import { Setting } from 'obsidian';
import type LoFPlugin from 'src/main';

const description = 'Size of the LoF expression is based on the css font-size. Default is 1em/100% of the parent element. Possible units: px(pixel), em, %(size relative to parent), rem(size relative to document)...';

/**
 *  Creates a setting for choosing the font-size
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings to
 * @param onChange Callback function to call when the user is done with this setting -> `focusout` event
 * @returns The created setting
 */
export default function createFontSizeSetting(containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  const settings = new Setting(containerEl)
    .setName('font-size')
    .setDesc(description)
    .addText((text) =>
      text
        .setPlaceholder('1em')
        .setValue(`${plugin.settings.blockSettings.style.fontSize ?? '1em'}`)
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.fontSize = value;
          // if the value is not valid, css will just use the css default
          await plugin.saveSettings();
        })
    );

  settings.descEl.createEl('br');
  settings.descEl.createEl('a', {
    text: 'More information about the font-size properties',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-size'
  });
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish();
  });

  return settings;
}
