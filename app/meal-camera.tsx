import { useState, useRef, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export default function MealCameraScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mealType?: string }>();
  const mealType = (params.mealType as MealType) || "lunch";
  
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const cameraRef = useRef<CameraView>(null);

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
  };

  // Request permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.error("Failed to capture photo:", error);
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
      }
    }
  };

  const handlePickImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Failed to pick image:", error);
      Alert.alert("오류", "사진 선택에 실패했습니다.");
    }
  };

  const handleRetake = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Navigate to tag confirmation screen with the image
    router.push({
      pathname: "/meal-tags",
      params: {
        imageUri: capturedImage,
        mealType: mealType,
      },
    });
  };

  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  // Show permission request screen
  if (!permission) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-base text-muted text-center">
            카메라 권한을 확인하고 있습니다...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View className="flex-1 justify-center items-center p-6">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${colors.warning}20` }}
          >
            <Text className="text-4xl">📷</Text>
          </View>
          <Text className="text-xl font-bold text-foreground text-center mb-2">
            카메라 권한이 필요합니다
          </Text>
          <Text className="text-base text-muted text-center mb-6">
            식사 사진을 촬영하려면{"\n"}카메라 접근 권한을 허용해주세요.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.permissionButton,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text className="text-white font-semibold">권한 허용하기</Text>
          </Pressable>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text className="text-muted">취소</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // Show captured image preview
  if (capturedImage) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: capturedImage }}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />
        
        {/* Header */}
        <View 
          className="absolute left-0 right-0 flex-row justify-between items-center px-4"
          style={{ top: insets.top + 10 }}
        >
          <Pressable
            onPress={handleRetake}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text className="text-white font-medium">다시 찍기</Text>
          </Pressable>
          <View className="bg-black/50 px-3 py-1.5 rounded-full">
            <Text className="text-white font-medium">
              {mealTypeLabels[mealType]} 기록
            </Text>
          </View>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text className="text-white font-medium">취소</Text>
          </Pressable>
        </View>

        {/* Bottom Actions */}
        <View 
          className="absolute left-0 right-0 px-6"
          style={{ bottom: insets.bottom + 20 }}
        >
          <Pressable
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.confirmButton,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text className="text-white text-lg font-semibold">
              이 사진으로 기록하기
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Show camera view
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      >
        {/* Header */}
        <View 
          className="absolute left-0 right-0 flex-row justify-between items-center px-4"
          style={{ top: insets.top + 10 }}
        >
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text className="text-white font-medium">취소</Text>
          </Pressable>
          <View className="bg-black/50 px-3 py-1.5 rounded-full">
            <Text className="text-white font-medium">
              {mealTypeLabels[mealType]} 기록
            </Text>
          </View>
          <View style={{ width: 50 }} />
        </View>

        {/* Guide Frame */}
        <View className="flex-1 justify-center items-center">
          <View 
            className="w-72 h-72 border-2 border-white/50 rounded-3xl"
            style={{ borderStyle: "dashed" }}
          />
          <Text className="text-white/70 text-sm mt-4">
            음식을 프레임 안에 맞춰주세요
          </Text>
        </View>

        {/* Bottom Controls */}
        <View 
          className="absolute left-0 right-0 px-6"
          style={{ bottom: insets.bottom + 20 }}
        >
          <View className="flex-row justify-between items-center">
            {/* Gallery Button */}
            <Pressable
              onPress={handlePickImage}
              style={({ pressed }) => [
                styles.sideButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text className="text-2xl">🖼️</Text>
              <Text className="text-white text-xs mt-1">갤러리</Text>
            </Pressable>

            {/* Capture Button */}
            <Pressable
              onPress={handleCapture}
              style={({ pressed }) => [
                styles.captureButton,
                pressed && styles.captureButtonPressed,
              ]}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>

            {/* Flip Camera Button */}
            <Pressable
              onPress={() => setFacing(f => f === "back" ? "front" : "back")}
              style={({ pressed }) => [
                styles.sideButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text className="text-2xl">🔄</Text>
              <Text className="text-white text-xs mt-1">전환</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  sideButton: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
});
