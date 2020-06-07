import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, Image, SafeAreaView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import geolocation from '@react-native-community/geolocation'

import api from '../../services/api'

import styles from './style'

interface Item {
  id: number
  title: string
  imageUrl: string
}

interface Point {
  id: number
  name: string
  image: string
  latitude: number
  longitude: number
}

interface Params {
  uf: string
  city: string
}

const Points = () => {
  const navigation = useNavigation()

  const route = useRoute()

  const routeParams = route.params as Params

  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [defaultPosition, setDefaultPosition] = useState<[number, number]>([
    0,
    0,
  ])
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    geolocation.getCurrentPosition((pos) => {
      setDefaultPosition([pos.coords.latitude, pos.coords.longitude])
    })
  }, [])

  useEffect(() => {
    api.get('/items').then(({ data }) => setItems(data))
  }, [])

  useEffect(() => {
    api
      .get('/points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then(({ data }) => setPoints(data))
  }, [selectedItems])

  const handleNavigationBack = () => {
    navigation.goBack()
  }

  const handleNavigateDetail = (id: number) => {
    navigation.navigate('Detail', { point_id: id })
  }

  const handleSelectItem = (id: number) => {
    if (!selectedItems.includes(id)) {
      return setSelectedItems([...selectedItems, id])
    }

    setSelectedItems(selectedItems.filter((it) => it !== id))
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>
          Encontre no mapa um lugar de coleta
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            loadingEnabled={defaultPosition[0] === 0}
            initialRegion={{
              latitude: defaultPosition[0],
              longitude: defaultPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              coordinate={{
                latitude: defaultPosition[0],
                longitude: defaultPosition[1],
              }}
            />

            {points.map((point) => (
              <Marker
                key={String(point.id)}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                onPress={() => handleNavigateDetail(point.id)}
              >
                <View style={styles.mapMarkerContainer}>
                  <Image
                    style={styles.mapMarkerImage}
                    source={{
                      uri: point.image,
                    }}
                  />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) && styles.selectedItem,
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.imageUrl} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Points
