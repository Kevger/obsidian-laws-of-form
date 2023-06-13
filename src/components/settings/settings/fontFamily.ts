import { Setting } from 'obsidian';
import type LoFPlugin from 'src/main';

const description = 'Font family for the LoF expressions. You can choose from the installed fonts or type in a custom font-family. Default is the default font-family of the theme.';

/**
 * Creates a setting for the font-family
 *
 * @param containerEl Element to append the setting to
 * @param plugin Plugin to save the settings to
 * @param onFinish Callback function to call when the user is done with this setting (dropdown choice or `focusout`event)
 * @returns A dropdown and text field to set the font-family
 */
export default function createFontFamilySetting(containerEl: HTMLElement, plugin: LoFPlugin, onFinish?: (args?: any) => void): Setting {
  const settings = new Setting(containerEl)
    .setName('font-family')
    .setDesc(description)
    .addDropdown((dropdown) => {
      dropdown
        .addOption('default', 'default')
        .addOptions(plugin.systemSettings.availableFontFamilies)
        .setValue(
          plugin.settings.blockSettings.style.fontFamily ?? 'default'
        )
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.fontFamily = value;
          await plugin.saveSettings();
          if (onFinish != null) onFinish();
        });
    })
    .addText((text) => {
      text
        .setPlaceholder('font-family')
        .setValue(
          plugin.settings.blockSettings.style.fontFamily ?? 'default'
        )
        .onChange(async (value) => {
          plugin.settings.blockSettings.style.fontFamily = value;
          await plugin.saveSettings();
        });
    });
  settings.descEl.createEl('br');
  settings.descEl.createEl('a', {
    text: 'More information about the font-family properties',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-family'
  });
  settings.controlEl.addEventListener('focusout', () => {
    if (onFinish != null) onFinish();
  });

  return settings;
};

/**
 * Extracts the available font-families.
 *
 * This function uses the experimental queryLocalFonts() function if it is available.
 *
 * @returns A Record with the font-families as keys and values
 *
 * @example
 * {
 *  "Arial": "Arial",
 *  "Times New Roman": "Times New Roman",
 * }
 */
export async function getAvailableFontFamilies(): Promise<Record<string, string>> {
  let fonts: any;
  if ('queryLocalFonts' in window) {
    // @ts-expect-error - queryLocalFonts is not defined in the type definition and is not supported by many browsers
    fonts = await window?.queryLocalFonts();
  } else {
    fonts = await document.fonts.ready;
  }
  const fontFamilies: Record<string, string> = {};
  fonts.forEach((font: string) => {
    fontFamilies[(font as any).family] = (font as any).family;
  });
  return fontFamilies;
}
