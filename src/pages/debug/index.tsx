import { hexToU8a } from '@polkadot/util'
import { blake2AsU8a, encodeAddress, secp256k1Compress } from '@polkadot/util-crypto'
import { useState } from 'react'
import { hashMessage, recoverPublicKey } from 'viem'
import { useAccount, useSignMessage, useSignTypedData } from 'wagmi'

import { Button } from '@/components/ui/button'

const Debug = () => {
  const evmAddress = useAccount().address

  const message = 'Hello'
  const hashedMessage = hashMessage(message)
  const { data: messageSignature, signMessage } = useSignMessage({ message })
  const [evmPublicKey, setPublicKey] = useState<string | undefined>(undefined)
  const [subAddress, setSubAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (messageSignature) {
      recoverPublicKey({ hash: hashedMessage, signature: messageSignature }).then((recoveredPublicKey) => {
        setPublicKey(recoveredPublicKey)

        const compressedEvmPublicKey = secp256k1Compress(hexToU8a(recoveredPublicKey))
        const subAddressFromEvmPublicKey = encodeAddress(blake2AsU8a(compressedEvmPublicKey), 42)
        setSubAddress(subAddressFromEvmPublicKey)
      })
    }
  }, [hashedMessage, messageSignature])

  // All properties on a domain are optional
  const domain = {
    name: 'Substrate',
    version: '1',
    chainId: 0,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  } as const

  // The named list of all type definitions
  const types = {
    SubstrateCall: [
      { name: 'who', type: 'string' },
      { name: 'callData', type: 'bytes' },
      { name: 'nonce', type: 'uint64' },
    ],
  } as const

  const payload = {
    who: subAddress as string,
    callData: '0x00071448656c6c6f', // system.remarkWithEvent("Hello")
    nonce: BigInt('0'),
  } as const

  const { data, isError, isLoading, isSuccess, signTypedData } = useSignTypedData({
    domain,
    message: payload,
    primaryType: 'SubstrateCall',
    types,
  })

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
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Substrate address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{subAddress}</dd>
          </div>
        </dl>
      </div>

      <div>
        <button disabled={isLoading} onClick={() => signTypedData()}>
          Sign typed data
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  )
}

export default Debug
