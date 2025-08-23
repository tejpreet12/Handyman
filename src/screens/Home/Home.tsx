import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface Todo {
  id: number;
  imageUri: string | null;
  intValue: number;
  value: string;
}

const Home = () => {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const getTodos = async () => {
    const result = await db.getAllAsync<Todo>("SELECT * FROM todos");
    setTodos(result);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async (todo: string, intValue: number) => {
    await db.runAsync(
      "INSERT INTO todos (value, intValue) VALUES (?, ?)",
      todo,
      intValue
    );
  };

  const handleAddTodo = async () => {
    await addTodo(newTodo, Math.floor(Math.random() * 100));
    setNewTodo("");
    getTodos();
  };

  const deleteTodo = async (id: number) => {
    await db.runAsync("DELETE FROM todos WHERE id = ?", id);
    getTodos();
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          placeholder="Add Todo"
          style={styles.input}
          onChangeText={(text) => setNewTodo(text)}
          value={newTodo}
        />
        <Button title="Add Todo" onPress={handleAddTodo} />
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.value}</Text>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <MaterialIcons name="delete-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    width: 250,
    borderWidth: 1,
    marginRight: 15,
    borderRadius: 5,
    padding: 8,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
