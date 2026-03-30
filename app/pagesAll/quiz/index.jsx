import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../constants/colors";

const questions = [
  {
    id: 1,
    type: "mcq",
    question: "What is the capital of Cameroon?",
    options: ["Yaoundé", "Douala", "Buea", "Bamenda"],
  },
  {
    id: 2,
    type: "structural",
    question: "Explain the difference between RAM and ROM.",
  },
];

export default function QuizTakingScreen() {
  const { id } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins for the quiz

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleMCQAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleTextAnswer = (text) => {
    setAnswers({ ...answers, [currentQuestion.id]: text });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    // Navigate or show confirmation
  };

  const renderQuestion = () => {
    if (currentQuestion.type === "mcq") {
      return currentQuestion.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.option,
            answers[currentQuestion.id] === opt && styles.selectedOption,
          ]}
          onPress={() => handleMCQAnswer(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ));
    } else {
      return (
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type your answer..."
          value={answers[currentQuestion.id] || ""}
          onChangeText={handleTextAnswer}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </Text>
        <Text style={styles.progress}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {renderQuestion()}
      </ScrollView>

      <View style={styles.navigation}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            <Text style={styles.navText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentIndex < questions.length - 1 ? (
          <TouchableOpacity onPress={goNext} style={styles.navBtn}>
            <Text style={styles.navText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  timer: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: "bold",
  },
  progress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  option: {
    padding: 12,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + "33",
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textInput: {
    minHeight: 100,
    backgroundColor: COLORS.inputBackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    textAlignVertical: "top",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
  },
  navText: {
    color: COLORS.white,
    marginHorizontal: 5,
    fontSize: 16,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});