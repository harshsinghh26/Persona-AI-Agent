import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Cyberpunk Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Neon Grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(90deg, #00ff88 1px, transparent 1px),
            linear-gradient(0deg, #00ff88 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>

        {/* Holographic Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full opacity-30 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-400 rounded-full opacity-35 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Data Streams */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-20 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-400" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-purple-400" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-pink-400" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-yellow-400" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <ChatInterface />
      </div>
    </main>
  )
}
