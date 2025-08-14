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
        width: Math.max(headerLength, maxDataLength) + 4,
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

export async function generateToolingJsonFromExcel(file) {
  try {
    const workbook = new ExcelJS.Workbook();
    // 添加时间修复选项避免富文本错误
    workbook.xlsx.read(await file.arrayBuffer(), {
      ignoreNodes: ["xdr:wsDr"], // 忽略绘图元素
      ignoreStyles: true, // 忽略样式信息
      dateFormats: ["YYYY-MM-DD"], // 明确日期格式
    });

    const defectSheet = workbook.getWorksheet("SMT缺陷样件");
    if (!defectSheet) {
      throw new Error('未找到"SMT缺陷样件"工作表');
    }

    const result = [];
    let rowNumber = 0;

    // 改用手动行遍历避免eachRow内部错误
    for (let i = 4; i <= defectSheet.rowCount; i++) {
      try {
        rowNumber = i;
        const row = defectSheet.getRow(i);
        if (!row || row.hidden) continue;

        // 安全获取单元格值
        const getCellValue = (col) => {
          const cell = row.getCell(col);
          return cell.value ? cell.value.toString().trim() : "";
        };

        const sampleCode = getCellValue(1);
        const productName = getCellValue(3);

        if (!sampleCode || !productName) continue;

        result.push({
          category: "3",
          toolsMold: sampleCode,
          materialName: productName,
          totalUses: 0,
          usesUntilRevalidation: 0,
          pauseUntilRevalidate: 0,
          timeUntilRevalidation: 0,
          cleaningTime: 0,
          tensionLimit: 0,
          lowerTensionLimit: 0,
          tensionPoints: 0,
          operationType: "I",
          cleanAfterUses: "N",
          cleanAfterPause: "N",
          cleanAfterTime: "N",
        });
      } catch (rowError) {
        console.warn(`跳过第 ${rowNumber} 行，解析错误:`, rowError.message);
      }
    }
    return result;
  } catch (error) {
    console.error("Excel处理失败:", error);
    throw new Error(`处理Excel文件失败: ${error.message}`);
  }
}
