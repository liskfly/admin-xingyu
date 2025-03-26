<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="mb-2">
                <el-input v-model="getForm.seachText" placeholder="" style="width: 500px"
                    @keyup.enter.native="getChange"></el-input>
                <el-button class="ml-2" type="primary" @click="getChange">查询</el-button>
            </div>
            <el-table :data="tableData" :height="tableHeight" border stripe :style="{ width: '100%' }">
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column prop="line" label="线体" width="60" />
                <el-table-column prop="judgmemtID" label="照合ID" />
                <el-table-column prop="equipmentName" label="设备名称" width="80" />
                <el-table-column prop="judgmemtEquipID" label="照合设备ID" width="100" />
                <el-table-column prop="arouseEquipID" label="引起不良设备ID" />
                <el-table-column prop="equipName" label="设备名称" />
                <el-table-column prop="state" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state == 0" type="info">未处理</el-tag>
                        <el-tag v-if="scope.row.state == 1" type="primary">持续观察</el-tag>
                        <el-tag v-if="scope.row.state == 2" type="warning">设备保养</el-tag>
                        <!-- <el-tag  v-if="scope.row.state == 1" type="primary">调整设备参数</el-tag> -->
                    </template>
                </el-table-column>
                <el-table-column prop="photo" label="不良图片" width="100" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 35px" :src="scope.row.photo" :fit="fit"
                            :preview-src-list="[scope.row.photo]"></el-image>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="value" placeholder="请选择" @change="handleChange($event, scope.row)">
                            <el-option label="持续观察" value="1" />
                            <el-option label="设备保养" value="2" />
                            <el-option label="调整设备参数" value="3" />
                        </el-select>
                        <!-- <el-button type="primary" size="mini" icon="el-icon-document"
                            @click="handleEdit(scope.row)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)"></el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination align="center" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
            <el-table :data="tableData2" border :height="tableHeight2" style="width: 100%">
                <el-table-column type="index" label="序号" width="55" />

                <el-table-column prop="Parameter" label="调整参数"> </el-table-column>

                <el-table-column prop="Unit" label="单位"> </el-table-column>
                <el-table-column prop="Value" label="值"> </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="参数调整" :visible.sync="dialogVisible" width="80%" @close="">
            <div class="flex flex-col border-solid border-2 border-[#bdbdbd]">
                <div>
                    <div class="flex justify-between items-center text-lg h-8 pl-2 pr-2 font-bold">
                        <div>设备名称：{{ editForm.equipName }}</div>
                        <div>设备ID：{{ editForm.judgmemtEquipID }}</div>
                        <div></div>
                        <!-- <div>时间：{{ "2025-02-12 12:12:01" }}</div> -->
                    </div>
                </div>
                <div>
                    <div class="w-full h-8 pl-3 flex items-center text-base text-white bg-cyan">
                        参数调整
                    </div>
                    <el-table :data="editForm.smallBoardTable" style="width: 100%" border :height="460">
                        <el-table-column label="序号" width="55">
                            <template slot-scope="scope">
                                <span>{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="参数">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.parameter" placeholder="请选择"
                                    @change="handleChangeParam($event, scope.row.$index)">
                                    <el-option label="上下温区（一温区）（±8）" value="1" />
                                    <el-option label="上下温区（二温区）（±8）" value="2" />
                                    <el-option label="上下温区（三温区）（±8）" value="3" />
                                    <el-option label="上下温区（四温区）（±8）" value="4" />
                                    <el-option label="上下温区（五温区）（±8）" value="5" />
                                    <el-option label="上下温区（六温区）（±8）" value="6" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit">
                        </el-table-column>
                        <el-table-column label="值">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.val" placeholder="" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template v-slot="{ $index }">
                                <el-button v-if="$index === editForm.smallBoardTable.length - 1" type="text"
                                    icon="el-icon-plus" @click="addSmallBoard" />
                                <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                                    @click="removeBoardItem($index)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="cancelEvent">取消</el-button>
                <el-button type="primary" @click="submitEvent">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    line: "Line1",
                    judgmemtID: "WO25032405110_00001",
                    equipmentName: "AOI",
                    judgmemtEquipID: "107",
                    arouseEquipID: "106",
                    equipName: "回流炉",
                    photo:
                        "data:image/png;base64,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",
                    state: 0,
                },
            ],
            total: 0,
            tableHeight: 0,
            getForm: {
                seachText: "",
                PageIndex: 1,
                PageSize: 10,
            },
            value: "",
            dialogVisible: false,
            editForm: {
                equipName: "",
                equipID: '',
                smallBoardTable: [
                    {
                        Parameter: "1",
                        unit: "℃",
                        val: ""
                    }
                ]
            },
            tableHeight2: 0,
            tableData2: [
                {
                    Parameter: "上下温区（一温区）（±8）",
                    Unit: "℃",
                    Value: "140"
                },
                {
                    Parameter: "上下温区（二温区）（±8）",
                    Unit: "℃",
                    Value: "150"
                },
                {
                    Parameter: "上下温区（三温区）（±8）",
                    Unit: "℃",
                    Value: "160"
                },
                {
                    Parameter: "上下温区（四温区）（±8）",
                    Unit: "℃",
                    Value: "170"
                },
                {
                    Parameter: "上下温区（五温区）（±8）",
                    Unit: "℃",
                    Value: "180"
                },
                {
                    Parameter: "上下温区（六温区）（±8）",
                    Unit: "℃",
                    Value: "190"
                },

            ]
        };
    },
    beforeMount() {
        this.getScreenHeight();
        // this.getData();
    },
    mounted() {
        window.addEventListener("resize", this.getScreenHeight);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getScreenHeight);
    },
    methods: {
        getChange() {
            console.log(this.getForm.seachText);
        },
        handleChange(val, row) {
            console.log(val, row);
            if (val == 3) {
                this.dialogVisible = true;
                this.editForm.equipName = row.equipName;
                this.editForm.judgmemtEquipID = row.judgmemtEquipID;

            }
        },
        handleChangeParam($event, index) {
            console.log($event, index);

        },
        addSmallBoard() {
            this.editForm.smallBoardTable.push({
                parameter: "",
                unit: "℃",
                val: "",
            });
        },
        removeSmallBoardTable(index) {
            this.editForm.smallBoardTable.splice(index, 1);
        },
        cancelEvent() {
            this.dialogVisible = false;
        },
        submitEvent() {
            console.log(this.editForm);
            this.dialogVisible = false;
        },
        handleSizeChange(value) {
            //
            this.getForm.PageSize = value;
            this.getData();
        },
        handleCurrentChange(val) {
            this.getForm.PageIndex = val;
            this.getData();
        },
        getScreenHeight() {
            this.$nextTick(() => {
                this.tableHeight = (window.innerHeight - 190 - 40) * 0.6;
                this.tableHeight2 = (window.innerHeight - 190 - 40) * 0.4;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
    padding: 10px;
}
</style>
