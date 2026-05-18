import Image from 'next/image'
import heartMirai from '../../assets/heart-mirai.png'
import logoMirai from '../../assets/logo-mirai-go-sin-fondo.webp'

export function MiraiAdminIcon() {
  return (
    <span className="mirai-admin-icon" aria-label="Mirai">
      <Image
        src={heartMirai}
        alt=""
        width={28}
        height={28}
        className="mirai-admin-icon__heart"
        priority
      />
      <Image
        src={logoMirai}
        alt="Mirai"
        width={110}
        height={16}
        className="mirai-admin-icon__logo"
        priority
      />
    </span>
  )
}
