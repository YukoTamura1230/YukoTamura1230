<template>
  <div>
    <v-app>
      <v-card width="400" class="mx-auto mt-5">
        <v-card-title>
          <h1 class="display-1">Login</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="empnumber"
            label="従業員コードを入力してください"
            prepend-icon="mdi-account-circle"
            maxlength="7"
          />
          <p v-if="httpstatus==500">利用者情報が未登録です</p>
          <p v-else>{{errmsg}}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <!-- <v-btn color="success">Register</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn v-on:click="recEmpNumber" color="info">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-app>
  </div>
</template>

<script>
export default {
  
  name: "App",
  data: () => ({
    //howPassword: false,
    empnumber: "",
    httpstatus: "-1",
    errmsg: ""
  }),
  methods: {
    recEmpNumber: async function () {
      console.log(this.empnumber)

      try {
        const response = await fetch("https://7j4ghbfcwg.execute-api.ap-northeast-1.amazonaws.com/g/api/emp_inquiry?employeeNumber=" + this.empnumber);
        this.httpstatus = response.status;
        if (response.status != 200) {
          console.error('response.ok:', response.ok);
          console.error('response.status:', response.status);
          console.error('response.statusText:', response.statusText);
          throw new Error(`リクエスト失敗:${response.status} ${response.statusText}`);
        } 

        const jsondata = await response.json();
        console.log("result : " + JSON.stringify(jsondata));

        sessionStorage.setItem('loginUser', this.empnumber)
        console.log(sessionStorage.getItem('loginUser'))
        console.log(this.httpstatus)
        this.$router.push('/menu')

      }
      catch (error) {
        console.log("error: " + error);
      }
    }
  }
};
</script>
