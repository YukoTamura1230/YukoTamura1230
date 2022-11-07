<template>
    <div v-if="httpstatus == -1">
        <v-app>
            <v-card width="400" class="mx-auto mt-5">
                <v-card-title>
                <h1 class="display-1">補充担当者照会</h1>
                </v-card-title>
                <v-card-text>
                    <p>担当者情報確認中...</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <!-- <v-btn color="success">Register</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn v-on:click="recEmpNumber" color="info" to="/menu">Menu</v-btn>
                </v-card-actions>
            </v-card>
        </v-app>
    </div>
    <div v-else-if="httpstatus == 200">
        <v-app>
            <v-card width="400" class="mx-auto mt-5">
                <v-card-title>
                <h1 class="display-1">補充担当者照会</h1>
                </v-card-title>
                <v-card-text v-if = "passf == true">
                    <v-text-field v-model="equipmentName" label="補充する備品名を入力"/>
                    <v-text-field v-model="doorNumber" label="補充する扉番号を入力"/>
                    <v-text-field v-model="equipmentNum" label="在庫数"/>
                    <v-text-field v-model="repNum" label="補充数"/>
                    <v-btn @click="makeQRCode()">QRコード作成</v-btn>
                    <vue-qrcode v-if="targetText" :value="targetText" :options="option" tag="img"></vue-qrcode>
                </v-card-text>
                <v-card-text v-else>
                    <p>補充担当者ではありません</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <!-- <v-btn color="success">Register</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn v-on:click="recEmpNumber" color="info" to="/menu">Menu</v-btn>
                </v-card-actions>
            </v-card>
        </v-app>
    </div>
    <div>
        <v-app>
            <v-card width="400" class="mx-auto mt-5">
                <v-card-title>
                <h1 class="display-1">補充担当者照会</h1>
                </v-card-title>
                <v-card-text>
                    <p>利用者登録情報がありません</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <!-- <v-btn color="success">Register</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn v-on:click="recEmpNumber" color="info" to="/menu">Menu</v-btn>
                </v-card-actions>
            </v-card>
        </v-app>
    </div>
</template>

<script>
  import VueQrcode from "@chenfengyuan/vue-qrcode";
  export default {
    components: {
      VueQrcode
    },
    data() {
      return {
        equipmentName: "",
        doorNumber: "",
        refillNum: "",
        job: "",
        passf: "",
        httpstatus: "-1",
        errmsg: "",
        targetText: "",
        option: {
          errorCorrectionLevel: "M",
          maskPattern: 0,
          margin: 10,
          scale: 2,
          width: 300,
          color: {
            dark: "#000000FF",
            light: "#FFFFFFFF"
          }
        }
      };
    },
    methods: {
      generate: function() {
        this.targetText = sessionStorage.getItem('loginUser')
      },
      makeQRCode: function(){
        console.log(JSON.stringify({ employeeNumber: sessionStorage.getItem('loginUser'), equipmentName: this.equipmentName, repNum: this.repNum, doorNumber: this.doorNumber, equipmentNum: this.equipmentNum }))
        this.targetText = JSON.stringify({ employeeNumber: sessionStorage.getItem('loginUser'), equipmentName: this.equipmentName, repNum: this.repNum, doorNumber: this.doorNumber, equipmentNum: this.equipmentNum })
      }
    },
    async mounted() {
        console.log(sessionStorage.getItem('loginUser'))

        try {
            const response = await fetch("https://7j4ghbfcwg.execute-api.ap-northeast-1.amazonaws.com/g/api/emp_inquiry?employeeNumber=" + sessionStorage.getItem('loginUser'));
            this.httpstatus = response.status;
            if (response.status != 200) {
                console.error('response.ok:', response.ok);
                console.error('response.status:', response.status);
                console.error('response.statusText:', response.statusText);
                throw new Error(`リクエスト失敗:${response.status} ${response.statusText}`);
            } 

            const jsondata = await response.json();
            this.job = jsondata
            console.log(this.job['inquiryResult'])

            if( this.job['inquiryResult'] == "True"){
                this.passf = true
            }
            else{
                this.passf = false
            }
      }
      catch (error) {
        console.log("error: " + error);
      }
    }
};
</script>
<style scoped>
</style>