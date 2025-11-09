import { View, Text, TouchableOpacity, ScrollView, ImageBackground, Image } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import type { Id } from "../../../../packages/backend/convex/_generated/dataModel";

export default function BattlePage() {
  const { battleId } = useLocalSearchParams<{ battleId: string }>();
  const cleanupMatchmaking = useMutation(api.matchmaking.cleanupMatchmakingForBattle);
  
  useEffect(() => {
    if (battleId) {
      cleanupMatchmaking({ battleId: battleId as Id<"battles"> })
        .then((result) => console.log(`Cleaned up ${result.deleted} matchmaking entries`))
        .catch((error) => console.error("Error cleaning up matchmaking:", error));
    }
  }, [battleId]);
  
  const [battle, setBattle] = useState({
    player1: {
      userId: "You",
      gender: "male",
      currentHP: 85,
      hpAmount: 100,
      atkAmount: 85,
      crtAmount: 72,
      defAmount: 65,
      spdAmount: 90,
      intAmount: 78,
    },
    player2: {
      userId: "Opponent",
      gender: "female",
      currentHP: 70,
      hpAmount: 100,
      atkAmount: 80,
      crtAmount: 68,
      defAmount: 60,
      spdAmount: 85,
      intAmount: 75,
    },
    currentTurn: "player1",
    turnCount: 3,
    battleLog: [
      { turn: 1, player: "player1", action: "attacked", damage: 15 },
      { turn: 2, player: "player2", action: "attacked", damage: 18 },
      { turn: 3, player: "player1", action: "defended", damage: 0 },
    ],
  });

  const isMyTurn = battle.currentTurn === "player1";

  const handleAttack = () => {
    console.log("Attack!");
  };

  const handleDefend = () => {
    console.log("Defend!");
  };

  const handleSkill = () => {
    console.log("Use Skill!");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash-screen/battle-bg.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40">
        <View className="flex-1 p-3">
          <View className="items-center mb-2 mt-4">
            <View className={`px-8 py-2 rounded-full ${isMyTurn ? 'bg-green-500' : 'bg-red-500'}`}>
              <Text className="text-white font-bold text-base">
                {isMyTurn ? "Your turn" : "Enemy's turn"}
              </Text>
            </View>
          </View>

          <View className="bg-gray-900/90 rounded-xl p-3 mb-3">
            <Text className="text-white font-bold text-sm mb-1">Battle logs</Text>
            {battle.battleLog.length > 0 && (
              <Text className="text-sm">
                <Text className={battle.battleLog[battle.battleLog.length - 1].player === "player1" ? "text-blue-400" : "text-red-400"}>
                  {battle.battleLog[battle.battleLog.length - 1].player === "player1" ? "You" : "Enemy"}
                </Text>
                <Text className="text-gray-300"> used {battle.battleLog[battle.battleLog.length - 1].action}</Text>
                {battle.battleLog[battle.battleLog.length - 1].damage && (
                  <Text className="text-yellow-400"> ({battle.battleLog[battle.battleLog.length - 1].damage} dmg)</Text>
                )}
              </Text>
            )}
          </View>

          <View className="flex-1 flex-row items-center justify-center gap-4 mb-3">
            <View className="items-center" style={{ transform: [{ scale: isMyTurn ? 1.2 : 1 }] }}>
              <Image
                source={require("../../assets/images/male-character/male_4_cropped.png")}
                className="w-32 h-44"
                resizeMode="contain"
              />
            </View>

            <View className="items-center" style={{ transform: [{ scale: !isMyTurn ? 1.2 : 1 }] }}>
              <Image
                source={require("../../assets/images/female-character/female_4_cropped.png")}
                className="w-32 h-44"
                resizeMode="contain"
              />
            </View>
          </View>

          <View>
            <View className="bg-red-900/90 rounded-xl p-3 border-2 border-red-700">
              <Text className="text-red-300 font-bold text-sm mb-2">
                {isMyTurn ? "Your Stats" : "Enemy Stats"}
              </Text>
              
              {(() => {
                const currentPlayer = isMyTurn ? battle.player1 : battle.player2;
                return (
                  <>
                    <View className="mb-2">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-white text-xs font-bold">HP</Text>
                        <Text className="text-white text-xs font-bold">
                          {currentPlayer.currentHP}/{currentPlayer.hpAmount}
                        </Text>
                      </View>
                      <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <View 
                          className={`h-full ${isMyTurn ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(currentPlayer.currentHP / currentPlayer.hpAmount) * 100}%` }}
                        />
                      </View>
                    </View>

                    <View className="flex-row justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-gray-200 text-xs">ATK: {currentPlayer.atkAmount}</Text>
                        <Text className="text-gray-200 text-xs">CRT: {currentPlayer.crtAmount}</Text>
                        <Text className="text-gray-200 text-xs">SPD: {currentPlayer.spdAmount}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-200 text-xs">DEF: {currentPlayer.defAmount}</Text>
                        <Text className="text-gray-200 text-xs">INT: {currentPlayer.intAmount}</Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2 items-center">
                      <View className="flex-row gap-1 flex-1">
                        <TouchableOpacity 
                          className="flex-1 h-12 bg-purple-700 rounded border border-purple-400 justify-center items-center"
                          disabled={!isMyTurn}
                          onPress={handleSkill}
                        >
                          <Text className="text-white text-xs font-bold">S1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 h-12 bg-gray-700 rounded border border-gray-500 opacity-50 justify-center items-center"
                          disabled={true}
                        >
                          <Text className="text-gray-400 text-xs"></Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 h-12 bg-gray-700 rounded border border-gray-500 opacity-50 justify-center items-center"
                          disabled={true}
                        >
                          <Text className="text-gray-400 text-xs"></Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 h-12 bg-gray-700 rounded border border-gray-500 opacity-50 justify-center items-center"
                          disabled={true}
                        >
                          <Text className="text-gray-400 text-xs"></Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={handleAttack}
                        disabled={!isMyTurn}
                        className={`px-4 h-12 rounded border-2 justify-center items-center ${
                          isMyTurn 
                            ? 'bg-gray-700 border-gray-400' 
                            : 'bg-gray-800 border-gray-600 opacity-50'
                        }`}
                      >
                        <Text className={`font-bold text-xs ${isMyTurn ? 'text-white' : 'text-gray-500'}`}>
                          Attack
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
