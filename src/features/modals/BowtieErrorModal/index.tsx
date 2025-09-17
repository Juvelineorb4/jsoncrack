import React from "react";
import type { ModalProps } from "@mantine/core";
import { Button, Modal, Stack, Text } from "@mantine/core";
import useFile from "../../../store/useFile";
import { useModal } from "../../../store/useModal";

export const BowtieErrorModal = ({ opened, onClose }: ModalProps) => {
  const error = useFile(state => state.error);
  const clearError = useFile(state => state.clearError);
  const setVisible = useModal(state => state.setVisible);

  const handleClose = React.useCallback(() => {
    clearError();
    setVisible("BowtieErrorModal", false);
    onClose?.();
  }, [clearError, onClose, setVisible]);

  return (
    <Modal title="Bowtie inválido" opened={opened} onClose={handleClose} centered size="lg">
      <Stack gap="md">
        <Text>{error}</Text>
        <Button onClick={handleClose}>Cerrar</Button>
      </Stack>
    </Modal>
  );
};
