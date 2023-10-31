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
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server
        </el-button>
    </el-upload>
</template>

<script>
    import Request from "@/utils/request";

    export default {
        name: "Upload",
        data() {
            return {
                fileList: []
            }
        },
        methods: {
            submitUpload() {
                const formData = new FormData();

                // Append each file from fileList to the formData
                this.fileList.forEach(file => {
                    formData.append('files', file.raw);  // 'files' is the field name. Adjust based on backend requirements.
                });

                const options = {
                    url: '/hft/transcribe',
                    // header: 'application/json',
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
                        if (res.code === '0') {  // Ensure you navigate correctly through the response object
                            this.$message({message: 'Upload success!', type: 'success'});
                            // Optionally, clear the fileList if needed: this.fileList = [];
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    })
                    .catch(error => {
                        console.log('Upload error:', error); // for debug
                        this.$message({message: 'Upload failed: ' + error, type: 'error'});
                    });


            }
            ,
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