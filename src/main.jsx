import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ArweaveWalletKit } from "@arweave-wallet-kit/react"

// 动态导入策略以避免 SSR 问题
const getStrategies = async () => {
  const strategies = [];
  
  try {
    const { default: WanderStrategy } = await import("@arweave-wallet-kit/wander-strategy");
    strategies.push(new WanderStrategy());
  } catch (error) {
    console.warn('WanderStrategy not available:', error);
  }
  
  try {
    const { default: WebWalletStrategy } = await import("@arweave-wallet-kit/webwallet-strategy");
    strategies.push(new WebWalletStrategy());
  } catch (error) {
    console.warn('WebWalletStrategy not available:', error);
  }
  
  // 只在浏览器环境中加载 BrowserWalletStrategy
  if (typeof window !== 'undefined') {
    try {
      const { default: BrowserWalletStrategy } = await import("@arweave-wallet-kit/browser-wallet-strategy");
      strategies.push(new BrowserWalletStrategy());
    } catch (error) {
      console.warn('BrowserWalletStrategy not available:', error);
    }
  }
  
  return strategies;
};

// 使用动态策略初始化
const initApp = async () => {
  const strategies = await getStrategies();
  
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
          strategies: strategies,
        }}
      >
        <App />
      </ArweaveWalletKit>
    </React.StrictMode>,
  )
};

// 初始化应用
initApp().catch(console.error);