import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { PluginOptions } from './types'
import { transform, shouldTransform } from './core'

export * from './core'
export * from './types'

export default createUnplugin<PluginOptions>((options = {}) => {
  const filter = createFilter(
    options.include || options.refTransform ? [/\.vue$/] : [/\.vue$/, /\.[jt]sx?$/],
    options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
  )

  return {
    name: 'unplugin-vue2-script-setup',
    enforce: 'pre',
    transformInclude(id) {
      return filter(id)
    },
    transform(code, id) {
      try {
        if (shouldTransform(code, id, options))
          return transform(code, id, options)
      }
      catch (e) {
        this.error(e)
      }
    },
  }
})
