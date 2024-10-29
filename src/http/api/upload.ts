import { request } from '@/http/axios';
import { Upload } from '../axios/type';
enum APIS {
  UPLOAD_FILE = '/upload',
}
class UploadApi {
  /* 上传图片 */
  static uploadFile = (params: Upload) =>
    request.upload<any>(APIS.UPLOAD_FILE, params);
}
export default UploadApi;
