import Taro from "@tarojs/taro";
import { API_URL } from "./config";
const request = (url: string, config?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestInit: Taro.request.Option = {
      header: {
        Authorization: `Bearer ${Taro.getStorageSync("token")}`,
      },
      ...config!,
    };
    Taro.request({
      ...requestInit,
      url: `${API_URL}${url}`,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export default request;
