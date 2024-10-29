import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { axiosBaseOptions } from '@/http/axios/axios-setup';

import type { AxiosDownload, Upload, UrlDownload } from '@/http/axios/type';
import { download, localClear, localGet } from '@/utils/util';
import { createStandaloneToast } from '@chakra-ui/react';

import i18n from '@/i18n';

const { toast } = createStandaloneToast();

class MyAxios {
  private readonly axiosInstance: AxiosInstance;
  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options);
    this.initInterceptors();
  }

  private initInterceptors() {
    // 请求拦截  上传数据的加密处理在这里配置
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        //headers的access-token部分在请求拦截中加入
        // const lang = i18n.language || localStorage.getItem('lang') || 'en_US';
        // config.headers = {
        //   ...config.headers,
        //   lang,
        // };
        // const token: string | null = localGet('access_token');
        // if (token) {
        //   config.headers = {
        //     ...config.headers,
        //     Authorization: token,
        //   };
        // }
        console.log(`本次请求的config信息：`, config);
        return config;
      },
      (error) => {
        console.log(`axios请求拦截部分报错，错误信息error`, error);
        return Promise.reject(error);
      },
    );

    //响应拦截  从接口响应的数据在这里处理 例如解密等  时间发生在then catch前
    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        // resBaseInfo 针对接口返回有基本格式的情况下 如上面导入的resBaseInfo基本请求返回体 基本返回体由rsCode rsCause 和 data构成
        let data = response.data;
        // 兼容下载文件
        if (data instanceof Blob) {
          try {
            data = await new Response(data).json();
          } catch (error) {
            // 转换是失败就是请求成功
            const disposition = response.headers['content-disposition'];
            let filename = disposition ? decodeURI(disposition.split(';')[1].split('filename=')[1]) : undefined;
            download(response.data, filename);
            return Promise.resolve();
          }
        }
        if ([1025, 1028].includes(data.code)) {
          window.location.href = `${window.location.origin}/user/login`;
          localClear();
        }
        if (data.code !== 0) {
          if (!toast.isActive('toast-error')) {
            toast({
              status: 'error',
              containerStyle: { mb: '120px' },
              id: 'toast-error',
              description: `${data.msg}`,
            });
          }
          return Promise.reject(data.data); //假设后台的错误信息放在了data中  这里根据情况修改
        }

        return data.data; //因为下方封装默认泛型默认定义到了response下的data下的resBaseInfo下的data
      },
      (error: AxiosError) => {
        console.log('axios响应拦截部分发生错误，错误信息为', error);

        return Promise.reject(error);
      },
    );
  }

  get<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.get(url, { params: data });
  }

  post<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.post(url, data);
  }
  download<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.post(url, data, { responseType: 'blob' });
  }

  put<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.put(url, data);
  }

  delete<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.delete(url, data);
  }

  upload<T = any>(url: string, data: Upload): Promise<T> {
    const { file, controller, onUploadProgress } = data;
    return this.axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined, //用于文件上传可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824
    });
  }

  axiosDownload(params: AxiosDownload): void {
    const { url, data, controller, fileName, onDownloadProgress } = params;
    this.axiosInstance
      .get<Blob>(url, {
        params: data,
        responseType: 'blob',
        onDownloadProgress,
        signal: controller ? controller.signal : undefined, //用于文件下载可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824以及https://axios-http.com/zh/docs/cancellation
      })
      .then((res) => {
        const blob = new Blob([res.data]);
        const a = document.createElement('a');
        a.style.display = 'none';
        if (fileName) {
          a.download = fileName;
        } else {
          //这里需要更据实际情况从‘content-disposition’中截取 不一定正确
          a.download = decodeURIComponent(
            res.headers['content-disposition'].split(';').slice(-1)[0].split('=')[1].replaceAll('"', ''), //对于使用encodeURI()或者encodeURIComponent()将文件名中文转码的情况 这里解码一下
          );
        }
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      });
  }

  urlDownload(params: UrlDownload) {
    const { fileName, serveBaseUrl, fileUrl } = params;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = fileName;
    a.href = serveBaseUrl ? `${serveBaseUrl}${fileUrl}` : fileUrl;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href); // 释放URL 对象
    document.body.removeChild(a);
  }
}

export const request = new MyAxios(axiosBaseOptions);
