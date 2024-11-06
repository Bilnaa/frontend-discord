import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Toast {
    static notify(message: string, options?: ToastOptions) {
        toast(message, options);
    }
}

export default Toast;