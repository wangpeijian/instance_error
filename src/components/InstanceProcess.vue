<style scoped lang="scss">
    .instance-process {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 600px;

        .process-line {
            flex-grow: 1;
            display: flex;

            &.major-line {

            }

            .item {
                height: 200px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>

<template>
    <div class="instance-process">

        <div class="process-line major-line">
            <div class="item">
                <Module moduleName="order"/>
            </div>

            <div class="item">
                <Flow :request="requestMap.order_request"/>
                <Flow :rotate="180" :request="requestMap.push_order"/>
            </div>

            <div class="item">
                <Module moduleName="instance-biz"/>
            </div>

            <div class="item">
                <Flow :request="requestMap.alliance_create"/>
                <Flow :rotate="180" :request="requestMap.alliance_call_back"/>
            </div>

            <div class="item">
                <Module moduleName="instance-alliance"/>
            </div>

            <div class="item">
                <Flow :request="requestMap.adapter_create"/>
                <Flow :rotate="180" :request="requestMap.adapter_call_back"/>
            </div>

            <div class="item">
                <Module moduleName="adapter"/>
            </div>
        </div>

        <div class="process-line middle">

            <div class="item"></div>
            <div class="item"></div>

            <div class="item">
                <Flow :rotate="90" :request="requestMap.push_bill"/>
            </div>

            <div class="item"></div>

            <div class="item">
                <Flow :rotate="90" :request="requestMap.push_alliance_bill"/>
            </div>

            <div class="item"></div>
            <div class="item"></div>
        </div>

        <div class="process-line sub-line">

            <div class="item"></div>
            <div class="item"></div>

            <div class="item">
                <Module moduleName="bill-biz"/>
            </div>

            <div class="item"></div>

            <div class="item">
                <Module moduleName="bill-alliance"/>
            </div>

            <div class="item"></div>
            <div class="item"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Flow from "./Process/Flow.vue";
    import Module from "./Process/Module.vue";
    import ProcessStatus from "../enum/ProcessStatus";
    import FlowItem from "../interface/flowItem";

    interface ReqMap {
        order_request?: FlowItem,
        alliance_create?: FlowItem,
        adapter_create?: FlowItem,
        adapter_call_back?: FlowItem,
        alliance_call_back?: FlowItem,
        push_alliance_bill?: FlowItem,
        push_order?: FlowItem,
        push_bill?: FlowItem,
    }

    @Component({
        components: {
            Flow,
            Module
        }
    })
    export default class InstanceProcess extends Vue {
        @Prop({}) bizLog!: Array<any>;

        @Prop({}) allianceLog!: Array<any>;

        flowArray: Array<FlowItem> = [];

        mounted() {

        }

        getProcessStatus(status?: string): ProcessStatus {
            switch (status) {
                case "ready":
                    return ProcessStatus.wait;
                case "done":
                    return ProcessStatus.success;
                case "biz_failed":
                case "exception":
                    return ProcessStatus.fail;
                default :
                    return ProcessStatus.yet;
            }
        }

        get requestMap(): ReqMap {

            const reqMap = {
                order_request: {
                    status: ProcessStatus.success,
                    request: null
                },
                alliance_create: {
                    status: ProcessStatus.yet,
                    request: null
                },
                adapter_create: {
                    status: ProcessStatus.yet,
                    request: null
                },
                adapter_call_back: {
                    status: ProcessStatus.yet,
                    request: null
                },
                alliance_call_back: {
                    status: ProcessStatus.yet,
                    request: null
                },
                push_alliance_bill: {
                    status: ProcessStatus.yet,
                    request: null
                },
                push_order: {
                    status: ProcessStatus.yet,
                    request: null
                },
                push_bill: {
                    status: ProcessStatus.yet,
                    request: null
                },
            };

            this.bizLog.forEach((log: any) => {

                const status: ProcessStatus = this.getProcessStatus(log.status);
                const flowItem = {status, request: log};

                switch (log.toModule) {
                    case "alliance_instance":
                        reqMap.alliance_create = flowItem;
                        break;
                    case "order":
                        reqMap.push_order = flowItem;
                        break;
                    case "bill":
                        reqMap.push_bill = flowItem;
                        break;
                }
            });

            this.allianceLog.forEach((log: any) => {

                const status: ProcessStatus = this.getProcessStatus(log.status);
                const flowItem = {status, request: log};

                switch (log.toModule) {
                    case "adapter":
                        reqMap.adapter_create = flowItem;

                        //有实例回调说明 适配器发送了回调请求
                        if (status === ProcessStatus.success) {
                            reqMap.adapter_call_back = {status: ProcessStatus.wait, request: null};
                        } else {
                            reqMap.adapter_call_back = {status: ProcessStatus.yet, request: null};
                        }

                        break;
                    case "instance":
                        reqMap.alliance_call_back = flowItem;

                        //判断 reqMap.adapter_create 是否成功

                        if (reqMap.adapter_call_back.status === ProcessStatus.wait) {
                            reqMap.adapter_call_back = {status: ProcessStatus.success, request: null};
                        }

                        break;
                    case "bill":
                        reqMap.push_alliance_bill = flowItem;
                        break;
                }
            });

            return reqMap;
        }

    }
</script>