export function useToastSuccess(
  title: string,
  description: string | undefined
) {
  const toast = useToast();
  toast.add({
    title: title,
    description: description,
    icon: "i-heroicons-check-circle",
    color: "green",
    timeout: 3000,
  });
}

export function useToastError(title: string, description: string | undefined) {
  const toast = useToast();
  toast.add({
    title: title,
    description: description,
    icon: "i-heroicons-x-circle",
    color: "red",
    timeout: 3000,
  });
}
