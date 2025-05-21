// app/page.tsx
export default function HomePage() {
  return (
    <div className="p-8 mt-8 text-center">
      <div className="retro-card crt-effect mx-auto max-w-5xl">
        <h1 className="text-4xl my-8 glitch" data-text="Welcome to the Dhyan App">
          Welcome to the Dhyan App
        </h1>
        <p className="mt-4 mb-8 text-xl">Let us build something cool.</p>
        <div className="mt-6 mb-4">
          <button className="retro-button mx-2">Get Started</button>
          <button className="retro-button mx-2">Learn More</button>
        </div>
      </div>
    </div>
  );
}