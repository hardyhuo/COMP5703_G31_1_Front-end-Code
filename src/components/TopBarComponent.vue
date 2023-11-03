<template>
    <div class="header-bar">
        <!-- Logo -->
        <img src="@/assets/elpis.png" alt="Logo" class="logo"/>

        <!-- Language selection drop-down box -->
        <p>language:
            <select v-model="selectedLanguage" @change="changeLanguage">
                <option value="English">English</option>
                <option value="SimpleChinese">Simple Chinese</option>
                <option value="Korean">Korean</option>
            </select>
        </p>
        <!-- Help button -->
        <button @click="showHelp">Help</button>

        <p id="timeShow">&nbsp;&nbsp;Current Time: {{ currentTime }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedLanguage: "English",              //default language
                currentTime: '',               // default time
            };
        }, mounted() {
            // update time every second
            this.updateTime();
            setInterval(this.updateTime, 1000);
        },
        beforeDestroy() {
            // Clear timer before component destruction
            clearInterval(this.updateTime);
        },
        methods: {
            changeLanguage() {
                //This is where you can trigger actions to change the language
                // console.log('Select language：', this.selectedLanguage);
            },
            showHelp() {
                open("https://elpis.readthedocs.io/en/latest/")
            },
            updateTime() {
                const now = new Date();
                const formattedData = now.toLocaleDateString()
                const formattedTime = now.toTimeString()
                this.currentTime = formattedData + " " + formattedTime;
            }
        }
    }
</script>


<style scoped>
    .header-bar {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #FFFFFF;
        color: white;
        padding: 10px;
    }

    .logo {
        width: 200px;
        height: 50px;
        background-color: #5c5454;
    }

    p {
        position: absolute;
        left: 18%;
        top: 20%;
        color: black;
        border: none;
        padding: 5px;
        font-size: 14px;

    }

    button {
        background-color: #1b51f6;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 14px;
    }

    button:hover {
        background-color: #555;
    }

    #timeShow {
        left: 50%;
        top: 20%;
    }

</style>