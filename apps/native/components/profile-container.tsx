import { Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

export default function ProfileContainer() {
  const [gender, setGender] = useState<"male" | "female">("male");

  return (
    <View className="flex justify-center items-center flex-1 px-4 bg-red-100">
      {/* Black Container */}
      <View className="bg-black text-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 mb-4">
        {/* Gender Toggle - Top Right */}
        <View className="flex-row justify-end mb-4">
          <View className="flex-row bg-neutral-700 rounded-full p-1">
            <TouchableOpacity
              onPress={() => setGender("male")}
              className={`px-3 py-1 rounded-full ${gender === "male" ? "bg-blue-500" : ""}`}
            >
              <Text className="text-white font-semibold">♂</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender("female")}
              className={`px-3 py-1 rounded-full ${gender === "female" ? "bg-pink-500" : ""}`}
            >
              <Text className="text-white font-semibold">♀</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Character Image */}
        <View className="items-start">
          <Image
            source={
              gender === "male"
                ? require("../../native/assets/images/male_1_cropped.png")
                : require("../../native/assets/images/female_1_cropped.png")
            }
            className="w-72 h-96"
            style={{ transform: [{ scale: 1.2 }] }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Buttons Container */}
      <View className="w-full max-w-md">
        {/* Battle Button */}
        <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 mb-2">
          <Text className="text-white text-center font-bold text-lg">BATTLE</Text>
        </TouchableOpacity>

        {/* Dailies and Event Buttons Row */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 flex-1">
            <Text className="text-white text-center font-bold text-lg">DAILIES</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 flex-1">
            <Text className="text-white text-center font-bold text-lg">EVENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
