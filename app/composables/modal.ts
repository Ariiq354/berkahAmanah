import ModalConfirm from "~/components/ModalConfirm.vue";

export function openConfirmModal(anyFunction: () => Promise<void>) {
  const overlay = useOverlay();

  const modal = overlay.create(ModalConfirm, {
    props: {
      function: anyFunction,
    },
  });

  modal.open();
}
