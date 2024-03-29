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
        pickRadius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    update (dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked()
            return
        }
        this.updateStarOpacity()
    },




    getPlayerDistance: function () {
      var playerPos = this.game.player.getPosition()
      var distance = this.node.position.sub(playerPos).mag()
      return distance
    },
    onPicked: function () {
        this.game.spawnNewStar()
        this.game.gainScore()
        this.node.destroy()  
    },
    updateStarOpacity: function () {
        //根据geme中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration
        var minOpacity = 50
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
    },
});
