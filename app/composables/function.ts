type FetchOptions<TBody = any> = {
  path: string;
  body?: TBody;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: any) => void;
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
      if (onSuccess) await onSuccess();
    } catch (err: any) {
      error.value = err;
      if (onError) onError(err);
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
