<script setup>

const props = defineProps(["tableTitle", "tableColumns"])

</script>

<template>
    <div class="table-title">
        {{ props.tableTitle }}
    </div>
    <div class="table-container">
        <table class="table-layout">
            <thead>
                <tr class="table-header">
                    <td v-for="col in JSON.parse(props.tableColumns)">{{col}}</td>
                </tr>
            </thead>
            <tbody>
                <!-- The actual table content comes from the parent component as slot. -->
                <slot></slot>
            </tbody>
        </table>
    </div>
</template>

<style>

    .table-header {
        background: #04AA6D;
        font-weight: bold;
        color: white;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .table-container {
        margin: 20px;
    }

    /** Makes every second row slightly more gray. */
    .table-container tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }

    /** Makes every second row slightly more gray. */
    .table-container tr:last-of-type {
        border-bottom: 2px solid #04AA6D;
    }

    .table-title {
        font-weight: bold;
        margin: 20px;
    }

    .table-layout {
        width: 100%;
        word-wrap: break-word;
        border-collapse: collapse;
    }

</style>