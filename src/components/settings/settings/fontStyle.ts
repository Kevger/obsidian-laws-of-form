import { Setting } from 'obsidian';
import type LoFPlugin from 'src/main';
const description = 'Possible values: normal, italic, oblique <angle>. Default is normal.';

/**
 * Creates a setting for the font-style
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to get the settings from
 * @param onFinish Callback function to call when the user is done with this setting -> `focusout` event
 * @returns The created setting
 */
export default function createFontStyleSetting(containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  const settings = new Setting(containerEl)
    .setName('font-style')
    .setDesc(description)
    .addText((text) =>
      text
        .setPlaceholder('normal')
        .setValue(plugin.settings.blockSettings.style.fontStyle ?? 'normal')
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.fontStyle = value;
          // if the value is not valid, css will just use the css default
          await plugin.saveSettings();
        })
    );
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish();
  });
  settings.descEl.createEl('br');
  settings.descEl.createEl('a', {
    text: 'More information about the font-style properties',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-style'
  });

  return settings;
};
