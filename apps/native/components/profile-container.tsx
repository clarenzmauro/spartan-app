import { Text, View, TouchableOpacity, Image, Modal, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import type { Id } from "../../../packages/backend/convex/_generated/dataModel";
import { useRouter } from "expo-router";

export default function ProfileContainer() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showLockedSkillModal, setShowLockedSkillModal] = useState(false);
  const [lockedSkillMessage, setLockedSkillMessage] = useState("");
  const [showDailiesModal, setShowDailiesModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [isEventActive, setIsEventActive] = useState(true); // Change to false to disable event
  const [matchmakingId, setMatchmakingId] = useState<Id<"matchmaking"> | null>(null);

  // Generate a unique user ID for testing (in production, use actual authenticated user ID)
  const [testUserId] = useState(() => `user_${Math.random().toString(36).substring(2, 15)}`);

  // Player stats - these would come from your user data
  const playerStats = {
    userId: testUserId, // Using generated test user ID
    hpAmount: 100,
    atkAmount: 85,
    crtAmount: 72,
    defAmount: 65,
    spdAmount: 90,
    intAmount: 78,
  };

  // Convex mutations and queries
  const joinMatchmaking = useMutation(api.matchmaking.joinMatchmaking);
  const cancelMatchmaking = useMutation(api.matchmaking.cancelMatchmaking);
  const matchmakingStatus = useQuery(
    api.matchmaking.getMatchmakingStatus,
    matchmakingId ? { matchmakingId } : "skip"
  );

  // Handle battle button click
  const handleBattleClick = async () => {
    setShowBattleModal(true);
    
    try {
      const result = await joinMatchmaking(playerStats);
      setMatchmakingId(result.matchmakingId);
      
      if (result.status === "matched" && result.battleId) {
        // Battle found immediately - navigate right away
        console.log("Battle found immediately!", result.battleId);
        setShowBattleModal(false);
        router.push(`/(battle)/page?battleId=${result.battleId}`);
      }
    } catch (error) {
      console.error("Error joining matchmaking:", error);
      setShowBattleModal(false);
    }
  };

  // Handle cancel matchmaking
  const handleCancelMatchmaking = async () => {
    if (matchmakingId) {
      try {
        await cancelMatchmaking({ matchmakingId });
        setMatchmakingId(null);
      } catch (error) {
        console.error("Error cancelling matchmaking:", error);
      }
    }
    setShowBattleModal(false);
  };

  // Monitor matchmaking status for waiting players
  useEffect(() => {
    if (matchmakingStatus?.status === "matched" && matchmakingStatus.battleId) {
      console.log("Match found! Battle ID:", matchmakingStatus.battleId);
      setShowBattleModal(false);
      // Navigate both users to battle page
      router.push(`/(battle)/page?battleId=${matchmakingStatus.battleId}`);
    }
  }, [matchmakingStatus]);

  const showLockedSkill = (message: string) => {
    setLockedSkillMessage(message);
    setShowLockedSkillModal(true);
  };

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
        <View className="flex-row justify-between items-start w-full">
          {/* Character Image - Left */}
          <View className="flex-shrink">
            <Image
              source={
                gender === "male"
                  ? require("../../native/assets/images/male_1_cropped.png")
                  : require("../../native/assets/images/female_1_cropped.png")
              }
              className="w-64 h-96" // reduce a bit to allow text space
              resizeMode="contain"
            />
          </View>

          {/* Stats - Right */}
          <View className="flex-shrink items-end ml-2">
            {/* Stats Section */}
            <View className="mb-6 max-w-[75%]">
              <Text className="text-white font-bold mb-2 text-right" numberOfLines={1}>
                Stats:
              </Text>
              <Text className="text-white font-bold mb-2 text-right" numberOfLines={1}>
                Points: 0
              </Text>
              <View>
                <Text className="text-gray-300 text-sm text-right">HP: {playerStats.hpAmount}</Text>
                <Text className="text-gray-300 text-sm text-right">ATK: {playerStats.atkAmount}</Text>
                <Text className="text-gray-300 text-sm text-right">CRT: {playerStats.crtAmount}</Text>
                <Text className="text-gray-300 text-sm text-right">DEF: {playerStats.defAmount}</Text>
                <Text className="text-gray-300 text-sm text-right">SPD: {playerStats.spdAmount}</Text>
                <Text className="text-gray-300 text-sm text-right">INT: {playerStats.intAmount}</Text>
              </View>
            </View>

            {/* Skills Section */}
            <View className="max-w-[50%]">
              <Text className="text-white font-bold mb-2 text-right">Skills:</Text>
              <View className="gap-2">
                <View className="flex-row gap-2 justify-end">
                  <TouchableOpacity onPress={() => setShowSkillModal(true)} activeOpacity={0.7}>
                    <View className="w-10 h-10 bg-neutral-300 rounded" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showLockedSkill("Reach 2nd Year to unlock")} activeOpacity={0.7}>
                    <View className="w-10 h-10 bg-neutral-700 rounded opacity-50" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-2 justify-end">
                  <TouchableOpacity onPress={() => showLockedSkill("Reach 3rd Year to unlock")} activeOpacity={0.7}>
                    <View className="w-10 h-10 bg-neutral-700 rounded opacity-50" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showLockedSkill("Reach 4th Year to unlock")} activeOpacity={0.7}>
                    <View className="w-10 h-10 bg-neutral-700 rounded opacity-50" />
                  </TouchableOpacity>
                </View>
              </View>
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

      {/* Locked Skill Modal */}
      <Modal
        transparent={true}
        visible={showLockedSkillModal}
        animationType="fade"
        onRequestClose={() => setShowLockedSkillModal(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setShowLockedSkillModal(false)}
        >
          <View className="bg-neutral-800 rounded-xl p-6 mx-8 max-w-sm">
            <Text className="text-white font-bold text-lg mb-3">🔒 Skill Locked</Text>
            <Text className="text-gray-300 text-sm mb-4">
              {lockedSkillMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setShowLockedSkillModal(false)}
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
        <TouchableOpacity 
          className="bg-neutral-800 rounded-lg py-4 mb-2"
          onPress={handleBattleClick}
        >
          <Text className="text-white text-center font-bold text-lg">BATTLE</Text>
        </TouchableOpacity>

        {/* Dailies and Event Buttons Row */}
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="bg-neutral-800 rounded-lg py-4 flex-1"
            onPress={() => setShowDailiesModal(true)}
          >
            <Text className="text-white text-center font-bold text-lg">DAILIES</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`rounded-lg py-4 flex-1 ${isEventActive ? 'bg-neutral-800' : 'bg-gray-500'}`}
            onPress={() => isEventActive && setShowEventModal(true)}
            disabled={!isEventActive}
          >
            <Text className={`text-center font-bold text-lg ${isEventActive ? 'text-white' : 'text-gray-400'}`}>
              EVENT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dailies Modal */}
      <Modal
        transparent={true}
        visible={showDailiesModal}
        animationType="fade"
        onRequestClose={() => setShowDailiesModal(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setShowDailiesModal(false)}
        >
          <Pressable className="bg-neutral-800 rounded-xl p-6 mx-8 max-w-sm w-[90%] max-h-[70%]">
            <Text className="text-white font-bold text-xl mb-4">Daily Quests</Text>
            <ScrollView className="mb-4">
              <View className="space-y-5">
                <View className="bg-neutral-700 p-3 rounded-lg">
                  <Text className="text-white font-semibold mb-1">Complete 5 Battles</Text>
                  <Text className="text-gray-400 text-sm">Reward: 100 Gold</Text>
                  <Text className="text-green-400 text-xs mt-1">Progress: 3/5</Text>
                </View>
                <View className="bg-neutral-700 p-3 rounded-lg">
                  <Text className="text-white font-semibold mb-1">Train for 30 Minutes</Text>
                  <Text className="text-gray-400 text-sm">Reward: 50 XP</Text>
                  <Text className="text-green-400 text-xs mt-1">Progress: 15/30</Text>
                </View>
                <View className="bg-neutral-700 p-3 rounded-lg">
                  <Text className="text-white font-semibold mb-1">Defeat 10 Enemies</Text>
                  <Text className="text-gray-400 text-sm">Reward: Rare Item</Text>
                  <Text className="text-green-400 text-xs mt-1">Progress: 7/10</Text>
                </View>
                <View className="bg-neutral-700 p-3 rounded-lg">
                  <Text className="text-white font-semibold mb-1">Collect Daily Login Bonus</Text>
                  <Text className="text-gray-400 text-sm">Reward: 25 Gold</Text>
                  <Text className="text-yellow-400 text-xs mt-1">Available</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowDailiesModal(false)}
              className="bg-blue-500 rounded-lg py-3"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Event Modal */}
      <Modal
        transparent={true}
        visible={showEventModal}
        animationType="fade"
        onRequestClose={() => setShowEventModal(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setShowEventModal(false)}
        >
          <Pressable className="bg-neutral-800 rounded-xl p-6 mx-8 max-w-sm w-[90%] max-h-[70%]">
            <Text className="text-white font-bold text-xl mb-4">Special Events</Text>
            <ScrollView className="mb-4">
              <View className="space-y-3">
                <View className="bg-neutral-700 p-4 rounded-lg">
                  <Text className="text-yellow-400 font-bold mb-2">⚡ Lightning Tournament</Text>
                  <Text className="text-gray-300 text-sm mb-2">
                    Compete against other players in a series of battles. Top 10 players win exclusive rewards!
                  </Text>
                  <Text className="text-gray-400 text-xs">Ends in: 2 days 5 hours</Text>
                </View>
                <View className="bg-neutral-700 p-4 rounded-lg">
                  <Text className="text-purple-400 font-bold mb-2">🎁 Weekend Bonus</Text>
                  <Text className="text-gray-300 text-sm mb-2">
                    Earn double XP and rewards for all battles completed this weekend.
                  </Text>
                  <Text className="text-gray-400 text-xs">Ends in: 1 day 12 hours</Text>
                </View>
                <View className="bg-neutral-700 p-4 rounded-lg">
                  <Text className="text-red-400 font-bold mb-2">🔥 Boss Raid</Text>
                  <Text className="text-gray-300 text-sm mb-2">
                    Team up with others to defeat the legendary Fire Dragon. Legendary loot awaits!
                  </Text>
                  <Text className="text-gray-400 text-xs">Active now</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowEventModal(false)}
              className="bg-blue-500 rounded-lg py-3"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Battle Finding Modal */}
      <Modal
        transparent={true}
        visible={showBattleModal}
        animationType="fade"
        onRequestClose={handleCancelMatchmaking}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-neutral-800 rounded-xl p-8 mx-8 max-w-sm items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-white font-bold text-xl mt-6 mb-2">Finding Battle...</Text>
            {matchmakingStatus && (
              <Text className="text-gray-400 text-sm mb-6">
                Power Level: {Math.round(matchmakingStatus.powerLevel || 0)}
              </Text>
            )}
            <TouchableOpacity
              onPress={handleCancelMatchmaking}
              className="bg-red-500 rounded-lg py-3 px-8 w-full"
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
