import { useState, useEffect } from 'react';
import { Table, Pagination, Space, Typography } from 'antd';
import { College, PageParams } from '../types';
import { getCollegeList } from '../utils/mockData';

const { Title } = Typography;

const CollegeTable = () => {
  const [pageParams, setPageParams] = useState<PageParams>({ current: 1, pageSize: 10 });
  const [collegeList, setCollegeList] = useState<College[]>([]);
  const [total, setTotal] = useState(0);

  // 获取分页数据
  useEffect(() => {
    const { list, total } = getCollegeList(pageParams);
    setCollegeList(list);
    setTotal(total);
  }, [pageParams]);

  // 分页变更
  const handlePageChange = (current: number, pageSize: number) => {
    setPageParams({ current, pageSize });
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '院校名称',
      dataIndex: 'collegeName',
      key: 'collegeName',
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '院校类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '办学层次',
      dataIndex: 'level',
      key: 'level',
    },
  ];

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        院校列表
      </Title>
      <Table
        columns={columns}
        dataSource={collegeList}
        rowKey="id"
        pagination={false} // 关闭表格内置分页，自定义分页组件
        bordered
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
  );
};

export default CollegeTable;