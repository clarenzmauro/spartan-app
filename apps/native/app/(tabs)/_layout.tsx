import { Tabs } from "expo-router";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { TabBarIcon } from "@/components/tabbar-icon";
import { View } from "react-native";

export default function TabsLayout() {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
					borderTopColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
					borderTopWidth: 1,
					height: 60,
					paddingBottom: 5,
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
					tabBarIcon: ({ focused }) => (
						<View className={`w-14 h-14 rounded-full border-4 ${focused ? 'border-primary bg-primary' : 'border-primary bg-background'} items-center justify-center`}>
							<TabBarIcon name="qrcode" color={focused ? (isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background) : (isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary)} />
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
