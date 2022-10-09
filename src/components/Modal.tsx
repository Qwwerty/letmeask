import '../styles/modal.scss';
import { Button } from './Button';

interface ModalProps {
  title: string;
  description: string;
  confirm: () => void;
  cancel: () => void;
  children: React.ReactNode;
}

export function Modal({ title, description, confirm, cancel, children }: ModalProps) {
  return (
    <div className="modal">
      <div className='wrapper'>
        {children}

        <p>{title}</p>
        <span>{description}</span>

        <div className='actions'>
          <Button onClick={cancel}>Cancelar</Button>
          <Button onClick={confirm}>Sim, encerrar</Button>
        </div>
      </div>
    </div>
  )
}
