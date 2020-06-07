import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import styles from './style'
import api from '../../services/api'

interface RouteParams {
  point_id: number
}

interface Point {
  id: number
  name: string
  email: string
  whatsapp: string
  city: string
  uf: string
  image: string
  items: {
    title: string
  }[]
}

const Detail = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as RouteParams

  const [point, setPoint] = useState<Point>({} as Point)

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(({ data }) => setPoint(data))
  }, [])

  const handleNavigationBack = () => {
    navigation.goBack()
  }

  const handleMail = () => {
    Linking.openURL(
      'mailto:dimasalpaiva@gmail.com?subject=Contato via e-coleta&body=Olá :D\n\nAchei vocês no e-coleta!',
    )
  }

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=553598667352&text=Olá :D\nAchei vocês no e-coleta!`,
    )
  }

  if (!point.id) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigationBack}>
            <Icon name="arrow-left" size={24} color="#34cb79" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: point.image,
          }}
        />
        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>
          {point.items.map((item) => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {`${point.city}, ${point.uf}`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => handleWhatsapp()}>
          <FontAwesome name="whatsapp" size={20} color="#EAEAEA" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={() => handleMail()}>
          <Icon name="mail" size={20} color="#EAEAEA" />
          <Text style={styles.buttonText}>e-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail
