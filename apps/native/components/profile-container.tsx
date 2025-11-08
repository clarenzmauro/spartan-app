import { Text, View, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { useState } from "react";

export default function ProfileContainer() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showSkillModal, setShowSkillModal] = useState(false);

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

        {/* Character Image and Stats Row */}
        <View className="flex-row justify-between">
          {/* Character Image - Left */}
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

          {/* Stats - Right */}
          <View className="pr-2">
            {/* Stats Section */}
            <View className="mb-6">
              <Text className="text-white font-bold mb-2">Stats:</Text>
              <View className="space-y-1">
                <Text className="text-gray-300 text-sm">HP: 100</Text>
                <Text className="text-gray-300 text-sm">ATK: 85</Text>
                <Text className="text-gray-300 text-sm">CRT: 72</Text>
                <Text className="text-gray-300 text-sm">DEF: 65</Text>
                <Text className="text-gray-300 text-sm">SPD: 90</Text>
                <Text className="text-gray-300 text-sm">INT: 78</Text>
              </View>
            </View>

            {/* Special Skill Section */}
            <View>
              <Text className="text-white font-bold mb-2">Skill:</Text>
              <TouchableOpacity
                onPress={() => setShowSkillModal(true)}
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 bg-neutral-700 rounded" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Skill Description Modal */}
      <Modal
        transparent={true}
        visible={showSkillModal}
        animationType="fade"
        onRequestClose={() => setShowSkillModal(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setShowSkillModal(false)}
        >
          <View className="bg-neutral-800 rounded-xl p-6 mx-8 max-w-sm">
            <Text className="text-white font-bold text-lg mb-3">Lightning Strike</Text>
            <Text className="text-gray-300 text-sm mb-4">
              Deals massive damage to a single target with a powerful lightning attack. 
              Has a 30% chance to stun the enemy for 1 turn.
            </Text>
            <TouchableOpacity
              onPress={() => setShowSkillModal(false)}
              className="bg-blue-500 rounded-lg py-2"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

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
