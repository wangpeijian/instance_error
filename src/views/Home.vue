<style scoped lang="scss">
    .open-btn {
        cursor: pointer;
    }
</style>

<template>
    <div class="home">

        <el-form ref="form" :model="form" label-width="80px" :inline="true">
            <el-form-item label="接口">
                <el-select v-model="BASE_API_URL" placeholder="接口地址" @change="value=>getPage()">
                    <el-option
                            v-for="item in apiOptions"
                            :key="item.url"
                            :label="item.display"
                            :value="item.url">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="接口url">
                <el-input v-model="BASE_API_URL_CUSTOMER" placeholder="接口url" @change="value=>getPage()"
                          :clearable="true"></el-input>
            </el-form-item>

            <el-form-item label="实例id">
                <el-input v-model="form.instanceBizId" placeholder="实例id" @change="value=>getPage()"
                          :clearable="true"></el-input>
            </el-form-item>

            <el-form-item label="requestId">
                <el-input v-model="form.requestId" placeholder="requestId" @change="value=>getPage()"
                          :clearable="true"></el-input>
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="状态" @change="value=>getPage()" :clearable="true">
                    <el-option
                            v-for="item in statusOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <hr>

        <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="getPage"
        >
        </el-pagination>

        <el-table
                :data="tableData"
                max-height="800"
        >
            <el-table-column
                    prop="instanceBizId"
                    label="实例id"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="lastCallTime"
                    label="调用时间"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="requestId"
                    label="requestId"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="toModule"
                    label="调用模块"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="requestAction"
                    label="调用方法"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="times"
                    label="调用次数"
                    width="200">
            </el-table-column>

            <el-table-column
                    label="详情"
                    width="200">
                <template slot-scope="scope">
                    <el-button type="success" :disabled="disabledDetail" @click="toDetail(scope.row.requestId)">详情
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column
                    prop="request"
                    label="request"
                    width="800"
            >
                <template slot-scope="scope">
                    <el-button @click="scope.row._showJson = !scope.row._showJson">{{scope.row._showJson ? '隐藏':
                        '展开'}}
                    </el-button>
                    <JsonTree v-show="scope.row._showJson" :jsonStr="scope.row.request"/>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="getPage">
        </el-pagination>


        <el-dialog
                :fullscreen="true"
                title="接口调用流程"
                :visible.sync="centerDialogVisible"
                center>
            <InstanceProcess v-if="centerDialogVisible" :bizLog="bizLog" :allianceLog="allianceLog"/>
        </el-dialog>


    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Res} from "../interface";
    import JsonTree from "../components/JsonTree.vue";
    import InstanceProcess from "../components/InstanceProcess.vue";

    interface SearchForm {
        instanceBizId?: string;
        requestId?: string;
        status?: string;
    }

    interface API {
        url: string;
        display: string;
    }

    const _ALLIANCE_API = "http://citic-instance-alliance.zhongxin.devops.c.citic/";
    const _CONTROLLER = "citic/instance/requesthis/all/page";

    @Component({
        components: {
            JsonTree,
            InstanceProcess
        }
    })
    export default class Home extends Vue {

        BASE_API_URL: string = _ALLIANCE_API;
        BASE_API_URL_CUSTOMER: string = "";

        tableData: Array<any> = [];
        total: number = 0;
        form: SearchForm = {
            instanceBizId: "",
            requestId: "",
            status: ""
        };
        statusOptions: Array<string> = ["ready", "done", "biz_failed", "exception"];

        //接口地址
        apiOptions: Array<API> = [{
            url: _ALLIANCE_API,
            display: "云联盟",
        }, {
            url: "http://citic-instance-biz.zhongxin.devops.c.citic/",
            display: "中信云",
        }];

        centerDialogVisible: boolean = false;
        bizLog: Array<any> = [];
        allianceLog: Array<any> = [];

        created() {
            this.getPage();
        }

        getPage(pageIndex = 1) {
            const form: SearchForm = this.form;
            if (!form.instanceBizId)
                delete form.instanceBizId;
            if (!form.requestId)
                delete form.requestId;
            if (!form.status)
                delete form.status;

            this.$post(`${this.listApi}${_CONTROLLER}?pageIndex=${pageIndex}`, form).then((res: Res) => {
                this.tableData = res.data.content.map((item: any) => {
                    item._showJson = false;
                    return item;
                });
                this.total = res.data.totalElements;
            }).catch(e => {
                this.tableData = [];
                this.total = 0;
            });
        }

        toDetail(requestId: string) {
            Promise.all([
                this.$post(`${this.listApi}${_CONTROLLER}`, {requestId}),
                this.$post(`${_ALLIANCE_API}${_CONTROLLER}`, {requestId})
            ]).then(res => {
                this.bizLog = res[0].data.content;
                this.allianceLog = res[1].data.content;
                this.centerDialogVisible = true;
            });
        }

        get disabledDetail() {
            const api = this.listApi;
            return api === _ALLIANCE_API;
        }

        get listApi(): string {
            return this.BASE_API_URL_CUSTOMER || this.BASE_API_URL;
        }
    }
</script>
