'use client'
export default function Overview() {
 
    return (
        <div className="col-span-1 flex flex-col gap-4">

          <div className="bg-white rounded-xl border p-4">
            <h2 className="font-semibold text-gray-700 mb-3">Overview</h2>
            <div className="flex flex-col gap-3">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Ortalama Not</p>
                <p className="text-2xl font-bold text-purple-600">85</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Tamamlanan Ödev</p>
                <p className="text-2xl font-bold text-blue-600">12/15</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Devamsızlık</p>
                <p className="text-2xl font-bold text-green-600">2 gün</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 mt-auto">
            <a href="#" className="text-sm text-gray-500 hover:text-purple-600">⚙️ Ayarlar</a>
          </div>

          
        </div>

    )
}