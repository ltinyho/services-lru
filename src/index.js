import axios from 'axios';
import url from 'url';

axios.defaults.withCredentials = true;

import qs from 'qs';
import Cache from './cache';

axios.defaults.transformRequest = [function (data) {
  if (data) {
    data = qs.stringify(data);
  }
  return data;
}];

axios.defaults.transformResponse = [function (data) {
  try {
    data = JSON.parse(data, { arrayFormat: 'brackets' });
  } catch (e) {
    data = data;
  }
  return data;
}];

/**
 * @param {{method:string=,url:string,data:object=,cache:bollean=,params:object=}} set
 * @return {*}
 */

class xhr {
  setBaseURL(baseUrl) {
    axios.defaults.baseURL = ''; // 后端 API 根路径
  }

  constructor(options) {
    this.xhrCache = new Cache();
    this._options = options;
  }

  xhr(set) {
    const setting  = Object.assign({
      method: 'get',
      url: '',
      data: null,
      cache: false,
      params: null,
      headers: {
        'Content-Type': set.method == 'get' ? 'application/json' : 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, set);
    let cacheData;
    const cacheKey = url.format({
      pathname: setting.url,
      search: qs.stringify(setting.params)
    });

    if (setting.cache) {
      cacheData = this.xhrCache.get(cacheKey);
      if (cacheData) {
        return new Promise((resolve) => {
          resolve(cacheData);
        });
      }
    }

    return axios(setting).then((res) => {
      if (setting.cache) {
        this.xhrCache.set(cacheKey, res.data);
      }
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      if (error.status === 504) {
        console.log('网络出错,请检测您的网络是否良好');
      }
    });
  }
}

export default xhr;
