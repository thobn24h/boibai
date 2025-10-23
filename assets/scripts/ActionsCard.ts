import { _decorator, Component, Label, Layers, Node, Sprite, SpriteFrame, Tween, tween, UITransform, Vec2, Vec3, view } from 'cc';
import GameManager from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('ActionsCard')
export class ActionsCard extends Component {

    @property(Node)
    canvasNode: Node = null;

    @property(Node)
    card1: Node = null;

    @property(Node)
    card2: Node = null;

    @property(Node)
    lblGioithieu: Node = null;

    @property(Label)
    lblThongbao: Label = null;
    
    @property(SpriteFrame)
    queSpriteFrame: SpriteFrame = null;

    isTouchEnabled = true;
    numberCards = 0;
    zCards = 0;
    tagCards = 0;
    angleCards = -95;

    protected onLoad(): void {
        this.isTouchEnabled = true;
    }

    start() {

        const contentSize = this.card1.getComponent(UITransform).contentSize;

        const tween1 = tween(this.card1)
            .to(0.3, { position: new Vec3(0, -contentSize.height / 2 - 10, 0) })
            .call(() => {
                this.card1.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)
            .to(0.3, { position: new Vec3(0, contentSize.height / 2 + 10, 0) })
            .call(() => {
                //this.card1.setSiblingIndex(0);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)

        tween(this.card1).repeatForever(tween1).start();

        const tween2 = tween(this.card2)
            .to(0.3, { position: new Vec3(0, contentSize.height / 2 + 10, 0) })
            .call(() => {
                // this.card2.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)
            .to(0.3, { position: new Vec3(0, -contentSize.height / 2 - 10, 0) })
            .call(() => {   
                this.card2.setSiblingIndex(1000);
            })
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .delay(0.1)

        tween(this.card2).repeatForever(tween2).start();

        if (GameManager.instance.getCheckMale()) {
            this.scheduleOnce(this.stopEffectTraobai, 0.7 * 7);
        } else {
            this.scheduleOnce(this.stopEffectTraobai, 0.7 * 9);
        }
    }

    stopEffectTraobai() {
        this.unschedule(this.stopEffectTraobai);
        this.lblGioithieu.active = false;
        Tween.stopAllByTarget(this.card1);
        Tween.stopAllByTarget(this.card2);

        this.card1.setPosition(new Vec3(0, 0, 0));
        this.card2.setPosition(new Vec3(0, 0, 0));

        const contentSize = this.card1.getComponent(UITransform).contentSize;

        tween(this.card1)
            .to(0.5, { angle: 90 })
            .to(0.5, { position: new Vec3(-contentSize.width / 4 - 40, 0, 0) })
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .call(() => {
                // remove card
                this.removeCard();
            })
            .start();

        tween(this.card2)
            .to(0.5, { angle: 90 })
            .to(0.5, { position: new Vec3(contentSize.width / 4 + 40, 0, 0) })
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .start();
    }

    removeCard() {
        Tween.stopAllByTarget(this.card1);
        Tween.stopAllByTarget(this.card2);

        this.card1.destroy();
        this.card2.destroy();

        this.isTouchEnabled = false;

        this.schedule(this.effectsCards, 0.1);
    }

    effectsCards() {
        this.numberCards++;
        this.zCards++;
        this.tagCards++;
        this.angleCards = this.angleCards + 5;

        const screenSize = view.getDesignResolutionSize();

        if (this.numberCards < 33) {

            const quebai = new Node()
            quebai.layer = Layers.Enum.UI_2D
            quebai.name = `${this.tagCards}`

            const sprite = quebai.addComponent(Sprite)
            sprite.spriteFrame = this.queSpriteFrame

            quebai.setPosition(new Vec3(0, -95 * 2, 0))
            quebai.setRotationFromEuler(new Vec3(0, 0, this.angleCards))
            quebai.getComponent(UITransform).setAnchorPoint(new Vec2(0, 0))

            // add node to the container
            this.canvasNode.addChild(quebai)

            // CCSprite *quebai = [CCSprite spriteWithFile:@"Que.png"];
            // [quebai setPosition:CGPointMake(screenSize.width/2, screenSize.height/2 - 95)];
            // quebai.anchorPoint = CGPointMake(0, 0);
            // quebai.rotation = angleCards;
            // [self addChild:quebai z: 0 tag:tagCards];
        }
        else {
            this.unschedule(this.effectsCards);
            this.lblThongbao.node.active = true;
            this.schedule(this.changeThongbao, 2.5);

            // lblThongbao = [CCLabelTTF labelWithString:@"Xin bạn hãy thật thành tâm khi chọn các lá bài!" 
            //                             dimensions:CGSizeMake(160, 140) 
            //                                 alignment:CCTextAlignmentLeft  
            //                                 fontName:@"Marker Felt" 
            //                                 fontSize:16];
            // lblThongbao.position = CGPointMake(90, 50);
            // [self addChild:lblThongbao];
            
            // [self schedule:@selector(changeThongbao:) interval:2.5];
        }
    }

    changeThongbao() {
        this.unschedule(this.changeThongbao);
        this.lblThongbao.string = "Xin mời bạn chọn lá bài thứ nhất.";
        this.isTouchEnabled = true;
    }


    update(deltaTime: number) {
        
    }
}

