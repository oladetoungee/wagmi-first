import { kairos, kaia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';


export const config = getDefaultConfig({
  appName: 'wagmi-first',
  projectId: '057b1a38da4e68368a35540c401fadfd',
  chains: [kairos, kaia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// 0x3073fb9bcc612939157a714c24bc4d46a3d64ae8
// 
