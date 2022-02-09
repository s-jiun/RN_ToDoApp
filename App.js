import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

const STORAGE_KEY = '@ToDo';

export default function App() {
  const [isWork, setIsWork] = useState(true);
  const [inputText, setInputText] = useState("");
  const [toDos, setToDos] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [editKey, setEditKey] = useState(null);

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
      if(jsonValue){
        setToDos(JSON.parse(jsonValue))
      }
    } catch(e) {getDataAlert }
  }

  const onSubmit = async () =>{
    if(inputText === ""){
      return
    }
    const newToDo = {...toDos, [Date.now()]: {inputText, isWork}};
    setToDos(newToDo);
    await storeToDos(newToDo);
    setInputText("");
  }

  const deleteToDo = (key, toDos, setToDos, storeToDos) => {
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

  const edit = (key) => {
    setModalInput(toDos[key].inputText);
    setModalVisible(!modalVisible);
    setEditKey(key);
  }

  const onModalSubmit = () => {
    setModalVisible(!modalVisible);
    if(modalInput === ""){
      return
    };
    const newToDo = {...toDos};
    newToDo[editKey].inputText = modalInput;
    setToDos(newToDo);
    storeToDos(newToDo);
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
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.icon} onPress={() => edit(key)}>
                    <Ionicons name="pencil-outline" size={24} color="lightgrey" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.icon} onPress={() => deleteToDo(key)}>
                      <Ionicons name="trash" size={24} color="lightgrey" />
                  </TouchableOpacity>
                </View>
              </View> : null
            )) : 
            Object.keys(toDos).map((key) => (
              toDos[key].isWork ? null : 
              <View key={key} style={styles.toDos}>
                <Text style={{color: 'white'}}>{toDos[key].inputText}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.icon} onPress={() => edit(key)}>
                    <Ionicons name="pencil-outline" size={24} color="lightgrey" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.icon} onPress={() => deleteToDo(key)}>
                      <Ionicons name="trash" size={24} color="lightgrey" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
        }
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isWork ? 
            <Text style={styles.modalText}>Edit ToDo</Text> :
            <Text style={styles.modalText}>Edit Nation</Text>}
            <TextInput style={styles.modalInput} onChangeText={setModalInput} value={modalInput} onSubmitEditing={onModalSubmit}/>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
          </View>
      </Modal>
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
    width: '78%',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'dimgrey',
    marginTop: 25,
    borderRadius: 20,
    marginLeft: 13
  },
  icon:{
    marginLeft: 7
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "grey",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color:'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalInput: {
    borderWidth: 1,
    width: 100,
    borderRadius: 10,
    padding: 5,
    color: 'white',
    borderColor: 'white'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "lightsalmon",
    marginTop: 10
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
