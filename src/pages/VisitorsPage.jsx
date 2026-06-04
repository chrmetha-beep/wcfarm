import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const VisitorsPage = ({ supabase }) => {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'เข้า',
    date: new Date().toISOString().split('T')[0],
    time: '',
    note: '',
  })

  const columns = [
    { key: 'date', label: 'วันที่', width: '100px' },
    { key: 'name', label: 'ชื่อ', width: '150px' },
    { key: 'role', label: 'ตำแหน่ง', width: '150px' },
    { key: 'type', label: 'ประเภท', width: '100px', render: (val) => (
      <span style={{ color: val === 'เข้า' ? '#2ecc71' : '#e74c3c' }}>{val}</span>
    )},
    { key: 'time', label: 'เวลา', width: '80px' },
    { key: 'note', label: 'หมายเหตุ', width: '200px' },
  ]

  const fetchVisitors = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('visitors').select('*').order('date', { ascending: false })
      if (error) throw error
      setVisitors(data || [])
    } catch (error) {
      console.error('Error fetching visitors:', error)
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [supabase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      alert('ไม่พบการตั้งค่า Supabase')
      return
    }

    try {
      const { error } = await supabase.from('visitors').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({
        name: '',
        role: '',
        type: 'เข้า',
        date: new Date().toISOString().split('T')[0],
        time: '',
        note: '',
      })
      setIsModalOpen(false)
      fetchVisitors()
    } catch (error) {
      console.error('Error:', error)
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบ?')) return
    if (!supabase) return

    try {
      const { error } = await supabase.from('visitors').delete().eq('id', id)
      if (error) throw error
      alert('ลบสำเร็จ')
      fetchVisitors()
    } catch (error) {
      console.error('Error:', error)
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  if (!supabase) {
    return (
      <div className="page">
        <div className="alert alert-warning">⚠️ ไม่พบการตั้งค่า Supabase</div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 บันทึกผู้เข้าออก</h1>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + เพิ่มบันทึก
          </button>
        </div>
      </div>

      <div className="list-section">
        <DataTable
          columns={columns}
          data={visitors}
          loading={loading}
          onDelete={handleDelete}
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        title="เพิ่มบันทึกผู้เข้าออก"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>ชื่อ *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>ตำแหน่ง</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>ประเภท *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="เข้า">เข้า</option>
              <option value="ออก">ออก</option>
            </select>
          </div>
          <div className="form-group">
            <label>วันที่ *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>เวลา</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>หมายเหตุ</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows="3"
          />
        </div>
      </FormModal>
    </div>
  )
}

export default VisitorsPage
