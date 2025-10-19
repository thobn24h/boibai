import { _decorator, Component, Layers, Node, Sprite, SpriteFrame, tween, UITransform, Vec3, screen, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayPlayScene')
export class BoiNgayPlayScene extends Component {

    @property(Node)
    canvasNode: Node = null

    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null

    @property(Node)
    xapBaiNode: Node = null

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

    createNewCardNode(tag: number, moveTime: number, startPos: Vec3, endPos: Vec3) {
      const newNode = new Node()
      newNode.layer = Layers.Enum.UI_2D
      newNode.name = `${tag}`
      
      const sprite = newNode.addComponent(Sprite)
      sprite.spriteFrame = this.queSpriteFrame

      // const newNodeTransform = newNode.getComponent(UITransform)
      // newNodeTransform.setContentSize(nodeSize)

      newNode.setScale(new Vec3(0.55, 0.55, 0.55))
      newNode.setPosition(startPos)

      // add node to the container
      this.canvasNode.addChild(newNode)

      // create animation
      tween(newNode).to(moveTime, endPos).start()
    }

    effectChiabai() {
      const startPos = this.xapBaiNode.getPosition()
      const screenSize = view.getDesignResolutionSize()
      console.log(`screenSize: ${screenSize.width} ${screenSize.height}`)

      if (this.demi <= 7 && this.demPTMang < 1028) {
        if (this.demj <= this.demi) {
          // create new sprite node
          this.createNewCardNode(this.demPTMang, 0.2, 
            startPos, 
            new Vec3((this.demox + 46 * (this.demj - 1)) * 2 - screenSize.width / 2, this.demoy * 2 - screenSize.height / 2, 0)
          )

          this.demj++;
			    this.demPTMang++;
        }
        else {
          this.demj = 1;
          this.demox = this.demox - 23;
          this.demoy = this.demoy - 20;
          this.demi++;
          // create new node
          // create new sprite node
          this.createNewCardNode(this.demPTMang, 0.2, 
            startPos, 
            new Vec3((this.demox + 46 * (this.demj - 1)) * 2 - screenSize.width / 2, this.demoy * 2 - screenSize.height / 2, 0)
          )

          this.demj++;
			    this.demPTMang++;
        }
      }
      else {
        this.unschedule(this.effectChiabai)
      }
    }
}

