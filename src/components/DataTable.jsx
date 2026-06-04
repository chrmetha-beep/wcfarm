import './DataTable.css'

const DataTable = ({ columns, data, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return <div className="loading-table">กำลังโหลดข้อมูล...</div>
  }

  if (!data || data.length === 0) {
    return <div className="empty-table">ไม่มีข้อมูล</div>
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: '120px' }}>การกระทำ</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="action-cell">
                  {onEdit && (
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => onEdit(row)}
                    >
                      แก้ไข
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => onDelete(row.id)}
                    >
                      ลบ
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
