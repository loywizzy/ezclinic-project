import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUserFriends,
  FaUserTie,
  FaLock,
  FaUserShield,
} from 'react-icons/fa';

export default function Layout() {
  const { pathname } = useLocation();

  const menu = [
    { to: 'dashboard', icon: <FaHome />, label: 'แดชบอร์ด' },
    { to: 'customers', icon: <FaUserFriends />, label: 'ลูกค้า' },
    { to: 'employees', icon: <FaUserTie />, label: 'พนักงาน' },
    { to: 'positions', icon: <FaLock />, label: 'ตำแหน่ง' },
    { to: 'permissions', icon: <FaUserShield />, label: 'สิทธิ์ผู้ใช้งาน' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-6 py-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">LOGO</h1>
          <nav className="space-y-4">
            {menu.map(({ to, icon, label }) => {
              const active = pathname === `/${to}`;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-2 text-sm font-semibold ${
                    active ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="text-xs text-gray-400">version 1.0.0</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
