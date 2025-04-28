import { FaBell } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ลบ token
    navigate('/'); // เด้งกลับหน้า login
  };

  return (
    
    
    <div>
      <div className="mt-auto pt-6">
          <button 
            onClick={handleLogout} 
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
          >
            ออกจากระบบ
          </button>
        </div>
      <h2 className="text-2xl font-bold mb-6">แดชบอร์ด</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {["ลูกค้า", "พนักงาน", "ตำแหน่ง"].map((label, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{label} (คน)</p>
                <h3 className="text-2xl font-bold mt-1">
                  53,000 <span className="text-green-500 text-sm">+55%</span>
                </h3>
              </div>
              <FaBell className="text-blue-400 text-2xl" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-10">
        © 2025, Made with SmartCarePro
      </p>
    </div>
  );
}
