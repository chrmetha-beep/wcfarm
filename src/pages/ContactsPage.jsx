import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import './Pages.css'

const ContactsPage = ({ supabase }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    group: '',
  })

  const columns = [
    { key: 'name', label: 'ชื่อ', width: '150px' },
    { key: 'role', label: 'ตำแหน่ง', width: '150px' },
    { key: 'phone', label: 'เบอร์โทรศัพท์', width: '150px' },
    { key: 'group', label: 'กลุ่ม', width: '120px' },
  ]

  const fetchRecords = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('name')
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
      const { error } = await supabase.from('contacts').insert([formData])
      if (error) throw error
      alert('บันทึกสำเร็จ')
      setFormData({ name: '', role: '', phone: '', group: '' })
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
      const { error } = await supabase.from('contacts').delete().eq('id', id)
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
        <h1>📞 เบอร์ติดต่อ</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ เพิ่ม</button>
      </div>
      <DataTable columns={columns} data={records} loading={loading} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} title="เพิ่มเบอร์ติดต่อ" onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ชื่อ *</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>ตำแหน่ง</label>
          <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
        </div>
        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>กลุ่ม</label>
          <input type="text" value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} />
        </div>
      </FormModal>
    </div>
  )
}

export default ContactsPage
