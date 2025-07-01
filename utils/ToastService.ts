// utils/ToastService.ts
import { EventEmitter } from 'events';

const toastEmitter = new EventEmitter();
export const ToastService = {
  show: (message: string) => {
    console.log('ToastService.show called with:', message);
    toastEmitter.emit('showToast', message);
  },
  on: (callback: (message: string) => void) => {
    toastEmitter.on('showToast', callback);
  },
  off: (callback: (message: string) => void) => {
    toastEmitter.off('showToast', callback);
  },
};
