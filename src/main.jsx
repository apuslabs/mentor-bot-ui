import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ArweaveWalletKit } from "@arweave-wallet-kit/react"
import WanderStrategy from "@arweave-wallet-kit/wander-strategy"
import BrowserWalletStrategy from "@arweave-wallet-kit/browser-wallet-strategy"
import WebWalletStrategy from "@arweave-wallet-kit/webwallet-strategy"
// 移除这行: import "@arweave-wallet-kit/styles"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [
          new WanderStrategy(),
          new BrowserWalletStrategy(),
          new WebWalletStrategy(),
        ],
      }}
    >
      <App />
    </ArweaveWalletKit>
  </React.StrictMode>,
)