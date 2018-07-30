import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Activity from './screens/Activity';
import Notifications from './screens/Notifications';
import Shelf from './screens/Shelf';
import Profile from './screens/Profile';
import BottleDetails from './screens/BottleDetails';

const commonOptions = {
  headerStyle: {
    backgroundColor: '#7b6be6',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  headerTintColor: '#7b6be6',
  headerTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerBackTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerLeftTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerRightTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
};

const ShelfStack = createStackNavigator(
  {
    Shelf,
    BottleDetails,
  },
  {
    navigationOptions: { ...commonOptions },
  }
);

export const createRootNavigator = () => {
  return createBottomTabNavigator(
    {
      ShelfStack,
      Activity,
      Notifications,
      Profile,
    },
    {
      initialRouteName: 'ShelfStack',
      navigationOptions: ({ navigation }) => {
        const TabBarIcon = ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'ShelfStack') {
            iconName = `ios-home`;
          } else if (routeName === 'Activity') {
            iconName = `ios-map`;
          } else if (routeName === 'Notifications') {
            iconName = `ios-notifications`;
          } else if (routeName === 'Profile') {
            iconName = `ios-contact`;
          }
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        };

        TabBarIcon.propTypes = {
          focused: PropTypes.boolean,
          tintColor: PropTypes.string,
        };

        return {
          tabBarIcon: TabBarIcon,
          tabBarOptions: {
            showLabel: false,
            activeTintColor: 'white',
            inactiveTintColor: '#b4ade4',
            style: {
              borderTopColor: '#dddddd',
              borderTopWidth: 1,
              backgroundColor: '#7b6be6',
            },
          },
          ...commonOptions,
        };
      },
    }
  );
};
