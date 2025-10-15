import { _decorator, Component, director, Label, Node, Sprite } from 'cc';
import dayjs from 'dayjs';

const { ccclass, property } = _decorator;

@ccclass('BoiNgayScene')
export class BoiNgayScene extends Component {

    @property(Label)
    labelBoiNgay: Label = null;

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

      // active card1/card2 for effect
      this.card1.active = true;
      this.card2.active = true;

      

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

