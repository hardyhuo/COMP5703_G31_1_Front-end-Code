<template>
    <div>
        <div>
            <div style="text-align: left;margin-left: 10px">
                <input type="file" @change="handleFileChange">
                <audio controls id="myAudio" ref="audioPlayer">
<!--                  <source :src="audioUrl" type="audio/wav">-->
                  <source :src="this.audio_filepath" type="audio/wav">
<!--                  {{$store.state.file.list[0]}}-->
                </audio>

<!--                        <audio controls id="myAudio" ref="audioPlayer">-->
<!--                          <source :src="audioUrl" type="audio/wav">-->
<!--&lt;!&ndash;                          <source src="@/assets/20170726-AK-005.wav" type="audio/wav">&ndash;&gt;-->
<!--                        </audio>-->
            </div>
            <!--      <div style="text-align: left;margin-left: 10px">-->
            <!--&lt;!&ndash;        <button @click="loadEAF">加载EAF文件</button>&ndash;&gt;-->
            <!--        <input type="file" @change="readEAFContent" accept=".eaf, application/xml">-->
            <!--      </div>-->
        </div>

        <div id="results-container" style="text-align: left" ref="resultsContainer">
            <div v-for="result in results" :key="result.id" :class="{'selected-item':result.isSelected}" :id="result.id">
                <div class="result-container" v-if="!result.isEditing">
                    <div class="edit_font" >
                        <el-button icon="el-icon-video-play" style="margin-right: 10px;" size="mini" circle @click="jumpScroll(result)"/>
                        <a>{{ result.content }}</a>
                    </div>
                    <div class="edit_button" :class="{'selected_edit_button':result.isSelected}">
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTranscription(result)"></el-button>
                    </div>
                </div>
                <div v-if="result.isEditing" class="edit-container">
                    <div style="margin-left: 10px;margin-top: 1px">
                        <!--            <input type="text" :value="result.content">-->
                        <el-input type="text" v-model="result.content"></el-input>
                    </div>
                    <div class="save_button">
                        <el-button type="success" icon="el-icon-check" size="mini" circle @click="saveTranscription(result)"></el-button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <!--      <button @click="get_EAF()">Get the eaf path</button>-->
            <el-button type="primary" plain @click="updateAnnotationValue()" style="margin-left: 10px">Save and Download</el-button>
        </div>

    </div>
</template>


<script>

import request from "@/utils/request";
import {computed} from "vue";

export default {
  name: 'TranscriptionView',
  data() {
    return {
      results: [],
      eaf_filepath:'',
      audio_filepath:"",
      eaf_content:"",
      eaf_name:""
    }
  },
  methods:{
    get_EAF(){
      request.get("/transcribe/result/elan").then(res => {
        const result=JSON.parse(res.data).data.elan;
        // console.log(result);
        this.eaf_content=result
        this.results=this.parseEAF(result);
      })
    },

    // //Upload the eaf file
    async loadEAF() {
      try {

        //use fetch to visit the eaf file
        const response = await fetch(this.eaf_filepath);


        if (!response.ok) {
          throw new Error('Failed to load EAF file');
        }
        this.eaf_content = await response.text();

        this.results=this.parseEAF(this.eaf_content);
      } catch (error) {
        console.error('Error loading EAF file:', error);
      }
    },

    //explain the eaf file
    parseEAF(eafContent) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(eafContent, 'application/xml');

      const timeSlots = xmlDoc.getElementsByTagName('TIME_SLOT');
      const annotations = xmlDoc.getElementsByTagName('ALIGNABLE_ANNOTATION');

      const result = [];


      const timeSlotMap = {};
      for (let i = 0; i < timeSlots.length; i++) {
        const timeSlot = timeSlots[i];
        const id = timeSlot.getAttribute('TIME_SLOT_ID');
        timeSlotMap[id] = timeSlot.getAttribute('TIME_VALUE');
      }


      for (let i = 0; i < annotations.length; i++) {
        const annotation = annotations[i];
        const id = annotation.getAttribute('ANNOTATION_ID');
        const startId = annotation.getAttribute('TIME_SLOT_REF1');
        const endId = annotation.getAttribute('TIME_SLOT_REF2');
        const content = annotation.getElementsByTagName('ANNOTATION_VALUE')[0].textContent;

        const start = timeSlotMap[startId] / 1000;
        const end = timeSlotMap[endId] / 1000;
        const isSelected=false;
        const isEditing=false;

        result.push({
          id,
          start,
          end,
          content,
          isSelected,
          isEditing
        });
      }

      // 排序结果
      result.sort((a, b) => a.start - b.start);

      return result;
    },


    //update the eaf_content
    updateAnnotationValue() {
      const parser = new DOMParser();
      // console.log(this.eaf_content)
      const originalEAFContent=this.eaf_content;
      const results=this.results;

      const xmlDoc = parser.parseFromString(originalEAFContent, 'application/xml');

      for (let i = 0; i < results.length; i++) {
        const resultsItem = results[i];
        const id = resultsItem.id;
        const content = resultsItem.content;

        const annotationElement = xmlDoc.querySelector(`[ANNOTATION_ID="${id}"] ANNOTATION_VALUE`);
        if (annotationElement) {

          annotationElement.textContent = content;
        }
      }

      // 将 xmlDoc 转换为字符串
      this.eaf_content = new XMLSerializer().serializeToString(xmlDoc);
      // console.log(updatedEAFContent);
      this.downloadFile(this.eaf_name+'.eaf');
    },

    //download the eaf file
    downloadFile(fileName) {
      const updatedEAFContent=this.eaf_content;
      const blob = new Blob([updatedEAFContent], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },


    //add audio listener
    handleTimeUpdate() {
      const audioPlayer = this.$refs.audioPlayer;
      const currentTime = audioPlayer.currentTime;

      this.results.forEach((result)=>{
        result.isSelected = currentTime >= result.start && currentTime < result.end;
        // if (currentTime>=result.start&&currentTime<result.end){
        //   result.isSelected=true;
        // }else {
        //   result.isSelected=false;
        // }
        this.scrollSelectedResultIntoView();
      })
    },

    //The font position change method
    scrollSelectedResultIntoView() {
      const resultsContainer = this.$refs.resultsContainer;
      const selectedResult = resultsContainer.querySelector('.selected-item');

      if (selectedResult) {
        // Use a smooth scroll behavior for a nicer effect
        selectedResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },

    //when the transcription font, the scroll will jump to right place
    jumpScroll(result){
      // console.log(result.start);
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.currentTime=result.start;
      audioPlayer.play();
      const timeUpdateHandler=()=>{
        if (audioPlayer.currentTime >= result.end){
          audioPlayer.pause();
          audioPlayer.removeEventListener('timeupdate', timeUpdateHandler);
        }
      };
      audioPlayer.addEventListener('timeupdate', timeUpdateHandler);
    },


    //upload the audio
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.audio_filepath = URL.createObjectURL(file);
        this.$refs.audioPlayer.load();
      }
    },

    //Edit the transcription content
    editTranscription(result){
      this.$refs.audioPlayer.pause();
      result.isEditing=true

    },
    saveTranscription(result){

      result.isEditing=false
    },
    audioUrl1(){
      const file1=this.$store.state.file.list;
      console.log(this.$store.state.file.list)
      const blob =new Blob([file1.raw], { type: 'audio/wav' });
      this.eaf_name=file1.name.slice(0,-4);

      this.audio_filepath=URL.createObjectURL(blob);
    }

  },
  mounted() {
    const audioPlayer = this.$refs.audioPlayer;
    audioPlayer.addEventListener('timeupdate', this.handleTimeUpdate);
    // this.loadEAF();
    this.get_EAF();
    this.audioUrl1()

  },
  beforeDestroy() {

    //destroy the listener
    const audioPlayer = this.$refs.audioPlayer;
    audioPlayer.removeEventListener('timeupdate', this.handleTimeUpdate);
  },
}

</script>



<style scoped>
  .selected-item{
    background-color: #cccccc;
    color: red;
  }
  .result-container{
    display: flex;
    align-items: center;
    margin-top: 3px;
  }
  .edit_font{
    margin-left: 10px;
  }
  .edit-font a{
    font-family: 'Arial', sans-serif;
  }
  .edit_button{
    margin-left: auto;
    margin-right: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .edit_button:hover{
    opacity: 1;
  }
  .selected_edit_button{
    opacity: 1;
  }

  .edit-container{
    display: flex;
    align-items: center;
    margin-top: 3px;
  }

  .save_button{
    margin-left: auto;
    margin-right: 10px;
    margin: 50px;
  }



  #results-container{
    margin-left: 20px;
    width: 450px;
    max-height: 400px;
    overflow-y: auto;
    background-color: antiquewhite;
  }

</style>