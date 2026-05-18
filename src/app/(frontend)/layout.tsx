import { ThemeProvider } from '@/components/ThemeProvider'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
