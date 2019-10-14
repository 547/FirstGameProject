// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab:{
            default: null,
            type: cc.Prefab,
        },
        maxStarDuration: 0,
        minStarDuration: 0,

        ground:{
            default: null,
            type: cc.Node,
        },
        player:{
            default: null,
            type: cc.Node,
        },
        score:{
            default: 0,
            displayName: "Score (player)",
            tooltip: "the score of player",
        },
        scoreDisplay:{
            default: null,
            type: cc.Label,
        },
        //得分音效
        scoreAudio:{
            default: null,
            type: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.score = 0
        //初始化计数器
        this.timer = 0
        this.starDuration = 0
        this.groundY = this.ground.y + this.ground.height * 0.5
        this.spawnNewStar()
    },

    start () {

    },

    update (dt) {
        //每帧更新计时器。超过限制没有生成新的星星则游戏结束
        if (this.timer > this.starDuration) {
            this.gameOver()
            //禁用gameOver逻辑以避免重复加载场景
            this.enabled = false
            return
        }
        this.timer += dt
    },



    spawnNewStar: function () {
      var newStar = cc.instantiate(this.starPrefab)
      var star = newStar.getComponent("star")
      if (star) {
          star.game = this
      } else {
          cc.log("获取星星组件失败")
      }
      this.node.addChild(newStar)
      newStar.setPosition(this.getNewStarPosition())
      
      // 重置计时器，根据消失时间范围随机取一个值
      this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
      //重置计时器
      this.timer = 0
    },
    getNewStarPosition: function () {
        var randX = 0
        var jumpHeight = 0
        var play = this.player.getComponent("player")
        if (play) {
            jumpHeight = play.jumpHeight
        } else {
            jumpHeight = 60
            cc.log("获取组件出错")
        }
        var randY = this.groundY + Math.random() * jumpHeight + 50
        var maxX = this.node.width * 0.5
        randX = (Math.random() - 0.5) * 2 * maxX
        var result = cc.v2(randX, randY)
        return result
    },
    gainScore: function () {
        this.score += 1
        this.scoreDisplay.string = "Score:" + this.score
        this.playGainScoreAudio()
    },
    playGainScoreAudio: function () {
        cc.audioEngine.playEffect(this.scoreAudio, false)
    },
    gameOver: function () {
        cc.log("game over")
        //palyer停止所有的动作
        this.player.stopAllActions()
        //director是管理游戏逻辑流程的单例对象 loadScene方法是重新加载game场景 = 游戏重新开始
        cc.director.loadScene("Game")
    },
});
