import { useState, useEffect, useCallback } from 'react'
import { Table, Pagination, Typography } from 'antd'
import { getMajorList } from '@/api/dataApi'
import type { TMajor, PageParams, PageResult, Result } from '@/types/api'

const { Title } = Typography

const MajorTable = () => {
  const [pageParams, setPageParams] = useState<PageParams>({ pageNum: 1, pageSize: 10 })
  const [majorList, setMajorList] = useState<TMajor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchMajorData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getMajorList(pageParams)
      const result: Result<PageResult<TMajor>> = response.data 
      
      if (result.code === 200) {
        // 匹配后端返回的records字段
        setMajorList(result.data.records)
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

  // 分页切换
  const handlePageChange = (pageNum: number, pageSize: number) => {
    setPageParams({ pageNum, pageSize })
  }

  // 列定义匹配后端TMajor实体字段
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '专业门类', dataIndex: 'majorCategory', key: 'majorCategory' },
    { title: '专业类', dataIndex: 'majorType', key: 'majorType' },
    { title: '专业名称', dataIndex: 'majorName', key: 'majorName' },
    { title: '专业代码', dataIndex: 'majorCode', key: 'majorCode' },
    { title: '修业年限', dataIndex: 'educationLength', key: 'educationLength' },
    { title: '授予学位', dataIndex: 'degreeAwarded', key: 'degreeAwarded' },
    { title: '平均薪酬', dataIndex: 'averageSalary', key: 'averageSalary' },
    { title: '综合满意度', dataIndex: 'comprehensiveSatisfaction', key: 'comprehensiveSatisfaction' },
    { title: '近三年就业率', dataIndex: 'threeYearEmploymentRate', key: 'threeYearEmploymentRate' },
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

export default MajorTable