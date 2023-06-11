import { Setting } from 'obsidian'
import type LoFPlugin from 'src/main'
const description = 'The weight specifies the thickness of the font. font weight. Default is 400.'

/**
 * Creates a setting for the font weight
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings to
 * @param onFinish Callback function to call when the user is done with this setting -> `focusout` event
 * @returns The created setting
 */
export default function createFontWeightSetting (containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  const settings = new Setting(containerEl)
    .setName('font-weight')
    .setDesc(description)
    .addText((text) =>
      text
        .setPlaceholder('400')
        .setValue(
          `${plugin.settings.blockSettings.style.fontWeight ?? 400}`
        )
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.fontWeight = value
          // if the value is not valid, css will just use the css default
          await plugin.saveSettings()
        })
    )
  settings.descEl.createEl('br')
  settings.descEl.createEl('a', {
    text: 'More information about the font-weight properties',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight'
  })
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish()
  })

  return settings
};
