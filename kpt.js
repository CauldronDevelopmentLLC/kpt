import {createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


let kpt = [
  {
    "strong": "kk", "weak": "k",
    "examples": [
      ["takki", "takin"],
      ["liikkua", "liikun"],
      ["hake", "hakkeen"],
      ["pakata", "pakkaan"]]
  },
  {
    "strong": "pp", "weak": "p",
    "examples": [
      ["kaappi", "kaapin"],
      ["hyppiä", "hypin"],
      ["opas", "oppaan"],
      ["napata", "nappaan"]]
  },
  {
    "strong": "tt", "weak": "t",
    "examples": [
      ["tyttö", "tytön"],
      ["saattaa", "saatan"],
      ["kate", "katteen"],
      ["mitata", "mittaan"]]
  },
  {
    "strong": "k", "weak": "",
    "examples": [
      ["reikä", "reiän"],
      ["hakea", "haen"],
      ["aie", "aikeen"],
      ["maata", "makaan"]]
  },
  {
    "strong": "p", "weak": "v",
    "examples": [
      ["sopu", "sovun"],
      ["viipyä", "viivyn"],
      ["taive", "taipeen"],
      ["levätä", "lepään"]]
  },
  {
    "strong": "t", "weak": "d",
    "examples": [
      ["satu", "sadun"],
      ["pitää", "pidän"],
      ["keidas", "keitaan"],
      ["kohdata", "kohtaan"]]
  },
  {
    "strong": "nk", "weak": "ng",
    "examples": [
      ["aurinko", "auringon"],
      ["tunkea", "tungen"],
      ["rengas", "renkaan"],
      ["hangata", "hankaan"]]
  },
  {
    "strong": "mp", "weak": "mm",
    "examples": [
      ["kumpi", "kumman"],
      ["empiä", "emmin"],
      ["lumme", "lumpeen"],
      ["kammata", "kampaan"]]
  },
  {
    "strong": "lt", "weak": "ll",
    "examples": [
      ["ilta", "illan"],
      ["yltää", "yllän"],
      ["sivellin", "siveltimen"],
      ["vallata", "valtaan"]]
  },
  {
    "strong": "nt", "weak": "nn",
    "examples": [
      ["hento", "hennon"],
      ["myöntää", "myönnän"],
      ["vanne", "vanteen"],
      ["rynnätä", "ryntään"]]
  },
  {
    "strong": "rt", "weak": "rr",
    "examples": [
      ["virta", "virran"],
      ["kertoa", "kerron"],
      ["porras", "portaan"],
      ["verrata", "vertaan"]]
  }
]


createApp({
  data() {
    return {
      kpt,
      button: 'Start Game',
      strong: false,
      choice: {},
      score: 0,
      failed: false,
      current_time: 0,
      game_start: 0,
      turn_start: 0,
      max_game_time: 60,
      max_turn_time: 15,
      audio: {
        fail: new Audio('fail.wav'),
        success: new Audio('success.wav')
      }
    }
  },


  computed: {
    turn_progress() {
      if (!this.turn_start) return 0
      return ((1 - this.turn_time / this.max_turn_time) * 100).toFixed(2) + '%'
    },


    game_progress() {
      if (!this.game_start) return 0
      return ((1 - this.game_time / this.max_game_time) * 100).toFixed(2) + '%'
    },


    turn_timedout() {return this.turn_time == this.max_turn_time},
    game_timedout() {return this.game_time == this.max_game_time},


    turn_time_msg() {
      if (this.turn_timedout) return 'Timed out'
      return this.turn_time.toFixed(0) + 's'
    },


    turn_time() {
      if (!this.turn_start) return 0
      let t = (this.current_time - this.turn_start) / 1000
      return t < this.max_turn_time ? t : this.max_turn_time
    },


    game_time() {
      if (!this.game_start) return 0
      let t = (this.current_time - this.game_start) / 1000
      return t < this.max_game_time ? t : this.max_game_time
    }
  },


  mounted() {this.update_timer()},


  methods: {
    play_audio(name) {
      let audio = this.audio[name]
      audio.pause()
      audio.currentTime = 0
      audio.play()
    },


    update_timer() {
      this.current_time = new Date().getTime()

      if (this.turn_start && this.turn_timedout) {
        this.turn_start = 0
        this.wrong()
      }

      if (this.game_start && this.game_timedout)
        this.end_game()

      setTimeout(this.update_timer, 125)
    },


    start_game() {
      this.score = 0
      this.game_start = new Date().getTime()
      this.next_turn()
    },


    end_game() {
      this.game_start = 0
      this.turn_start = 0
      this.button = 'Play Again'
    },


    check_answer(e) {
      let guess = e.target.value.toLowerCase().trim()
      let answer = this.choice[this.strong ? 'strong' : 'weak'].trim()
      if (answer == guess) this.correct()
      else this.wrong()
    },


    next_turn() {
      this.strong = 0.5 < Math.random()

      let index = parseInt(Math.floor(Math.random() * this.kpt.length))
      let choice = this.choice = this.kpt[index]

      this.failed = false
      this.$refs.input.value = ''
      this.$refs.input.focus()
      this.turn_start = new Date()
    },


    correct() {
      this.score +=
        Math.floor(Math.pow(0.01 + this.max_turn_time / this.turn_time, 0.8))

      this.play_audio('success')
      this.next_turn()
    },


    wrong() {
      this.play_audio('fail')
      this.failed = true
      this.end_game()
    }
  }
}).mount('#app')
