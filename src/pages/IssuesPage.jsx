import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const IssuesPage = ({ supabase }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reporter: '',
    category: '',
    detail: '',
    status: 'รอดำเนินการ',
  })

  const columns = [
    { key: 'date', label: 'วันที่', width: '100px' },
    { key: 'reporter', label: 'ผู้รายงาน', width: '120px' },
    { key: 'category', label: 'หมวดหมู่', width: '100px' },
    { key: 'detail', label: 'รายละเอียด', width: '200px' },
    { key: 'status', label: 'สถานะ', width: '120px', render: (val) => (
      <span style={{ color: val === 'แก้ไขแล้ว' ? '#2ecc71' : '#f39c12' }}>{val}</span>
    )},
  ]

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('issues').select('*').order('date', { ascending: false })
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
      const { error } = await supabase.from('issues').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reporter: '',
        category: '',
        detail: '',
        status: 'รอดำเนินการ',
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
      const { error } = await supabase.from('issues').delete().eq('id', id)
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
        <h1>⚠️ รายงานปัญหา</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ เพิ่ม</button>
      </div>
      <DataTable columns={columns} data={records} loading={loading} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} title="รายงานปัญหา" onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>วันที่ *</label>
          <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label>ผู้รายงาน *</label>
          <input type="text" required value={formData.reporter} onChange={(e) => setFormData({ ...formData, reporter: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หมวดหมู่ *</label>
          <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="">เลือก</option>
            <option value="สัตว์ป่วย">สัตว์ป่วย</option>
            <option value="อุปกรณ์เสีย">อุปกรณ์เสีย</option>
            <option value="ป้องกันโรค">ป้องกันโรค</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
        <div className="form-group">
          <label>รายละเอียด *</label>
          <textarea required value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} rows="4" />
        </div>
        <div className="form-group">
          <label>สถานะ</label>
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
            <option value="รอดำเนินการ">รอดำเนินการ</option>
            <option value="กำลังแก้ไข">กำลังแก้ไข</option>
            <option value="แก้ไขแล้ว">แก้ไขแล้ว</option>
          </select>
        </div>
      </FormModal>
    </div>
  )
}

export default IssuesPage
