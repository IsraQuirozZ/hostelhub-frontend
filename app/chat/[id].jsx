import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { chatService } from "../../services/chat.service";
import { useAuth } from "../../hooks/useAuth";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);

  useEffect(() => {
    loadMessages();
    chatService.getMyChats().then((chats) => {
      const found = chats.find((c) => String(c.chat.id_chat) === String(id));
      if (found) setChatInfo(found.chat);
    });
  }, []);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await chatService.sendMessage(id, text.trim());
      setText("");
      await loadMessages();
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getChatName = () => {
    if (!chatInfo) return "Chat";
    return chatInfo.tipo_chat === "ciudad"
      ? chatInfo.ciudad?.nombre
      : chatInfo.hostal?.nombre;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.bottom}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.push("/chats")}>
          <Ionicons name="arrow-back" size={25} color={"#FFF"} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{getChatName()}</Text>
          <Text style={styles.headerSub}>
            {chatInfo?.tipo_chat === "ciudad"
              ? "🌍 City chat"
              : "🏨 Hostel chat"}
          </Text>
        </View>
        <Pressable onPress={loadMessages}>
          <Ionicons
            name="refresh-outline"
            size={22}
            color={colors.primary[500]}
          />
        </Pressable>
      </View>

      {/* Mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id_mensaje)}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons
              name="chatbubbles-outline"
              size={40}
              color={colors.text.muted}
            />
            <Text style={styles.emptyChatText}>
              No messages yet. Say hello!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMe = item.usuario?.nombre === user?.data?.nombre;
          return (
            <View style={[styles.msgWrapper, isMe && styles.msgWrapperMe]}>
              {!isMe && (
                <View style={styles.msgAvatar}>
                  <Text style={styles.msgAvatarText}>
                    {item.usuario?.nombre?.[0]?.toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={[styles.bubble, isMe && styles.bubbleMe]}>
                {!isMe && (
                  <Text style={styles.bubbleUser}>{item.usuario?.nombre}</Text>
                )}
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {item.contenido}
                </Text>
                <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
                  {new Date(item.fecha_envio).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={[styles.inputWrapper, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.muted}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendBtn,
            (!text.trim() || sending) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!text.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={18} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    gap: 12,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0000004a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
  headerSub: { fontSize: 12, color: colors.text.muted },
  messagesList: { padding: 16, gap: 12, flexGrow: 1 },
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 60,
  },
  emptyChatText: { fontSize: 14, color: colors.text.muted },
  msgWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  msgWrapperMe: { flexDirection: "row-reverse" },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  msgAvatarText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  bubble: {
    maxWidth: "75%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  bubbleMe: {
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },
  bubbleUser: { fontSize: 11, fontWeight: "700", color: colors.primary[500] },
  bubbleText: { fontSize: 14, color: colors.text.primary, lineHeight: 20 },
  bubbleTextMe: { color: "#FFFFFF" },
  bubbleTime: { fontSize: 10, color: colors.text.muted, alignSelf: "flex-end" },
  bubbleTimeMe: { color: "rgba(255,255,255,0.7)" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.background.light,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.text.muted },
});
