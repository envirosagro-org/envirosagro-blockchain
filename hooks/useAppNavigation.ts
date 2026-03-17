import { useAppStore } from '../store';

export const useAppNavigation = () => {
  const navigate = useAppStore(state => state.navigate);
  const goBack = useAppStore(state => state.goBack);
  const goForward = useAppStore(state => state.goForward);

  return { navigate, goBack, goForward };
};
