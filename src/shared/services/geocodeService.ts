import axios from "axios"

export interface GeocodeResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
  name: string
  address: {
    road?: string
    [key: string]: any
  }
}

const GEOCODE_API_BASE = "https://geocode.maps.co/search"

export const geocodeAddress = async (address: string): Promise<GeocodeResult[]> => {
  try {
    const apiKey = import.meta.env.VITE_GEOCODEMAP_API_KEY

    if (!apiKey) {
      console.error("Geocode API key not found in .env")
      return []
    }

    const response = await axios.get<GeocodeResult[]>(GEOCODE_API_BASE, {
      params: {
        q: address,
        api_key: apiKey
      },
      timeout: 5000
    })

    return response.data || []
  } catch (error) {
    console.error("Geocode API error:", error)
    return []
  }
}
