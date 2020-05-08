<!-- eslint-disable -->
<template>
  <div id="background1" :style="{ height: scrollerHeight }">
    <div id="form">
      <Form ref="form" :model="form" :rules="ruleCustom" :label-width="0">
        <FormItem label="" prop="phone" style="margin-bottom: 15px;">
          <Input
            clearable
            type="text"
            v-model="form.phone"
            placeholder="输入手机号码">
            <Icon type="ios-call" slot="prefix" color="rgba(220, 220, 220, 0.99)" size="20"/>
          </Input>
        </FormItem>
        <FormItem label="" prop="code" style="margin-bottom: 28px;" id="formBtn">
          <Input
            type="text"
            placeholder="请输入验证码"
            v-model="form.code"
          >
            <Icon type="md-lock" slot="prefix" color="rgba(220, 220, 220, 0.99)" size="18"/>
          </Input>
          <Button type="text" @click="sendMessage">{{sendStatus}}</Button>
        </FormItem>
        <span v-if="show" style="color: #fff;font-size: 12px;position: fixed;margin-top: -20px;text-align: center;margin-left: 10px;">
            {{ count }} 秒后可重新发送
          </span>
        <FormItem style="text-align: center;" id="submitBtn">
          <Button :disabled="loginBtn" @click="handleSubmit('form')" long :loading="btnLoading">
            点击领券
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import http from "./utils/http";
import api from "./utils/api";

export default {
  data() {
    return {
      loginBtn: true,
      btnLoading: false,
      show: false,
      count: "",
      timer: null,
      form: {
        phone: "",
        code: ""
      },
      sendStatus: "发送",
      code: null,
      ruleCustom: {
        // phone: [{ required: true, validator: validatePhone, trigger: "blur" }]
      }
    };
  },
  methods: {
    sendMessage() {
      if (!this.form.phone) {
        this.$Message.error("手机号不能为空");
      } else if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.form.phone)) {
        this.$Message.error("手机号格式不正确");
      } else if (this.form.phone !== "" && this.sendStatus === "发送") {
        let params = this.form;
        http.post(api.sendSms, params).then(res => {
          if (res.data.data.xml.returnstatus === "Success") {
            this.sendStatus = "已发送";
            this.getCode();
            this.code = res.data.data.code;
            this.loginBtn = false;
          } else {
            this.$Message.error(res.data.data.xml.message);
          }
        });
      } else {
        if (this.form.phone !== "") {
          this.$Message.error("手机号不能为空");
        } else {
          this.$Message.error("请倒计时结束之后重新发送");
        }
      }
    },
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = false;
            clearInterval(this.timer);
            this.timer = null;
            this.sendStatus = "发送";
          }
        }, 1000);
      }
    },
    handleSubmit() {
      if (this.form.code && Number(this.form.code) === this.code) {
        let params = { phone_number: this.form.phone };
        this.btnLoading = true;
        http.post(api.savePhone, params).then(res => {
          // console.log(res);
          if (res.data.data.result === true) {
            this.$Message.success("领券成功，请前往 云闪付APP 查看");
            this.btnLoading = false;
            this.form.phone = "";
            this.form.code = "";
            this.loginBtn = true;
            this.show = false;
            this.count = 0;
          } else if (res.data.data.result === "新用户") {
            this.$Message.error("检测到您为新用户，请前往 云闪付APP 注册用户");
            setTimeout(() => {
              window.location.href =
                "https://youhui.95516.com/hybrid_v4/html/help/download.html?code=yhtzc2c";
            }, 2000);
          } else if (res.data.data.result === "领券失败") {
            this.$Message.error("领券失败");
            this.btnLoading = false;
            this.form.phone = "";
            this.form.code = "";
            this.loginBtn = true;
            this.show = false;
            this.count = 0;
          } else if (res.data.data.result === "活动尚未开始") {
            this.$Message.error("活动尚未开始");
            this.btnLoading = false;
            this.form.phone = "";
            this.form.code = "";
            this.loginBtn = true;
            this.show = false;
            this.count = 0;
          } else {
            this.$Message.error("领券失败");
            this.btnLoading = false;
            this.form.phone = "";
            this.form.code = "";
            this.loginBtn = true;
            this.show = false;
            this.count = 0;
          }
        });
      } else {
        this.$Message.error("验证码错误");
      }
    }
  },
  computed: {
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    scrollerHeight: function() {
      return window.innerHeight + "px";
    }
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}

body {
  overflow: hidden;
}

#background1 {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url("http://r.photo.store.qq.com/psc?/V12ol6gx2nrILn/jkqgNxaPJb7RsklupiKoXcRzZr5z5LtAc3auefaHufGjrWZnmslLHQRs7tIifdNpAIlVcbMgz8ad0ndX1oPa3fUmNESEeJbu9GytdmegrPo!/r"); */
  background-image: url("./assets/images/background.jpg");
  background-repeat: no-repeat repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#form {
  margin: 0 auto;
  position: absolute;
  bottom: 24%;
  right: 20%;
  left: 20%;
  display: block;
}

#background1 .ivu-input {
  background-color: #d4b3ac85;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  padding: 4px 35px;
  color: #e5e3e3;
}

#submitBtn .ivu-btn {
  background-color: #993831c7;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  padding: 4px 35px;
  color: #e5e3e3;
}

#formBtn .ivu-btn {
  border: none;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  font-size: 14px;
  position: absolute;
  right: 0;
  margin-top: 1px;
  color: #993831c7;
}

#formBtn .ivu-btn-text:hover {
  background-color: #ffffff00;
}

#background1 input::-webkit-input-placeholder {
  color: rgba(220, 220, 220, 0.99);
  /*font-size: 10px;*/
  /*transform: translate(0, 3px);*/
}

#background1 input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(220, 220, 220, 0.99);
  /*font-size: 9px;*/
}

#background1 input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(220, 220, 220, 0.99);
  /*font-size: 9px;*/
}

#background1 input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(220, 220, 220, 0.99);
  /*font-size: 9px;*/
}
</style>
