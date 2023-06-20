import { shorten } from '@did-network/dapp-sdk'
import { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { NetworkSwitcher } from '@/components/SwitchNetworks'
import { Button } from '@/components/ui/button'
import { WalletModal } from '@/components/WalletModal'

export const NavItem = ({ path, name, icon }: any) => {
  const location = useLocation()
  const isActive = path === '/' ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <NavLink
      target={path.startsWith('http') ? '_blank' : undefined}
      to={path}
      className={`w-24 mr-6 py-3 text-center text-sm font-semibold hover:text-primary no-underline`}
    >
      <div className={`flex-center rounded py-2 ${isActive ? 'text-primary' : 'text-text2 hover:text-text1 '}`}>
        {icon}
        <div className="ml-1">{name}</div>
      </div>
    </NavLink>
  )
}

export const Header = ({ action }: { action?: ReactNode }) => {
  const { address } = useAccount()

  const [show, setShow] = useState(false)

  const toggleModal = (e: boolean) => {
    setShow(e)
  }

  return (
    <div className="h-16 border-b-1 border-white box-border">
      <div className="max-w-6xl m-auto h-full flex justify-between items-center">
        <div className="flex items-center font-bold cursor-pointer">
          <Link className="text-xl" to="/">
            Playground
          </Link>
        </div>
        <div className="flex items-center">
          <NavItem path="/" name="Home" />
          <NavItem path="/debug" name="Debug" />
        </div>

        <div className="flex items-center gap-2">
          {action}

          <NetworkSwitcher />
          <WalletModal open={show} onOpenChange={toggleModal} close={() => setShow(false)}>
            {({ isLoading }) => (
              <Button className="flex items-center h-8 mr-4" size="sm">
                {isLoading && (
                  <span className="i-line-md:loading-twotone-loop inline-flex mr-1 w-4 h-4 text-white"></span>
                )}{' '}
                {address ? shorten(address) : 'Connect Wallet'}
              </Button>
            )}
          </WalletModal>
        </div>
      </div>
    </div>
  )
}
