// utils/exportExcel.js
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 导出 el-table 全部数据到 Excel（支持分页）
 * @param {Object} options 配置项
 * @param {VueComponent} options.tableRef el-table 的 ref 实例
 * @param {Function} options.fetchAllData 获取全部数据的方法
 * @param {string} [options.fileName='export'] 文件名
 * @param {Object} [options.styles] 自定义样式
 */
export async function exportTableToExcel({
  tableRef,
  fetchAllData,
  fileName = 'export',
  styles = {
  }
}) {
  try {
    // 1. 获取全部数据
    const allData = await fetchAllData();

    // 2. 获取表头配置
    const columns = tableRef.columns.map(col => ({
      label: col.label,
      prop: col.property || '',
      align: col.align
    }));

    // 3. 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 4. 添加表头
    const headerRow = columns.map(col => col.label);
    worksheet.addRow(headerRow);

    // 5. 添加数据行
    allData.forEach(row => {
      const rowData = columns.map(col => {
        // 处理嵌套属性（例如：user.name）
        return col.prop.split('.').reduce((obj, key) => {
          if (obj && typeof obj === 'object') return obj[key];
          return '';
        }, row);
      });
      worksheet.addRow(rowData);
    });

    // 6. 自适应列宽
    worksheet.columns = columns.map((col, index) => {
      const headerLength = col.label?.length || 0;
      const dataLength = allData.reduce((max, row) => {
        const cellValue = worksheet.getRow(row._id + 2) // 数据从第2行开始
          .getCell(index + 1).value?.toString() || '';
        return Math.max(max, cellValue.length);
      }, 0);
      
      return {
        width: Math.max(headerLength, dataLength) + 4,
        style: { 
          alignment: { 
            wrapText: true,
            horizontal: col.align ? this.mapAlignment(col.align) : 'left'
          },
          ...(styles.cell || {})
        }
      };
    });

    // 7. 应用表头样式
    worksheet.getRow(1).eachCell(cell => {
      Object.assign(cell, {
        font: { bold: true, ...(styles.headerFont || {}) },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: styles.headerBgColor || 'FFD3D3D3' }
        }
      });
    });

    // 8. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `${fileName}.xlsx`);

  } catch (error) {
    console.error('[Excel Export Error]', error);
    throw new Error('导出失败，请重试');
  }
}

// 对齐方式映射
function mapAlignment(align) {
  const map = {
    left: 'left',
    center: 'center',
    right: 'right',
    undefined: 'left'
  };
  return map[align] || 'left';
}