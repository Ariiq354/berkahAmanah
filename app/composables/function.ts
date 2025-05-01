import type { TPaginationMetadata } from "~~/server/utils/common/type";

type FetchOptions<TBody = any> = {
  path: string;
  body?: TBody;
  onSuccess: () => void | Promise<void>;
  onError: (error: any) => void;
};

export function useSubmit<TResponse = Record<string, any>>() {
  const isLoading = shallowRef(false);
  const data = shallowRef<TResponse | null>(null);
  const error = shallowRef<unknown | null>(null);

  const execute = async ({ path, body, onSuccess, onError }: FetchOptions) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await $fetch<TResponse>(path, {
        method: "POST",
        body,
      });

      data.value = res;
      await onSuccess();
    } catch (err: any) {
      error.value = err;
      onError(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    data,
    error,
    execute,
  };
}

export const useApiFetch = async <T>(endpoint: string, options = {}) => {
  const config = useRuntimeConfig();
  const { data, refresh, status } = await useFetch<{
    data: T;
    metadata: TPaginationMetadata | object;
  }>(`${config.public.apiBase}/${endpoint}`, options);

  return {
    data: computed(() => data.value?.data as T),
    pagination: computed(() => data.value?.metadata),
    refresh,
    status,
  };
};
