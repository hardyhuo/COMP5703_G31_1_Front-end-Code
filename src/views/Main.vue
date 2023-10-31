<template>
    <div id="mianPageDiv">


        <div id="fontDiv">
            <img id="tipLogo" src="@/assets/tipLogo.png" alt="Logo"/>&nbsp;&nbsp;
            <h1> Welcome to the Elpis speech transcription System</h1>
        </div>


        <div id="transcribeButtonDiv">
            <img id="transcriptLogo" src="@/assets/transcriptLogo.png" alt="Logo"/>
            <router-link to="/trans">
                <el-button id="transcribeButton" type="primary">Transcribe</el-button>
            </router-link>
        </div>

    </div>

</template>

<script>

    export default {
        name: 'Main',
        methods: {}

    }
</script>

<style scoped>

    #mainContainer {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #mianPageDiv {
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

    #fontDiv {
        margin-bottom: 20px;
    }

    #tipLogo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }

    h1 {
        font-size: 24px;
        color: #333;
    }

    #transcribeButtonDiv {
        display: flex;
        align-items: center;

    }

    #transcriptLogo {
        width: 60px;
        height: 60px;
        margin-left: 50px;
        margin-right: 50px;

    }

    #transcribeButton {
        font-size: 18px;
    }

</style>