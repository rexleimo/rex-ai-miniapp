import Taro from "@tarojs/taro";
import { ReadFile } from "./read-file";

export function TaroUtilsChooseImage(): Promise<[string|ArrayBuffer, string]> {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await Taro.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], //所选的图片的尺寸
        sourceType: ["album", "camera"], //选择图片的来源
      });

      const qrcodeBase64 = await ReadFile(resp.tempFilePaths[0]);
      resolve([qrcodeBase64, resp.tempFilePaths[0]]);
    } catch (err) {
      reject(err);
    }
  });
}
