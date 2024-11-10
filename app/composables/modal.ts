import ModalConfirm from "~/components/ModalConfirm.vue";

export function openConfirmModal(anyFunction: () => Promise<void>) {
  const modal = useModal();

  modal.open(ModalConfirm, {
    function: anyFunction,
    async onSuccess() {
      modal.close();
    },
  });
}
