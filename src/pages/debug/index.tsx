import { hashMessage, recoverPublicKey } from 'viem'
import { useAccount, useSignMessage } from 'wagmi'

import { Button } from '@/components/ui/button'

const Debug = () => {
  const evmAddress = useAccount().address

  const message = 'Hello'
  const hashedMessage = hashMessage(message)
  const { data: messageSignature, signMessage } = useSignMessage({ message })
  const [evmPublicKey, setPublicKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (messageSignature) {
      recoverPublicKey({ hash: hashedMessage, signature: messageSignature }).then(setPublicKey)
    }
  }, [hashedMessage, messageSignature])

  return (
    <div className="relative max-w-6xl min-h-[calc(100vh-8rem)] m-auto pt-16 justify-start">
      <div className="py-4 text-lg text-gray font-bold border-b">Debug</div>
      <Button onClick={(_e) => signMessage()}>Get public key</Button>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{evmAddress}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM raw message</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{message}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM hashed raw message</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{hashedMessage}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM message signature</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{messageSignature}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">EVM public key</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{evmPublicKey}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default Debug
