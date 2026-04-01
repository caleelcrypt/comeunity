import { useToastContext } from '../components/feed/Toast';

export const useToast = () => {
  const { showToast } = useToastContext();
  return { showToast };
};