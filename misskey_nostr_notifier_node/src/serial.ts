import { SerialPort } from 'serialport'
import { BOUND_RATE, PORT } from './config.ts';


/**
 * COMポートを開き、シリアル通信を開始する。
 *
 * @export
 * @param {string} path 開くポートの番号
 * @param {number} boundRate レート
 * @returns {SerialPort} 
 */
export function openPort(path: string, boundRate: number): SerialPort {
    const port: SerialPort = new SerialPort({ path: path, baudRate: boundRate });

    // ポートが正常に開いた時
    port.on('open', () => {
        console.log('シリアルポート を 9600 bps で開きました。');
    });

    // データを受信した時
    port.on('data', (data) => {
        // 受信したデータは Buffer オブジェクトなので、文字列に変換して表示
        console.log('データを受信:', data.toString());
    });

    // エラーが発生した時
    port.on('error', (err) => {
        console.error('シリアル通信エラー:', err.message);
    });

    // ポートがクローズされた時
    port.on('close', () => {
        console.log('シリアルポートが閉じられました。');
    });

    return port
}

export let port: SerialPort = openPort(PORT, BOUND_RATE)


/**
 * メッセージを送信
 *
 * @export
 * @param {SerialPort} port 送信するポート
 * @param {string} text 送信する内容
 * @returns {boolean} 送信成功か失敗か
 */
export function sendMessage(port: SerialPort, text: string): boolean {
    let result: boolean = port.write(text, function (err) {
        if (err) {
            // エラーハンドル
            console.log('エラー発生:', err.message);
            return false
        }
        // 成功
        console.log("送信完了");
        return true
    });

    return result
}