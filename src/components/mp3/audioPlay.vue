<template>
  <div>
    <!-- 隐藏audio元素，通过JavaScript控制播放 -->
    <audio ref="audioPlayer" id="audio" :src="audioSrc" @ended="onEnded"></audio>
    <!-- 可选：提供一个按钮来控制播放 -->
    <!-- <button @click="playAlert" :disabled="isPlaying">{{ isPlaying ? '正在播放' : '播放语音' }}</button>   -->
  </div>
</template>

<script>
export default {
  props: {
    // 允许外部传入音频文件的URL
    audioSrc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isPlaying: false, // 控制播放状态
    };
  },
  methods: {
    playAlert() {
      let video = document.getElementById('audio');  
    //   video.muted = true;  
      if (!this.isPlaying) {
        const audio = this.$refs.audioPlayer;
        audio
          .play()
          .then(() => {
            console.log('成功');
            
            this.isPlaying = true;
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: "播放失败:" + error,
            });
            //   console.error('播放失败:', error);
          });
      }
    },
    onEnded() {
      this.isPlaying = false;
      // 可以在这里添加播放完毕后的逻辑
      // console.log('语音播报完毕');
    },
  },
};
</script>

<style scoped>
/* 组件样式 */
</style>
