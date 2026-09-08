const KEY = 'threadly.address.v1'

export interface Address {
  label: string
  line: string
  city: string
}

export const DEFAULT_ADDRESS: Address = {
  label: 'Home',
  line: '128 Marlowe Street, Apt 4B',
  city: 'Brooklyn, NY 11201',
}

export function loadAddress(): Address {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Address
  } catch {
    /* ignore */
  }
  return DEFAULT_ADDRESS
}

export function saveAddress(a: Address): void {
  localStorage.setItem(KEY, JSON.stringify(a))
}
