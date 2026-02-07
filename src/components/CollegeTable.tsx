import { useState, useEffect, useCallback } from 'react'
import { Table, Pagination, Typography } from 'antd'
import { getCollegeList } from '@/api/dataApi'
import type { TCollege, PageParams, PageResult, Result } from '@/types/api'

const { Title } = Typography

const CollegeTable = () => {
  const [pageParams, setPageParams] = useState<PageParams>({ current: 1, pageSize: 10 })
  const [collegeList, setCollegeList] = useState<TCollege[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCollegeData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getCollegeList(pageParams)
      const result: Result<PageResult<TCollege>> = response.data 
      
      if (result.code === 200) {
        setCollegeList(result.data.list)
        setTotal(result.data.total)
      }
    } catch (err) {
      console.error('获取院校列表失败：', err)
    } finally {
      setLoading(false)
    }
  }, [pageParams])

  useEffect(() => {
    fetchCollegeData()
  }, [fetchCollegeData])

  const handlePageChange = (current: number, pageSize: number) => {
    setPageParams({ current, pageSize })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '院校名称', dataIndex: 'collegeName', key: 'collegeName' },
    { title: '省份', dataIndex: 'province', key: 'province' },
    { title: '院校类型', dataIndex: 'type', key: 'type' },
    { title: '办学层次', dataIndex: 'level', key: 'level' },
  ]

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 16 }}>院校列表</Title>
      <Table
        columns={columns}
        dataSource={collegeList}
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

export default CollegeTable