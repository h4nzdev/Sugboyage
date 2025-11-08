import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Main/Home/Home";
import Discover from "../screens/Main/Discover/Discover";
import Trips from "../screens/Main/Trips/Trips";
import Flights from "../screens/Main/Flights/Flights";

import BottomNavbar from "../components/Nav/BottomNavbar";
import Map from "../screens/Main/Map/Map";
import Profile from "../screens/Main/Profile/Profile";
import Settings from "../screens/Main/Settings/Settings";
import DetailedInfo from "../screens/Main/DetailedInfo/DetailedInfo";
import AIPlanner from "../screens/Main/AIChatbot/AIPlanner";
import SocialFeed from "../screens/Main/SocialFeed/SocialFeed";
import TravelHub from "../screens/Main/TravelHub/TravelHub";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🧭 Bottom Tabs
function TabNavigation() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="discover" component={Discover} />
      <Tab.Screen name="trips" component={Trips} />
      <Tab.Screen name="flights" component={Flights} />
      <Tab.Screen name="social-feed" component={SocialFeed} />
      <Tab.Screen name="travel-hub" component={TravelHub} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigation} />
        <Stack.Screen name="map" component={Map} />
        <Stack.Screen name="ai" component={AIPlanner} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="detailed-info" component={DetailedInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
