import { Setting } from 'obsidian'
import type LoFPlugin from 'src/main'

/**
 * Creates a color picker setting for the font color
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings to
 * @param onFinish Callback function to call when the user is done with this setting
 * @returns The color picker which is maintained by obsidian
 */
export function createFontColorSetting (containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  return new Setting(containerEl)
    .setName('color')
    .setDesc('Color of the LoF expression')
    .addColorPicker((colorPicker) => {
      colorPicker
        .setValue(colorToHex(plugin.settings.blockSettings.style.color))
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.color = value
          await plugin.saveSettings()
          if (onFinish != null) onFinish()
        })
    })
};

/**
 * Creates a color picker setting for the background color
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings to
 * @param onFinish Callback function to call when the user is done with this setting
 * @returns The color picker which is maintained by obsidian
 */
export function createBackgroundColorSetting (containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  return new Setting(containerEl)
    .setName('background-color')
    .setDesc('Background color of the LoF expression')
    .addColorPicker((colorPicker) => {
      colorPicker
        .setValue(colorToHex(plugin.settings.blockSettings.style.backgroundColor))
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.backgroundColor = value
          await plugin.saveSettings()
          if (onFinish != null) onFinish()
        })
    })
}

/**
 * A helper function to convert a color value like "red" or "rgb(255, 0, 0)" to a hex value like "#ff0000"
 *
 * @param color The color value to convert
 * @returns The hex value of the color
 *
 * @example
 * colorToHex("red"); // returns "#ff0000"
 */
export function colorToHex (color: any): string {
  const ctx = document.createElement('canvas').getContext('2d')
  if (ctx == null) return ''

  ctx.fillStyle = color
  return ctx.fillStyle as string
}
