import Taro from "@tarojs/taro";

export function ReadFile(imgPath): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath: imgPath, //选择图片返回的相对路径
      encoding: "base64", //编码格式
      success(res) {
        resolve(res.data);
      },
      fail(result) {
        reject(result);
      },
    });
  });
}
