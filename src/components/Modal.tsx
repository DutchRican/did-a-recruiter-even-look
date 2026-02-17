import React, { useRef, useEffect } from 'react';
import { LucideCircleX } from 'lucide-react';

function Body({ onClose, children, ...props }:  { onClose: () => void, children: React.ReactNode , props?: React.ComponentProps<"dialog">}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
  }, []);

  const handleCancel = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };
  const classes = `flex flex-col  min-h-1/3 m-auto backdrop:bg-black/50 p-8 rounded-xl shadow-2xl w-full max-w-2xl bg-gray-100 z-100`
  return (
    <dialog ref={dialogRef} onCancel={handleCancel}  className={classes} {...props}>
      {children}
    </dialog>
  );
};

function Header({ title, onClose, canClose }: { title: string, onClose: () => void, canClose: boolean }) {
  return (
    <div className='flex flex-row justify-between items-center'>
      <span className='font-bold text-xl'>{title}</span>
      {canClose && <LucideCircleX onClick={onClose} className='self-end' />}
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex justify-end'>
      {children}
    </div>
  );
}

function Content({children}: {children: React.ReactNode}) {
 return (<div className='flex flex-1 pt-4 overflow-clip'>
    {children}
  </div>
 );
}



export const Modal = {
  Body,
  Header,
  Footer,
  Content
}