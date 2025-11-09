import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

// SVG Icons
import MapsIcon from "../../assets/images/home-screen/maps-icon.svg";
import ClassIcon from "../../assets/images/home-screen/class-icon.svg";
import OrgsIcon from "../../assets/images/home-screen/orgs-icon.svg";
import EventsIcon from "../../assets/images/home-screen/events-icon.svg";
import NewsIcon from "../../assets/images/home-screen/news-icon.svg";
import GradesIcon from "../../assets/images/home-screen/grades-icon.svg";
import LiabilitiesIcon from "../../assets/images/home-screen/liabilities-icon.svg";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F5F5F5" }} />;
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F5F5F5",
      }}
      contentContainerStyle={{
        paddingBottom: "15%",
      }}
    >
      {/* red rectangle with rounded corners */}
      <View
        style={{
          width: "100%",
          height: "20%",
          borderRadius: 32,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: "#b30000",
          justifyContent: "flex-start",
          alignItems: "stretch",
          paddingTop: "5%",
        }}
      >
        {/* logo + bell */}
        <View className="flex-row justify-between items-center py-10 px-6">
          <Image
            source={require("../../assets/images/auth-screen/batangas-state-university-logo.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
            }}
          />
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>

        {/* student information */}
        <View className="flex-1 justify-end px-6 pb-6">
          <Text className="text-white text-lg font-semibold">
            {user?.lastName?.toUpperCase()}, {user?.firstName}
          </Text>
          <Text className="text-white text-sm">
            College of Informatics and Computing Sciences
          </Text>
        </View>
      </View>

	  {/* menu */}
	  <View className="py-6 px-4">
        <View className="flex-col gap-6">
          {/* First Row */}
          <View className="flex-row">
            <View className="flex-1 items-center justify-center">
              <MapsIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Map</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <ClassIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Class</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <OrgsIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Orgs</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <EventsIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Events</Text>
            </View>
          </View>

          {/* Second Row */}
          <View className="flex-row">
            <View className="flex-1 items-center justify-center">
              <NewsIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">News</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <GradesIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Grades</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <LiabilitiesIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Liabilities</Text>
            </View>
			 <View className="flex-1 items-center justify-center">
              <GradesIcon width={32} height={32} />
              <Text className="text-gray-800 font-medium mt-2">Grades</Text>
            </View>
          </View>
        </View>
	  </View>

	  {/* greetings */}
	  <View className="items-center">
		<View
		  style={{
			width: 380,
			height: 140,
			flexShrink: 0,
			borderRadius: 10,
			backgroundColor: '#b30000',
			shadowColor: 'rgba(48, 48, 48, 0.20)',
			shadowOffset: { width: 0, height: 0 },
			shadowRadius: 15,
			shadowOpacity: 1,
			elevation: 15,
		  }}
		>
			{/* logo and welcome text - top */}
			<View className="flex-row items-center p-4">
				<Image
					source={require("../../assets/images/auth-screen/batangas-state-university-logo.png")}
					style={{
						width: 35,
						height: 35,
						marginRight: 12,
					}}
				/>
				<Text className="text-white text-lg font-semibold">
					Welcome, Spartans!
				</Text>
			</View>

			{/* portfolio text and profile picture - bottom */}
			<View className="flex-1 justify-end p-4">
				<View className="flex-row justify-between items-end">
					{/* portfolio text - left */}
					<Text className="text-white text-sm flex-1">
						Easily create and share{'\n'}your own awesome portfolio
					</Text>

					{/* profile picture - right */}
					<Image
						source={{ uri: user?.imageUrl }}
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							borderWidth: 2,
							borderColor: 'white',
						}}
					/>
				</View>
			</View>
		</View>
	  </View>

	  {/* upcoming schedule */}
	  <View className="items-center py-2">
		{/* Header */}
		<View className="flex-row justify-between items-center px-4 py-4 w-full">
			<Text className="text-xl font-bold text-gray-800">Upcoming Schedule</Text>
			<TouchableOpacity>
				<Text className="text-red-600 font-medium">See more</Text>
			</TouchableOpacity>
		</View>

		{/* Schedule Card */}
		<View
			style={{
			width: 380,
			flexShrink: 0,
			borderRadius: 10,
			backgroundColor: '#fff',
			shadowColor: 'rgba(48, 48, 48, 0.20)',
			shadowOffset: { width: 0, height: 0 },
			shadowRadius: 15,
			shadowOpacity: 1,
			elevation: 15,
			paddingVertical: 16,
			}}
			className="justify-between"
		>
			{/* First row - Subject */}
			<View className="pl-4 py-2">
				<Text className="text-gray-800 text-lg font-bold">
					<Text style={{ color: '#b30000' }}>CS 412</Text> - Fundamentals of Data Science
				</Text>
			</View>

			{/* Second row - Professor */}
			<View className="pl-4 py-2">
				<Text className="text-black">Sir Clarenz Andrew Mauro</Text>
			</View>

			{/* Third row - Date & Time */}
			<View className="pl-4 py-2">
				<Text className="text-gray-600">Fri, Nov. 8 <Text style={{ color: '#b30000' }}>|</Text> 10:00 AM - 11:30 AM</Text>
			</View>
		</View>
	  </View>

	  {/* organization */}
	  <View className="items-center py-2">
		<View
			style={{
			width: "100%",
			flexShrink: 0,
			backgroundColor: '#fff',
			shadowColor: 'rgba(48, 48, 48, 0.20)',
			shadowOffset: { width: 0, height: 0 },
			shadowRadius: 15,
			shadowOpacity: 1,
			elevation: 15,
			paddingVertical: 16,
			}}
			className="justify-between"
		>
			{/* First row - Header + See more */}
			<View className="flex-row justify-between items-center px-4 w-full">
				<Text className="text-xl font-bold text-black">Organization</Text>
				<TouchableOpacity>
					<Text className="text-red-600 font-medium">See more</Text>
				</TouchableOpacity>
			</View>

			{/* Organizations Gallery */}
			<View className="px-4 py-2">
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingRight: 80 }}
				>
					{['CICS', 'COE', 'CAFAD', 'CONAHS'].map((org, index) => (
						<View
							key={org}
							style={{
								width: 100,
								height: 100,
								borderRadius: 15,
								backgroundColor: '#b30000',
								marginRight: index < 3 ? 12 : 0,
								justifyContent: 'center',
								alignItems: 'center',
								shadowColor: 'rgba(48, 48, 48, 0.20)',
								shadowOffset: { width: 0, height: 2 },
								shadowRadius: 8,
								shadowOpacity: 1,
								elevation: 8,
							}}
						>
							<Text className="text-white text-lg font-bold">{org}</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	  </View>

	  {/* news */}
	  <View className="items-center py-2">
		<View
			style={{
			width: "100%",
			flexShrink: 0,
			backgroundColor: '#fff',
			shadowColor: 'rgba(48, 48, 48, 0.20)',
			shadowOffset: { width: 0, height: 0 },
			shadowRadius: 15,
			shadowOpacity: 1,
			elevation: 15,
			paddingVertical: 16,
			}}
			className="justify-between"
		>
			{/* First row - Header + See more */}
			<View className="flex-row justify-between items-center px-4 w-full">
				<Text className="text-xl font-bold text-black">News</Text>
				<TouchableOpacity>
					<Text className="text-red-600 font-medium">See more</Text>
				</TouchableOpacity>
			</View>

			{/* News Gallery */}
			<View className="px-4 py-2">
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingRight: 80 }}
				>
					{['News 1', 'News 2', 'News 3'].map((news, index) => (
						<View
							key={news}
							style={{
								width: 200,
								height: 150,
								borderRadius: 15,
								backgroundColor: '#b30000',
								marginRight: index < 3 ? 12 : 0,
								justifyContent: 'flex-end',
								alignItems: 'flex-start',
								padding: 12,
								shadowColor: 'rgba(48, 48, 48, 0.20)',
								shadowOffset: { width: 0, height: 2 },
								shadowRadius: 8,
								shadowOpacity: 1,
								elevation: 8,
							}}
						>
							<Text className="text-white text-lg font-bold">{news}</Text>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	  </View>
    </ScrollView>
  );
}
