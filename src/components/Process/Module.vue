<style scoped lang="scss">
    .module-box {
        text-align: center;
        background: #409EFF;
        color: #fff;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<template>
    <div class="module-box">{{moduleName}}</div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({})
    export default class Module extends Vue {

        @Prop({
            type: String,
            default: "未知"
        }) moduleName!: string;

    }

</script>