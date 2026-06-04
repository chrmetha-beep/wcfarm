import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const DeliveriesPage = ({ supabase }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    driver: '',
    vehicle: '',
    item: '',
    quantity: '',
    unit: 'กระสอบ',
    note: '',
  })

  const columns = [
    { key: 'date', label: 'วันที่', width: '100px' },
    { key: 'driver', label: 'คนขับ', width: '120px' },
    { key: 'vehicle', label: 'ยานพาหนะ', width: '120px' },
    { key: 'item', label: 'สินค้า', width: '120px' },
    { key: 'quantity', label: 'จำนวน', width: '100px' },
    { key: 'unit', label: 'หน่วย', width: '80px' },
  ]

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('deliveries').select('*').order('date', { ascending: false })
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
      const { error } = await supabase.from('deliveries').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({
        date: new Date().toISOString().split('T')[0],
        driver: '',
        vehicle: '',
        item: '',
        quantity: '',
        unit: 'กระสอบ',
        note: '',
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
      const { error } = await supabase.from('deliveries').delete().eq('id', id)
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
        <h1>🚚 บันทึกส่งของ</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ เพิ่ม</button>
      </div>
      <DataTable columns={columns} data={records} loading={loading} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} title="เพิ่มบันทึกส่งของ" onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>วันที่ *</label>
          <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>คนขับ</label>
            <input type="text" value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} />
          </div>
          <div className="form-group">
            <label>ยานพาหนะ</label>
            <input type="text" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>สินค้า *</label>
          <input type="text" required value={formData.item} onChange={(e) => setFormData({ ...formData, item: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>จำนวน</label>
            <input type="text" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
          </div>
          <div className="form-group">
            <label>หน่วย</label>
            <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
              <option value="กระสอบ">กระสอบ</option>
              <option value="ตัน">ตัน</option>
              <option value="กิโลกรัม">กิโลกรัม</option>
              <option value="ลิตร">ลิตร</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>หมายเหตุ</label>
          <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows="3" />
        </div>
      </FormModal>
    </div>
  )
}

export default DeliveriesPage
