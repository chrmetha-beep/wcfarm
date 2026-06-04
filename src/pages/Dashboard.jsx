import { useState, useEffect } from 'react'
import './Pages.css'

const Dashboard = ({ supabase }) => {
  const [stats, setStats] = useState({
    visitors: 0,
    medical: 0,
    feed: 0,
    issues: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const [visitorsData, medicalData, feedData, issuesData] = await Promise.all([
          supabase.from('visitors').select('*', { count: 'exact', head: true }),
          supabase.from('med_records').select('*', { count: 'exact', head: true }),
          supabase.from('feed_records').select('*', { count: 'exact', head: true }),
          supabase.from('issues').select('*', { count: 'exact', head: true }),
        ])

        setStats({
          visitors: visitorsData.count || 0,
          medical: medicalData.count || 0,
          feed: feedData.count || 0,
          issues: issuesData.count || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ fontSize: '2.5rem' }}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 แดชบอร์ด</h1>
      </div>

      {!supabase && (
        <div className="alert alert-warning">
          ⚠️ <strong>ไม่พบการตั้งค่า Supabase</strong><br />
          กรุณาตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ใน .env.local
        </div>
      )}

      {loading ? (
        <div className="alert alert-info">กำลังโหลด...</div>
      ) : (
        <div className="stats-grid">
          <StatCard
            title="บันทึกผู้เข้าออก"
            value={stats.visitors}
            icon="👥"
            color="#3498db"
          />
          <StatCard
            title="บันทึกยา/วัคซีน"
            value={stats.medical}
            icon="💉"
            color="#e74c3c"
          />
          <StatCard
            title="บันทึกอาหาร"
            value={stats.feed}
            icon="🌾"
            color="#f39c12"
          />
          <StatCard
            title="รายงานปัญหา"
            value={stats.issues}
            icon="⚠️"
            color="#c0392b"
          />
        </div>
      )}

      <div className="card mt-2">
        <div className="card-header">ℹ️ เกี่ยวกับระบบ</div>
        <p>วังเจ้าฟาร์ม - ระบบจัดการฟาร์มสุกร</p>
        <p>เวอร์ชัน: 1.0.0</p>
        <p>เทคโนโลยี: React + Vite + Supabase</p>
      </div>
    </div>
  )
}

export default Dashboard
