<style scoped lang="scss">
    .flow {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: row;
        flex-grow: 1;

        &.yet {
            .line {
                background: #909399;
            }
        }

        &.wait {
            .line {
                background: #E6A23C;
            }
        }

        &.success {
            .line {
                background: #67C23A;
            }
        }

        &.fail {
            .line {
                background: #F56C6C;
            }
        }

        &.horizontal {
            position: relative;
        }

        .arrow {
            margin: 10px;
            flex-grow: 1;
            display: flex;
            cursor: pointer;
            /* justify-content: center;
             align-content: center;
             flex-direction: column;*/

            .line {
                width: 150px;
                height: 10px;
                display: inline-block;
                position: relative;

                &.skew {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 30px;
                    transform: rotate(45deg);
                    height: 10px;
                    transform-origin: 30px 0;
                }
            }
        }
    }
</style>

<template>
    <div class="flow" :class="{
            success: requestObj.isSuccess(),
            fail: requestObj.isFail(),
            yet: requestObj.isYet(),
            wait: requestObj.isWait(),
        }">
        <div class="arrow" @click="showDetail">
            <span :style="{transform: `rotate(${rotate}deg)`}">
                <span class="line horizontal">
                <span class="line skew"></span>
            </span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import FlowItem from "../../interface/flowItem";
    import ProcessStatus from "../../enum/ProcessStatus";

    class FlowItemObj implements FlowItem {
        request: any = null;
        status: ProcessStatus = ProcessStatus.yet;

        init(obj: FlowItem) {
            this.request = obj.request;
            this.status = obj.status;
            return this;
        }

        isSuccess(): boolean {
            return this.status === ProcessStatus.success;
        }

        isWait(): boolean {
            return this.status === ProcessStatus.wait;
        }

        isFail(): boolean {
            return this.status === ProcessStatus.fail;
        }

        isYet(): boolean {
            return this.status === ProcessStatus.yet;
        }
    }

    @Component({})
    export default class Flow extends Vue {

        @Prop({
            type: Number,
            default: 0
        }) rotate!: number;

        @Prop() request!: FlowItem;

        showDetail() {
            console.log(this.request);
        }

        get requestObj(): FlowItemObj {
            return new FlowItemObj().init(this.request);
        }
    }
</script>