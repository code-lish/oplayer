import { $ } from '@oplayer/core'

import type { Player } from '@oplayer/core'
import type { UiConfig } from '../types'
import { controllerHidden } from '../style'
import { controllerBottom } from './ControllerBottom.style'

export const controlBar = $.css({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  'z-index': 97,
  padding: '1em',
  height: 'auto',
  transition: 'transform 0.3s ease',

  '&::before': {
    position: 'absolute',
    content: "''",
    width: '100%',
    display: 'block',
    top: 0,
    left: 0,
    bottom: '-1em',
    'z-index': -1,
    transition: 'opacity 0.3s ease',
    'pointer-events': 'none',
    'background-image': 'linear-gradient(rgba(0, 0, 0, .3), transparent)'
  },

  [`@global .${controllerHidden} &`]: {
    transform: 'translateY(calc(-100%))',
    '&::before': { opacity: 0 }
  }
})

export const controlBarTitle = $.css(
  'font-size:1.5em;margin: 0 0.25em;user-select: text;cursor: text;'
)

const render = (player: Player, el: HTMLElement, config: UiConfig) => {
  if (!config.controlBar) return {}
  const $dom = $.create(
    'div',
    {
      class: `${controlBar} ${controllerBottom}`
    },
    `
  <div>
    <h2 class='${controlBarTitle}'>${player.options.source.title}</h2>
  </div>

  <div></div>`
  )

  const $controlBarTitle = $dom.querySelector<HTMLElement>(`.${controlBarTitle}`)!

  player.on('videosourcechanged', ({ payload }) => {
    $controlBarTitle.innerText = payload.title || ''
  })

  $.render($dom, el)

  return { cls: { controlBar } }
}

export default render
