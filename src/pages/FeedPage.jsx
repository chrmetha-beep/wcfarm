import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const FeedPage = ({ supabase }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    feed_type: '',
    pen: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
  })

  const columns = [
    { key: 'date', label: 'วันที่', width: '100px' },
    { key: 'feed_type', label: 'ประเภท', width: '100px' },
    { key: 'pen', label: 'เล้า', width: '100px' },
    { key: 'amount', label: 'ปริมาณ', width: '100px' },
    { key: 'time', label: 'เวลา', width: '80px' },
  ]

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('feed_records').select('*').order('date', { ascending: false })
      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [supabase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) return

    try {
      const { error } = await supabase.from('feed_records').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({
        feed_type: '',
        pen: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
      })
      setIsModalOpen(false)
      fetchRecords()
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบ?')) return
    if (!supabase) return

    try {
      const { error } = await supabase.from('feed_records').delete().eq('id', id)
      if (error) throw error
      alert('ลบสำเร็จ')
      fetchRecords()
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  if (!supabase) {
    return <div className="page"><div className="alert alert-warning">⚠️ ไม่พบการตั้งค่า Supabase</div></div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌾 บันทึกอาหาร</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ เพิ่ม</button>
      </div>
      <DataTable columns={columns} data={records} loading={loading} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} title="เพิ่มบันทึกอาหาร" onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ประเภท *</label>
          <input type="text" required placeholder="เช่น ข้าวสัตว์, อาหารเสริม" value={formData.feed_type} onChange={(e) => setFormData({ ...formData, feed_type: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>เล้า</label>
            <input type="text" value={formData.pen} onChange={(e) => setFormData({ ...formData, pen: e.target.value })} />
          </div>
          <div className="form-group">
            <label>ปริมาณ</label>
            <input type="text" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>วันที่ *</label>
            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>เวลา</label>
            <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
          </div>
        </div>
      </FormModal>
    </div>
  )
}

export default FeedPage
