import "../styles/modal.scss";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirm: () => void;
  cancel: () => void;
  children: React.ReactNode;
}

export function Modal({
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirm,
  cancel,
  children,
}: ModalProps) {
  return (
    <div className="modal">
      <div className="wrapper">
        {children}

        <p>{title}</p>
        <span>{description}</span>

        <div className="actions">
          <Button onClick={cancel}>{cancelText}</Button>
          <Button onClick={confirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}
