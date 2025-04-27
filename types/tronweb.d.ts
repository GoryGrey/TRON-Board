interface TronWeb {
  defaultAddress: {
    base58: string
    hex: string
  }
  fullNode: {
    host: string
  }
  solidityNode: {
    host: string
  }
  eventServer: {
    host: string
  }
  trx: {
    getBalance: (address: string) => Promise<number>
  }
  request: (options: { method: string }) => Promise<any>
}

interface Window {
  tronWeb?: TronWeb
}
