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
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        //跳跃音效
        jumpAudio:{
            default: null,
            type: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.jumpAction = this.setJumpAction()
        this.node.runAction(this.jumpAction)

        this.accLeft = false
        this.accRight = false
        this.xSpeed = 0

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    },
    start () {

    },

    update (dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt
        }
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
        }
        this.node.x += this.xSpeed * dt
    },




    setJumpAction: function () {
      var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCircleActionOut())
      var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCircleActionIn())
      //添加一个回调函数，用于动作结束的时候调用 = (使用回调函数的原因是因为callFunc返回的是一个action， 正好可以将这个action用到repeatForever方法上))
      var callback = cc.callFunc(this.playJumpAudio, this)
      //不断重复，而且每次完成落地动作后调用回调方法来播放声音
      var action = cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback))
      return action  
    },
    playJumpAudio: function () {
        cc.audioEngine.playEffect(this.jumpAudio, false)
    },
    onKeyDown (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true
                break;
            case cc.macro.KEY.s:
                this.accRight = true
                break;
            default:
                break;
        }
    },
    onKeyUp (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false
                break;
            case cc.macro.KEY.s:
                this.accRight = false
                break;
            default:
                break;
        }
    },
});
