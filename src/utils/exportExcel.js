// utils/exportExcel.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Notification } from "element-ui";

/**
 * 导出 el-table 全部数据到 Excel（支持分页）
 * @param {Object} options 配置项
 * @param {VueComponent} options.tableRef el-table 的 ref 实例
 * @param {Function} options.fetchAllData 获取全部数据的方法
 * @param {string} [options.fileName='export'] 文件名
 * @param {Object} [options.styles] 自定义样式
 */
// 对齐方式映射函数
function mapAlignment(align) {
  const map = {
    left: "left",
    center: "center",
    right: "right",
    undefined: "left",
  };
  return map[align] || "left";
}
export async function exportTableToExcel({
  tableRef,
  fetchAllData,
  fileName = "export",
  styles = {},
}) {
  try {
    // 1. 获取全部数据
    const allData = await fetchAllData();

    // 2. 获取表头配置
    const columns = tableRef.columns
      .filter((col) => col.label !== "序号" && col.label !== "操作")
      .map((col) => ({
        label: col.label,
        prop: col.property || "",
        align: col.align,
      }));

    // 3. 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 4. 添加表头
    const headerRow = columns.map((col) => col.label);
    worksheet.addRow(headerRow);

    // 5. 添加数据行
    allData.forEach((row) => {
      const rowData = columns.map((col) => {
        // 处理嵌套属性（例如：user.name）
        return col.prop.split(".").reduce((obj, key) => {
          if (obj && typeof obj === "object") return obj[key];
          return "";
        }, row);
      });
      worksheet.addRow(rowData);
    });

    // 6. 自适应列宽
    worksheet.columns = columns.map((col, colIndex) => {
      const headerLength = col.label?.length || 0;
      let maxDataLength = 0;

      allData.forEach((row, rowIndex) => {
        const excelRowNumber = rowIndex + 2;
        const cell = worksheet.getRow(excelRowNumber).getCell(colIndex + 1);
        const cellValue = cell.value?.toString() || "";
        maxDataLength = Math.max(maxDataLength, cellValue.length);
      });

      return {
        width: Math.max(headerLength, maxDataLength) + 6,
        style: {
          alignment: {
            wrapText: true,
            horizontal: col.align ? mapAlignment(col.align) : "left",
          },
          ...(styles.cell || {}),
        },
      };
    });

    // 7. 应用表头样式
    worksheet.getRow(1).eachCell((cell) => {
      Object.assign(cell, {
        font: { bold: true, ...(styles.headerFont || {}) },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: styles.headerBgColor || "FFD3D3D3" },
        },
      });
    });

    // 8. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("[Excel Export Error]", error);
    Notification.error({
      title: "错误",
      message: "导出失败，请重试",
    });
    throw new Error("导出失败，请重试");
  }
}

// async handleExport() {
//   try {
//     await exportTableToExcel({
//       tableRef: this.$refs.myTable,
//       fetchAllData: this.fetchAllUsers,
//       fileName: '用户数据',
//       styles: {
//         headerBgColor: 'FFA0A0A0',  // 灰色表头
//         headerFont: { color: 'FFFFFFFF' }, // 白色文字
//headerFont: {
//color: { argb: 'FFFFFFFF' }, // 红色文字
//bold: true,
//italic: true
//},
//         cell: { numFmt: '@' } // 强制文本格式
//       }
//     });
//   } catch (error) {
//     this.$message.error(error.message);
//   }
// },

// // 获取全部数据的方法（根据实际场景实现）
// async fetchAllUsers() {

//   return this.tableData.map((item, index) => ({
//   ...item,
//   _id: index // 如果依赖 _id，确保它是数字
// }));
// },

export async function importExcelToJSON(file, options = {}) {
  const { 
    hasHeader = true, 
    sheetIndex = 0, 
    headerMapping = {},
    transformHeader
  } = options;
  
  try {
    // 创建 Workbook
    const workbook = new ExcelJS.Workbook();
    
    // 读取文件
    const buffer = await readFileAsBuffer(file);
    await workbook.xlsx.load(buffer);
    
    // 获取工作表
    const worksheet = workbook.worksheets[sheetIndex];
    console.log(worksheet);
    
    if (!worksheet) {
      throw new Error(`工作表索引 ${sheetIndex} 不存在`);
    }
    
    // 获取表头映射
    let headers = [];
    if (hasHeader) {
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        const headerText = cell.value?.toString().trim() || `column_${colNumber}`;
        
        // 优先使用自定义转换函数
        if (transformHeader && typeof transformHeader === 'function') {
          headers.push(transformHeader(headerText, colNumber));
        } 
        // 其次使用映射配置
        else if (headerMapping[headerText]) {
          headers.push(headerMapping[headerText]);
        }
        // 默认处理：移除特殊字符并用下划线连接
        else {
          // 将中文标点符号替换为英文，移除特殊字符
          const cleanHeader = headerText
            .replace(/[。，；：！？、（）【】《》]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '');
          headers.push(cleanHeader);
        }
      });
    }

    // 转换为数组数据
    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      // 如果有表头且是第一行，跳过
      if (hasHeader && rowNumber === 1) return;
      
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        // 如果有表头，使用处理后的表头作为键名
        if (hasHeader && headers[colNumber - 1]) {
          rowData[headers[colNumber - 1]] = cell.value;
        } else {
          // 如果没有表头，使用列索引作为键名
          rowData[`column_${colNumber}`] = cell.value;
        }
      });
      
      // 跳过空行
      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });
    
    return data;
  } catch (error) {
    console.error("[Excel Import Error]", error);
    Notification.error({
      title: "错误",
      message: "解析Excel文件失败，请检查文件格式",
    });
    throw new Error("解析Excel文件失败");
  }
}

/**
 * 将 File 对象读取为 ArrayBuffer
 * @param {File} file 文件对象
 * @returns {Promise<ArrayBuffer>} ArrayBuffer
 */
function readFileAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
/**
 * 解析 Excel 文件为 JSON 数据（支持中文表头映射、多工作表选择和行数限制）
 * @param {File} file Excel 文件对象
 * @param {Object} options 配置选项
 * @param {boolean} [options.hasHeader=true] 是否包含表头
 * @param {number} [options.sheetIndex=0] 工作表索引
 * @param {string} [options.sheetName] 工作表名称（优先于sheetIndex）
 * @param {Object} [options.headerMapping={}] 表头映射配置 {中文表头: 英文键名}
 * @param {Function} [options.transformHeader] 自定义表头转换函数
 * @param {number} [options.maxRows=0] 最大解析行数（0表示无限制）
 * @param {number} [options.startRow=1] 起始行（基于Excel行号，包含表头）
 * @returns {Promise<Object>} 解析后的数据对象，包含数据、工作表信息和分页信息
 */
// export async function importExcelToJSON(file, options = {}) {
//   const { 
//     hasHeader = true, 
//     sheetIndex = 0, 
//     sheetName,
//     headerMapping = {},
//     transformHeader,
//     maxRows = 0, // 0表示无限制
//     startRow = 1 // Excel行号从1开始
//   } = options;
  
//   try {
//     // 创建 Workbook
//     const workbook = new ExcelJS.Workbook();
    
//     // 读取文件
//     const buffer = await readFileAsBuffer(file);
//     await workbook.xlsx.load(buffer);
    
//     // 获取工作表
//     let worksheet;
//     if (sheetName) {
//       // 优先使用工作表名称
//       worksheet = workbook.getWorksheet(sheetName);
//       if (!worksheet) {
//         throw new Error(`工作表 "${sheetName}" 不存在`);
//       }
//     } else {
//       // 使用工作表索引
//       worksheet = workbook.worksheets[sheetIndex];
//       if (!worksheet) {
//         throw new Error(`工作表索引 ${sheetIndex} 不存在`);
//       }
//     }
    
//     // 获取表头映射
//     let headers = [];
//     if (hasHeader) {
//       const headerRow = worksheet.getRow(startRow);
//       headerRow.eachCell((cell, colNumber) => {
//         const headerText = cell.value?.toString().trim() || `column_${colNumber}`;
        
//         // 优先使用自定义转换函数
//         if (transformHeader && typeof transformHeader === 'function') {
//           headers.push(transformHeader(headerText, colNumber));
//         } 
//         // 其次使用映射配置
//         else if (headerMapping[headerText]) {
//           headers.push(headerMapping[headerText]);
//         }
//         // 默认处理：移除特殊字符并用下划线连接
//         else {
//           // 将中文标点符号替换为英文，移除特殊字符
//           const cleanHeader = headerText
//             .replace(/[。，；：！？、（）【】《》]/g, '')
//             .replace(/\s+/g, '_')
//             .replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '');
//           headers.push(cleanHeader);
//         }
//       });
//     }
    
//     // 计算实际数据起始行
//     const dataStartRow = hasHeader ? startRow + 1 : startRow;
    
//     // 计算实际要解析的行数
//     const totalRows = worksheet.rowCount;
//     const actualMaxRows = maxRows > 0 ? 
//       Math.min(maxRows, totalRows - dataStartRow + 1) : 
//       totalRows - dataStartRow + 1;
    
//     // 转换为数组数据
//     const data = [];
//     let currentRow = dataStartRow;
//     let parsedRows = 0;
    
//     while (currentRow <= totalRows && parsedRows < actualMaxRows) {
//       const row = worksheet.getRow(currentRow);
//       const rowData = {};
//       let isEmptyRow = true;
      
//       row.eachCell((cell, colNumber) => {
//         // 如果有表头，使用处理后的表头作为键名
//         if (hasHeader && headers[colNumber - 1]) {
//           rowData[headers[colNumber - 1]] = cell.value;
//         } else {
//           // 如果没有表头，使用列索引作为键名
//           rowData[`column_${colNumber}`] = cell.value;
//         }
        
//         // 检查行是否为空
//         if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
//           isEmptyRow = false;
//         }
//       });
      
//       // 跳过空行
//       if (!isEmptyRow) {
//         data.push(rowData);
//         parsedRows++;
//       }
      
//       currentRow++;
//     }
    
//     return {
//       data,
//       sheetName: worksheet.name,
//       totalRows: worksheet.rowCount,
//       parsedRows: data.length,
//       hasMore: maxRows > 0 && currentRow <= totalRows,
//       nextStartRow: currentRow
//     };
//   } catch (error) {
//     console.error("[Excel Import Error]", error);
//     Notification.error({
//       title: "错误",
//       message: "解析Excel文件失败，请检查文件格式",
//     });
//     throw new Error("解析Excel文件失败");
//   }
// }