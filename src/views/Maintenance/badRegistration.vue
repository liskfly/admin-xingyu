<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div
                class="mb-2 pl-2 pr-2 flex justify-between items-center text-xl font-bold border-solid border-2 border-[#bdbdbd]">
                <div>线体：{{ "Line1" }}</div>
                <div>设备：{{ "SPI" }}</div>
                <div class="text-2xl"><i class="el-icon-setting"></i></div>
            </div>
            <div>
                <el-form ref="formRef" :model="form" label-width="auto">
                    <el-form-item label="PCB条码" prop="pcbBarcode" class="mb-2">
                        <el-input v-model="form.pcbBarcode" placeholder="请输入PCB条码" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-table :data="form.smallBoardTable" border :style="{ width: '100%' }" :height="tableHeight">
                        <el-table-column label="序号" width="60" align="center">
                            <template v-slot="{ $index }">{{ $index + 1 }}</template>
                        </el-table-column>
                        <el-table-column prop="date" label="不良位号">
                            <template v-slot="{ row }">
                                <el-input v-model="row.badTags" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="不良料号">
                            <template v-slot="{ row }">
                                <el-input v-model="row.badPartNumber" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="不良现象">
                            <template v-slot="{ row }">
                                <el-input v-model="row.badPhenomenon" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template v-slot="{ $index }">
                                <el-button v-if="$index === form.smallBoardTable.length - 1" type="text"
                                    icon="el-icon-plus" @click="addSmallBoard" />
                                <el-button v-else type="text" icon="el-icon-delete" class="text-red-500"
                                    @click="removeBoardItem($index)" />
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <el-form-item label="不良位号" prop="zone">
                        <el-input v-model="form.zone" placeholder="请输入不良位号" style="width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item label="不良料号" prop="zone">
                        <el-input v-model="form.zone" placeholder="请输入不良料号" style="width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item label="不良现象" prop="badPhenomenon">
                        <el-select v-model="form.badPhenomenon" placeholder="请选择" style="width: 240px;">
                            <el-option label="缺件" value="缺件" />
                            <el-option label="漏焊" value="漏焊" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item></el-form-item>
                </el-form>
                <div class="flex justify-end"> <el-button>重置</el-button><el-button type="primary">提交</el-button></div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                pcbBarcode: "",
                smallBoardTable: [
                    {
                        badTags: "",
                        badPartNumber: "",
                        badPhenomenon: ""
                    }
                ]
            },
            tableHeight:0
        }
    },
    beforeMount() {
    this.getScreenHeight();
  },
  mounted() {

    window.addEventListener("resize", this.getScreenHeight);
    // this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getScreenHeight);
  },
    methods:{
        addSmallBoard() {
            this.form.smallBoardTable.push({
                badTags: "",
                badPartNumber: "",
                badPhenomenon: ""
            });
        },
        getScreenHeight() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 280;
        // this.tableHeight1 =
      });
    },
    }
};
</script>

<style lang="scss" scoped></style>
