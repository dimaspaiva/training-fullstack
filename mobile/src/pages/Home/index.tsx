import React, { useEffect, useState } from 'react'
import {
  ImageBackground,
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Home = () => {
  const navigation = useNavigation()

  const [isKeyboard, setIsKeyboard] = useState(false)
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide)

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow)
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide)
    }
  }, [])

  const handleKeyboardShow = () => {
    setIsKeyboard(true)
  }

  const handleKeyboardHide = () => {
    setIsKeyboard(false)
  }

  const handleNavigatePoints = () => {
    navigation.navigate('Points', { uf, city })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
          />
          <View>
            <Text
              style={[
                styles.title,
                isKeyboard ? { marginTop: 8, fontSize: 24 } : {},
              ]}
            >
              Seu market place de coleta de resíduos.
            </Text>
            <Text
              style={[
                styles.description,
                isKeyboard ? { display: 'none' } : {},
              ]}
            >
              Ajudamos pessoas a encontrarem pontos de coletas de forma
              eficiente!
            </Text>
          </View>
        </View>

        <View style={isKeyboard ? { marginBottom: -24 } : {}}>
          <TextInput
            style={styles.input}
            placeholder="Insira a UF"
            onChangeText={setUf}
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Insira sua Cidade"
            onChangeText={setCity}
            autoCorrect={false}
            value={city}
          />

          <RectButton
            style={[styles.button, isKeyboard ? { marginBottom: 0 } : {}]}
            onPress={handleNavigatePoints}
          >
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#EAEAEA" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home
