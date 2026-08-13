export interface School {
  id: string
  npsn: string
  name: string
  stage: string
  status: string
  province: { id: number; name: string }
  city: { id: number; name: string }
  district: { id: number; name: string }
  street: string
  lat: number
  long: number
}
