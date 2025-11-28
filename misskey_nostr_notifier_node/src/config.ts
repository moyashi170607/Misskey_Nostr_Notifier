import { load } from "js-yaml";
import { readFileSync } from "fs"

type Config = {
    PK_HEX: string
    RELAY: string[]

    MISSKEY_ORIGIN: string
    MISSKEY_API: string

    PORT: string
    BOUND_RATE: number
}

let config: Config = load(readFileSync("config.yml", "utf-8")) as Config


/**
 * 送受信に利用するリレーサーバー
 *
 * @type {string[]}
 */
export const RELAYS: string[] = config.RELAY


/**
 * ユーザーの公開鍵 HEX形式 config.ymlから
 *
 * @type {string}
 */
export const PK_HEX: string = config.PK_HEX
/**
 * MisskeyAPI config.ymlから
 *
 * @type {string}
 */
export const MISSKEY_API: string = config.MISSKEY_API
/**
 * 接続するサイトのドメイン config.ymlから
 *
 * @type {string}
 */
export const MISSKEY_ORIGIN: string = config.MISSKEY_ORIGIN

/**
 * 使用するポート config.ymlから
 *
 * @type {string}
 */
export const PORT: string = config.PORT


/**
 * シリアル通信のレート 変更する際は、マイコン側のレートも変更すること
 *
 * @type {number}
 */
export const BOUND_RATE: number = 9600