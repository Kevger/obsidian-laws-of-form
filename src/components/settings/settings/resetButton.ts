import { Setting } from 'obsidian'
import type LoFPlugin from 'src/main'
import { DEFAULT_LOF_SETTINGS } from '..'

/**
 * Creates a button that resets all settings to the default values
 *
 * @param containerEl Element to append the button to
 * @param plugin Plugin instance to reset the settings of
 * @param onFinish Callback which is called when the button is clicked
 * @returns The created setting
 */
export default function createResetButton (containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  return new Setting(containerEl)
    .setName('Reset to default')
    .setDesc('Reset all LoF settings to the default values')
    .addButton((button) =>
      button
        .setButtonText('Reset')
        .setWarning()
        .setTooltip('You`re about to reset all LoF settings to the default values. This action cannot be undone.')
        .onClick(async () => {
          plugin.settings = Object.assign({}, DEFAULT_LOF_SETTINGS)
          await plugin.saveSettings()
          if (onFinish != null) onFinish()
        }))
};
