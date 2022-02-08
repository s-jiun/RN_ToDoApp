import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ToDo';

export default function App() {
  const [isWork, setIsWork] = useState(true);
  const [inputText, setInputText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {getData();}, []);

  const onPressWork = () => setIsWork(true);
  const onPressTravel = () => setIsWork(false);
  const storeDataAlert = () =>
    Alert.alert(
      "Error",
      "Can't store data",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Retry", onPress: () => storeToDos(toDos) }
      ]
    );

    const getDataAlert = () =>
    Alert.alert(
      "Error",
      "Can't read data",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Retry", onPress: () => getData }
      ]
    );
  
    const storeToDos = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch (e) {storeDataAlert}
  }
  
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      setToDos(JSON.parse(jsonValue))
    } catch(e) {getDataAlert }
  }

  const onSubmit = async () =>{
    const newToDo = {...toDos, [Date.now()]: {inputText, isWork}};
    setToDos(newToDo);
    await storeToDos(newToDo);
    setInputText("");
  }

  const deleteToDo = (key) => {
    Alert.alert(
      "Delete",
      "Sure to delete data?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", 
          onPress: () => {
          const newToDo = {...toDos}
          delete newToDo[key]
          setToDos(newToDo)
          storeToDos(newToDo)
        } }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressWork}><Text style={styles.title}>Work</Text></TouchableOpacity>
        <TouchableOpacity onPress={onPressTravel}><Text style={styles.title}>Travel</Text></TouchableOpacity>
      </View>
      <View>
        <TextInput 
          style={styles.input} 
          placeholder={isWork ? 'Type To Dos' : 'Type nation'}
          onChangeText={setInputText}
          value={inputText}
          onSubmitEditing={onSubmit}
          returnKeyType='done'
        />
      </View>
      <ScrollView>
        {isWork ? 
          Object.keys(toDos).map((key) => (
            toDos[key].isWork ? 
            <View key={key} style={styles.toDos}>
              <Text style={{color: 'white'}}>{toDos[key].inputText}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Ionicons name="trash" size={24} color="lightgrey" />
              </TouchableOpacity>
            </View> : null
          )) : 
          Object.keys(toDos).map((key) => (
            toDos[key].isWork ? null : 
            <View key={key} style={styles.toDos}>
              <Text style={{color: 'white'}}>{toDos[key].inputText}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Ionicons name="trash" size={24} color="lightgrey" />
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 70,
    paddingHorizontal: 40
  },
  title: {
    color: 'white',
    fontSize: 30
  }, 
  input:{
    borderColor: 'gray',
    borderWidth: 1,
    width: 380,
    backgroundColor: 'white',
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  toDos: {
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'dimgrey',
    marginTop: 25,
    borderRadius: 20,
    marginLeft: 13
  }
});
