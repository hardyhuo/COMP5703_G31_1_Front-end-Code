<template>
    <div class="container">
        <div class="box1">
            <router-link to="/trans">
                <button class="backButton" @click="backFun()">Back</button>
            </router-link>
        </div>

        <div class="box2">
            <table class="model-table">
                <tr>
                    <td>Model Name:</td>
                    <td>{{$store.state.detail.modelName}}</td>
                </tr>

                <tr>
                    <td>Engine type:</td>
                    <td>{{$store.state.detail.engineName}}</td>
                </tr>

                <tr>
                    <td>Data Set：</td>
                    <td>{{$store.state.detail.dataSetName}}</td>
                </tr>

                <tr>
                    <td>Model Status:</td>
                    <td>{{$store.state.detail.status}}</td>
                </tr>

                <tr>
                    <td>Phonetic Dictionary Name:</td>
                    <td>{{$store.state.detail.pronDictName}}</td>
                </tr>

                <tr>
                    <td>Accuracy:</td>
                    <td>{{$store.state.detail.accuracy}}</td>
                </tr>

                <tr>
                    <td>Result:</td>
                    <td>
                        <span v-if="isNaN(accuracyAcount)">The model has not been trained</span>
                        <span v-else>{{ accuracyAcount.toFixed(2) }}%</span>
                    </td>
                </tr>
            </table>
        </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: "details",
                language: "",

            };
        },
        computed: {
            accuracyAcount() {
                const num = this.$store.state.detail.accuracy
               // const num = "3/7"
                let correctNum = num.split('/')
                console.log(correctNum[0] / correctNum[1])
                return correctNum[0] / correctNum[1] * 100
            }
        },
        created() {

        },
        methods: {
            backFun() {
                this.$store.commit('clearDetail')
            }
        }
    }
</script>

<style scoped>


    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
        height: 100vh;
    }

    .box1 {
        position: absolute;
        top: 160px;
        left: 400px;
    }

    .backButton {
        background-color: #007BFF;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .box2 {
        background-color: #fff;
        padding: 30px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center; /* 居中文本 */
        width: 60%; /* 设置宽度为 80% */
    }

    .model-table {
        width: 100%;
        border-collapse: collapse;
    }

    .model-table tr {
        border-bottom: 2px solid #ccc;

    }

    .model-table td {
        padding: 10px;
        margin: 3px;
    }

    /* Add more CSS styles as needed */


</style>