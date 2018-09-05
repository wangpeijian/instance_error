<style scoped lang="scss">
    .json-item {
        padding-left: 20px;
        margin-top: 5px;
        margin-bottom: 5px;
        color: #999;
    }

    .json-brackets {
        margin-top: 5px;
        margin-bottom: 5px;
        color: #333;
    }

    .json-key {
        color: #333;
        padding-right: 5px;
    }
</style>

<template>
    <div class="json-tree">
        <div class="tree">
            <div class="json-brackets" v-if="layer === 0">{</div>

            <div class="json-item" v-for="(item, index) of jsonData" :key="index">

                <span class="json-key" v-if="item.key !== ''">"{{item.key}}":</span>
                <template v-if="item.type === 0">
                    {{"null"}}
                </template>

                <template v-if="item.type === 1">
                    "{{item.value}}"
                </template>

                <template v-if="item.type === 2 || item.type === 3">
                    {{item.value}}
                </template>

                <template v-if="item.type === 4">
                    <span class="json-brackets">[</span>
                    <JsonTree :jsonStr="item.value" :layer="layer+1"/>
                    <span class="json-brackets">]</span>
                </template>

                <template v-if="item.type === 5">
                    <span class="json-brackets">{</span>
                    <JsonTree :jsonStr="item.value" :layer="layer+1"/>
                    <span class="json-brackets">}</span>
                </template>

                <span class="json-brackets" v-if="index < jsonData.length-1">,</span>
            </div>

            <div class="json-brackets" v-if="layer === 0">}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    //json值类型
    enum structureType {
        Null,
        String,
        Int,
        Boolean,
        Array,
        Object,
    }

    //json结构对象
    interface JsonStructure {
        key: string
        value: any
        type: structureType
    }

    @Component({
        // components: {
        //     JsonTree
        // }
    })
    export default class JsonTree extends Vue {
        @Prop({default: {}}) jsonStr: any;

        @Prop({default: 0, required: false}) layer?: Number;

        static checkDataType(data: any): structureType {


            if (data === null || data === undefined) {
                return structureType.Null;
            }

            switch (data.constructor) {
                case String:
                    return structureType.String;
                case Boolean:
                    return structureType.Boolean;
                case Number:
                    return structureType.Int;
                case Array:
                    return structureType.Array;
                case Object:
                    return structureType.Object;
                default:
                    return structureType.Null;
            }
        }

        get jsonData(): Array<JsonStructure> {

            const strArray: Array<JsonStructure> = [];

            if (this.jsonStr.constructor === Array) {

                this.jsonStr.forEach((item: any, index: number) => {

                    let type: structureType = JsonTree.checkDataType(item);

                    strArray.push({
                        key: "",
                        value: item,
                        type: type
                    });
                });

            } else {
                for (const key in this.jsonStr) {
                    const value = this.jsonStr[key];
                    let type: structureType = JsonTree.checkDataType(value);

                    strArray.push({
                        key: key,
                        value: value,
                        type: type
                    });
                }
            }

            return strArray;
        }

    }
</script>