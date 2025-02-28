import * as XLSX from "xlsx";

export function getXLSX(allData, columns,name) {
  return new Promise((resolve, reject) => {
    if (!allData || allData.length === 0 || !columns) {
        return;
    }
    try {
      // 3. 构造 Excel 表头（与 el-table 列一致）
      const headers = columns
        .filter((col) => col.property && col.label) // 过滤有效列
        .map((col) => ({
          header: col.label, // Excel 表头名称（与 el-table 列名一致）
          key: col.property, // 数据字段键名
        }));

      // 5. 构造工作表数据（兼容 el-table 的 formatter）
      const worksheetData = [
        headers.map((h) => h.header), // 第一行为表头
        ...allData.map((item) =>
          headers.map((h) => {
            // 查找列配置中的 formatter
            const column = columns.find((c) => c.property === h.key);
            return column?.formatter
              ? column.formatter(item) // 如果定义了 formatter，使用格式化后的值
              : item[h.key];
          })
        ),
      ];

      // 6. 生成 Excel 文件
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, name + ".xlsx");
      XLSX.writeFile(workbook, name + ".xlsx");
      resolve();
    } catch (error) {
      reject();
    }
  });
}
