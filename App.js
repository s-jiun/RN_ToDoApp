import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [isWork, setIsWork] = useState(true);
  const [inputText, setInputText] = useState("");
  const [toDos, setToDos] = useState({});

  const onPressWork = () => setIsWork(true);
  const onPressTravel = () => setIsWork(false);
  const onSubmit = async () =>{
    const newToDo = {...toDos, [Date.now()]: {inputText, isWork}};
    setToDos(newToDo);
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
        {Object.keys(toDos).map((key) => (
          <Text key={key} style={{color: 'white'}}>{toDos[key].inputText}</Text>
        ))}
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
  }
});
