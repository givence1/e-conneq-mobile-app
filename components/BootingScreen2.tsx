import { ResizeMode, Video } from "expo-av";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";

const BootingScreen2 = ({ onFinished }: any) => {
  const videoRef = useRef(null);

  const handlePlaybackStatus = (status: any) => {
    if (status.didJustFinish) {
      onFinished?.();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/booting.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatus}
      />
    </View>
  );
};

export default BootingScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});