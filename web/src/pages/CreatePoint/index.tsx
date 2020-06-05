import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { TileLayer, Marker, Map } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'

import api from '../../services/api'

import logo from '../../assets/logo.svg'

import './style.css'

interface Item {
  id: number
  imageUrl: string
  title: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [uf, setUf] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState<string>('0')
  const [selectedCity, setSelectedCity] = useState<string>('0')
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ])
  const [defaultPosition, setDefaultPosition] = useState<[number, number]>([
    0,
    0,
  ])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const history = useHistory()

  useEffect(() => {
    api.get('items').then(({ data }) => setItems(data))
  }, [])

  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(({ data }) => setUf(data.map((uf: any) => uf.sigla)))
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then(({ data }) => setCities(data.map((item: any) => item.nome)))
  }, [selectedUf])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      setDefaultPosition([latitude, longitude])
      setSelectedPosition([latitude, longitude])
    })
  }, [])

  const handleSelectUf = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(e.target.value) // select value = uf
  }

  const handleSelectCitie = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value) // select value = citie
  }

  const handleMapClick = (e: LeafletMouseEvent) => {
    setSelectedPosition([e.latlng.lat, e.latlng.lng])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      const newItems = selectedItems.filter((item) => item !== id)

      return setSelectedItems(newItems)
    }

    setSelectedItems([...selectedItems, id])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      uf: selectedUf,
      city: selectedCity,
      latitude: selectedPosition[0] || defaultPosition[0],
      longitude: selectedPosition[1] || defaultPosition[1],
      items: selectedItems,
    }

    await api.post('/points', data)

    alert('Ponto de coleta criado')
    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="e-coleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome Entidade</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">e-mail</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione um endereço no mapa</span>
          </legend>

          <Map center={defaultPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select
                onChange={handleSelectUf}
                value={selectedUf}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione seu estado</option>
                {uf.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>

              <select
                onChange={handleSelectCitie}
                name="city"
                id="city"
                value={selectedCity}
              >
                <option value="0">Selecione sua cidade</option>
                {cities.map((citie) => (
                  <option key={citie} value={citie}>
                    {citie}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={`${item.id}`}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.imageUrl} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export default CreatePoint
