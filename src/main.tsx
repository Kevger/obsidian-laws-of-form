import { Plugin } from 'obsidian'
import { createRoot, type Root } from 'react-dom/client'
import { type LoFParameters, getLoFBlockParameters } from './utils'
import { ObsidianLoFBlockErrorMessage } from './components/codeblock/ObsidianLoFBlockErrorMessage'
import { ObsidianLoFExpressionLine } from './components/codeblock/ObsidianLoFExpressionLine'
import LoFSettingsTab, {
  DEFAULT_LOF_SETTINGS,
  type LofPluginSettings
} from './components/settings'
import { getAvailableFontFamilies } from './components/settings/settings/fontFamily'

interface SystemSettings {
  availableFontFamilies: Record<string, string>
}

export default class LoFPlugin extends Plugin {
  root: Root
  settings: LofPluginSettings
  systemSettings: SystemSettings = {} as SystemSettings

  async onload (): Promise<void> {
    await this.loadSettings()
    await this.loadSystemSettings()

    this.addSettingTab(new LoFSettingsTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor('lof', (source, el, ctx) => {
      let parameters: LoFParameters = this.settings.blockSettings
      let headerErrorMessage = ''
      try {
        parameters = getLoFBlockParameters(
          ctx,
          el,
          this.settings.blockSettings
        )
      } catch (e) {
        console.error('[LoFPlugin|onload]: error while parsing parameters', e)
        headerErrorMessage = e.toString()
      }

      const rows = source.split('\n')
      const mainContent = el.createDiv()
      this.root = createRoot(mainContent)
      this.root.render(
        <div style={{ ...parameters.style }}>
          {headerErrorMessage.length !== 0 && (
            <ObsidianLoFBlockErrorMessage
              key="errMsg"
              msg={headerErrorMessage}
            />
          )}

          {rows.map((row, i) => {
            return (
              <div style={{ ...parameters.style }} key={`row${row}${i}`}>
                <ObsidianLoFExpressionLine separator={parameters.separator}>
                  {row}
                </ObsidianLoFExpressionLine>
              </div>
            )
          })}
        </div>
      )
    })
  }

  async onunload (): Promise<void> {
    this.root.unmount()
  }

  async saveSettings (): Promise<void> {
    await this.saveData(this.settings)
  }

  async loadSettings (): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_LOF_SETTINGS,
      await this.loadData()
    )
  }

  async loadSystemSettings (): Promise<void> {
    this.systemSettings.availableFontFamilies =
      await getAvailableFontFamilies()
  }
}
