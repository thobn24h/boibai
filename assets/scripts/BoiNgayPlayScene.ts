import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayPlayScene')
export class BoiNgayPlayScene extends Component {

    @property(Node)
    canvasNode: Node = null

    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null

    numberCardsDuoiFliped = 0;
		flagNext = false;
		idDoi1 = 0;
		idDoi2 = 0;
		idDoi3 = 0;

    demox = 162;
		demoy = 350;
		demi = 1;
		demj = 1;
		demPTMang = 1000;

    start() {
      this.schedule(this.effectChiabai, 0.2)
    }

    update(deltaTime: number) {
        
    }

    effectChiabai() {
      if (this.demi <= 7 && this.demPTMang < 1028) {
        if (this.demj <= this.demi) {
          // create new sprite node

          this.demj++;
			    this.demPTMang++;
        }
        else {
          this.demj = 1;
          this.demox = this.demox - 23;
          this.demoy = this.demoy - 20;
          this.demi++;
          // create new node

          this.demj++;
			    this.demPTMang++;
        }
      }
      else {
        this.unschedule(this.effectChiabai)
      }
    }
}

