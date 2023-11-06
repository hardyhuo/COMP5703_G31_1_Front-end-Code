<template>
  <el-upload
      class="upload-demo"
      ref="upload"
      action="https://localhost:8091"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">Select file</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="checkModel1" :disabled="this.disabledValue">upload to Elpis</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="checkModel2" :loading="this.isDataReceived">start</el-button>
  </el-upload>
</template>

<script>
import Request from "@/utils/request";

export default {
  name: "Upload",
  data() {
    return {
      fileList: [],
      disabledValue: false,
      isDataReceived: false
    }
  },
  methods: {
    checkModel2(){
      if(this.$store.state.model.engineName === 'kaldi')
        this.checkIfFinishKaldi();
      else
        this.checkIfFinishHFT();
      this.disabledValue = false;
    },
    checkIfFinishHFT() {

      this.isDataReceived = true;


      Request.get('/hft/transcribe2')
          .then(res => {
            let parsedData = JSON.parse(res.data);
            let statusCode = parsedData.status;
            console.log('Status:', statusCode);


            if (statusCode === 200) {
              this.$message({ message: 'Transcription completed!', type: 'success' });
            } else {
              this.$message({ message: 'Status is not 200.', type: 'error' });
            }


            this.isDataReceived = false;
          })
          .catch(error => {
            console.log('Check error:', error); // for debug
            this.$message({ message: 'Failed to check: ' + error, type: 'error' });


            // this.isDataReceived = true;
          });
    },
    checkIfFinishKaldi() {

      this.isDataReceived = true;


      Request.get('/kaldi/transcribe2')
          .then(res => {
            let parsedData = JSON.parse(res.data);
            let statusCode = parsedData.status;
            console.log('Status:', statusCode);


            if (statusCode === 200) {
              this.$message({ message: 'Transcription completed!', type: 'success' });
            } else {
              this.$message({ message: 'Status is not 200.', type: 'error' });
            }


            this.isDataReceived = false;
          })
          .catch(error => {
            console.log('Check error:', error); // for debug
            this.$message({ message: 'Failed to check: ' + error, type: 'error' });


            // this.isDataReceived = true;
          });
    },
    checkModel1(){
      this.$store.commit('setFile',{
        file:this.fileList[0]
      })
      console.log(this.$store.state.file.list)
      if(this.$store.state.model.engineName === 'kaldi')
        this.submitUploadKaldi();
      else
        this.submitUploadHFT();

      this.disabledValue = true;
    },
    submitUploadKaldi() {
      const formData = new FormData();

      // Append each file from fileList to the formData
      this.fileList.forEach(file => {
        formData.append('file', file.raw);  // 'file' is the field name. Adjust based on backend requirements.
      });

      const options = {
        url: '/kaldi/upload2',
        method: 'post',
        data: formData,
        transformRequest: [function (data, headers) {
          // Remove the default 'Content-Type' for post requests
          delete headers['Content-Type'];
          return data;
        }]
      };

      // Send the request using your custom request object
      Request(options)
          .then(res => {
            let parsedData = JSON.parse(res.data); // Assuming the response is a string that needs parsing.
            let statusCode = parsedData.status;   // Adjust based on your backend's response structure.

            if (statusCode === 200) {
              this.$message({message: 'Upload success!', type: 'success'});
            } else {
              this.$message({message: 'Status is not 200.', type: 'error'});
            }
          })
          .catch(error => {
            console.log('Upload error:', error);
            this.$message({message: 'Upload failed: ' + error, type: 'error'});
          });
    },
    submitUploadHFT() {
      const formData = new FormData();

      // Append each file from fileList to the formData
      this.fileList.forEach(file => {
        formData.append('file', file.raw);  // 'file' is the field name. Adjust based on backend requirements.
      });

      const options = {
        url: '/hft/upload2',
        method: 'post',
        data: formData,
        transformRequest: [function (data, headers) {
          // Remove the default 'Content-Type' for post requests
          delete headers['Content-Type'];
          return data;
        }]
      };

      // Send the request using your custom request object
      Request(options)
          .then(res => {
            let parsedData = JSON.parse(res.data); // Assuming the response is a string that needs parsing.
            let statusCode = parsedData.status;   // Adjust based on your backend's response structure.

            if (statusCode === 200) {
              this.$message({message: 'Upload success!', type: 'success'});
            } else {
              this.$message({message: 'Status is not 200.', type: 'error'});
            }
          })
          .catch(error => {
            console.log('Upload error:', error);
            this.$message({message: 'Upload failed: ' + error, type: 'error'});
          });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      this.fileList = [...fileList];
    }
  }
}
</script>

<style scoped>

</style>