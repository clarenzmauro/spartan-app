import { Tabs } from "expo-router";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { TabBarIcon } from "@/components/tabbar-icon";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const { bottom } = useSafeAreaInsets();
	
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
					borderTopColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
					borderTopWidth: 1,
					height: 60 + bottom,
					paddingBottom: 5 + bottom,
					paddingTop: 5,
				},
				tabBarActiveTintColor: isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary,
				tabBarInactiveTintColor: isDarkColorScheme ? NAV_THEME.dark.text : NAV_THEME.light.text,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="schedule"
				options={{
					title: "Schedule",
					tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="qr"
				options={{
					title: "",
					tabBarIcon: () => (
						<View className={`w-14 h-14 rounded-full border-4 border-[#F38EA1] bg-[#B00020] items-center justify-center`}>
							<TabBarIcon name="qrcode" color="#FFFFFF" />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
