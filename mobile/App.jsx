import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screen stubs
const HomeScreen     = () => null;
const ProjectsScreen = () => null;
const ProfileScreen  = () => null;
const EventsScreen   = () => null;

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home"     component={HomeScreen} />
        <Tab.Screen name="Projects" component={ProjectsScreen} />
        <Tab.Screen name="Profile"  component={ProfileScreen} />
        <Tab.Screen name="Events"   component={EventsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
