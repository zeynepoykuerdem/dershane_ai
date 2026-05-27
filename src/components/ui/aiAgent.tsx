' use client'

export default function AIAgent() {
    return (
        <div className="col-span-1 bg-white rounded-xl border p-4 flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-3">AI Agent</h2>
          
          {/* Zayıf Konu Önerileri */}
          <div className="bg-purple-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-medium text-purple-700 mb-2">Zayıf Konular</p>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600">• Matematik — Türev</span>
              <span className="text-xs text-gray-600">• Fizik — Elektrik</span>
            </div>
          </div>

          {/* Chat alanı */}
          <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="bg-purple-100 rounded-lg p-2 mb-2">
              <p className="text-xs text-purple-800">Merhaba! Matematik notun düşük, türev konusunu çalışmanı öneririm.</p>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Soru sor..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="bg-purple-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-purple-700">
              →
            </button>
          </div>
        </div>

     

    )
}