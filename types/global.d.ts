interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string; params?: any[] }) => Promise<any>
  }
  tronWeb?: {
    defaultAddress: {
      base58: string
      hex: string
    }
    trx: {
      sign: (message: string) => Promise<string>
      verifySignature: (message: string, address: string, signature: string) => boolean
    }
    toHex: (message: string) => string
  }
}
