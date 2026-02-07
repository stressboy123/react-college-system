import { useState, useEffect, useCallback } from 'react'
import { Table, Pagination, Typography } from 'antd'
import { getMajorList } from '@/api/dataApi'
import type { TMajor, PageParams, PageResult, Result } from '@/types/api'

const { Title } = Typography

const MajorTable = () => {
  const [pageParams, setPageParams] = useState<PageParams>({ current: 1, pageSize: 10 })
  const [majorList, setMajorList] = useState<TMajor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchMajorData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getMajorList(pageParams)
      const result: Result<PageResult<TMajor>> = response.data 
      
      if (result.code === 200) {
        setMajorList(result.data.list)
        setTotal(result.data.total)
      }
    } catch (err) {
      console.error('获取专业列表失败：', err)
    } finally {
      setLoading(false)
    }
  }, [pageParams])

  useEffect(() => {
    fetchMajorData()
  }, [fetchMajorData])

  const handlePageChange = (current: number, pageSize: number) => {
    setPageParams({ current, pageSize })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '专业名称', dataIndex: 'majorName', key: 'majorName' },
    { title: '所属院校ID', dataIndex: 'collegeId', key: 'collegeId' },
    { title: '学位类型', dataIndex: 'degree', key: 'degree' },
    { title: '专业类别', dataIndex: 'category', key: 'category' },
  ]

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 16 }}>专业列表</Title>
      <Table
        columns={columns}
        dataSource={majorList}
        rowKey="id"
        pagination={false}
        bordered
        loading={loading}
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pageParams.current}
          pageSize={pageParams.pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条数据`}
        />
      </div>
    </div>
  )
}

export default MajorTable