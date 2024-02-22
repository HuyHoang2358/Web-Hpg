import { useMutation } from '@tanstack/vue-query';
import { login } from '@/services/apis/config';
export const useLogin = () => useMutation({ mutationFn: login });
