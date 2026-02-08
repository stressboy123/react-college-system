import { useState, useEffect, useCallback } from 'react'
import { Table, Pagination, Typography } from 'antd'
import { getCollegeList } from '@/api/dataApi'
import type { TCollege, PageParams, PageResult, Result } from '@/types/api'

const { Title } = Typography

const CollegeTable = () => {
  const [pageParams, setPageParams] = useState<PageParams>({ pageNum: 1, pageSize: 10 })
  const [collegeList, setCollegeList] = useState<TCollege[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCollegeData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getCollegeList(pageParams)
      const result: Result<PageResult<TCollege>> = response.data 
      
      if (result.code === 200) {
        // 匹配后端返回的records字段
        setCollegeList(result.data.records)
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

  // 分页切换
  const handlePageChange = (pageNum: number, pageSize: number) => {
    setPageParams({ pageNum, pageSize })
  }

  // 列定义匹配后端TCollege实体字段
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '院校编码', dataIndex: 'collegeCode', key: 'collegeCode' },
    { title: '院校名称', dataIndex: 'collegeName', key: 'collegeName' },
    { title: '主管部门', dataIndex: 'competentAuthority', key: 'competentAuthority' },
    { title: '省份ID', dataIndex: 'provinceId', key: 'provinceId' },
    { title: '办学层次', dataIndex: 'schoolLevel', key: 'schoolLevel' },
    { title: '办学性质', dataIndex: 'schoolNature', key: 'schoolNature' },
    { title: '院校类型', dataIndex: 'collegeType', key: 'collegeType' },
    { title: '详细地址', dataIndex: 'detailedAddress', key: 'detailedAddress' },
    { title: '官方网址', dataIndex: 'officialWebsite', key: 'officialWebsite' },
    { title: '院校满意度', dataIndex: 'collegeSatisfaction', key: 'collegeSatisfaction' },
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
        scroll={{ x: 'max-content' }} // 适配多列横向滚动
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pageParams.pageNum} // 绑定pageNum
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