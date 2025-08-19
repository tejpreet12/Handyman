import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Drawer>
        <Drawer.Screen name="(tabs)" options={{ title: "Main Tabs" }} />
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
