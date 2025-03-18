import { useState, useCallback } from 'react';

interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export const useModal = (options?: UseModalOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const openModal = useCallback((modalData?: any) => {
    setIsOpen(true);
    if (modalData !== undefined) {
      setData(modalData);
    }
    options?.onOpen?.();
  }, [options]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    setData
  };
};
