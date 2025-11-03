import axios from 'axios';
import { parseError } from './errors';
import eventEmitter from './event';
import { get } from 'lodash';
import { CONFIG } from '@/config/config';

class CustomError extends Error {
  code: any;
  keys: any;
  error: any;
  constructor({ code, error, keys }: any) {
    super(error);
    this.name = this.constructor.name;
    this.code = code;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

function getBaseURL() {
  return CONFIG.NEXT_PUBLIC_BASE_URL;
}

const createAPIClient = () => {
  return axios.create({
    baseURL: getBaseURL(),
    timeout: 60000,
    withCredentials: true,
    transformResponse: (res) => {
      let response;
      try {
        response = JSON.parse(res);
      } catch (error) {
        throw new CustomError({ code: 'FAILED', error: res });
      }

      if (
        response.code &&
        !['SUCCESS', 'RESET_PASSWORD', 'FAILED_TO_INSERT'].includes(
          response.code
        )
      ) {
        throw new CustomError({
          code: response.code,
          error: response.message || response.error || response.code
        });
      } else if (response.error) {
        if (!response.error.includes('Error: timeout')) {
          let { code, msg }: any = parseError(response);
          throw new CustomError({ code: code, error: msg });
        } else {
          throw new CustomError({
            code: 405,
            error: 'App is not responding right now, Please try again',
            data: response
          });
        }
      } else if (response) {
        if (response.code === 'AUTH_FAILED') {
          let { code, msg }: any = parseError(response);
          throw new CustomError({ code: code, error: msg });
        }
        return response;
      } else {
        return {
          code: 'FAILED',
          error: 'App is not responding right now, Please try again',
          data: response
        };
      }
    }
  });
};

// Cache expiration time in milliseconds (e.g., 2 minutes)
const CACHE_EXPIRATION_TIME = 2 * 60 * 1000;

const cache = new Map();
const activeRequests = new Map();

// Helper function to check the cache
const getCache = (cacheKey: string, isCache: boolean) => {
  if (isCache) {
    const cachedEntry = cache.get(cacheKey);
    if (
      cachedEntry &&
      Date.now() - cachedEntry.timestamp < CACHE_EXPIRATION_TIME
    ) {
      return cachedEntry.data;
    }
  }
  return null;
};

// Helper function to set the cache
const setCache = (cacheKey: string, data: any) => {
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

// helper function to handle API call with authorization
const fetchWithAuthorization = async (
  method: string,
  url: string,
  payload: any,
  headers: any
) => {
  const isFormData = payload instanceof FormData;

  // Set Content-Type ONLY if not FormData and not GET
  if (method.toLowerCase() !== 'get' && !isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const APIKit = createAPIClient();
  return await APIKit({
    method,
    url,
    data: method !== 'get' ? payload : undefined,
    headers,
    withCredentials: true
  });
};

const getCSRFToken = async () => {
  const csrfResponse = await axios.get(`${getBaseURL()}/csrf-token`, {
    withCredentials: true
  });

  return get(csrfResponse, 'data.data.x-csrf-token');
};

// Main fetch function
const fetchData = async (
  method: string,
  url: string,
  payload = {},
  headers: any = {},
  isCache: boolean = false
) => {
  const urlWithoutQuery = url.split('?')[0];
  const cacheKey = `${method}-${urlWithoutQuery}-${JSON.stringify(payload)}`;

  // Check cache before making an API request
  const cachedData = getCache(cacheKey, isCache);
  if (cachedData) {
    return cachedData;
  }

  try {
    if (['post', 'put', 'delete'].includes(method.toLowerCase())) {
      try {
        const csrfResponse = await getCSRFToken();
        headers = {
          ...headers,
          'x-csrf-token': csrfResponse
        };
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    }

    // Fetch the data from the API if not cached or cache is expired
    const response = await fetchWithAuthorization(
      method,
      url,
      payload,
      headers
    );
    const customResponse = response.data;

    // Cache the response if necessary
    setCache(cacheKey, customResponse);

    return customResponse;
  } catch (err: any) {
    if (axios.isCancel(err)) {
    } else {
      console.error('Error fetching data:', err);
    }

    if (err.code === 'AUTH_FAILED' || err.code === 'OLD_SESSION') {
      eventEmitter.emit('signOut', {});
    }

    if (err.response && err.response.data) {
      const customResponse = err.response.data;

      if (customResponse.code === 'FAILED_TO_INSERT') {
        return customResponse;
      }

      // Otherwise, return error as usual
      return {
        code: customResponse.code || err.code,
        message: customResponse.message || err.message,
        data: customResponse.data || null
      };
    }

    return { code: err.code, message: err.message, data: null };
  }
};

// API methods
const PostCall = (url: string, payload = {}, headers = {}) =>
  fetchData('post', url, payload, headers);
const GetCall = (url: string, headers = {}) =>
  fetchData('get', url, {}, headers);
const PutCall = (url: string, payload = {}, headers = {}) =>
  fetchData('put', url, payload, headers);
const DeleteCall = (url: string, payload = {}, headers = {}) =>
  fetchData('delete', url, payload, headers);

const PostPdfCall = async (url: string, payload = {}, headers = {}) => {
  headers = {
    ...headers
  };

  try {
    const csrfResponse = await axios.get(`${getBaseURL()}/csrf-token`, {
      withCredentials: true
    });
    headers = {
      ...headers,
      'x-csrf-token': get(csrfResponse, 'data.data.x-csrf-token')
    };
  } catch (err) {
    console.error('Failed to fetch CSRF token:', err);
  }

  try {
    const response = await axios.post(`${getBaseURL()}${url}`, payload, {
      responseType: 'blob',
      ...headers
    });

    // Check if the response.data is a Blob
    if (response.data instanceof Blob) {
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } else {
      return response.data;
    }
  } catch (error: any) {
    return { code: 'FAILED', message: error.message, data: null };
  }
};

const GetPdfCall = async (url: string, filename: any, headers = {}) => {
  headers = {
    ...headers,
    responseType: 'blob'
  };

  try {
    return await fetch(`${getBaseURL()}${url}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData && errorData['error']
              ? errorData['error']
              : 'Failed to download. Please try again or change range'
          );
        }
        const contentDisposition = response.headers.get('content-disposition');
        if (
          contentDisposition &&
          contentDisposition.indexOf('attachment') !== -1
        ) {
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches && matches[1]) {
            filename = matches[1];
          }
        }

        return response.blob().then((blob) => ({ blob, filename }));
      })
      .then(async ({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return { code: 'SUCCESS', message: 'Report downloaded!' };
      })
      .catch((error) => {
        return {
          code: 'FAILED',
          message: get(error, 'response.data.error', 'Failed to download'),
          data: null
        };
      });
  } catch (error: any) {
    return { code: 'FAILED', message: error.message, data: null };
  }
};

const GetExcelCall = async (
  apiUrl: string,
  filename: string = 'download',
  headers = {}
) => {
  // const token = await getAuthToken();
  if (!apiUrl.startsWith('/')) {
    apiUrl = `/${apiUrl}`;
  }
  try {
    const response = await axios.get(`${getBaseURL()}${apiUrl}`, {
      headers: {
        ...headers
      },
      withCredentials: true,
      responseType: 'blob'
    });

    let extension = 'xlsx';
    const contentType = response.headers['content-type'];

    if (contentType) {
      if (contentType.includes('application/vnd.ms-excel')) {
        extension = 'xls';
      } else if (
        contentType.includes(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ) {
        extension = 'xlsx';
      }
    }

    const blob = new Blob([response.data], {
      type:
        contentType ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    return { code: 'SUCCESS', message: 'File downloaded successfully' };
  } catch (error: any) {
    console.error('Download error:', error);
    return {
      code: 'FAILED',
      message: error.response?.data?.message || error.message,
      data: null
    };
  }
};

export {
  PostCall,
  GetCall,
  PutCall,
  DeleteCall,
  PostPdfCall,
  GetPdfCall,
  GetExcelCall
};
