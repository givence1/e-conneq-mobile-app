import { useAuthStore } from "@/store/authStore";
import { decodeUrlID } from "@/utils/functions";
import { EdgeDomain } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


function getRandomSet<T>(arr: T[], count: number, excludeIds: string[] = []) {
  const pool = arr.filter((a: any) => !excludeIds.includes(a.id));
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}



const CareerPathsCard = () => {
  const router = useRouter();
  const { language } = useAuthStore();

  const { data, loading, error } = useQuery<{ allDomains: { edges: EdgeDomain[] } }>(
    GET_DOMAINS, {
    variables: { language: language || "en" },
  });

  console.log(language);

  const [currentSet, setCurrentSet] = useState<EdgeDomain[]>([]);


  const lastIds = useRef<string[]>([]);

  // Slide animation value
  const slideX = useRef(new Animated.Value(0)).current;

  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      // Slide left (content moves off the screen)
      Animated.timing(slideX, {
        toValue: -350, // slide roughly one tile width
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // After slide out, reset instantly to right side
        slideX.setValue(350);

        // Update content WHILE off-screen
        if (data?.allDomains?.edges) {
          const initial = getRandomSet(data.allDomains.edges, 5);
          lastIds.current = initial.map(edge => edge.node.id);
          setCurrentSet(initial);
        }

        // Slide back into place
        Animated.timing(slideX, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [data]);

  const handleDomainPress = (domainId: number) => (e?: GestureResponderEvent) => {
    if (domainId > 0) {
      router.push({
        pathname: "/domain/carrier",
        params: { id: domainId },
      });
    }
  };

  const renderItem = ({ item }: { item: EdgeDomain }) => (
    <TouchableOpacity style={styles.tile} onPress={handleDomainPress(parseInt(decodeUrlID(item.node.id) || "") || 0)}>
      {/* <Text style={styles.icon}>{item.icon || "📁"}</Text> */}
      <Text style={styles.tileTitle}>{item.node.domainName}</Text>
      <Text style={styles.tagline} numberOfLines={2}>
        {/* {item.tagline} */}
      </Text>
    </TouchableOpacity>
  );

  console.log(loading);
  console.log(currentSet);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.heading}>Career Paths</Text>
        <Text style={styles.sub}>Explore different career domains</Text>
      </View>

      {/* Sliding container */}
      {loading ?
        <View>
          <ActivityIndicator />
        </View>
        :
        <Animated.View style={{ transform: [{ translateX: slideX }] }}>
          <FlatList
            data={currentSet}
            keyExtractor={(d) => d.node.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
          />
        </Animated.View>}
    </View>
  );
}

export default CareerPathsCard



const GET_DOMAINS = gql`
  query GetData(
    $language: String!
  ) {
    allDomains (
      language: $language
    ) {
      edges {
        node {
          id domainName
        }
      }
    }
  }
`;



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E9FFF3",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f5132",
  },
  sub: {
    fontSize: 13,
    color: "#0f5132",
    opacity: 0.85,
    marginTop: 4,
  },
  listContainer: {
    paddingVertical: 6,
  },
  tile: {
    width: 180,
    minHeight: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  tagline: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
});