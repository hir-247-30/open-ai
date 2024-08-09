<template>
  <v-container>
    <v-textarea
      bg-color="grey-lighten-2"
      color="cyan"
      label="質問をどうぞ"
      v-model="question"
      :disabled="questionDisabled"
    ></v-textarea>
    <v-col cols="auto">
      <v-btn density="default" @click="doRequest">送信</v-btn>
    </v-col>
    <v-textarea
      bg-color="amber-lighten-4"
      color="orange orange-darken-4"
      label="返事"
      v-model="response"
      rows="10"
      disabled
    ></v-textarea>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosResponse } from "axios";
type apiResponse = {
  result: string
}
export default Vue.extend({
  data () {
    return {
      question: '',
      response: '',
      questionDisabled: false
    }
  },
  methods: {
    doRequest () {
      if(this.question === '') return;

      this.questionDisabled = true;
      this.response = 'リクエスト中・・・';

      this.$axios.post('/api/question', {
          sentence: this.question,
          timeout: 20000,
        })
        .then((res: AxiosResponse<apiResponse>) => {
          this.response = res.data.result;
        })
        .catch((error: unknown) => {
          this.response = '送信に失敗しました。コンソールログを確認してください。';
          console.log(error);
        })
        .finally(() => {
          this.questionDisabled = false;
        });
    }
  }
})
</script>
