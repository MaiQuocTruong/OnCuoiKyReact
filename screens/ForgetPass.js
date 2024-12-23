import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const ForgetPass = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (!email || !password || !confirmpassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (password !== confirmpassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    try {
        const response = await axios.put('http://localhost:3000/forgetpassword', {
            email,
            newPassword: password,
        });

        if (response.status === 200) {
            alert('Mật khẩu đã được cập nhật thành công!');
            navigation.goBack(); // Quay lại màn hình trước đó
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
            alert(error.response.data.error);
        } else {
            alert('Đã xảy ra lỗi khi cập nhật mật khẩu!');
        }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image95.png')}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Enter password again"
        value={confirmpassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    alignItems: 'center',
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingTop: 50, 
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#007AFF', 
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', 
    borderRadius: 10, 
    marginBottom: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff', 
    width: '100%',
  },
});

export default ForgetPass;
