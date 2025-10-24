import { _decorator, Component, director, Label, Node, Sprite, Tween, tween, UITransform, Vec3 } from 'cc';
import * as dayjs from 'dayjs';

const { ccclass, property } = _decorator;

@ccclass('BoiNgayScene')
export class BoiNgayScene extends Component {

    @property(Node)
    canvasNode: Node = null;

    @property(Label)
    labelBoiNgay: Label = null;

    @property(Node)
    btnTraoBai: Node = null;

    @property(Label)
    lblDem: Label = null;

    @property(Node)
    lblThongbaoTraobai: Node = null;

    @property(Node)
    controlButtonLayoutNode: Node = null;

    @property(Node)
    card1: Node = null;

    @property(Node)
    card2: Node = null;

    flag = false;
    flagDangtraobai = false;
    ngay = 0;

    temp = 0; // danh dau z cua la bai khi trao bai

    protected onLoad(): void {
        const now = dayjs.default();

        // Lấy ngày hiện tại trong tháng (1-31)
        this.ngay = now.date();

        // Mảng tên thứ tiếng Việt
        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayOfWeek = daysOfWeek[now.day()];

        // Định dạng: Thứ, ngày, tháng, năm
        const formattedDate = `${dayOfWeek}, ngày ${now.format('DD')} tháng ${now.format('MM')} năm ${now.format('YYYY')}`;
        this.labelBoiNgay.string = formattedDate;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    beginEffectTraobai() {
      console.log(`beginEffectTraobai`)

      // hide message
      this.lblThongbaoTraobai.active = false;
      // hide menu back / next 
      // this.controlButtonLayoutNode.active = false;

      const centerPos = this.btnTraoBai.getPosition();
      const cardSize = this.btnTraoBai.getComponent(UITransform).contentSize;

      // active card1/card2 for effect
      this.card1.active = true;
      this.card1.setPosition(centerPos)
      this.card2.active = true;
      this.card2.setPosition(centerPos)

      // show label dem
      this.lblDem.string = "";
      this.lblDem.node.active = true;

      // play effect card 1
      const card1Sequence = tween(this.card1)
        .by(0.3, new Vec3(0, -cardSize.height / 2 - 5, 0))
        .call(() => {
          this.changeZCard();
        })
        .to(0.3, centerPos)
        .delay(0.1)
        .by(0.3, new Vec3(0, cardSize.height / 2 + 5, 0))
        .call(() => {
          this.changeZCard();
        })
        .to(0.3, centerPos)
        .delay(0.1);

      tween(this.card1).repeatForever(card1Sequence).start()

      // play effect card 2
      const card2Sequence = tween(this.card2)
        .by(0.3, new Vec3(0, cardSize.height / 2 + 5, 0))
        .to(0.3, centerPos)
        .delay(0.1)
        .by(0.3, new Vec3(0, -cardSize.height / 2 - 5, 0))
        .to(0.3, centerPos)
        .delay(0.1);

      tween(this.card2).repeatForever(card2Sequence).start();

      this.scheduleOnce(this.stopEffectTraobai, 0.7 * this.ngay);
    }

    stopEffectTraobai() {
      Tween.stopAllByTarget(this.card1);
      Tween.stopAllByTarget(this.card2);

      const centerPos = this.btnTraoBai.getPosition();
      this.card1.setPosition(centerPos)
      this.card2.setPosition(centerPos)

      this.flag = true;
      this.lblDem.string = 'Xin mời bạn vào bói!'
    }

    clickBack() {
      director.loadScene("menuScene")
    }

    clickNext() {
      if (this.flag) {
        director.loadScene("BoiNgayPlayScene")
      }
      else if (!this.flagDangtraobai) {
        // this.lblThongbaoTraobai.active = true;
      }
    }

    changeZCard() {
      this.temp++;
      this.lblDem.string = `Tráo lần ${this.temp}`;
      if (this.temp % 2 != 0) {
        this.card2.setSiblingIndex(100);
        this.card1.setSiblingIndex(101);
      } else {
        this.card1.setSiblingIndex(100);
        this.card2.setSiblingIndex(101);
      }
    }
    
}

