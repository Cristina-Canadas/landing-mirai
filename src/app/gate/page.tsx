import { Suspense } from 'react'
import Image from 'next/image'
import heart from '@/assets/heart-mirai.png'
import logo from '@/assets/logo-mirai-go-sin-fondo.webp'
import { GateForm } from './GateForm'
import styles from './page.module.css'

export default function GatePage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image src={heart} alt="" height={68} quality={90} className={styles.heart} priority />
          <Image src={logo} alt="Mirai" height={48} quality={90} className={styles.logo} priority />
        </div>

        <Suspense fallback={<div style={{ height: 260 }} />}>
          <GateForm />
        </Suspense>
      </div>
    </div>
  )
}
