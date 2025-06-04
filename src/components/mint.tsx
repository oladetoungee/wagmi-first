import * as React from 'react'
import { 
  type BaseError,
  useWaitForTransactionReceipt, 
  useWriteContract,
  useReadContract,
  useAccount
} from 'wagmi'
import { abi } from './abi'
import { parseEther, formatEther } from 'viem'
 
export function Mint() {
  const { address: userAddress } = useAccount()
  const { 
    data: hash,
    error,
    isPending, 
    writeContract 
  } = useWriteContract() 

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: '0x3073fb9bcc612939157a714c24bc4d46a3d64ae8',
    abi,
    functionName: 'balanceOf',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  })

  // Debug logging for balance
  React.useEffect(() => {
    if (balance) {
      const rawBalance = balance.toString()
      // Convert to tokens by dividing by 10^18
      const tokenAmount = formatEther(balance as bigint)
      console.log('Raw balance:', rawBalance)
      console.log('Token amount:', tokenAmount, 'GRC')
    }
  }, [balance])

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const address = formData.get('address') as string
    const amount = formData.get('amount') as string
    
    // Convert amount to ether
    const amountInEther = parseEther(amount)
    
    console.log('Minting amount:', {
      input: amount,
      inEther: amountInEther.toString(),
      formatted: formatEther(amountInEther)
    })

    try {
      await writeContract({
        address: '0x3073fb9bcc612939157a714c24bc4d46a3d64ae8',
        abi,
        functionName: 'mint',
        args: [address, amountInEther],
        value: parseEther("1"),
      })
      // Reset form after successful write
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error minting:', error)
    }
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  // Refetch balance when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
    }
  }, [isConfirmed, refetchBalance])

  const formattedBalance = balance 
    ? Number(formatEther(balance as bigint)).toLocaleString(undefined, {
        maximumFractionDigits: 4,
        minimumFractionDigits: 0
      })
    : '0'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        Mint Tokens
      </h2>

      {userAddress && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700">Your GRC Token Balance:</p>
          <p className="text-lg font-semibold text-gray-900">
            {formattedBalance} tokens
          </p>
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input 
            id="address"
            name="address" 
            placeholder="0xA0Cf…251e" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm text-black"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (in ETH)
          </label>
          <input 
            id="amount"
            name="amount" 
            placeholder="1" 
            required 
            step="1"
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
          />
        </div>
        
        <button 
          disabled={isPending || isConfirming} 
          type="submit"
          className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Mint'} 
        </button>
      </form>
      
      {/* Status Messages */}
      <div className="space-y-3 mt-6">
        {hash && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800 mb-1">Transaction Hash:</p>
            <p className="text-xs font-mono text-blue-600 break-all">{hash}</p>
          </div>
        )}
        
        {isConfirming && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Waiting for confirmation...
            </p>
          </div>
        )}
        
        {isConfirmed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 flex items-center">
              <svg className="mr-2 h-4 w-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Transaction confirmed! 
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 mb-1">Error:</p>
            <p className="text-sm text-red-600">
              {(error as BaseError).shortMessage || error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}