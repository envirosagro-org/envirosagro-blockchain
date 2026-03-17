import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: () => Promise<any>;
  idleText: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  icon?: React.ReactNode;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const TriggerButton: React.FC<TriggerButtonProps> = ({
  action,
  idleText,
  loadingText = 'Processing...',
  successText = 'Success',
  errorText = 'Failed',
  icon,
  onSuccess,
  onError,
  className,
  disabled,
  ...props
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (status === 'loading' || disabled) return;

    setStatus('loading');
    try {
      const result = await action();
      setStatus('success');
      if (onSuccess) onSuccess(result);
      
      // Reset after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      if (onError) onError(err);
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading' || disabled}
      className={`relative flex items-center justify-center gap-2 transition-all duration-300 ${
        status === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
        status === 'error' ? 'bg-rose-600 text-white border-rose-500' :
        className
      }`}
      {...props}
    >
      {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {status === 'error' && <AlertCircle className="w-4 h-4" />}
      {status === 'idle' && icon}
      
      <span className="font-bold tracking-widest uppercase text-[10px] sm:text-xs">
        {status === 'idle' && idleText}
        {status === 'loading' && loadingText}
        {status === 'success' && successText}
        {status === 'error' && errorText}
      </span>
    </button>
  );
};
