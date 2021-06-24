<template>
  <section class="container">
    <div>
      <logo/>
      <video id="their-video" width="200" autoplay playsinline></video>
      <video id="my-video" muted="true" width="200" autoplay playsinline></video>

      <div class="main">
        <h2>Nuxt.js + SkyWayのビデオチャット</h2>
        マイク:
        <select v-model="selectedAudio" @change="onChange">
          <option disabled value="">Please select one</option>
          <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
            {{ audio.text }}
          </option>
        </select>

        カメラ: 
        <select v-model="selectedVideo" @change="onChange">
          <option disabled value="">Please select one</option>
          <option v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value">
            {{ video.text }}
          </option>
        </select>

        <div>
          <p>Your id: <span id="my-id">{{peerId}}</span></p>
          <p>他のブラウザでこのIDをコールしましょう。</p>
          <h3>コールする</h3>
          <input v-model="roomName">
          <button @click="joinRoom" class="button--green">Enter</button>
        </div>
      </div>

    </div>
  </section>
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
      selectedAudio: '',
      selectedVideo: '',
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
    //デバイスへのアクセス
    // navigator.mediaDevices.enumerateDevices()
    // .then((deviceInfos) => {
    //   for (let i = 0; i !== deviceInfos.length; ++i) {
    //     const deviceInfo = deviceInfos[i]
    //     if (deviceInfo.kind === 'audioinput') {
    //       this.audios.push({
    //         text: deviceInfo.label ||
    //         `Microphone ${this.audios.length + 1}`,
    //         value: deviceInfo.deviceId
    //       })
    //     } else if (deviceInfo.kind === 'videoinput') {
    //       this.videos.push({
    //         text: deviceInfo.label ||
    //         `Camera  ${this.videos.length - 1}`,
    //         value: deviceInfo.deviceId
    //       })
    //     }
    //   }
    // })
  },
  methods: {
    async getDevices () {
      const defaultVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // デバイスの一覧を取得
      const devices = await navigator.mediaDevices.enumerateDevices();

      // 任意のデバイスを指定
      const newVideoInputDevice = devices.find(
        (device) => device.kind === "videoinput"
      );
      const self = this;
      console.log(newVideoInputDevice)
      this.localStream = await navigator.mediaDevices.getUserMedia({
        // this.videos.push(newVideoInputDevice)
        video: {
          deviceId: newVideoInputDevice.deviceId,
        },
      });
    },
    // カメラ・スピーカー設定
    onChange () {
      console.log(this.selectedAudio);
      if (this.selectedAudio != '' && this.selectedVideo != '') this.connectLocalCamera();
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
      console.log(this.localStream)
    },
    async joinRoom () {
      this.peer = await new Peer({ key: this.APIKey, debug: 3 });
      this.peer.on("peerJoin", (peerId) => {
        const sfuRoom = this.peer.joinRoom(this.roomName, { mode: "sfu", stream: this.localStream });
      }); 
      // sfuRoom ? this.enterRoom() : this.createRoom();
    },
    createRoom () {
      sfuRoom.on("open", () => {});
    },
    enterRoom () {
      room.on("peerJoin", (peerId) => {}) 
    },

  //   makeCall: function () {
  //     console.log('makeCall');
  //     const call = this.peer.call(this.calltoid, this.localStream);
  //     this.connect(call);
  //   },

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
