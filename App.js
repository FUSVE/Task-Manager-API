import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'http://192.168.68.105:5001/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar tarefas');
    }
  };

  const handleAddOrEdit = async () => {
    if (!taskText.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { task: taskText });
        Alert.alert('Sucesso', 'Tarefa atualizada');
      } else {
        await axios.post(API_URL, { task: taskText });
        Alert.alert('Sucesso', 'Tarefa adicionada');
      }
      setTaskText('');
      setEditingId(null);
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    }
  };

  const handleEdit = (task) => {
    setTaskText(task.task);
    setEditingId(task.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert('Sucesso', 'Tarefa excluída');
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a tarefa');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text>{item.task}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="pencil" onPress={() => handleEdit(item)} />
        <IconButton icon="delete" iconColor="#d00" onPress={() => handleDelete(item.id)} />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Tarefas</Text>

      <TextInput
        label={editingId ? "Editar tarefa" : "Nova tarefa"}
        value={taskText}
        onChangeText={setTaskText}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleAddOrEdit}
        style={styles.button}
      >
        {editingId ? "Salvar Edição" : "Adicionar"}
      </Button>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: { marginBottom: 10 }
});
