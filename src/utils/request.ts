import Taro from "@tarojs/taro";
import { API_URL } from "./config";
const request = (url: string, config?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${API_URL}${url}`,
      ...config,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

export default request;
