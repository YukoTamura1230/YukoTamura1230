<template>
  <v-btn color="gray" to="/menu">メニューに戻る</v-btn>
  <!-- データ読み込み中 -->
  <div v-if="httpstatus == 0">
    <p>Data Loading…</p>
  </div>
  <!-- HTTPステータス200の場合 -->
  <div v-else-if="httpstatus == 200">
    <p>事前申請＞在庫一覧（{{ length }}件）</p>
    <v-dialog transition="dialog-top-transition">
      <template v-slot:activator="{ props }">
        <v-container>
          <v-row>
            <v-col
              v-for="(item, index) in job"
              :key="item.equipmentName"
              cols="4"
            >
              <v-card color="primary">
                <p>備品名：{{ item.equipmentName }}</p>
                <p>扉番号：{{ item.doorNumber }}</p>
                <p>備品数：{{ item.equipmentNum }}</p>
                <p>申請可能数：{{ item.applicableNum }}</p>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="white"
                    v-bind="props"
                    v-on:click="
                      selectedItem = index;
                      myFunction();
                    "
                    >申請へ<v-icon>mdi-cart-arrow-down</v-icon></v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card v-if="passf == false">
          <v-toolbar color="primary">申請画面</v-toolbar>
          <v-card-text>
            <p>備品名：{{ job[selectedItem].equipmentName }}</p>
            <p>扉番号：{{ job[selectedItem].doorNumber }}</p>
            <p>備品数：{{ job[selectedItem].equipmentNum }}</p>
            <p>申請可能数：{{ job[selectedItem].applicableNum }}</p>
            <v-select
              v-model="numapp"
              :items="items"
              label="申請数"
              solo
              item-value="value"
            ></v-select>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="isActive.value = false">戻る</v-btn>
            <v-btn text @click="buyRegister()">申請する</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-toolbar color="primary">申請画面</v-toolbar>
          <v-card-text>
            <p>備品名：{{ job[selectedItem].equipmentName }}</p>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="isActive.value = false">戻る</v-btn>
            <v-btn text @click="buyRegister()">申請する</v-btn>
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
export default {
  data() {
    return {
      job: null,
      httpstatus: 0,
      selectedItem: null,
      length: 0,
      items: [],
      numapp: 0,
      passf: false,
      erroritem: "",
    };
  },

  //fetch_GET処理
  async mounted() {
    try {
      const response = await fetch(
        "https://54rof88ue4.execute-api.ap-northeast-1.amazonaws.com/g/api/currentstocklist"
      );
      this.httpstatus = response.status;
      if (response.status != 200) {
        console.error("response.ok:", response.ok);
        console.error("response.status:", response.status);
        console.error("response.statusText:", response.statusText);
        throw new Error(
          `リクエスト失敗:${response.status} ${response.statusText}`
        );
      }

      const jsondata = await response.json();
      //this.job = JSON.stringify(jsondata)
      this.job = jsondata.currentStockList;
      this.length = jsondata.currentStockList.length; //JSONデータ量確認
    } catch (error) {
      console.log("error: " + error);
    }
  },
  methods: {
    myFunction() {
      this.numapp = 1;
      this.items = [];
      if (this.job[this.selectedItem].applicableNum === 0) {
        this.items.push(0);
      } else {
        for (let i = 1; i <= this.job[this.selectedItem].applicableNum; i++) {
          this.items.push(i);
        }
      }
      this.open = true;
    },
    buyRegister: async function () {
      console.log(
        JSON.stringify({
          employeeNumber: sessionStorage.getItem("loginUser"),
          equipmentName: this.job[this.selectedItem].equipmentName,
          num: this.numapp,
          doorNumber: this.job[this.selectedItem].doorNumber,
        })
      );

      const requestOptions = {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: { Accept: "application/json" },
        body: JSON.stringify({
          employeeNumber: sessionStorage.getItem("loginUser"),
          equipmentName: this.job[this.selectedItem].equipmentName,
          num: this.numapp,
          doorNumber: this.job[this.selectedItem].doorNumber,
        }),
      };
      try {
        const response = await fetch(
          "https://k07pi81bq4.execute-api.ap-northeast-1.amazonaws.com/g/api/buyregister",
          requestOptions
        );
        this.httpstatus = response.status;
        if (response.status != 200) {
          console.error("response.ok:", response.ok);
          console.error("response.status:", response.status);
          console.error("response.statusText:", response.statusText);
          throw new Error(
            `リクエスト失敗:${response.status} ${response.statusText}`
          );
        }

        const jsondata = await response.json();
        this.job = jsondata;
        console.log(this.job["registerResult"]);

        if (this.job["registerResult"] == "True") {
          this.passf = true;
        } else {
          this.passf = false;
        }
      } catch (error) {
        this.erroritem = error;
        console.log("error: " + error);
        console.log("error: " + error.status);
        console.log("error: " + error.statusText);
      }

      if (this.passf == true) {
        alert("申請登録が正常に完了しました");
      } else {
        alert(
          "××××× 申請登録時、エラーが発生しました!!! ×××××" +
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
