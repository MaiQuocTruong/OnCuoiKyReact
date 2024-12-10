import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [role, setRole] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImagePicker = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImageUri(URL.createObjectURL(file));
          setImageFile(file);
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageFile({
          uri: result.assets[0].uri,
          type: 'image/png',
          name: 'avatar.png',
        });
      }
    }
  };

  const handleSignUp = async () => {
    try {
      if (!username || !password || !email || !role || !imageUri) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      const data = new FormData();
      data.append('username', username);
      data.append('password', password);
      data.append('email', email);
      data.append('role', role);
      data.append('birthday', birthday.toISOString().split('T')[0]);
      if (imageFile) {
        data.append('avatar', imageFile);
      }

      const response = await axios.post('http://localhost:3000/users/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        alert('Thêm user thành công!');

        // Reset các trường dữ liệu
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('');
        setImageUri(null);
        setImageFile(null);

        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Lỗi khi thêm user:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <View style={[styles.inputContainer, { zIndex: 10 }]}>
        <Text style={styles.label}>Birthday</Text>
        <DatePicker
          selected={birthday}
          onChange={setBirthday}
          dateFormat="yyyy/MM/dd"
          customInput={<TextInput style={styles.input} />}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
        >
          <Picker.Item label="Select role" value="" />
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="User" value="User" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={styles.imagePickerText}>Upload Image</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  imagePickerButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default SignUp;
