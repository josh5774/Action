import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screen stubs
const HomeScreen = () => null;
const ProjectsScreen = () => null;
const ProfileScreen = () => null;
const ClassesScreen = () => null;
const EventsScreen = () => null;
const LoginScreen = () => null;
const SignUpScreen = () => null;
const ApplyScreen = () => null;

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Apply: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Classes: undefined;
  Events: undefined;
  Profile: { userId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Apply" component={ApplyScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0d0d0d' },
        tabBarActiveTintColor: '#e50914',
      }}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Projects" component={ProjectsScreen} />
      <MainTab.Screen name="Classes" component={ClassesScreen} />
      <MainTab.Screen name="Events" component={EventsScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

export default function App() {
  const isAuthenticated = false; // Replace with real auth state

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
