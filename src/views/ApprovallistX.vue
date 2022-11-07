<template>
  <v-btn color="gray" to="/menu">メニューに戻る</v-btn>
  <!-- データ読み込み中 -->
  <div v-if="httpstatus == 0">
    <p>Data Loading…</p>
  </div>
  <!-- HTTPステータス200の場合 -->
  <div v-else-if="httpstatus == 200">
    <p>購入＞承認一覧（{{ length }}件）</p>
    <v-dialog transition="dialog-top-transition">
      <template v-slot:activator="{ props }">
        <v-container>
          <v-row>
            <v-col v-for="(item, index) in job" :key="item.name" cols="4">
              <v-card color="orange">
                <p>備品名：{{ item.equipmentName }}</p>
                <p>個数：{{ item.doorNumber }}</p>
                <p>扉番号：{{ item.num }}</p>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-bind="props" v-on:click = "modalDisp(index)">
                    購入へ
                    <v-icon>mdi-stamper</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="primary">購入画面</v-toolbar>
          <v-card-text>
            <p>備品名：{{ job[selectedItem].equipmentName }}</p>
            <p>個数：{{ job[selectedItem].doorNumber }}</p>
            <p>扉番号：{{ job[selectedItem].num }}</p>
            <!-- QRコード表示↓ -->
            <vue-qrcode v-if="targetText" :value="targetText" :options="option" tag="img"></vue-qrcode>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="isActive.value = false" v-on:click="returnMenu()">完了</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
  <!-- HTTPステータスNGの場合 -->
  <div v-else>
    <p>http {{ httpstatus }} Error</p>
  </div>
</template>

<script>
import moment from "moment"; //日付フォーマット用
import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      job: null,
      httpstatus: 0,
      selectedItem: null,
      length: 0,
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
  async mounted() {
    console.log(sessionStorage.getItem("loginUser"));

    try {
      const response = await fetch("https://m1sdzj4kx9.execute-api.ap-northeast-1.amazonaws.com/g/api/approvallist?employeeNumber=" + sessionStorage.getItem("loginUser"));
      this.httpstatus = response.status;
      if (response.status != 200) {
          console.error('response.ok:', response.ok);
          console.error('response.status:', response.status);
          console.error('response.statusText:', response.statusText);
          throw new Error(`リクエスト失敗:${response.status} ${response.statusText}`);
      } 

      const jsondata = await response.json();

      this.job = jsondata.buyRequestOutList;
      this.length = jsondata.buyRequestOutList.length; //JSONデータ量確認


    }
    catch (error) {
      console.log("error: " + error);
    }
  },
  //以下、日付フォーマット
  methods: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
    modalDisp: function(indexno){
      this.selectedItem = indexno
      this.targetText = JSON.stringify({ name: this.job[this.selectedItem].name, employeeNumber: this.job[this.selectedItem].employeeNumber, datetime: this.job[this.selectedItem].datetime, equipmentName: this.job[this.selectedItem].equipmentName, doorNumber: this.job[this.selectedItem].doorNumber, num: this.job[this.selectedItem].num, mailAddress: this.job[this.selectedItem].mailAddress })
      console.log(this.targetText)
    },
    returnMenu: function(){
      window.location.href = "/menu"
    }
  },
};
</script>

<!-- <p>申請者従業員番号：{{ item.employeeNumber }}</p>
<p>申請日時：{{ moment(item.datetime) }}</p>
<p>申請者従業員名：{{ item.name }}</p>
<p>申請者メールアドレス：{{ item.mailAddress }}</p>
<p>ステータス：{{ item.status }}</p>
<p>承認者名：{{ item.approver }}</p>
<p>承認者従業員番号：{{ item.approverEmployeeNumber }}</p>
<p>承認者メールアドレス：{{ item.approverMailAddress }}</p>
<p>副承認者名：{{ item.subApprover }}</p>
<p>副承認者従業員番号：{{ item.subApproverEmployeeNumber }}</p>
<p>副承認者メールアドレス：{{ item.subApproverMailAddress }}</p>
<p>備品名：{{ item.equipmentName }}</p>
<p>個数：{{ item.doorNumber }}</p>
<p>扉番号：{{ item.num }}</p>
<p>承認日時：{{ moment(item.approveDatetime) }}</p> -->
