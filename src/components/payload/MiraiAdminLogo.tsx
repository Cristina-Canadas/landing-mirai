import Image from 'next/image'
import heartMirai from '../../assets/heart-mirai.png'
import logoMirai from '../../assets/logo-mirai-go-sin-fondo.webp'

export function MiraiAdminLogo() {
  return (
    <span className="mirai-auth-brand" aria-label="Mirai">
      <Image
        src={heartMirai}
        alt=""
        width={52}
        height={52}
        priority
        className="mirai-auth-brand__heart"
      />
      <Image
        src={logoMirai}
        alt="Mirai"
        width={210}
        height={48}
        priority
        className="mirai-admin-logo mirai-auth-brand__logo"
      />
    </span>
  )
}
