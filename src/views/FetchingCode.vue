<template>
  <div v-if="job">
    {{ job }}
  </div>
</template>

<script>
export default {
  // props: ["id"],
  data() {
    return {
      job: null,
    };
  },
  mounted() {
    fetch(
      "https://52b4n4gg52.execute-api.ap-northeast-1.amazonaws.com/d/api/currentstocklist"
    )
      .then((res) => res.json())
      .then((data) => (this.job = data))
      .catch((err) => console.log(err.message));
  },
};
</script>
