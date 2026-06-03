import { TouchableOpacity, Image, StyleSheet, Alert, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'

const AVATAR_KEY = 'user_avatar'
const GIRL_AVATAR = '👧'
const BOY_AVATAR = '👦'

export default function AvatarButton() {
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    AsyncStorage.getItem(AVATAR_KEY).then((val) => {
      if (val) setAvatar(val)
    })
  }, [])

  async function pickOwnPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('We hebben toegang tot je galerij nodig.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) {
      const uri = result.assets[0].uri
      setAvatar(uri)
      AsyncStorage.setItem(AVATAR_KEY, uri)
    }
  }

  function chooseAvatar() {
    Alert.alert('Kies een avatar', '', [
      {
        text: '👧 Meisje',
        onPress: () => {
          setAvatar(GIRL_AVATAR)
          AsyncStorage.setItem(AVATAR_KEY, GIRL_AVATAR)
        },
      },
      {
        text: '👦 Jongen',
        onPress: () => {
          setAvatar(BOY_AVATAR)
          AsyncStorage.setItem(AVATAR_KEY, BOY_AVATAR)
        },
      },
      { text: '📷 Eigen foto', onPress: pickOwnPhoto },
      { text: 'Annuleer', style: 'cancel' },
    ])
  }

  const isPhoto = avatar && avatar.startsWith('/')

  return (
    <TouchableOpacity style={styles.button} onPress={chooseAvatar}>
      {isPhoto ? (
        <Image source={{ uri: avatar }} style={styles.photo} />
      ) : (
        <Text style={styles.emoji}>{avatar ?? '👤'}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  emoji: {
    fontSize: 20,
  },
})
