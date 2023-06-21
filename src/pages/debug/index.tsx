import { recoverPublicKey } from 'viem'
import { useAccount, useBalance, useSignMessage, useWalletClient } from 'wagmi'

import { Button } from '@/components/ui/button'

const Debug = () => {
  const evmAddress = useAccount().address
  const evmBalance = useBalance({
    address: evmAddress,
  }).data
  const { data: evmWalletClient } = useWalletClient()

  // const rawMessage = 'Message to get the public key'
  // const { data: signedMessage } = useSignMessage({ message: rawMessage })
  // const evmPublicKey = recoverPublicKey({ hash: rawMessage, signature: signedMessage })

  const rawMessage = '0x00'
  const { data: signedMessage, signMessage } = useSignMessage({ message: rawMessage })

  const [publicKey, setPublicKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (signedMessage) {
      recoverPublicKey({ hash: rawMessage, signature: signedMessage }).then(setPublicKey)
    }
  }, [rawMessage, signedMessage])

  return (
    <div className="relative max-w-6xl min-h-[calc(100vh-8rem)] m-auto pt-16 justify-start">
      <div className="py-4 text-lg text-gray font-bold border-b">Debug</div>
      <Button onClick={(_e) => signMessage()}>Foo</Button>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{evmAddress}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM balance</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {evmBalance?.formatted} {evmBalance?.symbol}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM signed message</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{signedMessage}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM public key</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{publicKey}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default Debug
