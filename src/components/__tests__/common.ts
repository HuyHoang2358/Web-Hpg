import { vitest } from 'vitest';
import clientSystemApi from '../../services/clientSystemApi';
import { flushPromises, mount, shallowMount, VueWrapper } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import router from '@/router';
import MockAdapter from 'axios-mock-adapter';

export type WrapperDataResponse<T> = {
  data: T;
};

type MockData<T> = {
  method?:
    | 'get'
    | 'getUri'
    | 'request'
    | 'delete'
    | 'head'
    | 'options'
    | 'post'
    | 'put'
    | 'patch'
    | 'postForm'
    | 'putForm'
    | 'patchForm';
  data: T;
};

export const mockResolvedValue = async <T>({ method, data }: MockData<T>) => {
  vitest.spyOn(clientSystemApi, method || 'get').mockResolvedValue(data);
  await flushPromises();
};

export const mockRejectedValue = async <T>({ method, data }: MockData<T>) => {
  vitest.spyOn(clientSystemApi, method || 'get').mockRejectedValue(data);
  await flushPromises();
};

type HttpRequestType = {
  endPoint: string;
  statusOrCallback: number;
  data: any;
  method: 'get' | 'post' | 'put' | 'delete';
};

export const makingHttpRequest = ({
  endPoint,
  method,
  statusOrCallback,
  data,
}: HttpRequestType) => {
  const mock = new MockAdapter(clientSystemApi);
  switch (method) {
    case 'get':
      mock.onGet(endPoint).reply(statusOrCallback, data);
      break;
    case 'post':
      mock.onPost(endPoint).reply(statusOrCallback, data);
      break;
    case 'put':
      mock.onPut(endPoint).reply(statusOrCallback, data);
      break;
    case 'delete':
      mock.onDelete(endPoint).reply(statusOrCallback, data);
      break;
  }
};

export const makingHttpRequests = (requests: HttpRequestType[]) => {
  const mock = new MockAdapter(clientSystemApi);
  requests.forEach((request) => {
    const { endPoint, method, statusOrCallback, data } = request;
    switch (method) {
      case 'get':
        mock.onGet(endPoint).reply(statusOrCallback, data);
        break;
      case 'post':
        mock.onPost(endPoint).reply(statusOrCallback, data);
        break;
      case 'put':
        mock.onPut(endPoint).reply(statusOrCallback, data);
        break;
      case 'delete':
        mock.onDelete(endPoint).reply(statusOrCallback, data);
        break;
    }
  });
};

export const mountComponent = <T>(Component: T) =>
  mount(Component, {
    global: {
      plugins: [VueQueryPlugin, createPinia(), router],
    },
    attachTo: 'body',
  });

export const shallowMountComponent = <T>(Component: T) =>
  shallowMount(Component, {
    global: {
      plugins: [VueQueryPlugin, createPinia(), router],
    },
  });

export const querySelector = (selectors: string) =>
  document.querySelector(selectors) as HTMLElement;

export function renderedNames(wrapper: VueWrapper) {
  return wrapper.findAllComponents({ name: 'BodyRow' }).map((row) => {
    return row.props().record.name;
  });
}
