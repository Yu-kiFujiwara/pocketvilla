<template lang="pug">
  .container
    div.w-screen.text-center.content-start.justify-center.justify-between
      video#my-video.float-left(muted="true" width="500px" height="300px" autoplay playsinline)
      video#their-video(width="500px" height="300px" autoplay playsinline)
    .container.main.w-screen.text-center
      span マイク:
      select(class="focus:outline-none focus:shadow-outline" v-model="selectedAudio" @change="onChange")
        option(disabled value="") Please select one
        option(v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value") {{ audio.text }}
      span カメラ: 
      select(v-model="selectedVideo" @change="onChange")
        option(disabled value="") Please select one
        option(v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value") {{ video.text }}
      div
        input(v-model="roomName")
        button.button-success(@click="joinRoom") Enter
</template>

<script>
import Logo from '~/components/Logo.vue'
import Peer from 'skyway-js';

export default {
  components: {
    Logo
  },
  data () {
    return {
      APIKey: process.env.SKYWAY_API_KEY,
      selectedAudio: null,
      selectedVideo: null,
      audios: [],
      videos: [],
      localStream: null,
      peer: null,
      peerId: '',
      roomName: ''
    }
  },

  mounted () {
    this.peer = new Peer({ key: this.APIKey, debug: 3 });
    this.peer.on('call', call => {
      call.answer(this.localStream);
      this.connect(call);
    });
    this.getDevices();
  },
  methods: {
    //デバイスへのアクセス
    async getDevices () {
      navigator.mediaDevices.enumerateDevices()
      .then((deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          const deviceInfo = deviceInfos[i]
          if (deviceInfo.kind === 'audioinput') {
            this.audios.push({
              text: deviceInfo.label ||
              `Microphone ${this.audios.length + 1}`,
              value: deviceInfo.deviceId
            })
          } else if (deviceInfo.kind === 'videoinput') {
            this.videos.push({
              text: deviceInfo.label ||
              `Camera  ${this.videos.length - 1}`,
              value: deviceInfo.deviceId
            })
          }
        }
      })
    },
    // カメラ・スピーカー設定
    onChange () {
      if (this.selectedAudio != null && this.selectedVideo != null) this.connectLocalCamera();
    },
    // 設定されたカメラ・スピーカーに接続
    async connectLocalCamera () {
      const constraints = {
        audio: this.selectedAudio ? { deviceId: { exact: this.selectedAudio } } : false,
        video: this.selectedVideo ? { deviceId: { exact: this.selectedVideo } } : false
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      document.getElementById('my-video').srcObject = stream;
      this.localStream = stream;
    },
    async joinRoom () {
      this.peer = await new Peer({ key: this.APIKey, debug: 3 });
      this.peer.on("peerJoin", (peerId) => {
        const sfuRoom = this.peer.joinRoom(this.roomName, { mode: "sfu", stream: this.localStream });
        sfuRoom ? this.enterRoom(sfuRoom) : this.createRoom(sfuRoom);
      }); 
    },
    createRoom (sfuRoom) {
      sfuRoom.on("open", () => {});
    },
    enterRoom (room) {
      room.on("peerJoin", (peerId) => {}) 
    },
    connect: function (call) {
      call.on('stream', stream => {
        const el = document.getElementById('their-video');
        el.srcObject = stream;
        el.play();
      });
    }
  }
}
</script>
