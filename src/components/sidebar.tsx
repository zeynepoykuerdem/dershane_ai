"use client";
import Link from "next/link";
export default function Overview({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}) {
  //=== "teacher" ? "/dashboard/teacher" : "/dashboard/student";
  const base =
    role === " teacher"
      ? "/dashboard/teacher"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/student";
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="px-2 mb-6 mt-1">
            <span className="text-xl font-bold bg-neutral-secondary-soft hover:bg-neutral-secondary-hard">
              Studiee
            </span>
          </div>

          {/* Nav Links */}

          <ul className="space-y-1 font-medium flex-1">
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-white-600 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-purple-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
                  />
                </svg>
                <span className="ms-3">Ana Sayfa</span>
              </Link>
            </li>
            <li>
              <Link
                href={`${base}/homework`}
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-white-600 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-purple-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                  />
                </svg>
                <span className="ms-3">Ödevler</span>
              </Link>
            </li>
            <li>
              <Link
                href={`${base}/course`}
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-purple-600 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-purple-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                  />
                </svg>
                <span className="ms-3">Dersler</span>
              </Link>
            </li>

            {role === "student" && (
              <li>
                <Link
                  href={`${base}/exams`}
                  className="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-purple-600 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-purple-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                    />
                  </svg>
                  <span className="ms-3">Sınavlar</span>
                </Link>
              </li>
            )}

            {(role === "teacher" || role === "admin") && (
              <li>
                <Link
                  href={`/dashboard/${role}/students`}
                  className="flex items-center px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-purple-600 group"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 14.5001V11.4945C17 11.315 17 11.2253 16.9727 11.146C16.9485 11.076 16.9091 11.0122 16.8572 10.9592C16.7986 10.8993 16.7183 10.8592 16.5578 10.779L12 8.50006M4 9.50006V16.3067C4 16.6786 4 16.8645 4.05802 17.0274C4.10931 17.1713 4.1929 17.3016 4.30238 17.4082C4.42622 17.5287 4.59527 17.6062 4.93335 17.7612L11.3334 20.6945C11.5786 20.8069 11.7012 20.8631 11.8289 20.8853C11.9421 20.9049 12.0579 20.9049 12.1711 20.8853C12.2988 20.8631 12.4214 20.8069 12.6666 20.6945L19.0666 17.7612C19.4047 17.6062 19.5738 17.5287 19.6976 17.4082C19.8071 17.3016 19.8907 17.1713 19.942 17.0274C20 16.8645 20 16.6786 20 16.3067V9.50006M2 8.50006L11.6422 3.67895C11.7734 3.61336 11.839 3.58056 11.9078 3.56766C11.9687 3.55622 12.0313 3.55622 12.0922 3.56766C12.161 3.58056 12.2266 3.61336 12.3578 3.67895L22 8.50006L12.3578 13.3212C12.2266 13.3868 12.161 13.4196 12.0922 13.4325C12.0313 13.4439 11.9687 13.4439 11.9078 13.4325C11.839 13.4196 11.7734 13.3868 11.6422 13.3212L2 8.50006Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ms-3">Öğrenciler</span>
                </Link>
              </li>
            )}
          </ul>

          {/* İstatistikler */}
          <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              Özet
            </p>
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

          {/* Ayarlar */}
          <div className="border-t border-gray-200 pt-3 mt-4">
            <a
              href="#"
              className="flex items-center px-2 py-1.5 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-purple-600 group"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover:text-purple-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.707.536.535a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                />
              </svg>
              <span className="ms-3 text-sm">Ayarlar</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
