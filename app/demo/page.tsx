import TypingEffect from '@/components/ui/typing-effect'

export default function DemoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-medium md:text-3xl">Let&apos;s</span>
        <TypingEffect
          texts={['Design', 'Development', 'Marketing']}
          className="!text-2xl !font-bold md:!text-3xl"
        />
      </div>
    </div>
  )
}
