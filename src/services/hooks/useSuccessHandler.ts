import { notification } from 'ant-design-vue';

export const useSuccessHandler = () => {
  function handleSuccess(data: unknown, description: string) {
    const dataAsType = data as {
      data: {
        msg: string;
      };
      msg: string;
    };

    const messageSever = dataAsType?.data?.msg || dataAsType?.msg;

    notification.success({
      message: 'Thành công',
      description: messageSever !== 'Successful!' ? messageSever : description,
      placement: 'top',
    });
  }

  return {
    handleSuccess,
  };
};
