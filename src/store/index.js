import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
// Plug-in installation vuex (also a plug-in for vue, need to use it for plug-in installation initialization)
Vue.use(Vuex)

// create store
const store = new Vuex.Store({
    // Fill in various Vuex data and methods here
    state: {
        model: {
            engineName: '',
            modelName: '',
            dataSetName: '',
            pronDictMapName: ''
        },
        file: {
            // Fill file information
            list:[]
        },
        detail: {
            modelName: '',
            dataSetName: '',
            engineName: '',
            pronDictName: '',
            status: '',
        },

    },
    mutations: {
        setModel(state, obj) {
            state.model.engineName = obj.engineName
            state.model.modelName = obj.modelName
            state.model.dataSetName = obj.dataSetName
            state.model.pronDictMapName = obj.pronDictMapName

        },
        setFile(state, obj) {
            state.file.list=obj.file

        },
        requestTranscribeResult(state) {
            axios({
                url: 'http://localhost:8091/kalid/transcribe',
                params: {
                    model: state.model,
                    file: state.file
                }
            }).then(result => {
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        },
        setDetail(state, obj) {
            state.detail.modelName = obj.modelName
            state.detail.dataSetName = obj.dataSetName
            state.detail.engineName = obj.engineName
            state.detail.pronDictName = obj.pronDictName
            state.detail.status = obj.status

        },
        clearDetail(state) {
            state.detail.modelname = ''
            state.detail.datasetname = ''
            state.detail.enginename = ''
            state.detail.prondictname = ''
            state.detail.status = ''
        }


    }

})

// export store
export default store