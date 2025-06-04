import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Mint } from "./components/mint"

function App() {
  return (
    <div className="min-h-screen bg-slate-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Grazac Token Minter
          </h1>
          <p className="text-gray-600">
            Connect your wallet and mint GRC tokens
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <Mint />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App