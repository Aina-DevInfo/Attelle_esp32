/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, useColorScheme} from 'react-native';

import { RouteProp } from '@react-navigation/native';

import BluetoothClassicTerminal from './src/BluetoothClassicTerminal';
import ScreenConnect from './src/ScreenConnect';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bleutooth">
        <Stack.Screen name="Home" component={ScreenConnect} options={{ headerShown: false }} />
        <Stack.Screen name="Bleutooth" component={BluetoothClassicTerminal} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});

export default App;
