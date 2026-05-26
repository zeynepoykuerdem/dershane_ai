export default function Home (){
  return (
    <main>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-white text-lg font-bold">Studiee AI</a>
          <div>
            <a href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>
            <a href="/signup" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</a>
          </div>
        </div>
      </nav>
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Studiee AI</h1>
          <p className="text-lg text-gray-700 mb-8">Your personalized learning assistant for better education</p>
        </div>
      </section>
    </main>
  )

}