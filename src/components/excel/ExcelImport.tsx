import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  Table,
  Space,
  Typography,
  message,
  Progress,
  Tag,
  Card,
  Alert,
  Tooltip
} from 'antd';
import { UploadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import type { ColumnType } from 'antd/es/table';
import type { Result } from '@/types/api';
import {
  importEnrollmentPlan,
  importScoreRank,
  importAdmissionData
} from '@/api/excelApi';

const { Title, Text } = Typography;
const { Option } = Select;

// 数据类型与列名映射
const DATA_TYPE_COLUMNS = {
  enrollmentPlan: {
    label: '招生计划',
    requiredColumns: ['年份', '生源地', '批次', '批次备注', '科类', '院校代码', '院校名称', '专业组代码', '专业代码', '专业名称', '专业备注', '其他要求', '选科要求', '计划人数', '学制', '学费'],
    api: importEnrollmentPlan
  },
  scoreRank: {
    label: '一分一段',
    requiredColumns: ['年份', '省份', '分数', '累计人数', '本段人数'],
    api: importScoreRank
  },
  admissionData: {
    label: '录取数据',
    requiredColumns: ['年份', '省份', '院校编码', '院校名称', '最低录取分', '最低录取位次', '选科要求', '批次'],
    api: importAdmissionData
  }
};

// PreviewItem 类型定义
interface PreviewItem {
  [key: string]: string | number | boolean | string[] | null | undefined;
  _valid: boolean;
  _errors: string[];
  key: string;
}

const ExcelImport = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 状态管理
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<'enrollmentPlan' | 'scoreRank' | 'admissionData'>('enrollmentPlan');
  const [previewData, setPreviewData] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileError, setFileError] = useState<string>('');
  const [columnError, setColumnError] = useState<string>('');

  // 修复：确保ref正确获取（兜底处理）
  useEffect(() => {
    if (!fileInputRef.current) {
      const input = document.getElementById('excel-file-input') as HTMLInputElement;
      if (input) {
        fileInputRef.current = input;
      }
    }
  }, []);

  // 文件格式/大小校验
  const validateFile = (file: File): boolean => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExt || '')) {
      setFileError('请上传xlsx/xls格式的Excel文件');
      return false;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError('请上传10MB以内的Excel文件');
      return false;
    }
    setFileError('');
    return true;
  };

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // 重置状态
    setPreviewData([]);
    setColumnError('');
    setUploadProgress(0);

    // 文件校验
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
      // 清空文件选择框
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 修复：手动触发文件选择框（替代label绑定）
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 直接触发input的点击事件
    }
  };

  // 解析Excel并预览
  const handlePreview = () => {
    if (!file) {
      message.warning('请先选择Excel文件');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('Excel文件为空');
        }

        const headerRow = jsonData[0] as string[];
        const dataRows = jsonData.slice(1, 11);

        const { requiredColumns } = DATA_TYPE_COLUMNS[dataType];
        const missingColumns = requiredColumns.filter(col => !headerRow.includes(col));
        if (missingColumns.length > 0) {
          setColumnError(`缺少必填列：${missingColumns.join('、')}`);
          setPreviewData([]);
          return;
        }
        setColumnError('');

        // 格式化预览数据
        const formattedPreview: PreviewItem[] = dataRows.map((row, idx) => {
          const rowArr = row as (string | number | null)[];
          const rowObj: PreviewItem = { 
            _valid: true, 
            _errors: [],
            key: `preview-${idx}`
          };
          
          headerRow.forEach((col, colIndex) => {
            const cellValue = rowArr[colIndex] ?? null;
            rowObj[col] = cellValue;

            // if (requiredColumns.includes(col) && (cellValue === null || cellValue === '')) {
            //   rowObj._valid = false;
            //   rowObj._errors.push(`${col}不能为空`);
            // }
          });
          return rowObj;
        });

        setPreviewData(formattedPreview);
      } catch (err) {
        message.error(`Excel解析失败：${(err as Error).message}`);
        setPreviewData([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 确认导入
  const handleImport = () => {
    if (!file) return;

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const { api } = DATA_TYPE_COLUMNS[dataType];
    
    api(formData, (progressEvent) => {
      const percent = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100);
      setUploadProgress(percent);
    }).then((res) => {
      const result: Result<string> = res.data;
      if (result.success) {
        message.success('数据导入成功！');
        navigate('/import-result');
      } else {
        message.error(result.msg || '数据导入失败');
      }
    }).catch((err) => {
      console.error('导入失败：', err);
      message.error('网络异常，导入失败');
    }).finally(() => {
      setLoading(false);
      setUploadProgress(0);
    });
  };

  // 构建表格列配置
  const buildTableColumns = (): ColumnType<PreviewItem>[] => {
    if (previewData.length === 0) return [];
    
    const headers = Object.keys(previewData[0]).filter(key => !['_valid', '_errors', 'key'].includes(key));
    
    // 普通列配置
    const normalColumns: ColumnType<PreviewItem>[] = headers.map((col) => ({
      title: col,
      dataIndex: col,
      key: col,
      render: (value: string | number | null | undefined, record: PreviewItem) => {
        const isError = !record._valid && record._errors.some(err => err.includes(col));
        return (
          <Text type={isError ? 'danger' : 'secondary'}>
            {value ?? '-'}
          </Text>
        );
      }
    }));

    // 校验状态列配置
    const statusColumn: ColumnType<PreviewItem> = {
      title: '校验状态',
      dataIndex: '_valid',
      key: '_valid',
      width: 180,
      render: (value: boolean, record: PreviewItem) => (
        <Space>
          {value ? (
            <Tag color="green" icon={<CheckOutlined />}>有效</Tag>
          ) : (
            <Tag color="red" icon={<CloseOutlined />}>无效</Tag>
          )}
          {!value && (
            <Tooltip title={record._errors.join('；')}>
              <Text type="danger">查看错误</Text>
            </Tooltip>
          )}
        </Space>
      )
    };

    return [...normalColumns, statusColumn];
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
        Excel数据导入
      </Title>

      {/* 文件选择区域 */}
      <Card bordered style={{ marginBottom: 20 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space>
            {/* 数据类型选择 */}
            <Select
              value={dataType}
              onChange={(value) => {
                setDataType(value as 'enrollmentPlan' | 'scoreRank' | 'admissionData');
                setPreviewData([]);
                setColumnError('');
              }}
              style={{ width: 200 }}
            >
              <Option value="enrollmentPlan">招生计划</Option>
              <Option value="scoreRank">一分一段</Option>
              <Option value="admissionData">录取数据</Option>
            </Select>

            {/* 修复核心：重构文件选择逻辑 */}
            {/* 1. input改为可视区域外隐藏（替代display:none） */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ 
                position: 'absolute', 
                top: '-9999px', 
                left: '-9999px', 
                opacity: 0 
              }} // 兼容所有浏览器的隐藏方式
              id="excel-file-input"
            />
            {/* 2. Button直接绑定点击事件，手动触发input */}
            <Button
              type="default"
              icon={<UploadOutlined />}
              onClick={handleOpenFileDialog} // 关键：手动触发文件选择框
            >
              选择Excel文件
            </Button>

            {/* 已选文件提示 */}
            {file && (
              <Text>
                已选择：{file.name}（{(file.size / 1024 / 1024).toFixed(2)}MB）
              </Text>
            )}

            {/* 上传预览按钮 */}
            <Button
              type="primary"
              onClick={handlePreview}
              loading={loading}
              disabled={!file}
            >
              上传预览
            </Button>
          </Space>

          {/* 文件错误提示 */}
          {fileError && (
            <Alert message={fileError} type="error" showIcon style={{ marginTop: 10 }} />
          )}

          {/* 列名错误提示 */}
          {columnError && (
            <Alert message={columnError} type="warning" showIcon style={{ marginTop: 10 }} />
          )}
        </Space>
      </Card>

      {/* 预览区域 */}
      {previewData.length > 0 && (
        <Card
          title={
            <Space>
              <Text strong>数据预览（前10条）</Text>
              <Tag>{DATA_TYPE_COLUMNS[dataType].label}</Tag>
            </Space>
          }
          bordered
          style={{ marginBottom: 20 }}
        >
          {/* 上传进度 */}
          {uploadProgress > 0 && (
            <Progress
              percent={uploadProgress}
              status={uploadProgress === 100 ? 'success' : 'active'}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 预览表格 */}
          <Table<PreviewItem>
            columns={buildTableColumns()}
            dataSource={previewData}
            pagination={false}
            size="middle"
            rowClassName={(record) => !record._valid ? 'table-error-row' : ''}
            rowKey="key"
          />

          {/* 确认导入按钮 */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleImport}
              loading={loading && uploadProgress < 100}
            >
              确认导入
            </Button>
          </div>
        </Card>
      )}

      {/* 样式：高亮异常行 */}
      <style>
        {`
          .table-error-row {
            background-color: #fff2f0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default ExcelImport;