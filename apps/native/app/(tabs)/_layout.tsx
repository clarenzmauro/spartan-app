import { Tabs } from "expo-router";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function TabsLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const { bottom } = useSafeAreaInsets();
	const bottomInset = Platform.OS === "android" ? bottom : 0;
	
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: isDarkColorScheme ? NAV_THEME.dark.background : NAV_THEME.light.background,
					borderTopColor: isDarkColorScheme ? NAV_THEME.dark.border : NAV_THEME.light.border,
					borderTopWidth: 1,
					height: 60 + bottomInset,
					paddingBottom: 5 + bottomInset,
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
					tabBarIcon: ({ focused }) => (
						<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
							<Path
								d="M20.04 6.82L14.28 2.79C12.71 1.69 10.3 1.75 8.78999 2.92L3.77999 6.83C2.77999 7.61 1.98999 9.21 1.98999 10.47V17.37C1.98999 19.92 4.05999 22 6.60999 22H17.39C19.94 22 22.01 19.93 22.01 17.38V10.6C22.01 9.25 21.14 7.59 20.04 6.82ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
								fill={focused ? "#b30000" : "#9DB2CE"}
							/>
						</Svg>
					),
				}}
			/>
			<Tabs.Screen
				name="schedule"
				options={{
					title: "Schedule",
					tabBarIcon: ({ focused }) => (
						<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
							<Path
								d="M12 6V12H18"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
					),
				}}
			/>
			<Tabs.Screen
				name="qr"
				options={{
					title: "QR",
					tabBarIcon: () => (
						<View className={`w-20 h-20 rounded-full border-4 border-[#F38EA1] bg-[#b30000] items-center justify-center -mt-14`}>
							<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
								<Path
									d="M21.25 8.917V5.833C21.25 5.01534 20.9252 4.23116 20.347 3.65299C19.7688 3.07482 18.9847 2.75 18.167 2.75H15.083M15.083 21.25H18.167C18.9847 21.25 19.7688 20.9252 20.347 20.347C20.9252 19.7688 21.25 18.9847 21.25 18.167V15.083M2.75 15.083V18.167C2.75 18.9847 3.07482 19.7688 3.65299 20.347C4.23116 20.9252 5.01534 21.25 5.833 21.25H8.917M8.917 2.75H5.833C5.01534 2.75 4.23116 3.07482 3.65299 3.65299C3.07482 4.23116 2.75 5.01534 2.75 5.833V8.917M9.433 5.833H6.733C6.4943 5.833 6.26539 5.92782 6.0966 6.0966C5.92782 6.26539 5.833 6.4943 5.833 6.733V9.433C5.833 9.67169 5.92782 9.90061 6.0966 10.0694C6.26539 10.2382 6.4943 10.333 6.733 10.333H9.433C9.67169 10.333 9.90061 10.2382 10.0694 10.0694C10.2382 9.90061 10.333 9.67169 10.333 9.433V6.733C10.333 6.4943 10.2382 6.26539 10.0694 6.0966C9.90061 5.92782 9.67169 5.833 9.433 5.833ZM9.433 13.648H6.733C6.4943 13.648 6.26539 13.7428 6.0966 13.9116C5.92782 14.0804 5.833 14.3093 5.833 14.548V17.248C5.833 17.4867 5.92782 17.7156 6.0966 17.8844C6.26539 18.0532 6.4943 18.148 6.733 18.148H9.433C9.67169 18.148 9.90061 18.0532 10.0694 17.8844C10.2382 17.7156 10.333 17.4867 10.333 17.248V14.548C10.333 14.3093 10.2382 14.0804 10.0694 13.9116C9.90061 13.7428 9.67169 13.648 9.433 13.648ZM17.267 5.833H14.567C14.3283 5.833 14.0994 5.92782 13.9306 6.0966C13.7618 6.26539 13.667 6.4943 13.667 6.733V9.433C13.667 9.67169 13.7618 9.90061 13.9306 10.0694C14.0994 10.2382 14.3283 10.333 14.567 10.333H17.267C17.5057 10.333 17.7346 10.2382 17.9034 10.0694C18.0722 9.90061 18.167 9.67169 18.167 9.433V6.733C18.167 6.4943 18.0722 6.26539 17.9034 6.0966C17.7346 5.92782 17.5057 5.833 17.267 5.833ZM17.267 13.667H14.567C14.3283 13.667 14.0994 13.7618 13.9306 13.9306C13.7618 14.0994 13.667 14.3283 13.667 14.567V17.267C13.667 17.5057 13.7618 17.7346 13.9306 17.9034C14.0994 18.0722 14.3283 18.167 14.567 18.167H17.267C17.5057 18.167 17.7346 18.0722 17.9034 17.9034C18.0722 17.7346 18.167 17.5057 18.167 17.267V14.567C18.167 14.3283 18.0722 14.0994 17.9034 13.9306C17.7346 13.7618 17.5057 13.667 17.267 13.667Z"
									stroke="white"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</Svg>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ focused }) => (
						<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
							<Path
								d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M22 22L20 20"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
							<Path
								d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<Path
								d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22"
								stroke={focused ? "#b30000" : "#9DB2CE"}
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
					),
				}}
			/>
		</Tabs>
	);
}
