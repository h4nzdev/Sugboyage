import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Main/Home/Home";
import BottomNavbar from "../components/Nav/BottomNavbar"; // Import from separate file
import Discover from "../screens/Main/Discover/Discover";
import AIChatbot from "../screens/Main/AIChatbot/AIChatbot";
import Trips from "../screens/Main/Trips/Trips";
import Flights from "../screens/Main/Flights/Flights";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <BottomNavbar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="home" component={Home} />
        <Tab.Screen name="discover" component={Discover} />
        <Tab.Screen name="ai" component={AIChatbot} />
        <Tab.Screen name="trips" component={Trips} />
        <Tab.Screen name="flights" component={Flights} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
