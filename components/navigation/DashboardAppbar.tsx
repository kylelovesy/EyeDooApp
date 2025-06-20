
import { getHeaderTitle } from '@react-navigation/elements';
import { Route } from '@react-navigation/native';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

type ScreenIconMap = {
  [key: string]: string;
};

// Define a more flexible props interface with only what we need
interface DashboardAppbarProps {
  navigation: NativeStackNavigationProp<any>;
  route: Route<string>;
  options: {
    title?: string;
    screenIcons?: ScreenIconMap;
  };
  back?: {
    title: string;
  };
}

const DashboardAppbar: React.FC<DashboardAppbarProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  const title = getHeaderTitle(options, route.name);
  const allRoutes = navigation.getState().routes;
  const currentRouteKey = route.key;
  const screenIcons = options.screenIcons || {};

  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {allRoutes.map((r) => {
        if (r.key === currentRouteKey) {
          return null;
        }
        const icon = screenIcons[r.name];
        if (!icon) {
          return null;
        }
        return (
          <Appbar.Action
            key={r.key}
            icon={icon}
            onPress={() => navigation.navigate(r.name)}
          />
        );
      })}
    </Appbar.Header>
  );
};

export default DashboardAppbar;