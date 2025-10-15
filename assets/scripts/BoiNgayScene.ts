import { _decorator, Component, director, Label, Node, Sprite, tween, UITransform, Vec3 } from 'cc';
import dayjs from 'dayjs';

const { ccclass, property } = _decorator;

@ccclass('BoiNgayScene')
export class BoiNgayScene extends Component {

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
        const now = dayjs();

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
      // hide message
      this.lblThongbaoTraobai.active = false;
      // hide menu back / next 
      this.controlButtonLayoutNode.active = false;

      const centerPos = this.btnTraoBai.getPosition();
      const cardSize = this.btnTraoBai.getComponent(UITransform).contentSize;

      // active card1/card2 for effect
      this.card1.active = true;
      this.card1.setPosition(centerPos)
      this.card2.active = true;
      this.card2.setPosition(centerPos)

      // show label dem
      this.lblDem.string = "0";
      this.lblDem.node.active = true;

      // play effect
      tween(this.card1).by(0.3, new Vec3(0, -cardSize.height / 2 - 5, 0)).call(() => {
        
      }).start();


    }

    stopEffectTraobai() {

    }

    clickBack() {
      director.loadScene("menuScene")
    }

    clickNext() {
      if (this.flag) {
        director.loadScene("menuScene")
      }
      else if (!this.flagDangtraobai) {
        this.lblThongbaoTraobai.active = true;
      }
    }
    
}

