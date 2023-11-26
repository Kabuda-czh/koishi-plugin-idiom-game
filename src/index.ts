import { Context, Schema } from 'koishi'
import * as dictionary from './dictionary'

export const name = 'idiom-game'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

function isValidIdiom(idiom: string): boolean {
  return dictionary.defaultIdioms.includes(idiom)
}

function isValidChain(prevIdiom: string, nextIdiom: string): boolean {
  if (!isValidIdiom(nextIdiom))
    return false
  return prevIdiom.charAt(prevIdiom.length - 1) === nextIdiom.charAt(0)
}

export function apply(ctx: Context) {
  let idiomMap: Record<string, string> = {}

  // TODO: 是否为人机对战? 还是人人对战? 对战时间是否需要限制?
  ctx
    .command('idiom <idiom>', '成语接龙', { checkArgCount: true })
    .alias('成语接龙', '接龙')
    .action(async ({ session }, idiom) => {
        const { userId, guildId } = session

        if (guildId in idiomMap) {
          const prevIdiom = idiomMap[guildId]
          if (!isValidChain(prevIdiom, idiom))
            return '接龙失败'
        } else {
          // const randomIdiom = dictionary.defaultIdioms[Math.floor(Math.random() * dictionary.defaultIdioms.length)]
          if (!isValidIdiom(idiom))
            return '接龙失败'
        }

        idiomMap[guildId] = idiom
        return `接龙成功，当前成语：${idiom}`
      }
    )
}
