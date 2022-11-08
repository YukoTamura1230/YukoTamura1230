<template>
  <v-app>
    <v-card width="400" class="mx-auto mt-10" color="primary">
      <v-row justify="center">
        <v-card-actions>
          <v-btn height="50" width="400" color="white" to="/currentStockList">
            ①事前申請
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card width="400" class="mx-auto mt-10" color="primary">
      <v-row justify="center">
        <v-card-actions>
          <v-btn height="50" width="400" color="white" to="/BuyRequestOutList"
            >②事前承認
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card width="400" class="mx-auto mt-10" color="primary">
      <v-row justify="center">
        <v-card-actions>
          <v-btn height="50" width="400" color="white" to="/ApprovallistX">③購入</v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
    <v-card width="400" class="mx-auto mt-10" color="primary">
      <v-row justify="center">
        <v-card-actions>
          <v-btn height="50" width="400" color="white" to="/EmpInquiry">④補充</v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
  </v-app>
</template>

<!-- <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">①事前申請</h1>
      </v-card-title>
      <v-card-text>
        <p>
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success">＞申請へ</v-btn>
      </v-card-actions>
    </v-card> -->
<!-- <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="display-1">②事前承認</h1>
      </v-card-title>
      <v-card-text>
        <p>
          XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success">＞承認へ</v-btn>
      </v-card-actions>
    </v-card> -->
