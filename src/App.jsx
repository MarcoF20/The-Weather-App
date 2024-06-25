import { useEffect, useRef, useState } from 'react'

const API_KEY = 'c99da226c57c3302be5614c0e588cc2e'
const geoCodingResponse = async (city) => {
  try {
    const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`
    const response = await fetch(geoCodingUrl)
    const data = await response.json()
    const { lat, lon } = data[0]
    return { lat, lon }
  } catch (e) {
    return e
  }
}

function App () {
  const [city, setCity] = useState('')
  const [temperature, setTemperature] = useState(null)
  const fetchWeather = async (latitude, longitude) => {
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    const response = await fetch(weatherAPIUrl)
    const data = await response.json()
    const temp = Math.round(data.main.temp)
    setTemperature(temp)
  }
  const firstUpdate = useRef(true)
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    async function fetchCoordinates () {
      const { lat, lon } = await geoCodingResponse(city)
      if (lat === undefined || lon === undefined) {
        return console.log('something went wrong')
      }
      console.log(lat + ' ' + lon)
      fetchWeather(lat, lon)
    }
    fetchCoordinates()
  }, [city])
  const cityRef = useRef()
  const handleSubmit = (event) => {
    event.preventDefault()
    setCity(cityRef.current.value)
  }
  return (
    <>
      <h1>The Weather App</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your location
          <input type='text' ref={cityRef} />
        </label>
        <input type='submit' value='Enter' />
      </form>
      {
        city != null ? <h1>{city}</h1> : null
      }
      {
        temperature != null ? <h1>Current temperature is {temperature}</h1> : null
      }
    </>
  )
}

export default App
