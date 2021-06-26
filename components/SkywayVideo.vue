<template lang="pug">
  div
    div.w-screen.text-center.content-start.justify-center.justify-between
      video#my-video.float-left(muted="true" width="500px" height="300px" autoplay playsinline)
      video#their-video(width="500px" height="300px" autoplay playsinline)
    .main.w-screen.text-center
      .audio.mb-4
        span.mr-5 &emsp;マイク:
        select.shadow.border.rounded.py-2.px-3.text-gray-700(class="w-3/5 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/8" v-model="selectedAudio" @change="onChange")
          option(disabled value="") Please select one
          option(v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value") {{ audio.text }}
      .camera.mb-4
        span.mr-5 &emsp;カメラ:
        select.shadow.border.rounded.py-2.px-3.text-gray-700(class="w-3/5 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/8" v-model="selectedVideo" @change="onChange")
          option(disabled value="") Please select one
          option(v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value") {{ video.text }}
      div.mb-4
        label.mr-4 ルーム名：
        input.shadow.appearance-none.border.rounded.py-2.px-3.text-gray-700.leading-tight(class="w-3/5 md:w-1/4 lg:w-1/5 xl:w-1/8 focus:outline-none focus:shadow-outline" v-model="roomName")
      button.mb-12.bg-green-500.text-white.font-bold.py-2.px-4.border-b-4.border-green-700.rounded(class="hover:border-green-500 hover:bg-green-400" @click="joinRoom") Enter
</template>

<script>
import Logo from '~/components/Logo.vue'
import Peer from 'skyway-js';
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

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
      const permit = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .catch(err => { alert("カメラ・マイクの使用が許可されていません。設定を確認してください。"); });
      if (!permit) return;

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
      navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        document.getElementById('my-video').srcObject = stream;
        this.localStream = stream;
      })
    },
    async joinRoom () {
      const sfuRoom = await this.peer.joinRoom(this.roomName, { mode: "sfu", stream: this.localStream });
      sfuRoom.members.push(sfuRoom.peerId);
      console.log(sfuRoom.members);
      this.enterRoom(sfuRoom);
    },
    createRoom (sfuRoom) {
      sfuRoom.on("open", () => {});
    },
    enterRoom (room) {
      room.on("peerJoin", (peerId) => {});
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
