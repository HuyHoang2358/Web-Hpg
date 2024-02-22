import { AxiosError } from 'axios';
import { message, notification } from 'ant-design-vue';

export const useErrorHandler = () => {
  function onError(error: unknown) {
    const errorAsType = error as AxiosError<{ msg: string }>;
    notification.error({
      message: 'Thất bại',
      description: errorAsType?.response?.data?.msg || errorAsType?.message,
      placement: 'top',
    });
  }

  async function handleMessageError(error: unknown) {
    const errorAsType = error as AxiosError<{ msg: string }>;
    message.error({
      content: errorAsType?.response?.data?.msg || errorAsType?.message,
    });
  }

  return {
    onError,
    handleMessageError,
  };
};
