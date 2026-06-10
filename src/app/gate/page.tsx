import { Suspense } from 'react'
import Image from 'next/image'
import { GateForm } from './GateForm'
import styles from './page.module.css'

export default function GatePage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image
            src="/mirai.png"
            alt="Mirai"
            width={64}
            height={64}
            className={styles.logo}
            priority
          />
        </div>
        <h1 className={styles.brand}>mirai</h1>

        <Suspense fallback={<div style={{ height: 260 }} />}>
          <GateForm />
        </Suspense>
      </div>
    </div>
  )
}
