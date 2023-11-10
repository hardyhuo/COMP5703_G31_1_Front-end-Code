<template>
    <div class="transcribe">

        <div id="transcribeTipDiv">
            <img id="transcribeTipLogo" src="@/assets/tipLogo.png" alt="Logo"/>&nbsp;&nbsp;
            Please select a training type according to the file format to train the model.
        </div>

        <div id="transcribeButtonDiv" class="button-container">
            <div class="language-input">

            </div>
        </div>

        <div class="modelInfoTable" v-loading="isLoading">
            <table class="model-table">
                <thead>
                <tr id="tableHead">
                    <th>ID</th>
                    <th>Model Name</th>
                    <th>Model type</th>
                    <th>DataSet Name</th>
                    <th>Status</th>
                    <th>View</th>
                    <th>Selection</th>
                </tr>
                </thead>
                <tbody>
                <!-- insert table and data -->
                <tr v-for="(item,index) in list" :key="index+1">
                    <td>{{index+1}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.engine_name}}</td>
                    <td>{{item.dataset_name}}</td>
                    <td>{{item.status}}</td>
                    <td>
                        <router-link to="/details">
                            <button class="detailButton" @click="confirmDetailFun(item)" :value="item.name">Details
                            </button>
                        </router-link>
                    </td>
                    <td><input type="radio" name="selectModel" v-bind:value="item.name"/></td>
                </tr>
                </tbody>
            </table>
            <router-link to="/upload">
                <button class="confirmButton" @click="confirmFun()" v-show="!isLoading">Confirm</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data() {
            return {
                name: "transcribe",
                language: "",
                list: [],
                isLoading: true
            };
        },
        methods: {
            confirmDetailFun(obj) {
                console.log(obj)
                this.$store.commit('setDetail', {
                    modelName: obj.name,
                    dataSetName: obj.dataset_name,
                    engineName: obj.engine_name,
                    pronDictName: obj.pron_dict_name,
                    status: obj.status,
                    accuracy:obj.results.count_valg
                })
                // console.log(this.$store.state)
            },
            confirmFun() {
                let selectedValue;
                const radioButtonGroup = document.getElementsByName("selectModel");
                for (let i = 0; i < radioButtonGroup.length; i++) {
                    if (radioButtonGroup[i].checked) {
                        selectedValue = radioButtonGroup[i].value;
                        break;
                    }
                }
                // console.log("model name :" + selectedValue)

                const newList = this.list.find(item => item.name === selectedValue)

                this.$store.commit('setModel', {
                    engineName: newList.engine_name,
                    modelName: newList.name,
                    dataSetName: newList.dataset_name,
                    pronDictMapName: newList.pron_dict_name
                })

                // console.log(this.$store.state.model.engineName)
                // console.log("Prepare to send info to back end")

                if (this.$store.state.model.engineName == "hft") {
                    console.log("Send hft model type")
                    axios({
                        url: 'http://localhost:8091/hft/set/model/',
                        method: 'POST',
                        data: this.$store.state.model

                    }).then(result => {
                        console.log(result)
                    }).catch(err => {
                        console.log(err)
                    })
                } else if (this.$store.state.model.engineName == "kaldi") {
                    console.log("Send kaldi model type")
                    axios({
                        url: 'http://localhost:8091/kaldi/set/model/',
                        method: 'POST',
                        data: this.$store.state.model

                    }).then(result => {
                        console.log(result)
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log("Fail to send model information!")
                }


            }
        },
        async created() {

            await axios({
                url: 'http://localhost:8091/list/models',
            }).then(result => {
                this.list = JSON.parse(result.data.data).data.list
                console.log(this.list)


            }).catch(err => {
                console.log(err)
            })
            this.isLoading = false

        },
        directives: {
            loading: {
                inserted(el, binding) {
                    binding.value ? el.classList.add('loading') : el.classList.remove('loading')
                },
                update(el, binding) {
                    binding.value ? el.classList.add('loading') : el.classList.remove('loading')
                }
            }
        }
    }
</script>

<style scoped>
    .transcribe {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #transcribeTipLogo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        vertical-align: middle;
    }

    #transcribeTipDiv {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    p {
        font-size: 18px;
        color: #333;
        margin: 10px;
    }

    .button-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .language-input {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 400px;
    }

    .language-input-box {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        margin-right: 10px;
    }

    .confirmButton {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        position: relative;
        margin: 10px;
        margin-left: 600px;
    }

    .confirmButton:hover {
        background-color: #0056b3;
    }

    .detailButton {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        margin: 2px;

    }

    .detailButton:hover {
        background-color: #0056b3;
    }

    .model-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    #tableHead th {
        background-color: #007bff;
        color: white;
        text-align: center;
        padding: 10px;
    }

    .model-table th,
    .model-table td {
        border: 1px solid #ccc;
        padding: 10px;
    }

    .modelInfoTable {
        margin-top: 20px;
    }

    .loading:before {
        content: '';
        position: absolute;
        left: 30%;
        top: 34%;
        width: 55%;
        height: 37%;
        background: #fff url('../assets/loading.gif') no-repeat center;
    }
</style>