<template>
  <v-app id="inspire">
    <v-main>
      <v-btn color="gray" to="/menu">メニューに戻る</v-btn>
      <!-- データ読み込み中 -->
      <div v-if="httpstatus == 0">
        <p>Data Loading…</p>
      </div>
      <!-- HTTPステータス200の場合 -->
      <div v-else-if="httpstatus == 200">
        <p>事前承認＞承認一覧（{{ length }}件）</p>
        <v-dialog transition="dialog-top-transition">
          <template v-slot:activator="{ props }">
            <v-container>
              <v-row>
                <v-col v-for="(item, index) in job" :key="item.name" cols="4">
                  <v-card color="lime">
                    <p>申請者従業員名：{{ item.name }}</p>
                    <p>申請者従業員番号：{{ item.employeeNumber }}</p>
                    <p>承認者名：{{ item.approver }}</p>
                    <p>副承認者名：{{ item.subApprover }}</p>
                    <p>申請日時：{{ moment(item.datetime) }}</p>
                    <p>備品名：{{ item.equipmentName }}</p>
                    <p>個数：{{ item.num }}</p>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        v-bind="props"
                        v-on:click="
                          selectedItem = index;
                          open = true;
                        "
                      >
                        承認へ
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
              <v-toolbar color="primary">承認画面</v-toolbar>
              <v-card-text>
                <p>申請者従業員名：{{ job[selectedItem].name }}</p>
                <p>申請者従業員番号：{{ job[selectedItem].employeeNumber }}</p>
                <p>承認者名：{{ job[selectedItem].approver }}</p>
                <p>副承認者名：{{ job[selectedItem].subApprover }}</p>
                <p>申請日時：{{ moment(job[selectedItem].datetime) }}</p>
                <p>備品名：{{ job[selectedItem].equipmentName }}</p>
                <p>個数：{{ job[selectedItem].num }}</p>
              </v-card-text>

              <v-card-actions class="justify-end">
                <v-btn text @click="isActive.value = false">戻る</v-btn>
                <v-btn
                  text
                  @click="isActive.value = false"
                  v-on:click="approvalRejection('False')"
                  >否認</v-btn
                >
                <v-btn
                  text
                  @click="isActive.value = false"
                  v-on:click="approvalRejection('True')"
                  >承認</v-btn
                >
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <!-- HTTPステータスNGの場合 -->
      <div v-else>
        <h1>HTTP {{ httpstatus }}</h1>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import moment from "moment"; //日付フォーマット用

export default {
  data() {
    return {
      job: null,
      httpstatus: 0,
      selectedItem: null,
      length: 0,
      passf: false,
    };
  },
  async mounted() {
    console.log(sessionStorage.getItem("loginUser"));

    try {
      const response = await fetch(
        "https://pq2t7lxm13.execute-api.ap-northeast-1.amazonaws.com/g/api/buyrequestlist?approverEmployeeNumber=" +
          sessionStorage.getItem("loginUser")
      );
      this.httpstatus = response.status;
      if (response.status !== 200) {
        console.error("response.ok:", response.ok);
        console.error("response.status:", response.status);
        console.error("response.statusText:", response.statusText);
        throw new Error(
          `リクエスト失敗:${response.status} ${response.statusText}`
        );
      }

      const jsondata = await response.json();

      this.job = jsondata.buyRequestOutList;
      this.length = jsondata.buyRequestOutList.length; //JSONデータ量確認
    } catch (error) {
      console.log("error: " + error);
    }
  },
  //以下、日付フォーマット
  methods: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },

    approvalRejection: async function (result) {
      try {
        console.log(
          JSON.stringify({
            employeeNumber: this.job[this.selectedItem].employeeNumber,
            datetime: this.job[this.selectedItem].datetime,
            equipmentName: this.job[this.selectedItem].equipmentName,
            equipmentNum: this.job[this.selectedItem].num,
            result: result,
          })
        );

        const requestOptions = {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          headers: { Accept: "application/json" },
          body: JSON.stringify({
            employeeNumber: this.job[this.selectedItem].employeeNumber,
            datetime: this.job[this.selectedItem].datetime,
            equipmentName: this.job[this.selectedItem].equipmentName,
            equipmentNum: this.job[this.selectedItem].num,
            result: result,
          }),
        };
        const response = await fetch(
          "https://gcjwizp8ri.execute-api.ap-northeast-1.amazonaws.com/g/api/approvalrejection",
          requestOptions
        );
        this.httpstatus = response.status;
        if (response.status != 200) {
          this.passf = false;
          console.error("response.ok:", response.ok);
          console.error("response.status:", response.status);
          console.error("response.statusText:", response.statusText);
          throw new Error(
            `リクエスト失敗:${response.status} ${response.statusText}`
          );
        } else {
          this.passf = true;
        }
      } catch (error) {
        console.log("error: " + error);
      }

      if (this.passf == true) {
        alert("承認・否認処理が正常に完了しました");
      } else {
        alert(
          "××××× 承認・否認処理時、エラーが発生しました!!! ×××××" +
            "\r\n\r\n" +
            "エラー内容：" +
            this.erroritem
        );
      }

      location.reload(true);
    },
  },
};
</script>
