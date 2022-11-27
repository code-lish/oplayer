//@ts-nocheck
import Player, { PlayerEvent, isMobile, isIOS, isiPad, isiPhone } from '@oplayer/core'
import danmaku, { DanmakuItem } from '@oplayer/danmaku'
import ui from '@oplayer/ui'
import hls from '@oplayer/hls'
import dash from '@oplayer/dash'
import ad from '@oplayer/ad'
import mpegts from '@oplayer/mpegts'

import MP4 from '../../website/static/君の名は.mp4'
import SRT from '../../website/static/君の名は.srt'
import DANMAKU from '../../website/static/danmaku.xml'
import THUMB from '../../website/static/thumbnails.jpg'
import POSTER from '../../website/static/poster.png'
import op from '../../website/static/op.flv'

import { html, render } from 'lit'
import { live } from 'lit/directives/live.js'
import { ref } from 'lit/directives/ref.js'
import { played } from '@oplayer/ui/src/components/Progress.style'

const dataSrcs = [
  MP4,
  op,
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://yun.ssdm.cc/SBDM/ShinigamiBocchantoKuroMaid02.m3u8',
  'https://test-streams.mux.dev/x36xhzz/url_0/193039199_mp4_h264_aac_hd_7.m3u8',
  'https://video.zidivo.com/live983/GrtjM_FNGC/playlist.m3u8', //live
  'https://cdn6.hnzycdn.com:65/20220712/O5XeHGZz/1935kb/hls/index.m3u8',
  'https://cdn6.hnzycdn.com:65/20220712/xb2EScnz/1672kb/hls/index.m3u8',
  'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  'https://ukzyvod3.ukubf5.com/20220410/yAU8vUFg/2000kb/hls/index.m3u8',
  'https://media.w3.org/2010/05/sintel/trailer.mp4'
] as const

const querySrc = new URLSearchParams(window.location.search).get('src')
let src = querySrc || dataSrcs[0]
let currentDataSrcId = querySrc ? -1 : 0

const quailitySrcs = [
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
] as const

const player = Player.make(document.getElementById('player')!, {
  muted: true,
  volume: 0.5,
  // isLive: true,
  source: { poster: POSTER, src },
  videoAttr: { crossorigin: 'anonymous' } // screenshot
})
  .use([
    ui({
      // speed: [],
      autoFocus: true,
      screenshot: true,
      settings: ['loop'],
      theme: { primaryColor: '#00b2ff' },
      subtitle: {
        color: '#00b2ff',
        fontSize: isMobile ? 16 : 20,
        source: [
          {
            name: 'Default',
            default: true,
            src: 'https://cc.zorores.com/7f/c1/7fc1657015c5ae073e9db2e51ad0f8a0/eng-2.vtt'
          }
        ]
      },
      thumbnails: {
        src:
          'https://preview.zorores.com/4b/4b1a02c7ffcad4f1ee11cd6f474548cb/thumbnails/sprite.vtt' ||
          THUMB,
        base: 'https://preview.zorores.com/4b/4b1a02c7ffcad4f1ee11cd6f474548cb/thumbnails/',
        isVTT: true,
        number: 100
      },
      highlight: [
        {
          time: 12,
          text: '谁でもいいはずなのに'
        },
        {
          time: 34,
          text: '夏の想い出がまわる'
        },
        {
          time: 58,
          text: 'こんなとこにあるはずもないのに'
        },
        {
          time: 88,
          text: '－－终わり－－'
        }
      ],
      menu: [
        {
          name: '视频列表',
          children: [
            {
              name: 'mp4',
              default: true,
              value: MP4
            },
            {
              name: 'hls',
              value: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
            },
            {
              name: 'dash',
              value: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
            },
            {
              name: 'flv',
              value: op
            }
          ],
          onChange({ value }) {
            src = value
            player.changeSource({ src: value })
          }
        }
      ],
      icons: {
        progressIndicator: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
        <path d="M16.118 3.667h.382a3.667 3.667 0 013.667 3.667v7.333a3.667 3.667 0 01-3.667 3.667h-11a3.667 3.667 0 01-3.667-3.667V7.333A3.667 3.667 0 015.5 3.666h.382L4.95 2.053a1.1 1.1 0 011.906-1.1l1.567 2.714h5.156L15.146.953a1.101 1.101 0 011.906 1.1l-.934 1.614z"/>
        <path d="M5.561 5.194h10.878a2.2 2.2 0 012.2 2.2v7.211a2.2 2.2 0 01-2.2 2.2H5.561a2.2 2.2 0 01-2.2-2.2V7.394a2.2 2.2 0 012.2-2.2z" fill="#fff"/>
        <path d="M6.967 8.556a1.1 1.1 0 011.1 1.1v2.689a1.1 1.1 0 11-2.2 0V9.656a1.1 1.1 0 011.1-1.1zM15.033 8.556a1.1 1.1 0 011.1 1.1v2.689a1.1 1.1 0 11-2.2 0V9.656a1.1 1.1 0 011.1-1.1z"/>
    </svg>`,
        loadingIndicator: `<img src='https://user-images.githubusercontent.com/40481418/135559343-98e82c95-1a67-4083-8ecb-763f6e62577e.gif'/>`,
        volume: [
          `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M128 426.666667v170.666666c0 23.466667 19.2 42.666667 42.666667 42.666667h128l140.373333 140.373333c26.88 26.88 72.96 7.68 72.96-30.293333V273.493333c0-37.973333-46.08-57.173333-72.96-30.293333L298.666667 384H170.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667z m576 85.333333A192 192 0 0 0 597.333333 340.053333v343.466667c63.146667-31.146667 106.666667-96 106.666667-171.52zM597.333333 189.866667v8.533333c0 16.213333 10.666667 30.293333 25.6 36.266667C733.013333 278.613333 810.666667 386.56 810.666667 512s-77.653333 233.386667-187.733334 277.333333c-15.36 5.973333-25.6 20.053333-25.6 36.266667v8.533333c0 26.88 26.88 45.653333 51.626667 36.266667C793.6 815.36 896 675.84 896 512s-102.4-303.36-247.04-358.4c-24.746667-9.813333-51.626667 9.386667-51.626667 36.266667z"></path></svg>`,
          `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M154.88 154.88a42.496 42.496 0 0 0 0 60.16L311.04 371.2 298.666667 384H170.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667v170.666666c0 23.466667 19.2 42.666667 42.666667 42.666667h128l140.373333 140.373333c26.88 26.88 72.96 7.68 72.96-30.293333v-177.92l178.346667 178.346667c-20.906667 15.786667-43.52 29.013333-68.266667 38.826666-15.36 6.4-24.746667 22.613333-24.746667 39.253334 0 30.72 31.146667 50.346667 59.306667 38.826666 34.133333-14.08 66.133333-32.853333 94.72-55.893333l57.173333 57.173333a42.496 42.496 0 1 0 60.16-60.16L215.466667 154.88c-16.64-16.64-43.52-16.64-60.586667 0zM810.666667 512c0 34.986667-6.4 68.693333-17.493334 99.84l65.28 65.28c23.893333-49.92 37.546667-105.813333 37.546667-165.12 0-163.413333-102.4-303.36-246.613333-358.4-25.173333-9.813333-52.053333 9.813333-52.053334 36.693333v8.106667c0 16.213333 10.666667 30.293333 26.026667 36.266667C733.013333 279.04 810.666667 386.56 810.666667 512z m-371.626667-268.373333l-7.253333 7.253333L512 331.093333V273.493333c0-37.973333-46.08-56.746667-72.96-29.866666zM704 512A192 192 0 0 0 597.333333 340.053333v76.373334l105.813334 105.813333c0.426667-3.413333 0.853333-6.826667 0.853333-10.24z"></path></svg>`
        ],
        pip: [
          `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 213.333333H256a85.333333 85.333333 0 0 0-85.333333 85.333334v426.666666a85.333333 85.333333 0 0 0 85.333333 85.333334h170.666667a42.666667 42.666667 0 1 1 0 85.333333H256a170.666667 170.666667 0 0 1-170.666667-170.666667V298.666667a170.666667 170.666667 0 0 1 170.666667-170.666667h512a170.666667 170.666667 0 0 1 170.666667 170.666667v128a42.666667 42.666667 0 1 1-85.333334 0V298.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z m-128 341.333334a128 128 0 0 0-128 128v85.333333a128 128 0 0 0 128 128h170.666667a128 128 0 0 0 128-128v-85.333333a128 128 0 0 0-128-128h-170.666667z"></path></svg>`,
          `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="m768,213.33333l-512,0a85.33333,85.33333 0 0 0 -85.33333,85.33334l0,426.66666a85.33333,85.33333 0 0 0 85.33333,85.33334l170.66667,0a42.66667,42.66667 0 1 1 0,85.33333l-170.66667,0a170.66667,170.66667 0 0 1 -170.66667,-170.66667l0,-426.66666a170.66667,170.66667 0 0 1 170.66667,-170.66667l512,0a170.66667,170.66667 0 0 1 170.66667,170.66667l0,128a42.66667,42.66667 0 1 1 -85.33334,0l0,-128a85.33333,85.33333 0 0 0 -85.33333,-85.33334zm-128,341.33334a128,128 0 0 0 -128,128l0,85.33333a128,128 0 0 0 128,128l170.66667,0a128,128 0 0 0 128,-128l0,-85.33333a128,128 0 0 0 -128,-128l-170.66667,0z"></path><g stroke="null"><g stroke="null" transform="matrix(0.6896517266997474,0,0,0.6896517266997474,-10241.200782450309,-10001.206060939305) "><rect stroke="null" x="15122.523407" y="14826.656681" width="582" height="402" fill="none"></rect></g><g stroke="null" transform="matrix(0.6896517266997474,0,0,0.6896517266997474,-10241.200782450309,-10001.206060939305) "><path stroke="null" d="m15503.523407,14924.856681l-161.8,0c-66.2,0 -120,53.8 -120,120l0,161.8c0,22.1 17.9,40 40,40s40,-17.9 40,-40l0,-144.4l169.8,169.8c7.8,7.8 18,11.7 28.3,11.7c10.2,0 20.5,-3.9 28.3,-11.7c15.6,-15.6 15.6,-40.9 0,-56.6l-170.7,-170.6l146.1,0c22.1,0 40,-17.9 40,-40s-17.9,-40 -40,-40z"></path></g></g></svg>`
        ],
        fullscreen: [
          `<svg viewBox="-113 -113 1250 1250" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 232.732444A232.732444 232.732444 0 0 1 232.732444 0h558.535112A232.732444 232.732444 0 0 1 1024 232.732444v558.535112A232.732444 232.732444 0 0 1 791.267556 1024H232.732444A232.732444 232.732444 0 0 1 0 791.267556V232.732444z m232.732444-139.662222a139.662222 139.662222 0 0 0-139.662222 139.662222v558.535112a139.662222 139.662222 0 0 0 139.662222 139.662222h558.535112a139.662222 139.662222 0 0 0 139.662222-139.662222V232.732444a139.662222 139.662222 0 0 0-139.662222-139.662222H232.732444z"></path><path d="M549.575111 245.845333c0-25.799111 20.935111-46.734222 46.734222-46.734222h116.821334A140.202667 140.202667 0 0 1 853.333333 339.313778v116.821333a46.734222 46.734222 0 0 1-93.468444 0v-116.821333c0-25.827556-20.906667-46.734222-46.734222-46.734222h-116.821334a46.734222 46.734222 0 0 1-46.734222-46.734223zM245.845333 549.546667c25.799111 0 46.734222 20.935111 46.734223 46.734222v116.821333c0 25.827556 20.906667 46.734222 46.734222 46.734222h116.821333a46.734222 46.734222 0 0 1 0 93.468445h-116.821333A140.202667 140.202667 0 0 1 199.111111 713.130667v-116.821334c0-25.799111 20.935111-46.734222 46.734222-46.734222z"></path></svg>`,
          `<svg viewBox="-113 -113 1250 1250" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0.739556 233.130667a232.391111 232.391111 0 0 1 232.391111-232.391111h557.738666a232.391111 232.391111 0 0 1 232.391111 232.391111v557.738666a232.391111 232.391111 0 0 1-232.391111 232.391111H233.130667a232.391111 232.391111 0 0 1-232.391111-232.391111V233.130667z m232.391111-139.434667a139.434667 139.434667 0 0 0-139.434667 139.434667v557.738666a139.434667 139.434667 0 0 0 139.434667 139.434667h557.738666a139.434667 139.434667 0 0 0 139.434667-139.434667V233.130667a139.434667 139.434667 0 0 0-139.434667-139.434667H233.130667z"></path><path d="M601.088 186.652444c25.685333 0 46.506667 20.792889 46.506667 46.478223v96.796444c0 25.685333 20.792889 46.478222 46.478222 46.478222h96.796444a46.478222 46.478222 0 1 1 0 92.984889h-96.796444a139.434667 139.434667 0 0 1-139.463111-139.463111V233.130667c0-25.685333 20.821333-46.478222 46.478222-46.478223z m-414.435556 414.435556c0-25.656889 20.792889-46.478222 46.478223-46.478222h96.796444a139.434667 139.434667 0 0 1 139.463111 139.463111v96.796444a46.478222 46.478222 0 0 1-92.984889 0v-96.796444c0-25.685333-20.792889-46.478222-46.478222-46.478222H233.130667a46.478222 46.478222 0 0 1-46.478223-46.506667z"></path></svg>`
        ],
        setting: `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="scale:1.1"><path d="M0 0h1024v1024H0z" fill-opacity="0"></path><path d="M501.333333 127.573333a21.333333 21.333333 0 0 1 21.333334 0l316.928 182.954667a21.333333 21.333333 0 0 1 10.666666 18.474667v365.994666a21.333333 21.333333 0 0 1-10.666666 18.474667L522.666667 896.426667a21.333333 21.333333 0 0 1-21.333334 0l-316.928-182.954667a21.333333 21.333333 0 0 1-10.666666-18.474667V328.96a21.333333 21.333333 0 0 1 10.666666-18.474667zM512 219.946667L259.029333 365.952v292.053333L512 804.010667l252.928-146.005334V365.952L512 219.946667zM512 426.666667a85.333333 85.333333 0 1 1 0 170.666666 85.333333 85.333333 0 0 1 0-170.666666z"></path></svg>`,
        screenshot: `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="scale: 0.9"><path d="M412.245333 757.333333a42.666667 42.666667 0 0 1-56.490666-64l356.48-314.794666a42.666667 42.666667 0 0 1 56.746666 0.256l112.896 101.461333a42.666667 42.666667 0 1 1-57.088 63.488L740.266667 467.626667l-328.021334 289.706666zM810.666667 213.333333h-128a42.666667 42.666667 0 0 1 0-85.333333h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v170.666666a42.666667 42.666667 0 0 1-85.333333 0V213.333333zM213.333333 213.333333v128a42.666667 42.666667 0 1 1-85.333333 0V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 1 1 0 85.333333H213.333333z m597.333334 597.333334v-128a42.666667 42.666667 0 0 1 85.333333 0v170.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-170.666666a42.666667 42.666667 0 0 1 0-85.333333h128zM213.333333 810.666667h128a42.666667 42.666667 0 0 1 0 85.333333H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-170.666666a42.666667 42.666667 0 0 1 85.333333 0v128z m170.666667-298.666667a128 128 0 1 1 0-256 128 128 0 0 1 0 256z m0-85.333333a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z"></path></svg>`,
        subtitle: `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M640 970.666667H384c-231.765333 0-330.666667-98.901333-330.666667-330.666667V384c0-231.765333 98.901333-330.666667 330.666667-330.666667h256c231.765333 0 330.666667 98.901333 330.666667 330.666667v256c0 231.765333-98.901333 330.666667-330.666667 330.666667z m-256-853.333334C187.136 117.333333 117.333333 187.136 117.333333 384v256c0 196.864 69.802667 266.666667 266.666667 266.666667h256c196.864 0 266.666667-69.802667 266.666667-266.666667V384c0-196.864-69.76-266.666667-266.666667-266.666667z" fill="#ffffff" p-id="9126"></path><path d="M667.733333 760.746667a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h78.933334a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32zM277.333333 760.746667a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h276.053334a32 32 0 0 1 0 64zM510.762667 600.32a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h235.946666a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32zM277.333333 600.32a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h118.186667a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32z"></path></svg>`
      }
    }),
    mpegts(),
    dash(),
    hls({
      options: {
        hlsQualityControl: true,
        hlsQualitySwitch: 'immediate'
      }
    }),
    {
      name: 'custom',
      apply: () => ({
        say: () => {
          console.log('custom plugin')
        }
      })
    },
    // ad({
    //   autoplay: false,
    //   image:
    //     'http://5b0988e595225.cdn.sohucs.com/images/20190420/da316f8038b242c4b34f6db18b0418d4.gif',
    //   // video: dataSrcs[1],
    //   duration: 10,
    //   skipDuration: 5,
    //   target: 'https://oplayer.vercel.app',
    //   plugins: [
    //     hls({
    //       options: {
    //         hlsQualityControl: true,
    //         hlsQualitySwitch: 'immediate'
    //       }
    //     })
    //   ]
    // })
    danmaku({
      enable: false,
      source: DANMAKU,
      opacity: 0.8,
      filter: (d: DanmakuItem) => d.text == '+1s'
    })
  ])
  .create()

console.log(player.plugins)

player.plugins.custom.say()

const meta = () => html`
  <div>
    <h4>Oh-Player v${Player.version}</h4>
    <p>
      STAR ON <a target="_blank" href="https://github.com/shiyiya/oplayer">GitHub</a> |
      <a href="./script.html" target="_blank">SCRIPT DEMO</a>
    </p>
  </div>
`
let logs: HTMLTextAreaElement

const actions = () => html`<p style="display:flex;">
    <input
      type="text"
      @input=${(e: any) => (src = e.target.value)}
      style="width:100%;"
      .value=${live(src)}
    />

    <button @click=${() => player.changeSource({ src })}>Load</button>

    <button
      @click=${() => {
        src =
          dataSrcs[
            currentDataSrcId + 1 >= dataSrcs.length
              ? (currentDataSrcId = 0)
              : (currentDataSrcId += 1)
          ]!
        player.changeSource({ src })
      }}
    >
      Queue
    </button>
  </p>

  <textarea readonly ${ref((f) => (logs = f as any))}></textarea> `

render(actions(), document.getElementById('actions')!)

player.on((e: PlayerEvent) => {
  if (e.type == 'mousemove') return

  render(actions(), document.getElementById('actions')!)

  let eventName = `==> ${e.type}`
  if ('durationchange' == e.type) {
    eventName += `: ${player.duration}`
  }

  logs.value = eventName + '\r\n' + logs.value
  // logs.style.height = `${logs.scrollHeight}px`

  if (e.type == 'videosourcechange') {
    logs.value = ''
  }

  if (logs.value.split('==>').length >= 66) {
    logs.value =
      '==> ------------clear logs------------- \r\n' +
      logs.value.split('==>').slice(0, 20).join('==>')
  }

  // console.info(e)
})

// p.$root.addEventListener('click', p.unmute.bind(p), { once: true })

render(meta(), document.getElementById('meta')!)

window.p = player

// console.table({
//   UA: globalThis.navigator?.userAgent,
//   isMobile,
//   isIOS,
//   isiPad,
//   isiPhone,
//   fullscreenEnabled: Boolean(document.fullscreenEnabled),
//   webkitFullscreenEnabled: Boolean(document.webkitFullscreenEnabled),
//   mozFullScreenEnabled: Boolean(document.mozFullScreenEnabled),
//   msFullscreenEnabled: Boolean(document.msFullscreenEnabled),
//   video: Boolean(player.$video.webkitEnterFullscreen)
// })
