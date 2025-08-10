import { useNavigationState } from '@react-navigation/native';

const useCurrentTab = () => {
  const currentTab = useNavigationState((state) => {
    if (!state) return null;

    // This gives you the top-level navigator state
    const tabState = state.routes.find(r => r.state)?.state || state;

    const tabIndex = tabState.index;
    const activeTabName = tabState.routeNames[tabIndex];

    return activeTabName;
  });

  return currentTab;
};

export default useCurrentTab;


