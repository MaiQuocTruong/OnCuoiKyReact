import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from './screens/UserScreen';
import ViewUserScreen from './screens/ViewUserScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserScreen">
        <Stack.Screen name="UserScreen" component={UserScreen} options={{ title: 'User List' }} />
        <Stack.Screen name="ViewUserScreen" component={ViewUserScreen} options={{ title: 'User Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
