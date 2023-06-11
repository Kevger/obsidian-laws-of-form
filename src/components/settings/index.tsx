import type LoFPlugin from '../../main'
import { type App, PluginSettingTab } from 'obsidian'
import { type LoFParameters, initLoFParameters } from 'src/utils'
import createSeparatorSetting from './settings/separator'
import createFontSizeSetting from './settings/fontSize'
import createFontFamilySetting from './settings/fontFamily'
import createFontWeightSetting from './settings/fontWeight'
import createFontStyleSetting from './settings/fontStyle'
import {
  createBackgroundColorSetting,
  createFontColorSetting
} from './settings/color'
import createRawCSSSetting from './settings/rawCss'
import createResetButton from './settings/resetButton'

export interface LofPluginSettings {
  blockSettings: LoFParameters
}
export const DEFAULT_LOF_SETTINGS: LofPluginSettings = {
  blockSettings: initLoFParameters()
}

/**
 * The settings tab of the plugin. It is displayed when the user clicks on the plugin settings button in the plugin menu.
 *
 * @param app the obsidian app
 * @param plugin the plugin parent instance
 * @returns a JSX element representing the settings tab
 */
export default class LoFSettingTab extends PluginSettingTab {
  plugin: LoFPlugin

  constructor (app: App, plugin: LoFPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display (): void {
    const { containerEl } = this
    const plugin = this.plugin
    const onFinish = (): void => {
      this.display()
    }

    containerEl.empty()
    containerEl.createEl('h2', { text: 'Laws of Form plugin settings' })
    createSettingTutorial(containerEl)
    containerEl.createEl('h3', { text: 'Parser settings' })
    createSeparatorSetting(containerEl, plugin, onFinish)
    containerEl.createEl('h3', { text: 'Style settings' })

    createFontSizeSetting(containerEl, plugin, onFinish)
    createFontFamilySetting(containerEl, plugin, onFinish)
    createFontWeightSetting(containerEl, plugin, onFinish)
    createFontStyleSetting(containerEl, plugin, onFinish)
    createFontColorSetting(containerEl, plugin, onFinish)
    createBackgroundColorSetting(containerEl, plugin, onFinish)
    containerEl.createEl('h3', { text: 'Advanced settings' })
    createRawCSSSetting(containerEl, plugin, onFinish)
    createResetButton(containerEl, plugin, onFinish)

    createAbout(containerEl)
  }
}

/**
 * Creates html elements for the about section of the settings tab
 *
 * @param containerEl the container element of the settings tab
 */
function createAbout (containerEl: HTMLElement): void {
  containerEl.createEl('h3', { text: 'About' })
  containerEl.createEl('hr')
  containerEl.createEl('a', {
    text: 'More about the author of this plugin',
    href: 'https://kevingerman.de'
  })
}

/**
 * Creates html elements for the tutorial section of the settings tab
 *
 * @param containerEl the container element of the settings tab
 */
function createSettingTutorial (containerEl: HTMLElement): void {
  containerEl.createEl('h3', {
    text: 'Inline block styling'
  })
  containerEl.createEl('p', {
    text: 'These default settings are persistent and are applied to every LoF block. Each of these settings can be overwritten individually by the block parameters using inline CSS. The block parameters are defined in the header of a LoF block. The parameters are separated by a semicolon `;` '
  })
  containerEl.createEl('p', {
    text: 'The following code gives an example of a LoF block with all the possible block scoped parameters:'
  })
  containerEl.createEl('code', {
    text: '```lof font-size: 20px; color: red; separator: ||;'
  })
  containerEl.createEl('br')
  containerEl.createEl('code', {
    text: '()() || = || ()'
  })
  containerEl.createEl('br')
  containerEl.createEl('code', {
    text: '```'
  })
  containerEl.createEl('br')
  containerEl.createEl('p', {
    text: 'In most cases the block parameters should be used, since they provide more flexibility. However, if you want to apply the same default styling to all your LoF blocks, you can use the settings below.'
  })
  containerEl.createEl('br')
  containerEl.createEl('a', {
    text: 'Learn more about the plugin (also available as a React library)',
    href: 'https://lof-react.web.app/'
  })
}
