import './Navigation.css'

const Navigation = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 แดชบอร์ด', icon: '📊' },
    { id: 'visitors', label: '👥 ผู้เข้าออก', icon: '👥' },
    { id: 'medical', label: '💉 ยา/วัคซีน', icon: '💉' },
    { id: 'feed', label: '🌾 อาหาร', icon: '🌾' },
    { id: 'issues', label: '⚠️ ปัญหา', icon: '⚠️' },
    { id: 'deliveries', label: '🚚 ส่งของ', icon: '🚚' },
    { id: 'contacts', label: '📞 ติดต่อ', icon: '📞' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <h1 className="navbar-title">🐷 วังเจ้าฟาร์ม</h1>
      </div>
      <ul className="navbar-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
