import type { PlayerPlugin, Source } from '@oplayer/core'
import type Mpegts from 'mpegts.js'

//@ts-ignore
import qualitySvg from './quality.svg?raw'

const PLUGIN_NAME = 'oplayer-plugin-mpegts'

let importedMpegts: typeof Mpegts

type pluginOptions = {
  mpegtsConfig?: Partial<Mpegts.Config>
  matcher?: (video: HTMLVideoElement, source: Source) => boolean
}

const defaultMatcher: pluginOptions['matcher'] = (_, source) => {
  if (source.format && ['flv', 'm2ts', 'mpegts'].includes(source.format)) {
    return true
  }

  if (source.format === 'auto' || typeof source.format === 'undefined') {
    return /flv|ts(#|\?|$)/i.test(source.src)
  }

  return false
}

const plugin = (options: pluginOptions): PlayerPlugin => {
  const { mpegtsConfig = {}, matcher = defaultMatcher } = options || {}
  let instance: Mpegts.Player | null

  return {
    name: PLUGIN_NAME,
    key: 'mpegts',
    load: async (player, source, options) => {
      const isMatch = matcher(player.$video, source)

      if (options.loader || !isMatch) {
        if (instance) {
          instance.pause()
          instance.unload()
          instance.detachMediaElement()
          instance.destroy()
          instance = null as any
        }
        return false
      }

      //@ts-ignore
      importedMpegts ??= (await import('mpegts.js/dist/mpegts.js')).default

      if (!importedMpegts.isSupported()) return false

      instance = importedMpegts.createPlayer(
        {
          type: /flv|ts(#|\?|$)/i.exec(source.src)?.[0]!, // could also be mpegts, m2ts, flv
          isLive: player.options.isLive,
          url: source.src
        },
        mpegtsConfig
      )

      instance.attachMediaElement(player.$video)
      instance.load()

      return true
    },
    apply: (player) => {
      player.on('destroy', () => {
        instance?.destroy()
        instance = null as any
      })

      return {
        value: () => instance,
        constructor: () => importedMpegts
      }
    }
  }
}

export default plugin
