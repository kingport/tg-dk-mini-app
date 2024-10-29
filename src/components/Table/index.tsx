// TableComponent.tsx
import React, { ReactNode, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Wrap, Flex, Box } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export type Columns<T = any> = {
  label: string;
  dataIndex: string;
  filter?: boolean;
  order?: boolean;
  width?: number | string;
  valueType?: 'text' | 'options' | 'dateTime';
  render?: (text?: any, record?: T, index?: number) => ReactNode | ReactNode[];
};

interface TableProps<T = any> {
  data: T[];
  columns: Columns<T>[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'simple' | 'striped' | 'unstyled';
}

const TableComponent: React.FC<TableProps> = ({ data, columns, size = 'md', variant = 'simple' }) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>('');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = data.sort((a, b) => {
    if (sortField === null) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Box width="full" className="hiddenScroll" overflow="auto">
      <Table width="full" overscroll="y-auto" variant={variant} size={size}>
        <Thead fontSize={'xs'}>
          <Tr>
            {columns.map((column, index) => (
              <Th key={index} className={[0, columns.length - 1].includes(index) ? (index === 0 ? 'table-fixed-left' : 'table-fixed-right') : ''} w={'auto'} minWidth={column?.width || 'auto'} px="2">
                <Wrap>
                  {column.label}
                  {column.order && (
                    <Flex direction="column" onClick={() => handleSort(column.dataIndex)}>
                      <TriangleUpIcon color={sortOrder === 'asc' ? 'white' : ''} w="2" h="2" />
                      <TriangleDownIcon color={sortOrder === 'desc' ? 'white' : ''} w="2" h="2" />
                    </Flex>
                  )}
                  {column.filter && <SvgIcon name="filter" style={{ width: '16px', height: '16px' }} />}
                </Wrap>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <Td key={columnIndex} className={[0, columns.length - 1].includes(columnIndex) ? (columnIndex === 0 ? 'table-fixed-left' : 'table-fixed-right') : ''}>
                  {typeof column?.render === 'function' ? column.render(row[column.dataIndex], row, rowIndex) : row[column.dataIndex]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableComponent;
