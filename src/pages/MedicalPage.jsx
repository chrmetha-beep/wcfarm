import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const MedicalPage = ({ supabase }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'ยา',
    name: '',
    pen: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })

  const columns = [
    { key: 'date', label: 'วันที่', width: '100px' },
    { key: 'type', label: 'ประเภท', width: '100px' },
    { key: 'name', label: 'ชื่อ', width: '150px' },
    { key: 'pen', label: 'เล้า', width: '100px' },
    { key: 'quantity', label: 'จำนวน', width: '100px' },
    { key: 'note', label: 'หมายเหตุ', width: '200px' },
  ]

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('med_records').select('*').order('date', { ascending: false })
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
      const { error } = await supabase.from('med_records').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({
        type: 'ยา',
        name: '',
        pen: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
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
      const { error } = await supabase.from('med_records').delete().eq('id', id)
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
        <h1>💉 ยา และ วัคซีน</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ เพิ่ม</button>
      </div>
      <DataTable columns={columns} data={records} loading={loading} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} title="เพิ่มบันทึกยา/วัคซีน" onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ประเภท</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="ยา">ยา</option>
            <option value="วัคซีน">วัคซีน</option>
          </select>
        </div>
        <div className="form-group">
          <label>ชื่อ *</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>เล้า</label>
            <input type="text" value={formData.pen} onChange={(e) => setFormData({ ...formData, pen: e.target.value })} />
          </div>
          <div className="form-group">
            <label>จำนวน</label>
            <input type="text" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>วันที่ *</label>
          <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หมายเหตุ</label>
          <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows="3" />
        </div>
      </FormModal>
    </div>
  )
}

export default MedicalPage
