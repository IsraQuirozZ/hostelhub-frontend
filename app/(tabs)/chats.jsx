import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { chatService } from "../../services/chat.service";
import { useRouter } from "expo-router";

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService
      .getMyChats()
      .then(setChats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="chatbubbles-outline"
          size={48}
          color={colors.text.muted}
        />
        <Text style={styles.emptyTitle}>No chats yet</Text>
        <Text style={styles.emptyText}>Book a hostel to join its chat</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => String(item.chat.id_chat)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const { chat } = item;
          const lastMsg = chat.mensajes?.[chat.mensajes.length - 1];
          const nombre =
            chat.tipo_chat === "ciudad"
              ? chat.ciudad?.nombre
              : chat.hostal?.nombre;

          return (
            <Pressable
              style={styles.chatItem}
              onPress={() => router.push(`/chat/${chat.id_chat}`)}
            >
              <View
                style={[
                  styles.avatar,
                  chat.tipo_chat === "ciudad"
                    ? styles.avatarCiudad
                    : styles.avatarHostal,
                ]}
              >
                <Ionicons
                  name={
                    chat.tipo_chat === "ciudad"
                      ? "globe-outline"
                      : "bed-outline"
                  }
                  size={22}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatNombre}>{nombre}</Text>
                  {lastMsg && (
                    <Text style={styles.chatTime}>
                      {new Date(lastMsg.fecha_envio).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short" },
                      )}
                    </Text>
                  )}
                </View>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatTipo}>
                    {chat.tipo_chat === "ciudad"
                      ? "🌍 City chat"
                      : "🏨 Hostel chat"}
                  </Text>
                </View>
                {lastMsg && (
                  <Text style={styles.lastMsg} numberOfLines={1}>
                    {lastMsg.usuario?.nombre}: {lastMsg.contenido}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
  list: { padding: 16, gap: 8 },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCiudad: { backgroundColor: colors.primary[500] },
  avatarHostal: { backgroundColor: colors.accent[500] },
  chatInfo: { flex: 1, gap: 3 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatNombre: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  chatTipo: { fontSize: 12, color: colors.text.muted },
  chatTime: { fontSize: 12, color: colors.text.muted },
  lastMsg: { fontSize: 13, color: colors.text.secondary },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
